import { Request, Response } from 'express';
import AutoReplySettings from '../Models/AutoReplyModel.js';
import axios from 'axios';

export const handleZernioWebhook = async (req: Request, res: Response) => {
  // 1. Immediately acknowledge webhook to prevent timeouts
  res.status(200).send('Webhook received');

  try {
    const { event, comment, post, account } = req.body;

    if (event !== 'comment.received' || !comment) {
      return;
    }

    // Prevent replying to own comments
    if (comment.author?.isOwnAccount) {
      console.log('Ignored comment from own account.');
      return;
    }

    const postId = comment.postId || post?.id;
    const commentId = comment.id;
    const commentText = (comment.text || '').trim().toLowerCase();
    const accountId = account?.accountId || account?.id;

    // 2. Fetch AutoReply configuration
    const settings = await AutoReplySettings.findOne({ isEnabled: true });

    if (!settings || !settings.isEnabled) {
      console.log('Auto-reply is disabled or no settings record found.');
      return;
    }

    let replyMessage = '';

    // Match keywords
    if (settings.mode === 'keyword' && settings.rules?.length > 0) {
      const matchedRule = settings.rules.find((rule: { keyword: string; replyText: string }) =>
        commentText.includes(rule.keyword.toLowerCase().trim())
      );

      if (matchedRule) {
        replyMessage = matchedRule.replyText;
      }
    } else if (settings.mode === 'ai') {
      replyMessage = 'Thanks for your comment! Check your DMs for details.';
    }

    if (!replyMessage) {
      console.log(`No matching keyword found for comment text: "${comment.text}"`);
      return;
    }

    console.log(`Attempting to reply to comment ${commentId} with message: "${replyMessage}"`);

    // 3. Dispatch reply to Zernio API
    try {
      const response = await axios.post(
        `https://api.zernio.com/v1/posts/${postId}/comments`,
        {
          accountId,
          parentCommentId: commentId,
          message: replyMessage,
          text: replyMessage
        },
        {
          headers: {
            Authorization: `Bearer ${process.env.ZERNIO_API_KEY}`,
            'Content-Type': 'application/json'
          }
        }
      );

      console.log('Auto-reply dispatched successfully:', response.data);
    } catch (apiError: any) {
      console.error('Zernio API reply failure:', {
        status: apiError.response?.status,
        data: apiError.response?.data,
        message: apiError.message
      });
    }
  } catch (error: any) {
    console.error('Webhook processing exception:', error.message);
  }
};