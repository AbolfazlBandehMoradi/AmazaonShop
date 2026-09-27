import { Star } from 'lucide-react';
import { useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import type { Swiper as SwiperType } from 'swiper';
import { A11y } from 'swiper/modules';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/swiper.css';

import { useLangStore } from '@/stores/languageStore';
import type { Testimonial } from '@/types';
import { cn } from '@/utils/cn';

interface TestimonialsSliderProps {
  testimonials: Testimonial[];
}

const TestimonialsSlider = ({ testimonials }: TestimonialsSliderProps) => {
  const { t } = useTranslation();
  const { dir, lang } = useLangStore();
  const isRtl = dir === 'rtl';
  const swiperRef = useRef<SwiperType | null>(null);
  const [activePage, setActivePage] = useState(0);
  const [pageCount, setPageCount] = useState(1);
  const testimonialTitle = t('mainpage.testimonials.title');
  const [testimonialTitleLead, ...testimonialTitleRest] = testimonialTitle.trim().split(/\s+/);

  const syncPagination = (swiper: SwiperType) => {
    const nextPageCount = Math.max(1, swiper.snapGrid.length);

    setPageCount(nextPageCount);
    setActivePage(Math.min(swiper.snapIndex, nextPageCount - 1));
  };

  if (testimonials.length === 0) {
    return null;
  }

  return (
    <section
      dir={dir}
      className="landing-section overflow-hidden"
      aria-labelledby="landing-testimonials-title"
    >
      <div className="landing-container">
        <div className="mb-6 sm:mb-8">
          <h2 id="landing-testimonials-title" className="text-2xl font-s-sbold first-text-color">
            {testimonialTitleLead}
            <span className="text-secound">
              {testimonialTitleRest.length ? ` ${testimonialTitleRest.join(' ')}` : ''}
            </span>
          </h2>
        </div>

        <div className="relative">
          <div className="relative z-10 mx-auto max-w-[385px] md:max-w-[802px] xl:max-w-[1219px]">
            <Swiper
              key={dir}
              dir={dir}
              modules={[A11y]}
              spaceBetween={32}
              slidesPerView={1}
              centerInsufficientSlides
              onSwiper={(swiper) => {
                swiperRef.current = swiper;
                syncPagination(swiper);
              }}
              onSlideChange={syncPagination}
              onBreakpoint={syncPagination}
              onResize={syncPagination}
              breakpoints={{
                768: { slidesPerView: 2 },
                1280: { slidesPerView: 3 },
              }}
            >
              {testimonials.map((testimonial) => {
                const name =
                  lang === 'en' ? testimonial.nameEn || testimonial.name : testimonial.name;
                const role =
                  lang === 'en' ? testimonial.roleEn || testimonial.role : testimonial.role;
                const content =
                  lang === 'en'
                    ? testimonial.contentEn || testimonial.content
                    : testimonial.content;
                const rating = Math.min(5, Math.max(0, Math.round(testimonial.rating || 0)));

                return (
                  <SwiperSlide key={testimonial.id} className="h-auto">
                    <article className="flex h-[167px] w-full flex-col justify-between rounded-2xl border border-color-theme bg-color-for-layer-on-body p-4 transition-all duration-300 hover:-translate-y-1 sm:p-5">
                      <p className="line-clamp-3 text-sm leading-6 first-text-color-for-paragraph">
                        {content}
                      </p>

                      <div
                        dir="ltr"
                        className={cn(
                          'flex items-center justify-between gap-3',
                          !isRtl && 'flex-row-reverse',
                        )}
                      >
                        <div
                          className="flex shrink-0 gap-0.5 text-amber-500"
                          aria-label={t('mainpage.testimonials.rating', { rating })}
                        >
                          {Array.from({ length: 5 }, (_, index) => (
                            <Star
                              key={index}
                              aria-hidden="true"
                              className="h-3.5 w-3.5"
                              fill={index < rating ? 'currentColor' : 'none'}
                            />
                          ))}
                        </div>

                        <div
                          className={cn(
                            'flex min-w-0 items-center gap-2.5',
                            isRtl ? 'flex-row-reverse' : 'flex-row',
                          )}
                        >
                          <span className="flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-full bg-first text-sm font-s-sbold text-white">
                            {testimonial.avatar ? (
                              <img
                                src={testimonial.avatar}
                                alt=""
                                loading="lazy"
                                className="h-full w-full object-cover"
                              />
                            ) : (
                              name.trim().charAt(0)
                            )}
                          </span>
                          <span dir={dir} className="min-w-0 text-start">
                            <strong className="block truncate text-sm font-s-sbold first-text-color">
                              {name}
                            </strong>
                            <span className="mt-0.5 block truncate text-xs first-text-color-for-paragraph-low">
                            </span>
                          </span>
                        </div>
                      </div>
                    </article>
                  </SwiperSlide>
                );
              })}
            </Swiper>
          </div>

          <div className="relative -mt-[60px] h-[120px] w-full rounded-3xl bg-first">
            <div
              dir="ltr"
              className="absolute start-6 bottom-5 flex items-center gap-2 sm:start-8 sm:bottom-6"
            >
              {Array.from({ length: pageCount }, (_, index) => {
                const isActive = index === activePage;

                return (
                  <button
                    key={index}
                    type="button"
                    onClick={() => swiperRef.current?.slideTo(index)}
                    className={`h-2.5 rounded-full bg-color-for-layer-on-body transition-all duration-300 ${
                      isActive ? 'w-6 opacity-100' : 'w-2.5 opacity-50 hover:opacity-80'
                    }`}
                    aria-label={`${t('mainpage.testimonials.title')} ${index + 1}`}
                    aria-current={isActive ? 'true' : undefined}
                  />
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSlider;
