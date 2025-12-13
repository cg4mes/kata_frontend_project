import { useState, useEffect } from 'react';

interface EditTestsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (definedTests: number) => Promise<void>;
  currentValue: number;
  projectName: string;
}

export default function EditTestsModal({ 
  isOpen, 
  onClose, 
  onSubmit, 
  currentValue,
  projectName 
}: EditTestsModalProps) {
  const [definedTests, setDefinedTests] = useState<string>(currentValue.toString());
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    if (isOpen) {
      setDefinedTests(currentValue.toString());
      setError('');
    }
  }, [isOpen, currentValue]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    const value = parseInt(definedTests);
    if (isNaN(value) || value < 0) {
      setError('Debe ser un número válido mayor o igual a 0');
      return;
    }

    setIsSubmitting(true);
    try {
      await onSubmit(value);
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al actualizar');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    if (!isSubmitting) {
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex min-h-screen items-center justify-center p-4">
        <div 
          className="fixed inset-0 bg-gray-900/30 backdrop-blur-md transition-opacity"
          onClick={handleClose}
        />
        
        <div className="relative bg-white rounded-lg shadow-xl max-w-md w-full">
          <div className="bg-blue-500 px-6 py-4 rounded-t-lg">
            <h3 className="text-lg font-semibold text-white">
              Editar Tests Definidos
            </h3>
          </div>

          <form onSubmit={handleSubmit} className="p-6">
            <div className="mb-4">
              <p className="text-sm text-gray-600 mb-4">
                Proyecto: <span className="font-semibold text-gray-900">{projectName}</span>
              </p>
              
              <label htmlFor="definedTests" className="block text-sm font-medium text-gray-700 mb-2">
                Tests Definidos
              </label>
              <input
                type="number"
                id="definedTests"
                value={definedTests}
                onChange={(e) => setDefinedTests(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Ingresa el número de tests"
                min="0"
                required
                disabled={isSubmitting}
              />
              {error && (
                <p className="mt-2 text-sm text-red-600">{error}</p>
              )}
            </div>

            <div className="flex justify-end space-x-3">
              <button
                id="btn-cancel-edit-tests"
                type="button"
                onClick={handleClose}
                disabled={isSubmitting}
                style={{ opacity: isSubmitting ? 0.5 : 1 }}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none"
              >
                Cancelar
              </button>
              <button
                id="btn-submit-edit-tests"
                type="submit"
                disabled={isSubmitting}
                style={isSubmitting ? { backgroundColor: '#3b82f6', color: 'white', opacity: 0.5 } : { backgroundColor: '#3b82f6', color: 'white' }}
                className="px-4 py-2 text-sm font-medium rounded-md focus:outline-none"
                onMouseEnter={(e) => !isSubmitting && (e.currentTarget.style.backgroundColor = '#2563eb')}
                onMouseLeave={(e) => !isSubmitting && (e.currentTarget.style.backgroundColor = '#3b82f6')}
              >
                {isSubmitting ? 'Guardando...' : 'Guardar'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
