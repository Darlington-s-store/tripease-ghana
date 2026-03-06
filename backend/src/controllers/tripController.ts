import { Response } from 'express';
import pool from '../config/database.js';
import { ValidationError, UnauthorizedError, NotFoundError } from '../utils/errors.js';
import { AuthenticatedRequest } from '../middleware/auth.js';

export async function createTrip(req: AuthenticatedRequest, res: Response) {
  if (!req.user) {
    throw new UnauthorizedError('User not authenticated');
  }

  const { destination, description, startDate, endDate, budget } = req.body;

  if (!destination || !startDate || !endDate) {
    throw new ValidationError('Destination, start date, and end date are required');
  }

  const client = await pool.connect();
  try {
    const result = await client.query(
      'INSERT INTO trips (user_id, destination, description, start_date, end_date, budget) VALUES ($1, $2, $3, $4, $5, $6) RETURNING id, user_id, destination, description, start_date, end_date, budget, status, created_at',
      [req.user.id, destination, description || null, startDate, endDate, budget || null]
    );

    const trip = result.rows[0];

    res.status(201).json({
      success: true,
      message: 'Trip created successfully',
      data: trip,
    });
  } finally {
    client.release();
  }
}

export async function getTrips(req: AuthenticatedRequest, res: Response) {
  if (!req.user) {
    throw new UnauthorizedError('User not authenticated');
  }

  const client = await pool.connect();
  try {
    const result = await client.query(
      'SELECT id, destination, description, start_date, end_date, budget, status, created_at FROM trips WHERE user_id = $1 ORDER BY created_at DESC',
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

export async function getTripById(req: AuthenticatedRequest, res: Response) {
  if (!req.user) {
    throw new UnauthorizedError('User not authenticated');
  }

  const { id } = req.params;

  const client = await pool.connect();
  try {
    const tripResult = await client.query(
      'SELECT id, user_id, destination, description, start_date, end_date, budget, status, created_at FROM trips WHERE id = $1',
      [id]
    );

    const trip = tripResult.rows[0];
    if (!trip) {
      throw new NotFoundError('Trip not found');
    }

    if (trip.user_id !== req.user.id) {
      throw new UnauthorizedError('You do not have permission to view this trip');
    }

    const itinerariesResult = await client.query(
      'SELECT id, trip_id, day_number, activities, notes FROM itineraries WHERE trip_id = $1 ORDER BY day_number ASC',
      [id]
    );

    const bookingsResult = await client.query(
      'SELECT id, booking_type, reference_id, status, total_price FROM bookings WHERE trip_id = $1',
      [id]
    );

    res.json({
      success: true,
      data: {
        ...trip,
        itineraries: itinerariesResult.rows,
        bookings: bookingsResult.rows,
      },
    });
  } finally {
    client.release();
  }
}

export async function updateTrip(req: AuthenticatedRequest, res: Response) {
  if (!req.user) {
    throw new UnauthorizedError('User not authenticated');
  }

  const { id } = req.params;
  const { destination, description, startDate, endDate, budget, status } = req.body;

  const client = await pool.connect();
  try {
    const tripResult = await client.query('SELECT user_id FROM trips WHERE id = $1', [id]);
    const trip = tripResult.rows[0];

    if (!trip) {
      throw new NotFoundError('Trip not found');
    }

    if (trip.user_id !== req.user.id) {
      throw new UnauthorizedError('You do not have permission to update this trip');
    }

    const result = await client.query(
      'UPDATE trips SET destination = COALESCE($1, destination), description = COALESCE($2, description), start_date = COALESCE($3, start_date), end_date = COALESCE($4, end_date), budget = COALESCE($5, budget), status = COALESCE($6, status), updated_at = CURRENT_TIMESTAMP WHERE id = $7 RETURNING id, destination, description, start_date, end_date, budget, status',
      [destination || null, description || null, startDate || null, endDate || null, budget || null, status || null, id]
    );

    res.json({
      success: true,
      message: 'Trip updated successfully',
      data: result.rows[0],
    });
  } finally {
    client.release();
  }
}

export async function deleteTrip(req: AuthenticatedRequest, res: Response) {
  if (!req.user) {
    throw new UnauthorizedError('User not authenticated');
  }

  const { id } = req.params;

  const client = await pool.connect();
  try {
    const tripResult = await client.query('SELECT user_id FROM trips WHERE id = $1', [id]);
    const trip = tripResult.rows[0];

    if (!trip) {
      throw new NotFoundError('Trip not found');
    }

    if (trip.user_id !== req.user.id) {
      throw new UnauthorizedError('You do not have permission to delete this trip');
    }

    await client.query('DELETE FROM trips WHERE id = $1', [id]);

    res.json({
      success: true,
      message: 'Trip deleted successfully',
    });
  } finally {
    client.release();
  }
}

export async function addItinerary(req: AuthenticatedRequest, res: Response) {
  if (!req.user) {
    throw new UnauthorizedError('User not authenticated');
  }

  const { id } = req.params;
  const { dayNumber, activities, notes } = req.body;

  if (!dayNumber) {
    throw new ValidationError('Day number is required');
  }

  const client = await pool.connect();
  try {
    const tripResult = await client.query('SELECT user_id FROM trips WHERE id = $1', [id]);
    const trip = tripResult.rows[0];

    if (!trip || trip.user_id !== req.user.id) {
      throw new UnauthorizedError('You do not have permission to add itineraries to this trip');
    }

    const result = await client.query(
      'INSERT INTO itineraries (trip_id, day_number, activities, notes) VALUES ($1, $2, $3, $4) RETURNING id, trip_id, day_number, activities, notes',
      [id, dayNumber, activities || null, notes || null]
    );

    res.status(201).json({
      success: true,
      message: 'Itinerary added successfully',
      data: result.rows[0],
    });
  } finally {
    client.release();
  }
}
