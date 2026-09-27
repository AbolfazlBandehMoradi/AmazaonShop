import { ArrowLeft, ArrowRight } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';

import LeftPromoImage from '@/assets/Images/Landing/left-promo-img.png';
import RightPromoImage from '@/assets/Images/Landing/right-promo-img.png';
import { useLocalizedPath } from '@/hooks/useLocalizedPath';
import { useLangStore } from '@/stores/languageStore';
import { cn } from '@/utils/cn';

const PromoBanners = () => {
  const { t } = useTranslation();
  const localizedPath = useLocalizedPath();
  const { dir } = useLangStore();
  const isRtl = dir === 'rtl';
  const ForwardIcon = dir === 'rtl' ? ArrowLeft : ArrowRight;

  const promos = [
    {
      key: 'handmade',
      image: RightPromoImage,
      bannerClassName: 'bg-[linear-gradient(92.31deg,#C0392B_0.14%,#5A1B14_99.86%)]',
      imageClassName:
        'sm:top-1/2 sm:left-0 sm:h-[92%] sm:w-auto sm:pl-4 sm:-translate-y-1/2 sm:object-center',
      buttonClassName: 'border-transparent bg-[#A73226] hover:bg-[#922b21]',
    },
    {
      key: 'needlework',
      image: LeftPromoImage,
      bannerClassName: 'bg-[linear-gradient(99.99deg,#DC6616_2.17%,#76370C_98.46%)]',
      imageClassName: 'sm:left-0 sm:h-[92%] sm:w-[44%] sm:object-left-top',
      buttonClassName: 'border-transparent bg-[#BD5813] hover:bg-[#a94e10]',
    },
  ] as const;

  return (
    <section className="landing-section pt-0" aria-label={t('mainpage.promos.label')}>
      <div dir={dir} className="landing-container grid gap-5 lg:grid-cols-2">
        {promos.map((promo) => (
          <article
            key={promo.key}
            className={cn(
              'relative isolate min-h-64 overflow-hidden rounded-3xl text-white shadow-lg sm:min-h-72',
              promo.bannerClassName,
            )}
          >
            <div className="absolute inset-0 bg-linear-to-l from-[color-mix(in_srgb,var(--first-text-color)_5%,transparent)] via-transparent to-[color-mix(in_srgb,var(--first-text-color)_20%,transparent)]" />
            <img
              src={promo.image}
              alt=""
              aria-hidden="true"
              loading="lazy"
              className={cn(
                'absolute top-0 z-0 h-32 w-40 object-contain opacity-35 sm:opacity-90',
                isRtl ? 'left-0 object-top-left' : 'right-0 object-top-right sm:right-auto',
                promo.imageClassName,
              )}
            />
            <div className="relative z-10 ml-auto flex min-h-64 w-full flex-col items-start justify-center px-5 pt-6 pb-20 sm:min-h-72 sm:w-[62%] sm:px-8 sm:py-8">
              <h2 className="w-full max-w-none text-lg leading-7 font-s-sbold sm:max-w-sm sm:text-xl sm:leading-8">
                {t(`mainpage.promos.${promo.key}.title`)}
              </h2>
              <p className="mt-2 w-full max-w-none text-base leading-6 text-white/85 sm:max-w-xs sm:text-lg sm:leading-7">
                {t(`mainpage.promos.${promo.key}.description`)}
              </p>
              <Link
                to={localizedPath('/products')}
                className={cn(
                  'group absolute bottom-5 start-5 inline-flex h-11 items-center gap-2 rounded-xl border px-4 text-sm font-s-medium transition-colors sm:static sm:mt-5',
                  promo.buttonClassName,
                )}
              >
                <span>{t('mainpage.promos.cta')}</span>
                <ForwardIcon
                  aria-hidden="true"
                  className={cn(
                    'h-4 w-4 transition-transform',
                    isRtl ? 'group-hover:-translate-x-1' : 'group-hover:translate-x-1',
                  )}
                />
              </Link>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
};

export default PromoBanners;
