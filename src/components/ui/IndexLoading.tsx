import { useId } from 'react';
import { useTranslation } from 'react-i18next';

import './IndexLoading.css';

const ORBIT_MARKS = Array.from({ length: 36 }, (_, index) => index);
const SIGNALS = Array.from({ length: 3 }, (_, index) => index);

export default function IndexLoading() {
  const { t, i18n } = useTranslation();

  const id = useId();
  const gradientId = `${id}-gradient`;
  const glowId = `${id}-glow`;

  const language = i18n.resolvedLanguage ?? 'fa';

  return (
    <div
      className="amazon-loading"
      dir={i18n.dir(language)}
      lang={language}
      role="status"
      aria-live="polite"
      aria-atomic="true"
    >
      <span className="sr-only">
        {t('mainpage.loading.accessibleLabel')}
      </span>

      <div className="amazon-loading__scene" aria-hidden="true">
        {/* Background atmosphere */}
        <div className="amazon-loading__atmosphere" />
        <div className="amazon-loading__grid" />

        {/* Technical frame */}
        <div className="amazon-loading__frame">
          <span />
          <span />
          <span />
          <span />
        </div>

        {/* Header */}
        <header className="amazon-loading__header">
          <div className="amazon-loading__brand-mark">
            <span className="amazon-loading__brand-symbol">
              A
            </span>

            <span className="amazon-loading__brand-name">
              AMAZON
            </span>
          </div>

          <div className="amazon-loading__header-meta">
            <span>EST. 2026</span>
            <span>ZAHDAN / IR</span>
          </div>
        </header>

        {/* Main */}
        <main className="amazon-loading__content">
          <p className="amazon-loading__eyebrow">
            <span />
            {t('mainpage.loading.eyebrow')}
            <span />
          </p>

          <div className="amazon-loading__device">
            <div className="amazon-loading__halo" />

            {/* Outer technical rings */}
            <div className="amazon-loading__ring amazon-loading__ring--outer" />
            <div className="amazon-loading__ring amazon-loading__ring--middle" />
            <div className="amazon-loading__ring amazon-loading__ring--inner" />

            {/* Ring markings */}
            <div className="amazon-loading__marks">
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
            <div className="amazon-loading__scanner">
              <span />
            </div>

            {/* Signal waves */}
            <div className="amazon-loading__signals">
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
            <div className="amazon-loading__phone">
              <div className="amazon-loading__phone-frame">
                <div className="amazon-loading__phone-screen">
                  {/* Dynamic screen glow */}
                  <div className="amazon-loading__screen-glow" />

                  {/* Camera */}
                  <div className="amazon-loading__camera">
                    <span />
                    <span />
                    <span />
                  </div>

                  {/* Screen scan */}
                  <div className="amazon-loading__screen-scan" />

                  {/* Minimal interface */}
                  <div className="amazon-loading__screen-interface">
                    <span />
                    <span />
                    <span />
                  </div>

                  {/* Home indicator */}
                  <div className="amazon-loading__home-indicator" />
                </div>
              </div>

              {/* Side buttons */}
              <span className="amazon-loading__button amazon-loading__button--one" />
              <span className="amazon-loading__button amazon-loading__button--two" />
            </div>

            {/* Floating data points */}
            <div className="amazon-loading__data amazon-loading__data--top">
              <span>DEVICE</span>
              <strong>ONLINE</strong>
            </div>

            <div className="amazon-loading__data amazon-loading__data--right">
              <span>NETWORK</span>
              <strong>READY</strong>
            </div>

            <div className="amazon-loading__data amazon-loading__data--left">
              <span>STORE</span>
              <strong>2026</strong>
            </div>

            {/* Orange accent point */}
            <div className="amazon-loading__accent-point">
              <span />
            </div>
          </div>

          {/* Brand message */}
          <div className="amazon-loading__identity">
            <h1>{t('mainpage.loading.brandName')}</h1>

            <p>{t('mainpage.loading.tagline')}</p>
          </div>

          {/* Loading progress */}
          <div className="amazon-loading__status">
            <div className="amazon-loading__status-top">
              <span>{t('mainpage.loading.preparing')}</span>

              <span className="amazon-loading__percentage">
                <i />
                <i />
                <i />
              </span>
            </div>

            <div className="amazon-loading__progress">
              <span />
            </div>
          </div>
        </main>

        {/* Footer */}
        <footer className="amazon-loading__footer">
          <span className="amazon-loading__footer-line" />

          <span>
            {t('mainpage.loading.footer')}
          </span>

          <span className="amazon-loading__footer-line" />
        </footer>
      </div>
    </div>
  );
}