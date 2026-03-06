import express from 'express';
import * as authController from '../controllers/authController.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

// Public routes
router.post('/register', (req, res, next) => {
  authController.register(req, res).catch(next);
});

router.post('/login', (req, res, next) => {
  authController.login(req, res).catch(next);
});

router.post('/admin-login', (req, res, next) => {
  authController.adminLogin(req, res).catch(next);
});

// Protected routes
router.get('/profile', authenticateToken, (req, res, next) => {
  authController.getProfile(req, res).catch(next);
});

router.put('/profile', authenticateToken, (req, res, next) => {
  authController.updateProfile(req, res).catch(next);
});

export default router;
