import React, { useState } from "react";
import { Heart, MessageCircle, Send, Bookmark, MoreHorizontal } from "lucide-react";

interface InstagramMockupProps {
  content: string;
  mediaUrl?: string | null;
  mediaType?: "image" | "video";
  authorName?: string;
  username?: string;
  avatarUrl?: string;
}

export const InstagramMockup: React.FC<InstagramMockupProps> = ({
  content,
  mediaUrl,
  mediaType = "image",
  authorName = "Your Brand",
  username = "yourbrand",
  avatarUrl,
}) => {
  const [expanded, setExpanded] = useState(false);
  const shouldTruncate = content.length > 125 && !expanded;

  // Format hashtags and tags with links/blue coloring
  const formatContent = (text: string) => {
    return text.split(/(\s+)/).map((part, index) => {
      if (part.startsWith("#") || part.startsWith("@")) {
        return (
          <span key={index} className="text-[#00376b] font-medium">
            {part}
          </span>
        );
      }
      return part;
    });
  };

  return (
    <div className="w-full max-w-[380px] bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-xs text-xs">
      {/* IG Header */}
      <div className="flex items-center justify-between px-3.5 py-2.5 border-b border-slate-100">
        <div className="flex items-center gap-2.5">
          <div className="size-8 rounded-full p-0.5 bg-gradient-to-tr from-amber-500 via-rose-500 to-purple-600">
            <div className="w-full h-full rounded-full bg-white p-0.5 overflow-hidden">
              <img
                src={avatarUrl || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100"}
                alt="avatar"
                className="w-full h-full object-cover rounded-full"
              />
            </div>
          </div>
          <div>
            <p className="font-bold text-slate-900 leading-tight">{username}</p>
            <p className="text-[10px] text-slate-400">Original audio</p>
          </div>
        </div>
        <MoreHorizontal className="size-4 text-slate-600 cursor-pointer" />
      </div>

      {/* Media Viewport */}
      <div className="w-full aspect-square bg-slate-950 flex items-center justify-center overflow-hidden">
        {mediaUrl ? (
          mediaType === "video" ? (
            <video src={mediaUrl} className="w-full h-full object-cover" controls />
          ) : (
            <img src={mediaUrl} alt="IG post asset" className="w-full h-full object-cover" />
          )
        ) : (
          <div className="text-center p-6 text-slate-500 flex flex-col items-center gap-2">
            <div className="size-12 rounded-full bg-slate-900 flex items-center justify-center text-slate-400">
              📸
            </div>
            <p className="text-xs font-medium">Instagram posts require an image or video</p>
          </div>
        )}
      </div>

      {/* Action Buttons */}
      <div className="p-3 pb-1">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-3 text-slate-800">
            <Heart className="size-5 hover:text-rose-500 transition-colors cursor-pointer" />
            <MessageCircle className="size-5 cursor-pointer -rotate-90" />
            <Send className="size-5 cursor-pointer" />
          </div>
          <Bookmark className="size-5 cursor-pointer text-slate-800" />
        </div>

        <p className="font-bold text-slate-900 mb-1">1,248 likes</p>

        {/* Caption */}
        <div className="text-slate-800 leading-relaxed break-words whitespace-pre-line">
          <span className="font-bold mr-1.5">{username}</span>
          <span>
            {shouldTruncate ? (
              <>
                {formatContent(content.slice(0, 125))}
                <button
                  type="button"
                  onClick={() => setExpanded(true)}
                  className="text-slate-400 ml-1 hover:text-slate-600 cursor-pointer font-medium"
                >
                  ... more
                </button>
              </>
            ) : (
              formatContent(content || "Your caption preview will appear here...")
            )}
          </span>
        </div>

        <p className="text-slate-400 uppercase text-[9px] mt-2 font-semibold">2 hours ago</p>
      </div>
    </div>
  );
};