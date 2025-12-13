import { useState, useEffect } from 'react';
import type { CreateProjectDto } from '../types';
import { Button, Input } from './ui';

interface CreateProjectModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (project: CreateProjectDto) => Promise<void>;
}

export default function CreateProjectModal({ isOpen, onClose, onSubmit }: CreateProjectModalProps) {
  const [formData, setFormData] = useState<CreateProjectDto>({
    product: '',
    prefix: '',
    totalDefinedTests: 0,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && !isSubmitting) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, isSubmitting, onClose]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    
    // Validación
    if (!formData.product.trim()) {
      setError('El nombre del producto es requerido');
      return;
    }
    if (!formData.prefix.trim()) {
      setError('El prefijo es requerido');
      return;
    }
    if (formData.totalDefinedTests <= 0) {
      setError('El total de tests debe ser mayor a 0');
      return;
    }

    setIsSubmitting(true);
    try {
      await onSubmit(formData);
      // Limpiar formulario
      setFormData({ product: '', prefix: '', totalDefinedTests: 0 });
      onClose();
    } catch (err) {
      const error = err as { response?: { data?: { message?: string } }; message?: string };
      setError(error?.response?.data?.message || error?.message || 'Error al crear el proyecto');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    if (!isSubmitting) {
      setFormData({ product: '', prefix: '', totalDefinedTests: 0 });
      setError(null);
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* Overlay con blur sutil */}
      <div
        className="fixed inset-0 backdrop-blur-md transition-opacity"
        onClick={handleClose}
      ></div>

      {/* Modal */}
      <div className="flex min-h-full items-center justify-center p-4">
        <div className="relative w-full max-w-md transform overflow-hidden rounded-lg bg-white shadow-xl transition-all">
          {/* Header */}
          <div className="bg-blue-600 px-6 py-4">
            <h3 className="text-lg font-semibold text-white">Nuevo Equipo</h3>
          </div>

          {/* Body - Formulario */}
          <form onSubmit={handleSubmit}>
            <div className="px-6 py-4 space-y-4">
              {error && (
                <div className="bg-red-50 border border-red-200 rounded-md p-3">
                  <p className="text-sm text-red-800">{error}</p>
                </div>
              )}

              {/* Campo: Producto */}
              <Input
                id="product"
                label="Nombre del Producto"
                type="text"
                value={formData.product}
                onChange={(e) => setFormData({ ...formData, product: e.target.value })}
                isRequired
                disabled={isSubmitting}
                placeholder="Ej: Portal Web"
                autoFocus
              />

              {/* Campo: Prefijo */}
              <Input
                id="prefix"
                label="Prefijo"
                type="text"
                value={formData.prefix}
                onChange={(e) => setFormData({ ...formData, prefix: e.target.value.toUpperCase() })}
                isRequired
                disabled={isSubmitting}
                placeholder="Ej: PW"
                maxLength={10}
              />

              {/* Campo: Total Tests */}
              <Input
                id="totalTests"
                label="Total de Tests Definidos (FE + BE)"
                type="number"
                value={formData.totalDefinedTests || ''}
                onChange={(e) => setFormData({ ...formData, totalDefinedTests: parseInt(e.target.value) || 0 })}
                isRequired
                disabled={isSubmitting}
                placeholder="Ej: 150"
                min="1"
              />
            </div>

            {/* Footer - Botones */}
            <div className="bg-gray-50 px-6 py-4 flex justify-end gap-3">
              <Button
                id="btn-cancel-create-project"
                variant="secondary"
                onClick={handleClose}
                disabled={isSubmitting}
              >
                Cancelar
              </Button>
              <Button
                id="btn-submit-create-project"
                variant="primary"
                type="submit"
                disabled={isSubmitting}
                isLoading={isSubmitting}
              >
                Crear Equipo
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
