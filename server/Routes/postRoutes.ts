import express from "express";
import { protect } from "../Middleware/authMiddleware.js";
import {
  generatePost,
  getGenerations,
  getPost,
  reschedulePost,
  schedulePost,
} from "../Controllers/postController.js";
import { upload } from "../config/multer.js";

const postRouter = express.Router();

postRouter.get("/", protect, getPost);
postRouter.get("/generations", protect, getGenerations);
postRouter.post("/", protect, upload.single("media"), schedulePost);
postRouter.post("/generate", protect, generatePost);
postRouter.patch("/:id/reschedule", protect, reschedulePost);

export default postRouter;