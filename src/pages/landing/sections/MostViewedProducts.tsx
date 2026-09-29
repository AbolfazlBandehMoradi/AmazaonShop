import { useMemo, useState, type KeyboardEvent } from 'react';
import { ArrowUpLeft } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { A11y, Keyboard } from 'swiper/modules';
import { Swiper, SwiperSlide } from 'swiper/react';

import 'swiper/css';

import ShowcaseProductCard from '@/components/reusable-components/ProductSection/ShowcaseProductCard';
import { CustomSelect } from '@/components/ui/CustomSelect';
import { SectionHeading } from '@/components/ui/SectionHeading';
import type { Showcase } from '@/hooks/useShowcases';
import { useLocalizedPath } from '@/hooks/useLocalizedPath';
import { useLangStore } from '@/stores/languageStore';
import { cn } from '@/utils/cn';

interface Props {
  showcase?: Showcase;
}

const categoryFilters = [
  { id: 'all', labelKey: 'all' },
  { id: '1', labelKey: 'mobile' },
  { id: '2', labelKey: 'powerBank' },
  { id: '3', labelKey: 'headphones' },
] as const;

const MostViewedProducts = ({ showcase }: Props) => {
  const { t } = useTranslation();
  const { dir } = useLangStore();
  const localizedPath = useLocalizedPath();
  const [activeCategoryId, setActiveCategoryId] = useState<string>('all');

  const products = useMemo(
    () => [...(showcase?.items ?? [])].sort((a, b) => a.sortOrder - b.sortOrder),
    [showcase?.items],
  );

  const visibleProducts = useMemo(
    () =>
      products
        .filter(
          (item) =>
            activeCategoryId === 'all' || String(item.product.categoryId) === activeCategoryId,
        )
        .slice(0, 8),
    [activeCategoryId, products],
  );

  const showcaseTitle =
    showcase?.translation?.title?.trim() || t('mainpage.mostViewedProducts.title');
  const showcaseDescription =
    showcase?.translation?.description?.trim() || t('mainpage.mostViewedProducts.description');
  const selectOptions = categoryFilters.map((category) => ({
    value: category.id,
    label: t('mainpage.mostViewedProducts.categories.' + category.labelKey),
  }));

  const handleTabKeyDown = (event: KeyboardEvent<HTMLButtonElement>, currentIndex: number) => {
    const isHorizontalArrow = event.key === 'ArrowLeft' || event.key === 'ArrowRight';
    if (!isHorizontalArrow && event.key !== 'Home' && event.key !== 'End') return;

    event.preventDefault();
    let nextIndex = currentIndex;

    if (event.key === 'Home') nextIndex = 0;
    else if (event.key === 'End') nextIndex = categoryFilters.length - 1;
    else {
      const forwardKey = dir === 'rtl' ? 'ArrowLeft' : 'ArrowRight';
      nextIndex =
        (currentIndex + (event.key === forwardKey ? 1 : -1) + categoryFilters.length) %
        categoryFilters.length;
    }

    setActiveCategoryId(categoryFilters[nextIndex].id);
    event.currentTarget.parentElement
      ?.querySelectorAll<HTMLButtonElement>('[role="tab"]')
      [nextIndex]?.focus();
  };

  if (!products.length) return null;

  const moreProductsPath =
    activeCategoryId === 'all'
      ? '/products'
      : '/products?categoryIds=' + encodeURIComponent(activeCategoryId);

  return (
    <section dir={dir} className="landing-section" aria-labelledby="most-viewed-products-title">
      <div className="landing-container">
        <div className="flex flex-col gap-5 px-4 sm:px-0 lg:flex-row lg:items-end lg:justify-between lg:gap-8">
          <SectionHeading
            id="most-viewed-products-title"
            title={showcaseTitle}
            subtext={showcaseDescription}
            decoration="right"
            titleClassName="sm:text-2xl"
          />

          <CustomSelect
            label={t('mainpage.mostViewedProducts.filterLabel')}
            options={selectOptions}
            value={activeCategoryId}
            onChange={setActiveCategoryId}
            className="sm:max-w-72 lg:hidden"
          />

          <div
            role="tablist"
            aria-label={t('mainpage.mostViewedProducts.filterLabel')}
            className="hidden h-12 w-max min-w-[288px] max-w-full shrink-0 items-center justify-between gap-2 rounded-[18px] border border-border bg-white p-1 lg:flex"
          >
            {categoryFilters.map((category, index) => {
              const active = category.id === activeCategoryId;
              const label = t('mainpage.mostViewedProducts.categories.' + category.labelKey);

              return (
                <button
                  key={category.id}
                  type="button"
                  role="tab"
                  aria-selected={active}
                  aria-controls="most-viewed-products-panel"
                  tabIndex={active ? 0 : -1}
                  onClick={() => setActiveCategoryId(category.id)}
                  onKeyDown={(event) => handleTabKeyDown(event, index)}
                  className={cn(
                    'h-full shrink-0 whitespace-nowrap rounded-2xl border border-transparent px-3 py-2 text-center text-sm leading-5 font-f-sbold text-text transition-colors hover:text-first focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-first',
                    active && 'border-[#163F87] bg-[#F4F7F9] text-first',
                  )}
                >
                  {label}
                </button>
              );
            })}
          </div>
        </div>

        <div
          id="most-viewed-products-panel"
          role="tabpanel"
          aria-label={showcaseTitle}
          className="mt-6 sm:mt-8"
        >
          {visibleProducts.length ? (
            <>
              <div className="lg:hidden">
                <Swiper
                  key={[showcase?.id ?? 'most-viewed', activeCategoryId, dir].join('-')}
                  dir={dir}
                  modules={[A11y, Keyboard]}
                  keyboard={{ enabled: true, onlyInViewport: true }}
                  className="showcase-products-swiper !overflow-hidden !px-4 !pt-3 !pb-6"
                  slidesPerView={1.12}
                  spaceBetween={12}
                  breakpoints={{
                    480: { slidesPerView: 1.4, spaceBetween: 14 },
                    640: { slidesPerView: 2.05, spaceBetween: 16 },
                    768: { slidesPerView: 2.5, spaceBetween: 18 },
                  }}
                  grabCursor={visibleProducts.length > 1}
                  watchOverflow
                >
                  {visibleProducts.map((item) => (
                    <SwiperSlide key={item.id} className="h-auto">
                      <ShowcaseProductCard product={item.product} />
                    </SwiperSlide>
                  ))}
                </Swiper>
              </div>

              <div className="hidden pt-2 lg:grid lg:grid-cols-3 lg:gap-5 xl:grid-cols-4 xl:gap-6">
                {visibleProducts.map((item) => (
                  <ShowcaseProductCard
                    key={item.id}
                    product={item.product}
                    className="h-auto max-w-none"
                  />
                ))}
              </div>
            </>
          ) : (
            <p className="rounded-[18px] border border-border bg-white px-6 py-12 text-center text-sm text-text-muted">
              {t('mainpage.mostViewedProducts.empty')}
            </p>
          )}
        </div>

        <div dir="ltr" className="mt-7 flex justify-start px-4 sm:mt-8 sm:px-0">
          <Link
            to={localizedPath(moreProductsPath)}
            dir={dir}
            className="inline-flex items-center gap-2 text-sm font-f-sbold text-first transition-colors hover:text-first-600 focus-visible:rounded-sm focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-first"
          >
            {t('mainpage.mostViewedProducts.more')}
            <ArrowUpLeft aria-hidden="true" className="size-4" />
          </Link>
        </div>
      </div>
    </section>
  );
};

export default MostViewedProducts;
