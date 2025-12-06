import { Router } from 'express';
import {
  getSchedules,
  getSchedule,
  createSchedule,
  updateSchedule,
  deleteSchedule
} from '../controllers/schedules.controller';
import { authMiddleware } from '../middlewares/auth.middleware';

export const schedulesRouter = Router();

schedulesRouter.use(authMiddleware);

schedulesRouter.get('/', getSchedules);
schedulesRouter.get('/:id', getSchedule);
schedulesRouter.post('/', createSchedule);
schedulesRouter.put('/:id', updateSchedule);
schedulesRouter.delete('/:id', deleteSchedule);
