import { Response } from 'express';
import pool from '../config/database.js';
import { ValidationError, UnauthorizedError, NotFoundError } from '../utils/errors.js';
import { AuthenticatedRequest } from '../middleware/auth.js';

export async function getHotels(req: AuthenticatedRequest, res: Response) {
  const { location, minPrice, maxPrice, limit = 20, offset = 0 } = req.query;

  let query = 'SELECT id, name, location, description, price_per_night, amenities, rating, image_url FROM hotels WHERE 1=1';
  const params: any[] = [];
  let paramCount = 1;

  if (location) {
    query += ` AND location ILIKE $${paramCount}`;
    params.push(`%${location}%`);
    paramCount++;
  }

  if (minPrice) {
    query += ` AND price_per_night >= $${paramCount}`;
    params.push(parseFloat(minPrice as string));
    paramCount++;
  }

  if (maxPrice) {
    query += ` AND price_per_night <= $${paramCount}`;
    params.push(parseFloat(maxPrice as string));
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

export async function getHotelById(req: AuthenticatedRequest, res: Response) {
  const { id } = req.params;

  const client = await pool.connect();
  try {
    const hotelResult = await client.query(
      'SELECT id, name, location, description, price_per_night, amenities, rating, total_rooms, available_rooms, image_url FROM hotels WHERE id = $1',
      [id]
    );

    const hotel = hotelResult.rows[0];
    if (!hotel) {
      throw new NotFoundError('Hotel not found');
    }

    const roomsResult = await client.query(
      'SELECT id, room_type, price_per_night, capacity, available_count FROM hotel_rooms WHERE hotel_id = $1',
      [id]
    );

    res.json({
      success: true,
      data: {
        ...hotel,
        rooms: roomsResult.rows,
      },
    });
  } finally {
    client.release();
  }
}

export async function createHotel(req: AuthenticatedRequest, res: Response) {
  if (!req.user) {
    throw new UnauthorizedError('User not authenticated');
  }

  const { name, location, description, pricePerNight, amenities, totalRooms, imageUrl } = req.body;

  if (!name || !location || !pricePerNight) {
    throw new ValidationError('Name, location, and price per night are required');
  }

  const client = await pool.connect();
  try {
    // Get or create provider
    let providerResult = await client.query('SELECT id FROM providers WHERE user_id = $1 AND provider_type = $2', [req.user.id, 'hotel']);
    let providerId = providerResult.rows[0]?.id;

    if (!providerId) {
      const newProvider = await client.query(
        'INSERT INTO providers (user_id, business_name, provider_type) VALUES ($1, $2, $3) RETURNING id',
        [req.user.id, name, 'hotel']
      );
      providerId = newProvider.rows[0].id;
    }

    const result = await client.query(
      'INSERT INTO hotels (provider_id, name, location, description, price_per_night, amenities, total_rooms, available_rooms, image_url) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING id, name, location, description, price_per_night, amenities, total_rooms, available_rooms, image_url',
      [providerId, name, location, description || null, pricePerNight, amenities || null, totalRooms || null, totalRooms || 0, imageUrl || null]
    );

    res.status(201).json({
      success: true,
      message: 'Hotel created successfully',
      data: result.rows[0],
    });
  } finally {
    client.release();
  }
}

export async function updateHotel(req: AuthenticatedRequest, res: Response) {
  if (!req.user) {
    throw new UnauthorizedError('User not authenticated');
  }

  const { id } = req.params;
  const { name, location, description, pricePerNight, amenities, imageUrl } = req.body;

  const client = await pool.connect();
  try {
    // Check if user owns this hotel
    const hotelResult = await client.query(
      'SELECT h.id FROM hotels h JOIN providers p ON h.provider_id = p.id WHERE h.id = $1 AND p.user_id = $2',
      [id, req.user.id]
    );

    if (hotelResult.rows.length === 0) {
      throw new UnauthorizedError('You do not have permission to update this hotel');
    }

    const result = await client.query(
      'UPDATE hotels SET name = COALESCE($1, name), location = COALESCE($2, location), description = COALESCE($3, description), price_per_night = COALESCE($4, price_per_night), amenities = COALESCE($5, amenities), image_url = COALESCE($6, image_url), updated_at = CURRENT_TIMESTAMP WHERE id = $7 RETURNING id, name, location, description, price_per_night, amenities, image_url',
      [name || null, location || null, description || null, pricePerNight || null, amenities || null, imageUrl || null, id]
    );

    res.json({
      success: true,
      message: 'Hotel updated successfully',
      data: result.rows[0],
    });
  } finally {
    client.release();
  }
}

export async function deleteHotel(req: AuthenticatedRequest, res: Response) {
  if (!req.user) {
    throw new UnauthorizedError('User not authenticated');
  }

  const { id } = req.params;

  const client = await pool.connect();
  try {
    // Check if user owns this hotel
    const hotelResult = await client.query(
      'SELECT h.id FROM hotels h JOIN providers p ON h.provider_id = p.id WHERE h.id = $1 AND p.user_id = $2',
      [id, req.user.id]
    );

    if (hotelResult.rows.length === 0) {
      throw new UnauthorizedError('You do not have permission to delete this hotel');
    }

    await client.query('DELETE FROM hotels WHERE id = $1', [id]);

    res.json({
      success: true,
      message: 'Hotel deleted successfully',
    });
  } finally {
    client.release();
  }
}
