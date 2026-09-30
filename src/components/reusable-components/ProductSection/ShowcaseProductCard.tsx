import { useState } from 'react';
import { ImageOff, LoaderCircle } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';

import { CartIcon } from '@/components/ui/CartIcon';
import { PriceDisplay } from '@/components/ui/PriceDisplay';
import { useToast } from '@/context/ToastContext';
import useAddToCart from '@/hooks/cart/useAddToCart';
import { useLocalizedPath } from '@/hooks/useLocalizedPath';
import { useLangStore } from '@/stores/languageStore';
import type { Language, Product } from '@/types';
import { cn } from '@/utils/cn';
import useDiscountOfferTime from '@/utils/discountOffterTime';

interface ShowcaseProductCardProps {
  product: Product;
  tabIndex?: number;
  className?: string;
  variant?: 'default' | 'deals' | 'mostViewed';
}

const DealsCardCountdown = ({ endDate, lang }: { endDate: string; lang: Language }) => {
  const { t } = useTranslation();
  const timeLeft = useDiscountOfferTime(endDate);

  if (!timeLeft.isValid || timeLeft.isExpired) return null;

  const formatter = new Intl.NumberFormat(lang === 'fa' ? 'fa-IR' : 'en-US', {
    minimumIntegerDigits: 2,
    useGrouping: false,
  });
  const offerEndsIn = t('mainpage.discount.offerEndsIn');
  const units = [
    { value: timeLeft.days * 24 + timeLeft.hours, label: t('mainpage.discount.hours') },
    { value: timeLeft.minutes, label: t('mainpage.discount.minutes') },
    { value: timeLeft.seconds, label: t('mainpage.discount.seconds') },
  ];

  return (
    <div
      role="timer"
      aria-label={`${offerEndsIn}: ${units.map(({ value, label }) => `${formatter.format(value)} ${label}`).join(lang === 'fa' ? '، ' : ', ')}`}
      dir={lang === 'fa' ? 'rtl' : 'ltr'}
      className="absolute top-4 left-4 z-10 inline-flex max-w-[calc(100%-1.5rem)] items-center gap-2 rounded-lg bg-white px-2 py-1.5"
    >
      <span
        dir="ltr"
        aria-hidden="true"
        className="inline-flex shrink-0 items-center whitespace-nowrap text-base leading-5 font-f-bold tabular-nums text-red-600"
      >
        {units.map(({ value, label }, index) => (
          <span key={label} className="inline-flex items-center gap-1">
            {index > 0 && <span>:</span>}
            <span>{formatter.format(value)}</span>
          </span>
        ))}
      </span>
      <span aria-hidden="true" className="relative mb-1 flex size-2 shrink-0">
        <span className="absolute inline-flex size-full animate-ping rounded-full bg-red-400 opacity-70 motion-reduce:animate-none" />
        <span className="relative inline-flex size-2 rounded-full bg-red-600" />
      </span>
    </div>
  );
};

