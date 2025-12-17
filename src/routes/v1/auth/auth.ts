import { Router } from 'express';
import { register, registerValidation } from '@/controllers/v1/auth/register';
import { login, loginValidation } from '@/controllers/v1/auth/login';
import { logout } from '@/controllers/v1/auth/logout';
import { refresh , refreshTokenValidation } from '@/controllers/v1/auth/refresh';
import { logoutAll } from '@/controllers/v1/auth/logoutAll';


const router = Router();

router.post('/register', registerValidation, register);
router.post('/login', loginValidation, login);
router.post('/logout', logout);
router.post('/refresh', refreshTokenValidation,refresh);
router.post('/logoutAll', loginValidation,logoutAll);

export default router;