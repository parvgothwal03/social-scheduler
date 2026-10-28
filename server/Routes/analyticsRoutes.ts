import express from 'express';
import { getPostAnalytics } from '../Controllers/analyticsController.js';
import { protect } from '../Middleware/authMiddleware.js';

const router = express.Router();
router.get('/', protect, getPostAnalytics);

export default router;