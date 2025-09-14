import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { getDatabase } from '../database/connection';
import { AppError, asyncHandler } from './error-handler';

export interface AuthRequest extends Request {
  userId?: string;
  user?: any;
}

export const authMiddleware = asyncHandler(
  async (req: AuthRequest, res: Response, next: NextFunction) => {
    const token = req.header('Authorization')?.replace('Bearer ', '');

    if (!token) {
      return next(new AppError('Access token is required', 401));
    }

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { userId: string };
      
      // Optionally verify user still exists and is active
      const db = getDatabase();
      const result = await db.query(
        'SELECT id, username, email, full_name, role, is_active FROM users WHERE id = $1',
        [decoded.userId]
      );

      if (result.rows.length === 0 || !result.rows[0].is_active) {
        return next(new AppError('Invalid or expired token', 401));
      }

      req.userId = decoded.userId;
      req.user = result.rows[0];
      next();
    } catch (error) {
      return next(new AppError('Invalid or expired token', 401));
    }
  }
);