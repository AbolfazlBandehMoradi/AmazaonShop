import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { A11y, Keyboard } from 'swiper/modules';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/swiper.css';

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
import { cn } from '@/utils/cn';

interface HeroCategoriesProps {
  categories: Category[];
}

interface CategoryCardProps {
  category: Category;
  icon: string;
  language: string;
  href: string;
  viewProductsLabel: string;
  variant: 'carousel' | 'grid';
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

function CategoryCard({
  category,
  icon,
  language,
  href,
  viewProductsLabel,
  variant,
}: CategoryCardProps) {
  const name = language === 'en' ? category.nameEn || category.name : category.name;

  return (
    <Link
      to={href}
      className={cn(
        'group flex min-w-0 flex-col bg-white transition-[box-shadow,transform] duration-200 hover:-translate-y-1 hover:shadow-md focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-first dark:bg-[#273242]',
        variant === 'grid'
          ? 'aspect-[306/237] rounded-[32px] p-6'
          : 'h-[220px] rounded-[24px] p-5 sm:h-[237px]',
      )}
    >
      <img src={icon} alt="" aria-hidden="true" className="h-10 w-10" />
      <h3 className="mt-5 line-clamp-1 text-lg leading-6 font-f-bold first-text-color">{name}</h3>
      <p dir="auto" className="mt-1 line-clamp-1 text-sm leading-5 first-text-color-for-paragraph">
        {category.nameEn || category.name}
      </p>
      <span className="mt-auto pt-3 text-xs font-f-bold text-secound">{viewProductsLabel}</span>
    </Link>
  );
}

function StockPanel({
  message,
  variant,
  className,
}: {
  message: string;
  variant: 'carousel' | 'grid';
  className?: string;
}) {
  return (
    <div
      className={cn(
        'relative isolate flex min-w-0 w-full items-center justify-center overflow-hidden px-8 text-center',
        variant === 'grid'
          ? 'h-[237px] rounded-[32px] xl:aspect-[632/237] xl:h-auto'
          : 'h-[220px] rounded-[24px] sm:h-[237px]',
        className,
      )}
    >
      <img
        src={CategoriesImage}
        alt=""
        aria-hidden="true"
        loading="lazy"
        className="absolute inset-0 h-full w-full object-cover"
      />
      <div className="absolute inset-0 bg-[#17173EE5]" aria-hidden="true" />
      <p className="relative z-10 max-w-sm text-lg leading-8 font-f-sbold text-white">{message}</p>
    </div>
  );
}

export default function HeroCategories({ categories }: HeroCategoriesProps) {
  const { t } = useTranslation();
  const { dir, lang } = useLangStore();
  const localizedPath = useLocalizedPath();
  const featuredCategories = categories.slice(0, 6);
  const viewProductsLabel = t('mainpage.heroCategories.viewProducts');
  const stockMessage = t('mainpage.heroCategories.stockMessage');

  const cardProps = (category: Category, index: number) => ({
    category,
    icon: categoryIcons[index],
    language: lang,
    href: localizedPath(`/products?categoryIds=${encodeURIComponent(category.id)}`),
    viewProductsLabel,
  });

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
        <>
          <div className="mt-8 lg:hidden">
            <Swiper
              key={dir}
              dir={dir}
              modules={[A11y, Keyboard]}
              keyboard={{ enabled: true, onlyInViewport: true }}
              slidesPerView={1.16}
              spaceBetween={16}
              breakpoints={{
                640: { slidesPerView: 2.16 },
                768: { slidesPerView: 3.1 },
              }}
              grabCursor
              watchOverflow
            >
              {featuredCategories.map((category, index) => (
                <SwiperSlide key={category.id} className="!h-auto">
                  <CategoryCard {...cardProps(category, index)} variant="carousel" />
                </SwiperSlide>
              ))}
            </Swiper>
            <StockPanel message={stockMessage} variant="carousel" className="mt-4" />
          </div>

          <div className="mt-8 hidden lg:grid lg:grid-cols-3 lg:gap-5 xl:grid-cols-4">
            {featuredCategories.map((category, index) => (
              <CategoryCard key={category.id} {...cardProps(category, index)} variant="grid" />
            ))}
            <StockPanel
              message={stockMessage}
              variant="grid"
              className="lg:col-span-3 xl:col-span-2"
            />
          </div>
        </>
      ) : (
        <p className="mt-8 rounded-[24px] bg-white p-8 text-center first-text-color-for-paragraph dark:bg-[#273242]">
          {t('mainpage.categories.empty')}
        </p>
      )}
    </section>
  );
}
