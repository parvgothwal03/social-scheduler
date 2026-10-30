import "dotenv/config";
import express, { NextFunction, Request, Response } from 'express';
import cors from "cors";
import { clerkMiddleware } from '@clerk/express';
import connectDB from "./config/db.js";
import socialAuthRouter from "./Routes/socialAuthRoutes.js";
import accountRouter from "./Routes/accountRoutes.js";
import postRouter from "./Routes/postRoutes.js";
import activityRouter from "./Routes/activityRoutes.js";
import { initScheduler } from "./Services/schedulerService.js";
import analyticsRoutes from "./Routes/analyticsRoutes.js";
import autoReplyRoutes from "./Routes/autoReplyRoutes.js";
import webhookRoutes from "./Routes/webhookRoutes.js";

const app = express();

//Database connection
await connectDB();

// Middleware
app.use(cors());

// 1. Add Clerk Middleware to authenticate incoming requests globally
app.use(clerkMiddleware());

// 2. Mount webhooks BEFORE global express.json()
// This ensures the Clerk webhook gets the raw body for Svix signature verification
app.use('/api/webhooks', webhookRoutes);

// 3. Apply global JSON parser for all standard routes
app.use(express.json());

const port = process.env.PORT || 5000;

app.get('/', (_req: Request, res: Response) => {
    res.send('Server is Live!');
});

app.use("/api/oauth", socialAuthRouter);
app.use("/api/accounts", accountRouter);
app.use("/api/posts", postRouter);
app.use("/api/activity", activityRouter);
app.use('/api/analytics', analyticsRoutes);
app.use('/api/auto-reply', autoReplyRoutes);

// Initialize the scheduler
initScheduler();

//Global Error Handler
app.use((err: any, _req: Request, res: Response, _next: NextFunction)=> {
    console.error(err);
    res.status(500).send(err?.response?.data?.message || err?.message)
})

app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});