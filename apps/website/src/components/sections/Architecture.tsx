'use client';

import { useRevealOnScroll } from '@/hooks/useRevealOnScroll';

export function Architecture() {
  useRevealOnScroll();

  return (
    <section className="relative" id="architecture">
      <div className="max-w-container mx-auto px-4 lg:px-0">
        {/* Full-width card with orange border */}
        <div className="relative border border-[#e96b2d] rounded-3xl overflow-hidden min-h-[400px] lg:min-h-[567px]">
          {/* Background Image */}
          <div 
            className="absolute inset-0 w-full h-full z-0 opacity-80 bg-cover bg-center bg-no-repeat"
            style={{ backgroundImage: "url('/bg-consensus.png')" }}
          />

          {/* Content overlay */}
          <div className="relative z-10 p-8 md:p-12 lg:p-16 flex flex-col justify-center h-full min-h-[400px] lg:min-h-[567px]">
            <h2 className="text-3xl md:text-5xl lg:text-[70px] leading-none font-bold text-[#e96b2d] mb-6">
              Consensus, Not Multisig.
            </h2>

            <div className="max-w-3xl space-y-4 text-base md:text-lg lg:text-xl leading-relaxed">
              <p className="text-white/90">
                Most bridges are banks with a different name. You trust the signers.
              </p>
              <p className="text-white/90">
                We built a Transparent Zcash Extension (TZE). It is a rule written into the Zcash
                main chain. It verifies STARK proofs directly. If the L2 tries to cheat, the L1
                miners reject the block.
              </p>
              <p className="text-[#e96b2d] font-semibold mt-6">
                Math enforces the bridge, not people.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
