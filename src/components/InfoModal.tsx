import { useEffect } from 'react';

interface InfoModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  message: string;
  type?: 'info' | 'warning' | 'error';
  buttonText?: string;
}

export default function InfoModal({
  isOpen,
  onClose,
  title,
  message,
  type = 'info',
  buttonText = 'Entendido',
}: InfoModalProps) {
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
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
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const colors = {
    info: {
      header: 'bg-blue-600',
      hoverHeader: 'hover:bg-blue-700',
      icon: 'text-blue-600',
      button: '#3b82f6',
      buttonHover: '#2563eb',
      ring: 'focus:ring-blue-500',
    },
    warning: {
      header: 'bg-orange-600',
      hoverHeader: 'hover:bg-orange-700',
      icon: 'text-orange-600',
      button: '#ea580c',
      buttonHover: '#c2410c',
      ring: 'focus:ring-orange-500',
    },
    error: {
      header: 'bg-red-600',
      hoverHeader: 'hover:bg-red-700',
      icon: 'text-red-600',
      button: '#dc2626',
      buttonHover: '#b91c1c',
      ring: 'focus:ring-red-500',
    },
  };

  const currentColors = colors[type];

  const iconPath = {
    info: 'M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z',
    warning: 'M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z',
    error: 'M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z',
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* Overlay con blur */}
      <div
        className="fixed inset-0 backdrop-blur-md transition-opacity"
        onClick={onClose}
      ></div>

      {/* Modal */}
      <div className="flex min-h-full items-center justify-center p-4">
        <div className="relative w-full max-w-md transform overflow-hidden rounded-lg bg-white shadow-xl transition-all">
          {/* Header */}
          <div className={`${currentColors.header} px-6 py-4`}>
            <h3 className="text-lg font-semibold text-white">{title}</h3>
          </div>

          {/* Body */}
          <div className="px-6 py-6">
            <div className="flex items-start space-x-4">
              <div className="flex-shrink-0">
                <svg
                  className={`h-10 w-10 ${currentColors.icon}`}
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d={iconPath[type]}
                  />
                </svg>
              </div>
              <div className="flex-1">
                <p className="text-sm text-gray-700 whitespace-pre-line">{message}</p>
              </div>
            </div>
          </div>

          {/* Footer - Botón */}
          <div className="bg-gray-50 px-6 py-4 flex justify-end">
            <button
              id="btn-close-info"
              type="button"
              onClick={onClose}
              className={`px-5 py-2.5 text-sm font-bold text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-offset-2 ${currentColors.ring} shadow-md transition-all`}
              style={{ backgroundColor: currentColors.button, borderColor: currentColors.button, border: '2px solid' }}
              onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = currentColors.buttonHover, e.currentTarget.style.borderColor = currentColors.buttonHover)}
              onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = currentColors.button, e.currentTarget.style.borderColor = currentColors.button)}
            >
              {buttonText}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
