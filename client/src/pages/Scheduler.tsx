/* eslint-disable react-hooks/set-state-in-effect */

/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useRef, useState, type FormEvent } from "react";
import { PLATFORMS } from "../assets/assets";
import {
    ArrowRightIcon,
    CalendarDaysIcon,
    CalendarIcon,
    ClockIcon,
    ChevronLeft,
    ChevronRight,
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


type DatePickerProps = {
    value: string;
    onChange: (value: string) => void;
};

const toDateInputValue = (date: Date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
};

const parseDateInputValue = (value: string) => {
    if (!value) return null;
    const [year, month, day] = value.split("-").map(Number);
    if (!year || !month || !day) return null;

    const date = new Date(year, month - 1, day);
    return toDateInputValue(date) === value ? date : null;
};

const DatePicker = ({ value, onChange }: DatePickerProps) => {
    const today = new Date();
    const todayValue = toDateInputValue(today);
    const [isOpen, setIsOpen] = useState(false);
    const [visibleMonth, setVisibleMonth] = useState(() => {
        const selected = parseDateInputValue(value) || today;
        return new Date(selected.getFullYear(), selected.getMonth(), 1);
    });
    const pickerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const selected = parseDateInputValue(value);
        if (selected) {
            setVisibleMonth(
                new Date(selected.getFullYear(), selected.getMonth(), 1)
            );
        }
    }, [value]);

    useEffect(() => {
        const handlePointerDown = (event: MouseEvent) => {
            if (
                pickerRef.current &&
                !pickerRef.current.contains(event.target as Node)
            ) {
                setIsOpen(false);
            }
        };

        const handleKeyDown = (event: KeyboardEvent) => {
            if (event.key === "Escape") setIsOpen(false);
        };

        document.addEventListener("mousedown", handlePointerDown);
        document.addEventListener("keydown", handleKeyDown);

        return () => {
            document.removeEventListener("mousedown", handlePointerDown);
            document.removeEventListener("keydown", handleKeyDown);
        };
    }, []);

    const year = visibleMonth.getFullYear();
    const month = visibleMonth.getMonth();
    const firstWeekday = new Date(year, month, 1).getDay();
    const firstCalendarDate = new Date(year, month, 1 - firstWeekday);
    const days = Array.from({ length: 42 }, (_, index) => {
        const date = new Date(firstCalendarDate);
        date.setDate(firstCalendarDate.getDate() + index);
        return date;
    });

    const displayValue = parseDateInputValue(value)?.toLocaleDateString(
        "en-US",
        { month: "short", day: "numeric", year: "numeric" }
    );

    const selectDate = (date: Date) => {
        onChange(toDateInputValue(date));
        setIsOpen(false);
    };

    const goToMonth = (offset: number) => {
        setVisibleMonth(new Date(year, month + offset, 1));
    };

    const selectToday = () => {
        onChange(todayValue);
        setVisibleMonth(new Date(today.getFullYear(), today.getMonth(), 1));
        setIsOpen(false);
    };

    return (
        <div className="relative w-full" ref={pickerRef}>
            <button
                type="button"
                onClick={() => setIsOpen((open) => !open)}
                aria-haspopup="dialog"
                aria-expanded={isOpen}
                className={`flex w-full items-center gap-3 rounded-xl border bg-[#FDFCFA] px-3.5 py-3.5 text-left transition-all duration-200 hover:border-[#C9B9A7] focus:outline-none focus:ring-2 focus:ring-[#B97960]/10 ${
                    isOpen
                        ? "border-[#B97960] bg-white"
                        : "border-[#DED7CA]"
                }`}
            >
                <CalendarIcon className="size-[17px] shrink-0 text-[#B97960]" />
                <span
                    className={`flex-1 text-sm font-medium ${
                        value ? "text-[#292720]" : "text-[#A49C90]"
                    }`}
                >
                    {displayValue || "Select a date"}
                </span>
                <ChevronRight
                    className={`size-4 text-[#A49C90] transition-transform ${
                        isOpen ? "rotate-90" : ""
                    }`}
                />
            </button>

            {isOpen && (
                <div
                    role="dialog"
                    aria-label="Choose a date"
                    className="absolute bottom-full left-0 z-[110] mb-3 w-[min(340px,calc(100vw-2rem))] overflow-hidden rounded-2xl border border-[#DED7CA] bg-[#FFFEFC] shadow-[0_16px_45px_rgba(41,39,32,0.14)]"
                >
                    <div className="flex items-center justify-between border-b border-[#EAE4DA] bg-[#F8F7F3] px-5 py-4">
                        <div>
                            <p className="text-[9px] font-semibold uppercase tracking-[0.18em] text-[#A49A8B]">
                                Select date
                            </p>
                            <h3 className="mt-1 font-serif text-lg text-[#292720]">
                                {visibleMonth.toLocaleDateString("en-US", {
                                    month: "long",
                                    year: "numeric",
                                })}
                            </h3>
                        </div>

                        <div className="flex items-center gap-1.5">
                            <button
                                type="button"
                                onClick={() => goToMonth(-1)}
                                aria-label="Previous month"
                                className="flex size-8 items-center justify-center rounded-lg border border-[#DED7CA] bg-white text-[#817B70] transition-colors hover:border-[#B97960] hover:bg-[#F6EDE8] hover:text-[#A45F49]"
                            >
                                <ChevronLeft className="size-4" />
                            </button>
                            <button
                                type="button"
                                onClick={() => goToMonth(1)}
                                aria-label="Next month"
                                className="flex size-8 items-center justify-center rounded-lg border border-[#DED7CA] bg-white text-[#817B70] transition-colors hover:border-[#B97960] hover:bg-[#F6EDE8] hover:text-[#A45F49]"
                            >
                                <ChevronRight className="size-4" />
                            </button>
                        </div>
                    </div>

                    <div className="grid grid-cols-7 gap-1 px-3 pt-4">
                        {["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"].map(
                            (day) => (
                                <div
                                    key={day}
                                    className="py-2 text-center text-[10px] font-semibold uppercase tracking-wider text-[#A49A8B]"
                                >
                                    {day}
                                </div>
                            )
                        )}
                    </div>

                    <div className="grid grid-cols-7 gap-1 px-3 pb-4">
                        {days.map((date) => {
                            const dateValue = toDateInputValue(date);
                            const isCurrentMonth = date.getMonth() === month;
                            const isSelected = dateValue === value;
                            const isToday = dateValue === todayValue;

                            return (
                                <button
                                    key={dateValue}
                                    type="button"
                                    onClick={() => selectDate(date)}
                                    aria-pressed={isSelected}
                                    aria-label={date.toLocaleDateString(
                                        "en-US",
                                        { dateStyle: "full" }
                                    )}
                                    className={`relative flex aspect-square items-center justify-center rounded-lg text-xs font-medium transition-all duration-150 ${
                                        isSelected
                                            ? "bg-[#B97960] text-white shadow-md shadow-[#B97960]/20"
                                            : isToday
                                              ? "border border-[#B97960]/50 bg-[#F6EDE8] text-[#A45F49]"
                                              : isCurrentMonth
                                                ? "text-[#49443B] hover:bg-[#F6EDE8] hover:text-[#A45F49]"
                                                : "text-[#C5BDB1] hover:bg-[#F8F7F3] hover:text-[#817B70]"
                                    }`}
                                >
                                    {date.getDate()}
                                    {isToday && !isSelected && (
                                        <span className="absolute bottom-1 h-1 w-1 rounded-full bg-[#B97960]" />
                                    )}
                                </button>
                            );
                        })}
                    </div>

                    <div className="flex items-center justify-between border-t border-[#EAE4DA] bg-[#F8F7F3] px-4 py-3">
                        <button
                            type="button"
                            onClick={() => {
                                onChange("");
                                setIsOpen(false);
                            }}
                            className="rounded-lg px-3 py-2 text-xs font-medium text-[#817B70] transition-colors hover:bg-white hover:text-[#A45F49]"
                        >
                            Clear
                        </button>
                        <button
                            type="button"
                            onClick={selectToday}
                            className="rounded-lg bg-[#B97960] px-4 py-2 text-xs font-semibold text-white transition-colors hover:bg-[#A45F49]"
                        >
                            Today
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

type TimePickerProps = {
    value: string;
    onChange: (value: string) => void;
};

const TimePicker = ({ value, onChange }: TimePickerProps) => {
    const [isOpen, setIsOpen] = useState(false);
    const [hour, setHour] = useState("09");
    const [minute, setMinute] = useState("00");
    const [period, setPeriod] = useState<"AM" | "PM">("AM");
    const pickerRef = useRef<HTMLDivElement>(null);

    const syncDraftFromValue = () => {
        const [hoursString, minutesString] = (value || "09:00").split(":");
        const hours = Number(hoursString);
        const minutes = Number(minutesString);

        setHour(String(hours % 12 || 12).padStart(2, "0"));
        setMinute(String(Number.isFinite(minutes) ? minutes : 0).padStart(2, "0"));
        setPeriod(hours >= 12 ? "PM" : "AM");
    };

    useEffect(() => {
        const [hoursString, minutesString] = (value || "09:00").split(":");
        const hours = Number(hoursString);
        const minutes = Number(minutesString);

        setHour(String(hours % 12 || 12).padStart(2, "0"));
        setMinute(
            String(Number.isFinite(minutes) ? minutes : 0).padStart(2, "0")
        );
        setPeriod(hours >= 12 ? "PM" : "AM");
    }, [value]);

    useEffect(() => {
        const handlePointerDown = (event: MouseEvent) => {
            if (
                pickerRef.current &&
                !pickerRef.current.contains(event.target as Node)
            ) {
                setIsOpen(false);
            }
        };

        const handleKeyDown = (event: KeyboardEvent) => {
            if (event.key === "Escape") setIsOpen(false);
        };

        document.addEventListener("mousedown", handlePointerDown);
        document.addEventListener("keydown", handleKeyDown);

        return () => {
            document.removeEventListener("mousedown", handlePointerDown);
            document.removeEventListener("keydown", handleKeyDown);
        };
    }, []);

    const displayTime = value
        ? (() => {
              const [hoursString, minutesString] = value.split(":");
              const hours = Number(hoursString);
              const displayHour = hours % 12 || 12;
              return `${String(displayHour).padStart(2, "0")}:${minutesString} ${
                  hours >= 12 ? "PM" : "AM"
              }`;
          })()
        : "Select a time";

    const applyTime = () => {
        let hours = Number(hour) % 12;
        if (period === "PM") hours += 12;

        onChange(
            `${String(hours).padStart(2, "0")}:${minute}`
        );
        setIsOpen(false);
    };

    return (
        <div className="relative w-full" ref={pickerRef}>
            <button
                type="button"
                onClick={() => {
                    syncDraftFromValue();
                    setIsOpen((open) => !open);
                }}
                aria-haspopup="dialog"
                aria-expanded={isOpen}
                className={`flex w-full items-center gap-3 rounded-xl border bg-[#FDFCFA] px-3.5 py-3.5 text-left transition-all duration-200 hover:border-[#C9B9A7] focus:outline-none focus:ring-2 focus:ring-[#B97960]/10 ${
                    isOpen
                        ? "border-[#B97960] bg-white"
                        : "border-[#DED7CA]"
                }`}
            >
                <ClockIcon className="size-[17px] shrink-0 text-[#B97960]" />
                <span
                    className={`flex-1 text-sm font-medium ${
                        value ? "text-[#292720]" : "text-[#A49C90]"
                    }`}
                >
                    {displayTime}
                </span>
                <ChevronRight
                    className={`size-4 text-[#A49C90] transition-transform ${
                        isOpen ? "rotate-90" : ""
                    }`}
                />
            </button>

            {isOpen && (
                <div
                    role="dialog"
                    aria-label="Choose a time"
                    className="absolute bottom-full left-0 z-[100] mb-3 w-[min(340px,calc(100vw-2rem))] overflow-hidden rounded-2xl border border-[#DED7CA] bg-[#FFFEFC] shadow-[0_16px_45px_rgba(41,39,32,0.14)]"
                >
                    <div className="border-b border-[#EAE4DA] bg-[#F8F7F3] px-5 py-4">
                        <p className="text-[9px] font-semibold uppercase tracking-[0.18em] text-[#A49A8B]">
                            Select time
                        </p>
                        <h3 className="mt-1 font-serif text-lg text-[#292720]">
                            Choose your publishing time
                        </h3>
                    </div>

                    <div className="grid grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)_auto] items-end gap-2 px-3 py-5 sm:px-4">
                        <label className="block">
                            <span className="mb-2 block text-center text-[9px] font-semibold uppercase tracking-[0.16em] text-[#A49A8B]">
                                Hour
                            </span>
                            <select
                                aria-label="Hour"
                                value={hour}
                                onChange={(event) => setHour(event.target.value)}
                                className="h-[46px] w-full appearance-none rounded-lg border border-[#DED7CA] bg-[#F8F7F3] px-2 text-center text-base font-medium text-[#292720] outline-none transition-colors focus:border-[#B97960] focus:ring-2 focus:ring-[#B97960]/10"
                            >
                                {Array.from({ length: 12 }, (_, index) => {
                                    const option = String(index + 1).padStart(2, "0");
                                    return (
                                        <option key={option} value={option}>
                                            {option}
                                        </option>
                                    );
                                })}
                            </select>
                        </label>

                        <span className="pb-3 text-xl font-medium text-[#B97960]">
                            :
                        </span>

                        <label className="block">
                            <span className="mb-2 block text-center text-[9px] font-semibold uppercase tracking-[0.16em] text-[#A49A8B]">
                                Minute
                            </span>
                            <select
                                aria-label="Minute"
                                value={minute}
                                onChange={(event) => setMinute(event.target.value)}
                                className="h-[46px] w-full appearance-none rounded-lg border border-[#DED7CA] bg-[#F8F7F3] px-2 text-center text-base font-medium text-[#292720] outline-none transition-colors focus:border-[#B97960] focus:ring-2 focus:ring-[#B97960]/10"
                            >
                                {Array.from({ length: 60 }, (_, index) => {
                                    const option = String(index).padStart(2, "0");
                                    return (
                                        <option key={option} value={option}>
                                            {option}
                                        </option>
                                    );
                                })}
                            </select>
                        </label>

                        <div className="flex flex-col gap-1.5">
                            {(["AM", "PM"] as const).map((item) => (
                                <button
                                    key={item}
                                    type="button"
                                    onClick={() => setPeriod(item)}
                                    aria-pressed={period === item}
                                    className={`flex h-[22px] min-w-[48px] items-center justify-center rounded-md px-2 text-[10px] font-semibold transition-colors ${
                                        period === item
                                            ? "bg-[#B97960] text-white"
                                            : "border border-[#DED7CA] bg-white text-[#817B70] hover:border-[#B97960] hover:text-[#A45F49]"
                                    }`}
                                >
                                    {item}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="flex items-center justify-between border-t border-[#EAE4DA] bg-[#F8F7F3] px-4 py-3">
                        <button
                            type="button"
                            onClick={() => setIsOpen(false)}
                            className="rounded-lg px-3 py-2 text-xs font-medium text-[#817B70] transition-colors hover:bg-white hover:text-[#A45F49]"
                        >
                            Cancel
                        </button>
                        <button
                            type="button"
                            onClick={applyTime}
                            className="rounded-lg bg-[#B97960] px-4 py-2 text-xs font-semibold text-white transition-colors hover:bg-[#A45F49]"
                        >
                            Apply time
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

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
            toast.error(
                error?.response?.data?.message || error.message
            );
        }
    };

    useEffect(() => {
        void (async () => await fetchPosts())();

        const interval = setInterval(
            async () => await fetchPosts(),
            10000
        );

        return () => clearInterval(interval);
    }, []);

    const scheduled = posts.filter((p) => p.status === "scheduled");
    const published = posts.filter((p) => p.status === "published");

    const togglePlatform = (id: string) =>
        setSelectedPlatforms((prev) =>
            prev.includes(id)
                ? prev.filter((p) => p !== id)
                : [...prev, id]
        );

    const handleSelectDateSlot = (date: Date) => {
        const formattedDate = toDateInputValue(date);

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
            toast.error(
                "Instagram posts require media. Please upload an image or video."
            );
            return;
        }

        const scheduledFor = new Date(
            `${scheduledDate}T${scheduledTime}`
        ).toISOString();

        const formData = new FormData();

        formData.append("content", content);
        formData.append("scheduledFor", scheduledFor);
        formData.append("status", "scheduled");
        formData.append("platforms", JSON.stringify(selectedPlatforms));

        if (mediaFile) {
            formData.append("media", mediaFile);
        }

        setLoading(true);

        try {
            await api.post("/api/posts", formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
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
            toast.error(
                error?.response?.data?.message || error.message
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex h-full flex-col items-start gap-6 pb-16 text-[#292720] lg:flex-row">

            {/* Compose & Live Preview Panel */}
            <div className="w-full shrink-0 lg:w-[430px] xl:w-[460px]">
                <div className="relative border border-[#DED7CA] bg-[#F8F7F3]">

                    {/* Panel Header */}
                    <div className="flex items-center justify-between gap-3 border-b border-[#DED7CA] px-5 py-5 sm:px-6">
                        <div>
                            <p className="text-[10px] uppercase tracking-[0.18em] text-[#B97960]">
                                Content studio
                            </p>

                            <h2 className="mt-1 font-serif text-xl text-[#292720]">
                                {leftTab === "compose"
                                    ? "Compose Content"
                                    : "Live Mockup"}
                            </h2>

                            <p className="mt-1 text-xs text-[#A39C90]">
                                {leftTab === "compose"
                                    ? "Craft your captions and timing"
                                    : "Preview how your post renders"}
                            </p>
                        </div>

                        <div className="flex shrink-0 border border-[#DED7CA] bg-white p-1">
                            <button
                                type="button"
                                onClick={() => setLeftTab("compose")}
                                className={`flex items-center gap-1.5 px-3 py-2 text-[10px] transition-colors ${
                                    leftTab === "compose"
                                        ? "bg-[#292720] text-white"
                                        : "text-[#817B70] hover:text-[#B97960]"
                                }`}
                            >
                                <PenSquareIcon className="size-3.5" />
                                Edit
                            </button>

                            <button
                                type="button"
                                onClick={() => setLeftTab("preview")}
                                className={`flex items-center gap-1.5 px-3 py-2 text-[10px] transition-colors ${
                                    leftTab === "preview"
                                        ? "bg-[#292720] text-white"
                                        : "text-[#817B70] hover:text-[#B97960]"
                                }`}
                            >
                                <EyeIcon className="size-3.5" />
                                Preview
                            </button>
                        </div>
                    </div>

                    {/* Compose Form or Preview */}
                    <div className="p-5 sm:p-6">
                        {leftTab === "compose" ? (
                            <form
                                className="space-y-6"
                                onSubmit={handleSchedule}
                            >
                                {/* Platform Selection */}
                                <div>
                                    <label className="mb-3 block text-[10px] font-medium uppercase tracking-[0.15em] text-[#887E6F]">
                                        Target Platforms
                                    </label>

                                    <div className="flex flex-wrap gap-2">
                                        {PLATFORMS.map((p) => {
                                            const active =
                                                selectedPlatforms.includes(p.id);

                                            return (
                                                <button
                                                    key={p.id}
                                                    type="button"
                                                    onClick={() =>
                                                        togglePlatform(p.id)
                                                    }
                                                    aria-pressed={active}
                                                    className={`flex items-center gap-2 border px-3 py-2.5 text-xs transition-all duration-200 ${
                                                        active
                                                            ? "border-[#B97960] bg-[#B97960] text-white"
                                                            : "border-[#DED7CA] bg-white text-[#817B70] hover:border-[#B97960]"
                                                    }`}
                                                >
                                                    <p.icon className="size-4" />
                                                    <span className="capitalize">
                                                        {p.id}
                                                    </span>
                                                </button>
                                            );
                                        })}
                                    </div>
                                </div>

                                {/* Content Textarea */}
                                <div>
                                    <div className="mb-3 flex items-center justify-between gap-2">
                                        <label className="block text-[10px] font-medium uppercase tracking-[0.15em] text-[#887E6F]">
                                            Post Content
                                        </label>

                                        <button
                                            type="button"
                                            onClick={() =>
                                                setLeftTab("preview")
                                            }
                                            className="flex items-center gap-1 text-[10px] text-[#B97960] transition-colors hover:text-[#A56750]"
                                        >
                                            <EyeIcon className="size-3" />
                                            Preview feed
                                        </button>
                                    </div>

                                    <textarea
                                        required
                                        rows={5}
                                        placeholder="What do you want to share today? Add hashtags and mentions..."
                                        className="w-full resize-none border border-[#DED7CA] bg-white px-4 py-3.5 text-sm leading-7 text-[#292720] outline-none transition-colors placeholder:text-[#A39C90] focus:border-[#B97960]"
                                        value={content}
                                        onChange={(e) =>
                                            setContent(e.target.value)
                                        }
                                    />

                                    <div
                                        className={`mt-2 text-right text-[10px] ${
                                            content.length > 270
                                                ? "text-red-500"
                                                : "text-[#A39C90]"
                                        }`}
                                    >
                                        {content.length}/280
                                    </div>
                                </div>

                                {/* Media Upload */}
                                <div>
                                    <label className="mb-3 block text-[10px] font-medium uppercase tracking-[0.15em] text-[#887E6F]">
                                        Media (Optional)
                                    </label>

                                    {mediaFile ? (
                                        <div className="relative overflow-hidden border border-[#DED7CA] bg-[#F1EDE4]">
                                            {mediaFile.type.startsWith("image/") ? (
                                                <img
                                                    src={URL.createObjectURL(mediaFile)}
                                                    alt="Media preview"
                                                    className="h-44 w-full object-cover"
                                                />
                                            ) : (
                                                <video
                                                    src={URL.createObjectURL(mediaFile)}
                                                    className="h-44 w-full object-cover"
                                                    controls
                                                />
                                            )}

                                            <button
                                                type="button"
                                                onClick={() =>
                                                    setMediaFile(null)
                                                }
                                                aria-label="Remove media"
                                                className="absolute right-3 top-3 flex size-8 items-center justify-center rounded-full bg-[#292720]/80 text-white transition-colors hover:bg-[#B97960]"
                                            >
                                                <XIcon className="size-4" />
                                            </button>
                                        </div>
                                    ) : (
                                        <label className="group flex cursor-pointer flex-col items-center justify-center gap-2 border border-dashed border-[#CFC6B8] bg-white px-5 py-7 text-center transition-colors hover:border-[#B97960] hover:bg-[#F1EDE4]/50">
                                            <div className="flex size-9 items-center justify-center border border-[#DED7CA] bg-[#F1EDE4] text-[#B97960]">
                                                <ArrowRightIcon className="size-4 -rotate-45" />
                                            </div>

                                            <span className="text-xs text-[#686257] transition-colors group-hover:text-[#B97960]">
                                                Click to attach photo or video
                                            </span>

                                            <span className="text-[10px] text-[#A39C90]">
                                                Image or video files
                                            </span>

                                            <input
                                                type="file"
                                                accept="image/*,video/*"
                                                className="hidden"
                                                onChange={(e) =>
                                                    e.target.files?.[0] &&
                                                    setMediaFile(e.target.files[0])
                                                }
                                            />
                                        </label>
                                    )}
                                </div>

                                {/* Date & Time */}
                                <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                                    <div>
                                        <label className="mb-2 block text-[10px] font-semibold uppercase tracking-[0.16em] text-[#817B70]">
                                            Date
                                        </label>
                                        <DatePicker
                                            value={scheduledDate}
                                            onChange={setScheduledDate}
                                        />
                                    </div>

                                    <div>
                                        <label className="mb-2 block text-[10px] font-semibold uppercase tracking-[0.16em] text-[#817B70]">
                                            Time
                                        </label>
                                        <TimePicker
                                            value={scheduledTime}
                                            onChange={setScheduledTime}
                                        />
                                    </div>
                                </div>

                                {/* Submit */}
                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="flex w-full items-center justify-center gap-2 bg-[#292720] py-3.5 text-xs font-medium tracking-wide text-white transition-colors duration-300 hover:bg-[#B97960] disabled:cursor-not-allowed disabled:opacity-50"
                                >
                                    {loading ? (
                                        <>
                                            <span className="size-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                                            Scheduling...
                                        </>
                                    ) : (
                                        <>
                                            Schedule Post
                                            <ArrowRightIcon className="size-4" />
                                        </>
                                    )}
                                </button>
                            </form>
                        ) : (
                            /* Live Feed Preview */
                            <div className="space-y-5">
                                <FeedPreview
                                    content={content}
                                    mediaFile={mediaFile}
                                    selectedPlatforms={
                                        selectedPlatforms.length > 0
                                            ? selectedPlatforms
                                            : ["instagram"]
                                    }
                                />

                                <button
                                    type="button"
                                    onClick={() => setLeftTab("compose")}
                                    className="w-full border border-[#DED7CA] bg-white py-3 text-xs text-[#686257] transition-colors hover:border-[#B97960] hover:text-[#B97960]"
                                >
                                    ← Back to Edit
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Calendar & Queue Panel */}
            <div className="flex min-w-0 w-full flex-1 flex-col gap-6">

                {/* View Switcher */}
                <div className="flex flex-col gap-4 border border-[#DED7CA] bg-[#F8F7F3] px-5 py-5 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <p className="text-[10px] uppercase tracking-[0.16em] text-[#B97960]">
                            Publishing planner
                        </p>

                        <h3 className="mt-1 font-serif text-xl text-[#292720]">
                            {viewMode === "calendar"
                                ? "Content Calendar"
                                : "Feed Queue"}
                        </h3>

                        <p className="mt-1 text-xs text-[#A39C90]">
                            {viewMode === "calendar"
                                ? "Drag cards across dates to reschedule instantly"
                                : "Chronological list of all posts"}
                        </p>
                    </div>

                    <div className="flex shrink-0 border border-[#DED7CA] bg-white p-1">
                        <button
                            type="button"
                            onClick={() => setViewMode("calendar")}
                            className={`flex flex-1 items-center justify-center gap-1.5 px-3 py-2 text-xs transition-colors sm:flex-none ${
                                viewMode === "calendar"
                                    ? "bg-[#292720] text-white"
                                    : "text-[#817B70] hover:text-[#B97960]"
                            }`}
                        >
                            <CalendarIcon className="size-3.5" />
                            Calendar
                        </button>

                        <button
                            type="button"
                            onClick={() => setViewMode("queue")}
                            className={`flex flex-1 items-center justify-center gap-1.5 px-3 py-2 text-xs transition-colors sm:flex-none ${
                                viewMode === "queue"
                                    ? "bg-[#292720] text-white"
                                    : "text-[#817B70] hover:text-[#B97960]"
                            }`}
                        >
                            <LayoutListIcon className="size-3.5" />
                            Queue ({scheduled.length})
                        </button>
                    </div>
                </div>

                {/* Dynamic Display */}
                {viewMode === "calendar" ? (
                    <CalendarView
                        posts={posts}
                        onRefresh={fetchPosts}
                        onSelectDateSlot={handleSelectDateSlot}
                    />
                ) : (
                    <div className="flex flex-col gap-6">

                        {/* Upcoming Posts */}
                        <div className="overflow-hidden border border-[#DED7CA] bg-[#F8F7F3]">
                            <div className="flex items-center gap-3 border-b border-[#DED7CA] px-5 py-5">
                                <CalendarDaysIcon className="size-4 text-[#B97960]" />

                                <h3 className="font-serif text-lg text-[#292720]">
                                    Upcoming Posts
                                </h3>

                                <span className="ml-auto border border-[#DED7CA] px-2.5 py-1 text-[10px] text-[#817B70]">
                                    {scheduled.length}
                                </span>
                            </div>

                            <div className="max-h-72 divide-y divide-[#EAE5DB] overflow-y-auto">
                                {scheduled.length === 0 ? (
                                    <div className="py-12 text-center text-sm text-[#A39C90]">
                                        No posts scheduled yet
                                    </div>
                                ) : (
                                    scheduled.map((post) => (
                                        <div
                                            key={post._id}
                                            className="px-5 py-5 transition-colors hover:bg-[#F1EDE4]/60"
                                        >
                                            <div className="mb-3 flex flex-wrap items-center justify-between gap-3">
                                                <div className="flex items-center gap-2">
                                                    {post.platforms?.map((pl: string) => {
                                                        const meta = PLATFORMS.find(
                                                            (p) => p.id === pl
                                                        );

                                                        return meta ? (
                                                            <meta.icon
                                                                key={pl}
                                                                className="size-4 text-[#B97960]"
                                                            />
                                                        ) : null;
                                                    })}
                                                </div>

                                                <div className="flex flex-wrap items-center gap-2">
                                                    {post.mediaType && (
                                                        <span className="border border-[#DED7CA] bg-[#F1EDE4] px-2 py-1 text-[10px] capitalize text-[#817B70]">
                                                            {post.mediaType}
                                                        </span>
                                                    )}

                                                    <span className="text-[10px] text-[#A39C90]">
                                                        {new Date(
                                                            post.scheduledFor
                                                        ).toLocaleString()}
                                                    </span>
                                                </div>
                                            </div>

                                            <p className="line-clamp-2 text-sm leading-6 text-[#686257]">
                                                {post.content}
                                            </p>
                                        </div>
                                    ))
                                )}
                            </div>
                        </div>

                        {/* Published Posts */}
                        <div className="overflow-hidden border border-[#DED7CA] bg-[#F8F7F3]">
                            <div className="flex items-center gap-3 border-b border-[#DED7CA] px-5 py-5">
                                <SendIcon className="size-4 text-[#B97960]" />

                                <h3 className="font-serif text-lg text-[#292720]">
                                    Published Posts
                                </h3>

                                <span className="ml-auto border border-[#DED7CA] px-2.5 py-1 text-[10px] text-[#817B70]">
                                    {published.length}
                                </span>
                            </div>

                            <div className="max-h-72 divide-y divide-[#EAE5DB] overflow-y-auto">
                                {published.length === 0 ? (
                                    <div className="py-12 text-center text-sm text-[#A39C90]">
                                        No posts published yet
                                    </div>
                                ) : (
                                    published.map((post) => (
                                        <div
                                            key={post._id}
                                            className="px-5 py-5 transition-colors hover:bg-[#F1EDE4]/60"
                                        >
                                            <div className="mb-3 flex flex-wrap items-center justify-between gap-3">
                                                <div className="flex items-center gap-2">
                                                    {post.platforms?.map((pl: string) => {
                                                        const meta = PLATFORMS.find(
                                                            (p) => p.id === pl
                                                        );

                                                        return meta ? (
                                                            <meta.icon
                                                                key={pl}
                                                                className="size-4 text-[#B97960]"
                                                            />
                                                        ) : null;
                                                    })}
                                                </div>

                                                <div className="flex flex-wrap items-center gap-2">
                                                    {post.mediaType && (
                                                        <span className="border border-[#DED7CA] bg-[#F1EDE4] px-2 py-1 text-[10px] capitalize text-[#817B70]">
                                                            {post.mediaType}
                                                        </span>
                                                    )}

                                                    <span className="text-[10px] text-[#A39C90]">
                                                        {new Date(
                                                            post.updatedAt ||
                                                            post.scheduledFor
                                                        ).toLocaleString()}
                                                    </span>

                                                    <span className="border border-[#DED7CA] bg-[#F1EDE4] px-2 py-1 text-[10px] text-[#B97960]">
                                                        Published
                                                    </span>
                                                </div>
                                            </div>

                                            <p className="line-clamp-2 text-sm leading-6 text-[#686257]">
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
