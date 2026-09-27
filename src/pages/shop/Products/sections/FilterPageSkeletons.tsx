import { Skeleton } from "@/components/ui/skeleton";

export const FilterItemsSkeleton = ({ rows = 7 }: { rows?: number }) => (
  <div className="space-y-2 px-1 py-1">
    {Array.from({ length: rows }).map((_, index) => (
      <div key={`filter-row-${index}`} className="flex items-center gap-2 rounded-xl px-1 py-1">
        <Skeleton className="h-5 w-5 rounded-md bg-first-100" />
        <Skeleton className="h-4 flex-1 bg-first-100" />
      </div>
    ))}
  </div>
);

export const FilterPanelSkeleton = () => (
  <div className="rounded-2xl border border-first-100/70 bg-color-for-layer-on-body p-4 shadow-sm lg:sticky lg:top-6">
    <div className="mb-4 flex items-center justify-between">
      <Skeleton className="h-6 w-24 bg-first-100" />
      <Skeleton className="h-4 w-14 bg-first-100" />
    </div>

    <div className="space-y-3">
      <div className="rounded-xl border border-first-100/70">
        <div className="border-b border-first-100/70 p-3">
          <Skeleton className="h-5 w-28 bg-first-100" />
        </div>
        <FilterItemsSkeleton rows={5} />
      </div>

      <div className="rounded-xl border border-first-100/70 p-3">
        <Skeleton className="mb-4 h-5 w-24 bg-first-100" />
        <div className="space-y-3">
          <div>
            <Skeleton className="mb-2 h-3 w-20 bg-first-100" />
            <Skeleton className="h-7 w-full rounded-none border-b border-first-100 bg-transparent" />
          </div>
          <div>
            <Skeleton className="mb-2 h-3 w-20 bg-first-100" />
            <Skeleton className="h-7 w-full rounded-none border-b border-first-100 bg-transparent" />
          </div>
        </div>
        <Skeleton className="mt-4 h-2 w-full rounded-full bg-first-100" />
      </div>

      <div className="rounded-xl border border-first-100/70 p-3">
        <Skeleton className="mb-3 h-5 w-24 bg-first-100" />
        <FilterItemsSkeleton rows={3} />
      </div>

      <div className="flex items-center justify-between gap-3 rounded-xl border border-first-100/70 px-3 py-3">
        <Skeleton className="h-4 w-32 bg-first-100" />
        <Skeleton className="h-6 w-11 rounded-full bg-first-100" />
      </div>
    </div>
  </div>
);

export const ProductsSortSkeleton = () => (
  <div className="mb-4 hidden w-full items-center gap-2 rounded-2xl border border-first/15 bg-color-for-layer-on-body p-2 shadow-[0_8px_24px_rgba(20,29,38,0.05)] lg:flex">
    <Skeleton className="h-10 w-10 shrink-0 rounded-xl bg-first-100" />

    <div className="flex min-w-0 flex-1 flex-wrap gap-1.5">
      {Array.from({ length: 4 }).map((_, index) => (
        <Skeleton key={`sort-skeleton-${index}`} className="h-10 w-24 rounded-xl bg-first-100" />
      ))}
    </div>
  </div>
);

export const GridProductsSkeleton = ({ count }: { count: number }) => (
  <div className="grid grid-cols-1 gap-4 min-[520px]:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4">
    {Array.from({ length: count }).map((_, index) => (
      <div
        key={`grid-skeleton-${index}`}
        className="rounded-2xl border border-first-100/70 bg-color-for-layer-on-body p-2 shadow-[0_10px_26px_-20px_rgba(27,126,251,0.45)]"
      >
        <Skeleton className="aspect-[3/2] w-full rounded-2xl bg-first-100" />

        <div className="space-y-3 px-2 py-3">
          <Skeleton className="h-5 w-5/6 bg-first-100" />
          <Skeleton className="h-4 w-2/3 bg-first-100" />
          <div className="flex items-center justify-between gap-3 pt-2">
            <Skeleton className="h-6 w-24 bg-first-100" />
            <Skeleton className="h-9 w-9 rounded-xl bg-first-100" />
          </div>
        </div>
      </div>
    ))}
  </div>
);

export const ProductsContentSkeleton = ({
  count,
  includeSortBar = false,
}: {
  count: number;
  includeSortBar?: boolean;
}) => {
  return (
    <>
      {includeSortBar ? <ProductsSortSkeleton /> : null}
      <GridProductsSkeleton count={count} />
    </>
  );
};
