import { useState, useCallback } from 'react';
import type { ProjectMetrics } from '../types';

export type SortCriteria = 'none' | 'successRate' | 'testRuns' | 'coverage';

interface Sortable {
  metrics: ProjectMetrics;
}

export function useProjectSorting<T extends Sortable>(initialData: T[]) {
  const [sortedData, setSortedData] = useState<T[]>(initialData);
  const [sortCriteria, setSortCriteriaState] = useState<SortCriteria>('none');

  const sortByCriteria = useCallback((criteria: SortCriteria, data: T[]) => {
    setSortCriteriaState(criteria);

    if (criteria === 'none') {
      setSortedData([...data]);
      return;
    }

    const sorted = [...data].sort((a, b) => {
      switch (criteria) {
        case 'successRate':
          return b.metrics.averageSuccessRate - a.metrics.averageSuccessRate;
        case 'testRuns':
          return b.metrics.testRunsCount - a.metrics.testRunsCount;
        case 'coverage':
          return b.metrics.currentCoverage - a.metrics.currentCoverage;
        default:
          return 0;
      }
    });

    setSortedData(sorted);
  }, []);

  return {
    sortedData,
    sortCriteria,
    sortByCriteria,
    setSortedData,
    setSortCriteria: setSortCriteriaState,
  };
}
