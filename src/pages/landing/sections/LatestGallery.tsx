import { Link } from 'react-router';
import { A11y, Keyboard } from 'swiper/modules';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';

import { SectionHeading } from '@/components/ui/SectionHeading';
import { useGalleriesByCategory, type GalleriesByCategoryResponse } from '@/hooks/useGalleries';
import { useLocalizedPath } from '@/hooks/useLocalizedPath';
import { useSlideEdgeFade } from '@/hooks/useSlideEdgeFade';
import { useLangStore } from '@/stores/languageStore';

type GalleryBanner = GalleriesByCategoryResponse['items'][number];

function Banner({ item, fallbackAlt }: { item: GalleryBanner; fallbackAlt: string }) {
  const localizedPath = useLocalizedPath();

  return (
    <Link
      to={localizedPath(item.title)}
      className="block w-full overflow-hidden rounded-[32px] hover:shadow-xl focus-visible:shadow-xl focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-first motion-safe:transition-[transform,box-shadow] motion-safe:duration-300 motion-safe:ease-out motion-safe:hover:-translate-y-1 motion-safe:focus-visible:-translate-y-1"
    >
      <img
        src={item.image}
        alt={item.altText || fallbackAlt}
        width={322}
        height={442}
        loading="lazy"
        decoding="async"
        className="block aspect-[322/442] w-full object-cover"
      />
    </Link>
  );
}

export default function LatestGallery() {
  const { data } = useGalleriesByCategory('latest');
  const { dir } = useLangStore();
  const { fadeWidth, updateFade } = useSlideEdgeFade();
  const items = [...(data?.items ?? [])].sort((a, b) => a.displayOrder - b.displayOrder);

  if (!data?.category || items.length === 0) return null;

  return (
    <section dir={dir} className="landing-section" aria-labelledby="latest-gallery-title">
      <div className="landing-container">
        <SectionHeading
          id="latest-gallery-title"
          title={data.category.description}
          subtext={data.category.name}
          align="center"
          decoration="both"
          titleClassName="sm:text-2xl"
        />

        <div className="mt-6">
          <div className="relative lg:hidden">
            <Swiper
              key={dir}
              dir={dir}
              modules={[A11y, Keyboard]}
              keyboard={{ enabled: true, onlyInViewport: true }}
              slidesPerView={1.12}
              spaceBetween={8}
              breakpoints={{
                480: { slidesPerView: 1.6 },
                640: { slidesPerView: 2.15 },
                768: { slidesPerView: 2.6 },
              }}
              grabCursor={items.length > 1}
              watchOverflow
              onSwiper={updateFade}
              onSlideChange={updateFade}
              onResize={updateFade}
              onBreakpoint={updateFade}
              onLock={updateFade}
              onUnlock={updateFade}
            >
              {items.map((item) => (
                <SwiperSlide key={item.id}>
                  <Banner item={item} fallbackAlt={data.category.name} />
                </SwiperSlide>
              ))}
            </Swiper>
            {fadeWidth > 0 && (
              <div
                className="landing-slider-edge-fade"
                style={{ width: fadeWidth }}
                aria-hidden="true"
              />
            )}
          </div>

          <div className="hidden lg:grid lg:grid-cols-4 lg:gap-2">
            {items.map((item) => (
              <Banner key={item.id} item={item} fallbackAlt={data.category.name} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
