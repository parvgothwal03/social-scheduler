import express from 'express';
import { handleZernioWebhook } from '../Controllers/webhookController.js';

const webhookRouter = express.Router();
webhookRouter.post('/zernio', handleZernioWebhook);

export default webhookRouter;