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
  const activeMediaUrl = mediaFile ? URL.createObjectURL(mediaFile) : mediaUrl;
  const isVideo = mediaFile?.type.startsWith("video/") || false;

  // Track active tab independently so clicking any platform always works
  const [activeTab, setActiveTab] = useState<string>(() => {
    return selectedPlatforms.length > 0 ? selectedPlatforms[0] : "instagram";
  });

  // Keep tab updated when user selects platforms in the compose form
  useEffect(() => {
    if (selectedPlatforms.length > 0 && !selectedPlatforms.includes(activeTab)) {
      setActiveTab(selectedPlatforms[0]);
    }
  }, [selectedPlatforms]);

  const limit = PLATFORM_LIMITS[activeTab] || 280;
  const charsLeft = limit - content.length;
  const isOverLimit = charsLeft < 0;

  return (
    <div className="bg-slate-50/70 border border-slate-200 rounded-3xl p-5 shadow-xs flex flex-col items-center">
      {/* Header bar */}
      <div className="w-full flex items-center justify-between pb-4 border-b border-slate-200/80 mb-4">
        <div className="flex items-center gap-2">
          <Eye className="size-4 text-slate-500" />
          <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider">
            Live Feed Preview
          </h4>
        </div>

        {/* Platform switch tabs */}
        <div className="flex items-center gap-1 bg-white p-1 rounded-xl border border-slate-200 text-xs">
          {["instagram", "linkedin", "twitter", "facebook"].map((plat) => {
            const isSelectedInForm = selectedPlatforms.includes(plat);
            return (
              <button
                key={plat}
                type="button"
                onClick={() => setActiveTab(plat)}
                className={`relative px-2.5 py-1 rounded-lg font-semibold capitalize transition cursor-pointer ${
                  activeTab === plat
                    ? "bg-slate-900 text-white shadow-2xs"
                    : "text-slate-500 hover:text-slate-900 hover:bg-slate-100"
                }`}
              >
                {plat === "facebook" ? "FB" : plat === "linkedin" ? "LinkedIn" : plat}
                {isSelectedInForm && (
                  <span
                    className={`ml-1 inline-block size-1.5 rounded-full ${
                      activeTab === plat ? "bg-emerald-400" : "bg-emerald-500"
                    }`}
                    title="Selected in compose form"
                  />
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Target Render Viewport */}
      <div className="w-full flex justify-center my-2">
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

      {/* Validation Banner */}
      <div className="w-full mt-4 pt-3 border-t border-slate-200/80 flex items-center justify-between text-xs">
        <div className="flex items-center gap-1.5">
          {isOverLimit ? (
            <span className="flex items-center gap-1 text-rose-600 font-medium">
              <AlertCircle className="size-3.5" />
              Exceeds {activeTab} limit by {Math.abs(charsLeft)} chars
            </span>
          ) : (
            <span className="text-slate-500 font-medium">
              {charsLeft.toLocaleString()} characters remaining
            </span>
          )}
        </div>

        {activeTab === "instagram" && !activeMediaUrl && (
          <span className="text-amber-600 text-[11px] font-medium">
            ⚠️ Image or video required
          </span>
        )}
      </div>
    </div>
  );
};