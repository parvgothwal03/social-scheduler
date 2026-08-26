import { Request, Response } from 'express';
import { replyToComment } from '../config/zernio.js';

export const handleZernioWebhook = async (req: Request, res: Response) => {
  try {
    const { event, data } = req.body;

    // Check if the event is an incoming comment
    if (event === 'comment.received') {
      const { postId, commentId, accountId, text } = data;

      // Insert your custom logic here (e.g., checking for specific keywords)
      const autoReply = "Thanks for your feedback!";

      await replyToComment(postId, accountId, commentId, autoReply);
    }
    res.status(200).send('Webhook processed');
  } catch (error) {
    console.error('Error processing webhook:', error);
    res.status(500).send('Webhook error');
  }
};