const ShowcaseProductCard = ({
  product,
  tabIndex,
  className,
  variant = 'default',
}: ShowcaseProductCardProps) => {
  const { t } = useTranslation();
  const localizedPath = useLocalizedPath();
  const lang = useLangStore((state) => state.lang);
  const { success, error } = useToast();
  const addToCart = useAddToCart();
  const [imageFailed, setImageFailed] = useState(false);
  const isDealsVariant = variant === 'deals';
  const hasCartButton = isDealsVariant || variant === 'mostViewed';

  const productName = lang === 'en' ? product.nameEn || product.name : product.name;
  const productId = Number(product.id);
  const canAddToCart = product.inStock && Number.isFinite(productId);
  const originalPrice = product.originalPrice ?? 0;
  const hasDiscount = originalPrice > product.price;
  const discountPercent =
    typeof product.discount === 'number' &&
    Number.isFinite(product.discount) &&
    product.discount > 0
      ? Math.round(product.discount)
      : hasDiscount
        ? Math.round(((originalPrice - product.price) / originalPrice) * 100)
        : 0;
  const saleEndDate = isDealsVariant
    ? [product.saleEndDateUtc, product.saleEndDate].find(
        (value) => value && Date.parse(value) > Date.now(),
      )
    : undefined;
  const outOfStockBadge = (
    <span className="inline-flex min-h-9 shrink-0 items-center gap-2 rounded-xl bg-text px-2.5 text-xs font-f-sbold text-surface">
      <span className="size-2 rounded-full bg-red-500" aria-hidden="true" />
      {t('common.outOfStock')}
    </span>
  );

  return (
    <article
      className={cn(
        'group relative mx-auto w-full rounded-[32px] transition-transform duration-300 ease-out motion-safe:hover:-translate-y-1 motion-safe:focus-within:-translate-y-1',
        isDealsVariant ? 'h-[570px] max-w-[390px]' : 'h-[508px] max-w-[310px]',
        className,
      )}
    >
      <div className="flex h-full min-h-0 flex-col gap-2 rounded-[32px]">
        <Link
          to={localizedPath(`/products/${product.slug}`)}
          tabIndex={tabIndex}
          className="absolute inset-0 z-10 rounded-[32px] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-first"
          aria-label={`${t('common.viewProduct')}: ${productName}${product.inStock ? '' : ` — ${t('common.outOfStock')}`}`}
        />
        <div
          className={cn(
            'relative shrink-0 overflow-hidden rounded-t-[32px] rounded-b-lg border border-border bg-white',
            isDealsVariant ? 'flex h-[350px] items-center justify-center p-6' : 'aspect-square',
            isDealsVariant && saleEndDate && 'pt-14',
          )}
        >
          {product.image && !imageFailed ? (
            <img
              src={product.image}
              alt={productName}
              loading="lazy"
              decoding="async"
              className={cn(
                'h-full w-full transition-transform duration-300 ease-out motion-safe:group-hover:scale-[1.03] motion-safe:group-focus-within:scale-[1.03]',
                isDealsVariant ? 'max-h-[260px] max-w-[260px] object-contain' : 'object-cover',
              )}
              onError={() => setImageFailed(true)}
            />
          ) : (
            <div className="flex h-full w-full flex-col items-center justify-center gap-2 text-text-muted">
              <ImageOff className="size-10 opacity-50" strokeWidth={1.4} aria-hidden="true" />
              <span className="text-xs">{t('common.product')}</span>
            </div>
          )}

          {saleEndDate && <DealsCardCountdown endDate={saleEndDate} lang={lang} />}

          {discountPercent > 0 && (
            <span
              dir="ltr"
              className={cn(
                'absolute right-3 inline-flex items-center rounded-xl bg-red-700 px-3 py-1.5 text-xs leading-4 font-f-sbold text-white ring-2 ring-white/90',
                isDealsVariant ? 'bottom-3' : 'top-3',
              )}
            >
              {discountPercent}%
            </span>
          )}
        </div>

        <div
          className={cn(
            'flex min-h-0 flex-1 flex-col justify-center rounded-t-lg rounded-b-[32px] bg-surface px-4 transition-shadow duration-300 group-hover:shadow-[0_4px_10px_0_#00000014]',
            isDealsVariant ? 'py-5' : 'py-6',
          )}
        >
          <span className="truncate text-start text-xs leading-[18px] font-f-sbold text-first">
            {product.category || t('common.product')}
          </span>
          <h3
            className="mt-1 line-clamp-2 text-start text-sm leading-5 font-f-sbold text-text"
            title={productName}
          >
            {productName}
          </h3>

          <div
            className="mt-4 mb-4 h-px shrink-0 bg-[repeating-linear-gradient(to_right,var(--color-border)_0_5px,transparent_5px_10px)]"
            aria-hidden="true"
          />

          <div dir="rtl" className="flex flex-wrap items-end justify-between gap-2">
            <div
              dir={lang === 'fa' ? 'rtl' : 'ltr'}
              className="flex min-w-0 flex-col items-end gap-0.5"
            >
              {product.inStock || !hasCartButton ? (
                <>
                  <PriceDisplay
                    amount={product.price}
                    languageCode={lang}
                    className="whitespace-nowrap text-lg leading-6 font-f-sbold text-text"
                    currencyClassName="text-xs font-f-normal text-text-muted"
                  />
                  {hasDiscount && (
                    <PriceDisplay
                      amount={originalPrice}
                      languageCode={lang}
                      currencyMode="none"
                      className="text-xs leading-4 text-text-muted line-through"
                    />
                  )}
                </>
              ) : (
                outOfStockBadge
              )}
            </div>

            {hasCartButton ? (
              <button
                type="button"
                className="relative z-20 inline-flex size-11 shrink-0 items-center justify-center rounded-2xl bg-first text-white transition-colors hover:bg-first-600 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-first disabled:cursor-not-allowed disabled:bg-text-muted"
                aria-label={
                  canAddToCart ? `${t('common.addToCart')}: ${productName}` : t('common.outOfStock')
                }
                title={canAddToCart ? t('common.addToCart') : t('common.outOfStock')}
                disabled={!canAddToCart || addToCart.isPending}
                onClick={() => {
                  addToCart.mutate(
                    { productId, quantity: 1 },
                    {
                      onSuccess: () => success(t('cart.itemAddedSuccessfully')),
                      onError: () => error(t('common.error')),
                    },
                  );
                }}
              >
                {addToCart.isPending ? (
                  <LoaderCircle
                    className="size-5 animate-spin motion-reduce:animate-none"
                    aria-hidden="true"
                  />
                ) : (
                  <CartIcon />
                )}
              </button>
            ) : product.inStock ? (
              <span
                className="inline-flex size-11 shrink-0 items-center justify-center rounded-2xl bg-first text-white transition-colors group-hover:bg-first-600"
                aria-hidden="true"
              >
                <CartIcon />
              </span>
            ) : (
              outOfStockBadge
            )}
          </div>
        </div>
      </div>
    </article>
  );
};

export default ShowcaseProductCard;
