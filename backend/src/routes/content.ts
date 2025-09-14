import { Router } from 'express';
import { ContentController } from '../controllers/content-controller';
import { authMiddleware } from '../middleware/auth';

const router = Router();
const contentController = new ContentController();

// Apply auth middleware to all content routes
router.use(authMiddleware);

// GET /api/v1/content/subjects
router.get('/subjects', contentController.getSubjects);

// GET /api/v1/content/modules/:subjectId
router.get('/modules/:subjectId', contentController.getModules);

// GET /api/v1/content/lessons/:moduleId
router.get('/lessons/:moduleId', contentController.getLessons);

// GET /api/v1/content/lesson/:lessonId
router.get('/lesson/:lessonId', contentController.getLesson);

export default router;