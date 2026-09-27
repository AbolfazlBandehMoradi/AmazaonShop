import { ArrowLeft, ArrowRight } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { A11y } from 'swiper/modules';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/swiper.css';

import { useLocalizedPath } from '@/hooks/useLocalizedPath';
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
  const isRtl = dir === 'rtl';
  const ForwardIcon = dir === 'rtl' ? ArrowLeft : ArrowRight;

  if (blogs.length === 0) {
    return null;
  }

  return (
    <section dir={dir} className="landing-section" aria-labelledby="landing-blogs-title">
      <div className="landing-container">
        <div className="mb-6 flex flex-wrap items-center justify-between gap-4 sm:mb-8">
          <h2 id="landing-blogs-title" className="text-2xl font-s-sbold first-text-color">
            <span className="text-first">{t('mainpage.landingBlogs.blog')}</span>
            {t('mainpage.landingBlogs.title')}
          </h2>
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

        <Swiper
          key={dir}
          dir={dir}
          modules={[A11y]}
          spaceBetween={20}
          slidesPerView={1}
          breakpoints={{
            640: { slidesPerView: 1.6 },
            768: { slidesPerView: 2 },
            1024: { slidesPerView: 3 },
          }}
        >
          {blogs.map((blog) => {
            const title = lang === 'en' ? blog.titleEn || blog.title : blog.title;
            const excerpt = lang === 'en' ? blog.excerptEn || blog.excerpt : blog.excerpt;

            return (
              <SwiperSlide key={blog.id} className="h-auto">
                <Link
                  to={localizedPath(`/blogs/${blog.slug || blog.id}`)}
                  className="group relative block pb-28"
                >
                  <span className="block aspect-410/250 overflow-hidden rounded-2xl bg-color-for-layer-sec">
                    <img
                      src={blog.image}
                      alt={title}
                      loading="lazy"
                      className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  </span>
                  <span className="absolute bottom-28 start-4 flex min-h-44 w-[72%] max-w-86 translate-y-1/2 flex-col rounded-2xl bg-color-for-layer-on-body p-5 pb-14 text-start sm:w-3/4 sm:max-w-none">
                    <strong className="line-clamp-2 text-[18px] leading-7 font-s-sbold text-[#141d26]">
                      {title}
                    </strong>
                    <span className="mt-2 line-clamp-2 text-base leading-7 text-[#141d26cc]">
                      {cleanText(excerpt)}
                    </span>
                    <span className="absolute start-5 bottom-5 inline-flex items-center gap-2 text-sm font-s-medium text-first">
                      {t('mainpage.landingBlogs.readMore')}
                      <ForwardIcon
                        aria-hidden="true"
                        className={cn(
                          'h-4 w-4 transition-transform',
                          isRtl ? 'group-hover:-translate-x-1' : 'group-hover:translate-x-1',
                        )}
                      />
                    </span>
                  </span>
                </Link>
              </SwiperSlide>
            );
          })}
        </Swiper>
      </div>
    </section>
  );
};

export default BlogsSlider;
