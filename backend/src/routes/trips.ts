import { Router } from 'express';
import { createTrip, getTrips, getTripById, updateTrip, deleteTrip, addItinerary } from '../controllers/tripController.js';
import { authenticateToken } from '../middleware/auth.js';

const router = Router();

// All routes require authentication
router.use(authenticateToken);

router.post('/', async (req, res, next) => {
  try {
    await createTrip(req as any, res);
  } catch (error) {
    next(error);
  }
});

router.get('/', async (req, res, next) => {
  try {
    await getTrips(req as any, res);
  } catch (error) {
    next(error);
  }
});

router.get('/:id', async (req, res, next) => {
  try {
    await getTripById(req as any, res);
  } catch (error) {
    next(error);
  }
});

router.put('/:id', async (req, res, next) => {
  try {
    await updateTrip(req as any, res);
  } catch (error) {
    next(error);
  }
});

router.delete('/:id', async (req, res, next) => {
  try {
    await deleteTrip(req as any, res);
  } catch (error) {
    next(error);
  }
});

router.post('/:id/itinerary', async (req, res, next) => {
  try {
    await addItinerary(req as any, res);
  } catch (error) {
    next(error);
  }
});

export default router;
