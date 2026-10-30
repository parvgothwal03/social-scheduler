import { NextFunction, Request, Response } from "express";
import { getAuth } from "@clerk/express";
import { User } from "../Models/User.js";

export interface AuthRequest extends Request {
    user?: any;
}

export const protect = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
        // Extract the authenticated state provided by Clerk
        const { userId } = getAuth(req);

        if (!userId) {
            res.status(401).json({ message: "Not authorized, no token" });
            return;
        }

        // Look up the user in MongoDB using the Clerk ID instead of the MongoDB _id
        req.user = await User.findOne({ clerkId: userId });

        if (!req.user) {
            res.status(401).json({ message: "Not authorized, user not found in database" });
            return;
        }

        next();
    } catch (error: any) {
        res.status(401).json({ message: error?.message || "Not authorized, token failed" });
    }
};