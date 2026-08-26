import { Request, Response } from 'express';
import AutoReplySettings from '../Models/AutoReplyModel.js';
import axios from 'axios';

export const handleZernioWebhook = async (req: Request, res: Response) => {
  // Acknowledge webhook immediately so Zernio marks it as 200 Success
  res.status(200).send('Webhook received');

  try {
    const { event, comment, post, account } = req.body;

    console.log('--- Incoming Webhook Event ---', event);

    if (event !== 'comment.received' || !comment) {
      console.log('Skipping event: Not a comment.received event.');
      return;
    }

    // Ignore self comments to prevent infinite loops
    if (comment.author?.isOwnAccount) {
      console.log('Ignored: Comment is from account owner.');
      return;
    }

    const postId = comment.postId || post?.id;
    const commentId = comment.id;
    const rawText = comment.text || '';
    const cleanComment = rawText.trim().toLowerCase();
    const accountId = account?.accountId || account?.id;

    console.log(`Received comment: "${rawText}" (ID: ${commentId}) on Post: ${postId}`);

    // Fetch active Auto Reply settings from MongoDB
    const settings = await AutoReplySettings.findOne({ isEnabled: true });

    if (!settings) {
      console.log('No active AutoReplySettings found in MongoDB (isEnabled is false or no document exists).');
      return;
    }

    console.log(`Settings found: mode=${settings.mode}, rulesCount=${settings.rules?.length}`);

    let replyMessage = '';

    // Strategy 1: Keyword Match
    if (settings.mode === 'keyword' && settings.rules?.length > 0) {
      const matchedRule = settings.rules.find((rule: { keyword: string; replyText: string }) =>
        cleanComment.includes(rule.keyword.trim().toLowerCase())
      );

      if (matchedRule) {
        replyMessage = matchedRule.replyText;
        console.log(`Rule matched for keyword "${matchedRule.keyword}": "${replyMessage}"`);
      } else {
        console.log(`No keyword match found for: "${rawText}"`);
        return;
      }
    } 
    // Strategy 2: AI Responder
    else if (settings.mode === 'ai') {
      replyMessage = "Thanks for your comment! Check your DMs for details.";
    }

    if (!replyMessage) {
      return;
    }

    // Send reply via Zernio API
    console.log(`Dispatching reply to Zernio for comment ${commentId}...`);

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

      console.log('Auto-reply sent successfully! Zernio response:', response.data);
    } catch (apiErr: any) {
      console.error('Failed to post reply to Zernio:', apiErr.response?.data || apiErr.message);
    }

  } catch (err: any) {
    console.error('Webhook execution error:', err.message);
  }
};