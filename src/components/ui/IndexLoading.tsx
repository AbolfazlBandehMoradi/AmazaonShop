import { useTranslation } from 'react-i18next';
import MainLogo from '@/assets/Images/Logo/MainLogo.webp';
import { storeBrandName, storeContact } from '@/config/store';

import './IndexLoading.css';

const ORBIT_MARKS = Array.from({ length: 36 }, (_, index) => index);
const SIGNALS = Array.from({ length: 3 }, (_, index) => index);

export default function IndexLoading() {
  const { t, i18n } = useTranslation();

  const language = i18n.resolvedLanguage ?? 'fa';

  return (
    <div
      className="gajet30-loading"
      dir={i18n.dir(language)}
      lang={language}
      role="status"
      aria-live="polite"
      aria-atomic="true"
    >
      <span className="sr-only">
        {t('mainpage.loading.accessibleLabel', { brand: storeBrandName })}
      </span>

      <div className="gajet30-loading__scene" aria-hidden="true">
        {/* Background atmosphere */}
        <div className="gajet30-loading__atmosphere" />
        <div className="gajet30-loading__grid" />

        {/* Technical frame */}
        <div className="gajet30-loading__frame">
          <span />
          <span />
          <span />
          <span />
        </div>

        {/* Header */}
        <header className="gajet30-loading__header">
          <div className="gajet30-loading__brand-mark">
            <img className="gajet30-loading__brand-symbol" src={MainLogo} alt="" width={48} height={48} />

            <span className="gajet30-loading__brand-name shop-brand-name">
              {storeBrandName}
            </span>
          </div>

          <div className="gajet30-loading__header-meta">
            <span>{t('mainpage.loading.location')}</span>
            <bdi dir="ltr">{storeContact.phone}</bdi>
          </div>
        </header>

        {/* Main */}
        <main className="gajet30-loading__content">
          <p className="gajet30-loading__eyebrow">
            <span />
            {t('mainpage.loading.eyebrow')}
            <span />
          </p>

          <div className="gajet30-loading__device">
            <div className="gajet30-loading__halo" />

            {/* Outer technical rings */}
            <div className="gajet30-loading__ring gajet30-loading__ring--outer" />
            <div className="gajet30-loading__ring gajet30-loading__ring--middle" />
            <div className="gajet30-loading__ring gajet30-loading__ring--inner" />

            {/* Ring markings */}
            <div className="gajet30-loading__marks">
              {ORBIT_MARKS.map((mark) => (
                <span
                  key={mark}
                  style={{
                    transform: `rotate(${mark * 10}deg)`,
                  }}
                />
              ))}
            </div>

            {/* Orbiting scanner */}
            <div className="gajet30-loading__scanner">
              <span />
            </div>

            {/* Signal waves */}
            <div className="gajet30-loading__signals">
              {SIGNALS.map((signal) => (
                <span
                  key={signal}
                  style={{
                    animationDelay: `${signal * 350}ms`,
                  }}
                />
              ))}
            </div>

            {/* Phone */}
            <div className="gajet30-loading__phone">
              <div className="gajet30-loading__phone-frame">
                <div className="gajet30-loading__phone-screen">
                  {/* Dynamic screen glow */}
                  <div className="gajet30-loading__screen-glow" />

                  {/* Camera */}
                  <div className="gajet30-loading__camera">
                    <span />
                    <span />
                    <span />
                  </div>

                  {/* Screen scan */}
                  <div className="gajet30-loading__screen-scan" />

                  {/* Minimal interface */}
                  <div className="gajet30-loading__screen-interface">
                    <span />
                    <span />
                    <span />
                  </div>

                  {/* Home indicator */}
                  <div className="gajet30-loading__home-indicator" />
                </div>
              </div>

              {/* Side buttons */}
              <span className="gajet30-loading__button gajet30-loading__button--one" />
              <span className="gajet30-loading__button gajet30-loading__button--two" />
            </div>

            {/* Floating data points */}
            <div className="gajet30-loading__data gajet30-loading__data--top">
              <span>{t('mainpage.loading.devices')}</span>
              <strong>{t('mainpage.loading.accessories')}</strong>
            </div>

            <div className="gajet30-loading__data gajet30-loading__data--right">
              <span>{t('mainpage.loading.quality')}</span>
              <strong>{t('mainpage.loading.variety')}</strong>
            </div>

            <div className="gajet30-loading__data gajet30-loading__data--left">
              <span>{t('mainpage.loading.buy')}</span>
              <strong>{t('mainpage.loading.sell')}</strong>
            </div>

            {/* Orange accent point */}
            <div className="gajet30-loading__accent-point">
              <span />
            </div>
          </div>

          {/* Brand message */}
          <div className="gajet30-loading__identity">
            <h1 className="shop-brand-name text-center!">{storeBrandName}</h1>

            <p>{t('mainpage.loading.tagline')}</p>
          </div>

          {/* Loading progress */}
          <div className="gajet30-loading__status">
            <div className="gajet30-loading__status-top">
              <span>{t('mainpage.loading.preparing')}</span>

              <span className="gajet30-loading__percentage">
                <i />
                <i />
                <i />
              </span>
            </div>

            <div className="gajet30-loading__progress">
              <span />
            </div>
          </div>
        </main>

        {/* Footer */}
        <footer className="gajet30-loading__footer">
          <span className="gajet30-loading__footer-line" />

          <span>
            {t('mainpage.loading.footer')}
          </span>

          <span className="gajet30-loading__footer-line" />
        </footer>
      </div>
    </div>
  );
}
