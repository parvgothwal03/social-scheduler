import express from "express";
import { protect } from "../Middleware/authMiddleware.js";
import { generatePost, getGenerations, getPost, schedulePost } from "../Controllers/postController.js";
import { upload } from "../config/multer.js";

const postRouter = express.Router();

postRouter.get('/', protect, getPost);
postRouter.get('/generations', protect, getGenerations);
postRouter.post('/', upload.single("media"), schedulePost);
postRouter.post('/generate', protect, generatePost);

export default postRouter;