import pool from '../config/database.js';
import { NotFoundError } from '../utils/errors.js';
import { v4 as uuidv4 } from 'uuid';

export async function getAllGuides(req, res) {
  const { location, specialization, limit = 20, offset = 0 } = req.query;
  const client = await pool.connect();
  try {
    let query = 'SELECT id, name, location, specialization, rating, price_per_day, phone FROM guides WHERE 1=1';
    const params = [];

    if (location) {
      query += ` AND location ILIKE $${params.length + 1}`;
      params.push(`%${location}%`);
    }
    if (specialization) {
      query += ` AND specialization ILIKE $${params.length + 1}`;
      params.push(`%${specialization}%`);
    }

    query += ` ORDER BY rating DESC LIMIT $${params.length + 1} OFFSET $${params.length + 2}`;
    params.push(parseInt(limit), parseInt(offset));

    const result = await client.query(query, params);
    res.json({ success: true, data: result.rows });
  } finally {
    client.release();
  }
}

export async function getGuideById(req, res) {
  const { id } = req.params;
  const client = await pool.connect();
  try {
    const result = await client.query('SELECT * FROM guides WHERE id = $1', [id]);
    if (result.rows.length === 0) throw new NotFoundError('Guide not found');
    res.json({ success: true, data: result.rows[0] });
  } finally {
    client.release();
  }
}

export async function createGuide(req, res) {
  const { name, location, specialization, rating, pricePerDay, phone, bio } = req.body;
  const client = await pool.connect();
  try {
    const result = await client.query(
      `INSERT INTO guides (id, name, location, specialization, rating, price_per_day, phone, bio) 
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8) 
       RETURNING id, name, location, specialization, rating`,
      [uuidv4(), name, location, specialization, rating || 0, pricePerDay, phone, bio]
    );
    res.status(201).json({ success: true, data: result.rows[0] });
  } finally {
    client.release();
  }
}

export async function updateGuide(req, res) {
  const { id } = req.params;
  const { name, location, specialization, rating, pricePerDay, phone, bio } = req.body;
  const client = await pool.connect();
  try {
    const result = await client.query(
      `UPDATE guides SET name = COALESCE($1, name), location = COALESCE($2, location), 
       specialization = COALESCE($3, specialization), rating = COALESCE($4, rating),
       price_per_day = COALESCE($5, price_per_day), phone = COALESCE($6, phone),
       bio = COALESCE($7, bio), updated_at = CURRENT_TIMESTAMP WHERE id = $8 
       RETURNING id, name, location, specialization, rating`,
      [name || null, location || null, specialization || null, rating || null, pricePerDay || null, phone || null, bio || null, id]
    );
    if (result.rows.length === 0) throw new NotFoundError('Guide not found');
    res.json({ success: true, message: 'Guide updated', data: result.rows[0] });
  } finally {
    client.release();
  }
}

export async function deleteGuide(req, res) {
  const { id } = req.params;
  const client = await pool.connect();
  try {
    await client.query('DELETE FROM guides WHERE id = $1', [id]);
    res.json({ success: true, message: 'Guide deleted' });
  } finally {
    client.release();
  }
}
