import { app } from './app';
import { config } from './config/index';
import { logger } from './utils/logger';

const startServer = async () => {
  try {
    app.listen(config.PORT, () => {
      logger.info(`🚀 Server is running on port ${config.PORT}`);
      logger.info(`📍 Health check: http://localhost:${config.PORT}/health`);
      logger.info(`🔧 Environment: ${config.NODE_ENV}`);
      logger.info(`🎭 Mock services: ${config.USE_MOCK_SERVICES}`);
    });
  } catch (error) {
    logger.error('Failed to start server:', error);
    process.exit(1);
  }
};

startServer();
