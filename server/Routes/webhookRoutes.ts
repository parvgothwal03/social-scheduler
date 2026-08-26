import express from 'express';
import { handleZernioWebhook } from '../Controllers/webhookController.js';

const router = express.Router();

router.post('/zernio', handleZernioWebhook);

export default router;