import { useEffect, useId, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Share2, X } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { ShareSocialMedia } from '@/components/reusable-components/ShareSocialMedia/ShareSocialMedia';
import { CopyLinkButton } from '@/components/ui/CopyLinkButton';
import { getCleanUrl } from '@/utils/url';
import { cn } from '@/utils/cn';
import { usePageScrollLock } from '@/hooks/usePageScrollLock';

interface Props {
  url?: string;
  title?: string;
  className?: string;
}

export function ShareLinkButton({ url, title = '', className }: Props) {
  const { t } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const dialogTitleId = useId();
  const shareUrl = getCleanUrl(url || (typeof window !== 'undefined' ? window.location.href : ''));
  usePageScrollLock(isOpen);

  useEffect(() => {
    if (!isOpen) return;

    const focusFrame = window.requestAnimationFrame(() => closeButtonRef.current?.focus());
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        event.preventDefault();
        setIsOpen(false);
      }
    };

    document.addEventListener('keydown', handleKeyDown);

    return () => {
      window.cancelAnimationFrame(focusFrame);
      document.removeEventListener('keydown', handleKeyDown);
      triggerRef.current?.focus();
    };
  }, [isOpen]);

  return (
    <>
      <motion.button
        ref={triggerRef}
        type="button"
        onClick={() => setIsOpen(true)}
        whileTap={{ scale: 0.95 }}
        aria-label={t('share.open')}
        className={cn(
          'relative flex h-10 w-full items-center justify-center overflow-hidden rounded-sm bg-first/5 text-first transition-all duration-200 hover:bg-first/10',
          className,
        )}
      >
        <Share2 className="h-4 w-4" />
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="fixed inset-0 z-[130] flex items-end justify-center bg-slate-950/60 px-3 pt-12 backdrop-blur-sm sm:items-center sm:p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsOpen(false)}
          >
            <motion.div
              role="dialog"
              aria-modal="true"
              aria-labelledby={dialogTitleId}
              className="w-full max-w-md overflow-hidden rounded-t-[1.75rem] border border-first-100/70 bg-color-for-layer-on-body shadow-[0_-24px_70px_-28px_rgba(15,23,42,0.75)] sm:rounded-3xl sm:shadow-2xl"
              initial={{ scale: 0.98, opacity: 0, y: 32 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.98, opacity: 0, y: 32 }}
              transition={{ duration: 0.2, ease: 'easeOut' }}
              onClick={(event) => event.stopPropagation()}
            >
              <div className="max-h-[calc(100dvh-3rem)] overflow-y-auto overscroll-contain px-4 pb-[calc(1rem+env(safe-area-inset-bottom))] pt-2 sm:p-6">
                <div
                  className="mx-auto mb-3 h-1 w-10 rounded-full bg-gray-400/35 sm:hidden"
                  aria-hidden="true"
                />

                <div className="mb-5 flex items-start justify-between gap-3">
                  <div className="flex min-w-0 items-start gap-3">
                    <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-first/10 text-first">
                      <Share2 className="h-5 w-5" strokeWidth={1.8} aria-hidden="true" />
                    </span>
                    <div className="min-w-0 pt-0.5">
                      <h3
                        id={dialogTitleId}
                        className="text-base font-s-bold first-text-color sm:text-lg"
                      >
                        {t('share.title')}
                      </h3>
                      {title ? (
                        <p className="mt-1 line-clamp-2 text-xs leading-5 first-text-color-for-paragraph-low sm:text-sm">
                          {title}
                        </p>
                      ) : null}
                    </div>
                  </div>

                  <button
                    ref={closeButtonRef}
                    type="button"
                    aria-label={t('common.cancel')}
                    onClick={() => setIsOpen(false)}
                    className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border border-first/10 bg-color-for-layer-sec text-first transition hover:border-first/20 hover:bg-first/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-first/35"
                  >
                    <X className="h-5 w-5" aria-hidden="true" />
                  </button>
                </div>

                <ShareSocialMedia
                  url={shareUrl}
                  title={title}
                  options={['telegram', 'whatsapp', 'instagram']}
                  className="grid grid-cols-3 gap-2.5"
                  buttonClassName="group flex min-h-24 min-w-0 flex-col items-center justify-center gap-2.5 rounded-2xl border border-first/10 bg-color-for-layer-sec px-2 py-3 first-text-color transition hover:border-first/25 hover:bg-first/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-first/35"
                  textClassName="w-full truncate text-center text-xs font-f-sbold sm:text-sm"
                  customItems={{
                    telegram: {
                      imageClassName: 'h-10 w-10 rounded-xl',
                    },
                    whatsapp: {
                      imageClassName: 'h-10 w-10 rounded-xl',
                    },
                    instagram: {
                      imageClassName: 'h-10 w-10 rounded-xl',
                    },
                  }}
                />

                <div className="mt-4 flex min-w-0 items-center gap-2 rounded-2xl border border-first/10 bg-color-for-layer-sec p-2 ps-3">
                  <p
                    dir="ltr"
                    className="min-w-0 flex-1 truncate text-left text-xs first-text-color-for-paragraph-low sm:text-sm"
                    title={shareUrl}
                  >
                    {shareUrl}
                  </p>
                  <CopyLinkButton
                    url={shareUrl}
                    className="h-10 w-10 shrink-0 rounded-xl border border-first/10"
                  />
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
