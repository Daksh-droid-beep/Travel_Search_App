import express from 'express';
import { addFavorite, getFavorites, removeFavorite, clearAllFavorites } from '../controllers/favoriteController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// Apply auth middleware to all endpoints
router.use(protect);

router.post('/', addFavorite);
router.get('/', getFavorites);
router.delete('/', clearAllFavorites);
router.delete('/:id', removeFavorite);

export default router;
