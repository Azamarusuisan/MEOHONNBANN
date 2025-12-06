import { Request, Response } from 'express';
import { createPostSchema, updatePostSchema } from '../validators/post.validator.js';
import { postsService } from '../services/posts.service.js';
import { sendSuccess, sendError } from '../utils/response.js';

export async function getPosts(req: Request, res: Response) {
  try {
    const { page = '1', limit = '10', storeId, status } = req.query;
    const posts = await postsService.getPosts({
      page: parseInt(page as string),
      limit: parseInt(limit as string),
      storeId: storeId as string,
      status: status as string,
    });
    sendSuccess(res, posts);
  } catch (error) {
    sendError(res, 'FETCH_ERROR', '投稿一覧の取得に失敗しました', 500);
  }
}

export async function getPost(req: Request, res: Response) {
  try {
    const { id } = req.params;
    const post = await postsService.getPost(id);

    if (!post) {
      sendError(res, 'NOT_FOUND', '投稿が見つかりません', 404);
      return;
    }

    sendSuccess(res, post);
  } catch (error) {
    sendError(res, 'FETCH_ERROR', '投稿情報の取得に失敗しました', 500);
  }
}

export async function createPost(req: Request, res: Response) {
  try {
    const result = createPostSchema.safeParse(req.body);
    if (!result.success) {
      sendError(res, 'VALIDATION_ERROR', '入力内容に誤りがあります', 400,
        result.error.errors.map(e => ({ field: e.path.join('.'), message: e.message })));
      return;
    }

    const post = await postsService.createPost(result.data);
    sendSuccess(res, post, 201);
  } catch (error) {
    sendError(res, 'CREATE_ERROR', '投稿の作成に失敗しました', 500);
  }
}

export async function updatePost(req: Request, res: Response) {
  try {
    const { id } = req.params;
    const result = updatePostSchema.safeParse(req.body);

    if (!result.success) {
      sendError(res, 'VALIDATION_ERROR', '入力内容に誤りがあります', 400,
        result.error.errors.map(e => ({ field: e.path.join('.'), message: e.message })));
      return;
    }

    const post = await postsService.updatePost(id, result.data);

    if (!post) {
      sendError(res, 'NOT_FOUND', '投稿が見つかりません', 404);
      return;
    }

    sendSuccess(res, post);
  } catch (error) {
    sendError(res, 'UPDATE_ERROR', '投稿の更新に失敗しました', 500);
  }
}

export async function deletePost(req: Request, res: Response) {
  try {
    const { id } = req.params;
    const success = await postsService.deletePost(id);

    if (!success) {
      sendError(res, 'NOT_FOUND', '投稿が見つかりません', 404);
      return;
    }

    sendSuccess(res, { message: '投稿を削除しました' });
  } catch (error) {
    sendError(res, 'DELETE_ERROR', '投稿の削除に失敗しました', 500);
  }
}
