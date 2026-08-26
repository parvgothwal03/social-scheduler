import { Request, Response } from 'express';
// Import your Post model (adjust the path based on your project structure)
import { Post } from '../Models/Post.js'; 

export const getPostAnalytics = async (req: Request, res: Response) => {
  try {
    // Fetch all posts belonging to the authenticated user (assuming req.user.id is set by auth middleware)
    const userId = (req as any).user?.id;
    const posts = await Post.find({ userId });

    // Calculate real metrics from your database records
    const totalPosts = posts.length;
    const publishedPosts = posts.filter(p => p.status === 'published');
    
    // Example aggregation (modify fields according to your actual Post schema)
    const totalImpressions = publishedPosts.reduce((acc, p) => acc + (p.impressions || 0), 0);
    const totalLikes = publishedPosts.reduce((acc, p) => acc + (p.likes || 0), 0);
    const totalComments = publishedPosts.reduce((acc, p) => acc + (p.comments || 0), 0);
    const totalShares = publishedPosts.reduce((acc, p) => acc + (p.shares || 0), 0);

    const engagementRate = totalImpressions > 0 
      ? Number(((totalLikes + totalComments + totalShares) / totalImpressions * 100).toFixed(2)) 
      : 0;

    // Map recent posts for the dashboard list
    const recentPosts = posts
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      .slice(0, 5)
      .map(p => ({
        id: p._id,
        content: p.content,
        platform: p.platforms?.[0] || 'general',
        impressions: p.impressions || 0,
        likes: p.likes || 0,
        comments: p.comments || 0,
        postedAt: p.createdAt
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