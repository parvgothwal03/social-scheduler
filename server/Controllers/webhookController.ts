import { Request, Response } from 'express';
import AutoReplySettings from '../Models/AutoReplyModel.js';
import axios from 'axios';

export const handleZernioWebhook = async (req: Request, res: Response) => {
  try {
    const { event, comment, post } = req.body;

    // 1. Verify if the event is an incoming comment
    if (event === 'comment.received' && comment) {
      // Don't reply to your own comments
      if (comment.author?.isOwnAccount) {
        return res.status(200).send('Ignored own comment');
      }

      const postId = comment.postId || post?.id;
      const commentId = comment.id;
      const commentText = (comment.text || '').trim().toLowerCase();

      // 2. Fetch the active AutoReplySettings from database
      const settings = await AutoReplySettings.findOne({ isEnabled: true });

      if (settings && settings.isEnabled) {
        let replyMessage = '';

        // --- STRATEGY A: KEYWORD MATCHING ---
        if (settings.mode === 'keyword' && settings.rules && settings.rules.length > 0) {
          const matchedRule = settings.rules.find((rule: { keyword: string; replyText: string }) =>
            commentText.includes(rule.keyword.toLowerCase().trim())
          );

          if (matchedRule) {
            replyMessage = matchedRule.replyText;
          }
        }

        // --- STRATEGY B: AI RESPONDER ---
        else if (settings.mode === 'ai') {
          replyMessage = "Thanks for reaching out! Check your DMs for more info.";
        }

        // 3. Post the reply if a match was found
        if (replyMessage) {
          console.log(`Sending auto-reply to comment ${commentId}: "${replyMessage}"`);

          await axios.post(
            `https://api.zernio.com/v1/posts/${postId}/comments/reply`,
            {
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

          console.log(`Auto-reply sent successfully to comment ${commentId}`);
        } else {
          console.log(`No keyword rule matched for text: "${comment.text}"`);
        }
      }
    }

    res.status(200).send('Webhook processed');
  } catch (error) {
    console.error('Error processing auto-reply webhook:', error);
    res.status(500).send('Webhook error');
  }
};