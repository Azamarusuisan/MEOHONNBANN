import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api';

export interface Customer {
  id: number;
  name: string;
  email: string;
  phone: string;
  line_user_id?: string;
  created_at: string;
  updated_at: string;
}

export interface CreateCustomerDto {
  name: string;
  email: string;
  phone: string;
  line_user_id?: string;
}

export interface UpdateCustomerDto {
  name?: string;
  email?: string;
  phone?: string;
  line_user_id?: string;
}

export const customersApi = {
  // 顧客一覧取得
  getAll: async (): Promise<Customer[]> => {
    const response = await axios.get(`${API_BASE_URL}/customers`);
    return response.data;
  },

  // 顧客詳細取得
  getById: async (id: number): Promise<Customer> => {
    const response = await axios.get(`${API_BASE_URL}/customers/${id}`);
    return response.data;
  },

  // 顧客作成
  create: async (data: CreateCustomerDto): Promise<Customer> => {
    const response = await axios.post(`${API_BASE_URL}/customers`, data);
    return response.data;
  },

  // 顧客更新
  update: async (id: number, data: UpdateCustomerDto): Promise<Customer> => {
    const response = await axios.put(`${API_BASE_URL}/customers/${id}`, data);
    return response.data;
  },

  // 顧客削除
  delete: async (id: number): Promise<void> => {
    await axios.delete(`${API_BASE_URL}/customers/${id}`);
  },

  // 顧客検索
  search: async (query: string): Promise<Customer[]> => {
    const response = await axios.get(`${API_BASE_URL}/customers/search`, {
      params: { q: query }
    });
    return response.data;
  }
};
