import { AnimatePresence, motion } from 'framer-motion';
import { ReactNode } from 'react';
import { usePageScrollLock } from '@/hooks/usePageScrollLock';

interface ModalButton {
  label: string;
  onClick: () => void;
  variant?: 'primary' | 'secondary' | 'outline';
  className?: string;
}

interface AppModalProps {
  isOpen: boolean;
  onClose: () => void;

  icon?: ReactNode;
  title?: ReactNode;
  description?: ReactNode;

  buttons?: ModalButton[];
}

export function AppModal({
  isOpen,
  onClose,
  icon,
  title,
  description,
  buttons = [],
}: AppModalProps) {
  usePageScrollLock(isOpen);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        >
          <motion.div
            role="dialog"
            aria-modal="true"
            className="mx-4 w-full max-w-sm rounded-2xl border border-color-theme bg-color-for-layer-on-body p-6 text-center shadow-2xl sm:p-8"
            initial={{ scale: 0.6, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.6, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 300, damping: 24 }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* ICON */}
            {icon && <div className="mb-4 flex justify-center">{icon}</div>}

            {/* TITLE */}
            {title && (
              <h3 className="mb-2 text-2xl font-bold first-text-color">{title}</h3>
            )}

            {/* DESCRIPTION */}
            {description && <p className="mb-6 first-text-color-for-paragraph">{description}</p>}

            {/* BUTTONS */}
            {buttons.length > 0 && (
              <div className="flex gap-3">
                {buttons.map((btn, index) => {
                  const base = 'min-h-11 flex-1 rounded-xl px-4 py-2 font-medium transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-first';

                  const styles = {
                    primary: 'bg-first text-white hover:bg-first-600',
                    secondary: 'bg-color-for-layer-sec first-text-color hover:bg-color-for-layer-three',
                    outline: 'border border-color-theme first-text-color hover:bg-color-for-layer-sec',
                  };

                  return (
                    <button
                      key={index}
                      onClick={btn.onClick}
                      className={`${base} ${styles[btn.variant || 'primary']} ${
                        btn.className || ''
                      }`}
                    >
                      {btn.label}
                    </button>
                  );
                })}
              </div>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
