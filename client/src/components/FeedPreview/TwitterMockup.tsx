
import React from "react";
import {
    Heart,
    MessageCircle,
    Repeat2,
    Bookmark,
    Share,
    MoreHorizontal,
} from "lucide-react";

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
        <div className="w-full max-w-[400px] rounded-2xl border border-[#DED7CA] bg-white p-4 text-xs shadow-sm">
            <div className="flex gap-3">
                {/* Avatar */}
                <img
                    src={
                        avatarUrl ||
                        "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100"
                    }
                    alt="Avatar"
                    className="size-10 shrink-0 rounded-full border border-[#DED7CA] object-cover"
                />

                <div className="min-w-0 flex-1">
                    {/* Header */}
                    <div className="mb-2 flex items-center justify-between gap-2">
                        <div className="flex min-w-0 items-center gap-1.5">
                            <span className="truncate text-sm font-semibold text-[#292720]">
                                {authorName}
                            </span>

                            <span className="truncate text-xs text-[#817B70]">
                                @{handle}
                            </span>

                            <span className="shrink-0 text-[#A49C8F]">
                                ·
                            </span>

                            <span className="shrink-0 text-xs text-[#A49C8F]">
                                1m
                            </span>
                        </div>

                        <button
                            type="button"
                            aria-label="More post options"
                            className="shrink-0 rounded-full p-1.5 text-[#A49C8F] transition-colors hover:bg-[#F8F7F3] hover:text-[#292720]"
                        >
                            <MoreHorizontal className="size-4" />
                        </button>
                    </div>

                    {/* Tweet Text */}
                    <p className="mb-3 whitespace-pre-line break-words text-[13px] leading-relaxed text-[#292720]">
                        {content || "What's happening?"}
                    </p>

                    {/* Media Attachment */}
                    {mediaUrl && (
                        <div className="mb-3 flex max-h-60 items-center justify-center overflow-hidden rounded-xl border border-[#DED7CA] bg-[#292720]">
                            {mediaType === "video" ? (
                                <video
                                    src={mediaUrl}
                                    className="max-h-60 w-full object-cover"
                                    controls
                                />
                            ) : (
                                <img
                                    src={mediaUrl}
                                    alt="Tweet attachment"
                                    className="max-h-60 w-full object-cover"
                                />
                            )}
                        </div>
                    )}

                    {/* Engagement Actions */}
                    <div className="flex max-w-[300px] items-center justify-between pt-1 text-[11px] text-[#A49C8F]">
                        <button
                            type="button"
                            aria-label="12 replies"
                            className="flex items-center gap-1.5 transition-colors hover:text-[#B97960]"
                        >
                            <MessageCircle className="size-3.5" />
                            <span>12</span>
                        </button>

                        <button
                            type="button"
                            aria-label="5 reposts"
                            className="flex items-center gap-1.5 transition-colors hover:text-emerald-600"
                        >
                            <Repeat2 className="size-3.5" />
                            <span>5</span>
                        </button>

                        <button
                            type="button"
                            aria-label="84 likes"
                            className="flex items-center gap-1.5 transition-colors hover:text-rose-500"
                        >
                            <Heart className="size-3.5" />
                            <span>84</span>
                        </button>

                        <button
                            type="button"
                            aria-label="Bookmark post"
                            className="transition-colors hover:text-[#B97960]"
                        >
                            <Bookmark className="size-3.5" />
                        </button>

                        <button
                            type="button"
                            aria-label="Share post"
                            className="transition-colors hover:text-[#B97960]"
                        >
                            <Share className="size-3.5" />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};
