import { Router } from 'express';
import {
  getSettings,
  getSetting,
  createSetting,
  updateSetting,
  deleteSetting
} from '../controllers/settings.controller';
import { authMiddleware } from '../middlewares/auth.middleware';

export const settingsRouter = Router();

settingsRouter.use(authMiddleware);

settingsRouter.get('/', getSettings);
settingsRouter.get('/:id', getSetting);
settingsRouter.post('/', createSetting);
settingsRouter.put('/:id', updateSetting);
settingsRouter.delete('/:id', deleteSetting);
