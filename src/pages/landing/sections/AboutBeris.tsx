import { ArrowLeft, ArrowRight } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';

import BottomRightAboutImage from '@/assets/Images/Landing/bottom-right-about-img.png';
import LeftAboutImage from '@/assets/Images/Landing/left-about-img.png';
import TopRightAboutImage from '@/assets/Images/Landing/top-right-about-img.png';
import { useLocalizedPath } from '@/hooks/useLocalizedPath';
import { useLangStore } from '@/stores/languageStore';

const AboutBeris = () => {
  const { t } = useTranslation();
  const localizedPath = useLocalizedPath();
  const { dir } = useLangStore();
  const ForwardIcon = dir === 'rtl' ? ArrowLeft : ArrowRight;

  const features = ['handmade', 'quality', 'artists'] as const;

  return (
    <section className="landing-section" aria-labelledby="landing-about-title">
      <div className="landing-container">
        <div
          dir="ltr"
          className="grid overflow-hidden lg:py-4 rounded-3xl bg-first lg:min-h-116 lg:grid-cols-[minmax(0,9fr)_minmax(0,11fr)] lg:gap-[clamp(1.5rem,4vw,5rem)]"
        >
          <div
            dir={dir}
            className="order-1 flex min-w-0 flex-col justify-center p-6 py-8 text-white sm:p-9 lg:order-2 lg:p-8 xl:p-10 xl:pe-12"
          >
            <h2
              id="landing-about-title"
              className="max-w-xl text-2xl leading-10 font-s-sbold sm:text-3xl lg:text-[1.75rem] lg:leading-9 xl:text-3xl xl:leading-10"
            >
              {t('mainpage.about.title')}
            </h2>
            <p className="mt-4 max-w-2xl text-sm leading-8 text-white/80 sm:text-base lg:mt-3 lg:text-sm lg:leading-7 xl:text-base xl:leading-8">
              {t('mainpage.about.description')}
            </p>
            <Link
              to={localizedPath('/about-us')}
              className="group mt-6 inline-flex h-12 w-fit items-center gap-2 rounded-xl bg-secound px-5 font-s-medium text-white transition-colors hover:bg-secound-600 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white lg:mt-5 lg:h-11"
            >
              <span>{t('mainpage.about.cta')}</span>
              <ForwardIcon
                aria-hidden="true"
                className="h-4 w-4 transition-transform group-hover:-translate-x-1 rtl:group-hover:translate-x-1"
              />
            </Link>

            <div className="mt-8 grid gap-4 sm:grid-cols-3 sm:gap-6 lg:mt-6 lg:gap-4 xl:gap-6">
              {features.map((feature) => (
                <article
                  key={feature}
                  className="rounded-xl border border-[color-mix(in_srgb,var(--bg-color-for-layer-on-body)_20%,transparent)] bg-[color-mix(in_srgb,var(--bg-color-for-layer-on-body)_10%,transparent)] p-4 text-center backdrop-blur-[79.6px]"
                >
                  <h3 className="text-base font-s-sbold">
                    {t(`mainpage.about.features.${feature}.title`)}
                  </h3>
                  <p className="mt-1 text-sm leading-6 text-white/70">
                    {t(`mainpage.about.features.${feature}.description`)}
                  </p>
                </article>
              ))}
            </div>
          </div>

          <div className="order-2 flex min-w-0 items-center justify-center p-3 sm:p-4 lg:order-1 lg:p-5">
            <div className="grid aspect-500/421 w-full grid-cols-[303fr_193fr] grid-rows-2 gap-2 lg:max-w-lg">
              <img
                src={LeftAboutImage}
                alt={t('mainpage.about.images.artist')}
                loading="lazy"
                className="row-span-2 h-full min-h-0 w-full min-w-0 rounded-xl object-cover"
              />
              <img
                src={TopRightAboutImage}
                alt={t('mainpage.about.images.needlework')}
                loading="lazy"
                className="h-full min-h-0 w-full min-w-0 rounded-xl object-cover"
              />
              <img
                src={BottomRightAboutImage}
                alt={t('mainpage.about.images.workshop')}
                loading="lazy"
                className="h-full min-h-0 w-full min-w-0 rounded-xl object-cover"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutBeris;
