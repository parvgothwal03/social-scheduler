
import React, { useState } from "react";
import {
    ThumbsUp,
    MessageSquare,
    Repeat2,
    Send,
    Globe,
    MoreHorizontal,
} from "lucide-react";

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
        <div className="w-full max-w-[420px] overflow-hidden rounded-2xl border border-[#DED7CA] bg-white text-xs shadow-sm">
            {/* Post Header */}
            <div className="flex items-start justify-between gap-3 px-4 pb-3 pt-4">
                <div className="flex min-w-0 items-center gap-3">
                    <img
                        src={
                            avatarUrl ||
                            "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100"
                        }
                        alt="Author"
                        className="size-10 shrink-0 rounded-full border border-[#DED7CA] object-cover"
                    />

                    <div className="min-w-0">
                        <div className="flex items-center gap-1">
                            <span className="truncate text-sm font-semibold leading-tight text-[#292720]">
                                {authorName}
                            </span>

                            <span className="shrink-0 text-[10px] text-[#A49C8F]">
                                • 1st
                            </span>
                        </div>

                        <p className="mt-0.5 line-clamp-1 max-w-[240px] text-[10px] text-[#817B70]">
                            {headline}
                        </p>

                        <div className="mt-1 flex items-center gap-1 text-[10px] text-[#A49C8F]">
                            <span>Just now</span>
                            <span>·</span>
                            <Globe className="size-3" />
                        </div>
                    </div>
                </div>

                <button
                    type="button"
                    aria-label="More post options"
                    className="shrink-0 rounded-full p-1.5 text-[#817B70] transition-colors hover:bg-[#F8F7F3] hover:text-[#292720]"
                >
                    <MoreHorizontal className="size-4" />
                </button>
            </div>

            {/* Post Text */}
            <div className="break-words whitespace-pre-line px-4 pb-3 text-[12px] leading-relaxed text-[#292720]">
                {shouldTruncate ? (
                    <>
                        {content.slice(0, 210)}

                        <button
                            type="button"
                            onClick={() => setExpanded(true)}
                            className="ml-1 font-semibold text-[#B97960] transition-colors hover:underline"
                        >
                            ...see more
                        </button>
                    </>
                ) : (
                    content ||
                    "Share your thoughts, learnings, or updates with your professional network..."
                )}
            </div>

            {/* Optional Media */}
            {mediaUrl && (
                <div className="mt-1 flex max-h-72 w-full items-center justify-center overflow-hidden border-y border-[#EAE5DC] bg-[#F8F7F3]">
                    {mediaType === "video" ? (
                        <video
                            src={mediaUrl}
                            className="max-h-72 w-full object-cover"
                            controls
                        />
                    ) : (
                        <img
                            src={mediaUrl}
                            alt="Media preview"
                            className="max-h-72 w-full object-cover"
                        />
                    )}
                </div>
            )}

            {/* Reactions Bar */}
            <div className="mx-4 flex items-center justify-between border-b border-[#EAE5DC] py-3 text-[11px] text-[#817B70]">
                <div className="flex items-center gap-2">
                    <span className="flex -space-x-1">
                        <span className="flex size-4 items-center justify-center rounded-full bg-blue-600 text-[8px] text-white">
                            👍
                        </span>

                        <span className="flex size-4 items-center justify-center rounded-full bg-rose-500 text-[8px] text-white">
                            ❤️
                        </span>
                    </span>

                    <span className="text-[10px]">42 reactions</span>
                </div>

                <span>8 comments</span>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center justify-around gap-1 px-2 py-2 text-[11px] font-medium text-[#625D54]">
                <button
                    type="button"
                    className="flex items-center gap-1.5 rounded-lg p-2 transition-colors hover:bg-[#F8F7F3] hover:text-[#B97960]"
                >
                    <ThumbsUp className="size-3.5" />
                    Like
                </button>

                <button
                    type="button"
                    className="flex items-center gap-1.5 rounded-lg p-2 transition-colors hover:bg-[#F8F7F3] hover:text-[#B97960]"
                >
                    <MessageSquare className="size-3.5" />
                    Comment
                </button>

                <button
                    type="button"
                    className="flex items-center gap-1.5 rounded-lg p-2 transition-colors hover:bg-[#F8F7F3] hover:text-[#B97960]"
                >
                    <Repeat2 className="size-3.5" />
                    Repost
                </button>

                <button
                    type="button"
                    className="flex items-center gap-1.5 rounded-lg p-2 transition-colors hover:bg-[#F8F7F3] hover:text-[#B97960]"
                >
                    <Send className="size-3.5" />
                    Send
                </button>
            </div>
        </div>
    );
};
