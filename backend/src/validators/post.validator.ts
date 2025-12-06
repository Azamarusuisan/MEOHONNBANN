import { z } from 'zod';

export const postTypeEnum = z.enum(['NEWS', 'EVENT', 'OFFER', 'PRODUCT']);

export const createPostSchema = z.object({
  title: z.string().optional().nullable(),
  content: z.string().min(1, '投稿内容を入力してください'),
  postType: postTypeEnum.default('NEWS'),
  imageUrl: z.string().url('有効なURLを入力してください').optional().nullable(),
  ctaType: z.string().optional().nullable(),
  ctaUrl: z.string().url('有効なURLを入力してください').optional().nullable(),
  eventStart: z.string().datetime().optional().nullable(),
  eventEnd: z.string().datetime().optional().nullable(),
  isActive: z.boolean().default(true),
});

export const updatePostSchema = createPostSchema.partial();

export type CreatePostInput = z.infer<typeof createPostSchema>;
export type UpdatePostInput = z.infer<typeof updatePostSchema>;
