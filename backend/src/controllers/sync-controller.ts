import { Response, NextFunction } from 'express';
import { getDatabase } from '../database/connection';
import { AppError, asyncHandler } from '../middleware/error-handler';
import { AuthRequest } from '../middleware/auth';

export class SyncController {
  deltaSync = asyncHandler(async (req: AuthRequest, res: Response, next: NextFunction) => {
    const { lastSyncAt, progressData, quizAttempts } = req.body;
    const db = getDatabase();

    // Start transaction for atomic sync
    const client = await db.connect();
    try {
      await client.query('BEGIN');

      // Sync progress data from client
      if (progressData && progressData.length > 0) {
        for (const progress of progressData) {
          await client.query(
            `INSERT INTO user_progress 
             (id, user_id, lesson_id, status, progress_percentage, time_spent_seconds,
              last_position_seconds, completion_data, started_at, completed_at, created_at, updated_at)
             VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)
             ON CONFLICT (user_id, lesson_id) 
             DO UPDATE SET
               status = EXCLUDED.status,
               progress_percentage = EXCLUDED.progress_percentage,
               time_spent_seconds = EXCLUDED.time_spent_seconds,
               last_position_seconds = EXCLUDED.last_position_seconds,
               completion_data = EXCLUDED.completion_data,
               completed_at = EXCLUDED.completed_at,
               updated_at = EXCLUDED.updated_at,
               last_sync_at = CURRENT_TIMESTAMP`,
            [
              progress.id, req.userId, progress.lessonId, progress.status,
              progress.progressPercentage, progress.timeSpentSeconds,
              progress.lastPositionSeconds, progress.completionData,
              progress.startedAt, progress.completedAt,
              progress.createdAt, progress.updatedAt
            ]
          );
        }
      }

      // Sync quiz attempts from client
      if (quizAttempts && quizAttempts.length > 0) {
        for (const attempt of quizAttempts) {
          await client.query(
            `INSERT INTO quiz_attempts 
             (id, user_id, lesson_id, attempt_number, answers, score, max_possible_score,
              completion_time_seconds, is_completed, created_at, updated_at)
             VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
             ON CONFLICT (id) 
             DO UPDATE SET
               answers = EXCLUDED.answers,
               score = EXCLUDED.score,
               completion_time_seconds = EXCLUDED.completion_time_seconds,
               is_completed = EXCLUDED.is_completed,
               updated_at = EXCLUDED.updated_at,
               last_sync_at = CURRENT_TIMESTAMP`,
            [
              attempt.id, req.userId, attempt.lessonId, attempt.attemptNumber,
              attempt.answers, attempt.score, attempt.maxPossibleScore,
              attempt.completionTimeSeconds, attempt.isCompleted,
              attempt.createdAt, attempt.updatedAt
            ]
          );
        }
      }

      // Get data that changed on server since last sync
      const serverChanges: any = {};

      if (lastSyncAt) {
        // Get updated content (subjects, modules, lessons) since last sync
        const contentChanges = await client.query(
          `SELECT 'subject' as type, id, updated_at FROM subjects WHERE updated_at > $1
           UNION ALL
           SELECT 'module' as type, id, updated_at FROM content_modules WHERE updated_at > $1
           UNION ALL
           SELECT 'lesson' as type, id, updated_at FROM lessons WHERE updated_at > $1
           ORDER BY updated_at`,
          [lastSyncAt]
        );

        serverChanges.contentChanges = contentChanges.rows;

        // Get updated progress from server (in case of conflicts resolved on server side)
        const progressChanges = await client.query(
          `SELECT * FROM user_progress 
           WHERE user_id = $1 AND (updated_at > $2 OR last_sync_at > $2)
           ORDER BY updated_at`,
          [req.userId, lastSyncAt]
        );

        serverChanges.progressChanges = progressChanges.rows;
      }

      // Update user's last_sync_at
      await client.query(
        'UPDATE users SET last_sync_at = CURRENT_TIMESTAMP WHERE id = $1',
        [req.userId]
      );

      // Log sync event
      await client.query(
        `INSERT INTO sync_logs 
         (user_id, sync_type, direction, status, records_processed, records_successful, completed_at)
         VALUES ($1, 'delta', 'bidirectional', 'completed', $2, $2, CURRENT_TIMESTAMP)`,
        [req.userId, (progressData?.length || 0) + (quizAttempts?.length || 0)]
      );

      await client.query('COMMIT');

      res.json({
        success: true,
        message: 'Sync completed successfully',
        data: {
          syncedAt: new Date().toISOString(),
          recordsSynced: {
            progress: progressData?.length || 0,
            quizAttempts: quizAttempts?.length || 0,
          },
          serverChanges,
        },
      });

    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    } finally {
      client.release();
    }
  });

  getSyncStatus = asyncHandler(async (req: AuthRequest, res: Response, next: NextFunction) => {
    const db = getDatabase();

    // Get user's last sync time
    const userResult = await db.query(
      'SELECT last_sync_at FROM users WHERE id = $1',
      [req.userId]
    );

    // Get sync logs for this user
    const syncLogs = await db.query(
      `SELECT sync_type, direction, status, records_processed, records_successful,
              started_at, completed_at, error_message
       FROM sync_logs 
       WHERE user_id = $1
       ORDER BY created_at DESC
       LIMIT 10`,
      [req.userId]
    );

    // Get counts of unsynced data
    const unsyncedProgress = await db.query(
      `SELECT COUNT(*) as count FROM user_progress 
       WHERE user_id = $1 AND (last_sync_at IS NULL OR updated_at > last_sync_at)`,
      [req.userId]
    );

    const unsyncedQuizAttempts = await db.query(
      `SELECT COUNT(*) as count FROM quiz_attempts 
       WHERE user_id = $1 AND (last_sync_at IS NULL OR updated_at > last_sync_at)`,
      [req.userId]
    );

    res.json({
      success: true,
      data: {
        lastSyncAt: userResult.rows[0]?.last_sync_at,
        pendingSync: {
          progress: parseInt(unsyncedProgress.rows[0].count),
          quizAttempts: parseInt(unsyncedQuizAttempts.rows[0].count),
        },
        recentSyncs: syncLogs.rows.map(log => ({
          syncType: log.sync_type,
          direction: log.direction,
          status: log.status,
          recordsProcessed: log.records_processed,
          recordsSuccessful: log.records_successful,
          startedAt: log.started_at,
          completedAt: log.completed_at,
          errorMessage: log.error_message,
        })),
      },
    });
  });
}