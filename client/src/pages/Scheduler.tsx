/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState, type FormEvent } from "react";
import { PLATFORMS } from "../assets/assets";
import {
  ArrowRightIcon,
  CalendarDaysIcon,
  CalendarIcon,
  ClockIcon,
  EyeIcon,
  LayoutListIcon,
  PenSquareIcon,
  SendIcon,
  XIcon,
} from "lucide-react";
import api from "../api/axios";
import toast from "react-hot-toast";
import { CalendarView } from "../components/CalendarView";
import { FeedPreview } from "../components/FeedPreview/FeedPreview";

const Scheduler = () => {
  const [posts, setPosts] = useState<any[]>([]);
  const [content, setContent] = useState("");
  const [scheduledDate, setScheduledDate] = useState("");
  const [scheduledTime, setScheduledTime] = useState("");
  const [selectedPlatforms, setSelectedPlatforms] = useState<string[]>([]);
  const [mediaFile, setMediaFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);

  // View state toggles
  const [viewMode, setViewMode] = useState<"calendar" | "queue">("calendar");
  const [leftTab, setLeftTab] = useState<"compose" | "preview">("compose");

  const fetchPosts = async () => {
    try {
      const { data } = await api.get("/api/posts");
      setPosts(data?.data || data || []);
    } catch (error: any) {
      toast.error(error?.response?.data?.message || error.message);
    }
  };

  useEffect(() => {
    (async () => await fetchPosts())();
    const interval = setInterval(async () => await fetchPosts(), 10000);
    return () => clearInterval(interval);
  }, []);

  const scheduled = posts.filter((p) => p.status === "scheduled");
  const published = posts.filter((p) => p.status === "published");

  const togglePlatform = (id: string) =>
    setSelectedPlatforms((prev) =>
      prev.includes(id) ? prev.filter((p) => p !== id) : [...prev, id]
    );

  const handleSelectDateSlot = (date: Date) => {
    const formattedDate = date.toISOString().split("T")[0];
    setScheduledDate(formattedDate);
    if (!scheduledTime) {
      setScheduledTime("10:00");
    }
    toast.success(`Date selected: ${formattedDate}`);
  };

  const handleSchedule = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (selectedPlatforms.length === 0) {
      toast.error("Select at least one platform");
      return;
    }
    if (!scheduledDate || !scheduledTime) {
      toast.error("Select a valid date and time");
      return;
    }
    if (selectedPlatforms.includes("instagram") && !mediaFile) {
      toast.error("Instagram posts require media. Please upload an image or video.");
      return;
    }

    const scheduledFor = new Date(`${scheduledDate}T${scheduledTime}`).toISOString();
    const formData = new FormData();
    formData.append("content", content);
    formData.append("scheduledFor", scheduledFor);
    formData.append("status", "scheduled");
    formData.append("platforms", JSON.stringify(selectedPlatforms));
    if (mediaFile) formData.append("media", mediaFile);

    setLoading(true);

    try {
      await api.post("/api/posts", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      toast.success("Post scheduled successfully!");
      setContent("");
      setScheduledDate("");
      setScheduledTime("");
      setSelectedPlatforms([]);
      setMediaFile(null);
      setLeftTab("compose");
      await fetchPosts();
    } catch (error: any) {
      toast.error(error?.response?.data?.message || error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col lg:flex-row gap-6 h-full items-start">
      {/* Compose & Live Preview Side Panel */}
      <div className="w-full lg:w-[460px] shrink-0">
        <div className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-xs">
          {/* Sub-tabs: Edit vs Live Preview */}
          <div className="flex items-center justify-between mb-5 pb-4 border-b border-slate-100">
            <div>
              <h2 className="text-base font-bold text-slate-800">
                {leftTab === "compose" ? "Compose Content" : "Live Mockup"}
              </h2>
              <p className="text-xs text-slate-400">
                {leftTab === "compose"
                  ? "Craft your captions and timing"
                  : "Preview how your post renders in real-time"}
              </p>
            </div>

            <div className="inline-flex rounded-xl border border-slate-200 p-1 bg-slate-50">
              <button
                type="button"
                onClick={() => setLeftTab("compose")}
                className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg transition-all ${
                  leftTab === "compose"
                    ? "bg-white text-slate-900 shadow-xs"
                    : "text-slate-500 hover:text-slate-900"
                }`}
              >
                <PenSquareIcon className="size-3.5" />
                Edit
              </button>
              <button
                type="button"
                onClick={() => setLeftTab("preview")}
                className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg transition-all ${
                  leftTab === "preview"
                    ? "bg-white text-slate-900 shadow-xs"
                    : "text-slate-500 hover:text-slate-900"
                }`}
              >
                <EyeIcon className="size-3.5" />
                Preview
              </button>
            </div>
          </div>

          {/* Conditional: Form or Feed Preview */}
          {leftTab === "compose" ? (
            <form className="space-y-5" onSubmit={handleSchedule}>
              {/* Platform Selection */}
              <div>
                <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">
                  Target Platforms
                </label>
                <div className="flex flex-wrap gap-2.5">
                  {PLATFORMS.map((p) => {
                    const active = selectedPlatforms.includes(p.id);
                    return (
                      <button
                        key={p.id}
                        type="button"
                        onClick={() => togglePlatform(p.id)}
                        className={`flex items-center gap-2 p-2.5 px-3.5 rounded-xl border text-sm font-medium transition-all duration-150 ${
                          active
                            ? "bg-red-50 border-red-300 text-red-500 shadow-xs scale-102"
                            : "border-slate-200 text-slate-500 hover:border-slate-300 hover:bg-slate-50"
                        }`}
                      >
                        <p.icon className="size-4" />
                        <span className="capitalize">{p.id}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Content Textarea */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider">
                    Content
                  </label>
                  <button
                    type="button"
                    onClick={() => setLeftTab("preview")}
                    className="text-xs font-semibold text-red-500 hover:text-red-600 flex items-center gap-1"
                  >
                    <EyeIcon className="size-3" />
                    Preview feed
                  </button>
                </div>

                <textarea
                  required
                  rows={4}
                  placeholder="What do you want to share today? Add hashtags and mentions..."
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-slate-900 text-sm placeholder-slate-400 outline-none focus:border-red-300 focus:bg-white transition resize-none"
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                />
                <div
                  className={`text-right text-xs mt-1 font-medium ${
                    content.length > 270 ? "text-red-500" : "text-slate-400"
                  }`}
                >
                  {content.length}/280
                </div>
              </div>

              {/* Media Upload */}
              <div>
                <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">
                  Media (Optional)
                </label>
                {mediaFile ? (
                  <div className="relative rounded-2xl overflow-hidden border border-slate-200 bg-slate-50">
                    {mediaFile.type.startsWith("image/") ? (
                      <img
                        src={URL.createObjectURL(mediaFile)}
                        alt="Media preview"
                        className="w-full h-36 object-cover"
                      />
                    ) : (
                      <video
                        src={URL.createObjectURL(mediaFile)}
                        className="w-full h-36 object-cover"
                        controls
                      />
                    )}
                    <button
                      type="button"
                      onClick={() => setMediaFile(null)}
                      className="absolute top-2 right-2 size-7 bg-slate-900/60 hover:bg-slate-900/80 text-white rounded-full flex items-center justify-center transition-colors"
                    >
                      <XIcon className="size-3.5" />
                    </button>
                  </div>
                ) : (
                  <label className="flex items-center justify-center gap-2 p-5 border-2 border-dashed border-slate-200 rounded-2xl cursor-pointer hover:border-red-300 hover:bg-red-50/20 transition-all group">
                    <span className="text-xs font-medium text-slate-500 group-hover:text-red-600 transition-colors">
                      Click to attach photo or video
                    </span>
                    <input
                      type="file"
                      accept="image/*,video/*"
                      className="hidden"
                      onChange={(e) =>
                        e.target.files?.[0] && setMediaFile(e.target.files[0])
                      }
                    />
                  </label>
                )}
              </div>

              {/* Date & Time Picker */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">
                    Date
                  </label>
                  <div className="relative">
                    <CalendarIcon className="size-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                    <input
                      type="date"
                      required
                      className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 text-sm outline-none focus:border-red-300 focus:bg-white transition"
                      value={scheduledDate}
                      onChange={(e) => setScheduledDate(e.target.value)}
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">
                    Time
                  </label>
                  <div className="relative">
                    <ClockIcon className="size-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                    <input
                      type="time"
                      required
                      className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 text-sm outline-none focus:border-red-300 focus:bg-white transition"
                      value={scheduledTime}
                      onChange={(e) => setScheduledTime(e.target.value)}
                    />
                  </div>
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full flex items-center justify-center gap-2 py-3.5 bg-red-500 hover:bg-red-600 transition-all text-white font-medium rounded-xl shadow-xs disabled:opacity-50 cursor-pointer"
              >
                {loading ? (
                  <>
                    <div className="size-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Scheduling...</span>
                  </>
                ) : (
                  <>
                    <span>Schedule Post</span>
                    <ArrowRightIcon className="size-4" />
                  </>
                )}
              </button>
            </form>
          ) : (
            /* Live Feed Preview View */
            <div className="space-y-4">
              <FeedPreview
                content={content}
                mediaFile={mediaFile}
                selectedPlatforms={
                  selectedPlatforms.length > 0 ? selectedPlatforms : ["instagram"]
                }
              />
              <button
                type="button"
                onClick={() => setLeftTab("compose")}
                className="w-full py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs rounded-xl transition"
              >
                ← Back to Edit
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Calendar & Queue Main Display Panel */}
      <div className="flex-1 flex flex-col gap-6 min-w-0 w-full">
        {/* View Switcher Header */}
        <div className="flex items-center justify-between bg-white px-5 py-3.5 rounded-3xl border border-slate-200/80 shadow-xs">
          <div>
            <h3 className="text-sm font-semibold text-slate-800">
              {viewMode === "calendar" ? "Visual Content Grid" : "Feed Queue"}
            </h3>
            <span className="text-xs text-slate-400">
              {viewMode === "calendar"
                ? "Drag cards across dates to reschedule instantly"
                : "Chronological list of all posts"}
            </span>
          </div>

          <div className="inline-flex rounded-xl border border-slate-200 p-1 bg-slate-50">
            <button
              type="button"
              onClick={() => setViewMode("calendar")}
              className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg transition-all ${
                viewMode === "calendar"
                  ? "bg-white text-slate-900 shadow-xs"
                  : "text-slate-500 hover:text-slate-900"
              }`}
            >
              <CalendarIcon className="size-3.5" />
              Calendar
            </button>
            <button
              type="button"
              onClick={() => setViewMode("queue")}
              className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg transition-all ${
                viewMode === "queue"
                  ? "bg-white text-slate-900 shadow-xs"
                  : "text-slate-500 hover:text-slate-900"
              }`}
            >
              <LayoutListIcon className="size-3.5" />
              Queue ({scheduled.length})
            </button>
          </div>
        </div>

        {/* Dynamic Display Area */}
        {viewMode === "calendar" ? (
          <CalendarView
            posts={posts}
            onRefresh={fetchPosts}
            onSelectDateSlot={handleSelectDateSlot}
          />
        ) : (
          <div className="flex flex-col gap-6">
            {/* Upcoming Posts */}
            <div className="bg-white rounded-3xl border border-slate-200/80 overflow-hidden shadow-xs">
              <div className="flex items-center gap-2.5 px-5 py-4 border-b border-slate-100">
                <CalendarDaysIcon className="size-4 text-zinc-500" />
                <h3 className="text-slate-900 text-sm font-semibold">Upcoming Posts</h3>
                <span className="ml-auto text-xs font-bold bg-zinc-100 text-zinc-700 px-2.5 py-0.5 rounded-full">
                  {scheduled.length}
                </span>
              </div>
              <div className="max-h-72 overflow-y-auto divide-y divide-slate-50">
                {scheduled.length === 0 ? (
                  <div className="py-10 text-center text-slate-400 text-sm">
                    No posts scheduled yet
                  </div>
                ) : (
                  scheduled.map((post) => (
                    <div
                      key={post._id}
                      className="px-5 py-4 hover:bg-slate-50/60 transition-colors"
                    >
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex gap-1.5 items-center">
                          {post.platforms?.map((pl: string) => {
                            const meta = PLATFORMS.find((p) => p.id === pl);
                            return meta ? (
                              <meta.icon key={pl} className="size-3.5 text-slate-400" />
                            ) : null;
                          })}
                        </div>
                        <div className="flex items-center gap-2">
                          {post.mediaType && (
                            <span className="text-xs bg-slate-100 text-slate-600 border border-slate-200 px-1.5 py-0.5 rounded-md font-semibold capitalize">
                              {post.mediaType}
                            </span>
                          )}
                          <span className="text-xs text-slate-400">
                            {new Date(post.scheduledFor).toLocaleString()}
                          </span>
                        </div>
                      </div>
                      <p className="text-sm text-slate-600 line-clamp-2">
                        {post.content}
                      </p>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Published Posts */}
            <div className="bg-white rounded-3xl border border-slate-200/80 overflow-hidden shadow-xs">
              <div className="flex items-center gap-2.5 px-5 py-4 border-b border-slate-100">
                <SendIcon className="size-4 text-zinc-500" />
                <h3 className="text-slate-900 text-sm font-semibold">Published Posts</h3>
                <span className="ml-auto text-xs font-bold bg-zinc-100 text-zinc-700 px-2.5 py-0.5 rounded-full">
                  {published.length}
                </span>
              </div>
              <div className="max-h-72 overflow-y-auto divide-y divide-slate-50">
                {published.length === 0 ? (
                  <div className="py-10 text-center text-slate-400 text-sm">
                    No posts published yet
                  </div>
                ) : (
                  published.map((post) => (
                    <div
                      key={post._id}
                      className="px-5 py-4 hover:bg-slate-50/60 transition-colors"
                    >
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex gap-1.5 items-center">
                          {post.platforms?.map((pl: string) => {
                            const meta = PLATFORMS.find((p) => p.id === pl);
                            return meta ? (
                              <meta.icon key={pl} className="size-3.5 text-slate-400" />
                            ) : null;
                          })}
                        </div>
                        <div className="flex items-center gap-2">
                          {post.mediaType && (
                            <span className="text-xs bg-slate-100 text-slate-600 border border-slate-200 px-1.5 py-0.5 rounded-md font-semibold capitalize">
                              {post.mediaType}
                            </span>
                          )}
                          <span className="text-xs text-slate-400">
                            {new Date(post.updatedAt || post.scheduledFor).toLocaleString()}
                          </span>
                          <span className="text-xs bg-emerald-50 text-emerald-700 border border-emerald-100 px-2 py-0.5 rounded-full font-semibold">
                            Published
                          </span>
                        </div>
                      </div>
                      <p className="text-sm text-slate-600 line-clamp-2 max-w-4/5">
                        {post.content}
                      </p>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Scheduler;