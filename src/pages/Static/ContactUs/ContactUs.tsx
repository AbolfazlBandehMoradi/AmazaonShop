import { useTranslation } from 'react-i18next';
import { Building2, Headphones, Mail, MapPin, Navigation, Phone } from 'lucide-react';
import { useLangStore } from '@/stores/languageStore';

interface ContactTranslation {
  phone: string;
  phoneFactory: string;
  phoneSound: string;
  email: string;
  location: string;
}

const defaultContact: ContactTranslation = {
  phone: '',
  phoneFactory: '',
  phoneSound: '',
  email: '',
  location: '',
};

const safeText = (value: unknown) => (typeof value === 'string' ? value : '');

const getPhoneHref = (value?: unknown) => {
  const text = safeText(value);
  const phone = text.match(/\+?[\d\s()-]{7,}/)?.[0]?.replace(/[^\d+]/g, '');

  return phone ? `tel:${phone}` : '#';
};

const getEmailHref = (value?: unknown) => {
  const text = safeText(value);
  const email = text.match(/[^\s:]+@[^\s:]+\.[^\s:]+/)?.[0];

  return email ? `mailto:${email}` : '#';
};

const ContactUs = () => {
  const { t } = useTranslation();
  const dir = useLangStore((state) => state.dir);

  const rawContact = t('contact', { returnObjects: true });

  const contactData: ContactTranslation = {
    ...defaultContact,
    ...(typeof rawContact === 'object' && rawContact !== null ? rawContact : {}),
  };

  const mapHref = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
    contactData.location || '',
  )}`;

  const contactItems = [
    {
      icon: Phone,
      text: contactData.phone,
      href: getPhoneHref(contactData.phone),
    },
    {
      icon: Building2,
      text: contactData.phoneFactory,
      href: getPhoneHref(contactData.phoneFactory),
    },
    {
      icon: Headphones,
      text: contactData.phoneSound,
      href: getPhoneHref(contactData.phoneSound),
    },
    {
      icon: Mail,
      text: contactData.email,
      href: getEmailHref(contactData.email),
    },
    {
      icon: MapPin,
      text: contactData.location,
      href: mapHref,
    },
  ].filter((item) => item.text?.trim());

  const copy = {
    title: t('nav.contact', { defaultValue: 'Contact us' }),
    subtitle: contactData.location,
    call: contactData.phoneSound || contactData.phone,
    email: contactData.email,
    map: 'Google Maps',
  };

  return (
    <main dir={dir} className="page-container page-section">
      <section className="overflow-hidden rounded-2xl border border-[color-mix(in_srgb,var(--first-text-color-svg)_18%,transparent)] bg-color-for-layer-on-body shadow-[0_24px_60px_-40px_rgba(0,0,0,0.55)]">
        <div className="grid gap-0 lg:grid-cols-[minmax(0,0.95fr)_minmax(0,1.05fr)]">
          <div className="relative flex min-h-full flex-col justify-between overflow-hidden bg-first-700 p-6 text-white sm:p-8 lg:p-10">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_15%,rgba(255,255,255,0.14),transparent_28%),radial-gradient(circle_at_90%_80%,rgba(192,57,43,0.32),transparent_32%)]" />

            <div className="relative">
              <span className="inline-flex rounded-md bg-[color-mix(in_srgb,var(--bg-color-for-layer-on-body)_12%,transparent)] px-3 py-1 text-xs font-medium uppercase tracking-[0.08em] text-white/80">
                {copy.title}
              </span>

              <h1 className="mt-5 font-s-sbold text-3xl leading-tight sm:text-4xl">{copy.title}</h1>

              <p className="mt-4 max-w-xl text-sm leading-7 text-white/76 sm:text-base">
                {copy.subtitle}
              </p>
            </div>

            <div className="relative mt-8 grid gap-3 sm:grid-cols-3 lg:grid-cols-1 xl:grid-cols-3">
              {copy.call && (
                <a
                  href={getPhoneHref(copy.call)}
                  className="inline-flex items-center justify-center gap-2 rounded-lg bg-color-for-layer-on-body px-4 py-3 text-sm font-medium first-text-color transition hover:-translate-y-0.5 hover:bg-color-for-layer-sec"
                >
                  <Phone className="h-4 w-4" />
                  <span className="min-w-0 truncate">{copy.call}</span>
                </a>
              )}

              {copy.email && (
                <a
                  href={getEmailHref(copy.email)}
                  className="inline-flex items-center justify-center gap-2 rounded-lg border border-[color-mix(in_srgb,var(--bg-color-for-layer-on-body)_24%,transparent)] px-4 py-3 text-sm font-medium text-white transition hover:-translate-y-0.5 hover:bg-[color-mix(in_srgb,var(--bg-color-for-layer-on-body)_10%,transparent)]"
                >
                  <Mail className="h-4 w-4" />
                  <span className="min-w-0 truncate">{copy.email}</span>
                </a>
              )}

              {contactData.location && (
                <a
                  href={mapHref}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center justify-center gap-2 rounded-lg border border-[color-mix(in_srgb,var(--bg-color-for-layer-on-body)_24%,transparent)] px-4 py-3 text-sm font-medium text-white transition hover:-translate-y-0.5 hover:bg-[color-mix(in_srgb,var(--bg-color-for-layer-on-body)_10%,transparent)]"
                >
                  <Navigation className="h-4 w-4" />
                  {copy.map}
                </a>
              )}
            </div>
          </div>

          <div className="grid gap-6 p-5 sm:p-6 lg:p-8">
            <div className="grid gap-3 sm:grid-cols-2">
              {contactItems.map((item, idx) => (
                <a
                  key={`${item.href}-${idx}`}
                  href={item.href}
                  target={item.href.startsWith('http') ? '_blank' : undefined}
                  rel={item.href.startsWith('http') ? 'noreferrer' : undefined}
                  className={`group flex min-h-24 items-start gap-4 rounded-xl border border-[color-mix(in_srgb,var(--first-text-color-svg)_16%,transparent)] bg-color-for-layer-sec p-4 transition hover:-translate-y-0.5 hover:border-first/40 hover:bg-color-for-layer-on-body hover:shadow-[0_18px_34px_-28px_rgba(0,0,0,0.6)] ${
                    idx === contactItems.length - 1 ? 'sm:col-span-2' : ''
                  }`}
                >
                  <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-first/10 text-first transition group-hover:bg-first group-hover:text-white">
                    <item.icon className="h-5 w-5" />
                  </span>

                  <span className="first-text-color-for-paragraph text-sm leading-7">
                    {item.text}
                  </span>
                </a>
              ))}
            </div>

            <div className="overflow-hidden rounded-2xl border border-[color-mix(in_srgb,var(--first-text-color-svg)_18%,transparent)] bg-color-for-layer-sec">
              <div className="flex flex-col gap-1 px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <h2 className="font-s-sbold text-lg first-text-color">{copy.title}</h2>

                  <p className="mt-1 text-sm first-text-color-for-paragraph">
                    {contactData.location}
                  </p>
                </div>

                <MapPin className="hidden h-6 w-6 text-secound sm:block" />
              </div>

              <div className="h-72 border-t border-[color-mix(in_srgb,var(--first-text-color-svg)_14%,transparent)] sm:h-80 lg:h-96">
                <iframe
                  title={contactData.location || 'Map'}
                  className="h-full w-full grayscale-[20%]"
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d401.86965147211316!2d59.49794620533543!3d36.31334444866866!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3f6c9299b596bdb1%3A0xbe1f7744d50bd016!2sRazavi%20Khorasan%20Province%2C%20Mashhad%2C%20District%209%2C%20Honarestan%2031%2C%20Iran!5e0!3m2!1sen!2s!4v1784984773982!5m2!1sen!2s"
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                />
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
};

export default ContactUs;
