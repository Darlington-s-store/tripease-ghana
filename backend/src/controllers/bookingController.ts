import { Response } from 'express';
import pool from '../config/database.js';
import { ValidationError, UnauthorizedError, NotFoundError } from '../utils/errors.js';
import { AuthenticatedRequest } from '../middleware/auth.js';

export async function createBooking(req: AuthenticatedRequest, res: Response) {
  if (!req.user) {
    throw new UnauthorizedError('User not authenticated');
  }

  const { tripId, bookingType, referenceId, checkInDate, checkOutDate, totalPrice, numberOfGuests, specialRequests } = req.body;

  if (!bookingType || !referenceId || !totalPrice) {
    throw new ValidationError('Booking type, reference ID, and total price are required');
  }

  const client = await pool.connect();
  try {
    const result = await client.query(
      'INSERT INTO bookings (user_id, trip_id, booking_type, reference_id, check_in_date, check_out_date, total_price, number_of_guests, special_requests, status) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) RETURNING id, user_id, trip_id, booking_type, reference_id, check_in_date, check_out_date, total_price, status, created_at',
      [req.user.id, tripId || null, bookingType, referenceId, checkInDate || null, checkOutDate || null, totalPrice, numberOfGuests || null, specialRequests || null, 'confirmed']
    );

    const booking = result.rows[0];

    // Create payment record
    await client.query(
      'INSERT INTO payments (booking_id, amount, status) VALUES ($1, $2, $3)',
      [booking.id, totalPrice, 'completed']
    );

    res.status(201).json({
      success: true,
      message: 'Booking created successfully',
      data: booking,
    });
  } finally {
    client.release();
  }
}

export async function getBookings(req: AuthenticatedRequest, res: Response) {
  if (!req.user) {
    throw new UnauthorizedError('User not authenticated');
  }

  const { status } = req.query;

  let query = 'SELECT id, trip_id, booking_type, reference_id, check_in_date, check_out_date, total_price, status, created_at FROM bookings WHERE user_id = $1';
  const params: any[] = [req.user.id];

  if (status) {
    query += ' AND status = $2';
    params.push(status);
  }

  query += ' ORDER BY created_at DESC';

  const client = await pool.connect();
  try {
    const result = await client.query(query, params);

    res.json({
      success: true,
      data: result.rows,
    });
  } finally {
    client.release();
  }
}

export async function getBookingById(req: AuthenticatedRequest, res: Response) {
  if (!req.user) {
    throw new UnauthorizedError('User not authenticated');
  }

  const { id } = req.params;

  const client = await pool.connect();
  try {
    const bookingResult = await client.query(
      'SELECT id, user_id, trip_id, booking_type, reference_id, check_in_date, check_out_date, total_price, number_of_guests, special_requests, status, created_at FROM bookings WHERE id = $1',
      [id]
    );

    const booking = bookingResult.rows[0];
    if (!booking) {
      throw new NotFoundError('Booking not found');
    }

    if (booking.user_id !== req.user.id) {
      throw new UnauthorizedError('You do not have permission to view this booking');
    }

    const paymentResult = await client.query(
      'SELECT id, amount, status FROM payments WHERE booking_id = $1',
      [id]
    );

    const reviewResult = await client.query(
      'SELECT id, rating, comment FROM reviews WHERE booking_id = $1',
      [id]
    );

    res.json({
      success: true,
      data: {
        ...booking,
        payment: paymentResult.rows[0],
        review: reviewResult.rows[0],
      },
    });
  } finally {
    client.release();
  }
}

export async function updateBookingStatus(req: AuthenticatedRequest, res: Response) {
  if (!req.user) {
    throw new UnauthorizedError('User not authenticated');
  }

  const { id } = req.params;
  const { status } = req.body;

  if (!status) {
    throw new ValidationError('Status is required');
  }

  const client = await pool.connect();
  try {
    const bookingResult = await client.query('SELECT user_id FROM bookings WHERE id = $1', [id]);
    const booking = bookingResult.rows[0];

    if (!booking) {
      throw new NotFoundError('Booking not found');
    }

    if (booking.user_id !== req.user.id) {
      throw new UnauthorizedError('You do not have permission to update this booking');
    }

    const result = await client.query(
      'UPDATE bookings SET status = $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2 RETURNING id, booking_type, reference_id, status',
      [status, id]
    );

    res.json({
      success: true,
      message: 'Booking updated successfully',
      data: result.rows[0],
    });
  } finally {
    client.release();
  }
}

export async function cancelBooking(req: AuthenticatedRequest, res: Response) {
  if (!req.user) {
    throw new UnauthorizedError('User not authenticated');
  }

  const { id } = req.params;

  const client = await pool.connect();
  try {
    const bookingResult = await client.query('SELECT user_id, status FROM bookings WHERE id = $1', [id]);
    const booking = bookingResult.rows[0];

    if (!booking) {
      throw new NotFoundError('Booking not found');
    }

    if (booking.user_id !== req.user.id) {
      throw new UnauthorizedError('You do not have permission to cancel this booking');
    }

    if (booking.status === 'cancelled') {
      throw new ValidationError('Booking is already cancelled');
    }

    const result = await client.query(
      'UPDATE bookings SET status = $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2 RETURNING id, status',
      ['cancelled', id]
    );

    res.json({
      success: true,
      message: 'Booking cancelled successfully',
      data: result.rows[0],
    });
  } finally {
    client.release();
  }
}

// Admin endpoints
export async function getAllBookings(req: AuthenticatedRequest, res: Response) {
  if (!req.user || req.user.role !== 'admin') {
    throw new UnauthorizedError('Admin access required');
  }

  const { status, limit = 20, offset = 0 } = req.query;

  let query = 'SELECT id, user_id, trip_id, booking_type, reference_id, total_price, status, created_at FROM bookings WHERE 1=1';
  const params: any[] = [];
  let paramCount = 1;

  if (status) {
    query += ` AND status = $${paramCount}`;
    params.push(status);
    paramCount++;
  }

  query += ` LIMIT $${paramCount} OFFSET $${paramCount + 1}`;
  params.push(parseInt(limit as string));
  params.push(parseInt(offset as string));

  const client = await pool.connect();
  try {
    const result = await client.query(query, params);

    res.json({
      success: true,
      data: result.rows,
    });
  } finally {
    client.release();
  }
}
