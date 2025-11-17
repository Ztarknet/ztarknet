"use client";

import React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useRevealOnScroll } from "@/hooks/useRevealOnScroll";
import { GlowingEffect } from "@/components/ui/glowing-effect";

export function Hero() {
  useRevealOnScroll();

  return (
    <section className="grid grid-cols-1 lg:grid-cols-[1fr_420px] gap-16 max-w-container mx-auto mt-28 lg:mt-32 pb-[120px] relative px-8 md:px-0 lg:items-center" id="top">
      <div className="hero-glow" aria-hidden="true" />
      
      <div className="flex flex-col gap-6 justify-center">
        <p className="eyebrow">Cypherpunk L2 Experiment</p>
        
        <h1 className="text-[clamp(2.75rem,5vw,3.8rem)] leading-[1.1] font-bold tracking-tight">
          Starknet execution. Circle STARK proofs. Settled{" "}
          <span className="accent-text">on Zcash.</span>
        </h1>
        
        <p className="text-lg leading-relaxed text-foreground">
          Ztarknet explores a Starknet-inspired rollup that anchors to Zcash L1
          via a Transparent Zcash Extension (TZE) verifier. Programmable,
          privacy-native, and battle-ready for zero-knowledge maximalists.
        </p>
        
        <div className="flex flex-wrap gap-4">
          <Button variant="primary" asChild>
            <Link
              href="https://forum.zcashcommunity.com/t/stark-verification-as-a-transparent-zcash-extension-tze-i-e-enabler-for-a-starknet-style-l2-on-zcash"
              target="_blank"
              rel="noreferrer"
            >
              Join the discussion
            </Link>
          </Button>
          <Button variant="secondary" asChild>
            <a href="#thesis">Read the thesis</a>
          </Button>
        </div>
        
        <dl className="grid grid-cols-1 md:grid-cols-3 gap-5 mt-0">
          <div>
            <dt className="text-xs tracking-[0.12em] uppercase text-[rgba(255,137,70,0.8)]">
              Proof System
            </dt>
            <dd className="mt-1.5 text-[0.95rem] text-foreground font-mono">
              Circle STARKs (Stwo/Cairo)
            </dd>
          </div>
          <div>
            <dt className="text-xs tracking-[0.12em] uppercase text-[rgba(255,137,70,0.8)]">
              L2 Runtime
            </dt>
            <dd className="mt-1.5 text-[0.95rem] text-foreground font-mono">
              Madara (Rust Starknet client)
            </dd>
          </div>
          <div>
            <dt className="text-xs tracking-[0.12em] uppercase text-[rgba(255,137,70,0.8)]">
              L1 Settlement
            </dt>
            <dd className="mt-1.5 text-[0.95rem] text-foreground font-mono">
              Zcash TZE verifier
            </dd>
          </div>
        </dl>
      </div>
      
      <div className="grid gap-[18px] content-start">
        <div className="group reveal-on-scroll relative h-full rounded-2xl border border-[rgba(255,137,70,0.25)] bg-[rgb(8,8,12)] p-2 md:rounded-3xl md:p-3 transition-all duration-300" style={{ "--reveal-delay": "0ms" } as React.CSSProperties}>
          <GlowingEffect
            spread={40}
            glow={true}
            disabled={false}
            proximity={64}
            inactiveZone={0.01}
          />
          <div className="relative flex h-full flex-col gap-3 overflow-hidden rounded-xl bg-gradient-to-br from-[rgb(12,12,18)] to-[rgb(6,6,9)] p-6 shadow-[0_18px_36px_rgba(0,0,0,0.35)] transition-all duration-300 group-hover:shadow-[0_18px_36px_rgba(255,137,70,0.15)]">
            {/* Gradient overlay on hover */}
            <div className="absolute inset-0 bg-gradient-to-br from-[rgba(255,137,70,0.08)] via-[rgba(255,255,255,0.03)] to-[rgba(255,167,70,0.05)] opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-xl pointer-events-none" />
            
            <div className="relative flex flex-1 flex-col gap-3 z-10">
              <span className="inline-flex font-mono text-xs tracking-[0.18em] uppercase text-[rgba(255,137,70,0.8)] mb-1 transition-colors duration-300 group-hover:text-[rgba(255,137,70,1)]">
                Anchor UTXO Chain
              </span>
              <p className="text-[rgba(255,255,255,0.7)] leading-relaxed">
                Each state root lives in a TZE output. Spend prev anchor, prove the
                transition, mint the next root. Minimal surface, maximum verifiability.
              </p>
            </div>
          </div>
        </div>
        
        <div className="group reveal-on-scroll relative h-full rounded-2xl border border-[rgba(255,137,70,0.25)] bg-[rgb(8,8,12)] p-2 md:rounded-3xl md:p-3 transition-all duration-300" style={{ "--reveal-delay": "40ms" } as React.CSSProperties}>
          <GlowingEffect
            spread={40}
            glow={true}
            disabled={false}
            proximity={64}
            inactiveZone={0.01}
          />
          <div className="relative flex h-full flex-col gap-3 overflow-hidden rounded-xl bg-gradient-to-br from-[rgb(12,12,18)] to-[rgb(6,6,9)] p-6 shadow-[0_18px_36px_rgba(0,0,0,0.35)] transition-all duration-300 group-hover:shadow-[0_18px_36px_rgba(255,137,70,0.15)]">
            {/* Gradient overlay on hover */}
            <div className="absolute inset-0 bg-gradient-to-br from-[rgba(255,137,70,0.08)] via-[rgba(255,255,255,0.03)] to-[rgba(255,167,70,0.05)] opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-xl pointer-events-none" />
            
            <div className="relative flex flex-1 flex-col gap-3 z-10">
              <span className="inline-flex font-mono text-xs tracking-[0.18em] uppercase text-[rgba(255,137,70,0.8)] mb-1 transition-colors duration-300 group-hover:text-[rgba(255,137,70,1)]">
                Privacy Native
              </span>
              <p className="text-[rgba(255,255,255,0.7)] leading-relaxed">
                Zcash shields what matters. Ztarknet adds programmable headroom without
                touching base-layer guarantees.
              </p>
            </div>
          </div>
        </div>
        
        <div className="group reveal-on-scroll relative h-full rounded-2xl border border-[rgba(255,137,70,0.25)] bg-[rgb(8,8,12)] p-2 md:rounded-3xl md:p-3 transition-all duration-300" style={{ "--reveal-delay": "80ms" } as React.CSSProperties}>
          <GlowingEffect
            spread={40}
            glow={true}
            disabled={false}
            proximity={64}
            inactiveZone={0.01}
          />
          <div className="relative flex h-full flex-col gap-3 overflow-hidden rounded-xl bg-gradient-to-br from-[rgb(12,12,18)] to-[rgb(6,6,9)] p-6 shadow-[0_18px_36px_rgba(0,0,0,0.35)] transition-all duration-300 group-hover:shadow-[0_18px_36px_rgba(255,137,70,0.15)]">
            {/* Gradient overlay on hover */}
            <div className="absolute inset-0 bg-gradient-to-br from-[rgba(255,137,70,0.08)] via-[rgba(255,255,255,0.03)] to-[rgba(255,167,70,0.05)] opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-xl pointer-events-none" />
            
            <div className="relative flex flex-1 flex-col gap-3 z-10">
              <span className="inline-flex font-mono text-xs tracking-[0.18em] uppercase text-[rgba(255,137,70,0.8)] mb-1 transition-colors duration-300 group-hover:text-[rgba(255,137,70,1)]">
                Rust-all-the-way
              </span>
              <p className="text-[rgba(255,255,255,0.7)] leading-relaxed">
                Zebra fork, Madara, and Stwo/Cairo glue together an end-to-end Rust
                pipeline for experimentation.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}


