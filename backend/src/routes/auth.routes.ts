import { Router } from 'express';
import { login, me, logout } from '../controllers/auth.controller';
import { authMiddleware } from '../middlewares/auth.middleware';

export const authRouter = Router();

authRouter.post('/login', login);
authRouter.get('/me', authMiddleware, me);
authRouter.post('/logout', authMiddleware, logout);
