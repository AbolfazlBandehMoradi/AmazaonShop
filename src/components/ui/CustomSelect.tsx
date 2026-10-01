import { useEffect, useId, useRef, useState, type KeyboardEvent } from 'react';
import { Check, ChevronDown } from 'lucide-react';

import { cn } from '@/utils/cn';

export type CustomSelectOption = {
  value: string;
  label: string;
};

type CustomSelectProps = {
  label: string;
  options: readonly CustomSelectOption[];
  value: string;
  onChange: (value: string) => void;
  className?: string;
  variant?: 'default' | 'glass';
};

export function CustomSelect({
  label,
  options,
  value,
  onChange,
  className,
  variant = 'default',
}: CustomSelectProps) {
  const listboxId = useId();
  const rootRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const optionRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [highlightedIndex, setHighlightedIndex] = useState(0);
  const selectedIndex = Math.max(
    0,
    options.findIndex((option) => option.value === value),
  );
  const selectedLabel = options[selectedIndex]?.label ?? '';

  useEffect(() => {
    if (!isOpen) return;
    optionRefs.current[highlightedIndex]?.focus();
  }, [highlightedIndex, isOpen]);

  useEffect(() => {
    if (!isOpen) return;

    const closeOnOutsidePointer = (event: PointerEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) setIsOpen(false);
    };

    document.addEventListener('pointerdown', closeOnOutsidePointer);
    return () => document.removeEventListener('pointerdown', closeOnOutsidePointer);
  }, [isOpen]);

  const openAt = (index: number) => {
    if (!options.length) return;
    setHighlightedIndex(index);
    setIsOpen(true);
  };

  const choose = (option: CustomSelectOption) => {
    onChange(option.value);
    setIsOpen(false);
    triggerRef.current?.focus();
  };

  const handleTriggerKeyDown = (event: KeyboardEvent<HTMLButtonElement>) => {
    if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
      event.preventDefault();
      openAt(
        (selectedIndex + (event.key === 'ArrowDown' ? 1 : -1) + options.length) % options.length,
      );
    } else if (event.key === 'Home' || event.key === 'End') {
      event.preventDefault();
      openAt(event.key === 'Home' ? 0 : options.length - 1);
    }
  };

  const handleListboxKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (event.key === 'Escape') {
      event.preventDefault();
      setIsOpen(false);
      triggerRef.current?.focus();
      return;
    }

    if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
      event.preventDefault();
      setHighlightedIndex(
        (highlightedIndex + (event.key === 'ArrowDown' ? 1 : -1) + options.length) % options.length,
      );
      return;
    }

    if (event.key === 'Home' || event.key === 'End') {
      event.preventDefault();
      setHighlightedIndex(event.key === 'Home' ? 0 : options.length - 1);
      return;
    }

    if (event.key.length === 1 && !event.altKey && !event.ctrlKey && !event.metaKey) {
      const matchIndex = options.findIndex((option) =>
        option.label.toLocaleLowerCase().startsWith(event.key.toLocaleLowerCase()),
      );
      if (matchIndex >= 0) setHighlightedIndex(matchIndex);
    }
  };

  return (
    <div
      ref={rootRef}
      className={cn('relative w-full', className)}
      onBlur={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget as Node | null)) setIsOpen(false);
      }}
    >
      <button
        ref={triggerRef}
        type="button"
        aria-label={[label, selectedLabel].filter(Boolean).join(': ')}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        aria-controls={isOpen ? listboxId : undefined}
        onClick={() => {
          if (isOpen) setIsOpen(false);
          else openAt(selectedIndex);
        }}
        onKeyDown={handleTriggerKeyDown}
        className={cn(
          'flex h-12 w-full items-center justify-between gap-3 rounded-[18px] border px-4 text-start text-sm font-f-sbold transition-colors focus-visible:outline-2 focus-visible:outline-offset-2',
          variant === 'glass'
            ? 'bg-white/15 text-white shadow-[0_8px_24px_rgba(8,8,35,0.18),inset_0_1px_0_rgba(255,255,255,0.2)] backdrop-blur-xl focus-visible:outline-white'
            : 'bg-color-for-layer-on-body text-text focus-visible:outline-first',
          variant === 'glass'
            ? isOpen
              ? 'border-white/60'
              : 'border-white/30 hover:border-white/50 hover:bg-white/20'
            : isOpen
              ? 'border-first'
              : 'border-border hover:border-first/60',
        )}
      >
        <span className="min-w-0 truncate">{selectedLabel}</span>
        <ChevronDown
          aria-hidden="true"
          className={cn(
            'size-4 shrink-0 transition-transform',
            variant === 'glass' ? 'text-white' : 'text-first',
            isOpen && 'rotate-180',
          )}
        />
      </button>

      {isOpen && (
        <div
          id={listboxId}
          role="listbox"
          aria-label={label}
          onKeyDown={handleListboxKeyDown}
          className={cn(
            'absolute inset-x-0 top-full z-30 mt-2 rounded-[18px] border p-1.5',
            variant === 'glass'
              ? 'border-white/25 bg-[#18183e]/85 shadow-[0_12px_30px_rgba(8,8,35,0.3)] backdrop-blur-xl'
              : 'border-border bg-color-for-layer-on-body shadow-dark-sm',
          )}
        >
          {options.map((option, index) => (
            <button
              key={option.value}
              ref={(element) => {
                optionRefs.current[index] = element;
              }}
              type="button"
              role="option"
              aria-selected={option.value === value}
              tabIndex={index === highlightedIndex ? 0 : -1}
              onClick={() => choose(option)}
              className={cn(
                'flex w-full items-center justify-between gap-3 rounded-[13px] px-3 py-2.5 text-start text-sm focus-visible:outline-none',
                variant === 'glass'
                  ? 'text-white hover:bg-white/15 focus-visible:bg-white/15'
                  : 'text-text hover:bg-surface focus-visible:bg-surface',
                option.value === value &&
                  (variant === 'glass'
                    ? 'bg-white/20 font-f-sbold text-white'
                    : 'bg-color-for-layer-sec font-f-sbold text-first'),
              )}
            >
              <span>{option.label}</span>
              {option.value === value && <Check aria-hidden="true" className="size-4 shrink-0" />}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
