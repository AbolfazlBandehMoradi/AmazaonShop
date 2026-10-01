import type { ReactNode } from 'react';

import { cn } from '@/utils/cn';

type SectionHeadingProps = {
  as?: 'h1' | 'h2';
  id?: string;
  title: ReactNode;
  subtext?: ReactNode;
  align?: 'start' | 'center';
  decoration?: 'side' | 'right' | 'both' | 'none';
  className?: string;
  titleClassName?: string;
};

function HeadingLine() {
  return <span aria-hidden="true" className="h-0.5 w-8 shrink-0 rounded-lg bg-secound" />;
}

export function SectionHeading({
  as: Heading = 'h2',
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
        <div
          dir={decoration === 'right' ? 'ltr' : undefined}
          className="flex items-center gap-2 text-xs font-f-bold text-first"
        >
          {(decoration === 'side' || decoration === 'both') && <HeadingLine />}
          <span dir={decoration === 'right' ? 'auto' : undefined}>{subtext}</span>
          {(decoration === 'right' || decoration === 'both') && <HeadingLine />}
        </div>
      )}
      <Heading
        id={id}
        className={cn('text-xl leading-7 font-f-bold first-text-color', titleClassName)}
      >
        {title}
      </Heading>
    </div>
  );
}
