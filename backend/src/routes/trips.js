import express from 'express';
import * as tripController from '../controllers/tripController.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

router.post('/', authenticateToken, (req, res, next) => {
  tripController.createTrip(req, res).catch(next);
});

router.get('/', authenticateToken, (req, res, next) => {
  tripController.getUserTrips(req, res).catch(next);
});

router.get('/:id', (req, res, next) => {
  tripController.getTripById(req, res).catch(next);
});

router.put('/:id', authenticateToken, (req, res, next) => {
  tripController.updateTrip(req, res).catch(next);
});

router.delete('/:id', authenticateToken, (req, res, next) => {
  tripController.deleteTrip(req, res).catch(next);
});

export default router;
