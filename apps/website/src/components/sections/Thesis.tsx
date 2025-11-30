'use client';

import { useRevealOnScroll } from '@/hooks/useRevealOnScroll';
import { GlowingEffect } from '@workspace/ui/components/glowing-effect';
import { Code, Minimize2, ShieldCheck } from 'lucide-react';
import React from 'react';

export function Thesis() {
  useRevealOnScroll();

  return (
    <section className="section-padding px-8 bg-[rgba(6,6,8,0.75)]" id="thesis">
      <div className="max-w-container mx-auto">
        <div className="mb-12">
          <p className="eyebrow">Why Ztarknet</p>
          <h2 className="text-[clamp(2rem,4vw,2.8rem)] leading-[1.2] font-bold tracking-tight">
            Scaling programmable privacy without diluting trust
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <article className="group reveal-on-scroll relative h-full rounded-2xl border border-[rgba(255,137,70,0.25)] bg-[rgba(8,8,12,0.8)] p-2 md:rounded-3xl md:p-3 transition-all duration-300">
            <GlowingEffect
              spread={40}
              glow={true}
              disabled={false}
              proximity={64}
              inactiveZone={0.01}
            />
            <div className="relative flex h-full flex-col gap-3 overflow-hidden rounded-xl bg-gradient-to-br from-[rgba(12,12,18,0.9)] to-[rgba(6,6,9,0.8)] p-8 shadow-[0_18px_36px_rgba(0,0,0,0.35)] transition-all duration-300 group-hover:shadow-[0_18px_36px_rgba(255,137,70,0.15)]">
              {/* Gradient overlay on hover */}
              <div className="absolute inset-0 bg-gradient-to-br from-[rgba(255,137,70,0.08)] via-[rgba(255,255,255,0.03)] to-[rgba(255,167,70,0.05)] opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-xl pointer-events-none" />

              <div className="relative flex flex-1 flex-col gap-3 z-10">
                <div className="w-fit rounded-lg border border-[rgba(255,137,70,0.3)] bg-[rgba(255,137,70,0.05)] p-2 transition-all duration-300 group-hover:border-[rgba(255,137,70,0.5)] group-hover:bg-[rgba(255,137,70,0.1)] [&_svg]:transition-colors [&_svg]:duration-300 group-hover:[&_svg]:text-[rgba(255,137,70,1)]">
                  <Minimize2 className="h-4 w-4 text-[rgba(255,137,70,0.8)]" />
                </div>
                <h3 className="text-xl font-bold mb-3 text-white transition-colors duration-300 group-hover:text-[rgba(255,137,70,0.95)]">
                  Keep Zcash minimal
                </h3>
                <p className="text-[rgba(255,255,255,0.7)] leading-relaxed">
                  Push general-purpose computation to a Cairo VM on L2. Zcash verifies the proof via
                  TZE and keeps consensus surface area tight.
                </p>
              </div>
            </div>
          </article>

          <article className="group reveal-on-scroll relative h-full rounded-2xl border border-[rgba(255,137,70,0.25)] bg-[rgba(8,8,12,0.8)] p-2 md:rounded-3xl md:p-3 transition-all duration-300">
            <GlowingEffect
              spread={40}
              glow={true}
              disabled={false}
              proximity={64}
              inactiveZone={0.01}
            />
            <div className="relative flex h-full flex-col gap-3 overflow-hidden rounded-xl bg-gradient-to-br from-[rgba(12,12,18,0.9)] to-[rgba(6,6,9,0.8)] p-8 shadow-[0_18px_36px_rgba(0,0,0,0.35)] transition-all duration-300 group-hover:shadow-[0_18px_36px_rgba(255,137,70,0.15)]">
              {/* Gradient overlay on hover */}
              <div className="absolute inset-0 bg-gradient-to-br from-[rgba(255,137,70,0.08)] via-[rgba(255,255,255,0.03)] to-[rgba(255,167,70,0.05)] opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-xl pointer-events-none" />

              <div className="relative flex flex-1 flex-col gap-3 z-10">
                <div className="w-fit rounded-lg border border-[rgba(255,137,70,0.3)] bg-[rgba(255,137,70,0.05)] p-2 transition-all duration-300 group-hover:border-[rgba(255,137,70,0.5)] group-hover:bg-[rgba(255,137,70,0.1)] [&_svg]:transition-colors [&_svg]:duration-300 group-hover:[&_svg]:text-[rgba(255,137,70,1)]">
                  <ShieldCheck className="h-4 w-4 text-[rgba(255,137,70,0.8)]" />
                </div>
                <h3 className="text-xl font-bold mb-3 text-white transition-colors duration-300 group-hover:text-[rgba(255,137,70,0.95)]">
                  Proof-first integration
                </h3>
                <p className="text-[rgba(255,255,255,0.7)] leading-relaxed">
                  The draft ZIP introduces a Circle STARK verifier as a new TZE type. Full nodes
                  validate proofs natively—no bespoke scripting, no hand-wavy trust assumptions.
                </p>
              </div>
            </div>
          </article>

          <article className="group reveal-on-scroll relative h-full rounded-2xl border border-[rgba(255,137,70,0.25)] bg-[rgba(8,8,12,0.8)] p-2 md:rounded-3xl md:p-3 transition-all duration-300">
            <GlowingEffect
              spread={40}
              glow={true}
              disabled={false}
              proximity={64}
              inactiveZone={0.01}
            />
            <div className="relative flex h-full flex-col gap-3 overflow-hidden rounded-xl bg-gradient-to-br from-[rgba(12,12,18,0.9)] to-[rgba(6,6,9,0.8)] p-8 shadow-[0_18px_36px_rgba(0,0,0,0.35)] transition-all duration-300 group-hover:shadow-[0_18px_36px_rgba(255,137,70,0.15)]">
              {/* Gradient overlay on hover */}
              <div className="absolute inset-0 bg-gradient-to-br from-[rgba(255,137,70,0.08)] via-[rgba(255,255,255,0.03)] to-[rgba(255,167,70,0.05)] opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-xl pointer-events-none" />

              <div className="relative flex flex-1 flex-col gap-3 z-10">
                <div className="w-fit rounded-lg border border-[rgba(255,137,70,0.3)] bg-[rgba(255,137,70,0.05)] p-2 transition-all duration-300 group-hover:border-[rgba(255,137,70,0.5)] group-hover:bg-[rgba(255,137,70,0.1)] [&_svg]:transition-colors [&_svg]:duration-300 group-hover:[&_svg]:text-[rgba(255,137,70,1)]">
                  <Code className="h-4 w-4 text-[rgba(255,137,70,0.8)]" />
                </div>
                <h3 className="text-xl font-bold mb-3 text-white transition-colors duration-300 group-hover:text-[rgba(255,137,70,0.95)]">
                  Programmable freedom
                </h3>
                <p className="text-[rgba(255,255,255,0.7)] leading-relaxed">
                  Starknet tooling, account abstraction, and Cairo contracts become available to
                  Zcash users while L1 privacy stays uncompromised.
                </p>
              </div>
            </div>
          </article>
        </div>
      </div>
    </section>
  );
}
