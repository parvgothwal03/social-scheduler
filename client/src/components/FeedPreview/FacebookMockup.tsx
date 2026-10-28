import React, { useState } from "react";
import {
  ThumbsUp,
  MessageCircle,
  Share2,
  Globe,
  MoreHorizontal,
  X,
} from "lucide-react";

interface FacebookMockupProps {
  content: string;
  mediaUrl?: string | null;
  mediaType?: "image" | "video";
  authorName?: string;
  avatarUrl?: string;
}

export const FacebookMockup: React.FC<FacebookMockupProps> = ({
  content,
  mediaUrl,
  mediaType = "image",
  authorName = "Your Page",
  avatarUrl,
}) => {
  const [expanded, setExpanded] = useState(false);
  const shouldTruncate = content.length > 250 && !expanded;

  return (
    <div className="w-full max-w-[420px] bg-white border border-slate-200 rounded-xl overflow-hidden shadow-xs text-xs">
      {/* Facebook Post Header */}
      <div className="flex items-center justify-between p-3 pb-2">
        <div className="flex items-center gap-2.5">
          <div className="size-10 rounded-full overflow-hidden bg-slate-100 border border-slate-200 shrink-0">
            <img
              src={
                avatarUrl ||
                "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100"
              }
              alt="Avatar"
              className="w-full h-full object-cover"
            />
          </div>
          <div>
            <h4 className="font-bold text-slate-900 leading-tight hover:underline cursor-pointer">
              {authorName}
            </h4>
            <div className="flex items-center gap-1.5 text-[11px] text-slate-500 mt-0.5">
              <span>Just now</span>
              <span>•</span>
              <Globe className="size-3 text-slate-500" />
            </div>
          </div>
        </div>

        <div className="flex items-center gap-1 text-slate-500">
          <button
            type="button"
            className="p-1.5 hover:bg-slate-100 rounded-full transition cursor-pointer"
          >
            <MoreHorizontal className="size-4" />
          </button>
          <button
            type="button"
            className="p-1.5 hover:bg-slate-100 rounded-full transition cursor-pointer"
          >
            <X className="size-4" />
          </button>
        </div>
      </div>

      {/* Post Content */}
      <div className="px-3.5 py-1 text-slate-800 leading-relaxed whitespace-pre-line break-words text-[13px]">
        {shouldTruncate ? (
          <>
            {content.slice(0, 250)}
            <button
              type="button"
              onClick={() => setExpanded(true)}
              className="text-slate-500 font-semibold hover:underline ml-1 cursor-pointer"
            >
              See more
            </button>
          </>
        ) : (
          content || "What's on your mind?"
        )}
      </div>

      {/* Attached Media */}
      {mediaUrl && (
        <div className="mt-2.5 w-full bg-slate-950 max-h-80 overflow-hidden flex items-center justify-center">
          {mediaType === "video" ? (
            <video
              src={mediaUrl}
              className="w-full max-h-80 object-cover"
              controls
            />
          ) : (
            <img
              src={mediaUrl}
              alt="Facebook preview"
              className="w-full max-h-80 object-cover"
            />
          )}
        </div>
      )}

      {/* Reaction and Engagement Counters */}
      <div className="px-3.5 py-2 flex items-center justify-between text-[11px] text-slate-500 border-b border-slate-100 mt-1">
        <div className="flex items-center gap-1.5">
          <span className="flex -space-x-1">
            <span className="size-4 rounded-full bg-[#1877F2] text-white flex items-center justify-center text-[8px] shadow-xs">
              👍
            </span>
            <span className="size-4 rounded-full bg-[#FA383E] text-white flex items-center justify-center text-[8px] shadow-xs">
              ❤️
            </span>
          </span>
          <span className="hover:underline cursor-pointer">128</span>
        </div>

        <div className="flex items-center gap-3">
          <span className="hover:underline cursor-pointer">14 comments</span>
          <span className="hover:underline cursor-pointer">6 shares</span>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="px-2 py-1 flex items-center justify-around text-slate-600 font-semibold text-[12px]">
        <button
          type="button"
          className="flex-1 flex items-center justify-center gap-2 py-2 hover:bg-slate-100 rounded-lg transition cursor-pointer"
        >
          <ThumbsUp className="size-4 text-slate-500" />
          <span>Like</span>
        </button>
        <button
          type="button"
          className="flex-1 flex items-center justify-center gap-2 py-2 hover:bg-slate-100 rounded-lg transition cursor-pointer"
        >
          <MessageCircle className="size-4 text-slate-500" />
          <span>Comment</span>
        </button>
        <button
          type="button"
          className="flex-1 flex items-center justify-center gap-2 py-2 hover:bg-slate-100 rounded-lg transition cursor-pointer"
        >
          <Share2 className="size-4 text-slate-500" />
          <span>Share</span>
        </button>
      </div>
    </div>
  );
};