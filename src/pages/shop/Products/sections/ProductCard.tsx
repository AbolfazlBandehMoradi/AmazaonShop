import { Clock3, ImageOff, ShoppingCart, Star, Truck } from 'lucide-react';
import { Link } from 'react-router';
import { useTranslation } from '@/i18n/useTranslation';
import { useLocalizedPath } from '@/hooks/useLocalizedPath';
import { PriceDisplay } from '@/components/ui/PriceDisplay';
import {
  type CatalogProduct,
  getProductTranslation,
  isProductInStock,
} from '@/types/productView.types';
import { type Language } from '@/types';
import { memo, useEffect, useMemo, useState } from 'react';
import cleanText from '@/utils/cleanText';
import formatRating from '@/utils/formatRating';
import { cn } from '@/utils/cn';

type ProductCardProps = {
  product: CatalogProduct;
  lang: Language;
  getImageUrl: (product: CatalogProduct) => string | null;
};

type RemainingTime = {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  isExpired: boolean;
};

type OfferCountdownProps = {
  lang: Language;
  saleEndDateUtc: string;
  labels: {
    timeLeft: string;
    days: string;
    hours: string;
    minutes: string;
    seconds: string;
  };
};

type CountdownUnit = {
  id: keyof Pick<RemainingTime, 'days' | 'hours' | 'minutes' | 'seconds'>;
  label: string;
  value: number;
};

type ProductPrice = CatalogProduct['prices'][number];

type ProductWithSaleTimer = CatalogProduct & {
  saleEndDateUtc?: string | null;
  saleEndDate?: string | null;
};

const getRemainingTime = (endAtMs: number): RemainingTime => {
  const difference = Math.max(endAtMs - Date.now(), 0);

  return {
    days: Math.floor(difference / (1000 * 60 * 60 * 24)),
    hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
    minutes: Math.floor((difference / (1000 * 60)) % 60),
    seconds: Math.floor((difference / 1000) % 60),
    isExpired: difference === 0,
  };
};

const getFutureDateValue = (value?: string | null): string | null => {
  if (!value) {
    return null;
  }

  const parsedValue = Date.parse(value);

  if (!Number.isFinite(parsedValue) || parsedValue <= Date.now()) {
    return null;
  }

  return value;
};

const resolveSaleEndDate = (
  product: CatalogProduct,
  localizedPrice?: ProductPrice,
): string | null => {
  const productWithTimer = product as ProductWithSaleTimer;

  return (
    getFutureDateValue(localizedPrice?.saleEndDateUtc) ??
    getFutureDateValue(productWithTimer.saleEndDateUtc) ??
    getFutureDateValue(localizedPrice?.saleEndDate) ??
    getFutureDateValue(productWithTimer.saleEndDate)
  );
};

const formatCountdownText = (
  remainingTime: RemainingTime,
  lang: Language,
  numberFormatter: Intl.NumberFormat,
) => {
  const units =
    remainingTime.days > 0
      ? [
          { key: lang === 'fa' ? '\u0631' : 'd', value: remainingTime.days },
          { key: lang === 'fa' ? '\u0633' : 'h', value: remainingTime.hours },
          { key: lang === 'fa' ? '\u062f' : 'm', value: remainingTime.minutes },
        ]
      : [
          { key: lang === 'fa' ? '\u0633' : 'h', value: remainingTime.hours },
          { key: lang === 'fa' ? '\u062f' : 'm', value: remainingTime.minutes },
          { key: lang === 'fa' ? '\u062b' : 's', value: remainingTime.seconds },
        ];

  return units.map((unit) => `${numberFormatter.format(unit.value)}${unit.key}`).join(' ');
};

