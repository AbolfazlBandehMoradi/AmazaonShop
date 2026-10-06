import { ArrowLeft, ArrowRight, ArrowUpLeft } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router';
import { A11y } from 'swiper/modules';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/swiper.css';

import { SectionHeading } from '@/components/ui/SectionHeading';
import { useLocalizedPath } from '@/hooks/useLocalizedPath';
import { useSlideEdgeFade } from '@/hooks/useSlideEdgeFade';
import { useLangStore } from '@/stores/languageStore';
import type { Blog } from '@/types';
import { cn } from '@/utils/cn';
import cleanText from '@/utils/cleanText';

interface BlogsSliderProps {
  blogs: Blog[];
}

const BlogsSlider = ({ blogs }: BlogsSliderProps) => {
  const { t } = useTranslation();
  const localizedPath = useLocalizedPath();
  const { dir, lang } = useLangStore();
  const { fadeWidth, updateFade } = useSlideEdgeFade();
  const isRtl = dir === 'rtl';
  const ForwardIcon = dir === 'rtl' ? ArrowLeft : ArrowRight;

  if (blogs.length === 0) {
    return null;
  }

  return (
    <section dir={dir} className="landing-section" aria-labelledby="landing-blogs-title">
      <div className="landing-container">
        <div className="mb-6 flex flex-wrap items-center justify-between gap-4 sm:mb-8">
          <SectionHeading
            id="landing-blogs-title"
            subtext={t('mainpage.landingBlogs.blog')}
            title={t('mainpage.landingBlogs.title')}
            titleClassName="sm:text-2xl"
          />
          <Link
            to={localizedPath('/blogs')}
            className="group inline-flex items-center gap-2 text-sm font-s-medium text-first"
          >
            <span>{t('mainpage.landingBlogs.more')}</span>
            <ForwardIcon
              aria-hidden="true"
              className={cn(
                'h-4 w-4 transition-transform',
                isRtl ? 'group-hover:-translate-x-1' : 'group-hover:translate-x-1',
              )}
            />
          </Link>
        </div>

        <div className="relative">
          <Swiper
            key={dir}
            dir={dir}
            className="!py-3"
            modules={[A11y]}
            watchOverflow
            spaceBetween={20}
            slidesPerView={1.1}
            breakpoints={{
              640: { slidesPerView: 1.6 },
              768: { slidesPerView: 2 },
              1024: { slidesPerView: 2.3 },
              1152: { slidesPerView: 2.6 },
              1280: { slidesPerView: 3 },
            }}
            onSwiper={updateFade}
            onSlideChange={updateFade}
            onResize={updateFade}
            onBreakpoint={updateFade}
            onLock={updateFade}
            onUnlock={updateFade}
          >
            {blogs.map((blog) => {
              const title = lang === 'en' ? blog.titleEn || blog.title : blog.title;
              const excerpt = lang === 'en' ? blog.excerptEn || blog.excerpt : blog.excerpt;
              const category = lang === 'en' ? blog.categoryEn || blog.category : blog.category;

              return (
                <SwiperSlide key={blog.id} className="!h-auto">
                  <Link
                    to={localizedPath(`/blogs/${blog.slug || blog.id}`)}
                    className="group flex aspect-[421.333/476.222] min-h-[410px] w-full flex-col rounded-[32px] bg-surface p-2 text-start hover:shadow-sm focus-visible:shadow-sm focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-first motion-safe:transition-[transform,box-shadow] motion-safe:duration-300 motion-safe:ease-out motion-safe:hover:-translate-y-1 motion-safe:focus-visible:-translate-y-1 sm:min-h-[440px] lg:min-h-[476.222px] dark:bg-color-for-layer-sec dark:hover:shadow-black/30 dark:focus-visible:shadow-black/30"
                  >
                    <span className="block aspect-[405.333/270.222] shrink-0 overflow-hidden rounded-[28px] bg-color-for-layer-three">
                      <img
                        src={blog.image}
                        alt=""
                        width={405}
                        height={270}
                        loading="lazy"
                        decoding="async"
                        className="h-full w-full object-cover"
                      />
                    </span>
                    <span className="flex min-w-0 flex-1 flex-col px-5 pb-5 pt-8 lg:px-8 lg:pb-8 lg:pt-12">
                      <span className="line-clamp-1 text-sm leading-[18px] text-secound">
                        {category}
                      </span>
                      <strong className="mt-1 line-clamp-2 text-base leading-5 font-semibold font-f-sbold first-text-color">
                        {title}
                      </strong>
                      <span className="mt-1 line-clamp-2 text-sm leading-[18px] first-text-color-for-paragraph">
                        {cleanText(excerpt)}
                      </span>
                      <span className="mt-auto block pt-1 text-left text-sm leading-[18px] font-s-medium text-first">
                        <span className="inline-flex items-center gap-2">
                          {t('mainpage.landingBlogs.readMore')}
                          <ArrowUpLeft
                            aria-hidden="true"
                            className="h-4 w-4 motion-safe:transition-transform motion-safe:group-hover:-translate-x-1 motion-safe:group-hover:-translate-y-1 motion-safe:group-focus-visible:-translate-x-1 motion-safe:group-focus-visible:-translate-y-1"
                          />
                        </span>
                      </span>
                    </span>
                  </Link>
                </SwiperSlide>
              );
            })}
          </Swiper>
          {fadeWidth > 0 && (
            <div
              className="landing-slider-edge-fade"
              style={{ width: fadeWidth }}
              aria-hidden="true"
            />
          )}
        </div>
      </div>
    </section>
  );
};

export default BlogsSlider;
