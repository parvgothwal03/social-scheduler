import { Request, Response } from 'express';
import { Webhook } from 'svix';
import { User } from '../Models/User.js';
import AutoReplySettings from '../Models/AutoReplyModel.js';
import zernio from '../config/zernio.js';

// ==========================================
// 1. ZERNIO WEBHOOK (Existing Auto-Reply Logic)
// ==========================================
export const handleZernioWebhook = async (req: Request, res: Response) => {
  res.status(200).send('Webhook received');

  try {
    const { event, comment, post, account } = req.body;

    console.log('--- Incoming Webhook Event ---', event);

    if (event !== 'comment.received' || !comment) {
      console.log('Skipping event: Not a comment.received event.');
      return;
    }

    if (comment.author?.isOwnAccount) {
      console.log('Ignored: Comment is from account owner.');
      return;
    }

    const postId = comment.postId || comment.platformPostId || post?.id || post?.platformPostId;
    const commentId = comment.id;
    const rawText = comment.text || comment.content || '';
    const cleanComment = rawText.trim().toLowerCase();
    const accountId = account?.accountId || account?.id;

    console.log(
      `Received comment: "${rawText}" (ID: ${commentId}) on Post: ${postId} for account: ${accountId}`
    );

    if (!postId || !commentId || !accountId) {
      console.error('Skipping auto-reply: webhook is missing postId, commentId, or accountId.');
      return;
    }

    const settings = await AutoReplySettings.findOne({ accountId, isEnabled: true });

    if (!settings) {
      console.log(
        `No active auto-reply settings found for account ${accountId}. ` +
        'Verify the UI was saved for this exact connected account and is enabled.'
      );
      return;
    }

    console.log(`Settings found: mode=${settings.mode}, rulesCount=${settings.rules?.length}`);

    let publicReplyMessage = '';
    let privateReplyMessage = '';

    if (settings.mode === 'keyword' && settings.rules?.length > 0) {
      const matchedRule = settings.rules.find((rule) =>
        cleanComment.includes(rule.keyword.trim().toLowerCase())
      );

      if (!matchedRule) {
        console.log(`No keyword match found for: "${rawText}"`);
        return;
      }

      const rulePublicReply = matchedRule.publicReplyText || matchedRule.replyText || '';
      const rulePrivateReply = matchedRule.dmReplyText || '';
      const replyType = matchedRule.replyType || 'comment';

      if (replyType === 'comment' || replyType === 'both') {
        publicReplyMessage = rulePublicReply;
      }
      if (replyType === 'dm' || replyType === 'both') {
        privateReplyMessage = rulePrivateReply;
      }

      console.log(
        `Rule matched for keyword "${matchedRule.keyword}" ` +
        `(type=${replyType}, public=${Boolean(publicReplyMessage)}, private=${Boolean(privateReplyMessage)})`
      );
    } else if (settings.mode === 'ai') {
      publicReplyMessage = 'Thanks for your comment! Check your DMs for details.';
      if (settings.enableDmFollowUp) {
        privateReplyMessage = 'Thanks for your comment! How can I help you?';
      }
    }

    if (!publicReplyMessage.trim() && !privateReplyMessage.trim()) {
      console.log('Skipping auto-reply: matched rule has no reply message configured.');
      return;
    }

    if (publicReplyMessage.trim()) {
      console.log(`Dispatching public reply to Zernio for comment ${commentId}...`);
      try {
        const response = await zernio.comments.replyToInboxPost({
          path: { postId },
          body: { accountId, commentId, message: publicReplyMessage }
        });
        console.log('Public auto-reply sent successfully! Zernio response:', response);
      } catch (apiErr: any) {
        console.error(
          'Failed to post public reply to Zernio:',
          apiErr?.message || apiErr,
          apiErr?.statusCode ? `(status ${apiErr.statusCode})` : ''
        );
      }
    }

    if (privateReplyMessage.trim()) {
      console.log(`Dispatching private Instagram reply to Zernio for comment ${commentId}...`);
      try {
        const response = await zernio.comments.sendPrivateReplyToComment({
          path: { postId, commentId },
          body: { accountId, message: privateReplyMessage }
        });
        console.log('Private auto-reply sent successfully! Zernio response:', response);
      } catch (apiErr: any) {
        console.error(
          'Failed to send private reply to Zernio:',
          apiErr?.message || apiErr,
          apiErr?.statusCode ? `(status ${apiErr.statusCode})` : ''
        );
      }
    }
  } catch (err: any) {
    console.error('Webhook execution error:', err?.message || err);
  }
};

// ==========================================
// 2. CLERK WEBHOOK (New User Sync Logic)
// ==========================================
export const clerkWebhook = async (req: Request, res: Response) => {
  const WEBHOOK_SECRET = process.env.CLERK_WEBHOOK_SECRET;

  if (!WEBHOOK_SECRET) {
      res.status(500).json({ error: 'Missing CLERK_WEBHOOK_SECRET' });
      return;
  }

  // Extract Svix headers for verification
  const svix_id = req.headers["svix-id"] as string;
  const svix_timestamp = req.headers["svix-timestamp"] as string;
  const svix_signature = req.headers["svix-signature"] as string;

  if (!svix_id || !svix_timestamp || !svix_signature) {
      res.status(400).json({ error: 'Missing svix headers' });
      return;
  }

  const payload = req.body;
  // Note: For Clerk webhooks, ensure your route uses express.raw({ type: 'application/json' })
  const body = typeof payload === 'string' ? payload : JSON.stringify(payload);
  const wh = new Webhook(WEBHOOK_SECRET);
  
  let evt: any;
  try {
      evt = wh.verify(body, {
          "svix-id": svix_id,
          "svix-timestamp": svix_timestamp,
          "svix-signature": svix_signature,
      });
  } catch (err) {
      console.error('Webhook signature verification failed:', err);
      res.status(400).json({ error: 'Verification failed' });
      return;
  }

  const eventType = evt.type;

  if (eventType === 'user.created') {
      const { id, email_addresses, first_name, last_name } = evt.data;
      const email = email_addresses[0]?.email_address;
      const name = `${first_name || ''} ${last_name || ''}`.trim() || 'New User';

      try {
          await User.create({
              clerkId: id,
              name,
              email
          });
          console.log(`Clerk User ${id} synced to MongoDB`);
      } catch (error) {
          console.error("Database sync error:", error);
          res.status(500).json({ error: 'Failed to sync user to database' });
          return;
      }
  }

  res.status(200).json({ success: true });
};