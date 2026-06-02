import express from 'express';
import { registerUser, loginUser, getMe, verifyEmail, resendVerification } from '../controllers/authController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/register', registerUser);
router.post('/login', loginUser);
router.post('/resend-verification', resendVerification);
router.get('/verify/:token', verifyEmail);
router.get('/me', protect, getMe);

export default router;
