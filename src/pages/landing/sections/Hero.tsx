import { ArrowLeft, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

import HeroBg from '@/assets/Images/Hero/Hero-bg.png';
import HeroImg from '@/assets/Images/Hero/Hero-img.webp';
import { useLocalizedPath } from '@/hooks/useLocalizedPath';
import { useLangStore } from '@/stores/languageStore';
import { cn } from '@/utils/cn';

const Hero = () => {
  const { t } = useTranslation();
  const localizedPath = useLocalizedPath();
  const { dir } = useLangStore();
  const isRtl = dir === 'rtl';
  const ForwardIcon = isRtl ? ArrowLeft : ArrowRight;

  const stats = [
    { value: '4.8', label: t('mainpage.hero.stats.rating') },
    { value: '+12000', label: t('mainpage.hero.stats.stitches') },
    { value: '+500', label: t('mainpage.hero.stats.artists') },
  ];

  return (
    <section
      dir={dir}
      className="relative isolate mt-8 overflow-hidden bg-color-for-layer-on-body lg:mt-0"
      aria-labelledby="landing-hero-title"
    >
      <img
        src={HeroBg}
        alt=""
        loading="eager"
        aria-hidden="true"
        className="pointer-events-none absolute top-0 left-0 z-0 hidden h-auto w-[58vw] max-w-200 select-none object-contain opacity-95 lg:block  xl:max-w-250"
      />

      <div
        dir="ltr"
        className="relative z-10 mx-auto grid max-w-376 gap-8 px-3 pt-40 pb-8 sm:gap-10 sm:px-6 sm:pb-10 lg:min-h-[clamp(50rem,56vw,58rem)] lg:grid-cols-2 lg:items-center lg:gap-8 lg:pt-55 lg:pb-14 xl:min-h-[clamp(53rem,54vw,62rem)] xl:grid-cols-[minmax(0,55fr)_minmax(0,45fr)] xl:items-start xl:gap-6"
      >
        <div className="relative order-2 mt-5 flex min-w-0 items-center justify-center sm:mt-7 lg:order-1 lg:col-start-1 lg:row-start-1 lg:mt-0 lg:-translate-y-32 lg:justify-start xl:-translate-y-20">
          <div className="relative w-full max-w-176 lg:translate-y-8 lg:max-w-none xl:max-w-210 xl:translate-y-25">
            <img
              src={HeroImg}
              alt={t('mainpage.hero.imageAlt')}
              loading="eager"
              fetchpriority="high"
              className="relative z-10 block h-auto w-full object-contain"
            />

            <div className="absolute right-[1%] top-[32%] z-20 max-w-34 rounded-xl border border-color-theme bg-[color-mix(in_srgb,var(--bg-color-for-layer-on-body)_86%,transparent)] px-2.5 py-2 text-center shadow-md backdrop-blur-md sm:right-[8%] lg:hidden">
              <p
                dir={dir}
                className="text-[0.65rem] leading-4 font-f-sbold first-text-color sm:text-xs sm:leading-5"
              >
                {t('mainpage.hero.shippingCard')}
              </p>
            </div>

            <div className="absolute bottom-[14%] left-[4%] z-20 max-w-34 rounded-xl border border-color-theme bg-[color-mix(in_srgb,var(--bg-color-for-layer-on-body)_86%,transparent)] px-2.5 py-2 text-center shadow-md backdrop-blur-md sm:bottom-[18%] sm:left-[8%] lg:hidden">
              <p
                dir={dir}
                className="text-[0.65rem] leading-4 font-f-sbold first-text-color sm:text-xs sm:leading-5"
              >
                {t('mainpage.hero.handmadeCard')}
              </p>
            </div>
          </div>
        </div>

        <div
          dir={dir}
          className={cn(
            'relative px-2 z-20 order-1 flex min-w-0 lg:max-w-150 flex-col gap-5 sm:gap-6 lg:order-2 lg:col-start-2 lg:row-start-1 lg:px-2 xl:w-full xl:translate-y-5 xl:justify-self-end',
            isRtl ? ' text-right' : 'items-start text-left',
          )}
        >
          <span className="inline-flex w-fit rounded-full bg-first/10 px-4 py-2 text-sm font-f-light text-first">
            - {t('mainpage.hero.badge')}
          </span>

          <h1
            id="landing-hero-title"
            className="max-w-2xl text-3xl leading-[1.35] font-f-bold tracking-normal first-text-color sm:text-4xl md:text-5xl lg:text-[32px]"
          >
            <span className="text-secound">{t('mainpage.hero.titleAccent')}</span>{' '}
            <span>{t('mainpage.hero.titleMain')}</span>
          </h1>

          <p className="max-w-xl text-base leading-8 first-text-color-for-paragraph  md:text-xl">
            {t('mainpage.hero.description')}
          </p>

          <div className="flex w-full flex-col gap-4 sm:w-auto sm:flex-row sm:items-center">
            <Link
              to={localizedPath('/products')}
              className="group inline-flex h-12 items-center justify-center gap-2 rounded-2xl bg-first px-6  text-white  transition-all duration-200 hover:bg-first-600 sm:h-14 text-base"
            >
              <span>{t('mainpage.hero.cta')}</span>
              <ForwardIcon
                className={cn(
                  'h-4 w-6 transition-transform duration-200',
                  isRtl ? 'group-hover:-translate-x-1' : 'group-hover:translate-x-1',
                )}
                aria-hidden="true"
              />
            </Link>
          </div>

          <div
            dir="ltr"
            className="-mx-3 grid w-[calc(100%+1.5rem)] grid-cols-3 gap-2 px-3 pt-2 sm:-mx-6 sm:w-[calc(100%+3rem)] sm:gap-3 sm:px-6 lg:mx-0 lg:w-full lg:max-w-xl lg:px-0"
          >
            {stats.map((stat) => (
              <div
                key={stat.label}
                className="rounded-xl border border-color-theme bg-[color-mix(in_srgb,var(--bg-color-for-layer-on-body)_72%,transparent)] px-2.5 py-3 text-center shadow-sm backdrop-blur sm:rounded-2xl sm:px-4 sm:py-4"
              >
                <p className="text-lg font-f-bold tabular-nums first-text-color sm:text-2xl">
                  {stat.value}
                </p>
                <p className="mt-1 text-[0.68rem] leading-5 first-text-color-for-paragraph sm:text-sm">
                  {stat.label}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
