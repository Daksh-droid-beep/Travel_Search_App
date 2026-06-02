import express from 'express';
import { getSearchHistory, deleteHistoryItem } from '../controllers/historyController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// Apply protection to all endpoints in this file
router.use(protect);

router.get('/', getSearchHistory);
router.delete('/:id', deleteHistoryItem);

export default router;
