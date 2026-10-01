import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import { pageTranslations } from './locales/pages';
import { sharedTranslations } from './locales/shared';
import { shopTranslations } from './locales/shop';

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources: {
      fa: {
        translation: {
          ...sharedTranslations.fa,
          ...shopTranslations.fa,
          ...pageTranslations.fa,
        },
      },
      // Enable this resource alongside the English route when the English site launches.
      // en: {
      //   translation: {
      //     ...sharedTranslations.en,
      //     ...shopTranslations.en,
      //     ...pageTranslations.en,
      //   },
      // },
    },
    fallbackLng: 'fa',
    supportedLngs: ['fa'],
    // Restore ['fa', 'en'] here when English routes are enabled.
    load: 'currentOnly',
    detection: {
      order: [],
      caches: [],
    },
    interpolation: {
      escapeValue: false,
    },
  });



export default i18n;
