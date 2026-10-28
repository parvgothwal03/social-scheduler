import React, { useState } from "react";
import { ThumbsUp, MessageSquare, Repeat2, Send, Globe, MoreHorizontal } from "lucide-react";

interface LinkedInMockupProps {
  content: string;
  mediaUrl?: string | null;
  mediaType?: "image" | "video";
  authorName?: string;
  headline?: string;
  avatarUrl?: string;
}

export const LinkedInMockup: React.FC<LinkedInMockupProps> = ({
  content,
  mediaUrl,
  mediaType = "image",
  authorName = "Your Name",
  headline = "Full-Stack Developer • Building Next-Gen Web Solutions",
  avatarUrl,
}) => {
  const [expanded, setExpanded] = useState(false);
  const shouldTruncate = content.length > 210 && !expanded;

  return (
    <div className="w-full max-w-[420px] bg-white border border-slate-200 rounded-xl overflow-hidden shadow-xs text-xs">
      {/* Header */}
      <div className="flex items-start justify-between p-3.5 pb-2">
        <div className="flex items-center gap-2.5">
          <img
            src={avatarUrl || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100"}
            alt="Author"
            className="size-10 rounded-full object-cover shrink-0"
          />
          <div>
            <div className="flex items-center gap-1">
              <span className="font-bold text-slate-900 leading-tight">{authorName}</span>
              <span className="text-slate-400 text-[10px]">• 1st</span>
            </div>
            <p className="text-[10px] text-slate-500 line-clamp-1 max-w-[240px]">{headline}</p>
            <div className="flex items-center gap-1 text-[10px] text-slate-400 mt-0.5">
              <span>Just now</span>
              <span>•</span>
              <Globe className="size-3" />
            </div>
          </div>
        </div>
        <MoreHorizontal className="size-4 text-slate-500 cursor-pointer" />
      </div>

      {/* Post Text */}
      <div className="px-3.5 py-1 text-slate-800 leading-relaxed whitespace-pre-line break-words text-[12px]">
        {shouldTruncate ? (
          <>
            {content.slice(0, 210)}
            <button
              type="button"
              onClick={() => setExpanded(true)}
              className="text-slate-500 font-semibold hover:text-blue-600 ml-1 cursor-pointer"
            >
              ...see more
            </button>
          </>
        ) : (
          content || "Share your thoughts, learnings, or updates with your professional network..."
        )}
      </div>

      {/* Optional Media */}
      {mediaUrl && (
        <div className="mt-2.5 w-full bg-slate-100 max-h-72 overflow-hidden flex items-center justify-center border-y border-slate-100">
          {mediaType === "video" ? (
            <video src={mediaUrl} className="w-full max-h-72 object-cover" controls />
          ) : (
            <img src={mediaUrl} alt="media preview" className="w-full max-h-72 object-cover" />
          )}
        </div>
      )}

      {/* Reactions Bar */}
      <div className="px-3.5 py-2 flex items-center justify-between text-[11px] text-slate-500 border-b border-slate-100">
        <div className="flex items-center gap-1">
          <span className="flex -space-x-1">
            <span className="size-4 rounded-full bg-blue-600 text-white flex items-center justify-center text-[8px]">
              👍
            </span>
            <span className="size-4 rounded-full bg-red-500 text-white flex items-center justify-center text-[8px]">
              ❤️
            </span>
          </span>
          <span className="text-[10px] ml-1">42 reactions</span>
        </div>
        <span>8 comments</span>
      </div>

      {/* Action Buttons */}
      <div className="px-2 py-1.5 flex items-center justify-around text-slate-600 font-semibold text-[11px]">
        <button className="flex items-center gap-1.5 p-2 rounded-lg hover:bg-slate-50 transition cursor-pointer">
          <ThumbsUp className="size-3.5" />
          Like
        </button>
        <button className="flex items-center gap-1.5 p-2 rounded-lg hover:bg-slate-50 transition cursor-pointer">
          <MessageSquare className="size-3.5" />
          Comment
        </button>
        <button className="flex items-center gap-1.5 p-2 rounded-lg hover:bg-slate-50 transition cursor-pointer">
          <Repeat2 className="size-3.5" />
          Repost
        </button>
        <button className="flex items-center gap-1.5 p-2 rounded-lg hover:bg-slate-50 transition cursor-pointer">
          <Send className="size-3.5" />
          Send
        </button>
      </div>
    </div>
  );
};