
import React, { useState } from "react";
import {
    Heart,
    MessageCircle,
    Send,
    Bookmark,
    MoreHorizontal,
} from "lucide-react";

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

    // Format hashtags and mentions.
    const formatContent = (text: string) => {
        return text.split(/(\s+)/).map((part, index) => {
            if (part.startsWith("#") || part.startsWith("@")) {
                return (
                    <span
                        key={index}
                        className="font-medium text-[#B97960]"
                    >
                        {part}
                    </span>
                );
            }

            return part;
        });
    };

    return (
        <div className="w-full max-w-[380px] overflow-hidden rounded-2xl border border-[#DED7CA] bg-white text-xs shadow-sm">
            {/* Instagram Header */}
            <div className="flex items-center justify-between border-b border-[#EAE5DC] px-4 py-3">
                <div className="flex min-w-0 items-center gap-3">
                    <div className="size-9 shrink-0 rounded-full bg-gradient-to-tr from-amber-500 via-rose-500 to-purple-600 p-[2px]">
                        <div className="h-full w-full overflow-hidden rounded-full border-2 border-white bg-white">
                            <img
                                src={
                                    avatarUrl ||
                                    "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100"
                                }
                                alt="Avatar"
                                className="h-full w-full rounded-full object-cover"
                            />
                        </div>
                    </div>

                    <div className="min-w-0">
                        <p className="truncate text-sm font-semibold leading-tight text-[#292720]">
                            {authorName}
                        </p>

                        <p className="mt-0.5 text-[10px] text-[#817B70]">
                            Original audio
                        </p>
                    </div>
                </div>

                <button
                    type="button"
                    aria-label="More post options"
                    className="rounded-full p-1.5 text-[#817B70] transition-colors hover:bg-[#F8F7F3] hover:text-[#292720]"
                >
                    <MoreHorizontal className="size-4" />
                </button>
            </div>

            {/* Media Viewport */}
            <div className="flex aspect-square w-full items-center justify-center overflow-hidden bg-[#292720]">
                {mediaUrl ? (
                    mediaType === "video" ? (
                        <video
                            src={mediaUrl}
                            className="h-full w-full object-cover"
                            controls
                        />
                    ) : (
                        <img
                            src={mediaUrl}
                            alt="Instagram post preview"
                            className="h-full w-full object-cover"
                        />
                    )
                ) : (
                    <div className="flex flex-col items-center gap-3 p-6 text-center text-[#DED7CA]">
                        <div className="flex size-14 items-center justify-center rounded-full border border-white/15 bg-white/10 text-2xl">
                            📸
                        </div>

                        <p className="max-w-[220px] text-xs font-medium leading-relaxed">
                            Instagram posts require an image or video
                        </p>
                    </div>
                )}
            </div>

            {/* Action Buttons */}
            <div className="px-4 pb-1 pt-3">
                <div className="mb-3 flex items-center justify-between">
                    <div className="flex items-center gap-4 text-[#292720]">
                        <button
                            type="button"
                            aria-label="Like post"
                            className="transition-colors hover:text-rose-500"
                        >
                            <Heart className="size-5" />
                        </button>

                        <button
                            type="button"
                            aria-label="Comment on post"
                            className="transition-colors hover:text-[#B97960]"
                        >
                            <MessageCircle className="size-5 -rotate-90" />
                        </button>

                        <button
                            type="button"
                            aria-label="Share post"
                            className="transition-colors hover:text-[#B97960]"
                        >
                            <Send className="size-5" />
                        </button>
                    </div>

                    <button
                        type="button"
                        aria-label="Save post"
                        className="text-[#292720] transition-colors hover:text-[#B97960]"
                    >
                        <Bookmark className="size-5" />
                    </button>
                </div>

                <p className="mb-2 text-xs font-semibold text-[#292720]">
                    1,248 likes
                </p>

                {/* Caption */}
                <div className="break-words whitespace-pre-line text-[12px] leading-relaxed text-[#625D54]">
                    <span className="mr-1.5 font-semibold text-[#292720]">
                        {username}
                    </span>

                    <span>
                        {shouldTruncate ? (
                            <>
                                {formatContent(content.slice(0, 125))}

                                <button
                                    type="button"
                                    onClick={() => setExpanded(true)}
                                    className="ml-1 font-medium text-[#A49C8F] transition-colors hover:text-[#B97960]"
                                >
                                    ... more
                                </button>
                            </>
                        ) : (
                            formatContent(
                                content ||
                                    "Your caption preview will appear here..."
                            )
                        )}
                    </span>
                </div>

                <p className="mt-3 pb-3 text-[9px] font-semibold uppercase tracking-[0.12em] text-[#A49C8F]">
                    2 hours ago
                </p>
            </div>
        </div>
    );
};
