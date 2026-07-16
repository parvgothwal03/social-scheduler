import cron from "node-cron";
import { Post } from "../Models/Post.js";
import { Account } from "../Models/Account.js";
import zernio from "../config/zernio.js";
import { ActivityLog } from "../Models/ActivityLog.js";


export const initScheduler = () => {
    cron.schedule("* * * * *", async () => {
        try {
            const now = new Date();
            const postsToPublish = await Post.find({status: "scheduled",
            scheduledFor: {$lte: now}});

            for (const post of postsToPublish) {
                try {
                    const accounts = await Account.find({
                        user: post.user,
                        platform: {$in: post.platforms},
                        status: "connected",
                        zernioAccountId: {$exists: true},
                    })

                    if(accounts.length === 0) {
                        console.log(`No connected accounts found for post ${post._id}. Skipping...`);
                        continue;
                    }
                    const zernioPlatforms = accounts.map((acc) => ({
                        tform: acc.platform as any,
                        accountId: acc.zernioAccountId!
                    }))

                    const payload = {
                        content: post.content,
                        publishedNow: true,
                        ...(post.mediaUrl ? {mediaItems: [{type: post.mediaType || "images",
                        url: post.mediaUrl}]} : {}),
                        platforms: zernioPlatforms,
                    }
                    console.log(`Publishing post ${post._id} to Zernio with media:
                    ${post.mediaUrl || "None"}`);

                    const response = await zernio.posts.createPost({
                        body: payload
                    })

                    const publishedPost = (response.data as any)?.post || response.data;

                    if(!publishedPost) {
                        throw new Error(`Failed to get post object from Zernio response`);
                    }

                    console.log(`Zernio post created: ${publishedPost._id || publishedPost.id}`);
                    post.status = "posted";
                    await post.save();

                    await ActivityLog.create({
                        user: post.user,
                        actionType: "POST_PUBLISHED",
                        description: `Published post to ${accounts.map((a) => a.platform).join(", ")} `,
                        relatedPost: post._id,
                    })
                } catch (err: any) {
                    console.error(`Failed to publish post ${post._id}:`, err?.response?.
                    data || err?.message); 
                    await post.save();    
                }
            }
            if(postsToPublish.length > 0) {
                console.log(`Published ${postsToPublish.length} posts at ${now.toISOString()}`);
            }
        } catch (error) {
            console.error("Error in scheduler:", error);
        }
    })
    console.log("Scheduler initialized and running every minute.");
}