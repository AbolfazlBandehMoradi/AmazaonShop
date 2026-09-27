import { useState } from 'react';
import { ImageOff, ShoppingCart } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';

import { PriceDisplay } from '@/components/ui/PriceDisplay';
import { useLocalizedPath } from '@/hooks/useLocalizedPath';
import { useLangStore } from '@/stores/languageStore';
import type { Product } from '@/types';
import cleanText from '@/utils/cleanText';

interface ShowcaseProductCardProps {
  product: Product;
}

const ShowcaseProductCard = ({ product }: ShowcaseProductCardProps) => {
  const { t } = useTranslation();
  const localizedPath = useLocalizedPath();
  const lang = useLangStore((state) => state.lang);
  const [imageFailed, setImageFailed] = useState(false);
  const productPath = localizedPath(`/products/${product.slug}`);
  const description = cleanText(product.description);
  const currency = 'IRT';

  return (
    <article className="h-full overflow-hidden rounded-2xl bg-color-for-layer-on-body shadow-[0_8px_24px_rgba(20,29,38,0.06)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_14px_30px_rgba(20,29,38,0.12)]">
      <Link
        to={productPath}
        className="group flex h-full flex-col"
        aria-label={`${t('common.viewProduct')}: ${product.name}`}
      >
        <div className="relative m-2 flex aspect-[143/112] shrink-0 items-center justify-center overflow-hidden rounded-2xl bg-color-for-layer-three">
          {product.image && !imageFailed ? (
            <img
              src={product.image}
              alt={product.name}
              loading="lazy"
              className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
              onError={() => setImageFailed(true)}
            />
          ) : (
            <div className="flex h-full w-full flex-col items-center justify-center gap-2 first-text-color-for-paragraph">
              <ImageOff className="h-10 w-10 opacity-50" strokeWidth={1.4} aria-hidden="true" />
              <span className="text-xs">{t('common.product')}</span>
            </div>
          )}

          {product.discount ? (
            <span className="absolute top-3 start-3 rounded-full bg-secound px-3 py-1 text-xs font-f-bold text-white shadow-sm">
              {product.discount}%
            </span>
          ) : null}

          {!product.inStock ? (
            <span className="absolute top-3 end-3 rounded-full bg-color-for-tooltip px-3 py-1 text-xs font-f-sbold text-color-for-tooltip backdrop-blur-sm">
              {t('common.outOfStock')}
            </span>
          ) : null}
        </div>

        <div className="flex flex-1 flex-col px-4 pt-2 pb-4">
          <div className="flex-1">
            <h3 className="line-clamp-1 text-start text-base font-f-bold first-text-color transition-colors group-hover:text-first sm:text-lg">
              {product.name}
            </h3>
            {description ? (
              <p className="mt-2 line-clamp-2 text-xs leading-6 first-text-color-for-paragraph sm:text-sm">
                {description}
              </p>
            ) : null}
          </div>

          <div className="mt-4 flex min-h-12 items-center justify-between gap-3 border-t border-first/10 pt-3">
            <div className="flex min-w-0 flex-col items-start">
              <PriceDisplay
                amount={product.price}
                currency={currency}
                languageCode={lang}
                className="text-sm font-f-bold first-text-color sm:text-base"
                currencyClassName="text-[0.65rem] first-text-color-for-paragraph"
              />
              {product.originalPrice && product.originalPrice > product.price ? (
                <PriceDisplay
                  amount={product.originalPrice}
                  currency={currency}
                  languageCode={lang}
                  currencyMode="none"
                  className="text-xs line-through first-text-color-for-paragraph"
                />
              ) : null}
            </div>

            <span
              className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-secound/10 text-secound transition-colors group-hover:bg-secound group-hover:text-white"
              aria-hidden="true"
            >
              <ShoppingCart className="h-5 w-5" strokeWidth={1.8} />
            </span>
          </div>
        </div>
      </Link>
    </article>
  );
};

export default ShowcaseProductCard;
