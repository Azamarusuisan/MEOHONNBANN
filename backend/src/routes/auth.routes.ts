import { Router } from 'express';
import { login, me, logout } from '../controllers/auth.controller.js';
import { authMiddleware } from '../middlewares/auth.middleware.js';

export const authRouter = Router();

authRouter.post('/login', login);
authRouter.get('/me', authMiddleware, me);
authRouter.post('/logout', authMiddleware, logout);
