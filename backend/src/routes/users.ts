import { Router } from 'express';
import { UserController } from '../controllers/user-controller';
import { authMiddleware } from '../middleware/auth';

const router = Router();
const userController = new UserController();

// Apply auth middleware to all user routes
router.use(authMiddleware);

// GET /api/v1/users/profile
router.get('/profile', userController.getProfile);

// PUT /api/v1/users/profile
router.put('/profile', userController.updateProfile);

export default router;