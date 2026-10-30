import { Response } from 'express';
import AutoReplySettings from '../Models/AutoReplyModel.js';
import { Account } from '../Models/Account.js';
import { AuthRequest } from '../Middleware/authMiddleware.js';

export const getSettings = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) {
      res.status(401).json({ message: 'Not authorized' });
      return;
    }

    const userId = req.user._id;
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

    // Migrate a pre-account-specific settings document when possible.
    if (!settings) {
      settings = await AutoReplySettings.findOneAndUpdate(
        { userId, accountId: { $exists: false } },
        { $set: { accountId } },
        { new: true, runValidators: true }
      );
    }

    if (!settings) {
      settings = await AutoReplySettings.findOneAndUpdate(
        { userId, accountId },
        {
          $setOnInsert: {
            userId,
            accountId,
            isEnabled: false,
            mode: 'keyword',
            rules: []
          }
        },
        { new: true, upsert: true, runValidators: true, setDefaultsOnInsert: true }
      );
    }

    res.status(200).json(settings);
  } catch (error: any) {
    console.error('Error fetching auto-reply settings:', error);
    res.status(500).json({ message: error?.message || 'Failed to fetch settings' });
  }
};
export const updateSettings = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) {
      res.status(401).json({ message: 'Not authorized' });
      return;
    }

    const userId = req.user._id;
    const { accountId, isEnabled, mode, aiPrompt, enableDmFollowUp, rules } = req.body;

    if (
      typeof accountId !== 'string' ||
      !accountId.trim() ||
      !['keyword', 'ai'].includes(mode) ||
      !Array.isArray(rules)
    ) {
      res.status(400).json({ message: 'Invalid auto-reply settings.' });
      return;
    }

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
      {
        $set: {
          isEnabled: Boolean(isEnabled),
          mode,
          aiPrompt: typeof aiPrompt === 'string' ? aiPrompt : undefined,
          enableDmFollowUp: Boolean(enableDmFollowUp),
          rules
        },
        $setOnInsert: { userId, accountId: accountId.trim() }
      },
      { new: true, upsert: true, runValidators: true, setDefaultsOnInsert: true }
    );

    res.status(200).json(updatedSettings);
  } catch (error: any) {
    console.error('Error updating auto-reply settings:', error);
    res.status(500).json({ message: error?.message || 'Failed to update settings' });
  }
};