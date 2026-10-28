import { Request, Response } from 'express';
import AutoReplySettings from '../Models/AutoReplyModel.js';
import { Account } from '../Models/Account.js';

export const getSettings = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user?.id;
    const requestedAccountId = typeof req.query.accountId === 'string' ? req.query.accountId : undefined;
    const account = requestedAccountId
      ? await Account.findOne({ user: userId, zernioAccountId: requestedAccountId, status: 'connected' })
      : await Account.findOne({ user: userId, status: 'connected', zernioAccountId: { $exists: true, $ne: '' } });

    if (!account?.zernioAccountId) {
      res.status(400).json({ message: 'Connect a social account before configuring auto-reply.' });
      return;
    }

    const accountId = account.zernioAccountId;
    let settings = await AutoReplySettings.findOne({ userId, accountId });

    // If no settings exist yet for this user, return a default template
    if (!settings) {
      settings = await AutoReplySettings.create({
        userId,
        accountId,
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
    const { accountId, isEnabled, mode, aiPrompt, enableDmFollowUp, rules } = req.body;

    const account = await Account.findOne({
      user: userId,
      zernioAccountId: accountId,
      status: 'connected'
    });

    if (!account) {
      res.status(400).json({ message: 'The selected social account is not connected.' });
      return;
    }

    // Find and update the user's settings, or create them if they don't exist yet
    const updatedSettings = await AutoReplySettings.findOneAndUpdate(
      { userId, accountId },
      { isEnabled, mode, aiPrompt, enableDmFollowUp, rules },
      { new: true, upsert: true, runValidators: true, setDefaultsOnInsert: true }
    );

    res.status(200).json(updatedSettings);
  } catch (error) {
    console.error('Error updating auto-reply settings:', error);
    res.status(500).json({ message: 'Failed to update settings' });
  }
};