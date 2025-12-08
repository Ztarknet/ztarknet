interface PixelCheckIconProps {
  className?: string;
  size?: number;
}

export function PixelCheckIcon({ className, size = 24 }: PixelCheckIconProps): React.ReactElement {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <rect y="18.6667" width="2.66667" height="2.66667" fill="currentColor" />
      <rect y="16" width="2.66667" height="2.66667" fill="currentColor" />
      <rect y="13.3333" width="2.66667" height="2.66667" fill="currentColor" />
      <rect y="10.6667" width="2.66667" height="2.66667" fill="currentColor" />
      <rect y="8" width="2.66667" height="2.66667" fill="currentColor" />
      <rect y="5.33325" width="2.66667" height="2.66667" fill="currentColor" />
      <rect y="2.66675" width="2.66667" height="2.66667" fill="currentColor" />
      <rect x="2.66699" y="21.3333" width="2.66667" height="2.66667" fill="currentColor" />
      <rect x="2.66699" width="2.66667" height="2.66667" fill="currentColor" />
      <rect x="5.33301" y="21.3333" width="2.66667" height="2.66667" fill="currentColor" />
      <rect x="5.33301" y="10.6667" width="2.66667" height="2.66667" fill="currentColor" />
      <rect x="5.33301" width="2.66667" height="2.66667" fill="currentColor" />
      <rect x="8" y="21.3333" width="2.66667" height="2.66667" fill="currentColor" />
      <rect x="8" y="13.3333" width="2.66667" height="2.66667" fill="currentColor" />
      <rect x="8" width="2.66667" height="2.66667" fill="currentColor" />
      <rect x="10.667" y="21.3333" width="2.66667" height="2.66667" fill="currentColor" />
      <rect x="10.667" y="16" width="2.66667" height="2.66667" fill="currentColor" />
      <rect x="10.667" width="2.66667" height="2.66667" fill="currentColor" />
      <rect x="13.333" y="21.3333" width="2.66667" height="2.66667" fill="currentColor" />
      <rect x="13.333" y="13.3333" width="2.66667" height="2.66667" fill="currentColor" />
      <rect x="13.333" width="2.66667" height="2.66667" fill="currentColor" />
      <rect x="16" y="21.3333" width="2.66667" height="2.66667" fill="currentColor" />
      <rect x="16" y="10.6667" width="2.66667" height="2.66667" fill="currentColor" />
      <rect x="16" width="2.66667" height="2.66667" fill="currentColor" />
      <rect x="18.667" y="21.3333" width="2.66667" height="2.66667" fill="currentColor" />
      <rect x="18.667" y="8" width="2.66667" height="2.66667" fill="currentColor" />
      <rect x="21.333" y="18.6667" width="2.66667" height="2.66667" fill="currentColor" />
      <rect x="21.333" y="16" width="2.66667" height="2.66667" fill="currentColor" />
      <rect x="21.333" y="5.33325" width="2.66667" height="2.66667" fill="currentColor" />
    </svg>
  );
}
