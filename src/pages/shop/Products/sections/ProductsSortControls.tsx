import { ArrowDownWideNarrow } from 'lucide-react';

import { type Language } from '@/types';
import { cn } from '@/utils/cn';

export const PRODUCT_SORT_FIELDS = ['viewcount', 'name', 'createdat', 'updatedat'] as const;
export const DEFAULT_PRODUCT_SORT_BY = 'viewcount';

export type ProductSortOption = {
  id: string;
  sortBy: (typeof PRODUCT_SORT_FIELDS)[number];
  label: string;
};

type ProductsSortControlsProps = {
  lang: Language;
  sortBy?: string;
  sortDescending?: boolean;
  onChange: (sortBy?: string, sortDescending?: boolean) => void;
  className?: string;
  compact?: boolean;
};

export const getProductSortOptions = (lang: Language): ProductSortOption[] => {
  const isFa = lang === 'fa';

  return [
    {
      id: 'viewcount',
      sortBy: 'viewcount',
      label: isFa ? '\u067e\u0631\u0628\u0627\u0632\u062f\u06cc\u062f' : 'Most viewed',
    },
    {
      id: 'name',
      sortBy: 'name',
      label: isFa ? '\u0646\u0627\u0645' : 'Name',
    },
    {
      id: 'createdat',
      sortBy: 'createdat',
      label: isFa ? '\u062a\u0627\u0632\u0647\u200c\u062a\u0631\u06cc\u0646' : 'Created',
    },
    {
      id: 'updatedat',
      sortBy: 'updatedat',
      label: isFa ? '\u0628\u0647\u200c\u0631\u0648\u0632\u0634\u062f\u0647' : 'Updated',
    },
  ];
};

export const getActiveProductSortOption = (
  options: ProductSortOption[],
  sortBy?: string,
) => options.find((option) => option.sortBy === sortBy?.toLowerCase());

export const getInitialProductSortDescending = (sortBy?: string) => sortBy !== 'name';

export default function ProductsSortControls({
  lang,
  sortBy,
  sortDescending,
  onChange,
  className,
  compact = false,
}: ProductsSortControlsProps) {
  const options = getProductSortOptions(lang);
  const activeOption = getActiveProductSortOption(options, sortBy) ?? options[0];
  const directionSortBy = activeOption?.sortBy ?? options[0]?.sortBy;
  const isDescending =
    typeof sortDescending === 'boolean'
      ? sortDescending
      : getInitialProductSortDescending(directionSortBy);
  const directionLabel = isDescending
    ? lang === 'fa'
      ? '\u0646\u0632\u0648\u0644\u06cc'
      : 'Descending'
    : lang === 'fa'
      ? '\u0635\u0639\u0648\u062f\u06cc'
      : 'Ascending';

  return (
    <div
      className={cn(
        'flex w-full items-center gap-2 rounded-2xl border border-first/15 bg-color-for-layer-on-body p-2 shadow-[0_8px_24px_rgba(20,29,38,0.05)]',
        compact && 'flex-col items-stretch border-first-100/80 shadow-none',
        className,
      )}
    >
      <div
        aria-label={directionLabel}
        title={directionLabel}
        className={cn(
          'inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-first',
          compact && 'self-end',
        )}
      >
        <ArrowDownWideNarrow className="h-4.5 w-4.5" strokeWidth={1.8} aria-hidden="true" />
      </div>

      <div
        className={cn(
          'grid min-w-0 flex-1 gap-1.5',
          compact ? 'grid-cols-2' : 'grid-cols-2 sm:flex sm:flex-wrap',
        )}
      >
        {options.map((option) => {
          const isActive = option.sortBy === activeOption?.sortBy;
          const nextSortDescending =
            isActive && typeof sortDescending === 'boolean'
              ? sortDescending
              : getInitialProductSortDescending(option.sortBy);

          return (
            <button
              key={option.id}
              type="button"
              aria-pressed={isActive}
              onClick={() => onChange(option.sortBy, nextSortDescending)}
              className={cn(
                'inline-flex min-h-10 items-center justify-center rounded-xl px-3 text-sm font-f-sbold transition-colors sm:min-w-24',
                isActive
                  ? 'bg-first text-white shadow-sm'
                  : 'first-text-color-for-paragraph hover:bg-first/10 hover:text-first',
              )}
            >
              {option.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}
