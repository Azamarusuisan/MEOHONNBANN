import { Router } from 'express';
import { authRouter } from './auth.routes';
import { customersRouter } from './customers.routes';
import { storesRouter } from './stores.routes';
import { postsRouter } from './posts.routes';
import { schedulesRouter } from './schedules.routes';
import { metricsRouter } from './metrics.routes';
import { settingsRouter } from './settings.routes';

export const router = Router();

router.use('/auth', authRouter);
router.use('/customers', customersRouter);
router.use('/stores', storesRouter);
router.use('/posts', postsRouter);
router.use('/schedules', schedulesRouter);
router.use('/metrics', metricsRouter);
router.use('/settings', settingsRouter);
