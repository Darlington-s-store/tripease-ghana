import { Router } from 'express';
import { createReview, getReviewsByBooking, getUserReviews, updateReview, deleteReview } from '../controllers/reviewController.js';
import { authenticateToken } from '../middleware/auth.js';

const router = Router();

// Public routes
router.get('/booking/:bookingId', async (req, res, next) => {
  try {
    await getReviewsByBooking(req as any, res);
  } catch (error) {
    next(error);
  }
});

// Protected routes
router.post('/', authenticateToken, async (req, res, next) => {
  try {
    await createReview(req as any, res);
  } catch (error) {
    next(error);
  }
});

router.get('/', authenticateToken, async (req, res, next) => {
  try {
    await getUserReviews(req as any, res);
  } catch (error) {
    next(error);
  }
});

router.put('/:id', authenticateToken, async (req, res, next) => {
  try {
    await updateReview(req as any, res);
  } catch (error) {
    next(error);
  }
});

router.delete('/:id', authenticateToken, async (req, res, next) => {
  try {
    await deleteReview(req as any, res);
  } catch (error) {
    next(error);
  }
});

export default router;
