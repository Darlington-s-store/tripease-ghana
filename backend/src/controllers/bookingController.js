import pool from '../config/database.js';
import { UnauthorizedError, NotFoundError, ValidationError } from '../utils/errors.js';
import { v4 as uuidv4 } from 'uuid';

export async function createBooking(req, res) {
  if (!req.user) throw new UnauthorizedError('Not authenticated');

  const { hotelId, startDate, endDate, guests, totalPrice, bookingType } = req.body;
  if (!hotelId || !startDate || !endDate || !totalPrice) {
    throw new ValidationError('Hotel ID, dates, and price are required');
  }

  const client = await pool.connect();
  try {
    const result = await client.query(
      `INSERT INTO bookings (id, user_id, hotel_id, booking_type, start_date, end_date, guests, total_price, status) 
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) 
       RETURNING id, user_id, hotel_id, booking_type, total_price, status, created_at`,
      [uuidv4(), req.user.id, hotelId, bookingType || 'hotel', startDate, endDate, guests || 1, totalPrice, 'pending']
    );
    res.status(201).json({ success: true, data: result.rows[0] });
  } finally {
    client.release();
  }
}

export async function getUserBookings(req, res) {
  if (!req.user) throw new UnauthorizedError('Not authenticated');

  const client = await pool.connect();
  try {
    const result = await client.query(
      'SELECT id, hotel_id, booking_type, start_date, end_date, guests, total_price, status, created_at FROM bookings WHERE user_id = $1 ORDER BY created_at DESC',
      [req.user.id]
    );
    res.json({ success: true, data: result.rows });
  } finally {
    client.release();
  }
}

export async function getBookingById(req, res) {
  const { id } = req.params;
  const client = await pool.connect();
  try {
    const result = await client.query('SELECT * FROM bookings WHERE id = $1', [id]);
    if (result.rows.length === 0) throw new NotFoundError('Booking not found');
    res.json({ success: true, data: result.rows[0] });
  } finally {
    client.release();
  }
}

export async function cancelBooking(req, res) {
  if (!req.user) throw new UnauthorizedError('Not authenticated');

  const { id } = req.params;
  const client = await pool.connect();
  try {
    const result = await client.query(
      'UPDATE bookings SET status = $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2 AND user_id = $3 RETURNING id, status',
      ['cancelled', id, req.user.id]
    );
    if (result.rows.length === 0) throw new NotFoundError('Booking not found or not authorized');
    res.json({ success: true, message: 'Booking cancelled', data: result.rows[0] });
  } finally {
    client.release();
  }
}

export async function updateBooking(req, res) {
  if (!req.user) throw new UnauthorizedError('Not authenticated');

  const { id } = req.params;
  const { status } = req.body;

  const client = await pool.connect();
  try {
    const result = await client.query(
      'UPDATE bookings SET status = $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2 AND user_id = $3 RETURNING id, status',
      [status, id, req.user.id]
    );
    if (result.rows.length === 0) throw new NotFoundError('Booking not found');
    res.json({ success: true, message: 'Booking updated', data: result.rows[0] });
  } finally {
    client.release();
  }
}
