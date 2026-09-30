import { Link } from 'react-router-dom';

import { useGalleriesByCategory, type GalleriesByCategoryResponse } from '@/hooks/useGalleries';
import { useLocalizedPath } from '@/hooks/useLocalizedPath';
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
        width={652}
        height={256}
        loading="lazy"
        decoding="async"
        className="block aspect-[652/256] w-full object-cover"
      />
    </Link>
  );
}

export default function BannerGallery() {
  const { data } = useGalleriesByCategory('banner');
  const { dir } = useLangStore();
  const items = [...(data?.items ?? [])].sort((a, b) => a.displayOrder - b.displayOrder);

  if (!data?.category || items.length === 0) return null;

  return (
    <section dir={dir} className="landing-section" aria-label={data.category.name}>
      <div className="landing-container">
        <div className="grid grid-cols-1 gap-2 lg:grid-cols-2">
          {items.map((item) => (
            <Banner key={item.id} item={item} fallbackAlt={data.category.name} />
          ))}
        </div>
      </div>
    </section>
  );
}
