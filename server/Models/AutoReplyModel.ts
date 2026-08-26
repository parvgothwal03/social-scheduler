import mongoose, { Schema, Document } from 'mongoose';

export interface IAutoReplyRule {
  keyword: string;
  replyText: string;
}

export interface IAutoReplySettings extends Document {
  userId: mongoose.Types.ObjectId;
  isEnabled: boolean;
  mode: 'keyword' | 'ai';
  aiPrompt?: string;
  rules: IAutoReplyRule[];
  createdAt: Date;
  updatedAt: Date;
}

const AutoReplyRuleSchema = new Schema({
  keyword: { type: String, required: true, lowercase: true, trim: true },
  replyText: { type: String, required: true, trim: true },
});

const AutoReplySettingsSchema: Schema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true, unique: true, index: true },
    accountId: { type: String, required: true, index: true },
    isEnabled: { type: Boolean, default: false },
    mode: { type: String, enum: ['keyword', 'ai'], default: 'keyword' },
    aiPrompt: { 
      type: String, 
      default: "Respond warmly and helpfully. Keep responses under 25 words and include a link if asked for info." 
    },
    rules: [AutoReplyRuleSchema],
  },
  { timestamps: true }
);

export default mongoose.model<IAutoReplySettings>('AutoReplySettings', AutoReplySettingsSchema);