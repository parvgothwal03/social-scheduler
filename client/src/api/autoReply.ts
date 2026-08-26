import api from './axios';

export interface AutoReplyRule {
  id?: string;
  keyword: string;
  replyText: string;
}

export interface AutoReplySettings {
  isEnabled: boolean;
  mode: 'keyword' | 'ai';
  aiPrompt?: string;
  rules: AutoReplyRule[];
}

export const getAutoReplySettings = async (): Promise<AutoReplySettings> => {
  const response = await api.get('/api/auto-reply/settings');
  return response.data;
};

export const updateAutoReplySettings = async (settings: AutoReplySettings) => {
  const response = await api.put('/api/auto-reply/settings', settings);
  return response.data;
};