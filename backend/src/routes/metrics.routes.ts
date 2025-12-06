import { Router } from 'express';
import {
  getMetrics,
  getMetric,
  createMetric,
  updateMetric,
  deleteMetric
} from '../controllers/metrics.controller.js';
import { authMiddleware } from '../middlewares/auth.middleware.js';

export const metricsRouter = Router();

metricsRouter.use(authMiddleware);

metricsRouter.get('/', getMetrics);
metricsRouter.get('/:id', getMetric);
metricsRouter.post('/', createMetric);
metricsRouter.put('/:id', updateMetric);
metricsRouter.delete('/:id', deleteMetric);
