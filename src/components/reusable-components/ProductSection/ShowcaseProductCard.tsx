import { useState } from 'react';
import { ImageOff, ShoppingCart, Star } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';

import { PriceDisplay } from '@/components/ui/PriceDisplay';
import { useLocalizedPath } from '@/hooks/useLocalizedPath';
import { useLangStore } from '@/stores/languageStore';
import type { Product } from '@/types';
import cleanText from '@/utils/cleanText';
import { cn } from '@/utils/cn';

export type ProductCardVariant = 'default' | 'compact' | 'hero';

interface ShowcaseProductCardProps {
  product: Product;
  variant?: ProductCardVariant;
  tabIndex?: number;
}

const ShowcaseProductCard = ({
  product,
  variant = 'default',
  tabIndex,
}: ShowcaseProductCardProps) => {
  const { t } = useTranslation();
  const localizedPath = useLocalizedPath();
  const lang = useLangStore((state) => state.lang);
  const [imageFailed, setImageFailed] = useState(false);

  const isHero = variant === 'hero';
  const isCompact = variant === 'compact';
  const productPath = localizedPath(`/products/${product.slug}`);
  const productName = lang === 'en' ? product.nameEn || product.name : product.name;
  const description = cleanText(
    lang === 'en' ? product.descriptionEn || product.description : product.description,
  );
  const rating =
    typeof product.rating === 'number' && Number.isFinite(product.rating) ? product.rating : 5;
  const hasDiscount =
    typeof product.originalPrice === 'number' && product.originalPrice > product.price;

  return (
    <article
      data-variant={variant}
      className={cn(
        'h-full overflow-hidden bg-color-for-layer-on-body transition duration-300',
        isHero ? 'hero-product-card' : 'rounded-2xl hover:-translate-y-1',
      )}
    >
      <Link
        to={productPath}
        tabIndex={tabIndex}
        className={cn(
          'group h-full min-h-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-first/50',
          isHero ? 'hero-product-card__link' : 'flex flex-col',
        )}
        aria-label={`${t('common.viewProduct')}: ${productName}`}
      >
        <div
          className={cn(
            'relative flex shrink-0 items-center justify-center overflow-hidden bg-color-for-layer-three',
            isHero
              ? 'hero-product-card__media'
              : isCompact
                ? 'm-2 aspect-[4/3] rounded-xl'
                : 'm-2 aspect-[286/272] rounded-2xl',
          )}
        >
          {product.image && !imageFailed ? (
            <img
              src={product.image}
              alt={productName}
              loading="lazy"
              decoding="async"
              className={cn(
                'transition-transform duration-500 ease-out motion-safe:group-hover:scale-[1.04]',
                isHero ? 'hero-product-card__image' : 'h-full w-full object-cover',
              )}
              onError={() => setImageFailed(true)}
            />
          ) : (
            <div className="flex h-full w-full flex-col items-center justify-center gap-2 first-text-color-for-paragraph">
              <ImageOff
                className={cn('opacity-50', isHero || isCompact ? 'size-8' : 'size-10')}
                strokeWidth={1.4}
                aria-hidden="true"
              />
              <span className="text-xs">{t('common.product')}</span>
            </div>
          )}

          {!isHero && (
            <span
              className={cn(
                'absolute start-3 top-3 inline-flex items-center gap-1.5 bg-secound font-f-sbold leading-none text-white shadow-sm',
                isCompact
                  ? 'rounded-xl px-2 py-1 text-[0.7rem]'
                  : 'rounded-2xl px-2.5 py-1 text-xs',
              )}
            >
              <Star
                className={cn('fill-white text-white', isCompact ? 'size-3.5' : 'size-4')}
                strokeWidth={1.8}
                aria-hidden="true"
              />
              <span>{rating.toFixed(2)}</span>
            </span>
          )}

          {(product.discount || !product.inStock) && (
            <div className="absolute end-2.5 top-2.5 flex flex-col items-end gap-2 sm:end-3 sm:top-3">
              {product.discount ? (
                <span
                  className={cn(
                    'rounded-full bg-secound font-f-bold text-white shadow-sm',
                    isHero || isCompact ? 'px-2.5 py-1 text-[0.7rem]' : 'px-3 py-1 text-xs',
                  )}
                >
                  {product.discount}%
                </span>
              ) : null}

              {!product.inStock ? (
                <span
                  className={cn(
                    'rounded-full bg-black/65 font-f-sbold text-white backdrop-blur-sm',
                    isHero || isCompact ? 'px-2.5 py-1 text-[0.65rem]' : 'px-3 py-1 text-xs',
                  )}
                >
                  {t('common.outOfStock')}
                </span>
              ) : null}
            </div>
          )}
        </div>

        <div
          className={cn(
            'flex min-h-0 min-w-0 flex-1 flex-col',
            isHero ? 'hero-product-card__content' : isCompact ? 'px-3 pb-3 pt-1' : 'px-4 pb-4 pt-2',
          )}
        >
          <h3
            className={cn(
              'text-start font-f-bold first-text-color transition-colors group-hover:text-first',
              isHero
                ? 'line-clamp-2 min-h-11 text-sm leading-[1.375rem] sm:text-base'
                : isCompact
                  ? 'line-clamp-1 text-sm'
                  : 'line-clamp-1 text-base sm:text-lg',
            )}
          >
            {productName}
          </h3>

          {isHero && description ? (
            <p className="mt-1 line-clamp-1 text-start text-xs leading-5 first-text-color-for-paragraph">
              {description}
            </p>
          ) : null}

          <div
            dir="ltr"
            className={cn(
              'mt-auto flex items-end justify-between gap-2',
              isHero ? 'min-h-12 pt-3' : isCompact ? 'min-h-12 pt-3' : 'min-h-14 pt-4',
            )}
          >
            <div className="flex min-w-0 flex-col items-start gap-1">
              {hasDiscount ? (
                <span
                  className={cn(
                    'inline-flex rounded-xl bg-first/10 py-0.5',
                    isHero ? 'px-1.5' : 'px-2',
                  )}
                >
                  <PriceDisplay
                    amount={product.originalPrice}
                    currency="IRT"
                    languageCode={lang}
                    currencyMode="none"
                    className={cn(
                      'line-through first-text-color-for-paragraph',
                      isHero || isCompact ? 'text-[0.65rem]' : 'text-xs',
                    )}
                  />
                </span>
              ) : null}

              <PriceDisplay
                amount={product.price}
                currency="IRT"
                languageCode={lang}
                className={cn(
                  'whitespace-nowrap font-f-bold first-text-color',
                  isHero ? 'text-xs sm:text-sm xl:text-base' : 'text-sm sm:text-base',
                )}
                currencyClassName={cn(
                  'first-text-color-for-paragraph',
                  isHero || isCompact ? 'text-[0.6rem]' : 'text-[0.65rem]',
                )}
              />
            </div>

            <span
              className={cn(
                'flex shrink-0 items-center justify-center rounded-full bg-first/5 text-first transition-colors duration-300 group-hover:bg-first group-hover:text-white',
                isHero || isCompact ? 'size-9' : 'size-10',
              )}
              aria-hidden="true"
            >
              <ShoppingCart
                className={cn(isHero ? 'size-[18px]' : isCompact ? 'size-4' : 'size-5')}
                strokeWidth={1.8}
              />
            </span>
          </div>
        </div>
      </Link>
    </article>
  );
};

export default ShowcaseProductCard;
