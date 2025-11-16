"use client";

import React from "react";
import { useRevealOnScroll } from "@/hooks/useRevealOnScroll";
import { GlowingEffect } from "@/components/ui/glowing-effect";
import { CheckCircle, Play, Database, Circle } from "lucide-react";

export function Roadmap() {
  useRevealOnScroll();

  return (
    <section className="py-[120px] px-8">
      <div className="max-w-container mx-auto">
        <div className="mb-12">
          <p className="eyebrow">Impact surface</p>
          <h2 className="text-[clamp(2rem,4vw,2.8rem)] leading-[1.2] font-bold tracking-tight">
            What the PoC unlocks
          </h2>
        </div>

        {/* Progress Timeline Card */}
        <div className="mb-12 reveal-on-scroll flex justify-center">
          <div className="relative rounded-2xl border border-[rgba(255,137,70,0.25)] bg-[rgb(8,8,12)] p-2 md:rounded-3xl md:p-3 max-w-[600px]">
            <GlowingEffect
              spread={40}
              glow={true}
              disabled={false}
              proximity={64}
              inactiveZone={0.01}
            />
            <div className="relative overflow-hidden rounded-xl bg-gradient-to-br from-[rgb(12,12,18)] to-[rgb(6,6,9)] p-8 shadow-[0_18px_36px_rgba(0,0,0,0.35)]">
          <div className="flex flex-col gap-4">
            {/* Step 1 - Completed */}
            <div className="flex items-center gap-4">
              <div className="flex flex-col items-center relative">
                <div className="w-3 h-3 rounded-full bg-[rgba(255,137,70,0.8)] border-2 border-[rgba(255,137,70,1)] relative z-10"></div>
                <div className="absolute top-3 w-px h-12 overflow-hidden">
                  <div className="w-full h-full bg-gradient-to-b from-[rgba(255,137,70,0.5)] to-[rgba(255,137,70,0.3)]"></div>
                  <div className="absolute top-0 w-2 h-2 rounded-full bg-[rgba(255,137,70,0.9)] animate-[slideDown_2s_ease-in-out_infinite] -ml-0.5"></div>
                </div>
              </div>
              <div className="flex items-center gap-3 pb-8">
                <CheckCircle className="h-5 w-5 text-[rgba(255,137,70,0.8)]" />
                <span className="text-sm text-[rgba(255,255,255,0.8)]">01 - Demonstrate native proof verification</span>
              </div>
            </div>

            {/* Step 2 - In Progress */}
            <div className="flex items-center gap-4">
              <div className="flex flex-col items-center relative">
                <div className="w-3 h-3 rounded-full bg-[rgba(255,137,70,0.6)] border-2 border-[rgba(255,137,70,0.8)] animate-pulse relative z-10"></div>
                <div className="absolute top-3 w-px h-12 overflow-hidden">
                  <div className="w-full h-full bg-gradient-to-b from-[rgba(255,137,70,0.3)] to-[rgba(255,137,70,0.1)]"></div>
                  <div className="absolute top-0 w-2 h-2 rounded-full bg-[rgba(255,137,70,0.6)] animate-[slideDown_2s_ease-in-out_infinite] -ml-0.5" style={{ animationDelay: '0.5s' }}></div>
                </div>
              </div>
              <div className="flex items-center gap-3 pb-8">
                <Play className="h-5 w-5 text-[rgba(255,137,70,0.8)]" />
                <span className="text-sm text-[rgba(255,255,255,0.8)] font-medium">02 - Release a replayable devnet</span>
              </div>
            </div>

            {/* Step 3 - Upcoming */}
            <div className="flex items-center gap-4">
              <div className="flex flex-col items-center">
                <Circle className="w-3 h-3 text-[rgba(255,137,70,0.3)]" />
              </div>
              <div className="flex items-center gap-3">
                <Database className="h-5 w-5 text-[rgba(255,137,70,0.5)]" />
                <span className="text-sm text-[rgba(255,255,255,0.5)]">03 - Explore data availability options</span>
              </div>
            </div>
          </div>
            </div>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-7">
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
              {/* Background radial gradient */}
              <div className="absolute inset-auto -right-[40%] -bottom-[40%] h-[120%] rotate-[25deg] bg-[radial-gradient(circle,rgba(255,107,26,0.18),rgba(10,10,14,0))] pointer-events-none" />
              
              <div className="relative flex flex-1 flex-col gap-3 z-10">
                <div className="flex items-center gap-3">
                  <div className="w-fit rounded-lg border border-[rgba(255,137,70,0.3)] bg-[rgba(255,137,70,0.05)] p-2 transition-all duration-300 group-hover:border-[rgba(255,137,70,0.5)] group-hover:bg-[rgba(255,137,70,0.1)] [&_svg]:transition-colors [&_svg]:duration-300 group-hover:[&_svg]:text-[rgba(255,137,70,1)]">
                    <CheckCircle className="h-4 w-4 text-[rgba(255,137,70,0.8)]" />
                  </div>
                  <span className="text-[1.6rem] font-mono text-[rgba(255,137,70,0.8)] transition-colors duration-300 group-hover:text-[rgba(255,137,70,1)]">
                    01
                  </span>
                </div>
                <h3 className="text-xl font-bold mb-3 text-white transition-colors duration-300 group-hover:text-[rgba(255,137,70,0.95)]">
                  Demonstrate native proof verification
                </h3>
                <p className="text-[rgba(255,255,255,0.7)] leading-relaxed">
                  Prove that a Zcash full node can verify Circle STARK proofs inside
                  consensus rules, without exotic extensions or trusted relays.
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
              {/* Background radial gradient */}
              <div className="absolute inset-auto -right-[40%] -bottom-[40%] h-[120%] rotate-[25deg] bg-[radial-gradient(circle,rgba(255,107,26,0.18),rgba(10,10,14,0))] pointer-events-none" />
              
              <div className="relative flex flex-1 flex-col gap-3 z-10">
                <div className="flex items-center gap-3">
                  <div className="w-fit rounded-lg border border-[rgba(255,137,70,0.3)] bg-[rgba(255,137,70,0.05)] p-2 transition-all duration-300 group-hover:border-[rgba(255,137,70,0.5)] group-hover:bg-[rgba(255,137,70,0.1)] [&_svg]:transition-colors [&_svg]:duration-300 group-hover:[&_svg]:text-[rgba(255,137,70,1)]">
                    <Play className="h-4 w-4 text-[rgba(255,137,70,0.8)]" />
                  </div>
                  <span className="text-[1.6rem] font-mono text-[rgba(255,137,70,0.8)] transition-colors duration-300 group-hover:text-[rgba(255,137,70,1)]">
                    02
                  </span>
                </div>
                <h3 className="text-xl font-bold mb-3 text-white transition-colors duration-300 group-hover:text-[rgba(255,137,70,0.95)]">
                  Release a replayable devnet
                </h3>
                <p className="text-[rgba(255,255,255,0.7)] leading-relaxed">
                  Ship a Dockerized stack with Madara, Stwo/Cairo, and the Zebra fork so
                  researchers can replay the entire loop locally.
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
              {/* Background radial gradient */}
              <div className="absolute inset-auto -right-[40%] -bottom-[40%] h-[120%] rotate-[25deg] bg-[radial-gradient(circle,rgba(255,107,26,0.18),rgba(10,10,14,0))] pointer-events-none" />
              
              <div className="relative flex flex-1 flex-col gap-3 z-10">
                <div className="flex items-center gap-3">
                  <div className="w-fit rounded-lg border border-[rgba(255,137,70,0.3)] bg-[rgba(255,137,70,0.05)] p-2 transition-all duration-300 group-hover:border-[rgba(255,137,70,0.5)] group-hover:bg-[rgba(255,137,70,0.1)] [&_svg]:transition-colors [&_svg]:duration-300 group-hover:[&_svg]:text-[rgba(255,137,70,1)]">
                    <Database className="h-4 w-4 text-[rgba(255,137,70,0.8)]" />
                  </div>
                  <span className="text-[1.6rem] font-mono text-[rgba(255,137,70,0.8)] transition-colors duration-300 group-hover:text-[rgba(255,137,70,1)]">
                    03
                  </span>
                </div>
                <h3 className="text-xl font-bold mb-3 text-white transition-colors duration-300 group-hover:text-[rgba(255,137,70,0.95)]">
                  Explore data availability options
                </h3>
                <p className="text-[rgba(255,255,255,0.7)] leading-relaxed">
                  Start minimal with state roots, then weigh on-chain DA, hybrid publishing,
                  or validity rollup bridges for production hardening.
                </p>
              </div>
            </div>
          </article>
        </div>
      </div>
    </section>
  );
}


