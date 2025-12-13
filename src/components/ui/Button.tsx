import { ButtonHTMLAttributes, ReactNode } from 'react';

/**
 * Variantes de estilo para el botón
 */
export type ButtonVariant = 'primary' | 'success' | 'danger' | 'secondary' | 'ghost';

/**
 * Tamaños disponibles para el botón
 */
export type ButtonSize = 'sm' | 'md' | 'lg';

/**
 * Props del componente Button
 */
export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  /** Variante visual del botón */
  variant?: ButtonVariant;
  /** Tamaño del botón */
  size?: ButtonSize;
  /** Icono a mostrar antes del texto */
  icon?: ReactNode;
  /** Mostrar estado de carga */
  isLoading?: boolean;
  /** Ancho completo */
  fullWidth?: boolean;
  /** Contenido del botón */
  children: ReactNode;
}

/**
 * Componente Button reutilizable
 * 
 * @example
 * ```tsx
 * <Button variant="primary" size="md" onClick={handleClick}>
 *   Guardar
 * </Button>
 * 
 * <Button variant="danger" icon={<TrashIcon />} isLoading={deleting}>
 *   Eliminar
 * </Button>
 * ```
 */
export const Button = ({
  variant = 'primary',
  size = 'md',
  icon,
  isLoading = false,
  fullWidth = false,
  disabled,
  className = '',
  children,
  ...props
}: ButtonProps) => {
  // Estilos base que se aplican a todos los botones
  const baseStyles = 'inline-flex items-center justify-center font-medium rounded-md transition-all focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:cursor-not-allowed';

  // Estilos por variante
  const variantStyles: Record<ButtonVariant, string> = {
    primary: 'bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500 disabled:bg-gray-300 disabled:text-gray-600',
    success: 'bg-green-600 text-white hover:bg-green-700 focus:ring-green-500 disabled:bg-gray-300 disabled:text-gray-600',
    danger: 'bg-red-600 text-white hover:bg-red-700 focus:ring-red-500 disabled:bg-gray-300 disabled:text-gray-600',
    secondary: 'bg-white text-gray-700 border-2 border-gray-300 hover:bg-gray-50 hover:border-gray-400 focus:ring-gray-500 disabled:opacity-50',
    ghost: 'bg-transparent text-gray-700 hover:bg-gray-100 focus:ring-gray-500 disabled:opacity-50',
  };

  // Estilos por tamaño
  const sizeStyles: Record<ButtonSize, string> = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-base',
    lg: 'px-6 py-3 text-lg',
  };

  // Estilo de ancho completo
  const widthStyle = fullWidth ? 'w-full' : '';

  // Combinar todos los estilos
  const buttonStyles = `${baseStyles} ${variantStyles[variant]} ${sizeStyles[size]} ${widthStyle} ${className}`;

  return (
    <button
      className={buttonStyles}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading && (
        <svg 
          className="animate-spin -ml-1 mr-2 h-4 w-4" 
          fill="none" 
          viewBox="0 0 24 24"
        >
          <circle 
            className="opacity-25" 
            cx="12" 
            cy="12" 
            r="10" 
            stroke="currentColor" 
            strokeWidth="4"
          />
          <path 
            className="opacity-75" 
            fill="currentColor" 
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          />
        </svg>
      )}
      {!isLoading && icon && <span className="mr-2">{icon}</span>}
      {children}
    </button>
  );
};
