import { useEffect, useState } from "react";
import { BarChart3Icon, HeartIcon, Loader2Icon, MessageSquareIcon, TrendingUpIcon } from "lucide-react";
import toast from "react-hot-toast";
import { fetchAnalyticsData, type AnalyticsOverview } from "../api/analytics.js";

const Analytics = () => {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<AnalyticsOverview | null>(null);

  useEffect(() => {
    const loadAnalytics = async () => {
      try {
        const result = await fetchAnalyticsData();
        setData(result);
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      } catch (error) {
        toast.error("Failed to load analytics overview.");
      } finally {
        setLoading(false);
      }
    };
    loadAnalytics();
  }, []);

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <Loader2Icon className="size-6 animate-spin text-red-500" />
      </div>
    );
  }

  return (
    <div className='max-w-6xl mx-auto space-y-10 pb-20 animate-in fade-in duration-700'>
      {/* Header */}
      <div className='space-y-2 mt-10'>
        <h1 className='text-2xl text-slate-700 tracking-tight'>Post Analytics & Engagement</h1>
        <p className="text-slate-500 text-sm">
          Monitor your reach, engagement, and top-performing content across all connected platforms.
        </p>
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

      {/* Recent Post Performance Table/List */}
      <div className="bg-white rounded-2xl border border-slate-100 p-6 space-y-6 shadow-sm">
        <h2 className="text-xl text-slate-700">Top Performing Posts</h2>

        <div className="space-y-4">
          {data?.recentPosts?.map((post) => (
            <div key={post.id} className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 rounded-xl bg-slate-50 border border-slate-100 gap-4">
              <div className="space-y-1 flex-1">
                <span className="inline-block text-xs font-medium text-red-500 bg-red-50 px-2.5 py-0.5 rounded uppercase tracking-wide">
                  {post.platform}
                </span>
                <p className="text-sm text-slate-700 line-clamp-2">{post.content}</p>
              </div>

              <div className="flex items-center gap-6 text-xs text-slate-500 shrink-0">
                <div className="flex items-center gap-1.5">
                  <HeartIcon className="size-4 text-slate-400" />
                  <span>{post.likes}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <MessageSquareIcon className="size-4 text-slate-400" />
                  <span>{post.comments}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <BarChart3Icon className="size-4 text-slate-400" />
                  <span>{post.impressions}</span>
                </div>
              </div>
            </div>
          ))}

          {(!data?.recentPosts || data.recentPosts.length === 0) && (
            <div className="py-12 text-center text-slate-400 text-sm">
              No performance data available yet. Published posts will appear here.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Analytics;