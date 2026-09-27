import React from 'react';
import { Sun, Moon } from 'lucide-react';
import { useThemeStore } from '@/stores/themeStore';
import { useTranslation } from 'react-i18next';
import { cn } from '@/utils/cn';

interface ThemeToggleButtonProps {
  className?: string;
}

export const ThemeToggleButton: React.FC<ThemeToggleButtonProps> = ({ className }) => {
  const { theme, setTheme } = useThemeStore();
  const { t } = useTranslation();
  const toggleTheme = () => setTheme(theme === 'dark' ? 'light' : 'dark');
  return (
    <button
      type="button"
      onClick={toggleTheme}
      className={cn(
        'inline-flex h-11 w-11 items-center justify-center rounded-xl first-text-color-for-paragraph transition-colors hover:bg-color-for-layer-sec hover:text-first',
        className,
      )}
      title={t('common.toggleTheme')}
      aria-label={t('common.toggleTheme')}
    >
      {theme === 'dark' ? (
        <Moon className="h-5 w-5" strokeWidth={1.8} />
      ) : (
        <Sun className="h-5 w-5" strokeWidth={1.8} />
      )}
    </button>
  );
};
