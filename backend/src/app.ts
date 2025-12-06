import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import { requestLogger } from './middlewares/logger.middleware';
import { errorMiddleware } from './middlewares/error.middleware';
import { router } from './routes/index';

const app = express();

// Security middlewares
app.use(helmet());
app.use(cors());

// Body parsing
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Request logging
app.use(requestLogger);

// Health check (no auth required)
app.get('/health', (_req, res) => {
  res.status(200).json({
    success: true,
    data: {
      status: 'healthy',
      timestamp: new Date().toISOString(),
    },
  });
});

// API routes
app.use('/api', router);

// Error handling
app.use(errorMiddleware);

export { app };
