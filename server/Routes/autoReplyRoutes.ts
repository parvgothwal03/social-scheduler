import express from 'express';
import { getSettings, updateSettings,   } from '../Controllers/autoReplyController.js';
import { protect } from '../Middleware/authMiddleware.js';

const router = express.Router();
router.get('/settings', protect, getSettings);
router.put('/settings', protect, updateSettings);

export default router;