import { useLangStore } from '@/stores/languageStore';

const IndexLoading = () => {
  const lang = useLangStore((s) => s.lang);
  const isFa = lang === 'fa';

  const title = isFa
    ? 'به فروشگاه صنایع دستی بریس خوش آمدید'
    : ' Welcome to Bris Handicrafts Store';

  const subtitle = isFa
    ? ' ساخته‌شده برای هنر ایران'
    : 'Crafted for Iranian Art';

  return (
    <div
      dir={isFa ? 'rtl' : 'ltr'}
      className="fixed inset-0 z-60 flex items-center justify-center bg-color-for-body"
      role="status"
      aria-live="polite"
    >
      <div className="flex flex-col items-center px-6 text-center">
        {/* Woven handmade mark */}
        <div className="relative h-16 w-16">
          <span className="weave-line weave-line-1" />
          <span className="weave-line weave-line-2" />
          <span className="weave-line weave-line-3" />

          <span className="weave-thread weave-thread-1" />
          <span className="weave-thread weave-thread-2" />
          <span className="weave-thread weave-thread-3" />
        </div>

        <h1 className="mt-6 text-base font-s-sbold first-text-color">
          {title}
        </h1>

        <p className="mt-2 text-sm first-text-color-for-paragraph-low">
          {subtitle}
        </p>

        <style>
          {`
            .weave-line {
              position: absolute;
              left: 10px;
              right: 10px;
              height: 3px;
              border-radius: 999px;
              background: var(--first-color, #8b5e34);
              opacity: 0.9;
              animation: weaveSoft 1.6s ease-in-out infinite;
            }

            .weave-line-1 {
              top: 16px;
              animation-delay: 0ms;
            }

            .weave-line-2 {
              top: 31px;
              background: var(--secound-color, #c49a6c);
              animation-delay: 160ms;
            }

            .weave-line-3 {
              top: 46px;
              background: var(--third-color, #e7d3b1);
              animation-delay: 320ms;
            }

            .weave-thread {
              position: absolute;
              top: 8px;
              bottom: 8px;
              width: 3px;
              border-radius: 999px;
              background: #ece7df;
            }

            .weave-thread-1 {
              left: 18px;
            }

            .weave-thread-2 {
              left: 31px;
            }

            .weave-thread-3 {
              left: 44px;
            }

            @keyframes weaveSoft {
              0%, 100% {
                transform: scaleX(0.75);
                opacity: 0.45;
              }

              50% {
                transform: scaleX(1);
                opacity: 1;
              }
            }
          `}
        </style>
      </div>
    </div>
  );
};

export default IndexLoading;
