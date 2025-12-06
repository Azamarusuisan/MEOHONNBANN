import { Job } from 'bull';
import { MetricsFetchJobData } from '../queues.js';
import { prisma } from '../../repositories/prisma.js';
import { gbpService } from '../../integrations/index.js';
import { logger } from '../../utils/logger.js';

export async function processMetricsFetch(job: Job<MetricsFetchJobData>) {
  const { storeId, date } = job.data;
  const fetchDate = new Date(date);

  logger.info('Processing metrics fetch job', { storeId, date });

  try {
    const store = await prisma.store.findUnique({ where: { id: storeId } });

    if (!store || !store.gbpLocationId) {
      logger.warn('Store not found or no GBP location ID', { storeId });
      return;
    }

    // Fetch metrics from GBP API (mock or real)
    const metrics = await gbpService.getMetrics(store.gbpLocationId, fetchDate);

    // Upsert metrics record
    await prisma.gbpDailyMetric.upsert({
      where: {
        storeId_date: {
          storeId,
          date: fetchDate,
        },
      },
      create: {
        storeId,
        date: fetchDate,
        viewCount: metrics.viewCount,
        searchCount: metrics.searchCount,
        phoneClicks: metrics.phoneClicks,
        directionClicks: metrics.directionClicks,
        websiteClicks: metrics.websiteClicks,
      },
      update: {
        viewCount: metrics.viewCount,
        searchCount: metrics.searchCount,
        phoneClicks: metrics.phoneClicks,
        directionClicks: metrics.directionClicks,
        websiteClicks: metrics.websiteClicks,
      },
    });

    logger.info('Metrics fetched successfully', { storeId, date, metrics });
  } catch (error) {
    logger.error('Metrics fetch failed', {
      storeId,
      date,
      error: error instanceof Error ? error.message : 'Unknown error',
    });
    throw error;
  }
}
