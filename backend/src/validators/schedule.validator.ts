import { z } from 'zod';

export const scheduleStatusEnum = z.enum(['PENDING', 'QUEUED', 'PROCESSING', 'SUCCESS', 'FAILED', 'CANCELLED']);

export const createScheduleSchema = z.object({
  postId: z.string().uuid('有効な投稿IDを入力してください'),
  storeId: z.string().uuid('有効な店舗IDを入力してください'),
  scheduledAt: z.string().datetime('有効な日時を入力してください'),
  status: scheduleStatusEnum.default('PENDING'),
});

export const updateScheduleSchema = z.object({
  scheduledAt: z.string().datetime('有効な日時を入力してください').optional(),
  status: scheduleStatusEnum.optional(),
});

export type CreateScheduleInput = z.infer<typeof createScheduleSchema>;
export type UpdateScheduleInput = z.infer<typeof updateScheduleSchema>;
