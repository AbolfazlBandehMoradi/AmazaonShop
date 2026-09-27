import { type ReactNode, useEffect, useMemo, useState } from 'react';
import { Check, ChevronDown, ChevronUp, X } from 'lucide-react';

import TomanIcon from '@/components/ui/Toman';
import { useDebouncedValue } from '@/hooks/useDebouncedValue';
import { useTranslation } from '@/i18n/useTranslation';
import { FilterItemsSkeleton } from './FilterPageSkeletons';
import CategoryTree from './CategoryTree';
import { type Category, type Language } from '@/types';
import { useLangStore } from '@/stores/languageStore';
import { useShopStore } from '@/stores/productsFilterStore';
import { type Showcase } from '@/hooks/useShowcases';
import { cn } from '@/utils/cn';
import { formatPrice } from '@/utils/numberFormat';

const PRICE_RANGE_MIN = 0;
const PRICE_RANGE_MAX = 1_000_000_000;
const PRICE_RANGE_STEP = 500_000;

type Props = {
  categories?: Category[];
  isCategoriesLoading: boolean;
  showcases?: Showcase[];
  isShowcasesLoading: boolean;
  expanded: Record<string, boolean>;
  toggleSection: (key: string) => void;
  hasOffer?: boolean;
  setHasOffer: (value: boolean | undefined) => void;
  hasActiveFilters: boolean;
  handleClearFilters: () => void;
  className?: string;
  panelClassName?: string;
  sticky?: boolean;
};

type FilterSectionProps = {
  title: string;
  isExpanded?: boolean;
  onToggle: () => void;
  children: ReactNode;
  contentClassName?: string;
};

type PriceRangeFilterProps = {
  lang: Language;
  minPrice?: number;
  maxPrice?: number;
  setPriceRange: (minPrice?: number, maxPrice?: number) => void;
  labels: {
    from: string;
    to: string;
    min: string;
    max: string;
    currency: string;
  };
};

type ShowcaseOptionsProps = {
  showcases?: Showcase[];
  isShowcasesLoading: boolean;
  showcaseIds: string[];
  toggleShowcaseId: (id: string) => void;
  emptyLabel: string;
};

const clamp = (value: number, min: number, max: number) => Math.min(Math.max(value, min), max);

type PriceRangeValue = {
  min: number;
  max: number;
};

const getSafePriceRange = (minPrice?: number, maxPrice?: number): PriceRangeValue => {
  const effectiveMin = clamp(minPrice ?? PRICE_RANGE_MIN, PRICE_RANGE_MIN, PRICE_RANGE_MAX);
  const effectiveMax = clamp(maxPrice ?? PRICE_RANGE_MAX, PRICE_RANGE_MIN, PRICE_RANGE_MAX);

  return {
    min: Math.min(effectiveMin, effectiveMax),
    max: Math.max(effectiveMin, effectiveMax),
  };
};

const areSameRange = (a: PriceRangeValue, b: PriceRangeValue) =>
  a.min === b.min && a.max === b.max;

function FilterSection({
  title,
  isExpanded,
  onToggle,
  children,
  contentClassName,
}: FilterSectionProps) {
  return (
    <div className="min-w-0 max-w-full overflow-hidden rounded-xl border border-first-100/70 bg-color-for-layer-on-body">
      <button
        type="button"
        onClick={onToggle}
        className={cn(
          'group flex w-full items-center justify-between px-3 py-2.5 text-sm font-s-medium first-text-color transition-colors hover:bg-first/5 hover:text-first',
          isExpanded && 'bg-first/5 text-first',
        )}
      >
        <span>{title}</span>

        {isExpanded ? (
          <ChevronUp className="h-4 w-4 transition-colors group-hover:text-first" />
        ) : (
          <ChevronDown className="h-4 w-4 transition-colors group-hover:text-first" />
        )}
      </button>

      {isExpanded ? (
        <div
          className={cn(
            'min-w-0 max-w-full overflow-hidden border-t border-first-100/70 px-2 py-2',
            contentClassName,
          )}
        >
          {children}
        </div>
      ) : null}
    </div>
  );
}

