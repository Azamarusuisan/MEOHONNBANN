import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api';

export type PostType = 'event' | 'offer' | 'update' | 'product';
export type PostStatus = 'draft' | 'scheduled' | 'published' | 'failed';

export interface Post {
  id: number;
  store_id: number;
  post_type: PostType;
  title: string;
  content: string;
  image_url?: string;
  status: PostStatus;
  scheduled_at?: string;
  published_at?: string;
  created_at: string;
  updated_at: string;
  store?: {
    id: number;
    name: string;
  };
}

export interface CreatePostDto {
  store_id: number;
  post_type: PostType;
  title: string;
  content: string;
  image_url?: string;
  scheduled_at?: string;
}

export interface UpdatePostDto {
  store_id?: number;
  post_type?: PostType;
  title?: string;
  content?: string;
  image_url?: string;
  status?: PostStatus;
  scheduled_at?: string;
}

export const postsApi = {
  // 投稿一覧取得
  getAll: async (): Promise<Post[]> => {
    const response = await axios.get(`${API_BASE_URL}/posts`);
    return response.data;
  },

  // 投稿詳細取得
  getById: async (id: number): Promise<Post> => {
    const response = await axios.get(`${API_BASE_URL}/posts/${id}`);
    return response.data;
  },

  // 店舗別投稿取得
  getByStoreId: async (storeId: number): Promise<Post[]> => {
    const response = await axios.get(`${API_BASE_URL}/posts/store/${storeId}`);
    return response.data;
  },

  // 投稿作成
  create: async (data: CreatePostDto): Promise<Post> => {
    const response = await axios.post(`${API_BASE_URL}/posts`, data);
    return response.data;
  },

  // 投稿更新
  update: async (id: number, data: UpdatePostDto): Promise<Post> => {
    const response = await axios.put(`${API_BASE_URL}/posts/${id}`, data);
    return response.data;
  },

  // 投稿削除
  delete: async (id: number): Promise<void> => {
    await axios.delete(`${API_BASE_URL}/posts/${id}`);
  },

  // 投稿公開
  publish: async (id: number): Promise<Post> => {
    const response = await axios.post(`${API_BASE_URL}/posts/${id}/publish`);
    return response.data;
  }
};
