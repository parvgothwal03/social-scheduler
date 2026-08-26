import { Request, Response } from 'express';
import AutoReplySettings from '../Models/AutoReplyModel.js';

export const getSettings = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user?.id;
    let settings = await AutoReplySettings.findOne({ userId });

    // If no settings exist yet for this user, return a default template
    if (!settings) {
      settings = await AutoReplySettings.create({
        userId,
        isEnabled: false,
        mode: 'keyword',
        rules: []
      });
    }

    res.status(200).json(settings);
  } catch (error) {
    console.error('Error fetching auto-reply settings:', error);
    res.status(500).json({ message: 'Failed to fetch settings' });
  }
};