function PriceRangeFilter({
  lang,
  minPrice,
  maxPrice,
  setPriceRange,
  labels,
}: PriceRangeFilterProps) {
  const [draftRange, setDraftRange] = useState<PriceRangeValue>(() =>
    getSafePriceRange(minPrice, maxPrice),
  );
  const debouncedRange = useDebouncedValue(draftRange, 450);

  useEffect(() => {
    const nextRange = getSafePriceRange(minPrice, maxPrice);
    setDraftRange((currentRange) =>
      areSameRange(currentRange, nextRange) ? currentRange : nextRange,
    );
  }, [minPrice, maxPrice]);

  useEffect(() => {
    setPriceRange(
      debouncedRange.min <= PRICE_RANGE_MIN ? undefined : debouncedRange.min,
      debouncedRange.max >= PRICE_RANGE_MAX ? undefined : debouncedRange.max,
    );
  }, [debouncedRange, setPriceRange]);

  const safeMin = draftRange.min;
  const safeMax = draftRange.max;
  const minPercent = ((safeMin - PRICE_RANGE_MIN) / (PRICE_RANGE_MAX - PRICE_RANGE_MIN)) * 100;
  const maxPercent = ((safeMax - PRICE_RANGE_MIN) / (PRICE_RANGE_MAX - PRICE_RANGE_MIN)) * 100;

  const updateDraftRange = (nextMin: number, nextMax: number) => {
    const clampedMin = clamp(nextMin, PRICE_RANGE_MIN, PRICE_RANGE_MAX);
    const clampedMax = clamp(nextMax, PRICE_RANGE_MIN, PRICE_RANGE_MAX);
    const nextRange = {
      min: Math.min(clampedMin, clampedMax),
      max: Math.max(clampedMin, clampedMax),
    };

    setDraftRange((currentRange) =>
      areSameRange(currentRange, nextRange) ? currentRange : nextRange,
    );
  };

  const handleMinChange = (value: number) => {
    updateDraftRange(Math.min(value, safeMax), safeMax);
  };

  const handleMaxChange = (value: number) => {
    updateDraftRange(safeMin, Math.max(value, safeMin));
  };

  const renderCurrency = () =>
    lang === 'fa' ? (
      <TomanIcon className="h-4 w-4 shrink-0 first-text-color-for-paragraph" aria-hidden="true" />
    ) : (
      <span className="shrink-0 text-xs font-f-sbold first-text-color-for-paragraph">
        {labels.currency}
      </span>
    );

  return (
    <div className="space-y-4 px-1 py-1">
      <div className="space-y-3">
        {[
          { id: 'from', label: labels.from, value: safeMin, ariaLabel: labels.min },
          { id: 'to', label: labels.to, value: safeMax, ariaLabel: labels.max },
        ].map((item) => (
          <label key={item.id} className="block min-w-0">
            <span className="mb-1 block text-xs font-f-sbold leading-5 first-text-color-for-paragraph">
              {item.label}
            </span>
            <span className="flex min-w-0 items-center gap-2 border-b border-first-100 pb-1 transition-colors focus-within:border-first">
              <input
                type="text"
                readOnly
                tabIndex={-1}
                aria-label={item.ariaLabel}
                value={formatPrice(item.value, 'IRT', lang)}
                className="min-w-0 flex-1 border-0 bg-transparent p-0 text-sm font-f-sbold leading-7 first-text-color outline-none"
              />
              {renderCurrency()}
            </span>
          </label>
        ))}
      </div>

      <div dir="ltr" className="relative h-6">
        <div className="absolute inset-x-0 top-1/2 h-1 -translate-y-1/2 rounded-full bg-first-100" />
        <div
          className="absolute top-1/2 h-1 -translate-y-1/2 rounded-full bg-secound"
          style={{
            left: `${minPercent}%`,
            right: `${100 - maxPercent}%`,
          }}
        />
        <input
          type="range"
          min={PRICE_RANGE_MIN}
          max={PRICE_RANGE_MAX}
          step={PRICE_RANGE_STEP}
          value={safeMin}
          aria-label={labels.min}
          onChange={(event) => handleMinChange(Number(event.target.value))}
          className={cn('price-range-input z-20', safeMin > PRICE_RANGE_MAX * 0.88 && 'z-40')}
        />
        <input
          type="range"
          min={PRICE_RANGE_MIN}
          max={PRICE_RANGE_MAX}
          step={PRICE_RANGE_STEP}
          value={safeMax}
          aria-label={labels.max}
          onChange={(event) => handleMaxChange(Number(event.target.value))}
          className="price-range-input z-30"
        />
      </div>
    </div>
  );
}

