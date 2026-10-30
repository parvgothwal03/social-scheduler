import express from 'express';
import { handleZernioWebhook, clerkWebhook } from '../Controllers/webhookController.js';

const router = express.Router();

// Clerk MUST have the raw body for Svix signature verification
router.post('/clerk', express.raw({ type: 'application/json' }), clerkWebhook);

// Zernio requires standard JSON parsing
router.post('/zernio', express.json(), handleZernioWebhook);

export default router;