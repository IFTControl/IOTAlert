export interface Alert {
  id: number;
  timestamp: string;
  title: string;
  message: string;
  severity: 'info' | 'warning' | 'critical' | 'success';
  source: string;
  data: Record<string, any>;
  read: boolean;
  createdAt: string;
}

export interface User {
  username: string;
  userId: number;
}

export interface AuthResponse {
  success: boolean;
  token?: string;
  user?: User;
  error?: string;
}

export interface AlertsResponse {
  success: boolean;
  alerts: Alert[];
  count: number;
  unreadCount: number;
}

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface LoginCredentials {
  username: string;
  password: string;
}

