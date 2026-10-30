
import { useEffect, useRef, useState } from "react";
import {
    CalendarDays,
    ChevronLeft,
    ChevronRight,
} from "lucide-react";

interface DatePickerProps {
    value: string;
    onChange: (date: string) => void;
    required?: boolean;
}

const weekdays = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];

const formatDate = (date: Date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");

    return `${year}-${month}-${day}`;
};

const parseDate = (value: string) => {
    if (!value) return null;

    const [year, month, day] = value.split("-").map(Number);

    if (!year || !month || !day) return null;

    const date = new Date(year, month - 1, day);

    return formatDate(date) === value ? date : null;
};

const formatDisplayDate = (value: string) => {
    const date = parseDate(value);

    if (!date) return "";

    return date.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
    });
};

export default function DatePicker({
    value,
    onChange,
    required = false,
}: DatePickerProps) {
    const today = new Date();
    const todayString = formatDate(today);

    const [isOpen, setIsOpen] = useState(false);
    const [visibleMonth, setVisibleMonth] = useState(() => {
        const selected = parseDate(value);
        const initial = selected || today;

        return new Date(
            initial.getFullYear(),
            initial.getMonth(),
            1
        );
    });

    const calendarRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const selected = parseDate(value);

        if (selected) {
            // eslint-disable-next-line react-hooks/set-state-in-effect
            setVisibleMonth(
                new Date(
                    selected.getFullYear(),
                    selected.getMonth(),
                    1
                )
            );
        }
    }, [value]);

    useEffect(() => {
        const handleOutsideClick = (event: MouseEvent) => {
            if (
                calendarRef.current &&
                !calendarRef.current.contains(event.target as Node)
            ) {
                setIsOpen(false);
            }
        };

        const handleEscape = (event: KeyboardEvent) => {
            if (event.key === "Escape") {
                setIsOpen(false);
            }
        };

        document.addEventListener("mousedown", handleOutsideClick);
        document.addEventListener("keydown", handleEscape);

        return () => {
            document.removeEventListener("mousedown", handleOutsideClick);
            document.removeEventListener("keydown", handleEscape);
        };
    }, []);

    const year = visibleMonth.getFullYear();
    const month = visibleMonth.getMonth();

    const firstDay = new Date(year, month, 1).getDay();

    const calendarStart = new Date(year, month, 1 - firstDay);

    const calendarDays = Array.from({ length: 42 }, (_, index) => {
        const date = new Date(calendarStart);

        date.setDate(calendarStart.getDate() + index);

        return date;
    });

    const previousMonth = () => {
        setVisibleMonth(new Date(year, month - 1, 1));
    };

    const nextMonth = () => {
        setVisibleMonth(new Date(year, month + 1, 1));
    };

    const selectDate = (date: Date) => {
        onChange(formatDate(date));
        setIsOpen(false);
    };

    const selectToday = () => {
        onChange(todayString);
        setVisibleMonth(new Date(today.getFullYear(), today.getMonth(), 1));
        setIsOpen(false);
    };

    const clearDate = () => {
        onChange("");
        setIsOpen(false);
    };

    return (
        <div className="relative w-full" ref={calendarRef}>
            {/* Date Input */}
            <button
                type="button"
                onClick={() => setIsOpen(!isOpen)}
                className={`flex w-full items-center gap-3 rounded-xl border bg-[#FDFCFA] px-3.5 py-3.5 text-left transition-all duration-200 hover:border-[#C9B9A7] focus:outline-none focus:ring-2 focus:ring-[#B97960]/10 ${
                    isOpen
                        ? "border-[#B97960] bg-white"
                        : "border-[#DED7CA]"
                }`}
                aria-haspopup="dialog"
                aria-expanded={isOpen}
            >
                <CalendarDays
                    size={17}
                    className="shrink-0 text-[#B97960]"
                />

                <span
                    className={`flex-1 text-sm font-medium ${
                        value ? "text-[#292720]" : "text-[#A49C90]"
                    }`}
                >
                    {value
                        ? formatDisplayDate(value)
                        : "Select a date"}
                </span>

                <ChevronRight
                    size={16}
                    className={`text-[#A49C90] transition-transform duration-200 ${
                        isOpen ? "rotate-90" : ""
                    }`}
                />
            </button>

            {/* Calendar Popup */}
            {isOpen && (
                <div
                    role="dialog"
                    aria-label="Choose a date"
                    className="absolute left-0 top-full z-50 mt-3 w-[min(340px,calc(100vw-2rem))] overflow-hidden rounded-2xl border border-[#DED7CA] bg-[#FFFEFC] shadow-[0_16px_45px_rgba(41,39,32,0.13)]"
                >
                    {/* Calendar Header */}
                    <div className="flex items-center justify-between border-b border-[#EAE4DA] bg-[#F8F7F3] px-5 py-4">
                        <div>
                            <p className="text-[9px] font-semibold uppercase tracking-[0.18em] text-[#A49A8B]">
                                Select date
                            </p>

                            <h3 className="mt-1 font-serif text-lg text-[#292720]">
                                {visibleMonth.toLocaleDateString(
                                    "en-US",
                                    {
                                        month: "long",
                                        year: "numeric",
                                    }
                                )}
                            </h3>
                        </div>

                        <div className="flex items-center gap-1.5">
                            <button
                                type="button"
                                onClick={previousMonth}
                                aria-label="Previous month"
                                className="flex size-8 items-center justify-center rounded-lg border border-[#DED7CA] bg-white text-[#817B70] transition-all hover:border-[#B97960] hover:bg-[#F6EDE8] hover:text-[#B97960]"
                            >
                                <ChevronLeft size={16} />
                            </button>

                            <button
                                type="button"
                                onClick={nextMonth}
                                aria-label="Next month"
                                className="flex size-8 items-center justify-center rounded-lg border border-[#DED7CA] bg-white text-[#817B70] transition-all hover:border-[#B97960] hover:bg-[#F6EDE8] hover:text-[#B97960]"
                            >
                                <ChevronRight size={16} />
                            </button>
                        </div>
                    </div>

                    {/* Weekday Labels */}
                    <div className="grid grid-cols-7 gap-1 px-3 pt-4">
                        {weekdays.map((day) => (
                            <div
                                key={day}
                                className="py-2 text-center text-[10px] font-semibold uppercase tracking-wider text-[#A49A8B]"
                            >
                                {day}
                            </div>
                        ))}
                    </div>

                    {/* Date Grid */}
                    <div className="grid grid-cols-7 gap-1 px-3 pb-4">
                        {calendarDays.map((date, index) => {
                            const dateString = formatDate(date);
                            const isCurrentMonth =
                                date.getMonth() === month;
                            const isSelected = dateString === value;
                            const isToday = dateString === todayString;

                            return (
                                <button
                                    key={index}
                                    type="button"
                                    onClick={() => selectDate(date)}
                                    aria-label={date.toLocaleDateString(
                                        "en-US",
                                        {
                                            dateStyle: "full",
                                        }
                                    )}
                                    aria-pressed={isSelected}
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

                    {/* Calendar Footer */}
                    <div className="flex items-center justify-between border-t border-[#EAE4DA] bg-[#F8F7F3] px-4 py-3">
                        <button
                            type="button"
                            onClick={clearDate}
                            className="rounded-lg px-3 py-2 text-xs font-medium text-[#817B70] transition-colors hover:bg-white hover:text-[#A45F49]"
                        >
                            Clear
                        </button>

                        <button
                            type="button"
                            onClick={selectToday}
                            className="rounded-lg bg-[#B97960] px-4 py-2 text-xs font-semibold text-white transition-all hover:bg-[#A45F49] active:scale-95"
                        >
                            Today
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
