import cron from "node-cron";
import { Post } from "../Models/Post.js";
import { Account } from "../Models/Account.js";
import zernio from "../config/zernio.js";
import { ActivityLog } from "../Models/ActivityLog.js";
import axios from "axios";
import { Buffer } from "buffer";

const uploadMediaToZernio = async (mediaUrl: string, mediaType?: "image" | "video") : Promise<string> => {
    const parsedUrl = new URL(mediaUrl);
    const fileName = parsedUrl.pathname.split("/").pop() || `post-media.${mediaType === "video" ? "mp4" : "jpg"}`;
    const contentType = mediaType === "video" ? "video/mp4" : "image/jpeg";

    const { data: presign } = await zernio.media.getMediaPresignedUrl({
        body: {
            filename: fileName,
            contentType,
        },
    });

    const mediaResponse = await axios.get(mediaUrl, { responseType: "arraybuffer" });

    await axios.put(presign.uploadUrl, Buffer.from(mediaResponse.data) , {
        headers: {
            "Content-Type": mediaResponse.headers["content-type"] || contentType,
        },
        maxBodyLength: Infinity,
        maxContentLength: Infinity,
    })
    return presign.publicUrl;
}



export const initScheduler = () => {
    cron.schedule("* * * * *", async () => {
        try {
            const now = new Date();
            const postsToPublish = await Post.find({status: "scheduled",
            scheduledFor: {$lte: now}});

            for (const post of postsToPublish) {
                try {
                    const postPlatforms = (post.platforms || []) as string[];
                    const platformMatch = postPlatforms.includes("instagram")
                        ? (["instagram", "instagram_business"] as const)
                        : postPlatforms;

                    const accounts = await Account.find({
                        user: post.user,
                        platform: {$in: platformMatch as any},
                        status: "connected",
                        zernioAccountId: {$exists: true},
                    })

                    if(accounts.length === 0) {
                        console.log(`No connected accounts found for post ${post._id}. Skipping...`);
                        continue;
                    }
                    const zernioPlatforms = accounts.map((acc) => ({
                        platform: acc.platform as any,
                        accountId: acc.zernioAccountId!
                    }))

                    let publishMediaUrls: string[] | undefined;
                    if(post.mediaUrl) {
                        const zernioMediaUrl = await uploadMediaToZernio(post.mediaUrl, post.mediaType || undefined);
                        publishMediaUrls = [zernioMediaUrl];
                    }

                    const formattedMedia = publishMediaUrls && publishMediaUrls.length > 0
                        ? publishMediaUrls.map((urlStr) => {
                            const isVideo = urlStr.toLowerCase().match(/\.(mp4|mov|avi|mkv)$/);
                            return {
                                url: urlStr,
                                type: isVideo ? "video" : "image"
                            };
                        }) : [];

                    const payload = {
                        content: post.content,
                        publishNow: true,
                        platforms: zernioPlatforms,
                        mediaItems: formattedMedia,
                    
                    };
                    console.log(`Publishing post ${post._id} to Zernio with media:
                    ${post.mediaUrl || "None"}`);

                    const response = await axios.post("https://zernio.com/api/v1/posts", payload, {
                        headers: {
                            Authorization: `Bearer ${process.env.ZERNIO_API_KEY}`,
                            "Content-Type": "application/json"
                        }
                    })

                    const publishedPost = (response.data as any)?.post || response.data;

                    if(!publishedPost) {
                        throw new Error(`Failed to get post object from Zernio response`);
                    }

                    console.log(`Zernio post created: ${publishedPost._id || publishedPost.id} || 'Success'`);
                    await post.updateOne({
                        $set: {
                            status: "published",
                            publishedAt: new Date()
                        }
                    });
                    await ActivityLog.create({
                        user: post.user,
                        actionType: "POST_PUBLISHED",
                        description: `Published post to ${accounts.map((a) => a.platform).join(", ")} `,
                        relatedPost: post._id,
                    })
                } catch (err: any) {
                    console.error(`Failed to publish post ${post._id}:`, err?.response?.
                    data || err?.message); 
                    await post.save();    
                }
            }
            if(postsToPublish.length > 0) {
                console.log(`Published ${postsToPublish.length} posts at ${now.toISOString()}`);
            }
        } catch (error) {
            console.error("Error in scheduler:", error);
        }
    })
    console.log("Scheduler initialized and running every minute.");
}