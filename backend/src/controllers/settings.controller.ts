import { Request, Response } from 'express';
import { createSettingSchema, updateSettingSchema } from '../validators/setting.validator';
import { settingsService } from '../services/settings.service';
import { sendSuccess, sendError } from '../utils/response';

export async function getSettings(req: Request, res: Response) {
  try {
    const { page = '1', limit = '10', storeId } = req.query;
    const settings = await settingsService.getSettings({
      page: parseInt(page as string),
      limit: parseInt(limit as string),
      storeId: storeId as string,
    });
    sendSuccess(res, settings);
  } catch (error) {
    sendError(res, 'FETCH_ERROR', '設定一覧の取得に失敗しました', 500);
  }
}

export async function getSetting(req: Request, res: Response) {
  try {
    const { id } = req.params;
    const setting = await settingsService.getSetting(id);

    if (!setting) {
      sendError(res, 'NOT_FOUND', '設定が見つかりません', 404);
      return;
    }

    sendSuccess(res, setting);
  } catch (error) {
    sendError(res, 'FETCH_ERROR', '設定情報の取得に失敗しました', 500);
  }
}

export async function createSetting(req: Request, res: Response) {
  try {
    const result = createSettingSchema.safeParse(req.body);
    if (!result.success) {
      sendError(res, 'VALIDATION_ERROR', '入力内容に誤りがあります', 400,
        result.error.errors.map(e => ({ field: e.path.join('.'), message: e.message })));
      return;
    }

    const setting = await settingsService.createSetting(result.data);
    sendSuccess(res, setting, 201);
  } catch (error) {
    sendError(res, 'CREATE_ERROR', '設定の作成に失敗しました', 500);
  }
}

export async function updateSetting(req: Request, res: Response) {
  try {
    const { id } = req.params;
    const result = updateSettingSchema.safeParse(req.body);

    if (!result.success) {
      sendError(res, 'VALIDATION_ERROR', '入力内容に誤りがあります', 400,
        result.error.errors.map(e => ({ field: e.path.join('.'), message: e.message })));
      return;
    }

    const setting = await settingsService.updateSetting(id, result.data);

    if (!setting) {
      sendError(res, 'NOT_FOUND', '設定が見つかりません', 404);
      return;
    }

    sendSuccess(res, setting);
  } catch (error) {
    sendError(res, 'UPDATE_ERROR', '設定の更新に失敗しました', 500);
  }
}

export async function deleteSetting(req: Request, res: Response) {
  try {
    const { id } = req.params;
    const success = await settingsService.deleteSetting(id);

    if (!success) {
      sendError(res, 'NOT_FOUND', '設定が見つかりません', 404);
      return;
    }

    sendSuccess(res, { message: '設定を削除しました' });
  } catch (error) {
    sendError(res, 'DELETE_ERROR', '設定の削除に失敗しました', 500);
  }
}
