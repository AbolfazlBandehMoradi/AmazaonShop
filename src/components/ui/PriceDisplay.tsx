import TomanIcon from '@/components/ui/Toman';
import { useLangStore } from '@/stores/languageStore';
import { cn } from '@/utils/cn';
import { formatPrice } from '@/utils/numberFormat';

type Currency = 'IRT';
type CurrencyMode = 'label' | 'symbol' | 'none';
type StyleVariant = 'primary' | 'secondary';

interface PriceDisplayProps {
  amount: number | null | undefined;
  currency?: Currency | string;
  currencyMode?: CurrencyMode;
  variant?: StyleVariant;
  languageCode?: string;
  className?: string;
  valueClassName?: string;
  currencyClassName?: string;
}

function resolveCurrency(_value?: string): Currency {
  return 'IRT';
}

export function PriceDisplay({
  amount,
  currency = 'IRT',
  currencyMode = 'label',
  variant = 'primary',
  languageCode,
  className,
  valueClassName,
  currencyClassName,
}: PriceDisplayProps) {
  const storeLanguage = useLangStore((state) => state.lang);
  const effectiveLanguage = languageCode || storeLanguage || 'en';
  const isPersian = effectiveLanguage === 'fa';

  if (amount === null || amount === undefined) return null;

  const resolvedCurrency = resolveCurrency(currency);
  const formatted = formatPrice(amount, resolvedCurrency, effectiveLanguage);

  let variantWrapperClass = '';
  let variantValueClass = '';
  let variantCurrencyClass = '';

  if (variant === 'secondary') {
    variantValueClass = 'font-medium';
    variantCurrencyClass = 'first-text-color-for-paragraph-low font-light';
  }

  const renderCurrency = () => {
    if (currencyMode === 'none') return null;

    const finalCurrencyClass = cn(variantCurrencyClass, currencyClassName);

    if (isPersian) {
      if (currencyMode === 'symbol') {
        return <TomanIcon className={cn('', finalCurrencyClass)} />;
      }

      return <span className={finalCurrencyClass}>{'\u062a\u0648\u0645\u0627\u0646'}</span>;
    }

    return <span className={finalCurrencyClass}>Toman</span>;
  };

  return (
    <span className={cn('inline-flex items-center gap-1', variantWrapperClass, className)}>
      <span className={cn(variantValueClass, valueClassName)}>{formatted}</span>
      {renderCurrency()}
    </span>
  );
}
