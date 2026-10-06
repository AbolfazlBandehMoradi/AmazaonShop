import { useId, useMemo, useState, type KeyboardEvent } from 'react';
import Masonry from 'react-masonry-css';
import { Link, useNavigate } from 'react-router';
import { useTranslation } from 'react-i18next';
import { ArrowLeft, ChevronDown, ChevronLeft, Grid2x2, RefreshCw } from 'lucide-react';
import type { Category } from '@/types';
import useCategories from '@/hooks/useCategories';
import { useLangStore } from '@/stores/languageStore';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { useLocalizedPath } from '@/hooks/useLocalizedPath';
import { getCategoryChildren } from '@/utils/categoryHelpers';
import { cn } from '@/utils/cn';
import './CategoriesPage.css';

const hasProducts = (category: Category) => (category.productCount ?? 0) > 0;
const sortByAvailability = (a: Category, b: Category) =>
  Number(hasProducts(b)) - Number(hasProducts(a));
const categoryPath = (category: Category) =>
  `/products?categoryIds=${encodeURIComponent(category.id)}`;
const focusClass =
  'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-first';

function CategoryImage({ category, className }: { category: Category; className?: string }) {
  const [failedImage, setFailedImage] = useState<string>();

  return (
    <span
      className={cn(
        'grid size-11 shrink-0 place-items-center overflow-hidden rounded-xl border border-border/60 bg-background',
        className,
      )}
    >
      {category.image && category.image !== failedImage ? (
        <img
          src={category.image}
          alt=""
          loading="lazy"
          decoding="async"
          className="size-full object-contain p-1"
          onError={() => setFailedImage(category.image)}
        />
      ) : (
        <Grid2x2
          aria-hidden="true"
          className="size-5 text-first dark:text-first-300"
          strokeWidth={1.6}
        />
      )}
    </span>
  );
}

function ProductCount({ category }: { category: Category }) {
  const { t, i18n } = useTranslation();

  return (
    <span className="block text-[11px] leading-5 text-text-muted md:text-xs">
      {hasProducts(category)
        ? `${(category.productCount ?? 0).toLocaleString(i18n.resolvedLanguage)} ${t('categories.productLabel')}`
        : t('categories.noProductsInCategory')}
    </span>
  );
}

function ForwardChevron() {
  const dir = useLangStore((s) => s.dir);
  return (
    <ChevronLeft
      aria-hidden="true"
      className={cn('size-4 shrink-0', dir === 'ltr' && 'rotate-180')}
      strokeWidth={1.8}
    />
  );
}

function ChildCategoryCard({
  category,
  showImage = true,
}: {
  category: Category;
  showImage?: boolean;
}) {
  const localizedPath = useLocalizedPath();
  const isClickable = hasProducts(category);
  const className = cn(
    'flex min-h-19 w-full items-center gap-3 rounded-2xl border px-3 py-3 text-start',
    isClickable
      ? `border-border/70 bg-background transition-colors hover:border-first/40 hover:bg-first/5 ${focusClass}`
      : 'border-border/40 bg-surface/60',
  );
  const content = (
    <>
      {showImage && <CategoryImage category={category} />}
      <span className="min-w-0 flex-1">
        <span className="block text-sm leading-6 font-f-sbold text-text [overflow-wrap:anywhere]">
          {category.name}
        </span>
        <ProductCount category={category} />
      </span>
      {isClickable && (
        <span className="grid size-6 shrink-0 place-items-center rounded-lg bg-first/8 text-first dark:text-first-300">
          <ForwardChevron />
        </span>
      )}
    </>
  );

  return isClickable ? (
    <Link to={localizedPath(categoryPath(category))} className={className}>
      {content}
    </Link>
  ) : (
    <div className={className} aria-disabled="true">
      {content}
    </div>
  );
}

