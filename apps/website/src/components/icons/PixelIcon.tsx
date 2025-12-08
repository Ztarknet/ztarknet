import { cn } from '@workspace/ui/lib/utils';

interface PixelIconProps {
  className?: string;
  size?: number;
}

export function PixelIcon({ className, size = 20 }: PixelIconProps): React.ReactElement {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 35 35"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={cn('inline-block align-middle flex-shrink-0 -translate-y-[1px]', className)}
    >
      <rect y="23.3333" width="3.88889" height="3.88889" fill="currentColor" />
      <rect y="19.4445" width="3.88889" height="3.88889" fill="currentColor" />
      <rect y="15.5555" width="3.88889" height="3.88889" fill="currentColor" />
      <rect y="11.6667" width="3.88889" height="3.88889" fill="currentColor" />
      <rect y="7.77777" width="3.88889" height="3.88889" fill="currentColor" />
      <rect x="3.88892" y="27.2222" width="3.88889" height="3.88889" fill="currentColor" />
      <rect x="3.88892" y="3.88892" width="3.88889" height="3.88889" fill="currentColor" />
      <rect x="7.77783" y="31.1111" width="3.88889" height="3.88889" fill="currentColor" />
      <rect x="7.77783" y="3.88892" width="3.88889" height="3.88889" fill="currentColor" />
      <rect x="11.6667" y="31.1111" width="3.88889" height="3.88889" fill="currentColor" />
      <rect x="11.6667" y="19.4445" width="3.88889" height="3.88889" fill="currentColor" />
      <rect x="11.6667" y="3.88892" width="3.88889" height="3.88889" fill="currentColor" />
      <rect x="15.5557" y="31.1111" width="3.88889" height="3.88889" fill="currentColor" />
      <rect x="15.5557" y="15.5555" width="3.88889" height="3.88889" fill="currentColor" />
      <rect x="19.4443" y="31.1111" width="3.88889" height="3.88889" fill="currentColor" />
      <rect x="19.4443" y="11.6667" width="3.88889" height="3.88889" fill="currentColor" />
      <rect x="19.4443" width="3.88889" height="3.88889" fill="currentColor" />
      <rect x="23.3333" y="31.1111" width="3.88889" height="3.88889" fill="currentColor" />
      <rect x="23.3333" y="7.77777" width="3.88889" height="3.88889" fill="currentColor" />
      <rect x="23.3333" width="3.88889" height="3.88889" fill="currentColor" />
      <rect x="27.2222" y="27.2222" width="3.88889" height="3.88889" fill="currentColor" />
      <rect x="27.2222" y="23.3333" width="3.88889" height="3.88889" fill="currentColor" />
      <rect x="27.2222" y="19.4445" width="3.88889" height="3.88889" fill="currentColor" />
      <rect x="27.2222" y="3.88892" width="3.88889" height="3.88889" fill="currentColor" />
      <rect x="27.2222" width="3.88889" height="3.88889" fill="currentColor" />
      <rect x="31.1111" y="11.6667" width="3.88889" height="3.88889" fill="currentColor" />
      <rect x="31.1111" y="7.77777" width="3.88889" height="3.88889" fill="currentColor" />
      <rect x="31.1111" y="3.88892" width="3.88889" height="3.88889" fill="currentColor" />
      <rect x="31.1111" width="3.88889" height="3.88889" fill="currentColor" />
    </svg>
  );
}
