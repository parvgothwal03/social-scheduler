import mongoose from "mongoose";

const postSchema = new mongoose.Schema({
    user: {type: mongoose.Schema.Types.ObjectId, ref: "User", required: true},
    content: {type: String, required: true},
    mediaUrl: {type: String},
    mediaType: {type: String, enum: ["image", "video"]},
    platforms: [{type:String, enum: ["twitter", "linkedin", "facebook", "instagram",
    "facebook_page", "linkedin_page", "instagram_business"]}],
    scheduledFor: {type: Date, required: true},
    status: {type: String, enum: ["scheduled", "published", "failed", "draft"], default: "scheduled"},
    // --- Analytics Metrics (Defaults to 0 for old posts) ---
    impressions: { type: Number, default: 0 },
    likes: { type: Number, default: 0 },
    comments: { type: Number, default: 0 },
    shares: { type: Number, default: 0 },
}, {timestamps: true})

export interface IPost extends Document {
  userId: mongoose.Types.ObjectId;
  content: string;
  mediaUrl?: string;
  mediaType?: 'image' | 'video' | 'gif';
  platforms: string[]; // e.g., ['instagram', 'linkedin']
  status: 'draft' | 'scheduled' | 'published' | 'failed';
  scheduledFor?: Date;
  publishedAt?: Date;
  // Analytics fields
  impressions: number;
  likes: number;
  comments: number;
  shares: number;
  createdAt: Date;
  updatedAt: Date;
  
}

export const Post = mongoose.model("Post", postSchema);