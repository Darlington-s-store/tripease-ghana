import { Router } from 'express';
import { getGuides, getGuideById, createGuide, updateGuide, deleteGuide } from '../controllers/guideController.js';
import { authenticateToken } from '../middleware/auth.js';

const router = Router();

// Public routes
router.get('/', async (req, res, next) => {
  try {
    await getGuides(req as any, res);
  } catch (error) {
    next(error);
  }
});

router.get('/:id', async (req, res, next) => {
  try {
    await getGuideById(req as any, res);
  } catch (error) {
    next(error);
  }
});

// Protected routes
router.post('/', authenticateToken, async (req, res, next) => {
  try {
    await createGuide(req as any, res);
  } catch (error) {
    next(error);
  }
});

router.put('/:id', authenticateToken, async (req, res, next) => {
  try {
    await updateGuide(req as any, res);
  } catch (error) {
    next(error);
  }
});

router.delete('/:id', authenticateToken, async (req, res, next) => {
  try {
    await deleteGuide(req as any, res);
  } catch (error) {
    next(error);
  }
});

export default router;
