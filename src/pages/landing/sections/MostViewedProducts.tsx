import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { A11y } from 'swiper/modules';
import { Swiper, SwiperSlide } from 'swiper/react';

import 'swiper/css';

import ShowcaseProductCard from '@/components/reusable-components/ProductSection/ShowcaseProductCard';
import type { Showcase } from '@/hooks/useShowcases';
import { useLangStore } from '@/stores/languageStore';
import { cn } from '@/utils/cn';

interface Props {
  showcase?: Showcase;
}

const MostViewedProducts = ({ showcase }: Props) => {
  const { t } = useTranslation();
  const { dir } = useLangStore();

  const isRtl = dir === 'rtl';

  const products = useMemo(
    () =>
      [...(showcase?.items ?? [])].sort(
        (a, b) => a.sortOrder - b.sortOrder,
      ),
    [showcase?.items],
  );

  const showcaseTitle =
    showcase?.translation?.title?.trim() ||
    [
      t('mainpage.mostViewedProducts.titlePrefix'),
      t('mainpage.mostViewedProducts.titleAccent'),
      t('mainpage.mostViewedProducts.titleSuffix'),
    ]
      .filter(Boolean)
      .join(' ');

  if (!products.length) {
    return null;
  }

  return (
    <section
      dir={dir}
      className="landing-section overflow-hidden"
      aria-labelledby="most-viewed-products-title"
    >
      <div className="landing-container">
        {/* Section heading */}
        <div className="flex items-center gap-2.5 sm:gap-3">
          {/* Minimal section marker */}
          <span
            aria-hidden="true"
            className="
              w-2.5
              h-[18px]
              mt-1
              shrink-0
              rounded-full
              bg-third
            "
          />

          <h2
            id="most-viewed-products-title"
            className="
              shrink-0
              text-lg
              font-s-sbold
              first-text-color
              sm:text-xl
              lg:text-2xl
            "
          >
            {showcaseTitle}
          </h2>

          {/* Fading divider */}
          <span
            aria-hidden="true"
            className={cn(
              `
                h-0.5
                rounded-full
                min-w-0
                flex-1
                mx-1.5
              `,
              isRtl
                ? `
                  bg-gradient-to-l
                  from-first/20
                  via-first/10
                  to-transparent
                `
                : `
                  bg-gradient-to-r
                  from-first/20
                  via-first/10
                  to-transparent
                `,
            )}
          />
        </div>

        {/* Product slider */}
        <div className="showcase-products-slider-frame overflow-hidden mt-5 min-w-0 sm:mt-6">
          <Swiper
            key={`${showcase?.id ?? 'most-viewed-products'}-${dir}`}
            dir={dir}
            modules={[A11y]}
            className="
              w-full
              showcase-products-swiper

              [&_.swiper-wrapper]:items-stretch
              [&_.swiper-slide]:h-auto
            "
            slidesPerView={1.12}
            spaceBetween={12}
            grabCursor={products.length > 1}
            allowTouchMove={products.length > 1}
            watchOverflow
            a11y={{
              enabled: true,
            }}
            breakpoints={{
              480: {
                slidesPerView: 1.4,
                spaceBetween: 14,
              },

              640: {
                slidesPerView: 2.05,
                spaceBetween: 16,
              },

              768: {
                slidesPerView: 2.5,
                spaceBetween: 16,
              },

              1024: {
                slidesPerView: 3,
                spaceBetween: 18,
              },

              1280: {
                slidesPerView: 4,
                spaceBetween: 20,
              },

              1536: {
                slidesPerView: 4,
                spaceBetween: 24,
              },
            }}
          >
            {products.map((item) => (
              <SwiperSlide
                key={item.id}
                className="h-auto"
              >
                <ShowcaseProductCard
                  product={item.product}
                />
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      </div>
    </section>
  );
};

export default MostViewedProducts;
