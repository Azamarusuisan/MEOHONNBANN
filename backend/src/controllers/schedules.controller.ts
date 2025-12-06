import { Request, Response } from 'express';
import { createScheduleSchema, updateScheduleSchema } from '../validators/schedule.validator';
import { schedulesService } from '../services/schedules.service';
import { sendSuccess, sendError } from '../utils/response';

export async function getSchedules(req: Request, res: Response) {
  try {
    const { page = '1', limit = '10', storeId, startDate, endDate } = req.query;
    const schedules = await schedulesService.getSchedules({
      page: parseInt(page as string),
      limit: parseInt(limit as string),
      storeId: storeId as string,
      startDate: startDate as string,
      endDate: endDate as string,
    });
    sendSuccess(res, schedules);
  } catch (error) {
    sendError(res, 'FETCH_ERROR', 'スケジュール一覧の取得に失敗しました', 500);
  }
}

export async function getSchedule(req: Request, res: Response) {
  try {
    const { id } = req.params;
    const schedule = await schedulesService.getSchedule(id);

    if (!schedule) {
      sendError(res, 'NOT_FOUND', 'スケジュールが見つかりません', 404);
      return;
    }

    sendSuccess(res, schedule);
  } catch (error) {
    sendError(res, 'FETCH_ERROR', 'スケジュール情報の取得に失敗しました', 500);
  }
}

export async function createSchedule(req: Request, res: Response) {
  try {
    const result = createScheduleSchema.safeParse(req.body);
    if (!result.success) {
      sendError(res, 'VALIDATION_ERROR', '入力内容に誤りがあります', 400,
        result.error.errors.map(e => ({ field: e.path.join('.'), message: e.message })));
      return;
    }

    const schedule = await schedulesService.createSchedule(result.data);
    sendSuccess(res, schedule, 201);
  } catch (error) {
    sendError(res, 'CREATE_ERROR', 'スケジュールの作成に失敗しました', 500);
  }
}

export async function updateSchedule(req: Request, res: Response) {
  try {
    const { id } = req.params;
    const result = updateScheduleSchema.safeParse(req.body);

    if (!result.success) {
      sendError(res, 'VALIDATION_ERROR', '入力内容に誤りがあります', 400,
        result.error.errors.map(e => ({ field: e.path.join('.'), message: e.message })));
      return;
    }

    const schedule = await schedulesService.updateSchedule(id, result.data);

    if (!schedule) {
      sendError(res, 'NOT_FOUND', 'スケジュールが見つかりません', 404);
      return;
    }

    sendSuccess(res, schedule);
  } catch (error) {
    sendError(res, 'UPDATE_ERROR', 'スケジュールの更新に失敗しました', 500);
  }
}

export async function deleteSchedule(req: Request, res: Response) {
  try {
    const { id } = req.params;
    const success = await schedulesService.deleteSchedule(id);

    if (!success) {
      sendError(res, 'NOT_FOUND', 'スケジュールが見つかりません', 404);
      return;
    }

    sendSuccess(res, { message: 'スケジュールを削除しました' });
  } catch (error) {
    sendError(res, 'DELETE_ERROR', 'スケジュールの削除に失敗しました', 500);
  }
}
