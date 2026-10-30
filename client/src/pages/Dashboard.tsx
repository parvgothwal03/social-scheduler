
/* eslint-disable @typescript-eslint/no-explicit-any */
import {
    ActivityIcon,
    CheckCircleIcon,
    ClockIcon,
    SendIcon,
    Share2Icon,
    TrendingUpIcon,
} from "lucide-react";
import { useEffect, useState } from "react";
import api from "../api/axios";

interface Activity {
    _id: string;
    description: string;
    createdAt: string;
}

const Dashboard = () => {
    const [stats, setStats] = useState({
        scheduled: 0,
        published: 0,
        connectedAccounts: 0,
    });

    const [activities, setActivities] = useState<Activity[]>([]);

    useEffect(() => {
        const fetchDashboardData = async () => {
            try {
                const [postsRes, accountsRes, activityRes] = await Promise.all([
                    api.get("/api/posts"),
                    api.get("/api/accounts"),
                    api.get("/api/activity"),
                ]);

                const posts = postsRes.data;

                setStats({
                    scheduled: posts.filter(
                        (p: any) => p.status === "scheduled"
                    ).length,
                    published: posts.filter(
                        (p: any) =>
                            p.status === "published" ||
                            p.status === "posted"
                    ).length,
                    connectedAccounts: accountsRes.data.filter(
                        (a: any) => a.status === "connected"
                    ).length,
                });

                setActivities(activityRes.data);
            } catch (error: any) {
                console.error("Error fetching dashboard data:", error);
            }
        };

        void fetchDashboardData();

        const interval = setInterval(() => {
            void fetchDashboardData();
        }, 10000);

        return () => clearInterval(interval);
    }, []);

    const statCards = [
        {
            label: "Scheduled Posts",
            value: stats.scheduled,
            icon: ClockIcon,
            trend: "+2 today",
        },
        {
            label: "Published Posts",
            value: stats.published,
            icon: CheckCircleIcon,
            trend: "All time",
        },
        {
            label: "Connected Accounts",
            value: stats.connectedAccounts,
            icon: Share2Icon,
            trend: "All time",
        },
    ];

    return (
        <div className="mx-auto max-w-7xl space-y-10 pb-16 text-[#292720]">

            {/* Welcome section */}
            <div className="flex flex-col gap-2 border-b border-[#DED7CA] pb-7">
                <div className="flex items-center gap-2 text-[10px] uppercase tracking-[0.2em] text-[#B97960]">
                    <span className="size-1.5 rounded-full bg-[#B97960]" />
                    Your workspace
                </div>

                <h2 className="font-serif text-3xl tracking-tight text-[#292720] sm:text-4xl">
                    Good Morning! 👋
                </h2>

                <p className="max-w-xl text-sm leading-7 text-[#817B70]">
                    Here's what's happening with your social media today.
                    Keep track of your content and stay on top of your schedule.
                </p>
            </div>

            {/* Statistics */}
            <section>
                <div className="mb-5 flex items-center justify-between">
                    <h3 className="text-[11px] font-medium uppercase tracking-[0.18em] text-[#887E6F]">
                        Overview
                    </h3>

                    <span className="text-xs text-[#A39C90]">
                        Live statistics
                    </span>
                </div>

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    {statCards.map((card, index) => {
                        const Icon = card.icon;

                        return (
                            <div
                                key={card.label}
                                className="group border border-[#DED7CA] bg-[#F8F7F3] p-6 transition-colors duration-300 hover:bg-[#F1EDE4]"
                            >
                                <div className="mb-7 flex items-start justify-between">
                                    <div className="flex size-10 items-center justify-center border border-[#DED7CA] bg-[#F1EDE4] text-[#B97960]">
                                        <Icon className="size-5" strokeWidth={1.6} />
                                    </div>

                                    <span className="text-[10px] uppercase tracking-[0.12em] text-[#A39C90]">
                                        0{index + 1}
                                    </span>
                                </div>

                                <div className="flex items-end justify-between gap-3">
                                    <div>
                                        <p className="font-serif text-4xl tabular-nums tracking-tight text-[#292720]">
                                            {card.value.toLocaleString()}
                                        </p>

                                        <p className="mt-2 text-sm text-[#817B70]">
                                            {card.label}
                                        </p>
                                    </div>

                                    <span className="mb-1 inline-flex items-center gap-1 text-[10px] text-[#B97960]">
                                        <TrendingUpIcon className="size-3" />
                                        {card.trend}
                                    </span>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </section>

            {/* Recent Activity */}
            <section className="border border-[#DED7CA] bg-[#F8F7F3]">
                <div className="flex items-center justify-between gap-4 border-b border-[#DED7CA] px-6 py-5">
                    <div>
                        <h2 className="font-serif text-xl text-[#292720]">
                            Recent Activity
                        </h2>

                        <p className="mt-1 text-xs text-[#A39C90]">
                            Stay updated with your latest activity
                        </p>
                    </div>

                    <span className="shrink-0 text-xs text-[#817B70]">
                        {activities.length} events
                    </span>
                </div>

                {activities.length === 0 ? (
                    <div className="flex flex-col items-center justify-center px-6 py-20 text-center">
                        <div className="mb-4 flex size-12 items-center justify-center border border-[#DED7CA] bg-[#F1EDE4] text-[#B97960]">
                            <ActivityIcon className="size-5" />
                        </div>

                        <p className="text-sm font-medium text-[#292720]">
                            No activity yet
                        </p>

                        <p className="mt-2 max-w-sm text-xs leading-6 text-[#A39C90]">
                            Connect accounts and schedule posts to see events
                            here.
                        </p>
                    </div>
                ) : (
                    <div className="divide-y divide-[#EAE5DB]">
                        {activities.map((activity) => (
                            <div
                                key={activity._id}
                                className="flex items-start gap-4 px-6 py-5 transition-colors duration-200 hover:bg-[#F1EDE4]/70"
                            >
                                <div className="mt-0.5 flex size-9 shrink-0 items-center justify-center border border-[#DED7CA] bg-[#F1EDE4] text-[#B97960]">
                                    <SendIcon className="size-4" strokeWidth={1.6} />
                                </div>

                                <div className="min-w-0 flex-1">
                                    <div className="mb-2 flex flex-wrap items-center justify-between gap-2">
                                        <span className="border border-[#DED7CA] bg-[#F1EDE4] px-2.5 py-1 text-[10px] uppercase tracking-[0.12em] text-[#887E6F]">
                                            Published
                                        </span>

                                        <span className="shrink-0 text-xs text-[#A39C90]">
                                            {new Date(
                                                activity.createdAt
                                            ).toLocaleDateString()}
                                        </span>
                                    </div>

                                    <p className="break-words text-sm leading-6 text-[#686257]">
                                        {activity.description}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </section>
        </div>
    );
};

export default Dashboard;
