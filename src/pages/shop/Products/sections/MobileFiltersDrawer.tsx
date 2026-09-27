import { useEffect, useRef } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { X } from 'lucide-react';

import { useTranslation } from '@/i18n/useTranslation';
import { type Category } from '@/types';
import { type Showcase } from '@/hooks/useShowcases';
import { cn } from '@/utils/cn';
import { usePageScrollLock } from '@/hooks/usePageScrollLock';
import FiltersSidebar from './FiltersSidebar';

type MobileFiltersDrawerProps = {
  isOpen: boolean;
  onClose: () => void;
  categories?: Category[];
  isCategoriesLoading: boolean;
  showcases?: Showcase[];
  isShowcasesLoading: boolean;
  expanded: Record<string, boolean>;
  toggleSection: (key: string) => void;
  hasOffer?: boolean;
  setHasOffer: (value: boolean | undefined) => void;
  hasActiveFilters: boolean;
  handleClearFilters: () => void;
  dir: 'rtl' | 'ltr';
};

export default function MobileFiltersDrawer({
  isOpen,
  onClose,
  categories,
  isCategoriesLoading,
  showcases,
  isShowcasesLoading,
  expanded,
  toggleSection,
  hasOffer,
  setHasOffer,
  hasActiveFilters,
  handleClearFilters,
  dir,
}: MobileFiltersDrawerProps) {
  const { t } = useTranslation();
  const closeButtonRef = useRef<HTMLButtonElement>(null);

  usePageScrollLock(isOpen);

  useEffect(() => {
    if (!isOpen) return;

    const focusTimer = window.setTimeout(() => closeButtonRef.current?.focus(), 0);

    return () => {
      window.clearTimeout(focusTimer);
    };
  }, [isOpen]);

  const handleKeyDown = (event: React.KeyboardEvent<HTMLElement>) => {
    if (event.key === 'Escape') {
      onClose();
      return;
    }

    if (event.key !== 'Tab') return;

    const focusableElements = Array.from(
      event.currentTarget.querySelectorAll<HTMLElement>(
        'a[href], button:not([disabled]), input:not([disabled]), [tabindex]:not([tabindex="-1"])',
      ),
    ).filter((element) => element.getClientRects().length > 0);

    if (!focusableElements.length) return;

    const firstElement = focusableElements[0];
    const lastElement = focusableElements[focusableElements.length - 1];

    if (event.shiftKey && document.activeElement === firstElement) {
      event.preventDefault();
      lastElement.focus();
    } else if (!event.shiftKey && document.activeElement === lastElement) {
      event.preventDefault();
      firstElement.focus();
    }
  };

  return (
    <AnimatePresence>
      {isOpen ? (
        <motion.div
          className="fixed inset-0 z-70 lg:hidden"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.18 }}
        >
          <button
            type="button"
            className="absolute inset-0 bg-color-for-overlay"
            aria-label={t('productsFilter.filters')}
            onClick={onClose}
          />

          <motion.aside
            dir={dir}
            role="dialog"
            aria-modal="true"
            aria-labelledby="mobile-products-filter-title"
            onKeyDown={handleKeyDown}
            className={cn(
              'absolute inset-x-0 bottom-0 flex max-h-[86dvh] w-full max-w-full flex-col overflow-hidden rounded-t-3xl border border-first-100/80 bg-color-for-layer-on-body shadow-2xl',
            )}
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'tween', duration: 0.24, ease: 'easeOut' }}
          >
            <div className="flex items-center justify-between gap-3 border-b border-first-100/80 px-4 py-3">
              <h2 id="mobile-products-filter-title" className="font-s-bold first-text-color">
                {t('productsFilter.filters')}
              </h2>
              <button
                ref={closeButtonRef}
                type="button"
                className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-secound text-white transition-colors hover:bg-secound-600"
                aria-label={t('productsFilter.filters')}
                onClick={onClose}
              >
                <X className="h-5 w-5" strokeWidth={1.8} aria-hidden="true" />
              </button>
            </div>

            <div className="min-h-0 flex-1 overflow-y-auto overflow-x-hidden p-4">
              <FiltersSidebar
                categories={categories}
                isCategoriesLoading={isCategoriesLoading}
                showcases={showcases}
                isShowcasesLoading={isShowcasesLoading}
                expanded={expanded}
                toggleSection={toggleSection}
                hasOffer={hasOffer}
                setHasOffer={setHasOffer}
                hasActiveFilters={hasActiveFilters}
                handleClearFilters={handleClearFilters}
                className="min-w-0 max-w-full"
                sticky={false}
                panelClassName="max-w-full overflow-hidden border-0 p-0 shadow-none"
              />
            </div>
          </motion.aside>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
