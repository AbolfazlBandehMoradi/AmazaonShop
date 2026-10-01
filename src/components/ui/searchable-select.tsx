import { useState, useEffect, useRef, KeyboardEvent } from 'react';
import { ChevronDown, X } from 'lucide-react';
import { cn } from '@/utils/cn';
import { Input } from './input';

export interface SearchableSelectOption {
  value: number | string;
  label: string;
}

interface SearchableSelectProps {
  id?: string;
  options: SearchableSelectOption[];
  value: number | string;
  onChange: (value: number | string) => void;
  placeholder?: string;
  disabled?: boolean;
  className?: string;
  error?: boolean;
  searchPlaceholder?: string;
  emptyMessage?: string;
}

export function SearchableSelect({
  id,
  options,
  value,
  onChange,
  placeholder = 'Select an option',
  disabled = false,
  className,
  error = false,
  searchPlaceholder = 'Search...',
  emptyMessage = 'No options found',
}: SearchableSelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [highlightedIndex, setHighlightedIndex] = useState(-1);
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLDivElement>(null);

  const selectedOption = options.find((opt) => opt.value === value);

  // Filter options based on search term
  const filteredOptions = options.filter((option) =>
    option.label.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
        setSearchTerm('');
        setHighlightedIndex(-1);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [isOpen]);

  // Focus search input when dropdown opens
  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  // Scroll highlighted item into view
  useEffect(() => {
    if (highlightedIndex >= 0 && listRef.current) {
      const items = listRef.current.children;
      if (items[highlightedIndex]) {
        items[highlightedIndex].scrollIntoView({
          block: 'nearest',
          behavior: 'smooth',
        });
      }
    }
  }, [highlightedIndex]);

  const handleSelect = (optionValue: number | string) => {
    onChange(optionValue);
    setIsOpen(false);
    setSearchTerm('');
    setHighlightedIndex(-1);
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (disabled) return;

    switch (e.key) {
      case 'Enter':
        e.preventDefault();
        if (highlightedIndex >= 0 && filteredOptions[highlightedIndex]) {
          handleSelect(filteredOptions[highlightedIndex].value);
        } else if (filteredOptions.length === 1) {
          handleSelect(filteredOptions[0].value);
        }
        break;
      case 'ArrowDown':
        e.preventDefault();
        if (!isOpen) {
          setIsOpen(true);
        } else {
          setHighlightedIndex((prev) => (prev < filteredOptions.length - 1 ? prev + 1 : prev));
        }
        break;
      case 'ArrowUp':
        e.preventDefault();
        if (isOpen) {
          setHighlightedIndex((prev) => (prev > 0 ? prev - 1 : -1));
        }
        break;
      case 'Escape':
        setIsOpen(false);
        setSearchTerm('');
        setHighlightedIndex(-1);
        break;
      case 'Tab':
        setIsOpen(false);
        setSearchTerm('');
        setHighlightedIndex(-1);
        break;
    }
  };

  const handleToggle = () => {
    if (!disabled) {
      setIsOpen(!isOpen);
      if (!isOpen) {
        setSearchTerm('');
      }
    }
  };

  const handleClear = () => {
    onChange(0);
    setSearchTerm('');
  };

  return (
    <div ref={containerRef} className={cn('relative', className)}>
      {/* Trigger Button */}
      <button
        id={id}
        type="button"
        aria-invalid={error || undefined}
        aria-expanded={isOpen}
        aria-haspopup="listbox"
        onClick={handleToggle}
        disabled={disabled}
        className={cn(
          'flex h-11 w-full items-center first-text-color justify-between rounded-xl border border-color-theme bg-input-surface px-3.5 py-2 text-sm ring-offset-[var(--bg-color-for-layer-on-body)] transition-[border-color,box-shadow]',
          'focus-visible:border-first focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-first/20',
          'disabled:cursor-not-allowed disabled:opacity-50',
          error && 'border-red-500',
          selectedOption && !disabled && 'pe-16',
          className,
        )}
      >
        <span className={cn('truncate', !selectedOption && 'first-text-color-for-paragraph-low')}>
          {selectedOption ? selectedOption.label : placeholder}
        </span>
        <div className="flex items-center gap-1">
          <ChevronDown
            className={cn(
              'h-4 w-4 first-text-color-for-paragraph-low transition-transform',
              isOpen && 'rotate-180',
            )}
          />
        </div>
      </button>

      {selectedOption && value !== 0 && value !== '' && !disabled && (
        <button
          type="button"
          onClick={handleClear}
          aria-label="Clear selection"
          className="absolute end-9 top-1/2 z-10 -translate-y-1/2 rounded-md p-1 first-text-color-for-paragraph-low hover:first-text-color focus-visible:outline-2 focus-visible:outline-first"
        >
          <X className="h-4 w-4" />
        </button>
      )}

      {/* Dropdown */}
      {isOpen && (
        <div className="absolute z-50 mt-1 w-full overflow-hidden rounded-xl border border-color-theme bg-color-for-layer-on-body shadow-md">
          {/* Search Input */}
          <div className="border-b border-color-theme p-2">
            <Input
              ref={inputRef}
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setHighlightedIndex(-1);
              }}
              onKeyDown={handleKeyDown}
              placeholder={searchPlaceholder}
              className="h-8 first-text-color-for-paragraph"
            />
          </div>

          {/* Options List */}
          <div
            ref={listRef}
            className="searchable-select-scroll max-h-60 overflow-auto bg-color-for-layer-sec p-1"
            role="listbox"
          >
            {filteredOptions.length === 0 ? (
              <div className="px-2 py-1.5 text-sm first-text-color-for-paragraph  text-center">
                {emptyMessage}
              </div>
            ) : (
              filteredOptions.map((option, index) => (
                <div
                  key={option.value}
                  onClick={() => handleSelect(option.value)}
                  onMouseEnter={() => setHighlightedIndex(index)}
                  className={cn(
                    'relative flex min-h-10 cursor-pointer first-text-color-for-paragraph select-none items-center rounded-lg px-3 py-2 text-sm outline-none',
                    'transition-colors hover:bg-color-for-layer-three hover:first-text-color',
                    'focus:bg-color-for-layer-three focus:first-text-color',
                    value === option.value && 'bg-color-for-layer-three first-text-color',
                    highlightedIndex === index && 'bg-color-for-layer-three first-text-color font-f-sbold',
                  )}
                  role="option"
                  aria-selected={value === option.value}
                >
                  {option.label}
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}
