import {
  ArrowLeft,
  ArrowRight,
  Gem,
  Lamp,
  Scissors,
  Shapes,
  Shirt,
  Handbag,
  Watch,
  type LucideIcon,
} from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/swiper.css';

import { useLocalizedPath } from '@/hooks/useLocalizedPath';
import { useLangStore } from '@/stores/languageStore';
import type { Category } from '@/types';
import { cn } from '@/utils/cn';
import type { ComponentType, SVGProps } from 'react';

type CategoryIconType = ComponentType<SVGProps<SVGSVGElement>>;

function LadyIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="40 0 180 300"
      aria-hidden="true"
      {...props}
    >
      <g strokeWidth={13} transform="matrix(.96363 0 0 .96448 -314.38 -1776.201)">
        <path
          fill="transparent"
          fillRule="evenodd"
          d="m 466.10366,2142.6257 c -29.69924,18.2582 -61.08182,-15.9081 -87.65485,-30.0687 1.56314,-7.5925 6.07211,-19.2223 11.90374,-32.4188 4.50898,-10.3041 9.79958,-21.5121 15.09011,-32.479 13.76749,-28.6828 27.53495,-55.7386 27.29445,-59.8362 -0.3605,-5.7245 -2.10418,-11.2682 -4.32859,-16.6914 -2.6453,-6.4477 -5.89179,-12.7747 -8.35673,-19.0416 -1.44285,-3.8565 -2.64525,-7.6527 -3.12621,-11.3887 -0.72141,-5.3027 -1.02201,-13.4375 2.28457,-18.3184 10.22038,-15.2453 28.79744,-3.254 40.88157,5.3629 11.78345,-8.4361 30.96175,-21.03 41.36244,-5.6642 3.30663,4.8809 3.00604,13.0157 2.28457,18.3184 -0.84166,6.3271 -3.30658,12.4131 -6.01197,18.4389 -1.74349,3.9168 -3.66731,7.7733 -5.29053,11.6901 -2.28457,5.5437 -4.14829,11.208 -4.50902,16.9927 -0.60122,9.1592 52.30434,87.133 55.97165,127.6264 -26.99385,8.1348 -52.66508,12.0516 -77.7952,27.4776 z"
        />

        <path
          fill="#e2e7f0"
          fillRule="evenodd"
          d="m 477.76694,1917.2609 c 0.18026,-0.06 0.36052,-0.1205 0.4807,-0.1807 12.32455,11.8708 9.19829,33.8047 -9.43883,65.6812 0.3605,8.6771 4.2685,18.6197 11.60306,29.7674 16.83362,28.502 21.5831,47.9051 14.18834,58.2694 -9.73945,15.0645 -17.67528,38.0228 -23.68722,68.9954 23.62713,-13.1362 47.73522,-17.053 72.98558,-24.6455 -3.66731,-40.4934 -56.57287,-118.4672 -55.97166,-127.6264 0.3605,-5.7847 2.22446,-11.449 4.50903,-16.9927 1.6232,-3.9168 3.54701,-7.7733 5.29053,-11.6901 2.70537,-6.0258 5.17031,-12.1118 6.01194,-18.4389 0.7215,-5.3027 1.02209,-13.4375 -2.28454,-18.3184 -5.89174,-8.7374 -14.54899,-8.4361 -23.14617,-5.0617 0.36049,0.4218 0.18026,0.4821 -0.54134,0.241 z"
        />

        <path
          fill="none"
          stroke="currentColor"
          strokeLinecap="round"
          strokeLinejoin="round"
          d="m 378.44881,2112.557 c 1.56314,-7.5925 6.07211,-19.2223 11.90374,-32.4188 4.50898,-10.3041 9.79958,-21.5121 15.09011,-32.479 13.76749,-28.6828 27.53495,-55.7386 27.29445,-59.8362 -0.3605,-5.7245 -2.10418,-11.2682 -4.32859,-16.6914 -2.6453,-6.4477 -5.89179,-12.7747 -8.35673,-19.0416 -1.44285,-3.8565 -2.64525,-7.6527 -3.12621,-11.3887 -0.72141,-5.3027 -1.02201,-13.4375 2.28457,-18.3184 10.22038,-15.2453 28.79744,-3.254 40.88157,5.3629 11.78345,-8.4361 30.96175,-21.03 41.36244,-5.6642 3.30663,4.8809 3.00604,13.0157 2.28457,18.3184 -0.84166,6.3271 -3.30658,12.4131 -6.01197,18.4389 -1.74349,3.9168 -3.66731,7.7733 -5.29053,11.6901 -2.28457,5.5437 -4.14829,11.208 -4.50902,16.9927 -0.60122,9.1592 52.30434,87.133 55.97165,127.6264 -109.83907,33.1419 -66.7331,50.0744 -165.45005,-2.5911 z"
        />

        <path
          fill="none"
          stroke="currentColor"
          strokeLinecap="round"
          d="m 486.18376,1984.8704 c -5.4709,3.736 -8.47696,5.5437 -13.94785,6.7489"
        />

        <path
          fill="none"
          stroke="currentColor"
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M431.89544 1912.4403c-.0601-.3615-1.68333-6.4476-4.32864-23.1993M494.54041 1913.4647c.18026-.7231 1.68336-6.4476 4.32861-23.1993"
        />

        <path
          fill="none"
          stroke="currentColor"
          strokeLinecap="round"
          d="m 434.11987,1984.8704 c 5.4709,3.736 8.47693,5.5437 13.94786,6.7489"
        />

        <path
          fill="none"
          stroke="currentColor"
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M399.4307 1896.0501c18.27646-8.1348 41.30238-12.6541 66.07177-11.8708 20.68129.6628 39.73931 4.8809 55.55083 11.6298M448.54869 1857.1235c0-5.5438 4.6292-10.0631 10.28046-10.0631 5.71143 0 10.28055 4.5193 10.28055 10.0631 0 5.604-10.22041 4.4591-10.28055 10.1233l-.0601 16.5107"
        />
      </g>
    </svg>
  );
}

