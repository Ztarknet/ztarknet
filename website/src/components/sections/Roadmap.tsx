"use client";

import React from "react";
import { useRevealOnScroll } from "@/hooks/useRevealOnScroll";
import { GlowingEffect } from "@/components/ui/glowing-effect";
import { CheckCircle, Play, Database } from "lucide-react";

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

        <div className="grid grid-cols-1 grid-rows-none gap-4 md:grid-cols-12 lg:gap-4">
          {/* Card 01 - Top Left */}
          <article className="group reveal-on-scroll relative h-full rounded-2xl border border-[rgba(255,137,70,0.25)] bg-[rgba(8,8,12,0.8)] p-2 md:rounded-3xl md:p-3 transition-all duration-300 md:[grid-area:1/1/2/9]">
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

          {/* Progress Timeline - Right Column (2 rows) */}
          <div className="reveal-on-scroll md:[grid-area:1/9/3/13]">
            <div className="relative h-full rounded-2xl border border-[rgba(255,137,70,0.25)] bg-[rgb(8,8,12)] p-2 md:rounded-3xl md:p-3">
              <GlowingEffect
                spread={40}
                glow={true}
                disabled={false}
                proximity={64}
                inactiveZone={0.01}
              />
              <div className="relative h-full overflow-hidden rounded-xl bg-gradient-to-br from-[rgb(12,12,18)] to-[rgb(6,6,9)] p-6 md:p-8 shadow-[0_18px_36px_rgba(0,0,0,0.35)] flex items-center justify-center">
                <div className="relative flex flex-col items-center gap-1.5 w-full">
                  {/* Single continuous vertical line with beam */}
                  <div className="absolute top-0 bottom-0 left-1/2 -translate-x-1/2 w-px bg-[rgba(255,137,70,0.2)] z-0"></div>
                  <div className="absolute top-0 bottom-0 left-1/2 -translate-x-1/2 w-px z-0 overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[rgb(255,137,70)] to-transparent h-[30%] animate-[beamMoveVertical_6s_ease-in-out_infinite] opacity-80 blur-[1px]"></div>
                    <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[rgb(255,137,70)] to-transparent h-[20%] animate-[beamMoveVertical_6s_ease-in-out_infinite] opacity-100"></div>
                  </div>

                  {/* Step 1 - Completed */}
                  <div className="w-full max-w-[180px] relative z-10">
                    <div className="flex items-center gap-3 p-3 rounded-lg border border-[rgb(82,47,30)] bg-[rgb(21,15,15)] transition-all duration-300 hover:border-[rgb(123,71,45)] hover:bg-[rgb(33,23,20)]">
                      <div className="flex items-center justify-center w-8 h-8 rounded-lg border border-[rgb(82,47,30)] bg-[rgb(21,15,15)]">
                        <CheckCircle className="h-4 w-4 text-[rgb(255,137,70)]" />
                      </div>
                      <div className="flex-1">
                        <h4 className="text-sm font-semibold text-white">01 - Proof verification</h4>
                        <p className="text-xs text-[rgba(255,255,255,0.6)]">Completed</p>
                      </div>
                    </div>
                  </div>

                  {/* Spacer */}
                  <div className="h-6 relative z-10"></div>

                  {/* Step 2 - In Progress */}
                  <div className="w-full max-w-[180px] relative z-10">
                    <div className="flex items-center gap-3 p-3 rounded-lg border border-[rgb(82,47,30)] bg-[rgb(21,15,15)] transition-all duration-300 hover:border-[rgb(123,71,45)] hover:bg-[rgb(33,23,20)]">
                      <div className="flex items-center justify-center w-8 h-8 rounded-lg border border-[rgb(82,47,30)] bg-[rgb(21,15,15)]">
                        <Play className="h-4 w-4 text-[rgb(255,137,70)]" />
                      </div>
                      <div className="flex-1">
                        <h4 className="text-sm font-semibold text-white">02 - Replayable devnet</h4>
                        <p className="text-xs text-[rgba(255,255,255,0.6)]">In progress</p>
                      </div>
                    </div>
                  </div>

                  {/* Spacer */}
                  <div className="h-6 relative z-10"></div>

                  {/* Step 3 - Upcoming */}
                  <div className="w-full max-w-[180px] relative z-10">
                    <div className="flex items-center gap-3 p-3 rounded-lg border border-[rgb(82,47,30)] bg-[rgb(21,15,15)] transition-all duration-300 hover:border-[rgb(123,71,45)] hover:bg-[rgb(33,23,20)]">
                      <div className="flex items-center justify-center w-8 h-8 rounded-lg border border-[rgb(82,47,30)] bg-[rgb(21,15,15)]">
                        <Database className="h-4 w-4 text-[rgb(255,137,70)]" />
                      </div>
                      <div className="flex-1">
                        <h4 className="text-sm font-semibold text-white">03 - Data availability</h4>
                        <p className="text-xs text-[rgba(255,255,255,0.6)]">Upcoming</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Card 02 - Bottom Left */}
          <article className="group reveal-on-scroll relative h-full rounded-2xl border border-[rgba(255,137,70,0.25)] bg-[rgba(8,8,12,0.8)] p-2 md:rounded-3xl md:p-3 transition-all duration-300 md:[grid-area:2/1/3/5]">
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
          
          {/* Card 03 - Bottom Right */}
          <article className="group reveal-on-scroll relative h-full rounded-2xl border border-[rgba(255,137,70,0.25)] bg-[rgba(8,8,12,0.8)] p-2 md:rounded-3xl md:p-3 transition-all duration-300 md:[grid-area:2/5/3/9]">
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


