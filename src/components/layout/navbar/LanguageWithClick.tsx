import React from 'react';
import { Globe } from 'lucide-react';
import { useLangStore } from '@/stores/languageStore';
import { useLocation, useNavigate } from 'react-router-dom';
import { replacePathLanguage } from '@/utils/langRouting';
import { useTranslation } from 'react-i18next';
import { cn } from '@/utils/cn';

interface LanguageToggleProps {
  className?: string;
}

export const LanguageToggle: React.FC<LanguageToggleProps> = ({ className }) => {
  const { lang, setLang } = useLangStore();
  const { t } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();
  const switchToEnglish = t('nav.switchToEnglish');
  const switchToPersian = t('nav.switchToPersian');

  const toggleLang = () => {
    const nextLang = lang === 'fa' ? 'en' : 'fa';
    setLang(nextLang);
    navigate(
      replacePathLanguage(`${location.pathname}${location.search}${location.hash}`, nextLang),
      { replace: true },
    );
  };

  return (
    <button
      type="button"
      onClick={toggleLang}
      className={cn(
        'group relative inline-flex h-11 w-11 items-center justify-center rounded-xl first-text-color-for-paragraph transition-colors hover:bg-color-for-layer-sec hover:text-first',
        className,
      )}
      title={lang === 'fa' ? switchToEnglish : switchToPersian}
      aria-label={lang === 'fa' ? switchToEnglish : switchToPersian}
    >
      <Globe className="h-5 w-5" strokeWidth={1.8} />
      <span className="absolute bottom-0.5 left-1/2 -translate-x-1/2 text-[8px] font-bold leading-none">
        {lang === 'fa' ? 'EN' : 'FA'}
      </span>
    </button>
  );
};
