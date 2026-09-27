import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface TooltipProps {
  children: React.ReactNode;
  content: string;
  position?: 'top' | 'bottom' | 'left' | 'right';
}

export const Tooltip: React.FC<TooltipProps> = ({ children, content, position = 'bottom' }) => {
  const [isVisible, setIsVisible] = React.useState(false);

  const positionClasses = {
    top: 'bottom-full mb-2 left-1/2 -translate-x-1/2',
    bottom: 'top-full mt-2 left-1/2 -translate-x-1/2',
    left: 'right-full mr-2 top-1/2 -translate-y-1/2',
    right: 'left-full ml-2 top-1/2 -translate-y-1/2',
  };

  return (
    <div
      className="relative inline-block"
      onMouseEnter={() => setIsVisible(true)}
      onMouseLeave={() => setIsVisible(false)}
    >
      {children}
      <AnimatePresence>
        {isVisible && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className={`absolute z-50 ${positionClasses[position]} pointer-events-none`}
          >
            <div className="whitespace-nowrap rounded-lg bg-color-for-tooltip px-3 py-1.5 text-xs text-color-for-tooltip shadow-lg">
              {content}
              <div
                className={`absolute h-2 w-2 rotate-45 transform bg-color-for-tooltip ${
                  position === 'top' ? 'top-full left-1/2 -translate-x-1/2 -mt-1' :
                  position === 'bottom' ? 'bottom-full left-1/2 -translate-x-1/2 -mb-1' :
                  position === 'left' ? 'left-full top-1/2 -translate-y-1/2 -ml-1' :
                  'right-full top-1/2 -translate-y-1/2 -mr-1'
                }`}
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

