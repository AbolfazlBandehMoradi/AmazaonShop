import { useMemo, useRef } from 'react';
import { ArrowLeft, ArrowRight, Clock3, ShoppingBag } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import type { Swiper as SwiperType } from 'swiper';
import { A11y, Autoplay } from 'swiper/modules';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/swiper.css';

import { PriceDisplay } from '@/components/ui/PriceDisplay';
import RemainingTime from '@/components/ui/RemainingTime';
import { useLocalizedPath } from '@/hooks/useLocalizedPath';
import { useLangStore } from '@/stores/languageStore';
import type { Product } from '@/types';
import cleanText from '@/utils/cleanText';

interface Props {
  discountedProduct: Product[];
}

interface DiscountedProductSlideProps {
  product: Product;
}

const MOCK_OFFER_DURATION_MS = 3 * 24 * 60 * 60 * 1000;

const DiscountedProductSlide = ({ product }: DiscountedProductSlideProps) => {
  const { t } = useTranslation();
  const localizedPath = useLocalizedPath();
  const { dir, lang } = useLangStore();
  const currency = 'IRT';
  const backendExpireDate = product.saleEndDateUtc || product.saleEndDate;

  const expireDate = useMemo(() => {
    if (backendExpireDate && Number.isFinite(Date.parse(backendExpireDate))) {
      return backendExpireDate;
    }

    return new Date(Date.now() + MOCK_OFFER_DURATION_MS).toISOString();
  }, [backendExpireDate, product.id]);

  const name = lang === 'en' ? product.nameEn || product.name : product.name;
  const description = cleanText(
    lang === 'en' ? product.descriptionEn || product.description : product.description,
  );
  const originalPrice =
    typeof product.originalPrice === 'number' && product.originalPrice > product.price
      ? product.originalPrice
      : null;
  const discount =
    product.discount ??
    (originalPrice ? Math.round(((originalPrice - product.price) / originalPrice) * 100) : 0);
  const ForwardIcon = dir === 'rtl' ? ArrowLeft : ArrowRight;

  return (
    <article
      dir="ltr"
      className="grid overflow-hidden rounded-3xl border border-secound/10 bg-color-for-layer-on-body lg:min-h-118 lg:grid-cols-[minmax(0,40fr)_minmax(0,60fr)]"
    >
      <div className="relative flex min-h-68 items-center justify-center overflow-hidden bg-[linear-gradient(145deg,color-mix(in_srgb,var(--color-secound)_8%,var(--bg-color-for-layer-sec)),color-mix(in_srgb,var(--color-secound)_16%,var(--bg-color-for-layer-sec)))] p-6 sm:min-h-84 sm:p-9 lg:min-h-118 lg:p-10">
        <span
          aria-hidden="true"
          className="absolute size-60 rounded-full bg-third/25 blur-3xl sm:size-80"
        />
        <span
          aria-hidden="true"
          className="absolute size-48 rounded-full border border-secound/15 sm:size-64"
        />
        <span
          aria-hidden="true"
          className="absolute size-64 rounded-full border border-third/20 sm:size-84"
        />

        {discount > 0 ? (
          <span
            dir={dir}
            className="absolute top-5 start-5 z-20 inline-flex items-center rounded-full bg-secound px-4 py-2 text-sm font-f-bold text-white shadow-lg shadow-secound/20 sm:top-7 sm:start-7"
          >
            {discount}% {t('mainpage.featured.discountBadge')}
          </span>
        ) : null}

        <img
          src={product.image}
          alt={name}
          loading="lazy"
          className="relative z-10 h-full max-h-76 w-full object-contain drop-shadow-[0_24px_32px_rgba(20,29,38,0.15)] transition-transform duration-500 hover:scale-105 sm:max-h-84 lg:max-h-88"
        />
      </div>

      <div dir={dir} className="flex min-w-0 flex-col justify-between p-6 sm:p-9 lg:p-10 xl:p-12">
        <div>
          <span className="inline-flex items-center gap-2 rounded-full bg-third/10 px-4 py-2 text-xs font-f-sbold text-third-700">
            <span className="size-2 animate-pulse rounded-full bg-secound" aria-hidden="true" />
            {t('mainpage.discount.limitedOffer')}
          </span>

          <h2 className="mt-5 text-2xl leading-9 font-s-sbold first-text-color sm:text-3xl sm:leading-11">
            {name}
          </h2>

          {description ? (
            <p className="mt-3 line-clamp-3 max-w-2xl text-sm leading-8 first-text-color-for-paragraph sm:text-base">
              {description}
            </p>
          ) : null}

          <div className="mt-7 overflow-hidden rounded-2xl border border-secound/15 bg-[linear-gradient(135deg,color-mix(in_srgb,var(--color-secound)_6%,var(--bg-color-for-layer-sec)),color-mix(in_srgb,var(--color-secound)_12%,var(--bg-color-for-layer-sec)))] p-4 sm:p-5">
            <div className="mb-4 flex items-center gap-3">
              <span className="flex size-10 items-center justify-center rounded-xl bg-secound text-white shadow-sm shadow-secound/20">
                <Clock3 className="size-5" strokeWidth={1.8} aria-hidden="true" />
              </span>
              <span className="text-sm font-f-sbold first-text-color">
                {t('mainpage.discount.remainingTime')}
              </span>
            </div>
            <RemainingTime expireDate={expireDate} />
          </div>
        </div>

        <div className="mt-8 flex flex-col gap-5 border-t border-first/10 pt-6 sm:flex-row sm:items-end sm:justify-between">
          <div className="flex min-w-0 flex-col">
            {originalPrice ? (
              <PriceDisplay
                amount={originalPrice}
                currency={currency}
                languageCode={lang}
                currencyMode="none"
                className="text-sm line-through first-text-color-for-paragraph"
              />
            ) : null}
            <PriceDisplay
              amount={product.price}
              currency={currency}
              languageCode={lang}
              className="mt-1 text-2xl font-f-bold first-text-color sm:text-3xl"
              currencyClassName="text-xs font-f-light first-text-color-for-paragraph sm:text-sm"
            />
          </div>

          <Link
            to={localizedPath(`/products/${product.slug}`)}
            className="group inline-flex h-12 items-center justify-center gap-3 rounded-2xl bg-secound px-6 text-sm font-f-sbold text-white transition-colors hover:bg-secound-600 sm:h-14 sm:text-base"
          >
            <ShoppingBag className="size-5" strokeWidth={1.7} aria-hidden="true" />
            <span>{t('mainpage.discount.buy')}</span>
            <ForwardIcon
              className={
                dir === 'rtl'
                  ? 'size-4 transition-transform group-hover:-translate-x-1'
                  : 'size-4 transition-transform group-hover:translate-x-1'
              }
              aria-hidden="true"
            />
          </Link>
        </div>
      </div>
    </article>
  );
};

