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
export const updateSettings = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user?.id;
    const { isEnabled, mode, aiPrompt, rules } = req.body;

    // Find and update the user's settings, or create them if they don't exist yet
    const updatedSettings = await AutoReplySettings.findOneAndUpdate(
      { userId },
      { isEnabled, mode, aiPrompt, rules },
      { new: true, upsert: true }
    );

    res.status(200).json(updatedSettings);
  } catch (error) {
    console.error('Error updating auto-reply settings:', error);
    res.status(500).json({ message: 'Failed to update settings' });
  }
};