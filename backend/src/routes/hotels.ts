import { Router } from 'express';
import { getHotels, getHotelById, createHotel, updateHotel, deleteHotel } from '../controllers/hotelController.js';
import { authenticateToken } from '../middleware/auth.js';

const router = Router();

// Public routes
router.get('/', async (req, res, next) => {
  try {
    await getHotels(req as any, res);
  } catch (error) {
    next(error);
  }
});

router.get('/:id', async (req, res, next) => {
  try {
    await getHotelById(req as any, res);
  } catch (error) {
    next(error);
  }
});

// Protected routes
router.post('/', authenticateToken, async (req, res, next) => {
  try {
    await createHotel(req as any, res);
  } catch (error) {
    next(error);
  }
});

router.put('/:id', authenticateToken, async (req, res, next) => {
  try {
    await updateHotel(req as any, res);
  } catch (error) {
    next(error);
  }
});

router.delete('/:id', authenticateToken, async (req, res, next) => {
  try {
    await deleteHotel(req as any, res);
  } catch (error) {
    next(error);
  }
});

export default router;
