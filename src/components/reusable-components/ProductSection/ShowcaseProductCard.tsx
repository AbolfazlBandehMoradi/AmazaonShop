import { useState } from 'react';
import { BadgePercent, ImageOff } from 'lucide-react';
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
    <article className="group relative mx-auto h-[508px] w-full max-w-[310px] rounded-[32px]">
      <Link
        to={localizedPath(`/products/${product.slug}`)}
        tabIndex={tabIndex}
        className="flex h-full min-h-0 flex-col gap-2 rounded-[32px] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-first"
        aria-label={`${t('common.viewProduct')}: ${productName}`}
      >
        <div className="relative aspect-square shrink-0 overflow-hidden rounded-t-[32px] rounded-b-lg border border-border bg-white">
          {product.image && !imageFailed ? (
            <img
              src={product.image}
              alt={productName}
              loading="lazy"
              decoding="async"
              className="h-full w-full object-cover"
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
              className="absolute top-3 right-3 inline-flex items-center gap-1.5 rounded-xl border border-white/80 bg-white/90 px-2.5 py-1.5 text-xs leading-4 font-f-sbold text-secound-700 shadow-[0_4px_16px_#0000001A] backdrop-blur-md"
            >
              <BadgePercent className="size-3.5" strokeWidth={1.8} aria-hidden="true" />
              {discountPercent}%
            </span>
          )}

          {!product.inStock && (
            <span className="absolute top-3 left-3 rounded-lg bg-text/75 px-2.5 py-1 text-xs leading-5 font-f-sbold text-white">
              {t('common.outOfStock')}
            </span>
          )}
        </div>

        <div className="flex min-h-0 flex-1 flex-col rounded-t-lg rounded-b-[32px] bg-surface px-4 py-6">
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

          <div dir="rtl" className="flex items-end justify-between gap-2">
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

            <span
              className="inline-flex size-11 shrink-0 items-center justify-center rounded-2xl bg-first text-white transition-colors group-hover:bg-first-600"
              aria-hidden="true"
            >
              <CartIcon />
            </span>
          </div>
        </div>
      </Link>
      <span
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-4 bottom-0 h-px rounded-full bg-surface opacity-0 shadow-surface transition-opacity duration-300 group-hover:opacity-100 group-focus-within:opacity-100"
      />
    </article>
  );
};

export default ShowcaseProductCard;
