// Configuración del API
export const API_CONFIG = {
  BASE_URL: import.meta.env.VITE_API_URL || 'http://localhost:3000',
  TIMEOUT: 30000,
  RETRY_ATTEMPTS: 3,
} as const;

export const STORAGE_KEYS = {
  AUTH_TOKEN: 'auth_token',
  AUTH_USER: 'auth_user',
} as const;

export const USER_ROLES = {
  ADMIN: 'admin',
  VIEWER: 'viewer',
} as const;

export const PIPELINE_TYPES = {
  REGRESSION: 'regression',
  SECURITY: 'security',
  PERFORMANCE: 'performance',
} as const;

export const CHART_COLORS = {
  PRIMARY: '#3b82f6',
  SUCCESS: '#10b981',
  WARNING: '#f59e0b',
  DANGER: '#ef4444',
  PURPLE: '#8b5cf6',
  CYAN: '#06b6d4',
} as const;

export const ERROR_MESSAGES = {
  NETWORK_ERROR: 'Error de conexión. Por favor, verifica tu conexión a internet.',
  UNAUTHORIZED: 'Sesión expirada. Por favor, inicia sesión nuevamente.',
  FORBIDDEN: 'No tienes permisos para realizar esta acción.',
  NOT_FOUND: 'El recurso solicitado no fue encontrado.',
  SERVER_ERROR: 'Error del servidor. Por favor, intenta más tarde.',
  VALIDATION_ERROR: 'Error de validación. Verifica los datos ingresados.',
  GENERIC_ERROR: 'Ocurrió un error inesperado. Por favor, intenta nuevamente.',
} as const;

/**
 * Success messages
 */
export const SUCCESS_MESSAGES = {
  PROJECT_CREATED: 'Proyecto creado exitosamente',
  PROJECT_UPDATED: 'Proyecto actualizado exitosamente',
  PROJECT_DELETED: 'Proyecto eliminado exitosamente',
  USER_CREATED: 'Usuario creado exitosamente',
  USER_DELETED: 'Usuario eliminado exitosamente',
  LOGIN_SUCCESS: 'Sesión iniciada correctamente',
  LOGOUT_SUCCESS: 'Sesión cerrada correctamente',
} as const;

/**
 * Route paths
 */
export const ROUTES = {
  HOME: '/',
  LOGIN: '/login',
  PROJECT_DETAIL: '/project/:id',
  USERS: '/users',
} as const;
