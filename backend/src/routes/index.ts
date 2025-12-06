import { Router } from 'express';
import { authRouter } from './auth.routes.js';
import { customersRouter } from './customers.routes.js';
import { storesRouter } from './stores.routes.js';
import { postsRouter } from './posts.routes.js';
import { schedulesRouter } from './schedules.routes.js';
import { metricsRouter } from './metrics.routes.js';
import { settingsRouter } from './settings.routes.js';

export const router = Router();

router.use('/auth', authRouter);
router.use('/customers', customersRouter);
router.use('/stores', storesRouter);
router.use('/posts', postsRouter);
router.use('/schedules', schedulesRouter);
router.use('/metrics', metricsRouter);
router.use('/settings', settingsRouter);
