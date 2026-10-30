
/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import { type EventDropArg } from "@fullcalendar/core";
import api from "../api/axios";
import toast from "react-hot-toast";
import { Sparkles, Clock } from "lucide-react";

interface PostItem {
    _id: string;
    content: string;
    platforms: string[];
    scheduledFor: string;
    status: "scheduled" | "published" | "failed" | "processing";
    mediaUrl?: string;
    mediaType?: "image" | "video";
}

interface CalendarViewProps {
    posts: PostItem[];
    onRefresh: () => Promise<void> | void;
    onSelectDateSlot?: (date: Date) => void;
}

const platformThemes: Record<
    string,
    { label: string; badge: string; border: string; glow: string }
> = {
    instagram: {
        label: "IG",
        badge: "bg-gradient-to-tr from-amber-500 via-rose-500 to-purple-600 text-white",
        border: "border-rose-200 hover:border-rose-400",
        glow: "group-hover:shadow-rose-100",
    },
    linkedin: {
        label: "IN",
        badge: "bg-blue-600 text-white",
        border: "border-blue-200 hover:border-blue-400",
        glow: "group-hover:shadow-blue-100",
    },
    twitter: {
        label: "X",
        badge: "bg-[#292720] text-white",
        border: "border-[#DED7CA] hover:border-[#817B70]",
        glow: "group-hover:shadow-stone-100",
    },
    facebook: {
        label: "FB",
        badge: "bg-indigo-600 text-white",
        border: "border-indigo-200 hover:border-indigo-400",
        glow: "group-hover:shadow-indigo-100",
    },
    default: {
        label: "POST",
        badge: "bg-[#817B70] text-white",
        border: "border-[#DED7CA] hover:border-[#B97960]",
        glow: "group-hover:shadow-stone-100",
    },
};

