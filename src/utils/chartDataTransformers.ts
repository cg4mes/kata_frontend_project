export type TimePeriod = 'days' | 'weeks' | 'months';

export interface TrendDataPoint {
  name: string;
  exito: number;
}

export function generateTrendData(currentValue: number, period: TimePeriod): TrendDataPoint[] {
  if (period === 'days') {
    return [
      { name: 'Día 1', exito: currentValue > 0 ? currentValue - 8 : 0 },
      { name: 'Día 2', exito: currentValue > 0 ? currentValue - 5 : 0 },
      { name: 'Día 3', exito: currentValue > 0 ? currentValue - 3 : 0 },
      { name: 'Día 4', exito: currentValue > 0 ? currentValue - 1 : 0 },
      { name: 'Día 5', exito: currentValue },
    ];
  }

  if (period === 'weeks') {
    return [
      { name: 'Sem 1', exito: currentValue > 0 ? currentValue - 5 : 0 },
      { name: 'Sem 2', exito: currentValue > 0 ? currentValue - 2 : 0 },
      { name: 'Sem 3', exito: currentValue },
    ];
  }

  // months
  return [
    { name: 'Oct', exito: currentValue > 0 ? currentValue - 10 : 0 },
    { name: 'Nov', exito: currentValue > 0 ? currentValue - 5 : 0 },
    { name: 'Dic', exito: currentValue },
  ];
}
