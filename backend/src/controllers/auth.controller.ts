import { Request, Response } from 'express';
import { loginSchema } from '../validators/auth.validator.js';
import { authService } from '../services/auth.service.js';
import { sendSuccess, sendError } from '../utils/response.js';

export async function login(req: Request, res: Response) {
  try {
    const result = loginSchema.safeParse(req.body);
    if (!result.success) {
      sendError(res, 'VALIDATION_ERROR', '入力内容に誤りがあります', 400,
        result.error.errors.map(e => ({ field: e.path.join('.'), message: e.message })));
      return;
    }

    const { email, password } = result.data;
    const loginResult = await authService.login(email, password);

    if (!loginResult) {
      sendError(res, 'INVALID_CREDENTIALS', 'メールアドレスまたはパスワードが正しくありません', 401);
      return;
    }

    sendSuccess(res, loginResult);
  } catch (error) {
    sendError(res, 'LOGIN_ERROR', 'ログインに失敗しました', 500);
  }
}

export async function me(req: Request, res: Response) {
  try {
    const user = await authService.getUser(req.user!.userId);
    if (!user) {
      sendError(res, 'USER_NOT_FOUND', 'ユーザーが見つかりません', 404);
      return;
    }
    sendSuccess(res, user);
  } catch (error) {
    sendError(res, 'FETCH_ERROR', 'ユーザー情報の取得に失敗しました', 500);
  }
}

export function logout(_req: Request, res: Response) {
  sendSuccess(res, { message: 'ログアウトしました' });
}
