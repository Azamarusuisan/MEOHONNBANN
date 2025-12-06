import { Request, Response } from 'express';
import { createMetricSchema, updateMetricSchema } from '../validators/metric.validator.js';
import { metricsService } from '../services/metrics.service.js';
import { sendSuccess, sendError } from '../utils/response.js';

export async function getMetrics(req: Request, res: Response) {
  try {
    const { page = '1', limit = '10', storeId, startDate, endDate } = req.query;
    const metrics = await metricsService.getMetrics({
      page: parseInt(page as string),
      limit: parseInt(limit as string),
      storeId: storeId as string,
      startDate: startDate as string,
      endDate: endDate as string,
    });
    sendSuccess(res, metrics);
  } catch (error) {
    sendError(res, 'FETCH_ERROR', 'メトリクス一覧の取得に失敗しました', 500);
  }
}

export async function getMetric(req: Request, res: Response) {
  try {
    const { id } = req.params;
    const metric = await metricsService.getMetric(id);

    if (!metric) {
      sendError(res, 'NOT_FOUND', 'メトリクスが見つかりません', 404);
      return;
    }

    sendSuccess(res, metric);
  } catch (error) {
    sendError(res, 'FETCH_ERROR', 'メトリクス情報の取得に失敗しました', 500);
  }
}

export async function createMetric(req: Request, res: Response) {
  try {
    const result = createMetricSchema.safeParse(req.body);
    if (!result.success) {
      sendError(res, 'VALIDATION_ERROR', '入力内容に誤りがあります', 400,
        result.error.errors.map(e => ({ field: e.path.join('.'), message: e.message })));
      return;
    }

    const metric = await metricsService.createMetric(result.data);
    sendSuccess(res, metric, 201);
  } catch (error) {
    sendError(res, 'CREATE_ERROR', 'メトリクスの作成に失敗しました', 500);
  }
}

export async function updateMetric(req: Request, res: Response) {
  try {
    const { id } = req.params;
    const result = updateMetricSchema.safeParse(req.body);

    if (!result.success) {
      sendError(res, 'VALIDATION_ERROR', '入力内容に誤りがあります', 400,
        result.error.errors.map(e => ({ field: e.path.join('.'), message: e.message })));
      return;
    }

    const metric = await metricsService.updateMetric(id, result.data);

    if (!metric) {
      sendError(res, 'NOT_FOUND', 'メトリクスが見つかりません', 404);
      return;
    }

    sendSuccess(res, metric);
  } catch (error) {
    sendError(res, 'UPDATE_ERROR', 'メトリクスの更新に失敗しました', 500);
  }
}

export async function deleteMetric(req: Request, res: Response) {
  try {
    const { id } = req.params;
    const success = await metricsService.deleteMetric(id);

    if (!success) {
      sendError(res, 'NOT_FOUND', 'メトリクスが見つかりません', 404);
      return;
    }

    sendSuccess(res, { message: 'メトリクスを削除しました' });
  } catch (error) {
    sendError(res, 'DELETE_ERROR', 'メトリクスの削除に失敗しました', 500);
  }
}