function ParentCategoryCard({ category }: { category: Category }) {
  const { t } = useTranslation();
  const localizedPath = useLocalizedPath();
  const [isOpen, setIsOpen] = useState(false);
  const panelId = useId();
  const children = getCategoryChildren(category).slice().sort(sortByAvailability);
  const hasChildren = children.length > 0;
  const headerClass = `flex w-full items-center gap-3 rounded-xl text-start ${focusClass}`;
  const headerContent = (
    <>
      <CategoryImage category={category} className="size-14 rounded-2xl" />
      <span className="min-w-0 flex-1">
        <span className="block text-base leading-7 font-f-sbold text-text [overflow-wrap:anywhere]">
          {category.name}
        </span>
        <ProductCount category={category} />
      </span>
      {(hasChildren || hasProducts(category)) && (
        <span className="grid size-9 shrink-0 place-items-center rounded-xl border border-border/60 bg-background text-text-muted">
          {hasChildren ? (
            <ChevronDown
              aria-hidden="true"
              className={cn(
                'size-4 transition-transform motion-reduce:transition-none',
                isOpen && 'rotate-180',
              )}
            />
          ) : (
            <ForwardChevron />
          )}
        </span>
      )}
    </>
  );

  return (
    <div className="w-full break-inside-avoid rounded-2xl border border-border/80 bg-surface p-4 lg:p-5">
      <h2>
        {hasChildren ? (
          <button
            type="button"
            className={headerClass}
            onClick={() => setIsOpen(!isOpen)}
            aria-expanded={isOpen}
            aria-controls={panelId}
          >
            {headerContent}
          </button>
        ) : hasProducts(category) ? (
          <Link to={localizedPath(categoryPath(category))} className={headerClass}>
            {headerContent}
          </Link>
        ) : (
          <span className={headerClass}>{headerContent}</span>
        )}
      </h2>

      {hasChildren && (
        <div id={panelId} hidden={!isOpen}>
          <div className="mt-4 grid grid-cols-1 gap-2.5 border-t border-border/70 pt-4 xl:grid-cols-2">
            {children.map((child) => (
              <ChildCategoryCard key={child.id} category={child} />
            ))}
            {hasProducts(category) && (
              <Link
                to={localizedPath(categoryPath(category))}
                className={`col-span-full mt-1 flex min-h-11 items-center justify-center gap-2 rounded-xl bg-first px-4 py-3 text-sm font-f-sbold text-white transition-colors hover:bg-first-600 ${focusClass}`}
              >
                {t('categories.viewAllProducts')}
                <ForwardChevron />
              </Link>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

function MobileCategoriesSplitView({ categories }: { categories: Category[] }) {
  const { t } = useTranslation();
  const localizedPath = useLocalizedPath();
  const sortedParents = useMemo(() => categories.slice().sort(sortByAvailability), [categories]);
  const [activeParentId, setActiveParentId] = useState<string | null>(null);
  const activeParent =
    sortedParents.find((category) => category.id === activeParentId) ?? sortedParents[0];
  const activeChildren = activeParent
    ? getCategoryChildren(activeParent).slice().sort(sortByAvailability)
    : [];
  const tabsId = useId();
  const panelId = `${tabsId}-panel`;

  const handleTabKeyDown = (event: KeyboardEvent<HTMLButtonElement>, index: number) => {
    if (!['ArrowUp', 'ArrowDown', 'Home', 'End'].includes(event.key)) return;
    event.preventDefault();
    const nextIndex =
      event.key === 'Home'
        ? 0
        : event.key === 'End'
          ? sortedParents.length - 1
          : (index + (event.key === 'ArrowDown' ? 1 : -1) + sortedParents.length) %
            sortedParents.length;
    setActiveParentId(sortedParents[nextIndex].id);
    event.currentTarget.parentElement
      ?.querySelectorAll<HTMLButtonElement>('[role="tab"]')
      [nextIndex]?.focus();
  };

  if (!activeParent) return null;

  return (
    <section className="categories-split md:hidden" aria-label={t('categories.title')}>
      <div
        role="tablist"
        aria-label={t('categories.parentCategories')}
        aria-orientation="vertical"
        className="categories-rail categories-scroll border-e border-border/70 bg-surface p-2"
      >
        {sortedParents.map((parent, index) => {
          const isActive = parent.id === activeParent.id;
          return (
            <button
              key={parent.id}
              id={`${tabsId}-${parent.id}`}
              type="button"
              role="tab"
              aria-selected={isActive}
              aria-controls={panelId}
              tabIndex={isActive ? 0 : -1}
              onClick={() => setActiveParentId(parent.id)}
              onKeyDown={(event) => handleTabKeyDown(event, index)}
              className={cn(
                'relative mb-2 flex min-h-24 w-full flex-col items-center justify-center gap-2 rounded-2xl border px-2 py-3 text-center transition-colors last:mb-0',
                focusClass,
                isActive
                  ? 'border-first/20 bg-background text-first shadow-sm dark:text-first-300'
                  : 'border-transparent text-text-muted hover:bg-background/60',
              )}
            >
              {isActive && (
                <span
                  aria-hidden="true"
                  className="absolute inset-y-5 start-0 w-0.5 rounded-full bg-first"
                />
              )}
              <CategoryImage
                category={parent}
                className={cn('size-10', isActive && 'border-first/15 bg-first/5')}
              />
              <span
                className={cn(
                  'text-xs leading-5 [overflow-wrap:anywhere]',
                  isActive && 'font-f-sbold',
                )}
              >
                {parent.name}
              </span>
            </button>
          );
        })}
      </div>

      <div
        key={activeParent.id}
        id={panelId}
        role="tabpanel"
        aria-labelledby={`${tabsId}-${activeParent.id}`}
        tabIndex={0}
        className="categories-scroll min-w-0 bg-background px-3 pt-4 pb-5 focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-first sm:px-5"
      >
        <div className="mb-4 border-b border-border/60 pb-4">
          <h2 className="mb-1 text-base leading-7 font-f-bold text-text [overflow-wrap:anywhere]">
            {activeParent.name}
          </h2>
          <ProductCount category={activeParent} />
          {hasProducts(activeParent) && (
            <Link
              to={localizedPath(categoryPath(activeParent))}
              className={`mt-3 flex min-h-11 items-center justify-between gap-2 rounded-xl border border-first/15 bg-first/7 px-3 py-2 text-xs leading-5 font-f-sbold text-first dark:text-first-300 ${focusClass}`}
            >
              {t('categories.viewAllProducts')}
              <ForwardChevron />
            </Link>
          )}
        </div>
        <div className="space-y-2.5">
          {activeChildren.length > 0 ? (
            activeChildren.map((child) => (
              <ChildCategoryCard key={child.id} category={child} showImage={false} />
            ))
          ) : hasProducts(activeParent) ? (
            <p className="text-xs leading-6 text-text-muted">{t('categories.browseParent')}</p>
          ) : (
            <p className="rounded-2xl border border-border/60 bg-surface p-4 text-xs leading-6 text-text-muted">
              {t('categories.noProductsInCategory')}
            </p>
          )}
        </div>
      </div>
    </section>
  );
}

const AllCategoriesPage = () => {
  const dir = useLangStore((s) => s.dir);
  const { t } = useTranslation();
  const navigate = useNavigate();
  const localizedPath = useLocalizedPath();
  const { data: categories, isLoading, isError, refetch } = useCategories();

  const goBack = () => {
    // Router history excludes an external page when this route was opened directly.
    if (typeof window.history.state?.idx === 'number' && window.history.state.idx > 0) {
      navigate(-1);
    } else {
      navigate(localizedPath('/'), { replace: true });
    }
  };

  return (
    <main dir={dir} className="categories-page page-container page-section">
      <header className="categories-mobile-header flex shrink-0 items-center gap-3 border-b border-border/70 bg-background px-4 pb-3 md:hidden">
        <button
          type="button"
          onClick={goBack}
          aria-label={t('categories.back')}
          className={`grid size-11 shrink-0 place-items-center rounded-2xl border border-border/70 bg-surface text-text ${focusClass}`}
        >
          <ArrowLeft
            aria-hidden="true"
            className={cn('size-5', dir === 'rtl' && 'rotate-180')}
            strokeWidth={1.8}
          />
        </button>
        <div className="min-w-0">
          <h1 className="text-lg leading-7 font-f-bold text-text">{t('categories.title')}</h1>
          <p className="text-xs leading-5 text-text-muted">{t('categories.mobileSubtitle')}</p>
        </div>
      </header>

      <div className="categories-content md:rounded-3xl md:border md:border-border/60 md:bg-background md:p-6 lg:p-8">
        <div className="mb-7 hidden border-b border-border/60 pb-6 md:block">
          <SectionHeading
            as="h1"
            title={t('categories.title')}
            subtext={t('categories.subtitle')}
            decoration="right"
            titleClassName="text-2xl lg:text-3xl lg:leading-10"
          />
        </div>
        {isLoading ? (
          <div
            role="status"
            className="categories-state w-full"
            aria-label={t('categories.loading')}
          >
            <span className="sr-only">{t('categories.loading')}</span>
            <div
              aria-hidden="true"
              className="grid w-full animate-pulse grid-cols-[6rem_1fr] gap-3 motion-reduce:animate-none md:grid-cols-2 md:gap-4"
            >
              {[0, 1, 2, 3, 4, 5].map((item) => (
                <div key={item} className="h-24 rounded-2xl border border-border/40 bg-surface" />
              ))}
            </div>
          </div>
        ) : isError ? (
          <div role="alert" className="categories-state">
            <Grid2x2 aria-hidden="true" className="size-9 text-text-muted" strokeWidth={1.4} />
            <p className="text-sm leading-7 text-text-muted">{t('categories.loadError')}</p>
            <button
              type="button"
              onClick={() => void refetch()}
              className={`inline-flex min-h-11 items-center gap-2 rounded-xl bg-first px-5 py-3 text-sm text-white ${focusClass}`}
            >
              <RefreshCw aria-hidden="true" className="size-4" />
              {t('categories.retry')}
            </button>
          </div>
        ) : categories && categories.length > 0 ? (
          <>
            <MobileCategoriesSplitView categories={categories} />
            <div className="hidden md:block">
              <Masonry
                breakpointCols={2}
                className="flex gap-4"
                columnClassName="flex min-w-0 flex-1 flex-col gap-4"
              >
                {categories
                  .slice()
                  .sort(sortByAvailability)
                  .map((category) => (
                    <ParentCategoryCard key={category.id} category={category} />
                  ))}
              </Masonry>
            </div>
          </>
        ) : (
          <div role="status" className="categories-state">
            <Grid2x2 aria-hidden="true" className="size-9 text-text-muted" strokeWidth={1.4} />
            <p className="text-sm leading-7 text-text-muted">{t('categories.empty')}</p>
          </div>
        )}
      </div>
    </main>
  );
};

export default AllCategoriesPage;
