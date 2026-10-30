import { useEffect, useRef, useState } from "react";
import { Clock, ChevronRight } from "lucide-react";

interface TimePickerProps {
    value: string;
    onChange: (time: string) => void;
    required?: boolean;
}

const parseTime = (value: string) => {
    if (!value || !/^\d{2}:\d{2}$/.test(value)) return null;

    const [hours, minutes] = value.split(":").map(Number);

    if (hours < 0 || hours > 23 || minutes < 0 || minutes > 59) {
        return null;
    }

    return { hours, minutes };
};

const formatDisplayTime = (value: string) => {
    const time = parseTime(value);
    if (!time) return "";

    const hour = time.hours % 12 || 12;
    const period = time.hours >= 12 ? "PM" : "AM";

    return `${String(hour).padStart(2, "0")}:${String(time.minutes).padStart(2, "0")} ${period}`;
};

export default function TimePicker({
    value,
    onChange,
    required = false,
}: TimePickerProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [hour, setHour] = useState("09");
    const [minute, setMinute] = useState("00");
    const [period, setPeriod] = useState<"AM" | "PM">("AM");

    const pickerRef = useRef<HTMLDivElement>(null);

    const syncDraftFromValue = () => {
        const time = parseTime(value) || { hours: 9, minutes: 0 };

        setHour(String(time.hours % 12 || 12).padStart(2, "0"));
        setMinute(String(time.minutes).padStart(2, "0"));
        setPeriod(time.hours >= 12 ? "PM" : "AM");
    };

    useEffect(() => {
        if (!isOpen) return;

        const handleOutsideClick = (event: MouseEvent) => {
            if (
                pickerRef.current &&
                !pickerRef.current.contains(event.target as Node)
            ) {
                setIsOpen(false);
            }
        };

        const handleEscape = (event: KeyboardEvent) => {
            if (event.key === "Escape") setIsOpen(false);
        };

        document.addEventListener("mousedown", handleOutsideClick);
        document.addEventListener("keydown", handleEscape);

        return () => {
            document.removeEventListener("mousedown", handleOutsideClick);
            document.removeEventListener("keydown", handleEscape);
        };
    }, [isOpen]);

    const openPicker = () => {
        syncDraftFromValue();
        setIsOpen((open) => !open);
    };

    const applyTime = () => {
        let hours = Number(hour) % 12;
        if (period === "PM") hours += 12;

        onChange(`${String(hours).padStart(2, "0")}:${minute}`);
        setIsOpen(false);
    };

    const clearTime = () => {
        onChange("");
        setIsOpen(false);
    };

    return (
        <div className="relative w-full" ref={pickerRef}>
            {/* Time Input */}
            <button
                type="button"
                onClick={openPicker}
                className={`flex w-full items-center gap-3 rounded-xl border bg-[#FDFCFA] px-3.5 py-3.5 text-left transition-all duration-200 hover:border-[#C9B9A7] focus:outline-none focus:ring-2 focus:ring-[#B97960]/10 ${
                    isOpen
                        ? "border-[#B97960] bg-white"
                        : "border-[#DED7CA]"
                }`}
                aria-haspopup="dialog"
                aria-expanded={isOpen}
            >
                <Clock
                    size={17}
                    className="shrink-0 text-[#B97960]"
                />

                <span
                    className={`flex-1 text-sm font-medium ${
                        value ? "text-[#292720]" : "text-[#A49C90]"
                    }`}
                >
                    {value ? formatDisplayTime(value) : "Select a time"}
                </span>

                <ChevronRight
                    size={16}
                    className={`text-[#A49C90] transition-transform duration-200 ${
                        isOpen ? "rotate-90" : ""
                    }`}
                />
            </button>

            {/* Time Picker Popup */}
            {isOpen && (
                <div
                    role="dialog"
                    aria-label="Choose a time"
                    className="absolute left-0 top-full z-[100] mt-3 w-[min(340px,calc(100vw-2rem))] overflow-hidden rounded-2xl border border-[#DED7CA] bg-[#FFFEFC] shadow-[0_16px_45px_rgba(41,39,32,0.13)]"
                >
                    {/* Popup Header */}
                    <div className="border-b border-[#EAE4DA] bg-[#F8F7F3] px-5 py-4">
                        <p className="text-[9px] font-semibold uppercase tracking-[0.18em] text-[#A49A8B]">
                            Select time
                        </p>

                        <h3 className="mt-1 font-serif text-lg text-[#292720]">
                            Choose your publishing time
                        </h3>
                    </div>

                    {/* Time Controls */}
                    <div className="grid grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)_auto] items-end gap-2 px-3 py-5 sm:px-4">
                        <label className="block min-w-0">
                            <span className="mb-2 block text-center text-[10px] font-semibold uppercase tracking-wider text-[#A49A8B]">
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

                        <label className="block min-w-0">
                            <span className="mb-2 block text-center text-[10px] font-semibold uppercase tracking-wider text-[#A49A8B]">
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
                                    className={`flex h-[22px] min-w-[48px] items-center justify-center rounded-md px-2 text-[10px] font-semibold transition-all ${
                                        period === item
                                            ? "bg-[#B97960] text-white"
                                            : "border border-[#DED7CA] bg-white text-[#817B70] hover:border-[#B97960] hover:bg-[#F6EDE8] hover:text-[#B97960]"
                                    }`}
                                >
                                    {item}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Popup Footer */}
                    <div className="flex items-center justify-between border-t border-[#EAE4DA] bg-[#F8F7F3] px-4 py-3">
                        <button
                            type="button"
                            onClick={clearTime}
                            className="rounded-lg px-3 py-2 text-xs font-medium text-[#817B70] transition-colors hover:bg-white hover:text-[#A45F49]"
                        >
                            Clear
                        </button>

                        <button
                            type="button"
                            onClick={applyTime}
                            className="rounded-lg bg-[#B97960] px-4 py-2 text-xs font-semibold text-white transition-all hover:bg-[#A45F49] active:scale-95"
                        >
                            Apply time
                        </button>
                    </div>
                </div>
            )}

            {/* Required field validation */}
            <input
                type="text"
                tabIndex={-1}
                aria-hidden="true"
                required={required}
                value={value}
                readOnly
                className="pointer-events-none absolute h-px w-px opacity-0"
            />
        </div>
    );
}
