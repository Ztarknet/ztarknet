'use client';

import { Footer } from '@/components/layout/Footer';
import { Header } from '@/components/layout/Header';
import { PixelIcon } from '@/components/icons/PixelIcon';
import { useRevealOnScroll } from '@/hooks/useRevealOnScroll';
import { ComparisonTable } from '@/components/sections/ComparisonTable';

export default function ThesisPage(): React.ReactElement {
  useRevealOnScroll();

  return (
    <>
      <Header />
      <main>
        {/* Hero Section with Video Background */}
        <section className="relative h-screen max-h-[1100px] xl:max-h-auto overflow-hidden" id="top">
          {/* Video background */}
          <video
            autoPlay
            loop
            muted
            playsInline
            className="absolute inset-0 w-full h-full object-cover z-0 opacity-40"
          >
            <source src="/background-2-v2.mp4" type="video/mp4" />
          </video>

          {/* Content */}
          <div className="relative z-10 h-full max-w-container mx-auto px-4 lg:px-0 pt-[74px] lg:pt-[108px] flex items-center">
            <div className="flex flex-col gap-6 md:gap-10">
              {/* Main headline */}
              <h1 className="text-4xl md:text-6xl lg:text-7xl leading-[1.05] font-black tracking-tight">
                <span className="text-white">Thesis:</span>
                <br />
                <span className="text-[#e96b2d]">Hard vs Soft Compute.</span>
              </h1>

              {/* Subtitle */}
              <div className="max-w-4xl space-y-4 text-lg md:text-xl leading-relaxed text-white/90">
                <p>
                  The current internet is soft. It relies on the permission of strangers. You are a
                  tenant in their database. If the landlord changes the locks, you are evicted.
                </p>
                <p>
                  Ztarknet is hard. It relies on the laws of mathematics. It does not care who you
                  are. It only cares about your proof.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Comparison Table Section */}
        <section className="relative py-16 md:pt-16 mb:pb-4">
          <div className="max-w-7xl mx-auto px-4">
            <ComparisonTable />
          </div>
        </section>

        {/* CTAs Section */}
        <section className="relative pb-16 md:pb-24">
          <div className="max-w-container mx-auto px-4 lg:px-0">
            <div className="flex flex-col items-center gap-6 text-center">
              {/* Read More Link */}
              <a
                href="https://x.com/odin_free/status/1993362854305476978"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#e96b2d] hover:text-white transition-colors text-lg flex items-center gap-2"
              >
                Read more
                <PixelIcon size={20} />
              </a>

              {/* Full Thesis Button */}
              <a
                href="https://forum.zcashcommunity.com/t/stark-verification-as-a-transparent-zcash-extension-tze-i-e-enabler-for-a-starknet-style-l2-on-zcash/52486"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-6 py-3 bg-[#e96b2d] hover:bg-[#ff8946] text-white font-semibold rounded-lg transition-colors"
              >
                Read the full thesis &amp; join the discussion
                <PixelIcon size={20} />
              </a>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
