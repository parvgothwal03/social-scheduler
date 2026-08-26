import { Request, Response } from 'express';
import AutoReplySettings from '../Models/AutoReplyModel.js';
import axios from 'axios';

export const handleZernioWebhook = async (req: Request, res: Response) => {
  // Acknowledge receipt to Zernio first to avoid webhook delivery timeouts
  res.status(200).send('Webhook received');

  try {
    const { event, comment, post, account } = req.body;

    if (event === 'comment.received' && comment) {
      // Ignore own comments to prevent infinite loops
      if (comment.author?.isOwnAccount) {
        console.log('Ignored comment from own account.');
        return;
      }

      const postId = comment.postId || post?.id;
      const commentId = comment.id;
      const commentText = (comment.text || '').trim().toLowerCase();
      const accountId = account?.accountId || account?.id || post?.accountId;

      // Find active auto-reply configuration in MongoDB
      const settings = await AutoReplySettings.findOne({ isEnabled: true });

      if (settings && settings.isEnabled) {
        let replyMessage = '';

        // Keyword Strategy
        if (settings.mode === 'keyword' && settings.rules?.length > 0) {
          const matchedRule = settings.rules.find((rule: { keyword: string; replyText: string }) =>
            commentText.includes(rule.keyword.toLowerCase().trim())
          );

          if (matchedRule) {
            replyMessage = matchedRule.replyText;
          }
        } 
        // AI Strategy
        else if (settings.mode === 'ai') {
          replyMessage = "Thanks for reaching out! Check your DMs for more info.";
        }

        if (replyMessage && postId && commentId) {
          console.log(`Sending auto-reply to comment ${commentId}: "${replyMessage}"`);

          try {
            const response = await axios.post(
              `https://api.zernio.com/v1/posts/${postId}/comments/reply`,
              {
                accountId,
                commentId,
                message: replyMessage,
              },
              {
                headers: {
                  Authorization: `Bearer ${process.env.ZERNIO_API_KEY}`,
                  'Content-Type': 'application/json',
                },
              }
            );

            console.log('Zernio reply response status:', response.status);
          } catch (apiError: any) {
            console.error('Zernio API reply error details:', apiError.response?.data || apiError.message);
          }
        } else {
          console.log(`No matching rule or missing IDs. Comment: "${comment.text}"`);
        }
      }
    }
  } catch (error: any) {
    console.error('Webhook processing exception:', error.message);
  }
};