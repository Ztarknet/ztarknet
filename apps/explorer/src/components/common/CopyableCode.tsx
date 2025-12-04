'use client';

import { copyToClipboard } from '@/utils/formatters';

interface CopyableCodeProps {
  value: string;
  truncated?: string;
  className?: string;
}

export function CopyableCode({ value, truncated, className = '' }: CopyableCodeProps) {
  const baseClassName =
    'font-mono text-sm text-foreground break-all cursor-pointer py-2 px-3 bg-black/30 rounded-md border border-[rgba(255,107,26,0.1)] transition-all duration-200 hover:bg-black/50 hover:border-[rgba(255,107,26,0.3)] text-left w-full block';

  return (
    <button
      type="button"
      className={`${baseClassName} ${className}`}
      onClick={() => copyToClipboard(value)}
      title="Click to copy"
    >
      {truncated ?? value}
    </button>
  );
}
