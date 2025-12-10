import { useEffect } from 'react';
import { createPortal } from 'react-dom';
import { ExclamationTriangleIcon } from '@heroicons/react/24/outline';

/**
 * Confirmation Dialog Component
 * @param {boolean} isOpen - Whether the dialog is open
 * @param {Function} onClose - Function to call when dialog is closed (without confirming)
 * @param {Function} onConfirm - Function to call when user confirms
 * @param {string} title - Dialog title
 * @param {string} message - Dialog message
 * @param {string} confirmText - Text for confirm button (default: "Confirm")
 * @param {string} cancelText - Text for cancel button (default: "Cancel")
 * @param {string} confirmButtonColor - Color class for confirm button (default: "bg-red-600 hover:bg-red-700")
 * @param {boolean} isDarkMode - Whether dark mode is enabled
 */
const ConfirmationDialog = ({
  isOpen,
  onClose,
  onConfirm,
  title = "Confirm Action",
  message = "Are you sure you want to proceed?",
  confirmText = "Confirm",
  cancelText = "Cancel",
  confirmButtonColor = "bg-red-600 hover:bg-red-700 focus:ring-red-500",
  isDarkMode = false,
}) => {
  // Prevent body scroll when dialog is open
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

  // Handle ESC key to close
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isOpen, onClose]);

  const handleConfirm = () => {
    onConfirm();
    onClose();
  };

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  if (!isOpen) return null;

  // Use portal to render at document body level
  const dialogContent = (
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center p-4"
      onClick={handleBackdropClick}
      style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0 }}
    >
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
        style={{ opacity: isOpen ? 1 : 0 }}
      />

      {/* Dialog Box - Centered in middle of screen */}
      <div
        className={`relative w-full max-w-md transform rounded-2xl border p-6 shadow-2xl transition-all ${
          isOpen ? 'scale-100 opacity-100' : 'scale-95 opacity-0'
        } ${
          isDarkMode
            ? 'border-slate-700 bg-slate-800 text-slate-100'
            : 'border-slate-200 bg-white text-slate-900'
        }`}
        onClick={(e) => e.stopPropagation()}
        style={{ zIndex: 10000 }}
      >
        {/* Icon and Content */}
        <div className="flex items-start gap-4">
          <div
            className={`flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full ${
              isDarkMode ? 'bg-red-900/30' : 'bg-red-100'
            }`}
          >
            <ExclamationTriangleIcon
              className={`h-6 w-6 ${
                isDarkMode ? 'text-red-400' : 'text-red-600'
              }`}
              aria-hidden="true"
            />
          </div>
          
          <div className="flex-1">
            <h3
              className={`text-lg font-semibold ${
                isDarkMode ? 'text-slate-100' : 'text-slate-900'
              }`}
            >
              {title}
            </h3>
            <div className="mt-2">
              <p
                className={`text-sm ${
                  isDarkMode ? 'text-slate-300' : 'text-slate-600'
                }`}
              >
                {message}
              </p>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="mt-6 flex justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            className={`rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
              isDarkMode
                ? 'bg-slate-700 text-slate-200 hover:bg-slate-600 focus:outline-none focus:ring-2 focus:ring-slate-500 focus:ring-offset-2 focus:ring-offset-slate-800'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200 focus:outline-none focus:ring-2 focus:ring-slate-500 focus:ring-offset-2'
            }`}
          >
            {cancelText}
          </button>
          <button
            type="button"
            onClick={handleConfirm}
            className={`rounded-lg px-4 py-2 text-sm font-medium text-white transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 ${confirmButtonColor} ${
              isDarkMode ? 'focus:ring-offset-slate-800' : 'focus:ring-offset-white'
            }`}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );

  return createPortal(dialogContent, document.body);
};

export default ConfirmationDialog;
