import express from 'express';
import {
  registerUser,
  loginUser,
  resetPassword,
  deleteAccount,
} from '../controllers/authController.js';
import authMiddleware from '../middleware/auth.js';

const router = express.Router();

router.post('/register', registerUser);

router.post('/login', loginUser);

router.post('/reset-password', resetPassword);

router.delete('/delete-account', authMiddleware, deleteAccount);

export default router;
