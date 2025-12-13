export interface Project {
  id: string;
  product: string;
  prefix: string;
  totalDefinedTests: number;
  createdAt: string;
  updatedAt: string;
}

export interface ProjectMetrics {
  averageSuccessRate: number;
  currentCoverage: number;
  testRunsCount: number;
  averageErrorRate?: number;
  averageSecurityScore?: number;
}

export interface ProjectWithMetrics extends Project {
  metrics: ProjectMetrics;
}

export interface Indicator {
  id: string;
  projectId: string;
  pipelineType: 'regression' | 'security' | 'performance';
  runDate: string;
  // Regression metrics
  totalTests?: number;
  passed?: number;
  failed?: number;
  skipped?: number;
  executionSuccessRate?: number;
  automationCoverage?: number;
  // Performance metrics
  totalRequest?: number;
  okRequest?: number;
  koRequest?: number;
  timeMean?: number;
  timeMax?: number;
  timeMin?: number;
  errorRate?: number;
  // Security metrics
  high?: number;
  medium?: number;
  low?: number;
  informational?: number;
  securityScore?: number;
}

export interface CreateProjectDto {
  product: string;
  prefix: string;
  totalDefinedTests: number;
}

export interface DashboardStats {
  totalProjects: number;
  averageSuccessRate: number;
  totalTestRuns: number;
  averageCoverage: number;
}

// User and Authentication types
export type UserRole = 'admin' | 'viewer';

export interface User {
  id: string;
  username: string;
  email: string;
  role: UserRole;
  createdAt: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  username: string;
  email: string;
  password: string;
  role?: UserRole;
}

export interface LoginResponse {
  access_token: string;
  user: User;
}

export interface AuthContextType {
  user: User | null;
  token: string | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
  isAdmin: boolean;
}
