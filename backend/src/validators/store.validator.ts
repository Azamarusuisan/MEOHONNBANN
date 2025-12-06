import { z } from 'zod';

export const createStoreSchema = z.object({
  customerId: z.string().uuid('有効な顧客IDを入力してください'),
  name: z.string().min(1, '店舗名を入力してください'),
  address: z.string().optional().nullable(),
  phone: z.string().optional().nullable(),
  gbpLocationId: z.string().optional().nullable(),
  isActive: z.boolean().default(true),
});

export const updateStoreSchema = createStoreSchema.partial();

export type CreateStoreInput = z.infer<typeof createStoreSchema>;
export type UpdateStoreInput = z.infer<typeof updateStoreSchema>;
