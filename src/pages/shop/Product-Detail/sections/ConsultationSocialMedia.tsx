import { motion } from 'framer-motion';

import rubika from '@/assets/Images/Logo/Rubika.png';
import eitaa from '@/assets/Images/Logo/etia.png';
import bale from '@/assets/Images/Logo/bale.jpg';

const CONSULTATION_PHONE = '09361844504';

const consultationItems = [
  // {
  //   key: 'rubika',
  //   label: 'Rubika',
  //   href: `rubika://l.rubika.ir/${CONSULTATION_PHONE}`,
  //   image: rubika,
  // },
  // {
  //   key: 'eitaa',
  //   label: 'Eitaa',
  //   href: `et://resolve?domain=${CONSULTATION_PHONE}&post=0`,
  //   image: eitaa,
  // },
  {
    key: 'bale',
    label: 'Bale',
    href: `https://ble.ir/${CONSULTATION_PHONE}`,
    image: bale,
  },
] as const;

interface ConsultationSocialMediaProps {
  className?: string;
  buttonClassName?: string;
  iconClassName?: string;
  textClassName?: string;
}

export function ConsultationSocialMedia({
  className = 'grid grid-cols-3 gap-2',
  buttonClassName = 'flex min-h-11 items-center justify-center gap-2 rounded-md border border-first/10 bg-first/5 px-2 py-2 first-text-color transition hover:bg-first/10',
  iconClassName = '',
  textClassName = 'hidden text-xs sm:inline',
}: ConsultationSocialMediaProps) {
  return (
    <div className={className}>
      {consultationItems.map((item) => {
        const opensNewTab = item.href.startsWith('http');

        return (
          <motion.a
            key={item.key}
            href={item.href}
            target={opensNewTab ? '_blank' : undefined}
            rel={opensNewTab ? 'noopener noreferrer' : undefined}
            whileTap={{ scale: 0.94 }}
            aria-label={`${item.label} ${CONSULTATION_PHONE}`}
            className={buttonClassName}
          >
            <img
              src={item.image}
              alt={item.label}
              className={`h-5 w-5 object-contain ${iconClassName}`}
            />
            <span className={textClassName}>{item.label}</span>
          </motion.a>
        );
      })}
    </div>
  );
}
