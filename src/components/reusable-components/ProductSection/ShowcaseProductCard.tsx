import { useState } from 'react';
import { ImageOff } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';

import { CartIcon } from '@/components/ui/CartIcon';
import { PriceDisplay } from '@/components/ui/PriceDisplay';
import { useLocalizedPath } from '@/hooks/useLocalizedPath';
import { useLangStore } from '@/stores/languageStore';
import type { Product } from '@/types';

interface ShowcaseProductCardProps {
  product: Product;
  tabIndex?: number;
}

const ShowcaseProductCard = ({ product, tabIndex }: ShowcaseProductCardProps) => {
  const { t } = useTranslation();
  const localizedPath = useLocalizedPath();
  const lang = useLangStore((state) => state.lang);
  const [imageFailed, setImageFailed] = useState(false);

  const productName = lang === 'en' ? product.nameEn || product.name : product.name;
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

  return (
    <article className="group mx-auto h-[508px] w-full max-w-[310px] rounded-[32px] transition-transform duration-300 ease-out motion-safe:hover:-translate-y-1 motion-safe:focus-within:-translate-y-1">
      <Link
        to={localizedPath(`/products/${product.slug}`)}
        tabIndex={tabIndex}
        className="flex h-full min-h-0 flex-col gap-2 rounded-[32px] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-first"
        aria-label={`${t('common.viewProduct')}: ${productName}${product.inStock ? '' : ` — ${t('common.outOfStock')}`}`}
      >
        <div className="relative aspect-square shrink-0 overflow-hidden rounded-t-[32px] rounded-b-lg border border-border bg-white">
          {product.image && !imageFailed ? (
            <img
              src={product.image}
              alt={productName}
              loading="lazy"
              decoding="async"
              className="h-full w-full object-cover transition-transform duration-300 ease-out motion-safe:group-hover:scale-[1.03] motion-safe:group-focus-within:scale-[1.03]"
              onError={() => setImageFailed(true)}
            />
          ) : (
            <div className="flex h-full w-full flex-col items-center justify-center gap-2 text-text-muted">
              <ImageOff className="size-10 opacity-50" strokeWidth={1.4} aria-hidden="true" />
              <span className="text-xs">{t('common.product')}</span>
            </div>
          )}

          {discountPercent > 0 && (
            <span
              dir="ltr"
              className="absolute top-3 right-3 inline-flex items-center rounded-xl bg-red-700 px-3 py-1.5 text-xs leading-4 font-f-sbold text-white ring-2 ring-white/90"
            >
              {discountPercent}%
            </span>
          )}
        </div>

        <div className="flex min-h-0 flex-1 flex-col rounded-t-lg rounded-b-[32px] bg-surface px-4 py-6 transition-shadow duration-300 group-hover:shadow-[0_8px_8px_2px_#0000001A]">
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
            className="mt-auto mb-4 h-px shrink-0 bg-[repeating-linear-gradient(to_right,var(--color-border)_0_5px,transparent_5px_10px)]"
            aria-hidden="true"
          />

          <div dir="rtl" className="flex flex-wrap items-end justify-between gap-2">
            <div
              dir={lang === 'fa' ? 'rtl' : 'ltr'}
              className="flex min-w-0 flex-col items-end gap-0.5"
            >
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
            </div>

            {product.inStock ? (
              <span
                className="inline-flex size-11 shrink-0 items-center justify-center rounded-2xl bg-first text-white transition-colors group-hover:bg-first-600"
                aria-hidden="true"
              >
                <CartIcon />
              </span>
            ) : (
              <span className="inline-flex min-h-9 shrink-0 items-center gap-2 rounded-xl bg-text px-2.5 text-xs font-f-sbold text-surface">
                <span className="size-2 rounded-full bg-red-500" aria-hidden="true" />
                {t('common.outOfStock')}
              </span>
            )}
          </div>
        </div>
      </Link>
    </article>
  );
};

export default ShowcaseProductCard;
