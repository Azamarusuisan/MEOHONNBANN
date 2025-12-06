import { Request, Response } from 'express';
import { createStoreSchema, updateStoreSchema } from '../validators/store.validator';
import { storesService } from '../services/stores.service';
import { sendSuccess, sendError } from '../utils/response';

export async function getStores(req: Request, res: Response) {
  try {
    const { page = '1', limit = '10', search } = req.query;
    const stores = await storesService.getStores({
      page: parseInt(page as string),
      limit: parseInt(limit as string),
      search: search as string,
    });
    sendSuccess(res, stores);
  } catch (error) {
    sendError(res, 'FETCH_ERROR', '店舗一覧の取得に失敗しました', 500);
  }
}

export async function getStore(req: Request, res: Response) {
  try {
    const { id } = req.params;
    const store = await storesService.getStore(id);

    if (!store) {
      sendError(res, 'NOT_FOUND', '店舗が見つかりません', 404);
      return;
    }

    sendSuccess(res, store);
  } catch (error) {
    sendError(res, 'FETCH_ERROR', '店舗情報の取得に失敗しました', 500);
  }
}

export async function createStore(req: Request, res: Response) {
  try {
    const result = createStoreSchema.safeParse(req.body);
    if (!result.success) {
      sendError(res, 'VALIDATION_ERROR', '入力内容に誤りがあります', 400,
        result.error.errors.map(e => ({ field: e.path.join('.'), message: e.message })));
      return;
    }

    const store = await storesService.createStore(result.data);
    sendSuccess(res, store, 201);
  } catch (error) {
    sendError(res, 'CREATE_ERROR', '店舗の作成に失敗しました', 500);
  }
}

export async function updateStore(req: Request, res: Response) {
  try {
    const { id } = req.params;
    const result = updateStoreSchema.safeParse(req.body);

    if (!result.success) {
      sendError(res, 'VALIDATION_ERROR', '入力内容に誤りがあります', 400,
        result.error.errors.map(e => ({ field: e.path.join('.'), message: e.message })));
      return;
    }

    const store = await storesService.updateStore(id, result.data);

    if (!store) {
      sendError(res, 'NOT_FOUND', '店舗が見つかりません', 404);
      return;
    }

    sendSuccess(res, store);
  } catch (error) {
    sendError(res, 'UPDATE_ERROR', '店舗の更新に失敗しました', 500);
  }
}

export async function deleteStore(req: Request, res: Response) {
  try {
    const { id } = req.params;
    const success = await storesService.deleteStore(id);

    if (!success) {
      sendError(res, 'NOT_FOUND', '店舗が見つかりません', 404);
      return;
    }

    sendSuccess(res, { message: '店舗を削除しました' });
  } catch (error) {
    sendError(res, 'DELETE_ERROR', '店舗の削除に失敗しました', 500);
  }
}
