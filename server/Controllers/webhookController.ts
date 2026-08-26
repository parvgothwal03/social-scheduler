import { replyToComment } from "../config/zernio.js";
import { Request, Response } from 'express';

export const handleZernioWebhook = async (req: Request, res: Response) => {
  try {
    const { event, comment, account } = req.body;

    if (event === 'comment.received') {
      // Extract all necessary IDs directly from the payload objects
      const postId = comment.postId;
      const commentId = comment.id;
      const accountId = account.accountId; 

      const autoReply = "Thanks for your feedback!";
      
      // Pass the extracted variables to your reply function
      await replyToComment(postId, accountId, commentId, autoReply);
    }
    
    res.status(200).send('Webhook processed');
  } catch (error) {
    console.error('Error processing webhook:', error);
    res.status(500).send('Webhook error');
  }
};