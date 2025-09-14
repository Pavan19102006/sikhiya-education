import { Response, NextFunction } from 'express';
import { getDatabase } from '../database/connection';
import { AppError, asyncHandler } from '../middleware/error-handler';
import { AuthRequest } from '../middleware/auth';

export class ProgressController {
  getUserProgress = asyncHandler(async (req: AuthRequest, res: Response, next: NextFunction) => {
    const db = getDatabase();

    const result = await db.query(
      `SELECT p.id, p.lesson_id, p.status, p.progress_percentage, p.time_spent_seconds,
              p.best_score, p.started_at, p.completed_at,
              l.title, l.content_type, l.module_id
       FROM user_progress p
       JOIN lessons l ON p.lesson_id = l.id
       WHERE p.user_id = $1
       ORDER BY p.updated_at DESC`,
      [req.userId]
    );

    res.json({
      success: true,
      data: {
        progress: result.rows.map(p => ({
          id: p.id,
          lessonId: p.lesson_id,
          status: p.status,
          progressPercentage: p.progress_percentage,
          timeSpentSeconds: p.time_spent_seconds,
          bestScore: p.best_score,
          startedAt: p.started_at,
          completedAt: p.completed_at,
          lesson: {
            title: p.title,
            contentType: p.content_type,
            moduleId: p.module_id,
          },
        })),
      },
    });
  });

  updateProgress = asyncHandler(async (req: AuthRequest, res: Response, next: NextFunction) => {
    const {
      lessonId,
      status,
      progressPercentage,
      timeSpentSeconds,
      lastPositionSeconds,
      completionData,
    } = req.body;
    
    const db = getDatabase();

    // Check if progress record exists
    const existingProgress = await db.query(
      'SELECT id FROM user_progress WHERE user_id = $1 AND lesson_id = $2',
      [req.userId, lessonId]
    );

    let result;
    if (existingProgress.rows.length > 0) {
      // Update existing progress
      result = await db.query(
        `UPDATE user_progress 
         SET status = COALESCE($3, status),
             progress_percentage = COALESCE($4, progress_percentage),
             time_spent_seconds = COALESCE($5, time_spent_seconds),
             last_position_seconds = COALESCE($6, last_position_seconds),
             completion_data = COALESCE($7, completion_data),
             completed_at = CASE WHEN $3 = 'completed' THEN CURRENT_TIMESTAMP ELSE completed_at END,
             updated_at = CURRENT_TIMESTAMP
         WHERE user_id = $1 AND lesson_id = $2
         RETURNING *`,
        [req.userId, lessonId, status, progressPercentage, timeSpentSeconds, lastPositionSeconds, completionData]
      );
    } else {
      // Create new progress record
      result = await db.query(
        `INSERT INTO user_progress 
         (user_id, lesson_id, status, progress_percentage, time_spent_seconds, 
          last_position_seconds, completion_data, started_at, completed_at)
         VALUES ($1, $2, $3, $4, $5, $6, $7, CURRENT_TIMESTAMP, 
                 CASE WHEN $3 = 'completed' THEN CURRENT_TIMESTAMP ELSE NULL END)
         RETURNING *`,
        [req.userId, lessonId, status, progressPercentage, timeSpentSeconds, lastPositionSeconds, completionData]
      );
    }

    const progress = result.rows[0];

    res.json({
      success: true,
      message: 'Progress updated successfully',
      data: {
        progress: {
          id: progress.id,
          lessonId: progress.lesson_id,
          status: progress.status,
          progressPercentage: progress.progress_percentage,
          timeSpentSeconds: progress.time_spent_seconds,
          lastPositionSeconds: progress.last_position_seconds,
          completionData: progress.completion_data,
          startedAt: progress.started_at,
          completedAt: progress.completed_at,
        },
      },
    });
  });

  getLessonProgress = asyncHandler(async (req: AuthRequest, res: Response, next: NextFunction) => {
    const { lessonId } = req.params;
    const db = getDatabase();

    const result = await db.query(
      `SELECT * FROM user_progress WHERE user_id = $1 AND lesson_id = $2`,
      [req.userId, lessonId]
    );

    if (result.rows.length === 0) {
      res.json({
        success: true,
        data: {
          progress: null,
        },
      });
      return;
    }

    const progress = result.rows[0];

    res.json({
      success: true,
      data: {
        progress: {
          id: progress.id,
          lessonId: progress.lesson_id,
          status: progress.status,
          progressPercentage: progress.progress_percentage,
          timeSpentSeconds: progress.time_spent_seconds,
          lastPositionSeconds: progress.last_position_seconds,
          completionData: progress.completion_data,
          startedAt: progress.started_at,
          completedAt: progress.completed_at,
        },
      },
    });
  });
}