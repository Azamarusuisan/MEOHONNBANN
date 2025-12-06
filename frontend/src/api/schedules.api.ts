import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api';

export type ScheduleStatus = 'pending' | 'completed' | 'cancelled' | 'failed';

export interface Schedule {
  id: number;
  post_id: number;
  scheduled_at: string;
  status: ScheduleStatus;
  executed_at?: string;
  error_message?: string;
  created_at: string;
  updated_at: string;
  post?: {
    id: number;
    title: string;
    post_type: string;
    store?: {
      id: number;
      name: string;
    };
  };
}

export interface CreateScheduleDto {
  post_id: number;
  scheduled_at: string;
}

export interface UpdateScheduleDto {
  scheduled_at?: string;
  status?: ScheduleStatus;
}

export const schedulesApi = {
  // スケジュール一覧取得
  getAll: async (): Promise<Schedule[]> => {
    const response = await axios.get(`${API_BASE_URL}/schedules`);
    return response.data;
  },

  // ステータス別スケジュール取得
  getByStatus: async (status: ScheduleStatus): Promise<Schedule[]> => {
    const response = await axios.get(`${API_BASE_URL}/schedules`, {
      params: { status }
    });
    return response.data;
  },

  // スケジュール詳細取得
  getById: async (id: number): Promise<Schedule> => {
    const response = await axios.get(`${API_BASE_URL}/schedules/${id}`);
    return response.data;
  },

  // スケジュール作成
  create: async (data: CreateScheduleDto): Promise<Schedule> => {
    const response = await axios.post(`${API_BASE_URL}/schedules`, data);
    return response.data;
  },

  // スケジュール更新
  update: async (id: number, data: UpdateScheduleDto): Promise<Schedule> => {
    const response = await axios.put(`${API_BASE_URL}/schedules/${id}`, data);
    return response.data;
  },

  // スケジュール削除
  delete: async (id: number): Promise<void> => {
    await axios.delete(`${API_BASE_URL}/schedules/${id}`);
  },

  // スケジュールキャンセル
  cancel: async (id: number): Promise<Schedule> => {
    const response = await axios.post(`${API_BASE_URL}/schedules/${id}/cancel`);
    return response.data;
  }
};
