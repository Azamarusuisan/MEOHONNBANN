import { z } from 'zod';

export const createMetricSchema = z.object({
  storeId: z.string().uuid('有効な店舗IDを入力してください'),
  date: z.string().datetime('有効な日付を入力してください'),
  viewCount: z.number().int().min(0).default(0),
  searchCount: z.number().int().min(0).default(0),
  phoneClicks: z.number().int().min(0).default(0),
  directionClicks: z.number().int().min(0).default(0),
  websiteClicks: z.number().int().min(0).default(0),
});

export const updateMetricSchema = createMetricSchema.partial().omit({ storeId: true, date: true });

export type CreateMetricInput = z.infer<typeof createMetricSchema>;
export type UpdateMetricInput = z.infer<typeof updateMetricSchema>;
