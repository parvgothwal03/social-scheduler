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
    badge: "bg-linear-to-tr from-amber-500 via-rose-500 to-purple-600 text-white",
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
    badge: "bg-zinc-900 text-white",
    border: "border-zinc-300 hover:border-zinc-500",
    glow: "group-hover:shadow-zinc-100",
  },
  facebook: {
    label: "FB",
    badge: "bg-indigo-600 text-white",
    border: "border-indigo-200 hover:border-indigo-400",
    glow: "group-hover:shadow-indigo-100",
  },
  default: {
    label: "POST",
    badge: "bg-slate-700 text-white",
    border: "border-slate-200 hover:border-slate-400",
    glow: "group-hover:shadow-slate-100",
  },
};

export const CalendarView: React.FC<CalendarViewProps> = ({
  posts,
  onRefresh,
  onSelectDateSlot,
}) => {
  const [rescheduling, setRescheduling] = useState(false);

  const events = posts.map((post) => {
    const isDraggable = post.status === "scheduled" || post.status === "failed";
    const primaryPlatform = post.platforms?.[0]?.toLowerCase() || "default";

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
        timeString: new Date(post.scheduledFor).toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
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
      await api.patch(`/api/posts/${dropInfo.event.id}/reschedule`, {
        scheduledFor: newStart.toISOString(),
      });
      toast.success("Post successfully moved!", { id: toastId });
      await onRefresh();
    } catch (err: any) {
      toast.error(
        err?.response?.data?.message || err.message || "Failed to reschedule post",
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
    const theme = platformThemes[primaryPlatform] || platformThemes.default;

    return (
      <div
        className={`group relative w-full flex items-center gap-2 p-1.5 rounded-xl border bg-white shadow-xs transition-all duration-150 cursor-grab active:cursor-grabbing hover:-translate-y-0.5 hover:shadow-md ${theme.border} ${theme.glow}`}
      >
        {/* Media Thumbnail or Platform Pill */}
        {mediaUrl ? (
          <div className="relative size-6 shrink-0 rounded-lg overflow-hidden border border-slate-100 shadow-2xs">
            <img src={mediaUrl} alt="post" className="w-full h-full object-cover" />
            <div
              className={`absolute bottom-0 right-0 size-2.5 rounded-tl-sm flex items-center justify-center text-[7px] font-black ${theme.badge}`}
            >
              {theme.label[0]}
            </div>
          </div>
        ) : (
          <div
            className={`size-6 rounded-lg shrink-0 flex items-center justify-center font-bold text-[9px] shadow-2xs tracking-tight ${theme.badge}`}
          >
            {theme.label}
          </div>
        )}

        {/* Content details */}
        <div className="flex-1 min-w-0 pr-1">
          <p className="text-[11px] font-semibold text-slate-800 truncate leading-tight">
            {eventInfo.event.title}
          </p>
          <div className="flex items-center gap-1.5 text-[10px] text-slate-400 mt-0.5">
            <Clock className="size-2.5 text-slate-400" />
            <span>{timeString}</span>
          </div>
        </div>

        {/* Status indicator dot */}
        <span
          className={`size-2 rounded-full shrink-0 ${
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
    <div className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-sm relative">
      {/* Loading Overlay */}
      {rescheduling && (
        <div className="absolute inset-0 bg-white/70 backdrop-blur-xs z-30 rounded-3xl flex flex-col items-center justify-center gap-3">
          <div className="size-8 border-3 border-red-500 border-t-transparent rounded-full animate-spin" />
          <p className="text-xs font-semibold text-slate-700 tracking-wide">
            Syncing schedule...
          </p>
        </div>
      )}

      {/* Scoped FullCalendar styling */}
      {/* Scoped FullCalendar styling */}
      <style>{`
        .fc {
          --fc-border-color: #f1f5f9;
          --fc-page-bg-color: transparent;
          font-family: inherit;
        }

        /* 1. Make the days header sticky */
        .fc .fc-col-header {
          position: sticky;
          top: 0;
          z-index: 10;
          background: #ffffff; /* Must have a solid background */
          border-radius: 0.75rem 0.75rem 0 0;
        }

        /* 2. Style individual day header cells */
        .fc-theme-standard th {
          border: none;
          padding: 0.75rem 0;
          font-size: 0.75rem;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          color: #64748b;
          background: #f8fafc;
          border-bottom: 1px solid #e2e8f0;
        }

        .fc .fc-toolbar {
          margin-bottom: 1.5rem;
          flex-wrap: wrap;
          gap: 0.75rem;
        }
        .fc .fc-toolbar-title {
          font-size: 1.15rem;
          font-weight: 700;
          color: #0f172a;
          letter-spacing: -0.02em;
        }
        .fc .fc-button {
          background: #ffffff;
          border: 1px solid #e2e8f0;
          color: #475569;
          font-size: 0.8125rem;
          font-weight: 600;
          padding: 0.45rem 0.85rem;
          border-radius: 0.75rem;
          box-shadow: 0 1px 2px rgba(0, 0, 0, 0.04);
          transition: all 0.15s ease;
          text-transform: capitalize;
        }
        .fc .fc-button:hover {
          background: #f8fafc;
          border-color: #cbd5e1;
          color: #0f172a;
        }
        .fc .fc-button-primary:not(:disabled).fc-button-active,
        .fc .fc-button-primary:not(:disabled):active {
          background: #ef4444;
          border-color: #ef4444;
          color: #ffffff;
          box-shadow: 0 1px 3px rgba(239, 68, 68, 0.25);
        }
        .fc-theme-standard td {
          border-color: #f1f5f9;
        }
        .fc-daygrid-day-frame {
          min-height: 110px !important;
          padding: 4px;
          transition: background 0.15s;
        }
        .fc-daygrid-day:hover .fc-daygrid-day-frame {
          background: #fcfdfe;
        }
        .fc .fc-daygrid-day-top {
          flex-direction: row;
          padding: 4px 6px;
        }
        .fc .fc-daygrid-day-number {
          font-size: 0.75rem;
          font-weight: 600;
          color: #64748b;
        }
        .fc-day-today {
          background-color: #fef2f2 !important;
        }
        .fc-day-today .fc-daygrid-day-number {
          color: #ef4444 !important;
          font-weight: 800;
        }
        .fc-daygrid-more-link {
          font-size: 0.75rem;
          font-weight: 600;
          color: #ef4444 !important;
          padding: 2px 6px;
        }
        .fc-event {
          background: transparent !important;
          border: none !important;
          padding: 1px 0 !important;
        }
      `}</style>

      {/* Calendar component */}
      <FullCalendar
        plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin] as any}
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

      {/* Interactive Legend & Quick Tips Footer */}
      <div className="mt-5 pt-4 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-4 text-slate-500 font-medium">
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

        <div className="flex items-center gap-1.5 text-slate-400">
          <Sparkles className="size-3.5 text-amber-500" />
          <span>Tip: Click empty dates to prefill, drag items to reschedule</span>
        </div>
      </div>
    </div>
  );
};