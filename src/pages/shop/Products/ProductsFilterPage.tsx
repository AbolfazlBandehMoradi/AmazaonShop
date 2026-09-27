import { ArrowDownWideNarrow, ChevronDown, SlidersHorizontal } from 'lucide-react';
import { useTranslation } from '@/i18n/useTranslation';
import { useLocation, useSearchParams } from 'react-router-dom';
import { useInfiniteProducts } from '@/hooks/useInfiniteProducts';
import { useEffect, useId, useMemo, useRef, useState } from 'react';
import { useShopStore } from '@/stores/productsFilterStore';
import useCategories from '@/hooks/useCategories';
import useShowcases from '@/hooks/useShowcases';
import { useLangStore } from '@/stores/languageStore';
import { areSameStrings, parseCategoryIdsParam, parseHasOfferParam } from '@/utils/urlHelpers';
import { FilterPanelSkeleton, ProductsContentSkeleton } from './sections/FilterPageSkeletons';
import FiltersSidebar from './sections/FiltersSidebar';
import Spinner from '@/components/ui/Spinner';
import ApiError from '@/pages/error/ApiError';
import { type CatalogProduct } from '@/types/productView.types';
import ProductCard from './sections/ProductCard';
import MobileFiltersDrawer from './sections/MobileFiltersDrawer';
import { cn } from '@/utils/cn';
import notFoundImage from '@/assets/Images/Shop/Not found.png';
import notFoundImageEn from '@/assets/Images/Shop/Not found En.png';
import ProductsSortControls, {
  DEFAULT_PRODUCT_SORT_BY,
  PRODUCT_SORT_FIELDS,
  getActiveProductSortOption,
  getInitialProductSortDescending,
  getProductSortOptions,
  type ProductSortOption,
} from './sections/ProductsSortControls';

const GRID_SKELETON_COUNT = 12;
const MAX_GRID_SKELETON_COUNT = 12;
const MANAGED_QUERY_KEYS = [
  'q',
  'search',
  'categoryIds',
  'showcaseIds',
  'minPrice',
  'maxPrice',
  'hasOffer',
  'sortBy',
  'sortDescending',
] as const;

type ShopFiltersSnapshot = {
  search?: string;
  categoryIds: string[];
  showcaseIds: string[];
  minPrice?: number;
  maxPrice?: number;
  hasOffer?: boolean;
  sortBy?: string;
  sortDescending?: boolean;
};

const normalizeSearchValue = (value?: string) => value?.trim() || undefined;

const normalizeCategoryIds = (ids: string[]) =>
  Array.from(new Set(ids.map((item) => item.trim()).filter(Boolean))).sort();

const normalizeHasOffer = (value?: boolean) => (value ? true : undefined);
const productSortFieldSet = new Set<string>(PRODUCT_SORT_FIELDS);
const normalizeSortBy = (value?: string) => {
  const nextValue = value?.trim().toLowerCase();
  return nextValue && productSortFieldSet.has(nextValue) ? nextValue : DEFAULT_PRODUCT_SORT_BY;
};
const normalizeSortDescending = (sortBy: string, value?: boolean) =>
  typeof value === 'boolean' ? value : getInitialProductSortDescending(sortBy);
const normalizePriceValue = (value?: number): number | undefined => {
  if (typeof value !== 'number' || !Number.isFinite(value) || value <= 0) {
    return undefined;
  }

  return Math.round(value);
};

const normalizePriceRange = (minPrice?: number, maxPrice?: number) => {
  const nextMinPrice = normalizePriceValue(minPrice);
  const nextMaxPrice = normalizePriceValue(maxPrice);

  if (
    typeof nextMinPrice === 'number' &&
    typeof nextMaxPrice === 'number' &&
    nextMinPrice > nextMaxPrice
  ) {
    return {
      minPrice: nextMaxPrice,
      maxPrice: nextMinPrice,
    };
  }

  return {
    minPrice: nextMinPrice,
    maxPrice: nextMaxPrice,
  };
};

const parsePriceParam = (value: string | null) => {
  if (!value) return undefined;

  const parsedValue = Number(value);
  return normalizePriceValue(parsedValue);
};

const normalizeFilters = (filters: ShopFiltersSnapshot): ShopFiltersSnapshot => {
  const sortBy = normalizeSortBy(filters.sortBy);
  const priceRange = normalizePriceRange(filters.minPrice, filters.maxPrice);

  return {
    search: normalizeSearchValue(filters.search),
    categoryIds: normalizeCategoryIds(filters.categoryIds),
    showcaseIds: normalizeCategoryIds(filters.showcaseIds),
    minPrice: priceRange.minPrice,
    maxPrice: priceRange.maxPrice,
    hasOffer: normalizeHasOffer(filters.hasOffer),
    sortBy,
    sortDescending: normalizeSortDescending(sortBy, filters.sortDescending),
  };
};

