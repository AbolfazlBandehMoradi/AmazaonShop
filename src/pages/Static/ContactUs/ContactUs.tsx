import { ArrowUpLeft, Headset, MapPin, Phone, Store } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { useLocalizedPath } from '@/hooks/useLocalizedPath';
import { useLangStore } from '@/stores/languageStore';
import { siteMetadata } from '@/seo/metadata';

interface ContactTranslation {
  eyebrow: string;
  title: string;
  intro: string;
  phoneLabel: string;
  phone: string;
  callButton: string;
  supportLabel: string;
  supportDescription: string;
  locationLabel: string;
  location: string;
  mapTitle: string;
  mapDescription: string;
  directionsButton: string;
  aboutButton: string;
}

export default function ContactUs() {
  const { t } = useTranslation();
  const dir = useLangStore((state) => state.dir);
  const localizedPath = useLocalizedPath();
  const contact = t('contact', { returnObjects: true }) as ContactTranslation;
  const phoneHref = `tel:${siteMetadata.contact.phone}`;
  const mapSearchUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(contact.location)}`;
  const mapEmbedUrl = `https://www.google.com/maps?q=${encodeURIComponent(contact.location)}&output=embed`;

  return (
    <main dir={dir} className="page-container page-section">
      <header className="relative overflow-hidden rounded-3xl border border-color-theme bg-color-for-layer-sec px-6 py-10 sm:px-10 sm:py-12 lg:px-14 lg:py-16">
        <div className="relative z-10 max-w-2xl">
          <span className="inline-flex items-center gap-2 rounded-full border border-color-theme bg-color-for-layer-on-body px-3 py-1.5 text-xs font-s-sbold text-first dark:text-first-300">
            <Headset className="h-4 w-4" strokeWidth={1.8} aria-hidden="true" />
            {contact.eyebrow}
          </span>
          <h1 className="mt-6 text-3xl font-s-bold first-text-color sm:text-4xl lg:text-[2.65rem]">
            {contact.title}
          </h1>
          <p className="mt-4 max-w-xl text-sm leading-8 first-text-color-for-paragraph sm:text-base sm:leading-9">
            {contact.intro}
          </p>
        </div>
        <span
          className="pointer-events-none absolute -bottom-28 -end-16 h-72 w-72 rounded-full border-[44px] border-first/5 sm:-end-4 sm:h-96 sm:w-96 sm:border-[60px]"
          aria-hidden="true"
        />
      </header>

      <div className="mt-6 grid gap-6 lg:grid-cols-[minmax(0,0.85fr)_minmax(0,1.15fr)]">
        <section aria-label={contact.eyebrow} className="flex flex-col gap-4">
          <div
            className="rounded-3xl p-6 text-white shadow-first-sm sm:p-8"
            style={{ background: 'var(--offer-background)' }}
          >
            <span
              className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/15"
              aria-hidden="true"
            >
              <Phone className="h-6 w-6" strokeWidth={1.8} />
            </span>
            <h2 className="mt-6 text-sm font-s-sbold text-white/80">{contact.phoneLabel}</h2>
            <a
              href={phoneHref}
              dir="ltr"
              className="mt-2 block w-fit text-2xl font-s-bold text-white hover:underline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white sm:text-3xl"
            >
              {contact.phone}
            </a>
            <a
              href={phoneHref}
              className="mt-6 flex min-h-11 w-fit items-center justify-center gap-2 rounded-xl bg-white px-5 py-2.5 text-sm font-s-sbold text-first transition-colors hover:bg-first-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
            >
              {contact.callButton}
              <ArrowUpLeft className="h-4 w-4" aria-hidden="true" />
            </a>
          </div>

          <div className="flex gap-4 rounded-2xl border border-color-theme bg-color-for-layer-on-body p-5 shadow-dark-sm sm:p-6">
            <span
              className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-color-for-layer-sec text-first dark:text-first-300"
              aria-hidden="true"
            >
              <Headset className="h-5 w-5" strokeWidth={1.8} />
            </span>
            <div>
              <h2 className="font-s-sbold first-text-color">{contact.supportLabel}</h2>
              <p className="mt-1 text-sm leading-7 first-text-color-for-paragraph">
                {contact.supportDescription}
              </p>
            </div>
          </div>

          <div className="flex gap-4 rounded-2xl border border-color-theme bg-color-for-layer-on-body p-5 shadow-dark-sm sm:p-6">
            <span
              className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-color-for-layer-sec text-first dark:text-first-300"
              aria-hidden="true"
            >
              <MapPin className="h-5 w-5" strokeWidth={1.8} />
            </span>
            <div>
              <h2 className="font-s-sbold first-text-color">{contact.locationLabel}</h2>
              <address className="mt-1 text-sm leading-7 not-italic first-text-color-for-paragraph">
                {contact.location}
              </address>
            </div>
          </div>
        </section>

        <section
          aria-labelledby="contact-map-heading"
          className="flex min-w-0 flex-col overflow-hidden rounded-3xl border border-color-theme bg-color-for-layer-on-body shadow-dark-sm"
        >
          <div className="px-6 py-6 sm:px-8">
            <h2
              id="contact-map-heading"
              className="text-xl font-s-bold first-text-color sm:text-2xl"
            >
              {contact.mapTitle}
            </h2>
            <p className="mt-2 text-sm leading-7 first-text-color-for-paragraph">
              {contact.mapDescription}
            </p>
          </div>
          <div className="min-h-[300px] flex-1 bg-color-for-layer-sec sm:min-h-[360px]">
            <iframe
              title={contact.mapTitle}
              className="h-full min-h-[300px] w-full border-0 sm:min-h-[360px]"
              src={mapEmbedUrl}
              loading="lazy"
              allowFullScreen
            />
          </div>
          <div className="flex flex-wrap items-center justify-between gap-4 border-t border-color-theme px-6 py-5 sm:px-8">
            <span className="text-sm first-text-color-for-paragraph">{contact.location}</span>
            <a
              href={mapSearchUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex min-h-11 items-center gap-2 rounded-xl border border-color-theme px-4 py-2.5 text-sm font-s-sbold text-first transition-colors hover:bg-color-for-layer-sec focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-first dark:text-first-300"
            >
              {contact.directionsButton}
              <ArrowUpLeft className="h-4 w-4" aria-hidden="true" />
            </a>
          </div>
        </section>
      </div>

      <div className="mt-8 flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-color-theme bg-color-for-layer-sec px-6 py-5 sm:px-8">
        <div className="flex items-center gap-3 first-text-color">
          <Store
            className="h-5 w-5 shrink-0 text-first dark:text-first-300"
            strokeWidth={1.8}
            aria-hidden="true"
          />
          <span className="text-sm font-s-sbold sm:text-base">{contact.aboutButton}</span>
        </div>
        <Link
          to={localizedPath('/about-us')}
          className="inline-flex items-center gap-2 text-sm font-s-sbold text-first hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-first dark:text-first-300"
        >
          {t('about.title')}
          <ArrowUpLeft className="h-4 w-4" aria-hidden="true" />
        </Link>
      </div>
    </main>
  );
}
