'use client';

import { useRevealOnScroll } from '@/hooks/useRevealOnScroll';

export function Problem() {
  useRevealOnScroll();

  return (
    <section className="relative py-16 md:py-24" id="problem">
      <div className="max-w-container mx-auto px-4 lg:px-0">
        <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-16">
          {/* Left side - Video */}
          <div className="hidden md:block w-full lg:w-1/2 aspect-square rounded-3xl overflow-hidden">
            <video
              autoPlay
              loop
              muted
              playsInline
              className="w-full h-full object-cover"
            >
              <source src="/ascii_art-cubes.mp4" type="video/mp4" />
            </video>
          </div>

          {/* Right side - Content */}
          <div className="w-full lg:w-1/2 flex flex-col justify-center">
            <h2 className="text-3xl md:text-5xl lg:text-6xl leading-[1.1] font-bold text-[#e96b2d] mb-8">
              The End of Soft Systems.
            </h2>

            <div className="space-y-6 text-base md:text-lg leading-relaxed text-white/90">
              <p>
                You trust Amazon and Google too much. They are cheap, fast, and rent-seeking. You are
                a tenant on their servers. The landlord can change the locks.
              </p>
              <p>
                We build Hard Systems. Bitcoin proved we can own money. Ztarknet proves we can own
                computation. It is expensive to generate, cheap to verify, and impossible to censor.
              </p>
              <p className="font-bold text-[#e96b2d]">You are an owner here.</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