interface LandingCategoriesProps {
  categories: Category[];
}

const categoryIconMap = new Map<string, CategoryIconType>([
  // فارسی
  ['اکسسوری', Watch],
  ['تزیینی-منزل', Lamp],
  ['کیف', Handbag],
  ['پوشاک-مردانه', Shirt],
  ['پوشاک-زنانه', LadyIcon],
  ['نوار-تیکه-دست-دوز', Scissors],
  ['انگشتر', Gem],

]);

const LandingCategories = ({ categories }: LandingCategoriesProps) => {
  const { t } = useTranslation();
  const localizedPath = useLocalizedPath();
  const { dir, lang } = useLangStore();
  const isRtl = dir === 'rtl';
  const ForwardIcon = dir === 'rtl' ? ArrowLeft : ArrowRight;

  return (
    <section dir={dir} className="landing-section" aria-labelledby="landing-categories-title">
      <div className="landing-container">
        <div className="mb-6 flex items-center justify-between gap-4 sm:mb-8">
          <h2
            id="landing-categories-title"
            className="text-xl font-s-sbold first-text-color sm:text-2xl"
          >
            <span className="text-first">{t('mainpage.categories.titleAccent')}</span>{' '}
            {t('mainpage.categories.titleSuffix')}
          </h2>
          <Link
            to={localizedPath('/categories')}
            className="group inline-flex items-center gap-2 text-sm font-s-medium text-first"
          >
            <span>{t('mainpage.categories.moreInPhone')}</span>
            <ForwardIcon
              aria-hidden="true"
              className={cn(
                'h-4 w-4 transition-transform',
                isRtl ? 'group-hover:-translate-x-1' : 'group-hover:translate-x-1',
              )}
            />
          </Link>
        </div>

        {categories.length > 0 ? (
          <Swiper
            key={dir}
            dir={dir}
            slidesPerView={1}
            spaceBetween={16}
            grabCursor
            watchOverflow
            breakpoints={{
              480: { slidesPerView: 1.5 },
              640: { slidesPerView: 2 },
              960: { slidesPerView: 3 },
              1280: { slidesPerView: 4 },
            }}
          >
            {categories.map((category) => {
              const categoryName = lang === 'en' ? category.nameEn || category.name : category.name;
              const CategoryIcon =
                categoryIconMap.get(category.slug) ?? categoryIconMap.get(category.id) ?? Shapes;

              return (
                <SwiperSlide key={category.id}>
                  <Link
                    to={localizedPath(`/products?categoryIds=${category.id}`)}
                    state={{ name: categoryName }}
                    className="relative block h-22 rounded-2xl bg-color-for-layer-on-body px-3 py-5 ps-20 pe-16 text-start first-text-color"
                  >
                    <span className="absolute start-3 top-1/2 flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-xl bg-secound/10 text-secound">
                      <CategoryIcon aria-hidden="true" className="h-7 w-7" strokeWidth={1.7} />
                    </span>
                    <strong className="block truncate font-normal text-lg leading-6">
                      {categoryName}
                    </strong>
                    <span className="mt-1 block truncate text-base leading-5 first-text-color-for-paragraph-low">
                      {category.productCount ?? 0} {t('mainpage.categories.productCountSuffix')}
                    </span>
                    <span className="absolute end-3 bottom-3 inline-flex items-center gap-1 text-sm text-first">
                      {t('mainpage.categories.see')}
                      <ForwardIcon aria-hidden="true" className="h-2.5 w-4" />
                    </span>
                  </Link>
                </SwiperSlide>
              );
            })}
          </Swiper>
        ) : (
          <p className="rounded-2xl bg-color-for-layer-sec p-8 text-center first-text-color-for-paragraph">
            {t('mainpage.categories.empty')}
          </p>
        )}
      </div>
    </section>
  );
};

export default LandingCategories;
