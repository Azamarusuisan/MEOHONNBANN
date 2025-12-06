import { z } from 'zod';

export const createSettingSchema = z.object({
  key: z.string().min(1, '設定キーを入力してください'),
  value: z.string().min(1, '設定値を入力してください'),
});

export const updateSettingSchema = z.object({
  value: z.string().min(1, '設定値を入力してください'),
});

export type CreateSettingInput = z.infer<typeof createSettingSchema>;
export type UpdateSettingInput = z.infer<typeof updateSettingSchema>;
