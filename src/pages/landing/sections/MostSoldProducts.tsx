import { useMemo, useState, type KeyboardEvent } from 'react';
import { useTranslation } from 'react-i18next';
import { A11y, Keyboard } from 'swiper/modules';
import { Swiper, SwiperSlide } from 'swiper/react';

import 'swiper/css';

import ShowcaseProductCard from '@/components/reusable-components/ProductSection/ShowcaseProductCard';
import { CustomSelect } from '@/components/ui/CustomSelect';
import type { Showcase } from '@/hooks/useShowcases';
import { useSlideEdgeFade } from '@/hooks/useSlideEdgeFade';
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

const MostSoldProducts = ({ showcase }: Props) => {
  const { t } = useTranslation();
  const { dir } = useLangStore();
  const [activeCategoryId, setActiveCategoryId] = useState<string>('all');
  const { fadeWidth, updateFade } = useSlideEdgeFade();

  const products = useMemo(
    () => [...(showcase?.items ?? [])].sort((a, b) => a.sortOrder - b.sortOrder),
    [showcase?.items],
  );
  const visibleProducts = useMemo(
    () =>
      products.filter(
        (item) =>
          activeCategoryId === 'all' || String(item.product.categoryId) === activeCategoryId,
      ),
    [activeCategoryId, products],
  );

  const title = showcase?.translation?.title?.trim() || t('mainpage.mostSoldProducts.title');
  const description =
    showcase?.translation?.description?.trim() || t('mainpage.mostSoldProducts.description');
  const filterLabel = t('mainpage.mostSoldProducts.filterLabel');
  const selectOptions = categoryFilters.map((category) => ({
    value: category.id,
    label: t(`mainpage.mostViewedProducts.categories.${category.labelKey}`),
  }));

  const handleTabKeyDown = (event: KeyboardEvent<HTMLButtonElement>, currentIndex: number) => {
    if (!['ArrowLeft', 'ArrowRight', 'Home', 'End'].includes(event.key)) return;

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

  return (
    <section
      dir={dir}
      className="landing-section most-sold-products-section"
      aria-labelledby="most-sold-products-title"
    >
      <div className="landing-container">
        <div className="best-products-panel">
          <div className="best-products-panel__background" aria-hidden="true" />

          <div className="best-products-panel__header">
            <div className="best-products-panel__intro">
              <h2
                id="most-sold-products-title"
                className="text-xl leading-8 font-f-bold text-white sm:text-2xl sm:leading-9"
              >
                {title}
              </h2>
              <p className="mt-1 text-sm leading-6 font-f-normal text-white/85">{description}</p>
            </div>

            <div className="best-products-panel__actions">
              <CustomSelect
                label={filterLabel}
                options={selectOptions}
                value={activeCategoryId}
                onChange={setActiveCategoryId}
                className="lg:hidden"
                variant="glass"
              />

              <div
                role="tablist"
                aria-label={filterLabel}
                className="hidden h-12 shrink-0 items-center gap-1 rounded-[18px] border border-border bg-white p-1 lg:flex"
              >
                {categoryFilters.map((category, index) => {
                  const active = category.id === activeCategoryId;
                  return (
                    <button
                      key={category.id}
                      type="button"
                      role="tab"
                      aria-selected={active}
                      aria-controls="most-sold-products-panel"
                      tabIndex={active ? 0 : -1}
                      onClick={() => setActiveCategoryId(category.id)}
                      onKeyDown={(event) => handleTabKeyDown(event, index)}
                      className={cn(
                        'h-full shrink-0 rounded-2xl border border-transparent px-3 text-sm leading-5 font-f-sbold text-text transition-colors hover:text-first focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-first',
                        active && 'border-[#163F87] bg-[#F4F7F9] text-first',
                      )}
                    >
                      {t(`mainpage.mostViewedProducts.categories.${category.labelKey}`)}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          <div
            id="most-sold-products-panel"
            role="tabpanel"
            aria-label={title}
            className="best-products-panel__slider"
          >
            {visibleProducts.length ? (
              <Swiper
                key={`${showcase?.id}-${activeCategoryId}-${dir}`}
                dir={dir}
                modules={[A11y, Keyboard]}
                keyboard={{ enabled: true, onlyInViewport: true }}
                className="best-products-panel__swiper"
                slidesPerView={1}
                spaceBetween={12}
                breakpoints={{
                  390: { slidesPerView: 1.1, spaceBetween: 14 },
                  430: { slidesPerView: 1.2, spaceBetween: 14 },
                  480: { slidesPerView: 1.4, spaceBetween: 14 },
                  560: { slidesPerView: 1.6, spaceBetween: 14 },
                  640: { slidesPerView: 1.8, spaceBetween: 16 },
                  720: { slidesPerView: 2, spaceBetween: 16 },
                  768: { slidesPerView: 2.15, spaceBetween: 18 },
                  840: { slidesPerView: 2.4, spaceBetween: 18 },
                  900: { slidesPerView: 2.6, spaceBetween: 18 },
                  960: { slidesPerView: 2.8, spaceBetween: 18 },
                  1024: { slidesPerView: 'auto', spaceBetween: 20 },
                  1280: { slidesPerView: 'auto', spaceBetween: 24 },
                }}
                grabCursor={visibleProducts.length > 1}
                watchOverflow
                onSwiper={updateFade}
                onSlideChange={updateFade}
                onResize={updateFade}
                onBreakpoint={updateFade}
                onLock={updateFade}
                onUnlock={updateFade}
              >
                {visibleProducts.map((item) => (
                  <SwiperSlide key={item.id}>
                    <ShowcaseProductCard
                      product={item.product}
                      variant="mostViewed"
                      className="h-auto max-w-none"
                    />
                  </SwiperSlide>
                ))}
              </Swiper>
            ) : (
              <p className="flex min-h-[508px] items-center justify-center rounded-[32px] bg-surface px-6 text-center text-sm text-text-muted">
                {t('mainpage.mostSoldProducts.empty')}
              </p>
            )}
            {visibleProducts.length > 0 && fadeWidth > 0 && (
              <div
                className="landing-slider-edge-fade"
                style={{ width: fadeWidth }}
                aria-hidden="true"
              />
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default MostSoldProducts;
