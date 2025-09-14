import { Router } from 'express';
import { ProgressController } from '../controllers/progress-controller';
import { authMiddleware } from '../middleware/auth';

const router = Router();
const progressController = new ProgressController();

// Apply auth middleware to all progress routes
router.use(authMiddleware);

// GET /api/v1/progress
router.get('/', progressController.getUserProgress);

// POST /api/v1/progress
router.post('/', progressController.updateProgress);

// GET /api/v1/progress/lesson/:lessonId
router.get('/lesson/:lessonId', progressController.getLessonProgress);

export default router;