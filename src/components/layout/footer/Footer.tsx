import { Mail, MessageCircle, Phone } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import EnamadLogo from '@/assets/Images/E-namd/E-namd-2.png';
import SamandehiLogo from '@/assets/Images/E-namd/E-namd.png';
import MainLogo from '@/assets/Images/Logo/logo-nav.png';
import { useLocalizedPath } from '@/hooks/useLocalizedPath';
import { useLangStore } from '@/stores/languageStore';
import type { SVGProps } from 'react';

export function Instagram(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
      {...props}
    >
      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
    </svg>
  );
}

const instagramUrl = 'https://www.instagram.com/beris_handicrafts/';

export const Footer = () => {
  const { t } = useTranslation();
  const dir = useLangStore((s) => s.dir);
  const localizedPath = useLocalizedPath();

  const socialLinks = [
    {
      key: 'instagram',
      href: instagramUrl,
      icon: Instagram,
      external: true,
    },
    {
      key: 'whatsapp',
      href: 'https://ble.ir/09361844504',
      icon: MessageCircle,
      external: true,
    },
    {
      key: 'email',
      href: 'arefarbabi71@gmail.com',
      icon: Mail,
      external: false,
    },
    {
      key: 'phone',
      href: 'tel:09361844504',
      icon: Phone,
      external: false,
    },
  ] as const;

  const columns = [
    {
      key: 'services',
      links: [
        { key: 'shipping', to: '/faq' },
        { key: 'returns', to: '/return-policy' },
        { key: 'faq', to: '/faq' },
        { key: 'offers', to: '/products' },
      ],
    },
    {
      key: 'shop',
      links: [
        { key: 'categories', to: '/categories' },
        { key: 'products', to: '/products' },
        { key: 'blogs', to: '/blogs' },
        { key: 'specialOffers', to: '/products' },
      ],
    },
    {
      key: 'contact',
      links: [
        { key: 'about', to: '/about-us' },
        { key: 'contact', to: '/contact-us' },
        { key: 'support', to: '/contact-us' },
        { key: 'faq', to: '/faq' },
      ],
    },
  ] as const;

  const trustMarks = [
    {
      key: 'samandehi',
      src: SamandehiLogo,
      href: '',
    },
  ] as const;

  return (
    <footer dir={dir} className="mt-10 pb-25 lg:pb-8">
      <div className="landing-container">
        <div className="overflow-hidden rounded-3xl border border-color-theme bg-color-for-layer-on-body first-text-color shadow-dark-sm">
          <div className="grid gap-10 px-5 py-8 sm:grid-cols-2 sm:px-8 sm:py-10 lg:grid-cols-12 lg:gap-8 lg:px-10 lg:py-12">
            <section className="sm:col-span-2 lg:col-span-4" aria-labelledby="footer-brand">
              <Link
                to={localizedPath('/')}
                className="inline-flex items-center gap-3 rounded-xl"
                aria-label={t('footer.brand.title')}
              >
                <img
                  src={MainLogo}
                  alt=""
                  className="h-16 w-16 shrink-0 object-contain"
                  loading="lazy"
                />
                <h2 id="footer-brand" className="text-2xl font-s-bold text-first">
                  {t('footer.brand.title')}
                </h2>
              </Link>

              <p className="mt-4 max-w-xl text-sm leading-8 first-text-color-for-paragraph">
                {t('footer.brand.description')}
              </p>

              <div className="mt-6 flex flex-wrap gap-3">
                {socialLinks.map(({ key, href, icon: Icon, external }) => (
                  <a
                    key={key}
                    href={href}
                    target={external ? '_blank' : undefined}
                    rel={external ? 'noopener noreferrer' : undefined}
                    aria-label={t(`footer.social.${key}`)}
                    className="flex h-10 w-10 items-center justify-center rounded-xl bg-secound/10 text-secound transition-colors hover:bg-secound hover:text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-secound"
                  >
                    <Icon className="h-5 w-5" strokeWidth={1.8} aria-hidden="true" />
                  </a>
                ))}
              </div>
            </section>

            <div className="grid grid-cols-1 gap-x-6 gap-y-8 xs:grid-cols-2 sm:col-span-2 sm:grid-cols-3 lg:col-span-5">
              {columns.map((column) => (
                <nav key={column.key} aria-label={t(`footer.columns.${column.key}.title`)}>
                  <h3 className="font-s-sbold first-text-color">
                    {t(`footer.columns.${column.key}.title`)}
                  </h3>
                  <ul className="mt-4 space-y-3">
                    {column.links.map((link) => (
                      <li key={link.key}>
                        <Link
                          to={localizedPath(link.to)}
                          className="text-sm first-text-color-for-paragraph transition-colors hover:text-secound"
                        >
                          {t(`footer.columns.${column.key}.${link.key}`)}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </nav>
              ))}
            </div>

            <section
              className="mx-auto w-full max-w-md sm:col-span-2 lg:col-span-3 lg:max-w-none"
              aria-labelledby="footer-trust"
            >
              <div className="flex h-full max-h-54 flex-col overflow-hidden rounded-2xl border border-color-theme bg-color-for-layer-sec p-4">
                <h3
                  id="footer-trust"
                  className="shrink-0 border-b border-dashed border-color-theme pb-3 text-center text-sm font-s-sbold first-text-color-for-paragraph"
                >
                  {t('footer.trust.title')}
                </h3>

                <div className="grid min-h-0 flex-1 grid-cols-2 gap-3 pt-4">
                  {trustMarks.map((mark) => (
                    <div
                      key={mark.key}
                      className="flex min-h-0 min-w-0 items-center justify-center rounded-xl border border-color-theme bg-color-for-layer-on-body p-2"
                    >
                      {mark.href ? (
                        <a
                          href={mark.href}
                          className="flex  h-full"
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <img
                            src={mark.src}
                            alt={t(`footer.trust.${mark.key}`)}
                            className="max-h-full max-w-full object-contain"
                            loading="lazy"
                          />
                        </a>
                      ) : (
                        <img
                          src={mark.src}
                          alt={t(`footer.trust.${mark.key}`)}
                          className="max-h-full max-w-full object-contain"
                          loading="lazy"
                        />
                      )}
                    </div>
                  ))}
                  <a
                    referrerPolicy="origin"
                    target="_blank"
                    href="https://trustseal.enamad.ir/?id=739665&Code=7DYKLIohiUdwez6k9DMZquLHhjHQBcix"
                  >
                    <img
                      referrerPolicy="origin"
                      src="https://trustseal.enamad.ir/logo.aspx?id=739665&Code=7DYKLIohiUdwez6k9DMZquLHhjHQBcix"
                      alt=""
                      code="7DYKLIohiUdwez6k9DMZquLHhjHQBcix"
                    />
                  </a>
                </div>
              </div>
            </section>
          </div>

          <p className="border-t border-color-theme bg-color-for-layer-sec px-5 py-4 text-center text-xs leading-6 first-text-color-for-paragraph-low sm:text-sm">
            {t('footer.copyright', { year: new Date().getFullYear() })}
            <span className="mx-2" aria-hidden="true">
              |
            </span>
            <a
              href="https://adrin-innovation.ir/"
              target="_blank"
              rel="noopener noreferrer"
              className="transition-colors hover:text-secound"
            >
              طراحی شده توسط شرکت نوآوری افق مدرن
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
};
