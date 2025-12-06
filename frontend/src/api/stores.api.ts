import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api';

export interface Store {
  id: number;
  name: string;
  location_name: string;
  address: string;
  phone: string;
  gbp_account_id?: string;
  created_at: string;
  updated_at: string;
}

export interface CreateStoreDto {
  name: string;
  location_name: string;
  address: string;
  phone: string;
  gbp_account_id?: string;
}

export interface UpdateStoreDto {
  name?: string;
  location_name?: string;
  address?: string;
  phone?: string;
  gbp_account_id?: string;
}

export const storesApi = {
  // 店舗一覧取得
  getAll: async (): Promise<Store[]> => {
    const response = await axios.get(`${API_BASE_URL}/stores`);
    return response.data;
  },

  // 店舗詳細取得
  getById: async (id: number): Promise<Store> => {
    const response = await axios.get(`${API_BASE_URL}/stores/${id}`);
    return response.data;
  },

  // 店舗作成
  create: async (data: CreateStoreDto): Promise<Store> => {
    const response = await axios.post(`${API_BASE_URL}/stores`, data);
    return response.data;
  },

  // 店舗更新
  update: async (id: number, data: UpdateStoreDto): Promise<Store> => {
    const response = await axios.put(`${API_BASE_URL}/stores/${id}`, data);
    return response.data;
  },

  // 店舗削除
  delete: async (id: number): Promise<void> => {
    await axios.delete(`${API_BASE_URL}/stores/${id}`);
  }
};
