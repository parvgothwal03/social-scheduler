import express from 'express';
import { getSettings } from '../Controllers/autoReplyController.js';
import { protect } from '../Middleware/authMiddleware.js';

const router = express.Router();
router.get('/settings', protect, getSettings);

export default router;