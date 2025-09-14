import { Response, NextFunction } from 'express';
import { getDatabase } from '../database/connection';
import { AppError, asyncHandler } from '../middleware/error-handler';
import { AuthRequest } from '../middleware/auth';

export class UserController {
  getProfile = asyncHandler(async (req: AuthRequest, res: Response, next: NextFunction) => {
    const db = getDatabase();
    
    const result = await db.query(
      'SELECT id, username, email, full_name, role, school_id, grade_level, created_at FROM users WHERE id = $1',
      [req.userId]
    );

    if (result.rows.length === 0) {
      return next(new AppError('User not found', 404));
    }

    const user = result.rows[0];
    
    res.json({
      success: true,
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
      },
    });
  });

  updateProfile = asyncHandler(async (req: AuthRequest, res: Response, next: NextFunction) => {
    const { fullName, gradeLevel } = req.body;
    const db = getDatabase();

    const result = await db.query(
      `UPDATE users 
       SET full_name = COALESCE($1, full_name), 
           grade_level = COALESCE($2, grade_level),
           updated_at = CURRENT_TIMESTAMP
       WHERE id = $3
       RETURNING id, username, email, full_name, role, school_id, grade_level`,
      [fullName, gradeLevel, req.userId]
    );

    if (result.rows.length === 0) {
      return next(new AppError('User not found', 404));
    }

    const user = result.rows[0];

    res.json({
      success: true,
      message: 'Profile updated successfully',
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
      },
    });
  });
}