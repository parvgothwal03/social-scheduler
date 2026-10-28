import { AuthRequest } from "../Middleware/authMiddleware.js";
import { Response } from "express";
import { GoogleGenAI } from "@google/genai";
import axios from "axios";
import cloudinary from "../config/cloudinary.js";
import { Generation } from "../Models/Generation.js";
import { Post } from "../Models/Post.js";
import multer from "multer";

// Helper to poll Leonardo AI
const pollLeonardoJob = async (generationId: string, apiKey: string): Promise<string> => {
  const maxRetries = 20;
  const delay = 5000;

  for (let i = 0; i < maxRetries; i++) {
    try {
      const response = await axios.get(
        `https://cloud.leonardo.ai/api/rest/v1/generations/${generationId}`,
        {
          headers: {
            accept: "application/json",
            authorization: `Bearer ${apiKey}`,
          },
        }
      );

      const generation = response.data.generations_by_pk;
      if (generation.status === "COMPLETE") {
        if (generation.generated_images && generation.generated_images.length > 0) {
          return generation.generated_images[0].url;
        }
        throw new Error("Generation completed but no images found.");
      }
      if (generation.status === "FAILED") {
        throw new Error("Leonardo AI generation failed.");
      }
    } catch (err: any) {
      console.error("Error polling Leonardo AI:", err?.response?.data?.message || err.message);
      throw err;
    }

    await new Promise((resolve) => setTimeout(resolve, delay));
  }
  throw new Error("Leonardo AI generation timed out after multiple attempts.");
};

// Generate Post
// POST /api/posts/generate
export const generatePost = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ message: "Not authorized" });
      return;
    }
    const { prompt, tone, generateImage } = req.body;

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      res.status(400).json({ message: "GEMINI_API_KEY is not set in environment variables" });
      return;
    }

    const ai = new GoogleGenAI({ apiKey });

    // Generate text content
    const textResponse = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: `Generate a social media post with the following prompt: 
        "${prompt}". Tone: ${tone}.
        Include relevant hashtags.
        Format the response as a JSON with "content" and "imagePrompt" fields.
        The "imagePrompt" should be a highly descriptive prompt for an image generator
        that complements the post content.`,
    });

    let content = "";
    let imagePrompt = prompt;

    try {
      const rawText = textResponse.text || "";
      const jsonMatch = rawText.match(/\{[\s\S]*\}/);
      const data = jsonMatch ? JSON.parse(jsonMatch[0]) : { content: rawText, imagePrompt: prompt };
      content = data.content;
      imagePrompt = data.imagePrompt;
    } catch (e) {
      content = textResponse.text || "";
    }

    let mediaUrl = "";
    if (generateImage) {
      try {
        const leonardoKey = process.env.LEONARDO_API_KEY;
        if (leonardoKey) {
          const leoResponse = await axios.post(
            "https://cloud.leonardo.ai/api/rest/v2/generations",
            {
              public: false,
              model: "gpt-image-1.5",
              parameters: {
                quality: "LOW",
                prompt: imagePrompt,
                quantity: 1,
                width: 1024,
                height: 1024,
                prompt_enhance: "OFF",
              },
            },
            {
              headers: {
                accept: "application/json",
                authorization: `Bearer ${leonardoKey}`,
                "content-type": "application/json",
              },
            }
          );

          const generationId = leoResponse?.data?.generate?.generationId;
          const tempUrl = await pollLeonardoJob(generationId, process.env.LEONARDO_API_KEY || "");

          const uploadResult = await cloudinary.uploader.upload(tempUrl, {
            folder: "ai-generation",
          });
          mediaUrl = uploadResult.secure_url;
        }
      } catch (err: any) {
        console.error("Error generating image with Leonardo AI:", err);
      }
    }

    const generation = await Generation.create({
      user: req.user._id,
      prompt,
      content,
      mediaUrl,
      mediaType: mediaUrl ? "image" : undefined,
      tone,
    });

    res.json(generation);
  } catch (error: any) {
    console.error("Error generating post:", error?.response?.data || error.message);
    res.status(500).json({ message: error?.message || "Server error" });
  }
};

// Get generations
// GET /api/posts/generations
export const getGenerations = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ message: "Not authorized" });
      return;
    }
    const generations = await Generation.find({ user: req.user._id }).sort({ createdAt: -1 });
    res.json(generations);
  } catch (error: any) {
    res.status(500).json({ message: error?.message || "Server error" });
  }
};

// Get Post
// GET /api/posts
export const getPost = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ message: "Not authorized" });
      return;
    }
    const posts = await Post.find({ user: req.user._id }).sort({ scheduledFor: 1 });
    res.json(posts);
  } catch (error: any) {
    res.status(500).json({ message: error?.message || "Server error" });
  }
};

// Schedule Post
// POST /api/posts
export const schedulePost = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ message: "Not authorized" });
      return;
    }
    const { content, platforms, scheduledFor, status } = req.body;

    let parsedPlatforms = platforms;
    if (typeof platforms === "string") {
      try {
        parsedPlatforms = JSON.parse(platforms);
      } catch (e) {
        parsedPlatforms = platforms.split(",");
      }
    }

    let mediaUrl: string | undefined = req.body.mediaUrl;
    let mediaType: "image" | "video" | undefined = req.body.mediaType;

    if (req.file) {
      const result = await new Promise<any>((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          { resource_type: "auto", folder: "scheduled-posts" },
          (error, result) => {
            if (error) reject(error);
            else resolve(result);
          }
        );
        stream.end(req.file!.buffer);
      });
      mediaUrl = result.secure_url;
      mediaType = result.resource_type === "video" ? "video" : "image";
    }

    const post = await Post.create({
      user: req.user._id,
      content,
      platforms: parsedPlatforms,
      mediaUrl,
      mediaType,
      scheduledFor,
      status,
    });
    res.status(201).json(post);
  } catch (error: any) {
    res.status(500).json({ message: error?.message || "Server error" });
  }
};

// Reschedule Post (Drag-and-Drop)
// PATCH /api/posts/:id/reschedule
export const reschedulePost = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ message: "Not authorized" });
      return;
    }

    const { id } = req.params;
    const { scheduledFor } = req.body;

    if (!scheduledFor) {
      res.status(400).json({ message: "scheduledFor date is required" });
      return;
    }

    const targetDate = new Date(scheduledFor);
    if (isNaN(targetDate.getTime())) {
      res.status(400).json({ message: "Invalid date format" });
      return;
    }

    if (targetDate.getTime() <= Date.now()) {
      res.status(400).json({ message: "Cannot reschedule a post to a past date/time" });
      return;
    }

    const post = await Post.findOne({ _id: id, user: req.user._id });
    if (!post) {
      res.status(404).json({ message: "Post not found" });
      return;
    }

if (post.status === "published") {
      res.status(400).json({
        message: `Cannot reschedule a post that is already ${post.status}`,
      });
      return;
    }

    post.scheduledFor = targetDate;
    if (post.status === "failed") {
      post.status = "scheduled";
    }

    await post.save();

    res.status(200).json({
      success: true,
      message: "Post rescheduled successfully",
      data: post,
    });
  } catch (error: any) {
    res.status(500).json({ message: error?.message || "Server error" });
  }
};