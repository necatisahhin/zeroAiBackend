import { Router } from "express";
import authRouter from './auth/auth';
import profileRouter from './profile/profile';
import restaurantsRouter from './restaurants/restaurants';

const router = Router();

router.get("/", (req, res) => {
  res.status(200).json({ 
    message: "API is working!",
    status: "ok",
    verison: "1.0.0",
    timeStamp: new Date().toISOString() 
});
});

router.use('/auth', authRouter);
router.use('/profile', profileRouter);
router.use('/restaurants', restaurantsRouter);

export default router;