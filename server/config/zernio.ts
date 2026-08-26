import {Zernio} from '@zernio/node';
const zernio = new Zernio({
    apiKey: process.env.ZERNIO_API_KEY || '',
    baseURL: "https://zernio.com/api"
}); 

export default zernio;

export const zernioClient = new Zernio({
  apiKey: process.env.ZERNIO_API_KEY
});

export const replyToComment = async (postId: string, accountId: string, commentId: string, message: string) => {
  const response = await fetch(`https://zernio.com/api/v1/inbox/comments/${postId}`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${process.env.ZERNIO_API_KEY}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      accountId,
      commentId,
      message
    })
  });
  
  if (!response.ok) throw new Error('Failed to post reply');
  return await response.json();
};