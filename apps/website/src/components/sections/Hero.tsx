"use client";

import { useRevealOnScroll } from "@/hooks/useRevealOnScroll";
import { Button } from "@workspace/ui/components/button";
import Link from "next/link";

export function Hero() {
  useRevealOnScroll();

  return (
    <section className="relative h-screen max-h-[1100px] xl:max-h-auto overflow-hidden" id="top">
      {/* Video background */}
      <video
        autoPlay
        loop
        muted
        playsInline
        className="absolute inset-0 w-full h-full object-cover z-0 opacity-40"
      >
        <source src="/hero.mp4" type="video/mp4" />
      </video>

      {/* Content - padding-top = spacing above header (12px/24px) + header (~50px/60px) + same spacing below */}
      <div className="relative z-10 h-full max-w-container mx-auto px-4 lg:px-0 pt-[74px] lg:pt-[108px] flex items-center">
        <div className="flex flex-col gap-6 md:gap-10">
          {/* Main headline */}
          <h1 className="text-4xl md:text-6xl lg:text-7xl leading-[1.05] font-black tracking-tight">
            <span className="text-white">The Execution Layer for </span>
            <span className="text-[#e96b2d]">Encrypted Bitcoin.</span>
          </h1>

          {/* Subtitle */}
          <p className="text-lg md:text-xl leading-relaxed text-white/90">
            Zcash provides the Vault. Ztarknet provides the Engine.
            <br />
            We do not ask for trust. We verify the math.
          </p>

          {/* CTA Button */}
          <Button
            variant="primary"
            size="lg"
            className="w-fit h-auto px-6 py-3 rounded-full text-base font-bold"
            asChild
          >
            <Link href="#demo">Launch the Engine</Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
