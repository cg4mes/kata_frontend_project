import { useState, useCallback, useEffect } from 'react';
import { projectsApi } from '../services/api';
import type { ProjectWithMetrics, DashboardStats } from '../types';

export type { ProjectWithMetrics };

interface UseProjectsDataReturn {
  projects: ProjectWithMetrics[];
  stats: DashboardStats;
  loading: boolean;
  error: string | null;
  loadData: () => Promise<void>;
  refreshData: () => Promise<void>;
}

const INITIAL_STATS: DashboardStats = {
  totalProjects: 0,
  averageSuccessRate: 0,
  totalTestRuns: 0,
  averageCoverage: 0,
};

export function useProjectsData(): UseProjectsDataReturn {
  const [projects, setProjects] = useState<ProjectWithMetrics[]>([]);
  const [stats, setStats] = useState<DashboardStats>(INITIAL_STATS);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Calcular estadísticas del dashboard
  const calculateStats = useCallback((projectsData: ProjectWithMetrics[]): DashboardStats => {
    if (projectsData.length === 0) {
      return INITIAL_STATS;
    }

    const totalTestRuns = projectsData.reduce((sum, p) => sum + p.metrics.testRunsCount, 0);
    const avgSuccessRate =
      projectsData.reduce((sum, p) => sum + p.metrics.averageSuccessRate, 0) / projectsData.length;
    const avgCoverage =
      projectsData.reduce((sum, p) => sum + p.metrics.currentCoverage, 0) / projectsData.length;

    return {
      totalProjects: projectsData.length,
      averageSuccessRate: avgSuccessRate,
      totalTestRuns,
      averageCoverage: avgCoverage,
    };
  }, []);

  const loadData = useCallback(async (): Promise<void> => {
    try {
      setLoading(true);
      setError(null);

      const projectsWithMetrics = await projectsApi.getAll();
      setProjects(projectsWithMetrics);

      const calculatedStats = calculateStats(projectsWithMetrics);
      setStats(calculatedStats);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error al cargar datos';
      setError(errorMessage);
      console.error('Error loading projects data:', err);
    } finally {
      setLoading(false);
    }
  }, [calculateStats]);

  /**
   * Refreshes the data (alias for loadData for better semantics)
   */
  const refreshData = useCallback(async (): Promise<void> => {
    await loadData();
  }, [loadData]);

  // Auto-load data on mount
  useEffect(() => {
    loadData();
  }, [loadData]);

  return {
    projects,
    stats,
    loading,
    error,
    loadData,
    refreshData,
  };
}
