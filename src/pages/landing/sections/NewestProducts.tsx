import { useMemo, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { A11y, Keyboard } from 'swiper/modules';
import { Swiper, SwiperSlide } from 'swiper/react';
import type { Swiper as SwiperType } from 'swiper';

import 'swiper/css';

import ShowcaseProductCard from '@/components/reusable-components/ProductSection/ShowcaseProductCard';
import type { Showcase } from '@/hooks/useShowcases';
import { useLangStore } from '@/stores/languageStore';
import { cn } from '@/utils/cn';

interface Props {
  showcase?: Showcase;
}

const NewestProducts = ({ showcase }: Props) => {
  const { t } = useTranslation();
  const { dir } = useLangStore();

  const swiperRef = useRef<SwiperType | null>(null);

  const isRtl = dir === 'rtl';

  const products = useMemo(
    () => [...(showcase?.items ?? [])].sort((a, b) => a.sortOrder - b.sortOrder),
    [showcase?.items],
  );

  const showcaseTitle =
    showcase?.translation?.title?.trim() ||
    [
      t('mainpage.collectionProducts.titlePrefix'),
      t('mainpage.collectionProducts.titleAccent'),
      t('mainpage.collectionProducts.titleSuffix'),
    ]
      .filter(Boolean)
      .join(' ');

  const canSlide = products.length > 1;

  return (
    <section
      dir={dir}
      className="newest-products-section landing-section overflow-hidden"
      aria-labelledby="modern-products-slider-title"
    >
      <div className="landing-container">
        {/* Section shell */}
        <div
          className="
            relative
            overflow-hidden
            rounded-[28px]
            border
            border-first/5
            bg-first/[0.025]
            px-4
            py-5
            sm:px-6
            sm:py-6
            lg:px-8
            lg:py-8
          "
        >
          {/* Decorative background */}
          <div
            aria-hidden="true"
            className="
              pointer-events-none
              absolute
              -top-24
              end-[-80px]
              size-56
              rounded-full
              bg-third/5
              blur-3xl
            "
          />

          {/* Header */}
          <div
            className="
              relative
              z-10
              flex
              items-end
              justify-between
              gap-5
            "
          >
            <div className="min-w-0">
              {/* Eyebrow */}
              <div
                className="
                  mb-2
                  flex
                  items-center
                  gap-2
                "
              >
                <span
                  aria-hidden="true"
                  className="
                    size-1.5
                    rounded-full
                    bg-third
                  "
                />

                <span
                  className="
                    text-[11px]
                    font-s-medium
                    uppercase
                    tracking-[0.14em]
                    text-first/50
                    sm:text-xs
                  "
                >
                  {t('mainpage.collectionProducts.label')}
                </span>
              </div>

              {/* Title */}
              <h2
                id="modern-products-slider-title"
                className="
                  max-w-2xl
                  text-xl
                  font-s-bold
                  leading-tight
                  first-text-color
                  sm:text-2xl
                  lg:text-[28px]
                "
              >
                {showcaseTitle}
              </h2>
            </div>

            {/* Desktop navigation */}
            {canSlide && (
              <div
                className="
                  hidden
                  shrink-0
                  items-center
                  gap-2
                  sm:flex
                "
              >
                <button
                  type="button"
                  onClick={() =>
                    isRtl ? swiperRef.current?.slideNext() : swiperRef.current?.slidePrev()
                  }
                  className="
                    group
                    flex
                    size-10
                    items-center
                    justify-center
                    rounded-full
                    border
                    border-first/10
                    bg-background
                    text-first
                    transition-all
                    duration-200

                    hover:-translate-y-0.5
                    hover:border-third/30
                    hover:bg-third
                    hover:text-white

                    focus-visible:outline-none
                    focus-visible:ring-2
                    focus-visible:ring-third/40
                    focus-visible:ring-offset-2

                    active:translate-y-0
                  "
                  aria-label={t('common.previous', {
                    defaultValue: 'Previous products',
                  })}
                >
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    aria-hidden="true"
                    className={cn('size-[18px]', isRtl && 'rotate-180')}
                  >
                    <path
                      d="M15 18L9 12L15 6"
                      stroke="currentColor"
                      strokeWidth="1.8"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </button>

                <button
                  type="button"
                  onClick={() =>
                    isRtl ? swiperRef.current?.slidePrev() : swiperRef.current?.slideNext()
                  }
                  className="
                    group
                    flex
                    size-10
                    items-center
                    justify-center
                    rounded-full
                    border
                    border-first/10
                    bg-background
                    text-first
                    transition-all
                    duration-200

                    hover:-translate-y-0.5
                    hover:border-third/30
                    hover:bg-third
                    hover:text-white

                    focus-visible:outline-none
                    focus-visible:ring-2
                    focus-visible:ring-third/40
                    focus-visible:ring-offset-2

                    active:translate-y-0
                  "
                  aria-label={t('common.next', {
                    defaultValue: 'Next products',
                  })}
                >
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    aria-hidden="true"
                    className={cn('size-[18px]', isRtl && 'rotate-180')}
                  >
                    <path
                      d="M9 18L15 12L9 6"
                      stroke="currentColor"
                      strokeWidth="1.8"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </button>
              </div>
            )}
          </div>

          {/* Slider */}
          <div className="relative mt-5 min-w-0 sm:mt-6 lg:mt-7">
            <Swiper
              key={`${showcase?.id ?? 'modern-products'}-${dir}`}
              dir={dir}
              modules={[A11y, Keyboard]}
              onSwiper={(swiper) => {
                swiperRef.current = swiper;
              }}
              keyboard={{
                enabled: true,
                onlyInViewport: true,
              }}
              a11y={{
                enabled: true,
              }}
              grabCursor={canSlide}
              allowTouchMove={canSlide}
              watchOverflow
              className="
                w-full
                showcase-products-swiper

                [&_.swiper-wrapper]:items-stretch
                [&_.swiper-slide]:h-auto
              "
              slidesPerView={1.12}
              spaceBetween={12}
              breakpoints={{
                480: {
                  slidesPerView: 1.45,
                  spaceBetween: 14,
                },

                640: {
                  slidesPerView: 2.1,
                  spaceBetween: 16,
                },

                768: {
                  slidesPerView: 2.55,
                  spaceBetween: 18,
                },

                1024: {
                  slidesPerView: 3.15,
                  spaceBetween: 20,
                },

                1280: {
                  slidesPerView: 3.7,
                  spaceBetween: 22,
                },

                1536: {
                  slidesPerView: 4.15,
                  spaceBetween: 24,
                },
              }}
            >
              {products.map((item) => (
                <SwiperSlide key={item.id} className="h-auto">
                  <div
                    className="
                      h-full
                    "
                  >
                    <ShowcaseProductCard product={item.product} />
                  </div>
                </SwiperSlide>
              ))}
            </Swiper>
          </div>

          {/* Mobile swipe hint */}
          {canSlide && (
            <div
              className="
                mt-4
                flex
                items-center
                gap-2
                sm:hidden
              "
              aria-hidden="true"
            >
              <span className="h-px flex-1 bg-first/10" />

              <div className="flex items-center gap-1.5">
                <span className="size-1 rounded-full bg-first/20" />
                <span className="h-1 w-5 rounded-full bg-third/70" />
                <span className="size-1 rounded-full bg-first/20" />
              </div>

              <span className="h-px flex-1 bg-first/10" />
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default NewestProducts;
