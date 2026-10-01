import { useState, useRef } from "react";
import { ChevronDown } from "lucide-react";
import { useTranslation } from "react-i18next";

interface FaqItem {
  question: string;
  answer: string;
}

const Faq = () => {
  const { t, i18n } = useTranslation();
  const lang = i18n.language; // "fa" یا "en"

  const faqData = t("faq.items", {
    returnObjects: true,
  }) as FaqItem[];

  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const contentRefs = useRef<Array<HTMLDivElement | null>>([]);

  const toggle = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section className="page-container page-section">
      <div className="rounded-3xl border border-color-theme bg-color-for-layer-on-body p-5 shadow-dark-sm sm:p-8">
        <div className="mb-6 text-center">
          <h1 className="text-2xl font-s-bold first-text-color sm:text-3xl">
            {t("faq.title")}
          </h1>
          <p className="mt-3 text-sm sm:text-base first-text-color-for-paragraph">
            {t("faq.subtitle")}
          </p>
        </div>
        <div className="divide-y divide-color-theme overflow-hidden rounded-2xl border border-color-theme bg-color-for-layer-sec">
          {faqData.map((item, index) => (
            <div key={index} className="group">
              <button
                onClick={() => toggle(index)}
                className={`flex min-h-14 w-full items-center justify-between gap-4 px-4 py-4 transition-colors hover:bg-color-for-layer-three sm:px-6
                  focus:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-first
                  ${lang === "en" ? " flex-row-reverse" : "flex-row"}`}
                aria-expanded={openIndex === index}
              >
                <span
                  className={`text-base sm:text-lg font-medium first-text-color ${
                    lang === "en" ? "text-left" : "text-right"
                  }`}
                >
                  {item.question}
                </span>
                <ChevronDown
                  className={`h-5 w-5 first-text-color-for-paragraph-low transition-transform ${
                    openIndex === index ? "rotate-180 first-text-color" : ""
                  }`}
                />
              </button>
              <div
                ref={(el) => (contentRefs.current[index] = el)}
                style={{
                  maxHeight:
                    openIndex === index
                      ? contentRefs.current[index]?.scrollHeight + "px"
                      : "0px",
                }}
                className="overflow-hidden transition-[max-height] duration-300"
              >
                <div
                  className={`px-4 pb-4 first-text-color-for-paragraph text-sm sm:text-base leading-7 ${
                    lang === "en" ? "text-left" : "text-right"
                  }`}
                >
                  {item.answer}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Faq;
