import axios, { AxiosError, type InternalAxiosRequestConfig } from 'axios';
import type { Project, Indicator, CreateProjectDto, ProjectWithMetrics, LoginRequest, LoginResponse, RegisterRequest, User } from '../types';
import { API_CONFIG, STORAGE_KEYS, ERROR_MESSAGES } from '../constants/app';

const api = axios.create({
  baseURL: API_CONFIG.BASE_URL,
  timeout: API_CONFIG.TIMEOUT,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Agregar token a todas las peticiones
api.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = localStorage.getItem(STORAGE_KEYS.AUTH_TOKEN);
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Manejo global de errores
api.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    if (error.response) {
      switch (error.response.status) {
        case 401:
          // Solo redirigir al login si no estamos ya en el login
          if (!window.location.pathname.includes('/login')) {
            localStorage.removeItem(STORAGE_KEYS.AUTH_TOKEN);
            localStorage.removeItem(STORAGE_KEYS.AUTH_USER);
            window.location.href = '/login';
          }
          break;
        case 403:
          console.error(ERROR_MESSAGES.FORBIDDEN);
          break;
        case 404:
          console.error(ERROR_MESSAGES.NOT_FOUND);
          break;
        case 500:
          console.error(ERROR_MESSAGES.SERVER_ERROR);
          break;
      }
    } else if (error.request) {
      // Network error
      console.error(ERROR_MESSAGES.NETWORK_ERROR);
    }
    return Promise.reject(error);
  }
);

// Projects API
export const projectsApi = {
  getAll: async (): Promise<ProjectWithMetrics[]> => {
    const response = await api.get<ProjectWithMetrics[]>('/projects');
    return response.data;
  },

  getById: async (id: string): Promise<Project> => {
    const response = await api.get<Project>(`/projects/${id}`);
    return response.data;
  },

  create: async (project: CreateProjectDto): Promise<Project> => {
    const response = await api.post<Project>('/projects', project);
    return response.data;
  },

  update: async (id: string, project: Partial<CreateProjectDto>): Promise<Project> => {
    const response = await api.patch<Project>(`/projects/${id}`, project);
    return response.data;
  },

  delete: async (id: string): Promise<void> => {
    await api.delete(`/projects/${id}`);
  },
};

// Indicators API
export const indicatorsApi = {
  getByProject: async (projectId: string): Promise<Indicator[]> => {
    const response = await api.get<Indicator[]>('/indicators', {
      params: { projectId },
    });
    return response.data;
  },

  delete: async (id: string): Promise<void> => {
    await api.delete(`/indicators/${id}`);
  },

  deleteAllByProject: async (projectId: string): Promise<{ message: string; count: number }> => {
    const response = await api.delete<{ message: string; count: number }>(`/indicators/project/${projectId}/all`);
    return response.data;
  },
};

// Authentication API
export const authApi = {
  login: async (credentials: LoginRequest): Promise<LoginResponse> => {
    const response = await api.post<LoginResponse>('/users/login', credentials);
    return response.data;
  },

  register: async (userData: RegisterRequest): Promise<User> => {
    const response = await api.post<User>('/users/register', userData);
    return response.data;
  },

  getCurrentUser: async (userId: string): Promise<User> => {
    const response = await api.get<User>(`/users/${userId}`);
    return response.data;
  },
};

// Users API (Admin only)
export const usersApi = {
  getAll: async (): Promise<User[]> => {
    const response = await api.get<User[]>('/users');
    return response.data;
  },

  create: async (userData: RegisterRequest): Promise<User> => {
    const response = await api.post<User>('/users/register', userData);
    return response.data;
  },

  delete: async (userId: string): Promise<void> => {
    await api.delete(`/users/${userId}`);
  },
};

export default api;
