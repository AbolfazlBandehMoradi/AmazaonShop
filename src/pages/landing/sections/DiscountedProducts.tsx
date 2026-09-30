import { useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import type { Swiper as SwiperType } from 'swiper';
import { A11y, Keyboard } from 'swiper/modules';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/swiper.css';

import ShowcaseProductCard from '@/components/reusable-components/ProductSection/ShowcaseProductCard';
import { useLangStore } from '@/stores/languageStore';
import type { Product } from '@/types';

interface Props {
  discountedProduct: Product[];
}

const DiscountedProducts = ({ discountedProduct }: Props) => {
  const { t } = useTranslation();
  const { dir } = useLangStore();
  const swiperRef = useRef<SwiperType | null>(null);
  const [activeSnap, setActiveSnap] = useState(0);
  const [snapCount, setSnapCount] = useState(discountedProduct.length);

  const updateSliderState = (swiper: SwiperType) => {
    setActiveSnap(swiper.snapIndex);
    setSnapCount(swiper.snapGrid.length);
  };

  if (discountedProduct.length === 0) return null;

  return (
    <section dir={dir} className="landing-section" aria-labelledby="deals-title">
      <div className="landing-container">
        <div className="deals-panel">
          <div className="deals-panel__background" aria-hidden="true" />
          <div className="deals-panel__content">
            <div className="deals-panel__header">
              <h2
                id="deals-title"
                className="mt-6 text-center text-[18px] leading-7 font-f-bold text-white sm:text-[20px] xl:text-[24px] xl:leading-8"
              >
                {t('mainpage.discount.title')}
              </h2>
            </div>

            <div className="deals-panel__slider">
              <Swiper
                key={dir}
                dir={dir}
                modules={[A11y, Keyboard]}
                keyboard={{ enabled: true, onlyInViewport: true }}
                slidesPerView={1}
                spaceBetween={16}
                breakpoints={{
                  480: { slidesPerView: 1, spaceBetween: 18 },
                  640: { slidesPerView: 2, spaceBetween: 16 },
                  768: { slidesPerView: 2, spaceBetween: 20 },
                  1024: { slidesPerView: 2.5, spaceBetween: 24 },
                  1280: { slidesPerView: 3, spaceBetween: 27 },
                }}
                grabCursor={discountedProduct.length > 1}
                watchOverflow
                onSwiper={(swiper) => {
                  swiperRef.current = swiper;
                  updateSliderState(swiper);
                }}
                onSlideChange={updateSliderState}
                onResize={updateSliderState}
                onLock={updateSliderState}
                onUnlock={updateSliderState}
                className="deals-slider"
              >
                {discountedProduct.map((product) => (
                  <SwiperSlide key={product.id}>
                    <ShowcaseProductCard product={product} variant="deals" />
                  </SwiperSlide>
                ))}
              </Swiper>
            </div>

            {snapCount > 1 && (
              <div
                className="deals-panel__pagination"
                role="group"
                aria-label={t('mainpage.discount.pagination')}
              >
                {Array.from({ length: snapCount }, (_, index) => (
                  <button
                    key={index}
                    type="button"
                    onClick={() => swiperRef.current?.slideTo(index)}
                    aria-label={t('mainpage.discount.goToSlide', { number: index + 1 })}
                    aria-current={index === activeSnap ? 'true' : undefined}
                    className="flex h-8 items-center justify-center px-1 focus-visible:rounded-full focus-visible:outline-2 focus-visible:outline-first"
                  >
                    <span
                      className={`block h-2.5 rounded-full bg-[#18183E] transition-all duration-200 dark:bg-white ${index === activeSnap ? 'w-8 opacity-100' : 'w-2.5 opacity-20 hover:opacity-50'}`}
                      aria-hidden="true"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default DiscountedProducts;
