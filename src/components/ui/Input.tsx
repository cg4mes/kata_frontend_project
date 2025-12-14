import { forwardRef, useId } from 'react';
import type { InputHTMLAttributes } from 'react';

/**
 * Props del componente Input
 */
export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  /** Etiqueta del input */
  label?: string;
  /** Mensaje de error a mostrar */
  error?: string;
  /** Texto de ayuda descriptivo */
  helperText?: string;
  /** Marca el campo como requerido visualmente */
  isRequired?: boolean;
}

/**
 * Componente Input reutilizable con soporte para labels, errores y validación
 *
 * @example
 * ```tsx
 * <Input
 *   label="Nombre de usuario"
 *   placeholder="Ingresa tu nombre"
 *   isRequired
 *   error={errors.username}
 * />
 *
 * <Input
 *   type="email"
 *   label="Correo electrónico"
 *   helperText="Usaremos este correo para contactarte"
 * />
 * ```
 */
export const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    {
      label,
      error,
      helperText,
      isRequired = false,
      disabled = false,
      className = '',
      id,
      ...props
    },
    ref
  ) => {
    // Generar ID único usando React hook
    const generatedId = useId();
    const inputId = id || generatedId;

    // Estilos base del input
    const baseStyles =
      'w-full px-3 py-2 border rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-offset-0';

    // Estilos condicionales según estado
    const stateStyles = error
      ? 'border-red-300 focus:border-red-500 focus:ring-red-500'
      : 'border-gray-300 focus:border-blue-500 focus:ring-blue-500';

    const disabledStyles = disabled ? 'bg-gray-100 cursor-not-allowed opacity-60' : 'bg-white';

    // Combinar estilos
    const inputStyles = `${baseStyles} ${stateStyles} ${disabledStyles} ${className}`;

    return (
      <div className="w-full">
        {/* Label */}
        {label && (
          <label htmlFor={inputId} className="block text-sm font-medium text-gray-700 mb-1">
            {label}
            {isRequired && <span className="text-red-500 ml-1">*</span>}
          </label>
        )}

        {/* Input */}
        <input
          ref={ref}
          id={inputId}
          disabled={disabled}
          className={inputStyles}
          aria-invalid={!!error}
          aria-describedby={
            error ? `${inputId}-error` : helperText ? `${inputId}-helper` : undefined
          }
          {...props}
        />

        {/* Error message */}
        {error && (
          <p id={`${inputId}-error`} className="mt-1 text-sm text-red-600" role="alert">
            {error}
          </p>
        )}

        {/* Helper text */}
        {!error && helperText && (
          <p id={`${inputId}-helper`} className="mt-1 text-sm text-gray-500">
            {helperText}
          </p>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';