const OfferCountdown = memo(function OfferCountdown({
  lang,
  saleEndDateUtc,
  labels,
}: OfferCountdownProps) {
  const endAtMs = useMemo(() => Date.parse(saleEndDateUtc), [saleEndDateUtc]);
  const locale = lang === 'fa' ? 'fa-IR' : 'en-US';
  const numberFormatter = useMemo(
    () =>
      new Intl.NumberFormat(locale, {
        minimumIntegerDigits: 2,
        useGrouping: false,
      }),
    [locale],
  );
  const [remainingTime, setRemainingTime] = useState<RemainingTime | null>(() =>
    Number.isFinite(endAtMs) ? getRemainingTime(endAtMs) : null,
  );

  useEffect(() => {
    if (!Number.isFinite(endAtMs)) {
      setRemainingTime(null);
      return;
    }

    let intervalId: number | undefined;

    const updateTime = () => {
      const nextTime = getRemainingTime(endAtMs);
      setRemainingTime(nextTime);

      if (nextTime.isExpired && intervalId !== undefined) {
        window.clearInterval(intervalId);
      }
    };

    updateTime();
    intervalId = window.setInterval(updateTime, 1000);

    return () => {
      if (intervalId !== undefined) {
        window.clearInterval(intervalId);
      }
    };
  }, [endAtMs]);

  if (!remainingTime || remainingTime.isExpired) {
    return null;
  }

  const units: CountdownUnit[] = [
    { id: 'days', label: labels.days, value: remainingTime.days },
    { id: 'hours', label: labels.hours, value: remainingTime.hours },
    { id: 'minutes', label: labels.minutes, value: remainingTime.minutes },
    { id: 'seconds', label: labels.seconds, value: remainingTime.seconds },
  ];
  const countdownText = formatCountdownText(remainingTime, lang, numberFormatter);

  return (
    <div
      className={'absolute bottom-3 z-20 left-3 flex-row inline-flex max-w-[calc(100%-1.5rem)] items-center gap-1.5'}
      dir="ltr"
      aria-label={`${labels.timeLeft}: ${countdownText}`}
    >
      <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-secound text-white shadow-[0_8px_18px_rgba(192,57,43,0.24)]">
        <Clock3 className="h-3.5 w-3.5" strokeWidth={1.9} aria-hidden="true" />
      </span>

      {units.map((unit) => (
        <span
          key={unit.id}
          className="flex h-7 min-w-8 items-center justify-center gap-0.5 rounded-lg bg-color-for-tooltip px-1.5 text-xs font-f-bold tabular-nums text-color-for-tooltip shadow-[0_8px_18px_rgba(20,29,38,0.18)] backdrop-blur-[2px] sm:text-sm"
        >
          <span>{numberFormatter.format(unit.value)}</span>
          <span className="text-[0.58rem] font-f-bold uppercase leading-none text-white/80 sm:text-[0.65rem]">
            {unit.label}
          </span>
        </span>
      ))}
    </div>
  );
});

