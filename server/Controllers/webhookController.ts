import { Request, Response } from 'express';
import AutoReplySettings from '../Models/AutoReplyModel.js';
import axios from 'axios'; // Make sure axios is imported

export const handleZernioWebhook = async (req: Request, res: Response) => {
  try {
    const { event, comment, account } = req.body;

    // 1. Verify if the event is an incoming comment
    if (event === 'comment.received') {
      const postId = comment.postId;
      const commentId = comment.id;
      const accountId = account.accountId; 
      const commentText = comment.text || '';

      // 2. Find auto-reply settings (make sure your query matches your schema field, e.g. userId or accountId)
      const settings = await AutoReplySettings.findOne({ accountId });

      // 3. Check if auto-reply is enabled for this user
      if (settings && settings.isEnabled) {
        let replyMessage = '';

        // --- STRATEGY A: KEYWORD MATCHING ---
        if (settings.mode === 'keyword' && settings.rules && settings.rules.length > 0) {
          const lowerComment = commentText.toLowerCase();
          
          const matchedRule = settings.rules.find((rule: { keyword: string; replyText: string }) => 
            lowerComment.includes(rule.keyword.toLowerCase())
          );

          if (matchedRule) {
            replyMessage = matchedRule.replyText;
          }
        } 
        
        // --- STRATEGY B: AI RESPONDER ---
        else if (settings.mode === 'ai') {
          // Fallback or LLM response logic
          replyMessage = "Thanks for your comment! We'll get back to you shortly.";
        }

        // 4. Send the reply using direct Zernio API call instead of SDK
        if (replyMessage) {
          await axios.post(
            `https://api.zernio.com/v1/posts/${postId}/comments/reply`,
            {
              accountId,
              commentId,
              message: replyMessage
            },
            {
              headers: {
                'Authorization': `Bearer ${process.env.ZERNIO_API_KEY}`,
                'Content-Type': 'application/json'
              }
            }
          );
          
          console.log(`Auto-reply sent successfully to comment ${commentId}`);
        }
      }
    }
    
    res.status(200).send('Webhook processed');
  } catch (error) {
    console.error('Error processing auto-reply webhook:', error);
    res.status(500).send('Webhook error');
  }
};