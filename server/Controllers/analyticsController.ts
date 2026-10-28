import { Response } from 'express';
import { Post } from '../Models/Post.js';
import { AuthRequest } from '../Middleware/authMiddleware.js';
import { Account } from '../Models/Account.js';
import zernio from '../config/zernio.js';

interface ZernioAnalyticsPost {
  _id?: string;
  latePostId?: string | null;
  content?: string;
  platform?: string;
  analytics?: {
    impressions?: number;
    likes?: number;
    comments?: number;
    shares?: number;
  };
  platforms?: Array<{
    platform?: string;
    analytics?: {
      impressions?: number;
      likes?: number;
      comments?: number;
      shares?: number;
    };
  }>;
  publishedAt?: string;
}

interface ZernioAnalyticsResponse {
  posts?: ZernioAnalyticsPost[];
  data?: {
    posts?: ZernioAnalyticsPost[];
  };
}

const getZernioAnalytics = async (accountId: string): Promise<ZernioAnalyticsPost[]> => {
  const result = await zernio.analytics.getAnalytics({
    query: { accountId, limit: 100, source: 'all' }
  });
  const response = result as ZernioAnalyticsResponse & { data?: ZernioAnalyticsResponse };
  const data = response.data || response;
  const posts = data.posts || data.data?.posts || [];
  console.log(`Fetched ${posts.length} analytics posts for Zernio account ${accountId}.`);
  return posts;
};

export const getPostAnalytics = async (req: AuthRequest, res: Response) => {
  try {
    console.log('[analytics] request received');

    if (!req.user) {
      console.warn('[analytics] request rejected: no authenticated user');
      res.status(401).json({ message: 'Not authorized' });
      return;
    }

    const [posts, accounts] = await Promise.all([
      Post.find({ user: req.user._id }).sort({ createdAt: -1 }),
      Account.find({
        user: req.user._id,
        status: 'connected',
        zernioAccountId: { $exists: true, $ne: '' }
      })
    ]);
    console.log(`[analytics] found ${posts.length} local posts and ${accounts.length} connected Zernio accounts`);

    const zernioPosts: ZernioAnalyticsPost[] = [];
    for (const account of accounts) {
      try {
        zernioPosts.push(...await getZernioAnalytics(account.zernioAccountId!));
      } catch (error) {
        console.error(`Failed to fetch Zernio analytics for account ${account.zernioAccountId}:`, error);
      }
    }

    const analyticsPosts: ZernioAnalyticsPost[] = zernioPosts.length > 0
      ? zernioPosts
      : posts.map((post) => ({
          _id: String(post._id),
          latePostId: post.zernioPostId,
          content: post.content,
          platform: post.platforms?.[0],
          analytics: {
            impressions: post.impressions || 0,
            likes: post.likes || 0,
            comments: post.comments || 0,
            shares: post.shares || 0
          },
          publishedAt: post.createdAt.toISOString()
        }));

    // Calculate real metrics from your database records
    const publishedPosts = analyticsPosts;
    
    const getMetric = (
      post: ZernioAnalyticsPost,
      metric: keyof NonNullable<ZernioAnalyticsPost['analytics']>
    ) => {
      const platformMetrics = (post.platforms || [])
        .map((platform) => Number(platform.analytics?.[metric] || 0))
        .reduce((total, value) => total + value, 0);

      return platformMetrics > 0 ? platformMetrics : Number(post.analytics?.[metric] || 0);
    };
    const totalImpressions = publishedPosts.reduce((acc, post) => acc + getMetric(post, 'impressions'), 0);
    const totalLikes = publishedPosts.reduce((acc, post) => acc + getMetric(post, 'likes'), 0);
    const totalComments = publishedPosts.reduce((acc, post) => acc + getMetric(post, 'comments'), 0);
    const totalShares = publishedPosts.reduce((acc, post) => acc + getMetric(post, 'shares'), 0);

    const engagementRate = totalImpressions > 0 
      ? Number(((totalLikes + totalComments + totalShares) / totalImpressions * 100).toFixed(2)) 
      : 0;

    // Map recent posts for the dashboard list
    const recentPosts = publishedPosts
      .sort((a, b) => new Date(b.publishedAt || 0).getTime() - new Date(a.publishedAt || 0).getTime())
      .slice(0, 5)
      .map((post) => ({
        id: post._id || post.latePostId || '',
        content: post.content || '',
        platform: post.platform || 'general',
        impressions: getMetric(post, 'impressions'),
        likes: getMetric(post, 'likes'),
        comments: getMetric(post, 'comments'),
        postedAt: post.publishedAt || new Date().toISOString()
      }));

    res.status(200).json({
      totalImpressions,
      totalLikes,
      totalComments,
      totalShares,
      engagementRate,
      recentPosts
    });
  } catch (error) {
    console.error('Failed to fetch analytics:', error);
    res.status(500).json({ message: 'Failed to retrieve analytics data' });
  }
};