export default function ProductCard({ product, lang, getImageUrl }: ProductCardProps) {
  const { t } = useTranslation();
  const localizedPath = useLocalizedPath();
  const [imageFailed, setImageFailed] = useState(false);

  const translation = getProductTranslation(product, lang);
  const productPath = localizedPath(`/products/${product.slug}`);
  const productName = translation?.name ?? product.name;
  const description = cleanText(translation?.shortDescription ?? translation?.description ?? '');
  const inStock = isProductInStock(product);
  const imageUrl = getImageUrl(product);
  const showImage = Boolean(imageUrl) && !imageFailed;

  const localizedPrice = useMemo(
    () => product.prices.find((price) => price.languageCode === lang) ?? product.prices[0],
    [lang, product.prices],
  );

  const basePrice = useMemo(
    () => localizedPrice?.originalPrice ?? localizedPrice?.price ?? product.price ?? 0,
    [localizedPrice, product.price],
  );

  const salePrice = useMemo(() => {
    if (typeof localizedPrice?.salePrice === 'number') {
      return localizedPrice.salePrice;
    }

    if (typeof product.salePrice === 'number') {
      return product.salePrice;
    }

    return null;
  }, [localizedPrice?.salePrice, product.salePrice]);

  const hasDiscount =
    typeof salePrice === 'number' &&
    typeof basePrice === 'number' &&
    basePrice > 0 &&
    salePrice > 0 &&
    salePrice < basePrice;

  const currentPrice = hasDiscount ? salePrice : (localizedPrice?.price ?? product.price ?? 0);
  const originalPrice = hasDiscount ? basePrice : undefined;

  const discount = useMemo(() => {
    if (typeof localizedPrice?.discountPercent === 'number') {
      return localizedPrice.discountPercent;
    }

    if (typeof product.discountPercent === 'number') {
      return product.discountPercent;
    }

    if (hasDiscount) {
      return Math.round(((basePrice - currentPrice) / basePrice) * 100);
    }

    return undefined;
  }, [
    localizedPrice?.discountPercent,
    product.discountPercent,
    hasDiscount,
    basePrice,
    currentPrice,
  ]);

  const currency = localizedPrice?.currencyCode ?? product.currencyCode;
  const hasRating = typeof product.rating === 'number' && product.rating > 0;
  const saleEndDate = resolveSaleEndDate(product, localizedPrice);
  const showOfferTimer = hasDiscount && Boolean(saleEndDate);
  const priceCurrencyClassName =
    lang === 'fa'
      ? 'h-4 w-4 first-text-color-for-paragraph'
      : 'text-xs first-text-color-for-paragraph';
  const originalPriceCurrencyClassName =
    lang === 'fa'
      ? 'h-3.5 w-3.5 first-text-color-for-paragraph'
      : 'text-[0.65rem] first-text-color-for-paragraph';

  const labels = {
    freeShipping:
      lang === 'fa'
        ? '\u0627\u0631\u0633\u0627\u0644 \u0631\u0627\u06cc\u06af\u0627\u0646'
        : 'Free shipping',
    unavailableImage:
      lang === 'fa' ? '\u062a\u0635\u0648\u06cc\u0631 \u0646\u062f\u0627\u0631\u062f' : 'No image',
    limitedOffer: t('productsFilter.limitedOffer'),
  };
  const countdownLabels = {
    timeLeft: t('productsFilter.timeLeft'),
    days: t('productsFilter.daysShort'),
    hours: t('productsFilter.hoursShort'),
    minutes: t('productsFilter.minutesShort'),
    seconds: t('productsFilter.secondsShort'),
  };

  return (
    <article
      className={cn(
        'group h-full overflow-hidden rounded-2xl border border-first-100/70 bg-color-for-layer-on-body shadow-[0_8px_24px_rgba(20,29,38,0.06)] transition-all duration-300 hover:-translate-y-1 hover:border-secound/25 hover:shadow-[0_14px_30px_rgba(20,29,38,0.12)]',
        showOfferTimer &&
          'border-secound/35 bg-[linear-gradient(180deg,color-mix(in_srgb,var(--color-secound)_8%,var(--bg-color-for-layer-on-body)),var(--bg-color-for-layer-on-body))] shadow-[0_16px_35px_rgba(192,57,43,0.14)] hover:border-secound/50 hover:shadow-[0_18px_40px_rgba(192,57,43,0.18)]',
      )}
    >
      <Link
        to={productPath}
        className="flex h-full flex-col"
        aria-label={`${t('mainpage.specials.viewProduct')}: ${productName}`}
      >
        <div
          className={cn(
            'relative m-2 flex aspect-3/2 shrink-0 items-center justify-center overflow-hidden rounded-2xl bg-color-for-layer-three',
            showOfferTimer &&
              'bg-[linear-gradient(145deg,color-mix(in_srgb,var(--color-secound)_8%,var(--bg-color-for-layer-sec)),color-mix(in_srgb,var(--color-secound)_16%,var(--bg-color-for-layer-sec)))]',
          )}
        >
          {showImage ? (
            <img
              src={imageUrl ?? undefined}
              alt={product.mainImage?.alt || productName}
              loading="lazy"
              className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
              onError={() => setImageFailed(true)}
            />
          ) : (
            <div className="flex h-full w-full flex-col items-center justify-center gap-2 first-text-color-for-paragraph">
              <ImageOff className="h-10 w-10 opacity-50" strokeWidth={1.4} aria-hidden="true" />
              <span className="text-xs">{labels.unavailableImage}</span>
            </div>
          )}

          {showOfferTimer || (typeof discount === 'number' && discount > 0) || !inStock ? (
            <div className="absolute inset-x-3 top-3 z-20 flex items-start justify-between gap-2">
              <div className="flex min-w-0 flex-1 flex-wrap items-center gap-1.5">
                {showOfferTimer ? (
                  <span className="inline-flex max-w-full items-center gap-1 rounded-full bg-secound px-2.5 py-1 text-[11px] font-f-bold text-white shadow-[0_8px_18px_rgba(192,57,43,0.25)]">
                    <Clock3 className="h-3.5 w-3.5 shrink-0" strokeWidth={1.8} aria-hidden="true" />
                    <span className="min-w-0 truncate">{labels.limitedOffer}</span>
                  </span>
                ) : null}

                {typeof discount === 'number' && discount > 0 ? (
                  <span
                    className={cn(
                      'shrink-0 rounded-full px-2.5 py-1 text-xs font-f-bold shadow-sm',
                      showOfferTimer
                        ? 'border border-secound/15 bg-color-for-layer-on-body text-secound'
                        : 'bg-secound text-white',
                    )}
                  >
                    {discount}%
                  </span>
                ) : null}
              </div>

              {!inStock ? (
                <span className="shrink-0 rounded-full bg-color-for-tooltip px-2.5 py-1 text-xs font-f-sbold text-color-for-tooltip backdrop-blur-sm">
                  {t('productsFilter.outOfStock')}
                </span>
              ) : null}
            </div>
          ) : null}

          {hasRating ? (
            <span
              className={cn(
                'absolute end-3 inline-flex items-center gap-1 rounded-full bg-color-for-layer-on-body px-2.5 py-1 text-xs font-f-sbold first-text-color shadow-sm',
                showOfferTimer ? 'bottom-12' : 'bottom-3',
              )}
            >
              <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" aria-hidden="true" />
              <span>{formatRating(product.rating ?? 0)}</span>
              <span className="first-text-color-for-paragraph">
                {t('mainpage.specials.ratingOutOf')} 5
              </span>
            </span>
          ) : null}

          {showOfferTimer && saleEndDate ? (
            <OfferCountdown lang={lang} saleEndDateUtc={saleEndDate} labels={countdownLabels} />
          ) : null}
        </div>

        <div className="flex flex-1 flex-col px-3.5 pt-1.5 pb-3.5">
          <div className="flex-1">
            {product.freeShipping ? (
              <span className="mb-1.5 inline-flex max-w-full items-center gap-1.5 rounded-full bg-first/10 px-2.5 py-1 text-[11px] font-f-sbold text-first">
                <Truck className="h-3.5 w-3.5 shrink-0" strokeWidth={1.8} aria-hidden="true" />
                <span className="truncate">{labels.freeShipping}</span>
              </span>
            ) : null}

            <h2
              className={cn(
                'line-clamp-2 text-sm font-f-bold leading-6 first-text-color sm:text-base',
                lang === 'fa' ? 'text-right' : 'text-left',
              )}
            >
              {productName}
            </h2>

            <p className="mt-1 line-clamp-1 text-xs leading-5 first-text-color-for-paragraph sm:text-sm">
              {description}
            </p>
          </div>

          <div className="mt-3 flex min-h-11 items-end justify-between gap-3 border-t border-first/10 pt-2.5">
            <div className="flex min-w-0 flex-col items-start gap-1">
              {typeof originalPrice === 'number' && originalPrice > currentPrice ? (
                <PriceDisplay
                  amount={originalPrice}
                  currency={currency}
                  currencyMode="symbol"
                  variant="secondary"
                  languageCode={lang}
                  className="text-xs line-through first-text-color-for-paragraph"
                  currencyClassName={originalPriceCurrencyClassName}
                />
              ) : null}

              <PriceDisplay
                amount={currentPrice}
                currency={currency}
                currencyMode="symbol"
                variant="secondary"
                languageCode={lang}
                className={cn(
                  'text-base font-f-bold sm:text-lg',
                  hasDiscount ? 'text-secound' : 'first-text-color',
                )}
                currencyClassName={priceCurrencyClassName}
              />
            </div>

            <span
              className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-secound/10 text-secound transition-colors group-hover:bg-secound group-hover:text-white"
              aria-hidden="true"
            >
              <ShoppingCart className="h-4 w-4" strokeWidth={1.8} />
            </span>
          </div>
        </div>
      </Link>
    </article>
  );
}
