
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
        <div className="w-full max-w-[420px] overflow-hidden rounded-2xl border border-[#DED7CA] bg-white text-xs shadow-sm">
            {/* Facebook Post Header */}
            <div className="flex items-center justify-between px-4 pb-3 pt-4">
                <div className="flex min-w-0 items-center gap-3">
                    <div className="size-10 shrink-0 overflow-hidden rounded-full border border-[#DED7CA] bg-[#F8F7F3]">
                        <img
                            src={
                                avatarUrl ||
                                "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100"
                            }
                            alt="Avatar"
                            className="h-full w-full object-cover"
                        />
                    </div>

                    <div className="min-w-0">
                        <h4 className="truncate text-sm font-semibold leading-tight text-[#292720]">
                            {authorName}
                        </h4>

                        <div className="mt-1 flex items-center gap-1.5 text-[11px] text-[#817B70]">
                            <span>Just now</span>
                            <span>·</span>
                            <Globe className="size-3" />
                        </div>
                    </div>
                </div>

                <div className="flex shrink-0 items-center gap-1 text-[#817B70]">
                    <button
                        type="button"
                        aria-label="More post options"
                        className="rounded-full p-2 transition-colors hover:bg-[#F8F7F3] hover:text-[#292720]"
                    >
                        <MoreHorizontal className="size-4" />
                    </button>

                    <button
                        type="button"
                        aria-label="Close post preview"
                        className="rounded-full p-2 transition-colors hover:bg-[#F8F7F3] hover:text-[#292720]"
                    >
                        <X className="size-4" />
                    </button>
                </div>
            </div>

            {/* Post Content */}
            <div className="break-words whitespace-pre-line px-4 pb-2 text-[13px] leading-relaxed text-[#292720]">
                {shouldTruncate ? (
                    <>
                        {content.slice(0, 250)}
                        <button
                            type="button"
                            onClick={() => setExpanded(true)}
                            className="ml-1 font-semibold text-[#B97960] hover:underline"
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
                <div className="mt-2 flex max-h-80 w-full items-center justify-center overflow-hidden bg-[#292720]">
                    {mediaType === "video" ? (
                        <video
                            src={mediaUrl}
                            className="max-h-80 w-full object-cover"
                            controls
                        />
                    ) : (
                        <img
                            src={mediaUrl}
                            alt="Facebook preview"
                            className="max-h-80 w-full object-cover"
                        />
                    )}
                </div>
            )}

            {/* Reaction and Engagement Counters */}
            <div className="mx-4 mt-2 flex items-center justify-between border-b border-[#EAE5DC] py-3 text-[11px] text-[#817B70]">
                <div className="flex items-center gap-2">
                    <span className="flex -space-x-1">
                        <span className="flex size-4 items-center justify-center rounded-full bg-[#1877F2] text-[8px] text-white shadow-sm">
                            👍
                        </span>
                        <span className="flex size-4 items-center justify-center rounded-full bg-[#FA383E] text-[8px] text-white shadow-sm">
                            ❤️
                        </span>
                    </span>

                    <span className="cursor-pointer hover:underline">
                        128
                    </span>
                </div>

                <div className="flex items-center gap-3">
                    <span className="cursor-pointer hover:underline">
                        14 comments
                    </span>

                    <span className="cursor-pointer hover:underline">
                        6 shares
                    </span>
                </div>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center justify-around px-2 py-2 text-[12px] font-medium text-[#625D54]">
                <button
                    type="button"
                    className="flex flex-1 items-center justify-center gap-2 rounded-xl py-2.5 transition-colors hover:bg-[#F8F7F3]"
                >
                    <ThumbsUp className="size-4 text-[#817B70]" />
                    <span>Like</span>
                </button>

                <button
                    type="button"
                    className="flex flex-1 items-center justify-center gap-2 rounded-xl py-2.5 transition-colors hover:bg-[#F8F7F3]"
                >
                    <MessageCircle className="size-4 text-[#817B70]" />
                    <span>Comment</span>
                </button>

                <button
                    type="button"
                    className="flex flex-1 items-center justify-center gap-2 rounded-xl py-2.5 transition-colors hover:bg-[#F8F7F3]"
                >
                    <Share2 className="size-4 text-[#817B70]" />
                    <span>Share</span>
                </button>
            </div>
        </div>
    );
};
