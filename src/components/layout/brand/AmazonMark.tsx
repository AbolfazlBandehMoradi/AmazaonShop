type AmazonMarkProps = {
  className?: string;
};

export function AmazonMark({ className }: AmazonMarkProps) {
  return (
    <svg
      className={`text-first dark:text-first-300 ${className ?? ''}`}
      viewBox="0 0 56 56"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <rect x="16" y="6" width="24" height="44" rx="6" stroke="currentColor" strokeWidth="3" />
      <path d="M24 13h8" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
      <path
        d="m22 34 6-13 6 13m-10-4h8"
        stroke="currentColor"
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle cx="28" cy="43" r="1.5" fill="currentColor" />
    </svg>
  );
}
