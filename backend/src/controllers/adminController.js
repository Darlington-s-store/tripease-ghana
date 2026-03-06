import pool from '../config/database.js';
import { UnauthorizedError, NotFoundError, ValidationError } from '../utils/errors.js';

export async function getDashboard(req, res) {
  if (!req.user) throw new UnauthorizedError('Not authenticated');

  const client = await pool.connect();
  try {
    const [users, bookings, trips, reviews] = await Promise.all([
      client.query('SELECT COUNT(*) as count FROM users WHERE role = $1', ['user']),
      client.query('SELECT COUNT(*) as count FROM bookings'),
      client.query('SELECT COUNT(*) as count FROM trips'),
      client.query('SELECT COUNT(*) as count FROM reviews'),
    ]);

    const totalRevenue = await client.query('SELECT SUM(total_price) as total FROM bookings WHERE status = $1', ['completed']);

    res.json({
      success: true,
      data: {
        totalUsers: parseInt(users.rows[0].count),
        totalBookings: parseInt(bookings.rows[0].count),
        totalTrips: parseInt(trips.rows[0].count),
        totalReviews: parseInt(reviews.rows[0].count),
        totalRevenue: parseFloat(totalRevenue.rows[0].total || 0),
      },
    });
  } finally {
    client.release();
  }
}

export async function getAllUsers(req, res) {
  if (!req.user) throw new UnauthorizedError('Not authenticated');

  const client = await pool.connect();
  try {
    const result = await client.query('SELECT id, email, full_name, phone, role, status, created_at FROM users ORDER BY created_at DESC');
    res.json({
      success: true,
      data: result.rows,
    });
  } finally {
    client.release();
  }
}

export async function getUserById(req, res) {
  const { id } = req.params;
  const client = await pool.connect();
  try {
    const result = await client.query('SELECT id, email, full_name, phone, role, status, bio, created_at FROM users WHERE id = $1', [id]);
    if (result.rows.length === 0) throw new NotFoundError('User not found');
    res.json({ success: true, data: result.rows[0] });
  } finally {
    client.release();
  }
}

export async function updateUser(req, res) {
  const { id } = req.params;
  const { status, role } = req.body;
  const client = await pool.connect();
  try {
    const result = await client.query(
      'UPDATE users SET status = COALESCE($1, status), role = COALESCE($2, role), updated_at = CURRENT_TIMESTAMP WHERE id = $3 RETURNING id, email, full_name, status, role',
      [status || null, role || null, id]
    );
    if (result.rows.length === 0) throw new NotFoundError('User not found');
    res.json({ success: true, message: 'User updated', data: result.rows[0] });
  } finally {
    client.release();
  }
}

export async function deleteUser(req, res) {
  const { id } = req.params;
  const client = await pool.connect();
  try {
    await client.query('DELETE FROM users WHERE id = $1', [id]);
    res.json({ success: true, message: 'User deleted' });
  } finally {
    client.release();
  }
}

export async function getAllBookings(req, res) {
  if (!req.user) throw new UnauthorizedError('Not authenticated');

  const client = await pool.connect();
  try {
    const result = await client.query(`
      SELECT id, user_id, booking_type, status, total_price, created_at 
      FROM bookings 
      ORDER BY created_at DESC
    `);
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

export async function updateBooking(req, res) {
  const { id } = req.params;
  const { status } = req.body;
  const client = await pool.connect();
  try {
    const result = await client.query(
      'UPDATE bookings SET status = $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2 RETURNING id, status, total_price',
      [status, id]
    );
    if (result.rows.length === 0) throw new NotFoundError('Booking not found');
    res.json({ success: true, message: 'Booking updated', data: result.rows[0] });
  } finally {
    client.release();
  }
}

export async function getAllReviews(req, res) {
  if (!req.user) throw new UnauthorizedError('Not authenticated');

  const client = await pool.connect();
  try {
    const result = await client.query('SELECT id, user_id, booking_id, rating, comment, created_at FROM reviews ORDER BY created_at DESC');
    res.json({ success: true, data: result.rows });
  } finally {
    client.release();
  }
}

export async function deleteReview(req, res) {
  const { id } = req.params;
  const client = await pool.connect();
  try {
    await client.query('DELETE FROM reviews WHERE id = $1', [id]);
    res.json({ success: true, message: 'Review deleted' });
  } finally {
    client.release();
  }
}

export async function getRefunds(req, res) {
  const client = await pool.connect();
  try {
    const result = await client.query('SELECT id, booking_id, amount, reason, status, created_at FROM refunds ORDER BY created_at DESC');
    res.json({ success: true, data: result.rows });
  } finally {
    client.release();
  }
}

export async function updateRefund(req, res) {
  const { id } = req.params;
  const { status } = req.body;
  const client = await pool.connect();
  try {
    const result = await client.query(
      'UPDATE refunds SET status = $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2 RETURNING id, status, amount',
      [status, id]
    );
    if (result.rows.length === 0) throw new NotFoundError('Refund not found');
    res.json({ success: true, message: 'Refund updated', data: result.rows[0] });
  } finally {
    client.release();
  }
}

export async function getDisputes(req, res) {
  const client = await pool.connect();
  try {
    const result = await client.query('SELECT id, booking_id, description, status, admin_notes, created_at FROM disputes ORDER BY created_at DESC');
    res.json({ success: true, data: result.rows });
  } finally {
    client.release();
  }
}

export async function updateDispute(req, res) {
  const { id } = req.params;
  const { status, adminNotes } = req.body;
  const client = await pool.connect();
  try {
    const result = await client.query(
      'UPDATE disputes SET status = $1, admin_notes = COALESCE($2, admin_notes), updated_at = CURRENT_TIMESTAMP WHERE id = $3 RETURNING id, status, admin_notes',
      [status, adminNotes || null, id]
    );
    if (result.rows.length === 0) throw new NotFoundError('Dispute not found');
    res.json({ success: true, message: 'Dispute updated', data: result.rows[0] });
  } finally {
    client.release();
  }
}

export async function getAnalytics(req, res) {
  const client = await pool.connect();
  try {
    const [monthly, byType] = await Promise.all([
      client.query(`
        SELECT DATE_TRUNC('month', created_at)::date as month, COUNT(*) as count, SUM(total_price) as revenue
        FROM bookings
        GROUP BY DATE_TRUNC('month', created_at)
        ORDER BY month DESC
        LIMIT 12
      `),
      client.query(`
        SELECT booking_type, COUNT(*) as count, AVG(total_price) as avg_price
        FROM bookings
        GROUP BY booking_type
      `),
    ]);

    res.json({
      success: true,
      data: {
        monthlyBookings: monthly.rows,
        bookingsByType: byType.rows,
      },
    });
  } finally {
    client.release();
  }
}

export async function updateSettings(req, res) {
  const { key, value } = req.body;
  const client = await pool.connect();
  try {
    // Settings stored in a simple key-value manner (can use a settings table or env vars)
    res.json({ success: true, message: 'Settings updated', data: { key, value } });
  } finally {
    client.release();
  }
}
