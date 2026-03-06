import pool from '../config/database.js';
import { UnauthorizedError, NotFoundError, ValidationError } from '../utils/errors.js';
import { v4 as uuidv4 } from 'uuid';

export async function createReview(req, res) {
  if (!req.user) throw new UnauthorizedError('Not authenticated');

  const { bookingId, rating, comment } = req.body;
  if (!bookingId || !rating || !comment) {
    throw new ValidationError('Booking ID, rating, and comment are required');
  }

  const client = await pool.connect();
  try {
    const result = await client.query(
      `INSERT INTO reviews (id, user_id, booking_id, rating, comment) 
       VALUES ($1, $2, $3, $4, $5) 
       RETURNING id, user_id, booking_id, rating, comment, created_at`,
      [uuidv4(), req.user.id, bookingId, rating, comment]
    );
    res.status(201).json({ success: true, data: result.rows[0] });
  } finally {
    client.release();
  }
}

export async function getUserReviews(req, res) {
  if (!req.user) throw new UnauthorizedError('Not authenticated');

  const client = await pool.connect();
  try {
    const result = await client.query(
      'SELECT id, booking_id, rating, comment, created_at FROM reviews WHERE user_id = $1 ORDER BY created_at DESC',
      [req.user.id]
    );
    res.json({ success: true, data: result.rows });
  } finally {
    client.release();
  }
}

export async function deleteReview(req, res) {
  if (!req.user) throw new UnauthorizedError('Not authenticated');

  const { id } = req.params;
  const client = await pool.connect();
  try {
    await client.query('DELETE FROM reviews WHERE id = $1 AND user_id = $2', [id, req.user.id]);
    res.json({ success: true, message: 'Review deleted' });
  } finally {
    client.release();
  }
}
