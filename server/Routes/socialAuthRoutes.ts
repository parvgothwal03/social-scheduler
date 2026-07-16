import express from "express";
import { generateAuthUrl, syncAccounts } from "../Controllers/socialAuthController.js";
import { protect } from "../Middleware/authMiddleware.js";


const socialAuthRouter = express.Router();

socialAuthRouter.get('/:platform/url', protect, generateAuthUrl);
socialAuthRouter.get('/sync', protect, syncAccounts);

export default socialAuthRouter;