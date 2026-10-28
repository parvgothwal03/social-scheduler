import mongoose, { Schema, Document } from 'mongoose';

export interface IAutoReplyRule {
  keyword: string;
  replyType: 'comment' | 'dm' | 'both';
  replyText?: string;
  publicReplyText?: string;
  dmReplyText?: string;
}

export interface IAutoReplySettings extends Document {
  userId: mongoose.Types.ObjectId;
  accountId: string; // Added to interface
  isEnabled: boolean;
  mode: 'keyword' | 'ai';
  aiPrompt?: string;
  enableDmFollowUp: boolean; // Flag to toggle sending DMs along with AI replies
  rules: IAutoReplyRule[];
  createdAt: Date;
  updatedAt: Date;
}

const AutoReplyRuleSchema = new Schema({
  keyword: { type: String, required: true, lowercase: true, trim: true },
  replyType: {
    type: String,
    enum: ['comment', 'dm', 'both'],
    default: 'comment'
  },
  replyText: { type: String, trim: true },
  publicReplyText: { type: String, trim: true },
  dmReplyText: { type: String, trim: true },
});

const AutoReplySettingsSchema: Schema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    accountId: { type: String, required: true, index: true },
    isEnabled: { type: Boolean, default: false },
    mode: { type: String, enum: ['keyword', 'ai'], default: 'keyword' },
    aiPrompt: { 
      type: String, 
      default: "Respond warmly and helpfully. Keep responses under 25 words."
    },
    enableDmFollowUp: { type: Boolean, default: false },
    rules: [AutoReplyRuleSchema],
  },
  { timestamps: true }
);

// Compound index so a user can have settings for different accounts without colliding
AutoReplySettingsSchema.index({ userId: 1, accountId: 1 }, { unique: true });

export default mongoose.model<IAutoReplySettings>('AutoReplySettings', AutoReplySettingsSchema);