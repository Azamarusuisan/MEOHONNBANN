import { z } from 'zod';

export const createCustomerSchema = z.object({
  name: z.string().min(1, '顧客名を入力してください'),
  companyName: z.string().optional(),
  email: z.string().email('メールアドレスの形式が正しくありません').optional().nullable(),
  phone: z.string().optional().nullable(),
  notes: z.string().optional().nullable(),
  isActive: z.boolean().default(true),
});

export const updateCustomerSchema = createCustomerSchema.partial();

export type CreateCustomerInput = z.infer<typeof createCustomerSchema>;
export type UpdateCustomerInput = z.infer<typeof updateCustomerSchema>;