const areSameFilters = (a: ShopFiltersSnapshot, b: ShopFiltersSnapshot) => {
  const normalizedA = normalizeFilters(a);
  const normalizedB = normalizeFilters(b);

  return (
    normalizedA.search === normalizedB.search &&
    normalizedA.minPrice === normalizedB.minPrice &&
    normalizedA.maxPrice === normalizedB.maxPrice &&
    normalizedA.hasOffer === normalizedB.hasOffer &&
    normalizedA.sortBy === normalizedB.sortBy &&
    normalizedA.sortDescending === normalizedB.sortDescending &&
    areSameStrings(normalizedA.categoryIds, normalizedB.categoryIds) &&
    areSameStrings(normalizedA.showcaseIds, normalizedB.showcaseIds)
  );
};

const parseFiltersFromSearch = (searchValue: string): ShopFiltersSnapshot => {
  const params = new URLSearchParams(searchValue);
  const parsedHasOffer = parseHasOfferParam(params.get('hasOffer'));
  const sortBy = normalizeSortBy(params.get('sortBy') ?? undefined);
  const sortDescendingParam = params.get('sortDescending');
  const sortDescending =
    sortDescendingParam === null
      ? undefined
      : sortDescendingParam === 'true' || sortDescendingParam === '1';

  return normalizeFilters({
    search: params.get('search') ?? params.get('q') ?? undefined,
    categoryIds: parseCategoryIdsParam(params.get('categoryIds')),
    showcaseIds: parseCategoryIdsParam(params.get('showcaseIds')),
    minPrice: parsePriceParam(params.get('minPrice')),
    maxPrice: parsePriceParam(params.get('maxPrice')),
    hasOffer: parsedHasOffer === false ? undefined : parsedHasOffer,
    sortBy,
    sortDescending,
  });
};

const buildSearchParams = (
  currentSearch: string,
  filters: ShopFiltersSnapshot,
): URLSearchParams => {
  const normalizedFilters = normalizeFilters(filters);
  const params = new URLSearchParams(currentSearch);

  MANAGED_QUERY_KEYS.forEach((key) => params.delete(key));

  if (normalizedFilters.search) {
    params.set('search', normalizedFilters.search);
  }

  if (normalizedFilters.categoryIds.length > 0) {
    params.set('categoryIds', normalizedFilters.categoryIds.join(','));
  }

  if (normalizedFilters.showcaseIds.length > 0) {
    params.set('showcaseIds', normalizedFilters.showcaseIds.join(','));
  }

  if (typeof normalizedFilters.minPrice === 'number') {
    params.set('minPrice', String(normalizedFilters.minPrice));
  }

  if (typeof normalizedFilters.maxPrice === 'number') {
    params.set('maxPrice', String(normalizedFilters.maxPrice));
  }

  if (normalizedFilters.hasOffer) {
    params.set('hasOffer', 'true');
  }

  if (normalizedFilters.sortBy) {
    params.set('sortBy', normalizedFilters.sortBy);
  }

  return params;
};

const toStableQueryString = (params: URLSearchParams): string => {
  const snapshot = new URLSearchParams(params);
  snapshot.sort();

  return snapshot.toString();
};

type MobileSortSelectProps = {
  label: string;
  listboxId: string;
  options: ProductSortOption[];
  activeOption?: ProductSortOption;
  activeIndex: number;
  highlightedIndex: number;
  isOpen: boolean;
  onToggle: () => void;
  onClose: () => void;
  onHighlight: (index: number) => void;
  onSelect: (option: ProductSortOption) => void;
};

