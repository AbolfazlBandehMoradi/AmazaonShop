import { MessageCircle, Phone } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import EnamadLogo from '@/assets/Images/E-namd/E-namd-2.png';
import ZibalLogo from '@/assets/Images/E-namd/E-namd.png';
import { AmazonMark } from '@/components/layout/brand/AmazonMark';
import { storeContact } from '@/config/store';
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

export const Footer = () => {
  const { t } = useTranslation();
  const dir = useLangStore((s) => s.dir);
  const localizedPath = useLocalizedPath();

  const socialLinks = [
    {
      key: 'instagram',
      href: storeContact.instagram,
      icon: Instagram,
      external: true,
    },
    {
      key: 'whatsapp',
      href: storeContact.whatsapp,
      icon: MessageCircle,
      external: true,
    },
    {
      key: 'phone',
      href: storeContact.phoneHref,
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
      key: 'enamad',
      src: EnamadLogo,
    },
    {
      key: 'zibal',
      src: ZibalLogo,
    },
  ] as const;

  return (
    <footer
      dir={dir}
      className="mt-10 px-3 pb-[calc(8rem+env(safe-area-inset-bottom))] first-text-color sm:px-6 lg:px-8 lg:pb-8"
    >
      <div className="mx-auto w-full max-w-376 rounded-[40px] bg-color-for-layer-on-body p-5 sm:p-8 lg:p-10 2xl:p-16">
        <section className="flex flex-col items-center text-center" aria-labelledby="footer-brand">
          <Link
            to={localizedPath('/')}
            className="inline-flex items-center justify-center gap-3 rounded-xl"
            aria-label={t('footer.brand.title')}
          >
            <AmazonMark className="h-14 w-14 shrink-0" />
            <h2 id="footer-brand" className="shop-brand-name text-xl text-first sm:text-2xl">
              {t('footer.brand.title')}
            </h2>
          </Link>
          <p className="mt-4 max-w-2xl text-sm leading-8 first-text-color-for-paragraph sm:text-base">
            {t('footer.brand.description')}
          </p>
        </section>

        <div className="mt-8 border-t border-dashed border-color-theme" aria-hidden="true" />

        <div className="mt-8 flex flex-col gap-10 lg:flex-row lg:justify-between lg:gap-8">
          <div className="grid grid-cols-2 gap-x-6 gap-y-8 sm:grid-cols-3 lg:shrink-0 lg:gap-x-8 2xl:gap-x-14">
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

          <div className="flex flex-col gap-8 sm:flex-row sm:items-start lg:flex-col 2xl:flex-row 2xl:gap-10">
            <section className="max-w-64" aria-labelledby="footer-address">
              <h3 id="footer-address" className="font-s-sbold first-text-color">
                {t('footer.address.title')}
              </h3>
              <address className="mt-4 text-sm leading-7 not-italic first-text-color-for-paragraph">
                {t('footer.address.value')}
              </address>
              <nav className="mt-5 flex flex-wrap gap-3" aria-label={t('footer.social.label')}>
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
              </nav>
            </section>

            <div
              role="group"
              aria-label={t('footer.trust.label')}
              className="flex w-fit max-w-full items-center justify-center gap-4 rounded-3xl bg-white p-4"
            >
              {trustMarks.map((mark) => (
                <img
                  key={mark.key}
                  src={mark.src}
                  alt={t(`footer.trust.${mark.key}`)}
                  className="h-20 w-20 object-contain"
                  loading="lazy"
                />
              ))}
            </div>
          </div>
        </div>

        <div className="mt-10 flex min-h-14 flex-col items-center justify-center gap-1 rounded-3xl bg-white px-4 py-2 text-center text-xs text-[#4B5563] sm:h-14 sm:flex-row sm:justify-between sm:gap-6 sm:py-0 sm:text-sm">
          <p>{t('footer.copyright', { year: new Date().getFullYear() })}</p>
          <a
            href="https://adrin-innovation.ir/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-[#1C1C1C] transition-colors hover:text-secound"
          >
            {t('footer.credit')}
          </a>
        </div>
      </div>
    </footer>
  );
};
