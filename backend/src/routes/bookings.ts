import { Router } from 'express';
import { createBooking, getBookings, getBookingById, updateBookingStatus, cancelBooking, getAllBookings } from '../controllers/bookingController.js';
import { authenticateToken, authorizeRole } from '../middleware/auth.js';

const router = Router();

// Protected routes
router.use(authenticateToken);

router.post('/', async (req, res, next) => {
  try {
    await createBooking(req as any, res);
  } catch (error) {
    next(error);
  }
});

router.get('/', async (req, res, next) => {
  try {
    if (req.query.admin) {
      await getAllBookings(req as any, res);
    } else {
      await getBookings(req as any, res);
    }
  } catch (error) {
    next(error);
  }
});

router.get('/:id', async (req, res, next) => {
  try {
    await getBookingById(req as any, res);
  } catch (error) {
    next(error);
  }
});

router.put('/:id/status', async (req, res, next) => {
  try {
    await updateBookingStatus(req as any, res);
  } catch (error) {
    next(error);
  }
});

router.put('/:id/cancel', async (req, res, next) => {
  try {
    await cancelBooking(req as any, res);
  } catch (error) {
    next(error);
  }
});

export default router;
