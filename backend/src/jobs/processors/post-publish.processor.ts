import { Job } from 'bull';
import { PostPublishJobData, lineNotifyQueue } from '../queues.js';
import { prisma } from '../../repositories/prisma.js';
import { gbpService } from '../../integrations/index.js';
import { logger } from '../../utils/logger.js';

export async function processPostPublish(job: Job<PostPublishJobData>) {
  const { scheduleId, postId, storeId } = job.data;

  logger.info('Processing post publish job', { scheduleId, postId, storeId });

  try {
    // Update status to PROCESSING
    await prisma.postSchedule.update({
      where: { id: scheduleId },
      data: { status: 'PROCESSING' },
    });

    // Get post and store data
    const [post, store] = await Promise.all([
      prisma.post.findUnique({ where: { id: postId } }),
      prisma.store.findUnique({ where: { id: storeId } }),
    ]);

    if (!post || !store) {
      throw new Error('Post or store not found');
    }

    // Call GBP API (mock or real)
    const result = await gbpService.createPost(store.gbpLocationId || '', {
      content: post.content,
      postType: post.postType,
      imageUrl: post.imageUrl || undefined,
      ctaType: post.ctaType || undefined,
      ctaUrl: post.ctaUrl || undefined,
      eventStart: post.eventStart || undefined,
      eventEnd: post.eventEnd || undefined,
    });

    if (result.success) {
      // Update schedule as SUCCESS
      await prisma.postSchedule.update({
        where: { id: scheduleId },
        data: {
          status: 'SUCCESS',
          executedAt: new Date(),
          gbpPostId: result.postId,
        },
      });

      // Queue LINE notification
      await lineNotifyQueue.add({
        lineAccountId: 'default',
        templateType: 'POST_SUCCESS',
        variables: {
          storeName: store.name,
          postTitle: post.title || post.content.substring(0, 30),
        },
      });

      logger.info('Post published successfully', { scheduleId, gbpPostId: result.postId });
    } else {
      throw new Error(result.error || 'Unknown error from GBP API');
    }
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    logger.error('Post publish failed', { scheduleId, error: errorMessage });

    // Update retry count
    const schedule = await prisma.postSchedule.findUnique({ where: { id: scheduleId } });
    const retryCount = (schedule?.retryCount || 0) + 1;

    if (retryCount >= 3) {
      // Mark as FAILED after 3 retries
      await prisma.postSchedule.update({
        where: { id: scheduleId },
        data: {
          status: 'FAILED',
          errorMessage,
          retryCount,
        },
      });

      // Get store for notification
      const store = await prisma.store.findUnique({ where: { id: storeId } });
      const post = await prisma.post.findUnique({ where: { id: postId } });

      // Queue failure notification
      await lineNotifyQueue.add({
        lineAccountId: 'default',
        templateType: 'POST_FAILURE',
        variables: {
          storeName: store?.name || 'Unknown',
          postTitle: post?.title || 'Unknown',
          errorMessage,
        },
      });
    } else {
      await prisma.postSchedule.update({
        where: { id: scheduleId },
        data: {
          errorMessage,
          retryCount,
        },
      });
    }

    throw error;
  }
}
