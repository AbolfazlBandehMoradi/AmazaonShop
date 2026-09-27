import React, { createContext, useContext, useEffect, useRef, useState } from 'react';

type DropdownContextType = {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
};

const DropdownContext = createContext<DropdownContextType | null>(null);

const useDropdown = () => {
  const context = useContext(DropdownContext);

  if (!context) {
    throw new Error('Dropdown components must be used inside DropdownMenu');
  }

  return context;
};

export const DropdownMenu = ({ children }: { children: React.ReactNode }) => {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <DropdownContext.Provider value={{ open, setOpen }}>
      <div ref={ref} className="relative inline-block">
        {children}
      </div>
    </DropdownContext.Provider>
  );
};

export const DropdownMenuTrigger = ({ children }: { children: React.ReactNode }) => {
  const { open, setOpen } = useDropdown();

  return (
    <div
      onClick={(e) => {
        e.stopPropagation();
        setOpen(!open);
      }}
      className="cursor-pointer"
    >
      {children}
    </div>
  );
};

export const DropdownMenuContent = ({
  children,
  className = '',
}: {
  children: React.ReactNode;
  className?: string;
}) => {
  const { open } = useDropdown();

  if (!open) return null;

  return (
    <div
      className={`absolute left-0 z-99 mt-2 w-44 animate-in rounded-2xl border border-color-theme bg-[color-mix(in_srgb,var(--bg-color-for-layer-on-body)_92%,transparent)] p-1 shadow-2xl backdrop-blur-xl duration-150 fade-in zoom-in-95 ${className}`}
    >
      {children}
    </div>
  );
};

export const DropdownMenuItem = ({
  children,
  onClick,
  className = '',
}: {
  children: React.ReactNode;
  onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
  className?: string;
}) => {
  const { setOpen } = useDropdown();

  return (
    <button
      onClick={(e) => {
        e.stopPropagation();
        onClick?.(e);
        setOpen(false);
      }}
      className={`flex w-full items-center gap-2 rounded-xl px-3 py-2 text-sm first-text-color-for-paragraph transition-all duration-200 hover:bg-color-for-layer-sec ${className}`}
    >
      {children}
    </button>
  );
};