function ShowcaseOptions({
  showcases,
  isShowcasesLoading,
  showcaseIds,
  toggleShowcaseId,
  emptyLabel,
}: ShowcaseOptionsProps) {
  const visibleShowcases = useMemo(
    () =>
      (showcases ?? [])
        .filter((showcase) => showcase.isPublished)
        .slice()
        .sort((a, b) => a.displayOrder - b.displayOrder),
    [showcases],
  );

  if (isShowcasesLoading) {
    return <FilterItemsSkeleton rows={4} />;
  }

  if (visibleShowcases.length === 0) {
    return <p className="px-1 py-2 text-sm first-text-color-for-paragraph">{emptyLabel}</p>;
  }

  return (
    <div className="min-w-0 max-w-full space-y-1 overflow-y-auto overflow-x-hidden pe-1">
      {visibleShowcases.map((showcase) => {
        const id = String(showcase.id);
        const checked = showcaseIds.includes(id);
        const title = showcase.translation?.title || showcase.slug;
        const itemCount = showcase.items?.length ?? 0;

        return (
          <label
            key={showcase.id}
            className={cn(
              'group flex w-full min-w-0 max-w-full cursor-pointer select-none items-center gap-2 rounded-xl px-2 py-2 text-sm transition-colors hover:bg-first/5',
              checked && 'bg-first/10',
            )}
          >
            <input
              type="checkbox"
              checked={checked}
              onChange={() => toggleShowcaseId(id)}
              className="peer sr-only"
            />

            <span
              className={cn(
                'flex h-5 w-5 shrink-0 items-center justify-center rounded-md border transition-colors',
                checked
                  ? 'border-first bg-first text-white'
                  : 'border-first-100 bg-color-for-layer-on-body text-transparent group-hover:border-first/40 group-hover:bg-first/5',
              )}
              aria-hidden="true"
            >
              <Check className="h-3.5 w-3.5" strokeWidth={2.2} />
            </span>

            <span
              className={cn(
                'min-w-0 flex-1 truncate first-text-color-for-paragraph',
                checked && 'font-f-sbold first-text-color',
              )}
            >
              {title}
            </span>

            {itemCount > 0 ? (
              <span className="shrink-0 rounded-full bg-first/10 px-2 py-0.5 text-[11px] font-f-sbold text-first">
                {itemCount}
              </span>
            ) : null}
          </label>
        );
      })}
    </div>
  );
}

