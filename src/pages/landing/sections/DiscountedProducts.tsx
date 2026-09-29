import { useMemo, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import type { Swiper as SwiperType } from 'swiper';
import { A11y, Keyboard } from 'swiper/modules';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/swiper.css';

import ShowcaseProductCard from '@/components/reusable-components/ProductSection/ShowcaseProductCard';
import { useLangStore } from '@/stores/languageStore';
import type { Product } from '@/types';
import useDiscountOfferTime from '@/utils/discountOffterTime';

interface Props {
  discountedProduct: Product[];
}

const DealsCountdown = ({ endDate }: { endDate: string }) => {
  const { t } = useTranslation();
  const lang = useLangStore((state) => state.lang);
  const timeLeft = useDiscountOfferTime(endDate);

  if (!timeLeft.isValid || timeLeft.isExpired) return null;

  const formatter = new Intl.NumberFormat(lang === 'fa' ? 'fa-IR' : 'en-US', {
    minimumIntegerDigits: 2,
    useGrouping: false,
  });
  const units = [
    { value: timeLeft.days, label: t('mainpage.discount.days') },
    { value: timeLeft.hours, label: t('mainpage.discount.hours') },
    { value: timeLeft.minutes, label: t('mainpage.discount.minutes') },
    { value: timeLeft.seconds, label: t('mainpage.discount.seconds') },
  ];

  return (
    <div
      role="timer"
      aria-label={`${t('mainpage.discount.remainingTime')}: ${units.map(({ value, label }) => `${formatter.format(value)} ${label}`).join(lang === 'fa' ? '، ' : ', ')}`}
      className="inline-flex w-full max-w-[390px] shrink-0 rounded-full border border-white/25 bg-white/10 px-4 py-3 text-white shadow-[0_8px_24px_rgba(12,12,48,0.18)] backdrop-blur-sm sm:w-auto sm:max-w-none"
    >
      <span
        dir="ltr"
        aria-hidden="true"
        className="flex w-full items-center justify-between gap-2 sm:w-auto sm:gap-3"
      >
        {units.map(({ value, label }) => (
          <span key={label} className="flex min-w-9 flex-col items-center gap-1">
            <strong className="text-xl leading-6 font-f-bold tabular-nums">
              {formatter.format(value)}
            </strong>
            <small className="text-[10px] leading-3 text-white/75">{label}</small>
          </span>
        ))}
      </span>
    </div>
  );
};

const DiscountedProducts = ({ discountedProduct }: Props) => {
  const { t } = useTranslation();
  const { dir } = useLangStore();
  const swiperRef = useRef<SwiperType | null>(null);
  const [activeSnap, setActiveSnap] = useState(0);
  const [snapCount, setSnapCount] = useState(discountedProduct.length);

  const saleEndDate = useMemo(() => {
    const now = Date.now();
    let earliestEndDate: string | null = null;
    let earliestEndTime = Infinity;
    for (const product of discountedProduct) {
      for (const endDate of [product.saleEndDateUtc, product.saleEndDate]) {
        const endTime = endDate ? Date.parse(endDate) : Number.NaN;
        if (endDate && endTime > now && endTime < earliestEndTime) {
          earliestEndDate = endDate;
          earliestEndTime = endTime;
        }
      }
    }
    return earliestEndDate;
  }, [discountedProduct]);

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
                className="text-center text-[18px] leading-7 font-f-bold text-white sm:text-[20px] xl:text-[24px] xl:leading-8"
              >
                {t('mainpage.discount.title')}
              </h2>
              {saleEndDate && <DealsCountdown endDate={saleEndDate} />}
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
