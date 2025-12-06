import { Router } from 'express';
import {
  getStores,
  getStore,
  createStore,
  updateStore,
  deleteStore
} from '../controllers/stores.controller.js';
import { authMiddleware } from '../middlewares/auth.middleware.js';

export const storesRouter = Router();

storesRouter.use(authMiddleware);

storesRouter.get('/', getStores);
storesRouter.get('/:id', getStore);
storesRouter.post('/', createStore);
storesRouter.put('/:id', updateStore);
storesRouter.delete('/:id', deleteStore);
