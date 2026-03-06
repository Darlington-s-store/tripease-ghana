import pool from '../config/database.js';
import { NotFoundError } from '../utils/errors.js';
import { v4 as uuidv4 } from 'uuid';

export async function getAllHotels(req, res) {
  const { location, minPrice, maxPrice, limit = 20, offset = 0 } = req.query;
  const client = await pool.connect();
  try {
    let query = 'SELECT id, name, location, price_per_night, rating, image_url, description FROM hotels WHERE 1=1';
    const params = [];

    if (location) {
      query += ` AND location ILIKE $${params.length + 1}`;
      params.push(`%${location}%`);
    }
    if (minPrice) {
      query += ` AND price_per_night >= $${params.length + 1}`;
      params.push(parseFloat(minPrice));
    }
    if (maxPrice) {
      query += ` AND price_per_night <= $${params.length + 1}`;
      params.push(parseFloat(maxPrice));
    }

    query += ` ORDER BY rating DESC LIMIT $${params.length + 1} OFFSET $${params.length + 2}`;
    params.push(parseInt(limit), parseInt(offset));

    const result = await client.query(query, params);
    res.json({ success: true, data: result.rows });
  } finally {
    client.release();
  }
}

export async function getHotelById(req, res) {
  const { id } = req.params;
  const client = await pool.connect();
  try {
    const result = await client.query('SELECT * FROM hotels WHERE id = $1', [id]);
    if (result.rows.length === 0) throw new NotFoundError('Hotel not found');
    res.json({ success: true, data: result.rows[0] });
  } finally {
    client.release();
  }
}

export async function createHotel(req, res) {
  const { name, location, pricePerNight, rating, imageUrl, description, amenities } = req.body;
  const client = await pool.connect();
  try {
    const result = await client.query(
      `INSERT INTO hotels (id, name, location, price_per_night, rating, image_url, description, amenities) 
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8) 
       RETURNING id, name, location, price_per_night, rating`,
      [uuidv4(), name, location, pricePerNight, rating || 0, imageUrl, description, amenities]
    );
    res.status(201).json({ success: true, data: result.rows[0] });
  } finally {
    client.release();
  }
}

export async function updateHotel(req, res) {
  const { id } = req.params;
  const { name, location, pricePerNight, rating, imageUrl, description } = req.body;
  const client = await pool.connect();
  try {
    const result = await client.query(
      `UPDATE hotels SET name = COALESCE($1, name), location = COALESCE($2, location), 
       price_per_night = COALESCE($3, price_per_night), rating = COALESCE($4, rating),
       image_url = COALESCE($5, image_url), description = COALESCE($6, description),
       updated_at = CURRENT_TIMESTAMP WHERE id = $7 
       RETURNING id, name, location, price_per_night, rating`,
      [name || null, location || null, pricePerNight || null, rating || null, imageUrl || null, description || null, id]
    );
    if (result.rows.length === 0) throw new NotFoundError('Hotel not found');
    res.json({ success: true, message: 'Hotel updated', data: result.rows[0] });
  } finally {
    client.release();
  }
}

export async function deleteHotel(req, res) {
  const { id } = req.params;
  const client = await pool.connect();
  try {
    await client.query('DELETE FROM hotels WHERE id = $1', [id]);
    res.json({ success: true, message: 'Hotel deleted' });
  } finally {
    client.release();
  }
}