const DiscountedProducts = ({ discountedProduct }: Props) => {
  const { t } = useTranslation();
  const { dir } = useLangStore();
  const swiperRef = useRef<SwiperType | null>(null);
  const hasMultipleProducts = discountedProduct.length > 1;

  if (discountedProduct.length === 0) {
    return null;
  }

  return (
    <section dir={dir} className="landing-section" aria-label={t('mainpage.discount.limitedOffer')}>
      <div className="landing-container">
        <h2 className="text-xl pt-4 pb-6 font-s-sbold first-text-color sm:text-2xl">
          {t('mainpage.discount.title')}
          <span className="text-secound">{t('mainpage.discount.subtitle')}</span>
        </h2>
        <Swiper
          key={dir}
          dir={dir}
          modules={[A11y, Autoplay]}
          slidesPerView={1}
          spaceBetween={20}
          loop={hasMultipleProducts}
          autoplay={
            hasMultipleProducts
              ? {
                  delay: 6500,
                  disableOnInteraction: false,
                  pauseOnMouseEnter: true,
                }
              : false
          }
          onSwiper={(swiper) => {
            swiperRef.current = swiper;
          }}
        >
          {discountedProduct.map((product) => (
            <SwiperSlide key={product.id} className="h-auto">
              <DiscountedProductSlide product={product} />
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </section>
  );
};

export default DiscountedProducts;
