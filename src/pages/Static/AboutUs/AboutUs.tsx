import {
  ArrowUpLeft,
  Headset,
  MapPin,
  PackageCheck,
  ShieldCheck,
  Store,
  Truck,
  Tags,
  ShoppingBag,
} from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { useLocalizedPath } from '@/hooks/useLocalizedPath';
import { useLangStore } from '@/stores/languageStore';
import aboutShowroomImage from '@/assets/Images/Static/about-mobile-showroom.webp';

const featureIcons = [Tags, ShieldCheck, PackageCheck, Truck, Headset, ShoppingBag];

interface AboutTranslation {
  title: string;
  welcomeTo: string;
  description: string;
  imageAlt: string;
  imageCaption: string;
  shopButton: string;
  valuesTitle: string;
  valuesIntro: string;
  features: string[];
  contactTitle: string;
  contactDescription: string;
  contactButton: string;
}

export default function AboutUs() {
  const { t } = useTranslation();
  const dir = useLangStore((state) => state.dir);
  const localizedPath = useLocalizedPath();
  const about = t('about', { returnObjects: true }) as AboutTranslation;

  return (
    <main dir={dir} className="page-container page-section">
      <section
        aria-labelledby="about-heading"
        className="grid overflow-hidden rounded-3xl border border-color-theme bg-color-for-layer-on-body shadow-dark-sm lg:grid-cols-[minmax(0,1.08fr)_minmax(0,0.92fr)]"
      >
        <div className="flex flex-col justify-center px-6 py-9 sm:px-10 sm:py-12 lg:px-12 lg:py-16 xl:px-16">
          <span className="inline-flex w-fit items-center gap-2 rounded-full border border-color-theme bg-color-for-layer-sec px-3 py-1.5 text-xs font-s-sbold text-first dark:text-first-300">
            <Store className="h-4 w-4" strokeWidth={1.8} aria-hidden="true" />
            {about.welcomeTo}
          </span>
          <h1
            id="about-heading"
            className="mt-6 max-w-2xl text-3xl leading-tight font-s-bold first-text-color sm:text-4xl lg:text-[2.65rem] lg:leading-tight"
          >
            {about.title}
          </h1>
          <p className="mt-5 max-w-2xl text-sm leading-8 first-text-color-for-paragraph sm:text-base sm:leading-9">
            {about.description}
          </p>
          <div className="mt-8 flex flex-wrap items-center gap-3">
            <Link
              to={localizedPath('/products')}
              className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl bg-first px-6 py-3 text-sm font-s-sbold text-white transition-colors hover:bg-first-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-first"
            >
              {about.shopButton}
              <ArrowUpLeft className="h-4 w-4" aria-hidden="true" />
            </Link>
            <Link
              to={localizedPath('/contact-us')}
              className="inline-flex min-h-12 items-center justify-center rounded-xl border border-color-theme bg-color-for-layer-on-body px-6 py-3 text-sm font-s-sbold first-text-color transition-colors hover:bg-color-for-layer-sec focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-first"
            >
              {about.contactButton}
            </Link>
          </div>
        </div>

        <figure className="relative min-h-[280px] overflow-hidden bg-color-for-layer-sec sm:min-h-[360px] lg:min-h-[500px]">
          <img
            src={aboutShowroomImage}
            alt={about.imageAlt}
            className="absolute inset-0 h-full w-full object-cover object-center"
            loading="eager"
          />
          <figcaption className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/75 via-black/20 to-transparent px-6 pb-6 pt-20 sm:px-8 sm:pb-8">
            <span className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-black/30 px-4 py-2 text-xs font-s-sbold text-white backdrop-blur-sm sm:text-sm">
              <MapPin className="h-4 w-4 shrink-0" aria-hidden="true" />
              {about.imageCaption}
            </span>
          </figcaption>
        </figure>
      </section>

      <section aria-labelledby="about-values-heading" className="mt-12 sm:mt-16">
        <div className="max-w-2xl">
          <h2
            id="about-values-heading"
            className="text-2xl font-s-bold first-text-color sm:text-3xl"
          >
            {about.valuesTitle}
          </h2>
          <p className="mt-3 text-sm leading-7 first-text-color-for-paragraph sm:text-base">
            {about.valuesIntro}
          </p>
        </div>
        <ul className="mt-7 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {about.features.map((feature, index) => {
            const Icon = featureIcons[index] ?? PackageCheck;
            return (
              <li
                key={feature}
                className="flex min-h-40 flex-col rounded-2xl border border-color-theme bg-color-for-layer-on-body p-5 shadow-dark-sm sm:p-6"
              >
                <span
                  className="flex h-11 w-11 items-center justify-center rounded-xl bg-color-for-layer-sec text-first dark:text-first-300"
                  aria-hidden="true"
                >
                  <Icon className="h-5 w-5" strokeWidth={1.8} />
                </span>
                <p className="mt-5 text-sm leading-7 font-s-sbold first-text-color sm:text-base">
                  {feature}
                </p>
              </li>
            );
          })}
        </ul>
      </section>

      <section
        aria-labelledby="about-contact-heading"
        className="brand-gradient mt-12 overflow-hidden rounded-3xl px-6 py-9 text-white sm:mt-16 sm:px-10 sm:py-11 lg:flex lg:items-center lg:justify-between lg:gap-8"
      >
        <div className="max-w-2xl">
          <h2 id="about-contact-heading" className="text-2xl font-s-bold sm:text-3xl">
            {about.contactTitle}
          </h2>
          <p className="mt-3 text-sm leading-7 text-white/85 sm:text-base">
            {about.contactDescription}
          </p>
        </div>
        <Link
          to={localizedPath('/contact-us')}
          className="mt-6 inline-flex min-h-12 w-full shrink-0 items-center justify-center gap-2 rounded-xl bg-white px-6 py-3 text-sm font-s-sbold text-[#18183e] transition-colors hover:bg-[#eeeefa] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white sm:w-auto lg:mt-0"
        >
          {about.contactButton}
          <ArrowUpLeft className="h-4 w-4" aria-hidden="true" />
        </Link>
      </section>
    </main>
  );
}
