
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react-hooks/set-state-in-effect */
import React, { useState, useEffect } from "react";
import { InstagramMockup } from "./InstagramMockup";
import { LinkedInMockup } from "./LinkedInMockup";
import { TwitterMockup } from "./TwitterMockup";
import { FacebookMockup } from "./FacebookMockup";
import { Eye, AlertCircle } from "lucide-react";

interface FeedPreviewProps {
    content: string;
    mediaFile?: File | null;
    mediaUrl?: string | null;
    selectedPlatforms: string[];
}

const PLATFORM_LIMITS: Record<string, number> = {
    twitter: 280,
    instagram: 2200,
    linkedin: 3000,
    facebook: 63206,
};

export const FeedPreview: React.FC<FeedPreviewProps> = ({
    content,
    mediaFile,
    mediaUrl,
    selectedPlatforms,
}) => {
    const activeMediaUrl = mediaFile
        ? URL.createObjectURL(mediaFile)
        : mediaUrl;

    const isVideo = mediaFile?.type.startsWith("video/") || false;

    // Track the active preview tab independently.
    const [activeTab, setActiveTab] = useState<string>(() => {
        return selectedPlatforms.length > 0
            ? selectedPlatforms[0]
            : "instagram";
    });

    // Keep the active tab synchronized with selected platforms.
    useEffect(() => {
        if (
            selectedPlatforms.length > 0 &&
            !selectedPlatforms.includes(activeTab)
        ) {
            setActiveTab(selectedPlatforms[0]);
        }
    }, [selectedPlatforms]);

    const limit = PLATFORM_LIMITS[activeTab] || 280;
    const charsLeft = limit - content.length;
    const isOverLimit = charsLeft < 0;

    const platforms = [
        { id: "instagram", label: "Instagram" },
        { id: "linkedin", label: "LinkedIn" },
        { id: "twitter", label: "Twitter" },
        { id: "facebook", label: "Facebook" },
    ];

    return (
        <div className="flex w-full flex-col items-center rounded-3xl border border-[#DED7CA] bg-[#F8F7F3] p-4 shadow-sm sm:p-5">
            {/* Header */}
            <div className="mb-5 flex w-full flex-col gap-4 border-b border-[#DED7CA] pb-4">
                <div className="flex items-center gap-2">
                    <div className="flex size-8 items-center justify-center rounded-lg border border-[#DED7CA] bg-white">
                        <Eye className="size-4 text-[#B97960]" />
                    </div>

                    <div>
                        <h4 className="text-xs font-semibold uppercase tracking-[0.12em] text-[#292720]">
                            Live Feed Preview
                        </h4>

                        <p className="mt-0.5 text-[10px] text-[#817B70]">
                            See how your post looks on each platform
                        </p>
                    </div>
                </div>

                {/* Platform Tabs */}
                <div className="flex w-full flex-wrap items-center gap-1 rounded-xl border border-[#DED7CA] bg-white p-1">
                    {platforms.map((platform) => {
                        const isSelectedInForm =
                            selectedPlatforms.includes(platform.id);

                        const isActive = activeTab === platform.id;

                        return (
                            <button
                                key={platform.id}
                                type="button"
                                onClick={() => setActiveTab(platform.id)}
                                aria-pressed={isActive}
                                className={`relative flex flex-1 items-center justify-center gap-1.5 rounded-lg px-2 py-2 text-[11px] font-medium transition-all duration-200 sm:text-xs ${
                                    isActive
                                        ? "bg-[#292720] text-white shadow-sm"
                                        : "text-[#817B70] hover:bg-[#F8F7F3] hover:text-[#292720]"
                                }`}
                            >
                                <span>{platform.label}</span>

                                {isSelectedInForm && (
                                    <span
                                        className={`size-1.5 shrink-0 rounded-full ${
                                            isActive
                                                ? "bg-emerald-400"
                                                : "bg-emerald-500"
                                        }`}
                                        title="Selected in compose form"
                                    />
                                )}
                            </button>
                        );
                    })}
                </div>
            </div>

            {/* Preview Viewport */}
            <div className="my-2 flex w-full justify-center overflow-hidden">
                {activeTab === "instagram" && (
                    <InstagramMockup
                        content={content}
                        mediaUrl={activeMediaUrl}
                        mediaType={isVideo ? "video" : "image"}
                    />
                )}

                {activeTab === "linkedin" && (
                    <LinkedInMockup
                        content={content}
                        mediaUrl={activeMediaUrl}
                        mediaType={isVideo ? "video" : "image"}
                    />
                )}

                {activeTab === "twitter" && (
                    <TwitterMockup
                        content={content}
                        mediaUrl={activeMediaUrl}
                        mediaType={isVideo ? "video" : "image"}
                    />
                )}

                {activeTab === "facebook" && (
                    <FacebookMockup
                        content={content}
                        mediaUrl={activeMediaUrl}
                        mediaType={isVideo ? "video" : "image"}
                    />
                )}
            </div>

            {/* Character Count and Validation */}
            <div className="mt-5 flex w-full flex-wrap items-center justify-between gap-3 border-t border-[#DED7CA] pt-4 text-xs">
                <div className="flex items-center gap-1.5">
                    {isOverLimit ? (
                        <span className="flex items-center gap-1.5 font-medium text-rose-600">
                            <AlertCircle className="size-3.5 shrink-0" />
                            Exceeds {activeTab} limit by{" "}
                            {Math.abs(charsLeft).toLocaleString()} chars
                        </span>
                    ) : (
                        <span className="font-medium text-[#817B70]">
                            {charsLeft.toLocaleString()} characters remaining
                        </span>
                    )}
                </div>

                {activeTab === "instagram" && !activeMediaUrl && (
                    <span className="flex items-center gap-1 text-[11px] font-medium text-amber-700">
                        <AlertCircle className="size-3.5" />
                        Image or video required
                    </span>
                )}
            </div>
        </div>
    );
};
