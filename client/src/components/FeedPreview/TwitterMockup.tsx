import React from "react";
import { Heart, MessageCircle, Repeat2, Bookmark, Share, MoreHorizontal } from "lucide-react";

interface TwitterMockupProps {
  content: string;
  mediaUrl?: string | null;
  mediaType?: "image" | "video";
  authorName?: string;
  handle?: string;
  avatarUrl?: string;
}

export const TwitterMockup: React.FC<TwitterMockupProps> = ({
  content,
  mediaUrl,
  mediaType = "image",
  authorName = "Your Name",
  handle = "yourhandle",
  avatarUrl,
}) => {
  return (
    <div className="w-full max-w-[400px] bg-white border border-slate-200 rounded-2xl p-4 shadow-xs text-xs">
      <div className="flex gap-3">
        <img
          src={avatarUrl || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100"}
          alt="Avatar"
          className="size-9 rounded-full object-cover shrink-0"
        />

        <div className="flex-1 min-w-0">
          {/* Header */}
          <div className="flex items-center justify-between mb-1">
            <div className="flex items-center gap-1.5 truncate">
              <span className="font-bold text-slate-900 truncate">{authorName}</span>
              <span className="text-slate-500 font-normal">@{handle}</span>
              <span className="text-slate-400">·</span>
              <span className="text-slate-400">1m</span>
            </div>
            <MoreHorizontal className="size-4 text-slate-400 shrink-0 cursor-pointer" />
          </div>

          {/* Tweet Text */}
          <p className="text-slate-900 text-[13px] leading-snug whitespace-pre-line break-words mb-3">
            {content || "What's happening?"}
          </p>

          {/* Media Attachment */}
          {mediaUrl && (
            <div className="rounded-xl overflow-hidden border border-slate-100 max-h-60 mb-3 bg-slate-950 flex items-center justify-center">
              {mediaType === "video" ? (
                <video src={mediaUrl} className="w-full max-h-60 object-cover" controls />
              ) : (
                <img src={mediaUrl} alt="Tweet attachment" className="w-full max-h-60 object-cover" />
              )}
            </div>
          )}

          {/* Action Row */}
          <div className="flex items-center justify-between text-slate-500 text-[11px] max-w-[280px]">
            <span className="flex items-center gap-1.5 hover:text-sky-500 cursor-pointer transition">
              <MessageCircle className="size-3.5" /> 12
            </span>
            <span className="flex items-center gap-1.5 hover:text-emerald-500 cursor-pointer transition">
              <Repeat2 className="size-3.5" /> 5
            </span>
            <span className="flex items-center gap-1.5 hover:text-rose-500 cursor-pointer transition">
              <Heart className="size-3.5" /> 84
            </span>
            <span className="flex items-center gap-1.5 hover:text-sky-500 cursor-pointer transition">
              <Bookmark className="size-3.5" />
            </span>
            <span className="flex items-center gap-1.5 hover:text-sky-500 cursor-pointer transition">
              <Share className="size-3.5" />
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};