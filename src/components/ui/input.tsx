import * as React from 'react';
import { cn } from '@/utils/cn';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          'flex h-10 w-full rounded-md border border-color-theme bg-color-for-layer-sec px-3 py-2 text-sm first-text-color-for-paragraph ring-offset-[var(--bg-color-for-layer-on-body)] file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:first-text-color-for-paragraph-low focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-first disabled:cursor-not-allowed disabled:opacity-50',
          className,
        )}
        ref={ref}
        {...props}
      />
    );
  },
);
Input.displayName = 'Input';

export { Input };
