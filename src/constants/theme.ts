/**
 * Design Tokens - Sistema de diseño centralizado
 * Define colores, espaciados, y otros valores de diseño
 * para mantener consistencia visual en toda la aplicación
 */

export const theme = {
  colors: {
    // Colores principales
    primary: {
      50: '#eff6ff',
      100: '#dbeafe',
      500: '#3b82f6',
      600: '#2563eb',
      700: '#1d4ed8',
      900: '#1e3a8a',
    },
    // Colores de éxito
    success: {
      50: '#f0fdf4',
      100: '#dcfce7',
      500: '#22c55e',
      600: '#16a34a',
      700: '#15803d',
    },
    // Colores de peligro/error
    danger: {
      50: '#fef2f2',
      100: '#fee2e2',
      600: '#dc2626',
      700: '#b91c1c',
      800: '#991b1b',
    },
    // Colores de advertencia
    warning: {
      50: '#fefce8',
      100: '#fef9c3',
      500: '#eab308',
      600: '#ca8a04',
      700: '#a16207',
    },
    // Escala de grises
    gray: {
      50: '#f9fafb',
      100: '#f3f4f6',
      200: '#e5e7eb',
      300: '#d1d5db',
      400: '#9ca3af',
      500: '#6b7280',
      600: '#4b5563',
      700: '#374151',
      800: '#1f2937',
      900: '#111827',
    },
    // Colores para tipos de pipeline
    purple: {
      500: '#a855f7',
      600: '#9333ea',
    },
    orange: {
      500: '#f97316',
      600: '#ea580c',
    },
  },

  spacing: {
    xs: '0.25rem', // 4px
    sm: '0.5rem', // 8px
    md: '1rem', // 16px
    lg: '1.5rem', // 24px
    xl: '2rem', // 32px
    '2xl': '3rem', // 48px
  },

  borderRadius: {
    sm: '0.25rem', // 4px
    md: '0.375rem', // 6px
    lg: '0.5rem', // 8px
    xl: '0.75rem', // 12px
    full: '9999px', // circular
  },

  fontSize: {
    xs: '0.75rem', // 12px
    sm: '0.875rem', // 14px
    base: '1rem', // 16px
    lg: '1.125rem', // 18px
    xl: '1.25rem', // 20px
    '2xl': '1.5rem', // 24px
    '3xl': '1.875rem', // 30px
  },

  fontWeight: {
    normal: '400',
    medium: '500',
    semibold: '600',
    bold: '700',
  },

  shadows: {
    sm: '0 1px 2px 0 rgb(0 0 0 / 0.05)',
    md: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
    lg: '0 10px 15px -3px rgb(0 0 0 / 0.1)',
    xl: '0 20px 25px -5px rgb(0 0 0 / 0.1)',
  },

  transitions: {
    fast: '150ms',
    normal: '200ms',
    slow: '300ms',
  },
} as const;

export type Theme = typeof theme;
