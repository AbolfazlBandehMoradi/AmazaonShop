import { useTranslation } from 'react-i18next';

import ShieldIcon from '@/assets/Icons/why-us (1).svg';
import CartIcon from '@/assets/Icons/why-us (2).svg';
import DeliveryIcon from '@/assets/Icons/why-us (3).svg';
import WalletIcon from '@/assets/Icons/why-us (4).svg';
import NetPattern from '@/assets/Icons/why-us-net.svg';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { useLangStore } from '@/stores/languageStore';

const features = [
  { key: 'purchase', icon: ShieldIcon },
  { key: 'payment', icon: WalletIcon },
  { key: 'direct', icon: CartIcon },
  { key: 'delivery', icon: DeliveryIcon },
] as const;

export default function WhyUs() {
  const { t } = useTranslation();
  const { dir } = useLangStore();

  return (
    <section dir={dir} className="landing-section" aria-labelledby="why-us-title">
      <div className="landing-container">
        <div className="rounded-[32px] bg-surface px-4 py-8 sm:px-8 sm:py-10 lg:px-10 lg:py-12 xl:p-16 dark:bg-[#1d2532]">
          <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between md:gap-8">
            <SectionHeading
              id="why-us-title"
              subtext={t('mainpage.whyUs.caption')}
              title={t('mainpage.whyUs.title')}
              titleClassName="sm:text-2xl"
            />
            <p className="max-w-[300px] text-sm leading-6 first-text-color-for-paragraph">
              {t('mainpage.whyUs.intro')}
              <br />
              {t('mainpage.whyUs.introEnd')}
            </p>
          </div>

          <ul className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:gap-5 xl:grid-cols-4">
            {features.map(({ key, icon }) => (
              <li
                key={key}
                className="min-w-0 overflow-hidden rounded-[28px] bg-white p-2 transition-[box-shadow,transform] duration-200 hover:shadow-md motion-safe:hover:-translate-y-1 dark:bg-color-for-layer-sec dark:hover:shadow-black/30"
              >
                <div className="relative isolate flex h-[152px] items-center justify-center overflow-hidden rounded-[22px] bg-surface dark:bg-[#f4f7f9]">
                  <img
                    src={NetPattern}
                    alt=""
                    aria-hidden="true"
                    className="pointer-events-none absolute inset-0 h-full w-full object-cover"
                  />
                  <img src={icon} alt="" aria-hidden="true" className="relative z-10 h-16 w-16" />
                </div>
                <div className="px-4 pb-5 pt-5">
                  <h3 className="text-base leading-6 font-f-bold first-text-color">
                    {t(`mainpage.whyUs.features.${key}.title`)}
                  </h3>
                  <p className="mt-2 text-sm leading-6 first-text-color-for-paragraph">
                    {t(`mainpage.whyUs.features.${key}.description`)}
                  </p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
