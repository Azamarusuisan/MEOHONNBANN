import { Job } from 'bull';
import { LineNotifyJobData } from '../queues';
import { prisma } from '../../repositories/prisma';
import { lineService } from '../../integrations/index';
import { logger } from '../../utils/logger';

export async function processLineNotify(job: Job<LineNotifyJobData>) {
  const { lineAccountId, templateType, recipientId, variables } = job.data;

  logger.info('Processing LINE notify job', { templateType, variables });

  try {
    // Get LINE account settings
    const lineAccount = await prisma.lineAccount.findFirst({
      where: { isActive: true },
    });

    if (!lineAccount || !lineAccount.accessToken) {
      logger.warn('No active LINE account found');
      return;
    }

    // Build message based on template
    let message: string;
    if (templateType === 'POST_SUCCESS') {
      message = `✅ 投稿が完了しました\n店舗: ${variables.storeName}\n投稿: ${variables.postTitle}`;
    } else {
      message = `❌ 投稿が失敗しました\n店舗: ${variables.storeName}\n投稿: ${variables.postTitle}\nエラー: ${variables.errorMessage}`;
    }

    // Send notification
    const result = recipientId
      ? await lineService.sendNotification(lineAccount.accessToken, recipientId, {
          templateType,
          message,
        })
      : await lineService.broadcastNotification(lineAccount.accessToken, {
          templateType,
          message,
        });

    // Log notification
    await prisma.lineNotification.create({
      data: {
        lineAccountId: lineAccount.id,
        templateType,
        recipientId,
        message,
        status: result.success ? 'SENT' : 'FAILED',
        sentAt: result.success ? new Date() : null,
        errorMessage: result.error,
      },
    });

    logger.info('LINE notification sent', { templateType, success: result.success });
  } catch (error) {
    logger.error('LINE notification failed', {
      error: error instanceof Error ? error.message : 'Unknown error',
    });
    throw error;
  }
}
