import { useTranslation } from 'react-i18next';

import { useLangStore } from '@/stores/languageStore';

const brands = [
  'Samsung',
  'Xiaomi',
  'Apple',
  'Sony',
  'Nothing',
  'QCY',
  'Anker',
  'Green Lion',
  'Motorola',
  'HTC',
];

export default function Brands() {
  const { t } = useTranslation();
  const { dir } = useLangStore();

  return (
    <section dir={dir} className="landing-section" aria-labelledby="brands-title">
      <div className="landing-container">
        <div className="text-center">
          <h2 id="brands-title" className="text-xl leading-7 font-f-bold text-text">
            {t('mainpage.brands.title')}
          </h2>
          <p className="mt-2 text-sm leading-6 text-text-muted">
            {t('mainpage.brands.description')}
          </p>
        </div>

        <ul className="mt-7 grid grid-cols-2 gap-2.5 sm:grid-cols-3 lg:grid-cols-5">
          {brands.map((brand) => (
            <li
              key={brand}
              className="flex h-[84px] min-w-0 items-center justify-center rounded-[18px] bg-surface px-4 py-6 text-center text-lg leading-7 font-f-sbold text-text transition-[transform,box-shadow,background-color,color] duration-200 hover:bg-first/5 hover:text-first hover:shadow-md motion-safe:hover:-translate-y-1 sm:text-xl xl:text-2xl xl:leading-9"
            >
              <span dir="ltr">{brand}</span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
