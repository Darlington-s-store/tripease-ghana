import { Response } from 'express';
import pool from '../config/database.js';
import { ValidationError, UnauthorizedError, NotFoundError } from '../utils/errors.js';
import { AuthenticatedRequest } from '../middleware/auth.js';

export async function getGuides(req: AuthenticatedRequest, res: Response) {
  const { language, minPrice, maxPrice, limit = 20, offset = 0 } = req.query;

  let query = 'SELECT id, name, experience_years, languages, hourly_rate, bio, rating, image_url FROM tour_guides WHERE 1=1';
  const params: any[] = [];
  let paramCount = 1;

  if (language) {
    query += ` AND languages ILIKE $${paramCount}`;
    params.push(`%${language}%`);
    paramCount++;
  }

  if (minPrice) {
    query += ` AND hourly_rate >= $${paramCount}`;
    params.push(parseFloat(minPrice as string));
    paramCount++;
  }

  if (maxPrice) {
    query += ` AND hourly_rate <= $${paramCount}`;
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

export async function getGuideById(req: AuthenticatedRequest, res: Response) {
  const { id } = req.params;

  const client = await pool.connect();
  try {
    const guideResult = await client.query(
      'SELECT id, name, experience_years, languages, hourly_rate, bio, rating, image_url FROM tour_guides WHERE id = $1',
      [id]
    );

    const guide = guideResult.rows[0];
    if (!guide) {
      throw new NotFoundError('Guide not found');
    }

    const reviewsResult = await client.query(
      'SELECT AVG(rating) as average_rating, COUNT(*) as total_reviews FROM reviews WHERE booking_id IN (SELECT id FROM bookings WHERE reference_id = $1 AND booking_type = $2)',
      [id, 'guide']
    );

    res.json({
      success: true,
      data: {
        ...guide,
        reviews: reviewsResult.rows[0],
      },
    });
  } finally {
    client.release();
  }
}

export async function createGuide(req: AuthenticatedRequest, res: Response) {
  if (!req.user) {
    throw new UnauthorizedError('User not authenticated');
  }

  const { name, experienceYears, languages, hourlyRate, bio, imageUrl } = req.body;

  if (!name || !hourlyRate) {
    throw new ValidationError('Name and hourly rate are required');
  }

  const client = await pool.connect();
  try {
    // Get or create provider
    let providerResult = await client.query('SELECT id FROM providers WHERE user_id = $1 AND provider_type = $2', [req.user.id, 'guide']);
    let providerId = providerResult.rows[0]?.id;

    if (!providerId) {
      const newProvider = await client.query(
        'INSERT INTO providers (user_id, business_name, provider_type) VALUES ($1, $2, $3) RETURNING id',
        [req.user.id, name, 'guide']
      );
      providerId = newProvider.rows[0].id;
    }

    const result = await client.query(
      'INSERT INTO tour_guides (provider_id, name, experience_years, languages, hourly_rate, bio, image_url) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING id, name, experience_years, languages, hourly_rate, bio, image_url',
      [providerId, name, experienceYears || null, languages || null, hourlyRate, bio || null, imageUrl || null]
    );

    res.status(201).json({
      success: true,
      message: 'Guide created successfully',
      data: result.rows[0],
    });
  } finally {
    client.release();
  }
}

export async function updateGuide(req: AuthenticatedRequest, res: Response) {
  if (!req.user) {
    throw new UnauthorizedError('User not authenticated');
  }

  const { id } = req.params;
  const { name, experienceYears, languages, hourlyRate, bio, imageUrl } = req.body;

  const client = await pool.connect();
  try {
    // Check if user owns this guide
    const guideResult = await client.query(
      'SELECT tg.id FROM tour_guides tg JOIN providers p ON tg.provider_id = p.id WHERE tg.id = $1 AND p.user_id = $2',
      [id, req.user.id]
    );

    if (guideResult.rows.length === 0) {
      throw new UnauthorizedError('You do not have permission to update this guide');
    }

    const result = await client.query(
      'UPDATE tour_guides SET name = COALESCE($1, name), experience_years = COALESCE($2, experience_years), languages = COALESCE($3, languages), hourly_rate = COALESCE($4, hourly_rate), bio = COALESCE($5, bio), image_url = COALESCE($6, image_url), updated_at = CURRENT_TIMESTAMP WHERE id = $7 RETURNING id, name, experience_years, languages, hourly_rate, bio, image_url',
      [name || null, experienceYears || null, languages || null, hourlyRate || null, bio || null, imageUrl || null, id]
    );

    res.json({
      success: true,
      message: 'Guide updated successfully',
      data: result.rows[0],
    });
  } finally {
    client.release();
  }
}

export async function deleteGuide(req: AuthenticatedRequest, res: Response) {
  if (!req.user) {
    throw new UnauthorizedError('User not authenticated');
  }

  const { id } = req.params;

  const client = await pool.connect();
  try {
    // Check if user owns this guide
    const guideResult = await client.query(
      'SELECT tg.id FROM tour_guides tg JOIN providers p ON tg.provider_id = p.id WHERE tg.id = $1 AND p.user_id = $2',
      [id, req.user.id]
    );

    if (guideResult.rows.length === 0) {
      throw new UnauthorizedError('You do not have permission to delete this guide');
    }

    await client.query('DELETE FROM tour_guides WHERE id = $1', [id]);

    res.json({
      success: true,
      message: 'Guide deleted successfully',
    });
  } finally {
    client.release();
  }
}
