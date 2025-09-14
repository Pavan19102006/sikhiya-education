import { Router } from 'express';
import { SyncController } from '../controllers/sync-controller';
import { authMiddleware } from '../middleware/auth';

const router = Router();
const syncController = new SyncController();

// Apply auth middleware to all sync routes
router.use(authMiddleware);

// POST /api/v1/sync/delta
router.post('/delta', syncController.deltaSync);

// GET /api/v1/sync/status
router.get('/status', syncController.getSyncStatus);

export default router;