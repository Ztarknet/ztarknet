'use client';

import { FlickeringGrid } from '@workspace/ui/components/flickering-grid';

export function FlickeringGridBackground() {
  return (
    <FlickeringGrid
      className="fixed top-0 left-0 w-full h-screen z-[-2] pointer-events-none"
      style={{
        maskImage: 'linear-gradient(to bottom, white 0%, white 50%, transparent 100%)',
        WebkitMaskImage: 'linear-gradient(to bottom, white 0%, white 50%, transparent 100%)',
      }}
      squareSize={4}
      gridGap={6}
      color="#ff6b1a"
      maxOpacity={0.2}
      flickerChance={0.1}
    />
  );
}
