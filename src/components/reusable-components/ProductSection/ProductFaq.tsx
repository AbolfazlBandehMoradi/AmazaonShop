import cleanFaqHtml from '@/utils/cleanFaqHtml';
import type { ProductFaq } from '@/utils/shopApi';

interface ProductFaqsProps {
  faqs?: ProductFaq[];
  title?: string;
  subtitle?: string;
}

export function ProductFaqs({
  faqs,
  title = 'سوالات متداول',
  subtitle = 'پاسخ به سوالات متداول درباره این محصول',
}: ProductFaqsProps) {
  const activeFaqs = [...(faqs ?? [])]
    .filter((faq) => faq.isActive)
    .sort((a, b) => a.displayOrder - b.displayOrder);

  if (!activeFaqs.length) return null;

  return (
    <section className="mt-12">
      <div className="mb-6">
        <h3 className="text-lg font-bold first-text-color">{title}</h3>

        <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">{subtitle}</p>
      </div>

      <div className="rounded-2xl bg-first p-4">
        {activeFaqs.map((faq, index) => (
          <details
            key={`${faq.question}-${index}`}
            className="group overflow-hidden first:rounded-t-2xl last:rounded-b-2xl border-b border-gray-200/70 bg-white last:border-none transition-all duration-300 hover:border-primary/30 hover:shadow-md hover:shadow-primary/5 dark:border-gray-800"
          >
            <summary className="flex cursor-pointer list-none items-center justify-between gap-4 bg-first-950 px-5 py-4 dark:bg-first-300 [&::-webkit-details-marker]:hidden">
              <div className="flex min-w-0 items-center gap-3">
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-gray-100 text-xs font-bold text-gray-500 transition-colors group-open:bg-primary/10 group-open:text-primary dark:bg-white dark:text-black">
                  {String(index + 1).padStart(2, '0')}
                </span>

                <span className="text-sm font-semibold leading-7 text-gray-50 dark:text-gray-950">
                  {faq.question}
                </span>
              </div>

              <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-gray-100 text-gray-500 transition-all duration-300 group-open:rotate-180 group-open:bg-primary group-open:text-gray-600 dark:bg-white">
                <svg
                  className="h-4 w-4"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="m6 9 6 6 6-6" />
                </svg>
              </span>
            </summary>

            <div className="grid grid-rows-[0fr] transition-[grid-template-rows] duration-300 group-open:grid-rows-[1fr]">
              <div className="overflow-hidden">
                <div className="border-t border-dashed border-gray-200 p-8 dark:border-gray-800">
                  <div
                    className="tiptap-content"
                    dangerouslySetInnerHTML={{
                      __html: cleanFaqHtml(faq.answer),
                    }}
                  />

                  {faq.videoUrl && (
                    <a
                      href={faq.videoUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-4 inline-flex items-center gap-2 rounded-xl bg-primary/10 px-4 py-2.5 text-sm font-medium text-primary transition-all hover:bg-primary hover:text-white"
                    >
                      <svg
                        className="h-4 w-4"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" d="m10 8 6 4-6 4V8Z" />
                        <circle cx="12" cy="12" r="9" />
                      </svg>
                      مشاهده ویدئو
                    </a>
                  )}
                </div>
              </div>
            </div>
          </details>
        ))}
      </div>
    </section>
  );
}
