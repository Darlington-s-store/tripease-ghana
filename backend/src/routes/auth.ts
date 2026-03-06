import { Router } from 'express';
import { register, login, adminLogin, getProfile, updateProfile } from '../controllers/authController.js';
import { authenticateToken } from '../middleware/auth.js';

const router = Router();

// Public routes
router.post('/register', async (req, res, next) => {
  try {
    await register(req as any, res);
  } catch (error) {
    next(error);
  }
});

router.post('/login', async (req, res, next) => {
  try {
    await login(req as any, res);
  } catch (error) {
    next(error);
  }
});

router.post('/admin-login', async (req, res, next) => {
  try {
    await adminLogin(req as any, res);
  } catch (error) {
    next(error);
  }
});

// Protected routes
router.get('/profile', authenticateToken, async (req, res, next) => {
  try {
    await getProfile(req as any, res);
  } catch (error) {
    next(error);
  }
});

router.put('/profile', authenticateToken, async (req, res, next) => {
  try {
    await updateProfile(req as any, res);
  } catch (error) {
    next(error);
  }
});

export default router;
