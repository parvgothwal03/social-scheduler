import api from './axios';

export interface AnalyticsOverview {
  totalImpressions: number;
  totalLikes: number;
  totalComments: number;
  totalShares: number;
  engagementRate: number;
  recentPosts: Array<{
    id: string;
    content: string;
    platform: string;
    impressions: number;
    likes: number;
    comments: number;
    postedAt: string;
  }>;
}

export const fetchAnalyticsData = async (): Promise<AnalyticsOverview> => {
  const response = await api.get('/api/analytics');
  return response.data;
};