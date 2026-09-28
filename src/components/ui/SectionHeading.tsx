import type { ReactNode } from 'react';

import { cn } from '@/utils/cn';

type SectionHeadingProps = {
  id?: string;
  title: ReactNode;
  subtext?: ReactNode;
  align?: 'start' | 'center';
  decoration?: 'side' | 'both' | 'none';
  className?: string;
  titleClassName?: string;
};

function HeadingLine() {
  return <span aria-hidden="true" className="h-0.5 w-8 shrink-0 rounded-lg bg-secound" />;
}

export function SectionHeading({
  id,
  title,
  subtext,
  align = 'start',
  decoration = 'side',
  className,
  titleClassName,
}: SectionHeadingProps) {
  return (
    <div
      className={cn(
        'flex flex-col gap-2',
        align === 'center' ? 'items-center text-center' : 'items-start text-start',
        className,
      )}
    >
      {subtext && (
        <div className="flex items-center gap-2 text-xs font-f-bold text-first">
          {decoration !== 'none' && <HeadingLine />}
          <span>{subtext}</span>
          {decoration === 'both' && <HeadingLine />}
        </div>
      )}
      <h2 id={id} className={cn('text-xl leading-7 font-f-bold first-text-color', titleClassName)}>
        {title}
      </h2>
    </div>
  );
}
