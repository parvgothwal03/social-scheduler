import express from "express";
import { protect } from "../Middleware/authMiddleware.js";
import { getActivity } from "../Controllers/ActivityController.js";

const activityRouter = express.Router();

activityRouter.get('/', protect, getActivity)

export default activityRouter;