import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';

import AirbudsIcon from '@/assets/Icons/airbuds-svgrepo-com (2) 1.svg';
import BatteryIcon from '@/assets/Icons/battery-charge-svgrepo-com (1) 1.svg';
import BlackHoleIcon from '@/assets/Icons/black-hole-3-svgrepo-com 1.svg';
import BroomIcon from '@/assets/Icons/broom-svgrepo-com (2) 1.svg';
import SmartphoneIcon from '@/assets/Icons/smartphone-svgrepo-com (2) 1.svg';
import WatchIcon from '@/assets/Icons/watch-square-minimalistic-svgrepo-com 1.svg';
import CategoriesImage from '@/assets/Images/Landing/categoreis-landing.jpg';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { useLocalizedPath } from '@/hooks/useLocalizedPath';
import { useLangStore } from '@/stores/languageStore';
import type { Category } from '@/types';

interface HeroCategoriesProps {
  categories: Category[];
}

// These icons are assigned by position until the category-specific mapping is ready.
const categoryIcons = [
  SmartphoneIcon,
  AirbudsIcon,
  BatteryIcon,
  WatchIcon,
  BroomIcon,
  BlackHoleIcon,
];

export default function HeroCategories({ categories }: HeroCategoriesProps) {
  const { t } = useTranslation();
  const { dir, lang } = useLangStore();
  const localizedPath = useLocalizedPath();
  const featuredCategories = categories.slice(0, 6);

  return (
    <section dir={dir} className="pt-8" aria-labelledby="hero-categories-title">
      <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between md:gap-8">
        <SectionHeading
          id="hero-categories-title"
          subtext={t('mainpage.heroCategories.caption')}
          title={t('mainpage.heroCategories.title')}
        />
        <p className="max-w-[320px] text-sm leading-6 first-text-color-for-paragraph">
          {t('mainpage.heroCategories.intro')}
        </p>
      </div>

      {featuredCategories.length > 0 ? (
        <div className="me-auto mt-8 grid max-w-[1284px] grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 lg:gap-5">
          {featuredCategories.map((category, index) => {
            const name = lang === 'en' ? category.nameEn || category.name : category.name;

            return (
              <Link
                key={category.id}
                to={localizedPath(`/products?categoryIds=${encodeURIComponent(category.id)}`)}
                className="group flex h-[220px] flex-col rounded-[24px] bg-white p-5 transition-[box-shadow,transform] duration-200 hover:-translate-y-1 hover:shadow-md focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-first dark:bg-[#273242] sm:h-[237px] lg:rounded-[32px] lg:p-6"
              >
                <img src={categoryIcons[index]} alt="" aria-hidden="true" className="h-10 w-10" />
                <h3 className="mt-5 line-clamp-1 text-lg leading-6 font-f-bold first-text-color">
                  {name}
                </h3>
                <p
                  dir="auto"
                  className="mt-1 line-clamp-1 text-sm leading-5 first-text-color-for-paragraph"
                >
                  {category.nameEn || category.name}
                </p>
                <span className="mt-auto pt-3 text-xs font-f-bold text-secound">
                  {t('mainpage.heroCategories.viewProducts')}
                </span>
              </Link>
            );
          })}

          <div className="relative isolate flex h-[210px] items-center justify-center overflow-hidden rounded-[24px] px-8 text-center sm:col-span-2 sm:h-[237px] md:col-span-3 lg:col-span-2 lg:rounded-[32px]">
            <img
              src={CategoriesImage}
              alt=""
              aria-hidden="true"
              loading="lazy"
              className="absolute inset-0 h-full w-full object-cover"
            />
            <div className="absolute inset-0 bg-[#17173EE5]" aria-hidden="true" />
            <p className="relative z-10 max-w-sm text-lg leading-8 font-f-sbold text-white">
              {t('mainpage.heroCategories.stockMessage')}
            </p>
          </div>
        </div>
      ) : (
        <p className="mt-8 rounded-[24px] bg-white p-8 text-center first-text-color-for-paragraph dark:bg-[#273242]">
          {t('mainpage.categories.empty')}
        </p>
      )}
    </section>
  );
}
