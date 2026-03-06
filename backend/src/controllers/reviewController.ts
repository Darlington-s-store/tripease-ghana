import { Response } from 'express';
import pool from '../config/database.js';
import { ValidationError, UnauthorizedError, NotFoundError } from '../utils/errors.js';
import { AuthenticatedRequest } from '../middleware/auth.js';

export async function createReview(req: AuthenticatedRequest, res: Response) {
  if (!req.user) {
    throw new UnauthorizedError('User not authenticated');
  }

  const { bookingId, rating, title, comment } = req.body;

  if (!bookingId || !rating) {
    throw new ValidationError('Booking ID and rating are required');
  }

  if (rating < 1 || rating > 5) {
    throw new ValidationError('Rating must be between 1 and 5');
  }

  const client = await pool.connect();
  try {
    // Verify booking belongs to user
    const bookingResult = await client.query('SELECT id FROM bookings WHERE id = $1 AND user_id = $2', [bookingId, req.user.id]);
    if (bookingResult.rows.length === 0) {
      throw new UnauthorizedError('This booking does not belong to you');
    }

    // Check if review already exists
    const existingReview = await client.query('SELECT id FROM reviews WHERE booking_id = $1', [bookingId]);
    if (existingReview.rows.length > 0) {
      throw new ValidationError('You have already reviewed this booking');
    }

    const result = await client.query(
      'INSERT INTO reviews (booking_id, user_id, rating, title, comment) VALUES ($1, $2, $3, $4, $5) RETURNING id, booking_id, rating, title, comment, created_at',
      [bookingId, req.user.id, rating, title || null, comment || null]
    );

    res.status(201).json({
      success: true,
      message: 'Review created successfully',
      data: result.rows[0],
    });
  } finally {
    client.release();
  }
}

export async function getReviewsByBooking(req: AuthenticatedRequest, res: Response) {
  const { bookingId } = req.params;

  const client = await pool.connect();
  try {
    const result = await client.query(
      'SELECT id, booking_id, rating, title, comment, created_at FROM reviews WHERE booking_id = $1',
      [bookingId]
    );

    res.json({
      success: true,
      data: result.rows,
    });
  } finally {
    client.release();
  }
}

export async function getUserReviews(req: AuthenticatedRequest, res: Response) {
  if (!req.user) {
    throw new UnauthorizedError('User not authenticated');
  }

  const client = await pool.connect();
  try {
    const result = await client.query(
      'SELECT r.id, r.booking_id, r.rating, r.title, r.comment, r.created_at, b.booking_type, b.reference_id FROM reviews r JOIN bookings b ON r.booking_id = b.id WHERE r.user_id = $1 ORDER BY r.created_at DESC',
      [req.user.id]
    );

    res.json({
      success: true,
      data: result.rows,
    });
  } finally {
    client.release();
  }
}

export async function updateReview(req: AuthenticatedRequest, res: Response) {
  if (!req.user) {
    throw new UnauthorizedError('User not authenticated');
  }

  const { id } = req.params;
  const { rating, title, comment } = req.body;

  const client = await pool.connect();
  try {
    // Verify review belongs to user
    const reviewResult = await client.query('SELECT user_id FROM reviews WHERE id = $1', [id]);
    const review = reviewResult.rows[0];

    if (!review) {
      throw new NotFoundError('Review not found');
    }

    if (review.user_id !== req.user.id) {
      throw new UnauthorizedError('You do not have permission to update this review');
    }

    const result = await client.query(
      'UPDATE reviews SET rating = COALESCE($1, rating), title = COALESCE($2, title), comment = COALESCE($3, comment), updated_at = CURRENT_TIMESTAMP WHERE id = $4 RETURNING id, rating, title, comment',
      [rating || null, title || null, comment || null, id]
    );

    res.json({
      success: true,
      message: 'Review updated successfully',
      data: result.rows[0],
    });
  } finally {
    client.release();
  }
}

export async function deleteReview(req: AuthenticatedRequest, res: Response) {
  if (!req.user) {
    throw new UnauthorizedError('User not authenticated');
  }

  const { id } = req.params;

  const client = await pool.connect();
  try {
    // Verify review belongs to user
    const reviewResult = await client.query('SELECT user_id FROM reviews WHERE id = $1', [id]);
    const review = reviewResult.rows[0];

    if (!review) {
      throw new NotFoundError('Review not found');
    }

    if (review.user_id !== req.user.id) {
      throw new UnauthorizedError('You do not have permission to delete this review');
    }

    await client.query('DELETE FROM reviews WHERE id = $1', [id]);

    res.json({
      success: true,
      message: 'Review deleted successfully',
    });
  } finally {
    client.release();
  }
}
