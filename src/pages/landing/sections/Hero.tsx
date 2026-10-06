import { useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { Link } from 'react-router';
import type { Swiper as SwiperType } from 'swiper';
import { A11y } from 'swiper/modules';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/swiper.css';

import type { HeroSlider } from '@/hooks/useHeroSliders';
import { useLocalizedPath } from '@/hooks/useLocalizedPath';
import { useLangStore } from '@/stores/languageStore';
import type { Category } from '@/types';
import getImageUrl from '@/utils/getImageUrl';
import HeroCategories from './HeroCategories';

const slideShape =
  'M1248 338.999C1248 356.672 1233.67 370.999 1216 370.999H1156.42C1139.6 370.999 1126.08 386.527 1112.24 396.1C1106.87 399.82 1100.34 402 1093.31 402H999.938C992.905 402 986.382 399.82 981.006 396.1C967.172 386.527 953.648 370.999 936.825 370.999H32C14.3269 370.999 0 356.672 0 338.999V32C0 14.3269 14.3269 0 32 0H1216C1233.67 0 1248 14.3269 1248 32V338.999Z';

function SlideBackground() {
  return (
    <svg
      aria-hidden="true"
      className="pointer-events-none absolute inset-x-0 top-0 hidden h-[402px] w-full lg:block"
      viewBox="0 0 1248 402"
      preserveAspectRatio="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d={slideShape} className="fill-white dark:fill-[var(--bg-color-for-layer-sec)]" />
    </svg>
  );
}

function getSlideImage(slide: HeroSlider) {
  const path =
    slide.imageUrl ||
    slide.mediaUrl ||
    slide.image ||
    slide.previewUrl ||
    slide.externalLink ||
    slide.mediaFile?.filePath;
  if (!path) return null;
  return getImageUrl(/^https?:\/\//i.test(path) ? path : `/${path.replace(/^\/+/, '')}`);
}

function getSlideLink(slide: HeroSlider) {
  const target = (slide.targetUrl || slide.url || '').trim();
  if (/^https?:\/\//i.test(target)) return { href: target, external: true };
  if (target && !target.startsWith('//') && !/^[a-z][a-z\d+.-]*:/i.test(target)) {
    return { href: target.startsWith('/') ? target : `/${target}`, external: false };
  }
  return null;
}

function renderSlideTitle(title: string, isRtl: boolean) {
  if (!isRtl) return title;

  // Keep Latin phone names and model numbers together, but leave prices and discounts uncolored.
  return title
    .split(
      /([A-Za-z][A-Za-z0-9۰-۹٠-٩]*(?:[-./+][A-Za-z0-9۰-۹٠-٩]+)*\+?(?:[ \t]+(?![0-9۰-۹٠-٩]+[ \t]*(?:[%٪]|درصد|تومان|ریال))[A-Za-z0-9۰-۹٠-٩]+(?:[-./+][A-Za-z0-9۰-۹٠-٩]+)*\+?)*)/g,
    )
    .map((part, index) =>
      index % 2 === 1 ? (
        <bdi key={index} dir="ltr" className="text-secound">
          {part}
        </bdi>
      ) : (
        part
      ),
    );
}

interface HeroProps {
  categories: Category[];
  slides: HeroSlider[];
  isPending: boolean;
  isError: boolean;
  onRetry: () => void;
}

const Hero = ({ categories, slides, isPending, isError, onRetry }: HeroProps) => {
  const { t } = useTranslation();
  const { dir } = useLangStore();
  const localizedPath = useLocalizedPath();
  const swiperRef = useRef<SwiperType | null>(null);
  const [activeSlide, setActiveSlide] = useState(0);
  const ForwardIcon = dir === 'rtl' ? ArrowLeft : ArrowRight;

  return (
    <section
      dir={dir}
      className="bg-white pt-2 pb-5 dark:bg-background lg:pb-8"
      aria-label={t('mainpage.hero.label')}
    >
      <div className="site-container rounded-[32px] bg-surface p-5 sm:p-6">
        <div className="relative isolate">
          <div
            className="pointer-events-none absolute inset-0 rounded-[28px] bg-white dark:bg-color-for-layer-sec lg:hidden"
            aria-hidden="true"
          />
          <SlideBackground />
          {isPending || isError || slides.length === 0 ? (
            <div className="relative z-10 flex min-h-[300px] items-center justify-center px-8 text-center sm:min-h-[402px]">
              {isPending ? (
                <div
                  role="status"
                  className="relative z-10 w-full max-w-md animate-pulse space-y-5"
                  aria-label={t('mainpage.hero.loading')}
                >
                  <div className="mx-auto h-4 w-24 rounded-full bg-surface" />
                  <div className="mx-auto h-8 w-3/4 rounded-full bg-surface" />
                  <div className="mx-auto h-4 w-full rounded-full bg-surface" />
                </div>
              ) : (
                <div className="relative z-10 flex flex-col items-center gap-4 first-text-color-for-paragraph">
                  <p>{t(isError ? 'mainpage.hero.error' : 'mainpage.hero.empty')}</p>
                  {isError && (
                    <button
                      type="button"
                      onClick={onRetry}
                      className="rounded-xl bg-first px-5 py-2.5 text-sm font-f-bold text-white hover:bg-first-600 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-first"
                    >
                      {t('mainpage.hero.retry')}
                    </button>
                  )}
                </div>
              )}
            </div>
          ) : (
            <div className="relative z-10">
              <Swiper
                key={dir}
                dir={dir}
                className="relative"
                modules={[A11y]}
                slidesPerView={1}
                onSwiper={(swiper) => {
                  swiperRef.current = swiper;
                  setActiveSlide(swiper.realIndex);
                }}
                onSlideChange={(swiper) => setActiveSlide(swiper.realIndex)}
                aria-label={t('mainpage.hero.label')}
              >
                {slides.map((slide, index) => {
                  const title = slide.translation?.title || slide.title || '';
                  const caption = slide.translation?.caption || slide.caption;
                  const description = slide.translation?.description || slide.description;
                  const image = getSlideImage(slide);
                  const destination = getSlideLink(slide);
                  const ctaContent = (
                    <>
                      {t('mainpage.hero.cta')}
                      <ForwardIcon className="h-5 w-5" aria-hidden="true" />
                    </>
                  );
                  const ctaClass =
                    'inline-flex min-h-12 w-fit items-center justify-center gap-3 rounded-2xl bg-first px-6 text-sm font-f-sbold text-white transition-colors hover:bg-first-600 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-first';

                  return (
                    <SwiperSlide key={slide.id} className="!h-auto">
                      <article
                        dir="ltr"
                        className="relative flex min-h-[510px] flex-col-reverse pb-14 sm:min-h-[560px] md:min-h-[590px] lg:h-[402px] lg:min-h-0 lg:flex-row lg:pb-0"
                      >
                        <div className="relative flex h-[190px] w-full shrink-0 items-end justify-center px-6 sm:h-[240px] sm:px-9 md:h-[280px] lg:h-[402px] lg:w-[52%] lg:px-11 lg:pb-[30px] xl:px-12">
                          {image && (
                            <img
                              src={image}
                              alt={title || caption || ''}
                              loading={index === 0 ? 'eager' : 'lazy'}
                              // React 18 requires the lowercase DOM attribute.
                              {...{ fetchpriority: index === 0 ? 'high' : undefined }}
                              className="max-h-[190px] w-full object-contain object-bottom sm:max-h-[240px] md:max-h-[280px] lg:max-h-[350px] xl:max-h-[360px]"
                            />
                          )}
                        </div>
                        <div
                          dir={dir}
                          className="flex min-w-0 flex-1 flex-col justify-center gap-3 px-6 pt-8 pb-4 text-start sm:gap-4 sm:px-9 md:px-11 lg:w-[48%] lg:gap-4 lg:px-11 lg:pt-8 lg:pb-16 xl:gap-5 xl:px-12"
                        >
                          {caption && (
                            <div className="flex items-center gap-2 text-xs font-f-bold text-first">
                              <span
                                className="h-0.5 w-8 shrink-0 rounded-lg bg-secound"
                                aria-hidden="true"
                              />
                              <span>{caption}</span>
                            </div>
                          )}
                          {title && (
                            <h1 className="text-[22px] leading-[1.35] font-f-bold first-text-color sm:text-[28px] lg:text-[26px] xl:text-[32px]">
                              {renderSlideTitle(title, dir === 'rtl')}
                            </h1>
                          )}
                          {description && (
                            <p className="max-w-lg text-sm leading-6 first-text-color-for-paragraph sm:text-base sm:leading-7 lg:text-[15px] xl:text-base">
                              {description}
                            </p>
                          )}
                          {destination &&
                            (destination.external ? (
                              <a href={destination.href} className={ctaClass}>
                                {ctaContent}
                              </a>
                            ) : (
                              <Link to={localizedPath(destination.href)} className={ctaClass}>
                                {ctaContent}
                              </Link>
                            ))}
                        </div>
                      </article>
                    </SwiperSlide>
                  );
                })}
              </Swiper>
              {slides.length > 1 && (
                <div
                  dir={dir}
                  className="absolute bottom-3 left-1/2 z-20 flex max-w-full -translate-x-1/2 items-center justify-center gap-0.5 px-2 lg:top-[370px] lg:bottom-auto lg:left-[84%] lg:gap-0 xl:gap-0.5"
                  role="group"
                  aria-label={t('mainpage.hero.pagination')}
                >
                  {slides.map((slide, index) => (
                    <button
                      key={slide.id}
                      type="button"
                      onClick={() => swiperRef.current?.slideTo(index)}
                      className="flex h-8 items-center justify-center px-1 focus-visible:rounded-full focus-visible:outline-2 focus-visible:outline-first lg:px-0.5 xl:px-1"
                      aria-label={t('mainpage.hero.goToSlide', { number: index + 1 })}
                      aria-current={index === activeSlide ? 'true' : undefined}
                    >
                      <span
                        className={`block h-2.5 rounded-full bg-[#163F87] transition-all duration-200 dark:bg-white ${index === activeSlide ? 'w-8 opacity-100' : 'w-2.5 opacity-20 hover:opacity-50'}`}
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
        <div className="hero-section-divider mt-6 lg:mt-10" aria-hidden="true" />
        <HeroCategories categories={categories} />
      </div>
    </section>
  );
};

export default Hero;