export const CalendarView: React.FC<CalendarViewProps> = ({
    posts,
    onRefresh,
    onSelectDateSlot,
}) => {
    const [rescheduling, setRescheduling] = useState(false);

    const events = posts.map((post) => {
        const isDraggable =
            post.status === "scheduled" || post.status === "failed";

        const primaryPlatform =
            post.platforms?.[0]?.toLowerCase() || "default";

        return {
            id: post._id,
            title: post.content,
            start: post.scheduledFor,
            allDay: false,
            editable: isDraggable,
            startEditable: isDraggable,
            durationEditable: false,
            backgroundColor: "transparent",
            borderColor: "transparent",
            extendedProps: {
                platforms: post.platforms || [],
                primaryPlatform,
                status: post.status,
                mediaUrl: post.mediaUrl,
                mediaType: post.mediaType,
                timeString: new Date(post.scheduledFor).toLocaleTimeString(
                    [],
                    {
                        hour: "2-digit",
                        minute: "2-digit",
                    }
                ),
            },
        };
    });

    const handleEventDrop = async (dropInfo: EventDropArg) => {
        const newStart = dropInfo.event.start;

        if (!newStart) {
            dropInfo.revert();
            return;
        }

        if (newStart.getTime() <= Date.now()) {
            toast.error("Cannot reschedule a post to a past date or time");
            dropInfo.revert();
            return;
        }

        setRescheduling(true);

        const toastId = toast.loading("Updating publication slot...");

        try {
            await api.patch(
                `/api/posts/${dropInfo.event.id}/reschedule`,
                {
                    scheduledFor: newStart.toISOString(),
                }
            );

            toast.success("Post successfully moved!", { id: toastId });
            await onRefresh();
        } catch (err: any) {
            toast.error(
                err?.response?.data?.message ||
                    err.message ||
                    "Failed to reschedule post",
                { id: toastId }
            );

            dropInfo.revert();
        } finally {
            setRescheduling(false);
        }
    };

    const renderEventContent = (eventInfo: any) => {
        const { primaryPlatform, status, mediaUrl, timeString } =
            eventInfo.event.extendedProps;

        const theme =
            platformThemes[primaryPlatform] || platformThemes.default;

        return (
            <div
                className={`group relative flex w-full cursor-grab items-center gap-2 rounded-xl border bg-white p-1.5 shadow-sm transition-all duration-150 hover:-translate-y-0.5 hover:shadow-md active:cursor-grabbing ${theme.border} ${theme.glow}`}
            >
                {mediaUrl ? (
                    <div className="relative size-7 shrink-0 overflow-hidden rounded-lg border border-[#DED7CA]">
                        <img
                            src={mediaUrl}
                            alt="Post media"
                            className="h-full w-full object-cover"
                        />

                        <div
                            className={`absolute bottom-0 right-0 flex size-2.5 items-center justify-center rounded-tl-sm text-[7px] font-black ${theme.badge}`}
                        >
                            {theme.label[0]}
                        </div>
                    </div>
                ) : (
                    <div
                        className={`flex size-7 shrink-0 items-center justify-center rounded-lg text-[9px] font-bold tracking-tight shadow-sm ${theme.badge}`}
                    >
                        {theme.label}
                    </div>
                )}

                <div className="min-w-0 flex-1 pr-1">
                    <p className="truncate text-[11px] font-semibold leading-tight text-[#292720]">
                        {eventInfo.event.title}
                    </p>

                    <div className="mt-1 flex items-center gap-1.5 text-[10px] text-[#817B70]">
                        <Clock className="size-2.5 text-[#B97960]" />
                        <span>{timeString}</span>
                    </div>
                </div>

                <span
                    className={`size-2 shrink-0 rounded-full ${
                        status === "published"
                            ? "bg-emerald-500 ring-2 ring-emerald-100"
                            : status === "failed"
                            ? "bg-rose-500 ring-2 ring-rose-100"
                            : "bg-amber-400 ring-2 ring-amber-100"
                    }`}
                    title={`Status: ${status}`}
                />
            </div>
        );
    };

    return (
        <div className="relative rounded-3xl border border-[#DED7CA] bg-white p-4 shadow-sm sm:p-6">
            {rescheduling && (
                <div className="absolute inset-0 z-30 flex flex-col items-center justify-center gap-3 rounded-3xl bg-white/75 backdrop-blur-sm">
                    <div className="size-8 animate-spin rounded-full border-[3px] border-[#B97960] border-t-transparent" />

                    <p className="text-xs font-medium tracking-wide text-[#292720]">
                        Syncing schedule...
                    </p>
                </div>
            )}

            <style>{`
                .fc {
                    --fc-border-color: #EAE5DC;
                    --fc-page-bg-color: transparent;
                    --fc-today-bg-color: #F8F3EF;
                    font-family: inherit;
                }

                .fc .fc-col-header {
                    position: sticky;
                    top: 0;
                    z-index: 10;
                    background: #F8F7F3;
                    border-radius: 0.75rem 0.75rem 0 0;
                }

                .fc-theme-standard th {
                    border: none;
                    padding: 0.75rem 0;
                    font-size: 0.7rem;
                    font-weight: 600;
                    text-transform: uppercase;
                    letter-spacing: 0.09em;
                    color: #817B70;
                    background: #F8F7F3;
                    border-bottom: 1px solid #DED7CA;
                }

                .fc .fc-toolbar {
                    margin-bottom: 1.5rem;
                    flex-wrap: wrap;
                    gap: 0.75rem;
                }

                .fc .fc-toolbar-title {
                    font-family: Georgia, serif;
                    font-size: 1.35rem;
                    font-weight: 400;
                    color: #292720;
                    letter-spacing: -0.025em;
                }

                .fc .fc-button {
                    background: #FFFFFF;
                    border: 1px solid #DED7CA;
                    color: #625D54;
                    font-size: 0.78rem;
                    font-weight: 500;
                    padding: 0.45rem 0.85rem;
                    border-radius: 0.65rem;
                    box-shadow: none;
                    transition: all 0.15s ease;
                    text-transform: capitalize;
                }

                .fc .fc-button:hover {
                    background: #F8F7F3;
                    border-color: #B97960;
                    color: #292720;
                }

                .fc .fc-button-primary:not(:disabled).fc-button-active,
                .fc .fc-button-primary:not(:disabled):active {
                    background: #B97960;
                    border-color: #B97960;
                    color: #FFFFFF;
                    box-shadow: none;
                }

                .fc .fc-button:focus {
                    box-shadow: 0 0 0 2px rgba(185, 121, 96, 0.18);
                }

                .fc-theme-standard td {
                    border-color: #EAE5DC;
                }

                .fc-daygrid-day-frame {
                    min-height: 110px !important;
                    padding: 4px;
                    transition: background 0.15s;
                }

                .fc-daygrid-day:hover .fc-daygrid-day-frame {
                    background: #FCFAF7;
                }

                .fc .fc-daygrid-day-top {
                    flex-direction: row;
                    padding: 4px 6px;
                }

                .fc .fc-daygrid-day-number {
                    font-size: 0.75rem;
                    font-weight: 500;
                    color: #817B70;
                    text-decoration: none;
                }

                .fc-day-today {
                    background-color: #F8F3EF !important;
                }

                .fc-day-today .fc-daygrid-day-number {
                    color: #B97960 !important;
                    font-weight: 700;
                }

                .fc-daygrid-more-link {
                    font-size: 0.75rem;
                    font-weight: 600;
                    color: #B97960 !important;
                    padding: 2px 6px;
                }

                .fc-event {
                    background: transparent !important;
                    border: none !important;
                    padding: 1px 0 !important;
                }

                .fc .fc-scrollgrid {
                    border-radius: 0.75rem;
                    overflow: hidden;
                    border-color: #EAE5DC;
                }

                .fc .fc-timegrid-slot-label {
                    color: #817B70;
                    font-size: 0.7rem;
                }

                .fc .fc-timegrid-now-indicator-line {
                    border-color: #B97960;
                }

                .fc .fc-timegrid-now-indicator-arrow {
                    border-color: #B97960;
                }

                @media (max-width: 640px) {
                    .fc .fc-toolbar {
                        align-items: flex-start;
                    }

                    .fc .fc-toolbar-title {
                        font-size: 1.1rem;
                    }

                    .fc .fc-button {
                        padding: 0.4rem 0.6rem;
                        font-size: 0.7rem;
                    }

                    .fc-daygrid-day-frame {
                        min-height: 82px !important;
                    }
                }
            `}</style>

            <FullCalendar
                plugins={
                    [dayGridPlugin, timeGridPlugin, interactionPlugin] as any
                }
                initialView="dayGridMonth"
                headerToolbar={{
                    left: "prev,next today",
                    center: "title",
                    right: "dayGridMonth,timeGridWeek",
                }}
                events={events}
                editable={true}
                eventDrop={handleEventDrop}
                eventContent={renderEventContent}
                dateClick={(info: any) => {
                    if (onSelectDateSlot) {
                        onSelectDateSlot(new Date(info.dateStr));
                    }
                }}
                dayMaxEvents={3}
                height="650px"
            />

            <div className="mt-5 flex flex-wrap items-center justify-between gap-3 border-t border-[#EAE5DC] pt-4 text-xs">
                <div className="flex flex-wrap items-center gap-4 font-medium text-[#817B70]">
                    <span className="flex items-center gap-1.5">
                        <span className="size-2 rounded-full bg-amber-400 ring-2 ring-amber-100" />
                        Scheduled
                    </span>

                    <span className="flex items-center gap-1.5">
                        <span className="size-2 rounded-full bg-emerald-500 ring-2 ring-emerald-100" />
                        Published
                    </span>

                    <span className="flex items-center gap-1.5">
                        <span className="size-2 rounded-full bg-rose-500 ring-2 ring-rose-100" />
                        Failed
                    </span>
                </div>

                <div className="flex items-center gap-1.5 text-[#817B70]">
                    <Sparkles className="size-3.5 text-[#B97960]" />
                    <span>
                        Tip: Click empty dates to prefill, drag items to reschedule
                    </span>
                </div>
            </div>
        </div>
    );
};
