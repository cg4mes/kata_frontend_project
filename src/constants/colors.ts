export const CHART_COLORS = {
  primary: '#3b82f6',
  success: '#10b981',
  warning: '#f59e0b',
  danger: '#ef4444',
  purple: '#8b5cf6',
  gray: '#6b7280',
} as const;

export const PIE_CHART_COLORS = [
  CHART_COLORS.success,
  CHART_COLORS.danger,
  CHART_COLORS.warning,
  CHART_COLORS.gray,
];

export const STATS_CARD_COLORS = {
  projects: 'bg-blue-500',
  successRate: 'bg-green-500',
  testRuns: 'bg-purple-500',
  coverage: 'bg-orange-500',
} as const;
