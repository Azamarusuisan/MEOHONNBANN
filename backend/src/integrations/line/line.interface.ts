export interface LineMessage {
  templateType: 'POST_SUCCESS' | 'POST_FAILURE';
  message: string;
}

export interface LineNotifyResult {
  success: boolean;
  messageId?: string;
  error?: string;
}

export interface ILineNotificationService {
  sendNotification(
    channelAccessToken: string,
    recipientId: string,
    message: LineMessage
  ): Promise<LineNotifyResult>;

  broadcastNotification(
    channelAccessToken: string,
    message: LineMessage
  ): Promise<LineNotifyResult>;
}
