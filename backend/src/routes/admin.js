import express from 'express';
import { authenticateToken, authorizeRole } from '../middleware/auth.js';
import * as adminController from '../controllers/adminController.js';

const router = express.Router();

// All admin routes require authentication and admin role
router.use(authenticateToken);
router.use(authorizeRole(['admin']));

// Dashboard
router.get('/dashboard', adminController.getDashboard);

// Users
router.get('/users', adminController.getAllUsers);
router.get('/users/:id', adminController.getUserById);
router.put('/users/:id', adminController.updateUser);
router.delete('/users/:id', adminController.deleteUser);

// Bookings
router.get('/bookings', adminController.getAllBookings);
router.get('/bookings/:id', adminController.getBookingById);
router.put('/bookings/:id', adminController.updateBooking);

// Reviews
router.get('/reviews', adminController.getAllReviews);
router.delete('/reviews/:id', adminController.deleteReview);

// Refunds
router.get('/refunds', adminController.getRefunds);
router.put('/refunds/:id', adminController.updateRefund);

// Disputes
router.get('/disputes', adminController.getDisputes);
router.put('/disputes/:id', adminController.updateDispute);

// Analytics
router.get('/analytics', adminController.getAnalytics);

// Settings
router.put('/settings', adminController.updateSettings);

export default router;
