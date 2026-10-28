import api from './axios';

export interface AutoReplyRule {
  id?: string;
  keyword: string;
  replyType: 'comment' | 'dm' | 'both';
  replyText?: string;
  publicReplyText?: string;
  dmReplyText?: string;
}

export interface AutoReplySettings {
  accountId: string;
  isEnabled: boolean;
  mode: 'keyword' | 'ai';
  aiPrompt?: string;
  enableDmFollowUp?: boolean;
  rules: AutoReplyRule[];
}

export const getAutoReplySettings = async (accountId: string): Promise<AutoReplySettings> => {
  const response = await api.get('/api/auto-reply/settings', { params: { accountId } });
  return response.data;
};

export const updateAutoReplySettings = async (settings: AutoReplySettings) => {
  const response = await api.put('/api/auto-reply/settings', settings);
  return response.data;
};