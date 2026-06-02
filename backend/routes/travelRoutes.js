import express from 'express';
import { searchDestination, chatAssistant } from '../controllers/travelController.js';

const router = express.Router();

router.post('/search', searchDestination);
router.post('/chat', chatAssistant);

export default router;
