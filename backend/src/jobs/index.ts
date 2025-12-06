import { postPublishQueue, metricsFetchQueue, lineNotifyQueue } from './queues.js';
import { processPostPublish } from './processors/post-publish.processor.js';
import { processMetricsFetch } from './processors/metrics-fetch.processor.js';
import { processLineNotify } from './processors/line-notify.processor.js';
import { logger } from '../utils/logger.js';

export function initializeJobProcessors() {
  logger.info('Initializing job processors...');

  // Post publish processor
  postPublishQueue.process(async (job) => {
    return processPostPublish(job);
  });

  // Metrics fetch processor
  metricsFetchQueue.process(async (job) => {
    return processMetricsFetch(job);
  });

  // LINE notify processor
  lineNotifyQueue.process(async (job) => {
    return processLineNotify(job);
  });

  // Queue event listeners
  postPublishQueue.on('completed', (job) => {
    logger.info('Post publish job completed', { jobId: job.id });
  });

  postPublishQueue.on('failed', (job, error) => {
    logger.error('Post publish job failed', { jobId: job.id, error: error.message });
  });

  metricsFetchQueue.on('completed', (job) => {
    logger.info('Metrics fetch job completed', { jobId: job.id });
  });

  lineNotifyQueue.on('completed', (job) => {
    logger.info('LINE notify job completed', { jobId: job.id });
  });

  logger.info('Job processors initialized');
}
