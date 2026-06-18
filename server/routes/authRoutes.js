import express from 'express';
import {
  register,
  login,
  logout,
  getMe,
  updateDetails,
  updatePassword,
  forgotPassword,
  resetPassword,
  verifyEmail,
  refreshToken
} from '../controllers/authController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

// Public Auth Endpoints
router.post('/register', register);
router.post('/login', login);
router.post('/forgot-password', forgotPassword);
router.put('/reset-password/:token', resetPassword);
router.get('/verify/:token', verifyEmail);
router.post('/refresh-token', refreshToken);

// Private Auth Endpoints
router.post('/logout', protect, logout);
router.get('/me', protect, getMe);
router.put('/me/update', protect, updateDetails);
router.put('/me/password', protect, updatePassword);

export default router;