function MobileSortSelect({
  label,
  listboxId,
  options,
  activeOption,
  activeIndex,
  highlightedIndex,
  isOpen,
  onToggle,
  onClose,
  onHighlight,
  onSelect,
}: MobileSortSelectProps) {
  const handleKeyDown = (event: React.KeyboardEvent<HTMLButtonElement>) => {
    if (event.key === 'Escape') {
      onClose();
      return;
    }

    if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
      event.preventDefault();

      if (!isOpen) {
        onHighlight(activeIndex);
        onToggle();
        return;
      }

      const direction = event.key === 'ArrowDown' ? 1 : -1;
      onHighlight((highlightedIndex + direction + options.length) % options.length);
      return;
    }

    if ((event.key === 'Enter' || event.key === ' ') && isOpen) {
      event.preventDefault();
      const highlightedOption = options[highlightedIndex];

      if (highlightedOption) {
        onSelect(highlightedOption);
      }
    }
  };

  return (
    <div
      className="relative min-w-0 flex-1"
      onBlur={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget as Node | null)) {
          onClose();
        }
      }}
    >
      <button
        type="button"
        role="combobox"
        aria-controls={listboxId}
        aria-expanded={isOpen}
        aria-haspopup="listbox"
        onClick={onToggle}
        onKeyDown={handleKeyDown}
        className="flex min-h-12 w-full items-center justify-between gap-3 rounded-2xl border border-first/20 bg-color-for-layer-on-body px-3 text-sm font-f-sbold text-first outline-none transition-colors hover:bg-first/5 focus-visible:border-first/60 focus-visible:ring-3 focus-visible:ring-first/10"
      >
        <span className="flex min-w-0 items-center gap-2">
          <ArrowDownWideNarrow className="h-4.5 w-4.5 shrink-0" strokeWidth={1.8} aria-hidden="true" />
          <span className="min-w-0 truncate">{label}</span>
        </span>
        <ChevronDown
          className={cn('h-4 w-4 shrink-0 transition-transform', isOpen && 'rotate-180')}
          strokeWidth={2}
          aria-hidden="true"
        />
      </button>

      {isOpen ? (
        <div
          id={listboxId}
          role="listbox"
          aria-label={label}
          className="absolute inset-x-0 top-full z-60 mt-2 max-h-60 overflow-y-auto rounded-2xl border border-first/15 bg-color-for-layer-on-body p-1.5 shadow-[0_16px_35px_rgba(20,29,38,0.18)]"
        >
          {options.map((option, index) => {
            const isSelected = option.sortBy === activeOption?.sortBy;
            const isHighlighted = index === highlightedIndex;

            return (
              <button
                key={option.id}
                type="button"
                role="option"
                aria-selected={isSelected}
                onMouseEnter={() => onHighlight(index)}
                onClick={() => onSelect(option)}
                className={cn(
                  'flex w-full items-center rounded-xl px-3 py-2.5 text-start text-sm first-text-color transition-colors',
                  isHighlighted && 'bg-first/10 text-first',
                  isSelected && 'bg-secound text-white! hover:bg-secound-600',
                )}
              >
                <span className="truncate">{option.label}</span>
              </button>
            );
          })}
        </div>
      ) : null}
    </div>
  );
}

