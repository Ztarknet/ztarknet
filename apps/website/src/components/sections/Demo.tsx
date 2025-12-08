'use client';

import { useRevealOnScroll } from '@/hooks/useRevealOnScroll';
import { Button } from '@workspace/ui/components/button';
import Link from 'next/link';

export function Demo() {
  useRevealOnScroll();

  return (
    <section className="relative py-16 md:py-24" id="demo">
      <div className="max-w-container mx-auto px-4 lg:px-0">
        <div className="flex flex-col-reverse lg:flex-row items-center gap-12 lg:gap-16">
          {/* Left side - Video (40%) */}
          <div className="w-full lg:w-2/5 flex justify-center">
            <div className="w-full max-w-[600px] aspect-square rounded-3xl overflow-hidden">
              <video
                autoPlay
                loop
                muted
                playsInline
                className="w-full h-full object-cover"
              >
                <source src="/ascii_art-spheres.mp4" type="video/mp4" />
              </video>
            </div>
          </div>

          {/* Right side - Content (60%) */}
          <div className="w-full lg:w-3/5 flex flex-col justify-center">
            <h2 className="text-3xl md:text-5xl lg:text-6xl leading-[1.1] font-bold text-[#e96b2d] mb-8">
              Break the Testnet.
            </h2>

            <div className="space-y-6 text-base md:text-lg leading-relaxed text-white/90 mb-10">
              <p>
                We built a collaborative pixel canvas. It stresses the sequencer. It risks no money.
                It proves the speed.
              </p>
              <p>
                Draw a Zixel. Spam the network. Test the engine. If we can secure thousands of
                pixels, we can secure billions of dollars.
              </p>
            </div>

            {/* CTA Button */}
            <Button
              variant="primary"
              size="lg"
              className="w-fit h-auto px-6 py-4 rounded-full text-base font-bold"
              asChild
            >
              <Link href="https://zixel.ztarknet.com" target="_blank" rel="noreferrer">
                Draw a Zixel
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
