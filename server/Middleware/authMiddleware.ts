import { NextFunction, Request, Response } from "express";
import { getAuth } from "@clerk/express";
import { User } from "../Models/User.js";

export interface AuthRequest extends Request {
    user?: any;
}

export const protect = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
        const { userId } = getAuth(req);

        if (!userId) {
            res.status(401).json({ message: "Not authorized, no token" });
            return;
        }

        // 1. Look up the user in MongoDB using the Clerk ID
        let user = await User.findOne({ clerkId: userId });

        // 2. AUTO-SYNC FALLBACK: If the webhook hasn't run yet, create the user right now!
        if (!user) {
            user = await User.create({
                clerkId: userId,
                name: "Clerk User",
                email: `${userId}@clerk.placeholder`
            });
            console.log(`Auto-provisioned missing user for Clerk ID: ${userId}`);
        }

        req.user = user;
        next();
    } catch (error: any) {
        res.status(401).json({ message: error?.message || "Not authorized, token failed" });
    }
};