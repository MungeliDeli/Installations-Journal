import axios from "axios";
import { tokenService } from "../utils/token";

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:3000/api",
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use((config) => {
  const token = tokenService.getToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  
  // Don't set Content-Type for FormData - let the browser set it with boundary
  if (config.data instanceof FormData) {
    delete config.headers['Content-Type'];
  }
  
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    const isLoginRequest = error.config?.url?.includes("/auth/login");

    if (
      error.response?.status === 401 &&
      !isLoginRequest &&
      tokenService.getToken()
    ) {
      tokenService.removeToken();
      window.location.href = "/";
    }
    return Promise.reject(error);
  }
);

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface SignUpData {
  name: string;
  email: string;
  phone: string;
  password: string;
}

export interface AuthResponse {
  token?: string;
  user?: {
    id: string;
    name: string;
    email: string;
    phone: string;
    profileImage?: string;
    supervisor?: string;
    cluster?: string;
    startDate?: string | Date;
    dailyTarget?: number;
    weeklyTarget?: number;
    monthlyTarget?: number;
  };
  error?: string;
}

export const authApi = {
  login: async (credentials: LoginCredentials): Promise<AuthResponse> => {
    const response = await api.post<AuthResponse>("/auth/login", credentials);
    return response.data;
  },

  signup: async (data: SignUpData): Promise<AuthResponse> => {
    const response = await api.post<AuthResponse>("/auth/register", data);

    return response.data;
  },
};
