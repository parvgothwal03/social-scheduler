import express from 'express';
import { getPostAnalytics } from '../Controllers/analyticsController.js';

const router = express.Router();
// Removed verifyToken temporarily to prevent 401 errors
router.get('/', getPostAnalytics);

export default router;