import { Fragment, useEffect, useId, useMemo, useRef, useState } from 'react';
import {
  ArrowLeft,
  ArrowRight,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  ShoppingBag,
} from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router';
import type { Swiper as SwiperType } from 'swiper';
import { Navigation } from 'swiper/modules';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/swiper.css';
import SliderBg from '@/assets/Images/Design/Slider-bg.png';
import ShowcaseProductCard from '@/components/reusable-components/ProductSection/ShowcaseProductCard';
import type { Showcase } from '@/hooks/useShowcases';
import { useLocalizedPath } from '@/hooks/useLocalizedPath';
import { useLangStore } from '@/stores/languageStore';
import { cn } from '@/utils/cn';

interface ProductSliderWithTabProps {
  showcases?: Showcase[];
}

const ProductSliderWithTab = ({ showcases = [] }: ProductSliderWithTabProps) => {
  const { t } = useTranslation();
  const localizedPath = useLocalizedPath();
  const { dir } = useLangStore();
  const isRtl = dir === 'rtl';
  const prevRef = useRef<HTMLButtonElement>(null);
  const nextRef = useRef<HTMLButtonElement>(null);
  const compactSelectRef = useRef<HTMLDivElement>(null);
  const compactListboxId = useId();
  const [activeShowcaseId, setActiveShowcaseId] = useState<number | null>(null);
  const [isBeginning, setIsBeginning] = useState(true);
  const [isEnd, setIsEnd] = useState(false);
  const [isCompactSelectOpen, setIsCompactSelectOpen] = useState(false);
  const [highlightedShowcaseIndex, setHighlightedShowcaseIndex] = useState(0);
  const [isDesktop, setIsDesktop] = useState(
    () => typeof window !== 'undefined' && window.matchMedia('(min-width: 1024px)').matches,
  );

  useEffect(() => {
    const desktopQuery = window.matchMedia('(min-width: 1024px)');
    const updateDesktopState = (event: MediaQueryListEvent) => setIsDesktop(event.matches);

    setIsDesktop(desktopQuery.matches);
    desktopQuery.addEventListener('change', updateDesktopState);

    return () => desktopQuery.removeEventListener('change', updateDesktopState);
  }, []);

  useEffect(() => {
    if (!isCompactSelectOpen) {
      return;
    }

    const closeOnOutsideClick = (event: MouseEvent) => {
      if (compactSelectRef.current && !compactSelectRef.current.contains(event.target as Node)) {
        setIsCompactSelectOpen(false);
      }
    };

    document.addEventListener('mousedown', closeOnOutsideClick);
    return () => document.removeEventListener('mousedown', closeOnOutsideClick);
  }, [isCompactSelectOpen]);

  const orderedShowcases = useMemo(
    () => [...showcases].sort((a, b) => a.displayOrder - b.displayOrder),
    [showcases],
  );
  const activeShowcase =
    orderedShowcases.find((showcase) => showcase.id === activeShowcaseId) ?? orderedShowcases[0];
  const products = activeShowcase?.items ?? [];
  const hasSliderItems = products.length > 0;
  const sliderItemCount = products.length + (isDesktop ? 0 : 1);
  const slidesPerView = (maximum: number) => Math.max(1, Math.min(sliderItemCount, maximum));
  const activeShowcaseIndex = Math.max(
    0,
    orderedShowcases.findIndex((showcase) => showcase.id === activeShowcase?.id),
  );

  const PreviousIcon = isRtl ? ChevronRight : ChevronLeft;
  const NextIcon = isRtl ? ChevronLeft : ChevronRight;
  const MoreIcon = isRtl ? ArrowLeft : ArrowRight;

  const updateNavigationState = (swiper: SwiperType) => {
    setIsBeginning(swiper.isBeginning);
    setIsEnd(swiper.isEnd);
  };

  const selectShowcase = (showcaseId: number) => {
    setActiveShowcaseId(showcaseId);
    setIsBeginning(true);
    setIsEnd(false);
    setIsCompactSelectOpen(false);
  };

  const handleCompactSelectKeyDown = (event: React.KeyboardEvent<HTMLButtonElement>) => {
    if (event.key === 'Escape') {
      setIsCompactSelectOpen(false);
      return;
    }

    if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
      event.preventDefault();

      if (!isCompactSelectOpen) {
        setHighlightedShowcaseIndex(activeShowcaseIndex);
        setIsCompactSelectOpen(true);
        return;
      }

      const direction = event.key === 'ArrowDown' ? 1 : -1;
      setHighlightedShowcaseIndex((currentIndex) => {
        const nextIndex = currentIndex + direction;
        return (nextIndex + orderedShowcases.length) % orderedShowcases.length;
      });
      return;
    }

    if ((event.key === 'Enter' || event.key === ' ') && isCompactSelectOpen) {
      event.preventDefault();
      const highlightedShowcase = orderedShowcases[highlightedShowcaseIndex];

      if (highlightedShowcase) {
        selectShowcase(highlightedShowcase.id);
      }
    }
  };

  const handleTabKeyDown = (
    event: React.KeyboardEvent<HTMLButtonElement>,
    currentIndex: number,
  ) => {
    const isHorizontalArrow = event.key === 'ArrowLeft' || event.key === 'ArrowRight';

    if (!isHorizontalArrow && event.key !== 'Home' && event.key !== 'End') {
      return;
    }

    event.preventDefault();
    let nextIndex = currentIndex;

    if (event.key === 'Home') {
      nextIndex = 0;
    } else if (event.key === 'End') {
      nextIndex = orderedShowcases.length - 1;
    } else {
      const movesForward = event.key === (isRtl ? 'ArrowLeft' : 'ArrowRight');
      const direction = movesForward ? 1 : -1;
      nextIndex = (currentIndex + direction + orderedShowcases.length) % orderedShowcases.length;
    }

    const nextShowcase = orderedShowcases[nextIndex];

    if (nextShowcase) {
      selectShowcase(nextShowcase.id);
      requestAnimationFrame(() => {
        document
          .querySelector<HTMLButtonElement>(`[data-showcase-tab="${nextShowcase.id}"]`)
          ?.focus();
      });
    }
  };

  if (!orderedShowcases.length) {
    return null;
  }

  return (
    <section
      dir={dir}
      className="landing-container relative z-0 mt-8 overflow-visible lg:mt-16"
      aria-labelledby="showcase-products-title"
    >
      <div className="relative">
        <div className="relative lg:z-30 lg:h-31">
          <div dir="ltr" className="flex flex-col gap-4 lg:h-full lg:flex-row lg:gap-6">
            <div
              dir={dir}
              className="order-2 hidden min-w-0 rounded-3xl bg-first lg:order-1 lg:block lg:h-15 lg:flex-1 lg:p-1.5"
            >
              <div
                className="flex h-full w-full items-center justify-start gap-2 overflow-x-auto px-1 [&::-webkit-scrollbar]:hidden [scrollbar-width:none]"
                role="tablist"
                aria-label={t('mainpage.showcaseTabs.tabsLabel')}
              >
                {orderedShowcases.map((showcase, index) => {
                  const isActive = showcase.id === activeShowcase.id;

                  return (
                    <Fragment key={showcase.id}>
                      <button
                        type="button"
                        role="tab"
                        data-showcase-tab={showcase.id}
                        tabIndex={isActive ? 0 : -1}
                        aria-selected={isActive}
                        aria-controls="showcase-products-panel"
                        className={cn(
                          'inline-flex h-full max-w-48 shrink-0 items-center justify-center rounded-2xl border border-[color-mix(in_srgb,var(--bg-color-for-layer-on-body)_14%,transparent)] px-5 text-sm font-f-sbold text-white transition-all hover:bg-[color-mix(in_srgb,var(--bg-color-for-layer-on-body)_10%,transparent)] active:scale-[0.98]',
                          isActive &&
                            'bg-secound shadow-sm ring-2 ring-white/15 hover:bg-secound-600',
                        )}
                        onClick={() => {
                          selectShowcase(showcase.id);
                        }}
                        onKeyDown={(event) => handleTabKeyDown(event, index)}
                      >
                        <span className="truncate">{showcase.translation.title}</span>
                      </button>
                      {index < orderedShowcases.length - 1 ? (
                        <span className="h-6 w-px shrink-0 bg-[#FFFFFF1A]" role="presentation" />
                      ) : null}
                    </Fragment>
                  );
                })}
              </div>
            </div>

            <div
              dir={dir}
              className="pointer-events-none relative order-1 min-h-44 overflow-visible rounded-3xl bg-first px-6 pt-8 pb-24 text-white sm:px-8 sm:pt-9 sm:pb-28 md:px-10 lg:order-2 lg:h-68.5 lg:min-h-0 lg:w-102 lg:shrink-0 lg:rounded-none lg:bg-transparent lg:px-8 lg:pt-8 lg:pb-0"
            >
              <img
                src={SliderBg}
                alt=""
                aria-hidden="true"
                className="pointer-events-none absolute inset-0 hidden h-full w-full select-none object-fill lg:block"
              />

              <div
                className={cn(
                  'pointer-events-auto relative flex flex-col items-start gap-5 sm:flex-row sm:items-center sm:justify-between lg:justify-between',
                  isCompactSelectOpen ? 'z-60' : 'z-10',
                )}
              >
                <h2
                  id="showcase-products-title"
                  className="shrink-0 text-xl font-f-bold text-white sm:text-2xl"
                >
                  {t('mainpage.showcaseTabs.title')}
                </h2>
                <Link
                  to={localizedPath('/products')}
                  className="hidden items-center gap-1.5 text-sm font-f-sbold text-white/90 transition-colors hover:text-white lg:inline-flex"
                >
                  <span>{t('mainpage.showcaseTabs.more')}</span>
                  <MoreIcon className="h-4 w-4" strokeWidth={1.8} aria-hidden="true" />
                </Link>

                <div
                  ref={compactSelectRef}
                  className="relative w-full sm:max-w-64 lg:hidden"
                  onBlur={(event) => {
                    if (!event.currentTarget.contains(event.relatedTarget as Node | null)) {
                      setIsCompactSelectOpen(false);
                    }
                  }}
                >
                  <button
                    type="button"
                    role="combobox"
                    aria-controls={compactListboxId}
                    aria-expanded={isCompactSelectOpen}
                    aria-haspopup="listbox"
                    onClick={() => {
                      setHighlightedShowcaseIndex(activeShowcaseIndex);
                      setIsCompactSelectOpen((isOpen) => !isOpen);
                    }}
                    onKeyDown={handleCompactSelectKeyDown}
                    className="flex h-11 w-full items-center justify-between gap-3 rounded-2xl border border-[color-mix(in_srgb,var(--bg-color-for-layer-on-body)_25%,transparent)] bg-[color-mix(in_srgb,var(--bg-color-for-layer-on-body)_10%,transparent)] px-4 text-sm font-f-sbold text-white outline-none transition-colors hover:bg-[color-mix(in_srgb,var(--bg-color-for-layer-on-body)_15%,transparent)] focus-visible:border-[color-mix(in_srgb,var(--bg-color-for-layer-on-body)_70%,transparent)] focus-visible:ring-3 focus-visible:ring-[color-mix(in_srgb,var(--bg-color-for-layer-on-body)_15%,transparent)]"
                  >
                    <span className="min-w-0 truncate">{activeShowcase.translation.title}</span>
                    <ChevronDown
                      className={cn(
                        'h-4 w-4 shrink-0 text-white transition-transform',
                        isCompactSelectOpen && 'rotate-180',
                      )}
                      strokeWidth={2}
                      aria-hidden="true"
                    />
                  </button>

                  {isCompactSelectOpen ? (
                    <div
                      id={compactListboxId}
                      role="listbox"
                      aria-label={t('mainpage.showcaseTabs.tabsLabel')}
                      className="absolute inset-x-0 top-full z-80 mt-2 max-h-60 overflow-y-auto rounded-2xl border border-first/15 bg-color-for-layer-on-body p-1.5 shadow-[0_16px_35px_rgba(20,29,38,0.18)]"
                    >
                      {orderedShowcases.map((showcase, index) => {
                        const isSelected = showcase.id === activeShowcase.id;
                        const isHighlighted = index === highlightedShowcaseIndex;

                        return (
                          <button
                            key={showcase.id}
                            type="button"
                            role="option"
                            aria-selected={isSelected}
                            onMouseEnter={() => setHighlightedShowcaseIndex(index)}
                            onClick={() => selectShowcase(showcase.id)}
                            className={cn(
                              'flex w-full items-center rounded-xl px-3 py-2.5 text-start text-sm first-text-color transition-colors',
                              isHighlighted && 'bg-first/10 text-first',
                              isSelected && 'bg-secound text-white! hover:bg-secound-600',
                            )}
                          >
                            <span className="truncate">{showcase.translation.title}</span>
                          </button>
                        );
                      })}
                    </div>
                  ) : null}
                </div>
              </div>

              <div
                dir={'rtl' == dir ? 'ltr' : 'rtl'}
                className="pointer-events-auto absolute -top-3 left-18.5 z-32 hidden items-center gap-2 lg:flex"
              >
                <button
                  ref={nextRef}
                  type="button"
                  className={cn(
                    'flex h-7.5 w-7.5 items-center justify-center rounded-full bg-secound text-white shadow-sm transition-all hover:bg-secound-600 active:scale-95',
                    (!hasSliderItems || isEnd) && 'pointer-events-none opacity-40',
                  )}
                  aria-label={t('mainpage.showcaseTabs.next')}
                  disabled={!hasSliderItems || isEnd}
                >
                  <NextIcon className="h-4 w-4" strokeWidth={2} aria-hidden="true" />
                </button>
                <button
                  ref={prevRef}
                  type="button"
                  className={cn(
                    'flex h-7.5 w-7.5 items-center justify-center rounded-full bg-secound text-white shadow-sm transition-all hover:bg-secound-600 active:scale-95',
                    (!hasSliderItems || isBeginning) && 'pointer-events-none opacity-40',
                  )}
                  aria-label={t('mainpage.showcaseTabs.previous')}
                  disabled={!hasSliderItems || isBeginning}
                >
                  <PreviousIcon className="h-4 w-4" strokeWidth={2} aria-hidden="true" />
                </button>
              </div>
            </div>
          </div>
        </div>

        <div
          id="showcase-products-panel"
          role="tabpanel"
          className="relative z-20 -mt-20 px-4 sm:-mt-24 sm:px-6 lg:z-31 lg:-mt-9 lg:px-5"
        >
          {products.length ? (
            <Swiper
              key={`${activeShowcase.id}-${dir}-${isDesktop ? 'desktop' : 'compact'}`}
              dir={dir}
              className="showcase-products-swiper"
              modules={[Navigation]}
              slidesPerView={slidesPerView(1)}
              spaceBetween={12}
              grabCursor
              watchOverflow
              navigation={false}
              onSwiper={(swiper: SwiperType) => {
                if (prevRef.current && nextRef.current) {
                  swiper.params.navigation = {
                    prevEl: prevRef.current,
                    nextEl: nextRef.current,
                    disabledClass: 'swiper-navigation-disabled',
                  };
                  swiper.navigation.init();
                  swiper.navigation.update();
                }

                updateNavigationState(swiper);
              }}
              onSlideChange={updateNavigationState}
              onResize={updateNavigationState}
              onBreakpoint={updateNavigationState}
              breakpoints={{
                640: {
                  slidesPerView: slidesPerView(2),
                  spaceBetween: 16,
                },
                1024: {
                  slidesPerView: slidesPerView(3),
                  spaceBetween: 18,
                },
                1280: {
                  slidesPerView: slidesPerView(4),
                  spaceBetween: 20,
                },
              }}
            >
              {products.map((item) => (
                <SwiperSlide key={item.id} className="h-auto">
                  <ShowcaseProductCard product={item.product} />
                </SwiperSlide>
              ))}
              {!isDesktop ? (
                <SwiperSlide className="h-auto">
                  <Link
                    to={localizedPath('/products')}
                    className="group flex h-full w-full flex-col items-center justify-center rounded-2xl border border-first/15 bg-color-for-layer-on-body px-6 py-10 text-center shadow-[0_8px_24px_rgba(20,29,38,0.06)] transition-all duration-300 hover:-translate-y-1 hover:border-secound/30 hover:shadow-[0_14px_30px_rgba(20,29,38,0.12)]"
                  >
                    <span className="flex h-16 w-16 items-center justify-center rounded-2xl bg-secound/10 text-secound transition-colors group-hover:bg-secound group-hover:text-white">
                      <ShoppingBag className="h-8 w-8" strokeWidth={1.6} aria-hidden="true" />
                    </span>
                    <span className="mt-5 text-lg font-f-bold first-text-color">
                      {t('mainpage.showcaseTabs.more')}
                    </span>
                    <span className="mt-4 inline-flex items-center gap-2 rounded-xl bg-secound px-5 py-2.5 text-sm font-f-sbold text-white transition-colors group-hover:bg-secound-600">
                      {t('mainpage.showcaseTabs.more')}
                      <MoreIcon className="h-4 w-4" strokeWidth={1.8} aria-hidden="true" />
                    </span>
                  </Link>
                </SwiperSlide>
              ) : null}
            </Swiper>
          ) : (
            <div className="flex min-h-64 items-center justify-center rounded-2xl border border-first/15 bg-color-for-layer-on-body px-6 text-center text-sm first-text-color-for-paragraph">
              {t('mainpage.showcaseTabs.empty')}
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default ProductSliderWithTab;
