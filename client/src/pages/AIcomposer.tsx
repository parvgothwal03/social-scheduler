
import { useEffect, useState } from "react";
import { PLATFORMS } from "../assets/assets";
import {
    ArrowRightIcon,
    CalendarIcon,
    ClockIcon,
    HistoryIcon,
    Loader2Icon,
    TimerIcon,
    Wand2Icon,
    XIcon,
} from "lucide-react";
import api from "../api/axios";
import toast from "react-hot-toast";

type Generation = {
    _id: string;
    prompt: string;
    content: string;
    mediaUrl?: string;
    mediaType?: string;
    tone?: string;
    createdAt?: string;
};

const AIcomposer = () => {
    const [prompt, setPrompt] = useState("");
    const [tone, setTone] = useState("Professional");
    const [generateImage, setGenerateImage] = useState(true);
    const [loading, setLoading] = useState(false);
    const [generations, setGenerations] = useState<Generation[]>([]);

    // Scheduling State
    const [activeScheduler, setActiveScheduler] = useState<Generation | null>(null);
    const [selectedPlatforms, setSelectedPlatforms] = useState<string[]>([]);
    const [scheduledDate, setScheduledDate] = useState("");
    const [scheduledTime, setScheduledTime] = useState("");
    const [scheduling, setScheduling] = useState(false);

    const fetchGenerations = async () => {
        try {
            const { data } = await api.get("/api/posts/generations");
            setGenerations(Array.isArray(data) ? data.filter(Boolean) : []);
        } catch {
            toast.error("Failed to fetch generations. Please try again later.");
        }
    };

    useEffect(() => {
        void (async () => {
            await fetchGenerations();
        })();
    }, []);

    const handleGenerate = async () => {
        if (!prompt) {
            toast.error("Please enter a prompt to generate content.");
            return;
        }

        setLoading(true);

        try {
            const { data } = await api.post("/api/posts/generate", {
                prompt,
                tone,
                generateImage,
            });

            if (!data || !data._id) {
                throw new Error("AI generation returned invalid data");
            }

            setGenerations((prev) => [data, ...prev]);
            setActiveScheduler(data);
            toast.success("Content generated successfully!");
        } catch (error: unknown) {
            const message =
                error && typeof error === "object" && "response" in error
                    ? (
                        error as {
                            response?: {
                                data?: { message?: string };
                            };
                        }
                    ).response?.data?.message
                    : undefined;

            toast.error(
                message || "Failed to generate content. Please try again later."
            );
        } finally {
            setLoading(false);
        }
    };

    const handleSchedule = async () => {
        if (!activeScheduler) return;

        if (selectedPlatforms.length === 0) {
            toast.error("Please select at least one platform to schedule the post.");
            return;
        }

        if (!scheduledDate || !scheduledTime) {
            toast.error("Please select a valid date and time for scheduling.");
            return;
        }

        const scheduledFor = new Date(
            `${scheduledDate}T${scheduledTime}`
        ).toISOString();

        setScheduling(true);

        try {
            await api.post("/api/posts", {
                content: activeScheduler.content,
                mediaUrl: activeScheduler.mediaUrl,
                mediaType:
                    activeScheduler.mediaType ||
                    (activeScheduler.mediaUrl ? "image" : undefined),
                platforms: selectedPlatforms,
                scheduledFor,
                status: "scheduled",
            });

            toast.success("AI Post scheduled successfully!");

            setActiveScheduler(null);
            setSelectedPlatforms([]);
            setScheduledDate("");
            setScheduledTime("");

            await fetchGenerations();
        } catch (error: unknown) {
            const message =
                error && typeof error === "object" && "response" in error
                    ? (
                        error as {
                            response?: {
                                data?: { message?: string };
                            };
                        }
                    ).response?.data?.message
                    : undefined;

            toast.error(
                message || "Failed to schedule post. Please try again later."
            );
        } finally {
            setScheduling(false);
        }
    };

    const tones = [
        "Professional",
        "Creative",
        "Funny",
        "Minimalist",
        "Excited",
    ];

    return (
        <div className="mx-auto max-w-5xl space-y-12 pb-20 text-[#292720]">

            {/* Composer Header */}
            <div className="pt-6 text-center sm:pt-10">
                <div className="mb-4 inline-flex items-center gap-2 text-[10px] uppercase tracking-[0.2em] text-[#B97960]">
                    <Wand2Icon className="size-3.5" />
                    AI content studio
                </div>

                <h1 className="font-serif text-3xl tracking-tight text-[#292720] sm:text-4xl lg:text-5xl">
                    What would you like to create today?
                </h1>

                <p className="mx-auto mt-4 max-w-xl text-sm leading-7 text-[#817B70]">
                    Turn your ideas into engaging social media content.
                    Choose your tone, generate your post, and schedule it.
                </p>
            </div>

            {/* Input Section */}
            <section className="space-y-6">
                <div className="overflow-hidden border border-[#DED7CA] bg-[#F8F7F3]">
                    <textarea
                        className="min-h-48 w-full resize-none border-0 bg-transparent px-6 py-6 text-sm leading-7 text-[#292720] outline-none placeholder:text-[#A39C90] focus:ring-0 sm:px-8"
                        placeholder="Share your idea... (e.g. A post about the launch of our new eco-friendly coffee beans)"
                        value={prompt}
                        onChange={(e) => setPrompt(e.target.value)}
                    />

                    <div className="flex flex-col gap-4 border-t border-[#DED7CA] px-5 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-6">
                        <button
                            type="button"
                            onClick={() => setGenerateImage(!generateImage)}
                            className="inline-flex w-fit items-center gap-3 text-xs text-[#686257]"
                        >
                            <span>Generate AI image</span>

                            <span
                                className={`relative inline-flex h-5 w-9 shrink-0 rounded-full transition-colors duration-200 ${
                                    generateImage
                                        ? "bg-[#B97960]"
                                        : "bg-[#D8D2C7]"
                                }`}
                            >
                                <span
                                    className={`pointer-events-none absolute top-0.5 size-4 rounded-full bg-white shadow-sm transition-transform duration-200 ${
                                        generateImage
                                            ? "translate-x-4"
                                            : "translate-x-0.5"
                                    }`}
                                />
                            </span>
                        </button>

                        <button
                            type="button"
                            onClick={handleGenerate}
                            disabled={loading}
                            className="inline-flex items-center justify-center gap-2 bg-[#292720] px-6 py-3 text-xs font-medium tracking-wide text-white transition-colors duration-300 hover:bg-[#B97960] disabled:cursor-not-allowed disabled:opacity-60"
                        >
                            {loading ? (
                                <>
                                    <Loader2Icon className="size-4 animate-spin" />
                                    Generating...
                                </>
                            ) : (
                                <>
                                    Generate content
                                    <ArrowRightIcon className="size-4" />
                                </>
                            )}
                        </button>
                    </div>
                </div>

                {/* Tone Selection */}
                <div className="flex flex-wrap items-center justify-center gap-2">
                    <span className="mr-2 text-[10px] uppercase tracking-[0.15em] text-[#A39C90]">
                        Tone
                    </span>

                    {tones.map((t) => (
                        <button
                            type="button"
                            key={t}
                            onClick={() => setTone(t)}
                            className={`border px-4 py-2 text-xs transition-all duration-200 ${
                                tone === t
                                    ? "border-[#B97960] bg-[#B97960] text-white"
                                    : "border-[#DED7CA] bg-[#F8F7F3] text-[#817B70] hover:border-[#B97960] hover:text-[#B97960]"
                            }`}
                        >
                            {t}
                        </button>
                    ))}
                </div>
            </section>

            {/* AI Generated Posts */}
            <section className="space-y-6 border-t border-[#DED7CA] pt-10">
                <div className="flex items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                        <div className="flex size-9 items-center justify-center border border-[#DED7CA] bg-[#F1EDE4] text-[#B97960]">
                            <HistoryIcon className="size-4" />
                        </div>

                        <div>
                            <h2 className="font-serif text-xl text-[#292720]">
                                Recent Generations
                            </h2>

                            <p className="mt-1 text-xs text-[#A39C90]">
                                Your previously created content
                            </p>
                        </div>
                    </div>

                    <span className="border border-[#DED7CA] px-3 py-1.5 text-[10px] uppercase tracking-wider text-[#817B70]">
                        {generations.length} total
                    </span>
                </div>

                <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
                    {generations.map((gen, index) => (
                        <div
                            key={
                                gen?._id ||
                                `${gen?.prompt || "generation"}-${index}`
                            }
                            className="group flex flex-col border border-[#DED7CA] bg-[#F8F7F3] p-5 transition-colors duration-300 hover:border-[#B97960]"
                        >
                            <div className="flex items-center justify-between gap-2">
                                <span className="text-[10px] text-[#A39C90]">
                                    {gen.createdAt
                                        ? new Date(gen.createdAt).toLocaleString()
                                        : "Just now"}
                                </span>

                                <span className="bg-[#F1EDE4] px-2.5 py-1 text-[10px] uppercase tracking-wider text-[#B97960]">
                                    {gen.tone}
                                </span>
                            </div>

                            <p className="mt-5 line-clamp-4 flex-1 text-sm leading-7 text-[#686257]">
                                {gen.content}
                            </p>

                            {gen.mediaUrl && (
                                <div className="mt-5 overflow-hidden border border-[#DED7CA] bg-[#F1EDE4]">
                                    <img
                                        src={gen.mediaUrl}
                                        alt="Generated media"
                                        className="aspect-video w-full object-cover transition-opacity duration-300 group-hover:opacity-95"
                                    />
                                </div>
                            )}

                            <button
                                type="button"
                                onClick={() => setActiveScheduler(gen)}
                                className="mt-5 flex w-full items-center justify-center gap-2 border border-[#DED7CA] py-3 text-xs font-medium text-[#686257] transition-all duration-300 hover:border-[#B97960] hover:bg-[#B97960] hover:text-white"
                            >
                                Schedule Post
                                <ArrowRightIcon className="size-3.5" />
                            </button>
                        </div>
                    ))}

                    {generations.length === 0 && (
                        <div className="col-span-full flex flex-col items-center justify-center border border-dashed border-[#DED7CA] px-6 py-20 text-center">
                            <div className="mb-4 flex size-12 items-center justify-center border border-[#DED7CA] bg-[#F1EDE4] text-[#B97960]">
                                <Wand2Icon className="size-5" />
                            </div>

                            <p className="text-sm text-[#686257]">
                                No content generated yet
                            </p>

                            <p className="mt-2 max-w-sm text-xs leading-6 text-[#A39C90]">
                                Try generating your first post using the AI
                                composer above.
                            </p>
                        </div>
                    )}
                </div>
            </section>

            {/* Scheduler Modal */}
            {activeScheduler && (
                <div className="fixed inset-0 z-50 flex min-h-screen items-center justify-center bg-[#292720]/50 p-4 backdrop-blur-sm">
                    <div className="flex max-h-[90vh] w-full max-w-2xl flex-col overflow-hidden border border-[#DED7CA] bg-[#F8F7F3] shadow-2xl">

                        {/* Modal Header */}
                        <div className="flex items-center justify-between border-b border-[#DED7CA] px-6 py-5 sm:px-8">
                            <div>
                                <p className="text-[10px] uppercase tracking-[0.18em] text-[#B97960]">
                                    Content planner
                                </p>

                                <h3 className="mt-1 font-serif text-xl text-[#292720]">
                                    Schedule Generation
                                </h3>
                            </div>

                            <button
                                type="button"
                                onClick={() => setActiveScheduler(null)}
                                className="flex size-9 items-center justify-center border border-[#DED7CA] text-[#817B70] transition-colors hover:border-[#B97960] hover:text-[#B97960]"
                                aria-label="Close scheduler"
                            >
                                <XIcon className="size-4" />
                            </button>
                        </div>

                        {/* Modal Content */}
                        <div className="flex-1 space-y-5 overflow-y-auto p-6 sm:p-8">
                            <div className="space-y-3 border border-[#DED7CA] bg-white p-5">
                                <p className="text-[10px] uppercase tracking-[0.16em] text-[#A39C90]">
                                    Original prompt
                                </p>

                                <p className="whitespace-pre-wrap text-sm leading-7 text-[#686257]">
                                    {activeScheduler?.prompt}
                                </p>
                            </div>

                            <div className="space-y-4 border border-[#DED7CA] bg-white p-5">
                                <p className="text-[10px] uppercase tracking-[0.16em] text-[#A39C90]">
                                    Generated content
                                </p>

                                <p className="whitespace-pre-wrap text-sm leading-7 text-[#292720]">
                                    {activeScheduler?.content}
                                </p>

                                {activeScheduler?.mediaUrl && (
                                    <img
                                        src={activeScheduler.mediaUrl}
                                        alt="Generated media"
                                        className="aspect-video w-full border border-[#DED7CA] object-cover"
                                    />
                                )}
                            </div>
                        </div>

                        {/* Scheduling Options */}
                        <div className="space-y-6 border-t border-[#DED7CA] bg-[#F1EDE4]/60 p-6 sm:p-8">
                            <div className="space-y-4">
                                <label className="block text-[10px] uppercase tracking-[0.16em] text-[#817B70]">
                                    Select platforms
                                </label>

                                <div className="flex flex-wrap gap-2">
                                    {PLATFORMS.map((p) => {
                                        const active = selectedPlatforms.includes(p.id);

                                        return (
                                            <button
                                                type="button"
                                                key={p.id}
                                                onClick={() =>
                                                    setSelectedPlatforms((prev) =>
                                                        prev.includes(p.id)
                                                            ? prev.filter((x) => x !== p.id)
                                                            : [...prev, p.id]
                                                    )
                                                }
                                                aria-label={p.id}
                                                aria-pressed={active}
                                                className={`flex items-center gap-2 border px-3 py-2.5 text-xs transition-colors ${
                                                    active
                                                        ? "border-[#B97960] bg-[#B97960] text-white"
                                                        : "border-[#DED7CA] bg-white text-[#817B70] hover:border-[#B97960]"
                                                }`}
                                            >
                                                <p.icon className="size-4" />
                                                <span className="capitalize">
                                                    {p.name || p.id.replace(/_/g, " ")}
                                                </span>
                                            </button>
                                        );
                                    })}
                                </div>
                            </div>

                            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                                <div className="relative">
                                    <CalendarIcon className="absolute left-4 top-1/2 size-4 -translate-y-1/2 text-[#B97960]" />

                                    <input
                                        type="date"
                                        className="w-full border border-[#DED7CA] bg-white py-3 pl-11 pr-3 text-sm text-[#292720] outline-none transition-colors focus:border-[#B97960]"
                                        value={scheduledDate}
                                        onChange={(e) => setScheduledDate(e.target.value)}
                                    />
                                </div>

                                <div className="relative">
                                    <ClockIcon className="absolute left-4 top-1/2 size-4 -translate-y-1/2 text-[#B97960]" />

                                    <input
                                        type="time"
                                        className="w-full border border-[#DED7CA] bg-white py-3 pl-11 pr-3 text-sm text-[#292720] outline-none transition-colors focus:border-[#B97960]"
                                        value={scheduledTime}
                                        onChange={(e) => setScheduledTime(e.target.value)}
                                    />
                                </div>
                            </div>

                            <button
                                type="button"
                                onClick={handleSchedule}
                                disabled={scheduling}
                                className="flex w-full items-center justify-center gap-2 bg-[#292720] py-3.5 text-xs font-medium tracking-wide text-white transition-colors duration-300 hover:bg-[#B97960] disabled:cursor-not-allowed disabled:opacity-60"
                            >
                                {scheduling ? (
                                    <Loader2Icon className="size-4 animate-spin" />
                                ) : (
                                    <TimerIcon className="size-4" />
                                )}

                                {scheduling ? "Scheduling..." : "Schedule Post"}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AIcomposer;
