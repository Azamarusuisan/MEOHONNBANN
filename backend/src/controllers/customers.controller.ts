import { Request, Response } from 'express';
import { createCustomerSchema, updateCustomerSchema } from '../validators/customer.validator.js';
import { customersService } from '../services/customers.service.js';
import { sendSuccess, sendError } from '../utils/response.js';

export async function getCustomers(req: Request, res: Response) {
  try {
    const { page = '1', limit = '10', search, storeId } = req.query;
    const customers = await customersService.getCustomers({
      page: parseInt(page as string),
      limit: parseInt(limit as string),
      search: search as string,
      storeId: storeId as string,
    });
    sendSuccess(res, customers);
  } catch (error) {
    sendError(res, 'FETCH_ERROR', '顧客一覧の取得に失敗しました', 500);
  }
}

export async function getCustomer(req: Request, res: Response) {
  try {
    const { id } = req.params;
    const customer = await customersService.getCustomer(id);

    if (!customer) {
      sendError(res, 'NOT_FOUND', '顧客が見つかりません', 404);
      return;
    }

    sendSuccess(res, customer);
  } catch (error) {
    sendError(res, 'FETCH_ERROR', '顧客情報の取得に失敗しました', 500);
  }
}

export async function createCustomer(req: Request, res: Response) {
  try {
    const result = createCustomerSchema.safeParse(req.body);
    if (!result.success) {
      sendError(res, 'VALIDATION_ERROR', '入力内容に誤りがあります', 400,
        result.error.errors.map(e => ({ field: e.path.join('.'), message: e.message })));
      return;
    }

    const customer = await customersService.createCustomer(result.data);
    sendSuccess(res, customer, 201);
  } catch (error) {
    sendError(res, 'CREATE_ERROR', '顧客の作成に失敗しました', 500);
  }
}

export async function updateCustomer(req: Request, res: Response) {
  try {
    const { id } = req.params;
    const result = updateCustomerSchema.safeParse(req.body);

    if (!result.success) {
      sendError(res, 'VALIDATION_ERROR', '入力内容に誤りがあります', 400,
        result.error.errors.map(e => ({ field: e.path.join('.'), message: e.message })));
      return;
    }

    const customer = await customersService.updateCustomer(id, result.data);

    if (!customer) {
      sendError(res, 'NOT_FOUND', '顧客が見つかりません', 404);
      return;
    }

    sendSuccess(res, customer);
  } catch (error) {
    sendError(res, 'UPDATE_ERROR', '顧客の更新に失敗しました', 500);
  }
}

export async function deleteCustomer(req: Request, res: Response) {
  try {
    const { id } = req.params;
    const success = await customersService.deleteCustomer(id);

    if (!success) {
      sendError(res, 'NOT_FOUND', '顧客が見つかりません', 404);
      return;
    }

    sendSuccess(res, { message: '顧客を削除しました' });
  } catch (error) {
    sendError(res, 'DELETE_ERROR', '顧客の削除に失敗しました', 500);
  }
}