export default function FiltersSidebar({
  categories,
  isCategoriesLoading,
  showcases,
  isShowcasesLoading,
  expanded,
  toggleSection,
  hasOffer,
  setHasOffer,
  hasActiveFilters,
  handleClearFilters,
  className,
  panelClassName,
  sticky = true,
}: Props) {
  const { t } = useTranslation();
  const dir = useLangStore((s) => s.dir);
  const lang = useLangStore((s) => s.lang);
  const minPrice = useShopStore((s) => s.minPrice);
  const maxPrice = useShopStore((s) => s.maxPrice);
  const setPriceRange = useShopStore((s) => s.setPriceRange);
  const showcaseIds = useShopStore((s) => s.showcaseIds);
  const toggleShowcaseId = useShopStore((s) => s.toggleShowcaseId);

  return (
    <aside className={cn('w-full', className)}>
      <div
        dir={dir}
        className={cn(
          'rounded-2xl border border-first-100/80 bg-color-for-layer-on-body p-4 shadow-[0_8px_24px_rgba(20,29,38,0.05)]',
          sticky && 'lg:sticky lg:top-6',
          panelClassName,
        )}
      >
        <div className="mb-4 flex items-center justify-between gap-2">
          <h2 className="font-s-bold first-text-color">{t('productsFilter.filters')}</h2>

          {hasActiveFilters && (
            <button
              type="button"
              onClick={handleClearFilters}
              className="flex items-center gap-1 rounded-lg px-2 py-1 text-xs first-text-color-for-paragraph transition-colors hover:bg-first/10 hover:text-first"
            >
              <X className="h-3 w-3" />
              {t('productsFilter.clear')}
            </button>
          )}
        </div>

        <div className="space-y-3">
          <FilterSection
            title={t('productsFilter.categories')}
            isExpanded={expanded.categories}
            onToggle={() => toggleSection('categories')}
            contentClassName="max-h-[30dvh] overflow-y-auto overflow-x-hidden lg:max-h-none"
          >
            {isCategoriesLoading ? (
              <FilterItemsSkeleton rows={6} />
            ) : (
              <CategoryTree categories={categories} />
            )}
          </FilterSection>

          <FilterSection
            title={t('productsFilter.priceRange')}
            isExpanded={expanded.price}
            onToggle={() => toggleSection('price')}
          >
            <PriceRangeFilter
              lang={lang}
              minPrice={minPrice}
              maxPrice={maxPrice}
              setPriceRange={setPriceRange}
              labels={{
                from: t('productsFilter.fromPrice'),
                to: t('productsFilter.toPrice'),
                min: t('productsFilter.minPrice'),
                max: t('productsFilter.maxPrice'),
                currency: t('productsFilter.priceCurrency'),
              }}
            />
          </FilterSection>

          <FilterSection
            title={t('productsFilter.showcases')}
            isExpanded={expanded.showcases}
            onToggle={() => toggleSection('showcases')}
            contentClassName="max-h-[15rem] overflow-y-auto overflow-x-hidden lg:max-h-none"
          >
            <ShowcaseOptions
              showcases={showcases}
              isShowcasesLoading={isShowcasesLoading}
              showcaseIds={showcaseIds}
              toggleShowcaseId={toggleShowcaseId}
              emptyLabel={t('productsFilter.noShowcases')}
            />
          </FilterSection>

          <label className="group flex cursor-pointer select-none items-center justify-between gap-3 rounded-xl border border-first-100/70 px-3 py-3 text-sm first-text-color-for-paragraph transition-colors hover:border-first/30 hover:bg-first/5">
            <span>{t('productsFilter.onlyDiscountedProducts')}</span>
            <input
              type="checkbox"
              checked={Boolean(hasOffer)}
              onChange={(e) => setHasOffer(e.target.checked ? true : undefined)}
              className="peer sr-only"
            />
            <span
              className={cn(
                'relative h-6 w-11 shrink-0 rounded-full transition-colors',
                hasOffer ? 'bg-first' : 'bg-first-100 group-hover:bg-first/20',
              )}
              aria-hidden="true"
            >
              <span
                className={cn(
                  'absolute top-1 h-4 w-4 rounded-full bg-color-for-layer-on-body shadow-sm transition-transform',
                  dir === 'rtl'
                    ? hasOffer
                      ? 'right-6'
                      : 'right-1'
                    : hasOffer
                      ? 'left-6'
                      : 'left-1',
                )}
              />
            </span>
          </label>
        </div>
      </div>
    </aside>
  );
}
