import { ILineNotificationService, LineMessage, LineNotifyResult } from './line.interface';
import { logger } from '../../utils/logger';

export class LineMockService implements ILineNotificationService {
  async sendNotification(
    channelAccessToken: string,
    recipientId: string,
    message: LineMessage
  ): Promise<LineNotifyResult> {
    logger.info('[MOCK] LINE sendNotification called', {
      recipientId,
      templateType: message.templateType,
      message: message.message,
    });

    await new Promise((resolve) => setTimeout(resolve, 300));

    return {
      success: true,
      messageId: `mock-msg-${Date.now()}`,
    };
  }

  async broadcastNotification(
    channelAccessToken: string,
    message: LineMessage
  ): Promise<LineNotifyResult> {
    logger.info('[MOCK] LINE broadcastNotification called', {
      templateType: message.templateType,
      message: message.message,
    });

    await new Promise((resolve) => setTimeout(resolve, 500));

    return {
      success: true,
      messageId: `mock-broadcast-${Date.now()}`,
    };
  }
}
