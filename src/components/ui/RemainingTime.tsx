import { cn } from '@/utils/cn';
import { useLangStore } from '@/stores/languageStore';
import useDiscountOfferTime from '@/utils/discountOffterTime';

interface RemainingTimeProps {
  expireDate: string;
  compact?: boolean;
}

const RemainingTime = ({ expireDate, compact = false }: RemainingTimeProps) => {
  const lang = useLangStore((s) => s.lang);
  const timeLeft = useDiscountOfferTime(expireDate);

  if (!timeLeft.isValid) {
    return null;
  }

  const locale = lang === 'fa' ? 'fa-IR' : 'en-US';
  const numberFormatter = new Intl.NumberFormat(locale, {
    minimumIntegerDigits: 2,
    useGrouping: false,
  });

  const units = [
    { key: lang === 'fa' ? '\u0631\u0648\u0632' : 'Day', value: timeLeft.days },
    { key: lang === 'fa' ? '\u0633\u0627\u0639\u062a' : 'Hour', value: timeLeft.hours },
    { key: lang === 'fa' ? '\u062f\u0642\u06cc\u0642\u0647' : 'Min', value: timeLeft.minutes },
    { key: lang === 'fa' ? '\u062b\u0627\u0646\u06cc\u0647' : 'Sec', value: timeLeft.seconds },
  ];

  if (!compact) {
    return (
      <div dir="ltr" className="grid grid-cols-4 gap-2 sm:gap-3">
        {units.map((unit, index) => (
          <div
            key={unit.key}
            className="relative flex min-w-0 flex-col items-center overflow-hidden rounded-2xl border border-secound/10 bg-color-for-layer-on-body px-1.5 py-2.5 text-center shadow-dark-sm sm:px-3 sm:py-3"
          >
            <span
              aria-hidden="true"
              className={`absolute inset-x-0 top-0 h-1 ${index % 2 === 0 ? 'bg-secound' : 'bg-third'}`}
            />
            <span className="text-lg font-f-bold tabular-nums first-text-color sm:text-xl">
              {numberFormatter.format(unit.value)}
            </span>
            <span className="mt-1 truncate text-[0.65rem] font-f-sbold text-secound sm:text-xs">
              {unit.key}
            </span>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div dir="ltr" className="grid grid-cols-4 gap-2">
      {units.map((unit) => (
        <div
          key={unit.key}
          className={cn(
            'relative flex min-w-0 flex-col items-center overflow-hidden rounded-xl border border-first/10 bg-first/5 text-center shadow-[0_8px_20px_rgba(20,29,38,0.04)]',
            compact ? 'px-1.5 py-2' : 'px-1.5 py-2.5 sm:px-3 sm:py-3',
          )}
        >
          <span
            aria-hidden="true"
            className={cn('absolute inset-x-0 top-0 bg-first', compact ? 'h-0.5' : 'h-1')}
          />
          <span
            className={cn(
              'font-f-bold tabular-nums first-text-color',
              compact ? 'text-sm sm:text-base' : 'text-lg sm:text-xl',
            )}
          >
            {numberFormatter.format(unit.value)}
          </span>
          <span
            className={cn(
              'mt-1 truncate font-f-sbold text-first',
              compact ? 'text-[0.58rem] sm:text-[0.65rem]' : 'text-[0.65rem] sm:text-xs',
            )}
          >
            {unit.key}
          </span>
        </div>
      ))}
    </div>
  );
};

export default RemainingTime;
