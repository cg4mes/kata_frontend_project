import { ReactNode, useEffect } from 'react';

/**
 * Variantes de color para el header del modal
 */
export type ModalVariant = 'primary' | 'success' | 'danger' | 'warning';

/**
 * Props del componente Modal
 */
export interface ModalProps {
  /** Controla si el modal está visible */
  isOpen: boolean;
  /** Callback cuando se cierra el modal */
  onClose: () => void;
  /** Título del modal */
  title: string;
  /** Variante de color para el header */
  variant?: ModalVariant;
  /** Contenido del modal */
  children: ReactNode;
  /** Contenido del footer (botones) */
  footer?: ReactNode;
  /** Ancho máximo del modal */
  maxWidth?: 'sm' | 'md' | 'lg' | 'xl';
  /** Prevenir cierre al hacer clic fuera */
  preventClose?: boolean;
}

/**
 * Componente Modal reutilizable
 * 
 * @example
 * ```tsx
 * <Modal
 *   isOpen={isOpen}
 *   onClose={() => setIsOpen(false)}
 *   title="Confirmar acción"
 *   variant="danger"
 *   footer={
 *     <>
 *       <Button variant="secondary" onClick={onClose}>Cancelar</Button>
 *       <Button variant="danger" onClick={onConfirm}>Eliminar</Button>
 *     </>
 *   }
 * >
 *   <p>¿Estás seguro de realizar esta acción?</p>
 * </Modal>
 * ```
 */
export const Modal = ({
  isOpen,
  onClose,
  title,
  variant = 'primary',
  children,
  footer,
  maxWidth = 'md',
  preventClose = false,
}: ModalProps) => {
  // Bloquear scroll del body cuando el modal está abierto
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  // Cerrar modal con tecla Escape
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && !preventClose) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
    };
  }, [isOpen, onClose, preventClose]);

  if (!isOpen) return null;

  // Estilos del header según variante
  const headerVariants: Record<ModalVariant, string> = {
    primary: 'bg-blue-600',
    success: 'bg-green-600',
    danger: 'bg-red-600',
    warning: 'bg-yellow-600',
  };

  // Estilos de ancho máximo
  const maxWidthStyles = {
    sm: 'max-w-sm',
    md: 'max-w-md',
    lg: 'max-w-lg',
    xl: 'max-w-xl',
  };

  const handleBackdropClick = () => {
    if (!preventClose) {
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* Backdrop con blur */}
      <div
        className="fixed inset-0 backdrop-blur-md bg-black bg-opacity-30 transition-opacity"
        onClick={handleBackdropClick}
        aria-hidden="true"
      />

      {/* Contenedor centrado */}
      <div className="flex min-h-full items-center justify-center p-4">
        {/* Modal */}
        <div
          className={`relative w-full ${maxWidthStyles[maxWidth]} transform overflow-hidden rounded-lg bg-white shadow-xl transition-all`}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className={`${headerVariants[variant]} px-6 py-4`}>
            <h3 className="text-lg font-semibold text-white">{title}</h3>
          </div>

          {/* Body */}
          <div className="px-6 py-4">
            {children}
          </div>

          {/* Footer (opcional) */}
          {footer && (
            <div className="bg-gray-50 px-6 py-4 flex justify-end gap-3">
              {footer}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
