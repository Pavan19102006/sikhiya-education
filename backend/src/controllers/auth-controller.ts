import { Request, Response, NextFunction } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { v4 as uuidv4 } from 'uuid';
import { getDatabase } from '../database/connection';
import { AppError, asyncHandler } from '../middleware/error-handler';
import { logger } from '../utils/logger';

interface RegisterRequest {
  username: string;
  email: string;
  password: string;
  fullName: string;
  schoolId?: string;
  gradeLevel?: number;
}

interface LoginRequest {
  username: string;
  password: string;
}

export class AuthController {
  register = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const { username, email, password, fullName, schoolId, gradeLevel }: RegisterRequest = req.body;
    const db = getDatabase();

    // Check if user already exists
    const existingUser = await db.query(
      'SELECT id FROM users WHERE username = $1 OR email = $2',
      [username, email]
    );

    if (existingUser.rows.length > 0) {
      return next(new AppError('User with this username or email already exists', 400));
    }

    // Hash password
    const saltRounds = 12;
    const passwordHash = await bcrypt.hash(password, saltRounds);

    // Create user
    const userId = uuidv4();
    const result = await db.query(
      `INSERT INTO users (id, username, email, password_hash, full_name, school_id, grade_level)
       VALUES ($1, $2, $3, $4, $5, $6, $7)
       RETURNING id, username, email, full_name, role, school_id, grade_level, created_at`,
      [userId, username, email, passwordHash, fullName, schoolId || null, gradeLevel || null]
    );

    const user = result.rows[0];

    // Generate tokens
    const tokens = this.generateTokens(user.id);

    logger.info(`User registered successfully: ${username}`);

    res.status(201).json({
      success: true,
      message: 'User registered successfully',
      data: {
        user: {
          id: user.id,
          username: user.username,
          email: user.email,
          fullName: user.full_name,
          role: user.role,
          schoolId: user.school_id,
          gradeLevel: user.grade_level,
          createdAt: user.created_at,
        },
        tokens,
      },
    });
  });

  login = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const { username, password }: LoginRequest = req.body;
    const db = getDatabase();

    // Find user
    const result = await db.query(
      'SELECT id, username, email, password_hash, full_name, role, school_id, grade_level, is_active FROM users WHERE username = $1',
      [username]
    );

    if (result.rows.length === 0) {
      return next(new AppError('Invalid credentials', 401));
    }

    const user = result.rows[0];

    if (!user.is_active) {
      return next(new AppError('Account is deactivated', 401));
    }

    // Check password
    const isPasswordValid = await bcrypt.compare(password, user.password_hash);
    if (!isPasswordValid) {
      return next(new AppError('Invalid credentials', 401));
    }

    // Update last login
    await db.query(
      'UPDATE users SET last_login = CURRENT_TIMESTAMP WHERE id = $1',
      [user.id]
    );

    // Generate tokens
    const tokens = this.generateTokens(user.id);

    logger.info(`User logged in: ${username}`);

    res.json({
      success: true,
      message: 'Login successful',
      data: {
        user: {
          id: user.id,
          username: user.username,
          email: user.email,
          fullName: user.full_name,
          role: user.role,
          schoolId: user.school_id,
          gradeLevel: user.grade_level,
        },
        tokens,
      },
    });
  });

  refreshToken = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const { refreshToken } = req.body;

    if (!refreshToken) {
      return next(new AppError('Refresh token is required', 400));
    }

    try {
      const decoded = jwt.verify(refreshToken, process.env.JWT_SECRET!) as { userId: string };
      const tokens = this.generateTokens(decoded.userId);

      res.json({
        success: true,
        data: { tokens },
      });
    } catch (error) {
      return next(new AppError('Invalid refresh token', 401));
    }
  });

  logout = asyncHandler(async (req: Request, res: Response) => {
    // In a more complex setup, you might want to blacklist the token
    // For now, just return success
    res.json({
      success: true,
      message: 'Logout successful',
    });
  });

  private generateTokens(userId: string) {
    const jwtSecret = process.env.JWT_SECRET!;

    const accessToken = jwt.sign({ userId }, jwtSecret, { expiresIn: '1h' });
    const refreshToken = jwt.sign({ userId }, jwtSecret, { expiresIn: '7d' });

    return {
      access: accessToken,
      refresh: refreshToken,
      expiresIn: '1h',
    };
  }
}