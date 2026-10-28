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
import { fetchAnalyticsData, type AnalyticsOverview } from "../api/analytics.js";
import { exportToCSV, exportToPDF } from "../utils/exportReports.js";

const Analytics = () => {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<AnalyticsOverview | null>(null);
  const [exportMenuOpen, setExportMenuOpen] = useState(false);

  // Search & Filter State
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedPlatformFilter, setSelectedPlatformFilter] = useState<string>("all");

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
        post.platform?.toLowerCase() === selectedPlatformFilter.toLowerCase();

      const matchesSearch =
        post.content?.toLowerCase().includes(searchQuery.toLowerCase().trim()) ?? true;

      return matchesPlatform && matchesSearch;
    });
  }, [data?.recentPosts, selectedPlatformFilter, searchQuery]);

  // Unique platforms for filter tabs with post counts
  const platforms = useMemo(() => {
    if (!data?.recentPosts) return [];
    return Array.from(new Set(data.recentPosts.map((p) => p.platform?.toLowerCase())));
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

      exportToPDF(formattedPosts, summary, `analytics_report_${Date.now()}.pdf`);
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

      exportToCSV(formattedPosts, `analytics_report_${Date.now()}.csv`);
      toast.success("CSV exported successfully!");
      setExportMenuOpen(false);
    } catch (err) {
      toast.error("Failed to export CSV file.");
    }
  };

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <Loader2Icon className="size-6 animate-spin text-red-500" />
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto space-y-10 pb-20 animate-in fade-in duration-700">
      {/* Header with Export Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mt-10">
        <div className="space-y-1">
          <h1 className="text-2xl text-slate-800 font-bold tracking-tight">
            Post Analytics & Engagement
          </h1>
          <p className="text-slate-500 text-sm">
            Monitor your reach, engagement, and top-performing content across all connected platforms.
          </p>
        </div>

        {/* Export Dropdown Menu */}
        <div className="relative shrink-0">
          <button
            type="button"
            onClick={() => setExportMenuOpen((prev) => !prev)}
            className="flex items-center gap-2 px-4 py-2.5 bg-white border border-slate-200 text-slate-700 rounded-xl text-sm font-semibold shadow-xs hover:bg-slate-50 hover:border-slate-300 transition cursor-pointer"
          >
            <DownloadIcon className="size-4 text-slate-500" />
            <span>Export Report</span>
          </button>

          {exportMenuOpen && (
            <>
              <div
                className="fixed inset-0 z-20"
                onClick={() => setExportMenuOpen(false)}
              />
              <div className="absolute right-0 mt-2 w-48 bg-white border border-slate-200 rounded-2xl shadow-lg z-30 p-1.5 space-y-1 text-xs">
                <button
                  type="button"
                  onClick={handleExportPDF}
                  className="w-full flex items-center gap-2 px-3 py-2 text-slate-700 rounded-xl hover:bg-red-50 hover:text-red-600 transition cursor-pointer font-medium"
                >
                  <FileTextIcon className="size-4 text-red-500" />
                  <span>Download as PDF</span>
                </button>
                <button
                  type="button"
                  onClick={handleExportCSV}
                  className="w-full flex items-center gap-2 px-3 py-2 text-slate-700 rounded-xl hover:bg-emerald-50 hover:text-emerald-700 transition cursor-pointer font-medium"
                >
                  <FileSpreadsheetIcon className="size-4 text-emerald-600" />
                  <span>Download as CSV</span>
                </button>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Metric Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm space-y-2">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs uppercase tracking-wider font-medium">Total Impressions</span>
            <BarChart3Icon className="size-5 text-red-500" />
          </div>
          <div className="text-2xl font-semibold text-slate-800">
            {data?.totalImpressions?.toLocaleString() || "0"}
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm space-y-2">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs uppercase tracking-wider font-medium">Total Likes</span>
            <HeartIcon className="size-5 text-red-500" />
          </div>
          <div className="text-2xl font-semibold text-slate-800">
            {data?.totalLikes?.toLocaleString() || "0"}
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm space-y-2">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs uppercase tracking-wider font-medium">Comments</span>
            <MessageSquareIcon className="size-5 text-red-500" />
          </div>
          <div className="text-2xl font-semibold text-slate-800">
            {data?.totalComments?.toLocaleString() || "0"}
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm space-y-2">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs uppercase tracking-wider font-medium">Engagement Rate</span>
            <TrendingUpIcon className="size-5 text-red-500" />
          </div>
          <div className="text-2xl font-semibold text-slate-800">
            {data?.engagementRate ? `${data.engagementRate}%` : "0%"}
          </div>
        </div>
      </div>

      {/* Posts Section with Search & Filter Controls */}
      <div className="bg-white rounded-2xl border border-slate-100 p-6 space-y-6 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-semibold text-slate-800">Post Performance</h2>
            <span className="text-xs bg-slate-100 text-slate-600 px-2.5 py-0.5 rounded-full font-semibold">
              {filteredPosts.length} {filteredPosts.length === 1 ? "post" : "posts"}
            </span>
          </div>

          {/* Search Box */}
          <div className="relative w-full md:w-72">
            <SearchIcon className="size-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              placeholder="Search post content..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-8 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 placeholder-slate-400 outline-none focus:border-red-300 focus:bg-white transition"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery("")}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer"
              >
                <XIcon className="size-3.5" />
              </button>
            )}
          </div>
        </div>

        {/* Platform Filter Buttons */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs">
          <button
            type="button"
            onClick={() => setSelectedPlatformFilter("all")}
            className={`px-3 py-1.5 rounded-xl font-semibold capitalize transition cursor-pointer whitespace-nowrap ${
              selectedPlatformFilter === "all"
                ? "bg-slate-900 text-white shadow-xs"
                : "bg-slate-50 text-slate-600 hover:bg-slate-100 border border-slate-200/80"
            }`}
          >
            All Platforms ({data?.recentPosts?.length || 0})
          </button>

          {platforms.map((plat) => {
            const count = data?.recentPosts?.filter((p) => p.platform?.toLowerCase() === plat).length || 0;
            return (
              <button
                key={plat}
                type="button"
                onClick={() => setSelectedPlatformFilter(plat)}
                className={`px-3 py-1.5 rounded-xl font-semibold capitalize transition cursor-pointer whitespace-nowrap ${
                  selectedPlatformFilter === plat
                    ? "bg-slate-900 text-white shadow-xs"
                    : "bg-slate-50 text-slate-600 hover:bg-slate-100 border border-slate-200/80"
                }`}
              >
                {plat} ({count})
              </button>
            );
          })}
        </div>

        {/* Posts List */}
        <div className="space-y-4">
          {filteredPosts.map((post) => (
            <div
              key={post.id}
              className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 rounded-xl bg-slate-50 border border-slate-100 gap-4 hover:border-slate-200 transition"
            >
              <div className="space-y-1 flex-1 min-w-0">
                <span className="inline-block text-xs font-semibold text-red-500 bg-red-50 px-2.5 py-0.5 rounded-md uppercase tracking-wide">
                  {post.platform}
                </span>
                <p className="text-sm text-slate-700 line-clamp-2 leading-relaxed">
                  {post.content}
                </p>
              </div>

              <div className="flex items-center gap-6 text-xs text-slate-500 shrink-0">
                <div className="flex items-center gap-1.5" title="Likes">
                  <HeartIcon className="size-4 text-slate-400" />
                  <span className="font-medium text-slate-700">{post.likes.toLocaleString()}</span>
                </div>
                <div className="flex items-center gap-1.5" title="Comments">
                  <MessageSquareIcon className="size-4 text-slate-400" />
                  <span className="font-medium text-slate-700">{post.comments.toLocaleString()}</span>
                </div>
                <div className="flex items-center gap-1.5" title="Impressions">
                  <BarChart3Icon className="size-4 text-slate-400" />
                  <span className="font-medium text-slate-700">{post.impressions.toLocaleString()}</span>
                </div>
              </div>
            </div>
          ))}

          {filteredPosts.length === 0 && (
            <div className="py-12 text-center text-slate-400 text-sm">
              {searchQuery || selectedPlatformFilter !== "all"
                ? "No posts match your current search and platform filter."
                : "No performance data available yet. Published posts will appear here."}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Analytics;