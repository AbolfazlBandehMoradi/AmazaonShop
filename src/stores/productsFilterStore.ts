// stores/productsFilterStore.ts
import { create } from 'zustand';

const DEFAULT_PRODUCT_SORT_BY = 'viewcount';

const normalizeIds = (ids: string[]): string[] =>
  Array.from(new Set(ids.map((id) => id.trim()).filter(Boolean))).sort();

const areSameIds = (a: string[], b: string[]): boolean =>
  a.length === b.length && a.every((item, index) => item === b[index]);

const normalizePrice = (value?: number): number | undefined => {
  if (typeof value !== 'number' || !Number.isFinite(value) || value <= 0) {
    return undefined;
  }

  return Math.round(value);
};

const normalizePriceRange = (minPrice?: number, maxPrice?: number) => {
  const nextMinPrice = normalizePrice(minPrice);
  const nextMaxPrice = normalizePrice(maxPrice);

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

const getInitialProductSortDescending = (sortBy?: string) => sortBy !== 'name';

interface ShopStore {
  // Filters
  search?: string;
  categoryIds: string[];
  showcaseIds: string[];
  minPrice?: number;
  maxPrice?: number;
  hasOffer?: boolean;
  status?: string;
  isFeatured?: boolean;
  sortBy?: string;
  sortDescending?: boolean;

  // UI
  viewMode: 'grid' | 'list';

  // Actions
  setSearch: (value?: string) => void;
  toggleCategoryId: (id: string) => void;
  setCategoryIds: (ids: string[]) => void;
  toggleShowcaseId: (id: string) => void;
  setShowcaseIds: (ids: string[]) => void;
  setPriceRange: (minPrice?: number, maxPrice?: number) => void;
  setHasOffer: (value?: boolean) => void;
  setSort: (sortBy?: string, descending?: boolean) => void;
  setFeatured: (value?: boolean) => void;
  setViewMode: (mode: 'grid' | 'list') => void;
  setFilters: (filters: {
    search?: string;
    categoryIds: string[];
    showcaseIds: string[];
    minPrice?: number;
    maxPrice?: number;
    hasOffer?: boolean;
    sortBy?: string;
    sortDescending?: boolean;
  }) => void;
  clearFilters: () => void;
}

export const useShopStore = create<ShopStore>((set) => ({
  // Initial state
  search: undefined,
  categoryIds: [],
  showcaseIds: [],
  minPrice: undefined,
  maxPrice: undefined,
  hasOffer: undefined,
  status: 'Active',
  isFeatured: undefined,
  sortBy: DEFAULT_PRODUCT_SORT_BY,
  sortDescending: getInitialProductSortDescending(DEFAULT_PRODUCT_SORT_BY),
  viewMode: 'grid',

  setSearch: (value) =>
    set((state) => {
      const nextSearch = value?.trim() || undefined;
      return state.search === nextSearch ? state : { search: nextSearch };
    }),

  setCategoryIds: (ids) =>
    set((state) => {
      const nextCategoryIds = normalizeIds(ids);
      return areSameIds(state.categoryIds, nextCategoryIds)
        ? state
        : { categoryIds: nextCategoryIds };
    }),

  setShowcaseIds: (ids) =>
    set((state) => {
      const nextShowcaseIds = normalizeIds(ids);
      return areSameIds(state.showcaseIds, nextShowcaseIds)
        ? state
        : { showcaseIds: nextShowcaseIds };
    }),

  setPriceRange: (minPrice, maxPrice) =>
    set((state) => {
      const nextRange = normalizePriceRange(minPrice, maxPrice);

      return state.minPrice === nextRange.minPrice && state.maxPrice === nextRange.maxPrice
        ? state
        : nextRange;
    }),

  setHasOffer: (value) =>
    set((state) => {
      const nextHasOffer = value ? true : undefined;
      return state.hasOffer === nextHasOffer ? state : { hasOffer: nextHasOffer };
    }),

  toggleCategoryId: (id) =>
    set((state) => {
      const nextCategoryIds = normalizeIds(
        state.categoryIds.includes(id)
          ? state.categoryIds.filter((c) => c !== id)
          : [...state.categoryIds, id],
      );

      return areSameIds(state.categoryIds, nextCategoryIds)
        ? state
        : { categoryIds: nextCategoryIds };
    }),

  toggleShowcaseId: (id) =>
    set((state) => {
      const nextShowcaseIds = normalizeIds(
        state.showcaseIds.includes(id)
          ? state.showcaseIds.filter((showcaseId) => showcaseId !== id)
          : [...state.showcaseIds, id],
      );

      return areSameIds(state.showcaseIds, nextShowcaseIds)
        ? state
        : { showcaseIds: nextShowcaseIds };
    }),

  setFilters: (filters) =>
    set((state) => {
      const nextSearch = filters.search?.trim() || undefined;
      const nextCategoryIds = normalizeIds(filters.categoryIds);
      const nextShowcaseIds = normalizeIds(filters.showcaseIds);
      const nextRange = normalizePriceRange(filters.minPrice, filters.maxPrice);
      const nextHasOffer = filters.hasOffer ? true : undefined;
      const nextSortBy = filters.sortBy?.trim() || DEFAULT_PRODUCT_SORT_BY;
      const nextSortDescending =
        typeof filters.sortDescending === 'boolean'
          ? filters.sortDescending
          : getInitialProductSortDescending(nextSortBy);

      if (
        state.search === nextSearch &&
        state.minPrice === nextRange.minPrice &&
        state.maxPrice === nextRange.maxPrice &&
        state.hasOffer === nextHasOffer &&
        state.sortBy === nextSortBy &&
        state.sortDescending === nextSortDescending &&
        areSameIds(state.categoryIds, nextCategoryIds) &&
        areSameIds(state.showcaseIds, nextShowcaseIds)
      ) {
        return state;
      }

      return {
        search: nextSearch,
        categoryIds: nextCategoryIds,
        showcaseIds: nextShowcaseIds,
        minPrice: nextRange.minPrice,
        maxPrice: nextRange.maxPrice,
        hasOffer: nextHasOffer,
        sortBy: nextSortBy,
        sortDescending: nextSortDescending,
      };
    }),

  setSort: (sortBy = DEFAULT_PRODUCT_SORT_BY, descending) =>
    set(() => ({
      sortBy,
      sortDescending:
        typeof descending === 'boolean' ? descending : getInitialProductSortDescending(sortBy),
    })),

  setFeatured: (value) => set(() => ({ isFeatured: value })),

  setViewMode: (mode) => set(() => ({ viewMode: mode })),

  clearFilters: () =>
    set(() => ({
      search: undefined,
      categoryIds: [],
      showcaseIds: [],
      minPrice: undefined,
      maxPrice: undefined,
      hasOffer: undefined,
      isFeatured: undefined,
    })),
}));
