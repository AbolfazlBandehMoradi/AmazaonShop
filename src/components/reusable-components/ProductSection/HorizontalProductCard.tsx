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
import type { Product } from '@/types';
import cardBackground from './horizental card bg.svg';
import './HorizontalProductCard.css';

interface Props {
  product: Product;
}

const HorizontalProductCard = ({ product }: Props) => {
  const { t } = useTranslation();
  const localizedPath = useLocalizedPath();
  const lang = useLangStore((state) => state.lang);
  const { success, error } = useToast();
  const addToCart = useAddToCart();
  const [imageFailed, setImageFailed] = useState(false);
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

  return (
    <article className="horizontal-product-card group relative w-full transition-transform duration-300 motion-safe:hover:-translate-y-1 motion-safe:focus-within:-translate-y-1">
      <img
        src={cardBackground}
        alt=""
        aria-hidden="true"
        draggable={false}
        className="pointer-events-none absolute inset-0 h-full w-full"
      />
      <Link
        to={localizedPath(`/products/${product.slug}`)}
        dir="ltr"
        className="horizontal-product-card__link absolute inset-0 z-10 rounded-[32px] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-first"
        aria-label={`${t('common.viewProduct')}: ${productName}${product.inStock ? '' : ` — ${t('common.outOfStock')}`}`}
      >
        <div
          className="horizontal-product-card__copy min-w-0 text-start"
          dir={lang === 'fa' ? 'rtl' : 'ltr'}
        >
          <span className="block truncate text-xs leading-5 font-f-sbold text-first">
            {product.category || t('common.product')}
          </span>
          <h3
            className="horizontal-product-card__name line-clamp-2 font-f-sbold text-text"
            title={productName}
          >
            {productName}
          </h3>

          <div
            className="horizontal-product-card__price-wrap mt-auto flex flex-col items-start gap-0.5 text-text"
            dir={lang === 'fa' ? 'rtl' : 'ltr'}
          >
            {product.inStock ? (
              <>
                <PriceDisplay
                  amount={product.price}
                  languageCode={lang}
                  className="horizontal-product-card__price font-f-sbold"
                  currencyClassName="text-xs font-f-normal text-text-muted"
                />
                {hasDiscount && (
                  <PriceDisplay
                    amount={originalPrice}
                    languageCode={lang}
                    currencyMode="none"
                    className="horizontal-product-card__original-price text-xs leading-4 text-text-muted line-through"
                  />
                )}
              </>
            ) : (
              <span className="horizontal-product-card__badge inline-flex min-h-9 shrink-0 items-center gap-2 rounded-xl bg-text px-2.5 text-xs font-f-sbold text-surface">
                <span
                  className="horizontal-product-card__status-dot size-2 rounded-full bg-red-500"
                  aria-hidden="true"
                />
                {t('common.outOfStock')}
              </span>
            )}
          </div>
        </div>

        <div className="horizontal-product-card__image relative flex items-center justify-center overflow-hidden bg-white p-2">
          {product.image && !imageFailed ? (
            <img
              src={product.image}
              alt=""
              loading="lazy"
              decoding="async"
              onError={() => setImageFailed(true)}
              className="h-full w-full object-contain transition-transform duration-300 motion-safe:group-hover:scale-[1.04]"
            />
          ) : (
            <ImageOff className="size-8 text-text-muted/50" strokeWidth={1.5} aria-hidden="true" />
          )}

          {discountPercent > 0 && (
            <span
              dir="ltr"
              className="horizontal-product-card__badge absolute top-3 right-3 z-10 shrink-0 rounded-xl bg-red-700 px-3 py-1.5 text-xs leading-4 font-f-sbold text-white ring-2 ring-white/90"
            >
              {discountPercent}%
            </span>
          )}
        </div>
      </Link>

      <button
        type="button"
        className="horizontal-product-card__cart absolute bottom-0 z-20 -translate-x-1/2 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-first disabled:cursor-not-allowed"
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
        <span className="horizontal-product-card__cart-visual">
          {addToCart.isPending ? (
            <LoaderCircle
              className="size-4 animate-spin motion-reduce:animate-none"
              aria-hidden="true"
            />
          ) : (
            <CartIcon />
          )}
        </span>
      </button>
    </article>
  );
};

export default HorizontalProductCard;
