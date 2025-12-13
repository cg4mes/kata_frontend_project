# Estructura del Proyecto Frontend - Dashboard de Testing

## 📁 Organización de Carpetas

```
src/
├── components/          # Componentes reutilizables
│   ├── Icon.tsx        # Componente de iconos SVG
│   ├── StatsCard.tsx   # Tarjeta de estadísticas
│   └── CreateProjectModal.tsx
├── constants/          # Constantes y configuraciones
│   └── colors.ts       # Paleta de colores del proyecto
├── hooks/              # Custom React Hooks
│   ├── useProjectsData.ts    # Hook para carga de datos
│   └── useProjectSorting.ts  # Hook para ordenamiento
├── pages/              # Páginas principales
│   ├── Dashboard.tsx
│   └── ProjectDetail.tsx
├── services/           # Servicios API
│   └── api.ts
├── types/              # TypeScript types
│   └── index.ts
└── utils/              # Funciones utilitarias
    ├── metricsCalculator.ts      # Cálculos de métricas
    └── chartDataTransformers.ts  # Transformación de datos para gráficos
```

## 🔧 Componentes Modulares

### StatsCard
Componente reutilizable para mostrar tarjetas de estadísticas.

**Props:**
- `icon`: Elemento React (SVG)
- `label`: Etiqueta descriptiva
- `value`: Valor a mostrar (string o number)
- `bgColor`: Color de fondo (clase Tailwind)
- `isActive`: Estado activo (opcional)
- `onClick`: Función callback para hacer la tarjeta clickeable (opcional)

**Uso:**
```tsx
<StatsCard
  icon={<Icon path={ICON_PATHS.folder} className="h-6 w-6 text-white" />}
  label="Total Proyectos"
  value={stats.totalProjects}
  bgColor={STATS_CARD_COLORS.projects}
  onClick={() => sortByCriteria('none', projects)}
  isActive={sortCriteria === 'none'}
/>
```

### Icon
Componente para renderizar iconos SVG de manera consistente.

**Props:**
- `path`: Path del SVG (usar constantes de ICON_PATHS)
- `className`: Clases CSS opcionales

## 🪝 Custom Hooks

### useProjectsData
Hook para gestionar la carga y estado de datos de proyectos.

**Retorna:**
- `projects`: Array de proyectos con métricas
- `stats`: Estadísticas globales del dashboard
- `loading`: Estado de carga
- `error`: Mensaje de error (si existe)
- `loadData`: Función para recargar datos

**Uso:**
```tsx
const { projects, stats, loading, error, loadData } = useProjectsData();

useEffect(() => {
  loadData();
}, [loadData]);
```

### useProjectSorting
Hook para gestionar el ordenamiento de proyectos.

**Parámetros:**
- `initialData`: Array inicial de datos

**Retorna:**
- `sortedData`: Datos ordenados
- `sortCriteria`: Criterio de ordenamiento actual
- `sortByCriteria`: Función para ordenar
- `setSortedData`: Setter para datos ordenados
- `setSortCriteria`: Setter para criterio

**Uso:**
```tsx
const { sortedData, sortCriteria, sortByCriteria } = useProjectSorting(projects);

// Ordenar por tasa de éxito
sortByCriteria('successRate', projects);
```

## 🛠️ Utilidades

### metricsCalculator
Funciones para calcular métricas de proyectos e indicadores.

**Funciones:**
- `calculateProjectMetrics(indicators)`: Calcula métricas de un proyecto individual
- `calculateDashboardMetrics(projectsCount, projectMetrics)`: Calcula métricas globales

### chartDataTransformers
Funciones para transformar datos en formatos adecuados para gráficos.

**Funciones:**
- `generateTrendData(currentValue, period)`: Genera datos de tendencia según periodo

## 🎨 Constantes

### colors.ts
Paleta de colores centralizada del proyecto.

**Exports:**
- `CHART_COLORS`: Colores para gráficos
- `PIE_CHART_COLORS`: Array de colores para gráficos de pastel
- `STATS_CARD_COLORS`: Colores para tarjetas de estadísticas

## 📈 Cómo Agregar Nuevas Funcionalidades

### Agregar un Nuevo Indicador

1. **Actualizar tipos** en `types/index.ts`:
```typescript
export interface Indicator {
  // ... campos existentes
  newMetric: number;
}
```

2. **Actualizar cálculos** en `utils/metricsCalculator.ts`:
```typescript
export function calculateProjectMetrics(indicators: Indicator[]) {
  // Agregar cálculo para nuevo métrico
  const newMetricAvg = indicators.reduce((sum, i) => sum + i.newMetric, 0) / indicators.length;
  
  return {
    // ... métricas existentes
    newMetricAvg,
  };
}
```

3. **Crear componente de visualización** (opcional):
```typescript
// src/components/NewMetricChart.tsx
export function NewMetricChart({ data }) {
  // Implementación
}
```

### Agregar una Nueva Métrica al Dashboard

1. **Agregar color** en `constants/colors.ts`:
```typescript
export const STATS_CARD_COLORS = {
  // ... colores existentes
  newMetric: 'bg-teal-500',
};
```

2. **Agregar icono** en `components/Icon.tsx`:
```typescript
export const ICON_PATHS = {
  // ... paths existentes
  newIcon: 'M... nuevo path SVG',
};
```

3. **Usar StatsCard** en Dashboard:
```typescript
<StatsCard
  icon={<Icon path={ICON_PATHS.newIcon} className="h-6 w-6 text-white" />}
  label="Nueva Métrica"
  value={stats.newMetric}
  bgColor={STATS_CARD_COLORS.newMetric}
/>
```

### Agregar un Nuevo Tipo de Ordenamiento

1. **Actualizar tipo** en `hooks/useProjectSorting.ts`:
```typescript
export type SortCriteria = 'none' | 'successRate' | 'testRuns' | 'coverage' | 'newCriteria';
```

2. **Agregar case** en función de ordenamiento:
```typescript
case 'newCriteria':
  return b.newMetric - a.newMetric;
```

## 🔄 Flujo de Datos

1. **Carga Inicial**: `useProjectsData` → API calls → `calculateProjectMetrics` → State
2. **Ordenamiento**: User click → `sortByCriteria` → `setSortedData`
3. **Visualización**: State → Components → UI

## ✅ Beneficios de esta Estructura

- ✨ **Reutilización**: Componentes como StatsCard pueden usarse en múltiples lugares
- 🧪 **Testeable**: Funciones puras en utils son fáciles de testear
- 📦 **Escalable**: Fácil agregar nuevos indicadores o métricas
- 🎯 **Separación de responsabilidades**: Lógica separada de presentación
- 🔧 **Mantenible**: Cambios centralizados en constantes y utilidades
- 📖 **Legible**: Código más limpio y fácil de entender

## 🚀 Próximos Pasos de Mejora

1. Crear componentes para gráficos (TrendChart, PieChart, BarChart)
2. Extraer ProjectsTable como componente independiente
3. Implementar tests unitarios para utils y hooks
4. Agregar validación de datos con Zod o similar
5. Implementar caché de datos con React Query
