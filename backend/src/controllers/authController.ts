import { Response } from 'express';
import pool from '../config/database.js';
import { generateToken } from '../utils/jwt.js';
import { hashPassword, comparePassword } from '../utils/password.js';
import { ValidationError, UnauthorizedError, ConflictError } from '../utils/errors.js';
import { AuthenticatedRequest } from '../middleware/auth.js';

export async function register(req: AuthenticatedRequest, res: Response) {
  const { email, password, fullName, phone } = req.body;

  if (!email || !password || !fullName) {
    throw new ValidationError('Email, password, and full name are required');
  }

  const client = await pool.connect();
  try {
    // Check if user already exists
    const userExists = await client.query('SELECT * FROM users WHERE email = $1', [email]);
    if (userExists.rows.length > 0) {
      throw new ConflictError('User with this email already exists');
    }

    const hashedPassword = await hashPassword(password);
    const result = await client.query(
      'INSERT INTO users (email, password_hash, full_name, phone, role) VALUES ($1, $2, $3, $4, $5) RETURNING id, email, full_name, role',
      [email, hashedPassword, fullName, phone || null, 'user']
    );

    const user = result.rows[0];
    const token = generateToken({ id: user.id, email: user.email, role: user.role });

    res.status(201).json({
      success: true,
      message: 'User registered successfully',
      data: {
        user,
        token,
      },
    });
  } finally {
    client.release();
  }
}

export async function login(req: AuthenticatedRequest, res: Response) {
  const { email, password } = req.body;

  if (!email || !password) {
    throw new ValidationError('Email and password are required');
  }

  const client = await pool.connect();
  try {
    const result = await client.query('SELECT * FROM users WHERE email = $1', [email]);
    const user = result.rows[0];

    if (!user) {
      throw new UnauthorizedError('Invalid email or password');
    }

    const passwordMatch = await comparePassword(password, user.password_hash);
    if (!passwordMatch) {
      throw new UnauthorizedError('Invalid email or password');
    }

    if (user.role === 'admin') {
      throw new UnauthorizedError('Admin users must use admin login endpoint');
    }

    const token = generateToken({ id: user.id, email: user.email, role: user.role });

    res.json({
      success: true,
      message: 'Login successful',
      data: {
        user: {
          id: user.id,
          email: user.email,
          full_name: user.full_name,
          role: user.role,
          avatar_url: user.avatar_url,
        },
        token,
      },
    });
  } finally {
    client.release();
  }
}

export async function adminLogin(req: AuthenticatedRequest, res: Response) {
  const { email, password } = req.body;

  if (!email || !password) {
    throw new ValidationError('Email and password are required');
  }

  const client = await pool.connect();
  try {
    const result = await client.query('SELECT * FROM users WHERE email = $1 AND role = $2', [email, 'admin']);
    const user = result.rows[0];

    if (!user) {
      throw new UnauthorizedError('Invalid admin credentials');
    }

    const passwordMatch = await comparePassword(password, user.password_hash);
    if (!passwordMatch) {
      throw new UnauthorizedError('Invalid admin credentials');
    }

    const token = generateToken({ id: user.id, email: user.email, role: user.role });

    res.json({
      success: true,
      message: 'Admin login successful',
      data: {
        user: {
          id: user.id,
          email: user.email,
          full_name: user.full_name,
          role: user.role,
        },
        token,
      },
    });
  } finally {
    client.release();
  }
}

export async function getProfile(req: AuthenticatedRequest, res: Response) {
  if (!req.user) {
    throw new UnauthorizedError('User not authenticated');
  }

  const client = await pool.connect();
  try {
    const result = await client.query('SELECT id, email, full_name, phone, avatar_url, bio, role FROM users WHERE id = $1', [req.user.id]);
    const user = result.rows[0];

    if (!user) {
      throw new ValidationError('User not found');
    }

    res.json({
      success: true,
      data: user,
    });
  } finally {
    client.release();
  }
}

export async function updateProfile(req: AuthenticatedRequest, res: Response) {
  if (!req.user) {
    throw new UnauthorizedError('User not authenticated');
  }

  const { fullName, phone, bio, avatarUrl } = req.body;

  const client = await pool.connect();
  try {
    const result = await client.query(
      'UPDATE users SET full_name = COALESCE($1, full_name), phone = COALESCE($2, phone), bio = COALESCE($3, bio), avatar_url = COALESCE($4, avatar_url), updated_at = CURRENT_TIMESTAMP WHERE id = $5 RETURNING id, email, full_name, phone, avatar_url, bio, role',
      [fullName || null, phone || null, bio || null, avatarUrl || null, req.user.id]
    );

    const user = result.rows[0];

    res.json({
      success: true,
      message: 'Profile updated successfully',
      data: user,
    });
  } finally {
    client.release();
  }
}
