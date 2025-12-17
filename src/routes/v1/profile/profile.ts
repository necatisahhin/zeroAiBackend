import { Router } from 'express';
import { getProfile, updateProfile, updateProfileValidation } from '@/controllers/v1/profile/profile';
import { authMiddleware } from '@/middleware/auth';

const router = Router();

router.get('/getProfile', authMiddleware, getProfile);
router.put('/updateProfile', authMiddleware, updateProfileValidation, updateProfile);

export default router;
