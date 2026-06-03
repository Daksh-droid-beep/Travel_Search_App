import express from 'express';
import {
  getChatHistory,
  getChatConversation,
  deleteChatEntry,
  clearAllChatHistory
} from '../controllers/chatController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// Apply JWT protection to all chat routes
router.use(protect);

// Order is critical to prevent "/history" from colliding with "/history/:id" parameters
router.delete('/history', clearAllChatHistory);
router.delete('/history/:id', deleteChatEntry);

router.get('/history', getChatHistory);
router.get('/history/:id', getChatConversation);

export default router;
