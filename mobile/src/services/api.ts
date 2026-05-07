import axios, { AxiosResponse } from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { AuthResponse, AlertsResponse, Alert, ApiResponse, LoginCredentials } from '../types';

const API_BASE_URL = 'http://localhost:3000/api'; // Change this to your backend URL

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
});

// Request interceptor to add auth token
api.interceptors.request.use(
  async (config) => {
    const token = await AsyncStorage.getItem('authToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      // Token expired or invalid, clear storage and redirect to login
      await AsyncStorage.removeItem('authToken');
      await AsyncStorage.removeItem('user');
    }
    return Promise.reject(error);
  }
);

export const authAPI = {
  login: async (credentials: LoginCredentials): Promise<AuthResponse> => {
    try {
      const response: AxiosResponse<AuthResponse> = await api.post('/auth/login', credentials);
      if (response.data.success && response.data.token) {
        await AsyncStorage.setItem('authToken', response.data.token);
        await AsyncStorage.setItem('user', JSON.stringify(response.data.user));
      }
      return response.data;
    } catch (error: any) {
      console.error('Login error:', error);
      return {
        success: false,
        error: error.response?.data?.error || 'Login failed'
      };
    }
  },

  logout: async (): Promise<void> => {
    await AsyncStorage.removeItem('authToken');
    await AsyncStorage.removeItem('user');
  },

  registerPushToken: async (token: string): Promise<ApiResponse> => {
    try {
      const response: AxiosResponse<ApiResponse> = await api.post('/auth/register-push-token', { token });
      return response.data;
    } catch (error: any) {
      console.error('Register push token error:', error);
      return {
        success: false,
        error: error.response?.data?.error || 'Failed to register push token'
      };
    }
  },

  removePushToken: async (token: string): Promise<ApiResponse> => {
    try {
      const response: AxiosResponse<ApiResponse> = await api.delete('/auth/push-token', { data: { token } });
      return response.data;
    } catch (error: any) {
      console.error('Remove push token error:', error);
      return {
        success: false,
        error: error.response?.data?.error || 'Failed to remove push token'
      };
    }
  }
};

export const alertsAPI = {
  getAlerts: async (): Promise<AlertsResponse> => {
    try {
      const response: AxiosResponse<AlertsResponse> = await api.get('/alerts');
      return response.data;
    } catch (error: any) {
      console.error('Get alerts error:', error);
      return {
        success: false,
        alerts: [],
        count: 0,
        unreadCount: 0
      };
    }
  },

  getAlert: async (id: number): Promise<{ success: boolean; alert?: Alert; error?: string }> => {
    try {
      const response: AxiosResponse<{ success: boolean; alert: Alert }> = await api.get(`/alerts/${id}`);
      return response.data;
    } catch (error: any) {
      console.error('Get alert error:', error);
      return {
        success: false,
        error: error.response?.data?.error || 'Failed to fetch alert'
      };
    }
  },

  markAsRead: async (id: number): Promise<ApiResponse> => {
    try {
      const response: AxiosResponse<ApiResponse> = await api.patch(`/alerts/${id}/read`);
      return response.data;
    } catch (error: any) {
      console.error('Mark as read error:', error);
      return {
        success: false,
        error: error.response?.data?.error || 'Failed to mark alert as read'
      };
    }
  },

  markAllAsRead: async (): Promise<ApiResponse> => {
    try {
      const response: AxiosResponse<ApiResponse> = await api.patch('/alerts/read-all');
      return response.data;
    } catch (error: any) {
      console.error('Mark all as read error:', error);
      return {
        success: false,
        error: error.response?.data?.error || 'Failed to mark all alerts as read'
      };
    }
  },

  deleteAlert: async (id: number): Promise<ApiResponse> => {
    try {
      const response: AxiosResponse<ApiResponse> = await api.delete(`/alerts/${id}`);
      return response.data;
    } catch (error: any) {
      console.error('Delete alert error:', error);
      return {
        success: false,
        error: error.response?.data?.error || 'Failed to delete alert'
      };
    }
  },

  getUnreadCount: async (): Promise<{ success: boolean; unreadCount?: number; error?: string }> => {
    try {
      const response: AxiosResponse<{ success: boolean; unreadCount: number }> = await api.get('/alerts/stats/unread');
      return response.data;
    } catch (error: any) {
      console.error('Get unread count error:', error);
      return {
        success: false,
        error: error.response?.data?.error || 'Failed to fetch unread count'
      };
    }
  }
};

export default api;

