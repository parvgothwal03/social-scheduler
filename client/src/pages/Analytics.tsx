
/* eslint-disable react-hooks/preserve-manual-memoization */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { useEffect, useState, useMemo } from "react";
import {
    BarChart3Icon,
    DownloadIcon,
    FileSpreadsheetIcon,
    FileTextIcon,
    HeartIcon,
    Loader2Icon,
    MessageSquareIcon,
    SearchIcon,
    TrendingUpIcon,
    XIcon,
} from "lucide-react";
import toast from "react-hot-toast";
import {
    fetchAnalyticsData,
    type AnalyticsOverview,
} from "../api/analytics.js";
import {
    exportToCSV,
    exportToPDF,
} from "../utils/exportReports.js";

const Analytics = () => {
    const [loading, setLoading] = useState(true);
    const [data, setData] = useState<AnalyticsOverview | null>(null);
    const [exportMenuOpen, setExportMenuOpen] = useState(false);

    // Search & Filter State
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedPlatformFilter, setSelectedPlatformFilter] =
        useState<string>("all");

    useEffect(() => {
        const loadAnalytics = async () => {
            try {
                const result = await fetchAnalyticsData();
                setData(result);
            } catch (error) {
                toast.error("Failed to load analytics overview.");
            } finally {
                setLoading(false);
            }
        };

        loadAnalytics();
    }, []);

    // Filter posts based on search query and platform selection
    const filteredPosts = useMemo(() => {
        if (!data?.recentPosts) return [];

        return data.recentPosts.filter((post) => {
            const matchesPlatform =
                selectedPlatformFilter === "all" ||
                post.platform?.toLowerCase() ===
                    selectedPlatformFilter.toLowerCase();

            const matchesSearch =
                post.content
                    ?.toLowerCase()
                    .includes(searchQuery.toLowerCase().trim()) ?? true;

            return matchesPlatform && matchesSearch;
        });
    }, [data?.recentPosts, selectedPlatformFilter, searchQuery]);

    // Unique platforms for filter tabs with post counts
    const platforms = useMemo(() => {
        if (!data?.recentPosts) return [];

        return Array.from(
            new Set(
                data.recentPosts.map((p) => p.platform?.toLowerCase())
            )
        );
    }, [data?.recentPosts]);

    const handleExportPDF = () => {
        if (filteredPosts.length === 0) {
            toast.error("No posts found to export.");
            return;
        }

        try {
            const formattedPosts = filteredPosts.map((p) => ({
                _id: String(p.id),
                content: p.content,
                platforms: [p.platform],
                status: "published",
                scheduledFor: new Date().toISOString(),
                mediaType: "text",
            }));

            const platformCounts = filteredPosts.reduce((acc, curr) => {
                acc[curr.platform] = (acc[curr.platform] || 0) + 1;
                return acc;
            }, {} as Record<string, number>);

            const summary = {
                totalPosts: filteredPosts.length,
                publishedPosts: filteredPosts.length,
                scheduledPosts: 0,
                failedPosts: 0,
                platformCounts,
            };

            exportToPDF(
                formattedPosts,
                summary,
                `analytics_report_${Date.now()}.pdf`
            );

            toast.success("PDF report generated successfully!");
            setExportMenuOpen(false);
        } catch (err) {
            toast.error("Failed to export PDF report.");
        }
    };

    const handleExportCSV = () => {
        if (filteredPosts.length === 0) {
            toast.error("No posts found to export.");
            return;
        }

        try {
            const formattedPosts = filteredPosts.map((p) => ({
                _id: String(p.id),
                content: p.content,
                platforms: [p.platform],
                status: "published",
                scheduledFor: new Date().toISOString(),
                mediaType: "text",
            }));

            exportToCSV(
                formattedPosts,
                `analytics_report_${Date.now()}.csv`
            );

            toast.success("CSV exported successfully!");
            setExportMenuOpen(false);
        } catch (err) {
            toast.error("Failed to export CSV file.");
        }
    };

    if (loading) {
        return (
            <div className="flex min-h-[60vh] items-center justify-center">
                <Loader2Icon className="size-6 animate-spin text-[#B97960]" />
            </div>
        );
    }

    const metricCards = [
        {
            label: "Total Impressions",
            value: data?.totalImpressions?.toLocaleString() || "0",
            icon: BarChart3Icon,
        },
        {
            label: "Total Likes",
            value: data?.totalLikes?.toLocaleString() || "0",
            icon: HeartIcon,
        },
        {
            label: "Comments",
            value: data?.totalComments?.toLocaleString() || "0",
            icon: MessageSquareIcon,
        },
        {
            label: "Engagement Rate",
            value: data?.engagementRate
                ? `${data.engagementRate}%`
                : "0%",
            icon: TrendingUpIcon,
        },
    ];

    return (
        <div className="mx-auto max-w-6xl space-y-10 pb-20 text-[#292720]">

            {/* Header */}
            <div className="flex flex-col gap-5 border-b border-[#DED7CA] pb-7 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <div className="mb-3 flex items-center gap-2 text-[10px] uppercase tracking-[0.2em] text-[#B97960]">
                        <span className="size-1.5 rounded-full bg-[#B97960]" />
                        Performance overview
                    </div>

                    <h1 className="font-serif text-3xl tracking-tight text-[#292720] sm:text-4xl">
                        Post Analytics
                    </h1>

                    <p className="mt-2 max-w-xl text-sm leading-7 text-[#817B70]">
                        Monitor your reach, engagement, and top-performing
                        content across all connected platforms.
                    </p>
                </div>

                {/* Export Dropdown */}
                <div className="relative shrink-0">
                    <button
                        type="button"
                        onClick={() => setExportMenuOpen((prev) => !prev)}
                        className="flex w-full items-center justify-center gap-2 border border-[#DED7CA] bg-[#F8F7F3] px-5 py-3 text-xs font-medium text-[#686257] transition-colors duration-300 hover:border-[#B97960] hover:text-[#B97960] sm:w-auto"
                    >
                        <DownloadIcon className="size-4" />
                        Export Report
                    </button>

                    {exportMenuOpen && (
                        <>
                            <div
                                className="fixed inset-0 z-20"
                                onClick={() => setExportMenuOpen(false)}
                            />

                            <div className="absolute right-0 z-30 mt-2 w-52 space-y-1 border border-[#DED7CA] bg-[#F8F7F3] p-2 shadow-xl">
                                <button
                                    type="button"
                                    onClick={handleExportPDF}
                                    className="flex w-full items-center gap-3 px-3 py-3 text-left text-xs text-[#686257] transition-colors hover:bg-[#F1EDE4] hover:text-[#B97960]"
                                >
                                    <FileTextIcon className="size-4 text-[#B97960]" />
                                    Download as PDF
                                </button>

                                <button
                                    type="button"
                                    onClick={handleExportCSV}
                                    className="flex w-full items-center gap-3 px-3 py-3 text-left text-xs text-[#686257] transition-colors hover:bg-[#F1EDE4] hover:text-[#B97960]"
                                >
                                    <FileSpreadsheetIcon className="size-4 text-[#B97960]" />
                                    Download as CSV
                                </button>
                            </div>
                        </>
                    )}
                </div>
            </div>

            {/* Metric Cards */}
            <section>
                <div className="mb-5">
                    <h2 className="text-[11px] font-medium uppercase tracking-[0.18em] text-[#887E6F]">
                        Engagement metrics
                    </h2>
                </div>

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
                    {metricCards.map((metric, index) => {
                        const Icon = metric.icon;

                        return (
                            <div
                                key={metric.label}
                                className="border border-[#DED7CA] bg-[#F8F7F3] p-5 transition-colors duration-300 hover:bg-[#F1EDE4] sm:p-6"
                            >
                                <div className="mb-7 flex items-center justify-between">
                                    <span className="text-[10px] font-medium uppercase tracking-[0.12em] text-[#887E6F]">
                                        {metric.label}
                                    </span>

                                    <div className="flex size-9 items-center justify-center border border-[#DED7CA] bg-[#F1EDE4] text-[#B97960]">
                                        <Icon className="size-4" strokeWidth={1.6} />
                                    </div>
                                </div>

                                <p className="font-serif text-3xl tabular-nums tracking-tight text-[#292720]">
                                    {metric.value}
                                </p>

                                <p className="mt-2 text-[10px] uppercase tracking-wider text-[#A39C90]">
                                    Metric 0{index + 1}
                                </p>
                            </div>
                        );
                    })}
                </div>
            </section>

            {/* Post Performance */}
            <section className="border border-[#DED7CA] bg-[#F8F7F3]">
                <div className="flex flex-col gap-5 border-b border-[#DED7CA] p-5 sm:p-6">
                    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                        <div>
                            <h2 className="font-serif text-xl text-[#292720]">
                                Post Performance
                            </h2>

                            <p className="mt-1 text-xs text-[#A39C90]">
                                Review engagement across your published posts
                            </p>
                        </div>

                        <span className="w-fit border border-[#DED7CA] px-3 py-1.5 text-[10px] uppercase tracking-wider text-[#817B70]">
                            {filteredPosts.length}{" "}
                            {filteredPosts.length === 1 ? "post" : "posts"}
                        </span>
                    </div>

                    {/* Search */}
                    <div className="relative w-full sm:max-w-sm">
                        <SearchIcon className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-[#A39C90]" />

                        <input
                            type="text"
                            placeholder="Search post content..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full border border-[#DED7CA] bg-white py-3 pl-10 pr-9 text-xs text-[#292720] outline-none transition-colors placeholder:text-[#A39C90] focus:border-[#B97960]"
                        />

                        {searchQuery && (
                            <button
                                type="button"
                                onClick={() => setSearchQuery("")}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-[#A39C90] transition-colors hover:text-[#B97960]"
                                aria-label="Clear search"
                            >
                                <XIcon className="size-4" />
                            </button>
                        )}
                    </div>

                    {/* Platform Filters */}
                    <div className="flex items-center gap-2 overflow-x-auto pb-1">
                        <button
                            type="button"
                            onClick={() => setSelectedPlatformFilter("all")}
                            className={`shrink-0 border px-3 py-2 text-[10px] font-medium transition-colors ${
                                selectedPlatformFilter === "all"
                                    ? "border-[#292720] bg-[#292720] text-white"
                                    : "border-[#DED7CA] bg-white text-[#817B70] hover:border-[#B97960]"
                            }`}
                        >
                            All Platforms ({data?.recentPosts?.length || 0})
                        </button>

                        {platforms.map((plat) => {
                            const count =
                                data?.recentPosts?.filter(
                                    (p) => p.platform?.toLowerCase() === plat
                                ).length || 0;

                            return (
                                <button
                                    key={plat}
                                    type="button"
                                    onClick={() => setSelectedPlatformFilter(plat)}
                                    className={`shrink-0 border px-3 py-2 text-[10px] font-medium capitalize transition-colors ${
                                        selectedPlatformFilter === plat
                                            ? "border-[#292720] bg-[#292720] text-white"
                                            : "border-[#DED7CA] bg-white text-[#817B70] hover:border-[#B97960]"
                                    }`}
                                >
                                    {plat} ({count})
                                </button>
                            );
                        })}
                    </div>
                </div>

                {/* Posts List */}
                <div className="divide-y divide-[#EAE5DB]">
                    {filteredPosts.map((post) => (
                        <div
                            key={post.id}
                            className="flex flex-col gap-5 px-5 py-5 transition-colors duration-200 hover:bg-[#F1EDE4]/60 sm:px-6 lg:flex-row lg:items-center lg:justify-between"
                        >
                            <div className="min-w-0 flex-1 space-y-3">
                                <span className="inline-block border border-[#DED7CA] bg-[#F1EDE4] px-2.5 py-1 text-[10px] uppercase tracking-wider text-[#B97960]">
                                    {post.platform}
                                </span>

                                <p className="line-clamp-2 text-sm leading-7 text-[#686257]">
                                    {post.content}
                                </p>
                            </div>

                            <div className="flex flex-wrap items-center gap-x-6 gap-y-3 text-xs text-[#817B70]">
                                <div className="flex items-center gap-2" title="Likes">
                                    <HeartIcon className="size-4 text-[#B97960]" />
                                    <span className="tabular-nums">
                                        {post.likes.toLocaleString()}
                                    </span>
                                </div>

                                <div className="flex items-center gap-2" title="Comments">
                                    <MessageSquareIcon className="size-4 text-[#B97960]" />
                                    <span className="tabular-nums">
                                        {post.comments.toLocaleString()}
                                    </span>
                                </div>

                                <div className="flex items-center gap-2" title="Impressions">
                                    <BarChart3Icon className="size-4 text-[#B97960]" />
                                    <span className="tabular-nums">
                                        {post.impressions.toLocaleString()}
                                    </span>
                                </div>
                            </div>
                        </div>
                    ))}

                    {filteredPosts.length === 0 && (
                        <div className="px-6 py-16 text-center">
                            <div className="mx-auto mb-4 flex size-11 items-center justify-center border border-[#DED7CA] bg-[#F1EDE4] text-[#B97960]">
                                <BarChart3Icon className="size-5" />
                            </div>

                            <p className="text-sm text-[#686257]">
                                {searchQuery || selectedPlatformFilter !== "all"
                                    ? "No posts match your current search and platform filter."
                                    : "No performance data available yet. Published posts will appear here."}
                            </p>
                        </div>
                    )}
                </div>
            </section>
        </div>
    );
};

export default Analytics;