export default function ProductsFilterPage() {
  const [, setSearchParams] = useSearchParams();
  const location = useLocation();
  const {
    data: categories,
    isLoading: isCategoriesLoading,
    isError: isCategoriesError,
  } = useCategories();
  const { data: showcases, isLoading: isShowcasesLoading } = useShowcases();
  const { t } = useTranslation();
  const lang = useLangStore((s) => s.lang);
  const dir = useLangStore((s) => s.dir);

  const search = useShopStore((s) => s.search);
  const categoryIds = useShopStore((s) => s.categoryIds);
  const showcaseIds = useShopStore((s) => s.showcaseIds);
  const minPrice = useShopStore((s) => s.minPrice);
  const maxPrice = useShopStore((s) => s.maxPrice);
  const hasOffer = useShopStore((s) => s.hasOffer);
  const setHasOffer = useShopStore((s) => s.setHasOffer);
  const sortBy = useShopStore((s) => s.sortBy);
  const sortDescending = useShopStore((s) => s.sortDescending);
  const setSort = useShopStore((s) => s.setSort);
  const setFilters = useShopStore((s) => s.setFilters);
  const clearFilters = useShopStore((s) => s.clearFilters);

  const [isUrlHydrated, setIsUrlHydrated] = useState(false);
  const [componentError, setComponentError] = useState<string | null>(null);
  const [isMobileFiltersOpen, setIsMobileFiltersOpen] = useState(false);
  const [isMobileSortOpen, setIsMobileSortOpen] = useState(false);
  const [highlightedSortIndex, setHighlightedSortIndex] = useState(0);
  const mobileSortListboxId = useId();
  const syncedQueryRef = useRef<string>('');

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    isFetching,
    isError: isProductsError,
  } = useInfiniteProducts();

  const products = data?.pages.flatMap((page) => page.products) ?? [];

  const normalizedActiveFilters = useMemo<ShopFiltersSnapshot>(
    () =>
      normalizeFilters({
        search,
        categoryIds,
        showcaseIds,
        minPrice,
        maxPrice,
        hasOffer,
        sortBy,
        sortDescending,
      }),
    [search, categoryIds, showcaseIds, minPrice, maxPrice, hasOffer, sortBy, sortDescending],
  );

  const hasProducts = products.length > 0;
  const showProductsSkeleton = !hasProducts && (isLoading || isFetching) && !isFetchingNextPage;
  const skeletonCount = Math.min(
    Math.max(products.length, GRID_SKELETON_COUNT),
    MAX_GRID_SKELETON_COUNT,
  );

  const loadMoreRef = useRef<HTMLDivElement | null>(null);
  const hasCompletedInitialLoadRef = useRef(false);

  useEffect(() => {
    if (!isLoading) {
      hasCompletedInitialLoadRef.current = true;
    }
  }, [isLoading]);

  const showInitialPageSkeleton = !hasCompletedInitialLoadRef.current && isLoading;

  useEffect(() => {
    try {
      const nextFilters = parseFiltersFromSearch(location.search);

      const currentFilters = normalizeFilters({
        search,
        categoryIds,
        showcaseIds,
        minPrice,
        maxPrice,
        hasOffer,
        sortBy,
        sortDescending,
      });

      if (!areSameFilters(nextFilters, currentFilters)) {
        setFilters(nextFilters);
      }

      syncedQueryRef.current = toStableQueryString(new URLSearchParams(location.search));

      setIsUrlHydrated(true);
    } catch (err: unknown) {
      console.error('Error hydrating URL params:', err);

      setComponentError(
        err instanceof Error ? err.message : t('productsFilter.failedToParseUrlParams'),
      );
    }
  }, [location.search]);

  useEffect(() => {
    try {
      if (!isUrlHydrated) return;

      // IMPORTANT:
      // DON'T build from location.search
      const nextParams = buildSearchParams('', normalizedActiveFilters);

      const nextStableQuery = toStableQueryString(nextParams);

      // Prevent loops
      if (nextStableQuery === syncedQueryRef.current) {
        return;
      }

      syncedQueryRef.current = nextStableQuery;

      setSearchParams(nextParams, {
        replace: true,
      });
    } catch (err: unknown) {
      console.error('Error updating URL:', err);

      setComponentError(err instanceof Error ? err.message : t('productsFilter.failedToUpdateUrl'));
    }
  }, [normalizedActiveFilters, isUrlHydrated]);

  useEffect(() => {
    if (!hasNextPage || !loadMoreRef.current) {
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !isFetchingNextPage) {
          void fetchNextPage();
        }
      },
      { rootMargin: '200px' },
    );

    observer.observe(loadMoreRef.current);
    return () => observer.disconnect();
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  const handleClearFilters = () => {
    clearFilters();
  };

  const [expanded, setExpanded] = useState<Record<string, boolean>>({
    categories: true,
    price: true,
    showcases: true,
  });

  const toggleSection = (key: string) => setExpanded((prev) => ({ ...prev, [key]: !prev[key] }));

  const hasActiveFilters =
    normalizedActiveFilters.categoryIds.length > 0 ||
    normalizedActiveFilters.showcaseIds.length > 0 ||
    typeof normalizedActiveFilters.minPrice === 'number' ||
    typeof normalizedActiveFilters.maxPrice === 'number' ||
    Boolean(normalizedActiveFilters.search) ||
    Boolean(normalizedActiveFilters.hasOffer);

  const sortOptions = useMemo(() => getProductSortOptions(lang), [lang]);
  const activeSortOption = useMemo(
    () => getActiveProductSortOption(sortOptions, sortBy) ?? sortOptions[0],
    [sortOptions, sortBy],
  );
  const activeSortIndex = Math.max(
    0,
    sortOptions.findIndex((option) => option.sortBy === activeSortOption?.sortBy),
  );
  const mobileSortLabel =
    lang === 'fa' ? '\u0645\u0631\u062a\u0628\u200c\u0633\u0627\u0632\u06cc' : 'Sort';
  const emptyStateImage = lang === 'en' ? notFoundImageEn : notFoundImage;

  const handleSortChange = (nextSortBy?: string, nextSortDescending?: boolean) => {
    setSort(nextSortBy, nextSortDescending);
    setIsMobileSortOpen(false);
  };

  const handleMobileSortToggle = () => {
    setHighlightedSortIndex(activeSortIndex);
    setIsMobileSortOpen((isOpen) => !isOpen);
  };

  const handleMobileSortSelect = (option: ProductSortOption) => {
    handleSortChange(option.sortBy, getInitialProductSortDescending(option.sortBy));
  };

  const getImageUrl = (product: CatalogProduct): string | null => {
    if (!product.mainImage?.filePath) {
      return null;
    }

    const base = import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:5299';
    return product.mainImage.filePath.startsWith('http')
      ? product.mainImage.filePath
      : `${base}${product.mainImage.filePath}`;
  };

  if (componentError || isCategoriesError || isProductsError) {
    return <ApiError onRetry={() => window.location.reload()} />;
  }

  if (showInitialPageSkeleton) {
    return (
      <main dir={dir} className="page-container page-section">
        <div className="grid gap-6 lg:grid-cols-[minmax(220px,260px)_minmax(0,1fr)] lg:items-start">
          <aside className="hidden lg:block">
            <FilterPanelSkeleton />
          </aside>
          <section className="min-w-0">
            <ProductsContentSkeleton count={skeletonCount} includeSortBar />
          </section>
        </div>
      </main>
    );
  }

  return (
    <main dir={dir} className="page-container page-section">
      <div className="mb-4 lg:hidden">
        <div className="flex items-center justify-between gap-3">
          <button
            type="button"
            onClick={() => setIsMobileFiltersOpen(true)}
            className={cn(
              'inline-flex min-h-12 min-w-0 flex-1 items-center justify-center gap-2 rounded-2xl px-3 text-sm font-f-sbold text-white transition-colors',
              hasActiveFilters ? 'bg-secound hover:bg-secound-600' : 'bg-first hover:bg-first-600',
            )}
          >
            <SlidersHorizontal className="h-5 w-5" strokeWidth={1.8} aria-hidden="true" />
            <span>{t('productsFilter.filters')}</span>
          </button>

          <MobileSortSelect
            label={mobileSortLabel}
            listboxId={mobileSortListboxId}
            options={sortOptions}
            activeOption={activeSortOption}
            activeIndex={activeSortIndex}
            highlightedIndex={highlightedSortIndex}
            isOpen={isMobileSortOpen}
            onToggle={handleMobileSortToggle}
            onClose={() => setIsMobileSortOpen(false)}
            onHighlight={setHighlightedSortIndex}
            onSelect={handleMobileSortSelect}
          />
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-[minmax(220px,260px)_minmax(0,1fr)] lg:items-start">
        <FiltersSidebar
          categories={categories}
          isCategoriesLoading={isCategoriesLoading}
          showcases={showcases}
          isShowcasesLoading={isShowcasesLoading}
          expanded={expanded}
          toggleSection={toggleSection}
          hasOffer={hasOffer}
          setHasOffer={setHasOffer}
          hasActiveFilters={hasActiveFilters}
          handleClearFilters={handleClearFilters}
          className="hidden lg:block"
        />

        <section className="min-w-0">
          <ProductsSortControls
            lang={lang}
            sortBy={sortBy}
            sortDescending={sortDescending}
            onChange={handleSortChange}
            className="mb-4 hidden lg:flex"
          />

          {showProductsSkeleton ? (
            <ProductsContentSkeleton count={skeletonCount} />
          ) : hasProducts ? (
            <div className="grid grid-cols-1 items-stretch gap-4 min-[520px]:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4">
              {products.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  lang={lang}
                  getImageUrl={getImageUrl}
                />
              ))}
            </div>
          ) : (
            <div className="flex justify-center rounded-xl border border-first-100/70 bg-color-for-layer-on-body p-6 sm:p-8">
              <img
                src={emptyStateImage}
                alt={t('product.notFound')}
                className="h-auto w-full max-w-xs object-contain sm:max-w-md lg:max-w-xl"
              />
            </div>
          )}

          <div ref={loadMoreRef} className="mt-4 flex h-16 justify-center">
            {isFetchingNextPage && <Spinner />}
          </div>
        </section>
      </div>

      <MobileFiltersDrawer
        isOpen={isMobileFiltersOpen}
        onClose={() => setIsMobileFiltersOpen(false)}
        categories={categories}
        isCategoriesLoading={isCategoriesLoading}
        showcases={showcases}
        isShowcasesLoading={isShowcasesLoading}
        expanded={expanded}
        toggleSection={toggleSection}
        hasOffer={hasOffer}
        setHasOffer={setHasOffer}
        hasActiveFilters={hasActiveFilters}
        handleClearFilters={handleClearFilters}
        dir={dir}
      />
    </main>
  );
}
