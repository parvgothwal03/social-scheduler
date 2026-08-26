import { Request, Response } from 'express';

export const getPostAnalytics = async (req: Request, res: Response) => {
  try {
    const mockAnalytics = {
      totalImpressions: 14250,
      totalLikes: 1240,
      totalComments: 310,
      totalShares: 95,
      engagementRate: 5.4,
      recentPosts: [
        {
          id: "1",
          content: "Excited to launch our brand new AI features today! 🚀",
          platform: "instagram",
          impressions: 4500,
          likes: 420,
          comments: 85,
          postedAt: "2026-08-25T10:00:00Z"
        },
        {
          id: "2",
          content: "Check out our latest tips on full-stack web development.",
          platform: "linkedin",
          impressions: 9750,
          likes: 820,
          comments: 225,
          postedAt: "2026-08-24T14:30:00Z"
        }
      ]
    };

    res.status(200).json(mockAnalytics);
  } catch (error) {
    console.error('Failed to fetch analytics:', error);
    res.status(500).json({ message: 'Failed to retrieve analytics data' });
  }
};