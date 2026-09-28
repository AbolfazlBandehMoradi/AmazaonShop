type AmazonMarkProps = {
  className?: string;
};

export function AmazonMark({ className }: AmazonMarkProps) {
  return (
    <svg
      className={className}
      viewBox="0 0 56 56"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <rect width="56" height="56" rx="17" fill="var(--color-first)" />
      <rect x="18" y="9" width="20" height="38" rx="5" stroke="white" strokeWidth="2.5" />
      <path d="M24 15h8" stroke="white" strokeWidth="2.5" strokeLinecap="round" />
      <path
        d="m22 34 6-13 6 13m-10-4h8"
        stroke="white"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle cx="28" cy="41" r="1.5" fill="white" />
    </svg>
  );
}
