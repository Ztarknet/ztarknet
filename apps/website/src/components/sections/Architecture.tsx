'use client';

import { useRevealOnScroll } from '@/hooks/useRevealOnScroll';
import { GlowingEffect } from '@workspace/ui/components/glowing-effect';
import {
  ArrowRight,
  CheckCircle,
  Coins,
  Database,
  FileText,
  Layers,
  Package,
  Shield,
  Sparkles,
  Zap,
} from 'lucide-react';
import React from 'react';

export function Architecture() {
  useRevealOnScroll();

  return (
    <section className="py-[120px] px-8" id="architecture">
      <div className="max-w-container mx-auto">
        <div className="mb-12">
          <p className="eyebrow">How it fits together</p>
          <h2 className="text-[clamp(2rem,4vw,2.8rem)] leading-[1.2] font-bold tracking-tight">
            The Circle STARK rollup loop
          </h2>
        </div>

        <div className="grid grid-cols-1 grid-rows-none gap-4 md:grid-cols-12 lg:gap-4">
          {/* Flow Diagram - 2 cols (8/12) */}
          <div className="reveal-on-scroll md:[grid-area:1/1/2/9]">
            <div className="relative h-full rounded-2xl border border-[rgba(255,137,70,0.25)] bg-[rgb(8,8,12)] p-2 md:rounded-3xl md:p-3">
              <GlowingEffect
                spread={40}
                glow={true}
                disabled={false}
                proximity={64}
                inactiveZone={0.01}
              />
              <div className="relative flex w-full h-full items-center justify-center">
                {/* Single animated line behind all boxes - aligned with center of icon boxes (h-16 = 64px, center = 32px = top-8) */}

                <div className="relative w-full h-full overflow-hidden rounded-xl bg-gradient-to-br from-[rgb(12,12,18)] to-[rgb(6,6,9)] p-6 md:p-8 shadow-[0_18px_36px_rgba(0,0,0,0.35)] flex items-center justify-center">
                  <div className="relative w-full flex flex-col md:flex-row items-center gap-1.5 md:gap-0 md:justify-between">
                    {/* Vertical line for mobile */}
                    <div className="absolute top-0 bottom-0 left-1/2 -translate-x-1/2 w-px bg-[rgba(255,137,70,0.2)] z-0 md:hidden" />
                    <div className="absolute top-0 bottom-0 left-1/2 -translate-x-1/2 w-px z-0 overflow-hidden md:hidden">
                      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[rgb(255,137,70)] to-transparent h-[30%] animate-[beamMoveVertical_6s_ease-in-out_infinite] opacity-80 blur-[1px]" />
                      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[rgb(255,137,70)] to-transparent h-[20%] animate-[beamMoveVertical_6s_ease-in-out_infinite] opacity-100" />
                    </div>
                    {/* Horizontal line for desktop */}
                    <div className="hidden md:block absolute left-0 right-0 top-8 h-px bg-[rgba(255,137,70,0.2)] z-0" />
                    <div className="hidden md:block absolute left-0 right-0 top-8 h-px z-0 overflow-hidden">
                      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-[rgb(255,137,70)] to-transparent w-[30%] h-full animate-[beamMove_6s_ease-in-out_infinite] opacity-80 blur-[1px]" />
                      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-[rgb(255,137,70)] to-transparent w-[20%] h-full animate-[beamMove_6s_ease-in-out_infinite] opacity-100" />
                    </div>
                    {/* Step 1 - Mobile version */}
                    <div className="w-full max-w-[180px] relative z-10 md:hidden">
                      <div className="flex items-center gap-3 p-3 rounded-lg border border-[rgb(82,47,30)] bg-[rgb(21,15,15)] transition-all duration-300 hover:border-[rgb(123,71,45)] hover:bg-[rgb(33,23,20)]">
                        <div className="flex items-center justify-center w-8 h-8 rounded-lg border border-[rgb(82,47,30)] bg-[rgb(21,15,15)]">
                          <Database className="h-4 w-4 text-[rgb(255,137,70)]" />
                        </div>
                        <div className="flex-1">
                          <h4 className="text-sm font-semibold text-white">Madara L2</h4>
                          <p className="text-xs text-[rgba(255,255,255,0.6)]">Sequencing</p>
                        </div>
                      </div>
                    </div>
                    {/* Step 1 - Desktop version */}
                    <div className="flex flex-col items-center text-center max-w-[140px] relative z-10 hidden md:flex">
                      <div className="w-16 h-16 rounded-xl border border-[rgb(82,47,30)] bg-[rgb(21,15,15)] flex items-center justify-center mb-3 transition-all duration-300 hover:border-[rgb(123,71,45)] hover:bg-[rgb(33,23,20)]">
                        <Database className="h-8 w-8 text-[rgb(255,137,70)]" />
                      </div>
                      <h4 className="text-sm font-semibold text-white mb-1">Madara L2</h4>
                      <p className="text-xs text-[rgba(255,255,255,0.6)]">Sequencing</p>
                    </div>
                    {/* Spacer for mobile */}
                    <div className="h-6 relative z-10 md:hidden" />
                    {/* Step 2 - Mobile version */}
                    <div className="w-full max-w-[180px] relative z-10 md:hidden">
                      <div className="flex items-center gap-3 p-3 rounded-lg border border-[rgb(82,47,30)] bg-[rgb(21,15,15)] transition-all duration-300 hover:border-[rgb(123,71,45)] hover:bg-[rgb(33,23,20)]">
                        <div className="flex items-center justify-center w-8 h-8 rounded-lg border border-[rgb(82,47,30)] bg-[rgb(21,15,15)]">
                          <Zap className="h-4 w-4 text-[rgb(255,137,70)]" />
                        </div>
                        <div className="flex-1">
                          <h4 className="text-sm font-semibold text-white">Execute</h4>
                          <p className="text-xs text-[rgba(255,255,255,0.6)]">Batch Txs</p>
                        </div>
                      </div>
                    </div>
                    {/* Step 2 - Desktop version */}
                    <div className="flex flex-col items-center text-center max-w-[140px] relative z-10 hidden md:flex">
                      <div className="w-16 h-16 rounded-xl border border-[rgb(82,47,30)] bg-[rgb(21,15,15)] flex items-center justify-center mb-3 transition-all duration-300 hover:border-[rgb(123,71,45)] hover:bg-[rgb(33,23,20)]">
                        <Zap className="h-8 w-8 text-[rgb(255,137,70)]" />
                      </div>
                      <h4 className="text-sm font-semibold text-white mb-1">Execute</h4>
                      <p className="text-xs text-[rgba(255,255,255,0.6)]">Batch Txs</p>
                    </div>
                    {/* Spacer for mobile */}
                    <div className="h-6 relative z-10 md:hidden" />
                    {/* Step 3 - Mobile version */}
                    <div className="w-full max-w-[180px] relative z-10 md:hidden">
                      <div className="flex items-center gap-3 p-3 rounded-lg border border-[rgb(82,47,30)] bg-[rgb(21,15,15)] transition-all duration-300 hover:border-[rgb(123,71,45)] hover:bg-[rgb(33,23,20)]">
                        <div className="flex items-center justify-center w-8 h-8 rounded-lg border border-[rgb(82,47,30)] bg-[rgb(21,15,15)]">
                          <Sparkles className="h-4 w-4 text-[rgb(255,137,70)]" />
                        </div>
                        <div className="flex-1">
                          <h4 className="text-sm font-semibold text-white">Stwo Proof</h4>
                          <p className="text-xs text-[rgba(255,255,255,0.6)]">Generation</p>
                        </div>
                      </div>
                    </div>
                    {/* Step 3 - Desktop version */}
                    <div className="flex flex-col items-center text-center max-w-[140px] relative z-10 hidden md:flex">
                      <div className="w-16 h-16 rounded-xl border border-[rgb(82,47,30)] bg-[rgb(21,15,15)] flex items-center justify-center mb-3 transition-all duration-300 hover:border-[rgb(123,71,45)] hover:bg-[rgb(33,23,20)]">
                        <Sparkles className="h-8 w-8 text-[rgb(255,137,70)]" />
                      </div>
                      <h4 className="text-sm font-semibold text-white mb-1">Stwo Proof</h4>
                      <p className="text-xs text-[rgba(255,255,255,0.6)]">Generation</p>
                    </div>
                    {/* Spacer for mobile */}
                    <div className="h-6 relative z-10 md:hidden" />
                    {/* Step 4 - Mobile version */}
                    <div className="w-full max-w-[180px] relative z-10 md:hidden">
                      <div className="flex items-center gap-3 p-3 rounded-lg border border-[rgb(82,47,30)] bg-[rgb(21,15,15)] transition-all duration-300 hover:border-[rgb(123,71,45)] hover:bg-[rgb(33,23,20)]">
                        <div className="flex items-center justify-center w-8 h-8 rounded-lg border border-[rgb(82,47,30)] bg-[rgb(21,15,15)]">
                          <Shield className="h-4 w-4 text-[rgb(255,137,70)]" />
                        </div>
                        <div className="flex-1">
                          <h4 className="text-sm font-semibold text-white">Zcash L1</h4>
                          <p className="text-xs text-[rgba(255,255,255,0.6)]">Verify TZE</p>
                        </div>
                      </div>
                    </div>
                    {/* Step 4 - Desktop version */}
                    <div className="flex flex-col items-center text-center max-w-[140px] relative z-10 hidden md:flex">
                      <div className="w-16 h-16 rounded-xl border border-[rgb(82,47,30)] bg-[rgb(21,15,15)] flex items-center justify-center mb-3 transition-all duration-300 hover:border-[rgb(123,71,45)] hover:bg-[rgb(33,23,20)]">
                        <Shield className="h-8 w-8 text-[rgb(255,137,70)]" />
                      </div>
                      <h4 className="text-sm font-semibold text-white mb-1">Zcash L1</h4>
                      <p className="text-xs text-[rgba(255,255,255,0.6)]">Verify TZE</p>
                    </div>
                    {/* Spacer for mobile */}
                    <div className="h-6 relative z-10 md:hidden" />
                    {/* Step 5 - Mobile version */}
                    <div className="w-full max-w-[180px] relative z-10 md:hidden">
                      <div className="flex items-center gap-3 p-3 rounded-lg border border-[rgb(82,47,30)] bg-[rgb(21,15,15)] transition-all duration-300 hover:border-[rgb(123,71,45)] hover:bg-[rgb(33,23,20)]">
                        <div className="flex items-center justify-center w-8 h-8 rounded-lg border border-[rgb(82,47,30)] bg-[rgb(21,15,15)]">
                          <CheckCircle className="h-4 w-4 text-[rgb(255,137,70)]" />
                        </div>
                        <div className="flex-1">
                          <h4 className="text-sm font-semibold text-white">Validated</h4>
                          <p className="text-xs text-[rgba(255,255,255,0.6)]">Anchor</p>
                        </div>
                      </div>
                    </div>
                    {/* Step 5 - Desktop version */}
                    <div className="flex flex-col items-center text-center max-w-[140px] relative z-10 hidden md:flex">
                      <div className="w-16 h-16 rounded-xl border border-[rgb(82,47,30)] bg-[rgb(21,15,15)] flex items-center justify-center mb-3 transition-all duration-300 hover:border-[rgb(123,71,45)] hover:bg-[rgb(33,23,20)]">
                        <CheckCircle className="h-8 w-8 text-[rgb(255,137,70)]" />
                      </div>
                      <h4 className="text-sm font-semibold text-white mb-1">Validated</h4>
                      <p className="text-xs text-[rgba(255,255,255,0.6)]">Anchor</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Card à droite du schéma - 1 col (4/12) */}
          <article className="group reveal-on-scroll relative h-full rounded-2xl border border-[rgba(255,137,70,0.25)] bg-[rgb(8,8,12)] p-2 md:rounded-3xl md:p-3 transition-all duration-300 md:[grid-area:1/9/2/13]">
            <GlowingEffect
              spread={40}
              glow={true}
              disabled={false}
              proximity={64}
              inactiveZone={0.01}
            />
            <div className="relative flex h-full flex-col gap-3 overflow-hidden rounded-xl bg-gradient-to-br from-[rgb(12,12,18)] to-[rgb(6,6,9)] p-[30px] shadow-[0_18px_36px_rgba(0,0,0,0.35)] transition-all duration-300 group-hover:shadow-[0_18px_36px_rgba(255,137,70,0.15)]">
              {/* Gradient overlay on hover */}
              <div className="absolute inset-0 bg-gradient-to-br from-[rgba(255,137,70,0.08)] via-[rgba(255,255,255,0.03)] to-[rgba(255,167,70,0.05)] opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-xl pointer-events-none" />

              <div className="relative flex flex-1 flex-col gap-3 z-10">
                <div className="w-fit rounded-lg border border-[rgb(82,47,30)] bg-[rgb(21,15,15)] p-2 transition-all duration-300 group-hover:border-[rgb(123,71,45)] group-hover:bg-[rgb(33,23,20)] [&_svg]:transition-colors [&_svg]:duration-300 group-hover:[&_svg]:text-[rgb(255,137,70)]">
                  <Sparkles className="h-4 w-4 text-[rgb(255,137,70)]" />
                </div>
                <h3 className="text-xl font-bold text-white transition-colors duration-300 group-hover:text-[rgba(255,137,70,0.95)]">
                  Proof Generation
                </h3>
                <ul className="text-[rgba(255,255,255,0.7)] leading-relaxed space-y-2">
                  <li>Stwo/Cairo produces Circle STARK proofs for each block.</li>
                  <li>
                    Public inputs commit to{' '}
                    <code className="font-mono text-[rgba(255,137,70,0.9)]">root_k</code> and{' '}
                    <code className="font-mono text-[rgba(255,137,70,0.9)]">root_{'{k+1}'}</code>.
                  </li>
                  <li>Optional aggregation once the PoC is stable.</li>
                </ul>
              </div>
            </div>
          </article>

          {/* L2 Sequencing - 50% */}
          <article className="group reveal-on-scroll relative h-full rounded-2xl border border-[rgba(255,137,70,0.25)] bg-[rgb(8,8,12)] p-2 md:rounded-3xl md:p-3 transition-all duration-300 md:[grid-area:2/1/3/7]">
            <GlowingEffect
              spread={40}
              glow={true}
              disabled={false}
              proximity={64}
              inactiveZone={0.01}
            />
            <div className="relative flex h-full flex-col gap-3 overflow-hidden rounded-xl bg-gradient-to-br from-[rgb(12,12,18)] to-[rgb(6,6,9)] p-[30px] shadow-[0_18px_36px_rgba(0,0,0,0.35)] transition-all duration-300 group-hover:shadow-[0_18px_36px_rgba(255,137,70,0.15)]">
              {/* Gradient overlay on hover */}
              <div className="absolute inset-0 bg-gradient-to-br from-[rgba(255,137,70,0.08)] via-[rgba(255,255,255,0.03)] to-[rgba(255,167,70,0.05)] opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-xl pointer-events-none" />

              <div className="relative flex flex-1 flex-col gap-3 z-10">
                <div className="w-fit rounded-lg border border-[rgb(82,47,30)] bg-[rgb(21,15,15)] p-2 transition-all duration-300 group-hover:border-[rgb(123,71,45)] group-hover:bg-[rgb(33,23,20)] [&_svg]:transition-colors [&_svg]:duration-300 group-hover:[&_svg]:text-[rgb(255,137,70)]">
                  <Layers className="h-4 w-4 text-[rgb(255,137,70)]" />
                </div>
                <h3 className="text-xl font-bold mb-3 text-white transition-colors duration-300 group-hover:text-[rgba(255,137,70,0.95)]">
                  L2 Sequencing
                </h3>
                <ul className="text-[rgba(255,255,255,0.7)] leading-relaxed space-y-2">
                  <li>Madara batches and executes Starknet-style transactions.</li>
                  <li>State updates emit a new L2 root per block.</li>
                  <li>Execution traces feed directly into prover workers.</li>
                </ul>
              </div>
            </div>
          </article>

          {/* Zcash Settlement - 50% */}
          <article className="group reveal-on-scroll relative h-full rounded-2xl border border-[rgba(255,137,70,0.25)] bg-[rgb(8,8,12)] p-2 md:rounded-3xl md:p-3 transition-all duration-300 md:[grid-area:2/7/3/13]">
            <GlowingEffect
              spread={40}
              glow={true}
              disabled={false}
              proximity={64}
              inactiveZone={0.01}
            />
            <div className="relative flex h-full flex-col gap-3 overflow-hidden rounded-xl bg-gradient-to-br from-[rgb(12,12,18)] to-[rgb(6,6,9)] p-[30px] shadow-[0_18px_36px_rgba(0,0,0,0.35)] transition-all duration-300 group-hover:shadow-[0_18px_36px_rgba(255,137,70,0.15)]">
              {/* Gradient overlay on hover */}
              <div className="absolute inset-0 bg-gradient-to-br from-[rgba(255,137,70,0.08)] via-[rgba(255,255,255,0.03)] to-[rgba(255,167,70,0.05)] opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-xl pointer-events-none" />

              <div className="relative flex flex-1 flex-col gap-3 z-10">
                <div className="w-fit rounded-lg border border-[rgb(82,47,30)] bg-[rgb(21,15,15)] p-2 transition-all duration-300 group-hover:border-[rgb(123,71,45)] group-hover:bg-[rgb(33,23,20)] [&_svg]:transition-colors [&_svg]:duration-300 group-hover:[&_svg]:text-[rgb(255,137,70)]">
                  <Coins className="h-4 w-4 text-[rgb(255,137,70)]" />
                </div>
                <h3 className="text-xl font-bold mb-3 text-white transition-colors duration-300 group-hover:text-[rgba(255,137,70,0.95)]">
                  Zcash Settlement
                </h3>
                <ul className="text-[rgba(255,255,255,0.7)] leading-relaxed space-y-2">
                  <li>TZE transaction spends the previous anchor UTXO.</li>
                  <li>Witness carries the proof; precondition locks the next root.</li>
                  <li>Zebra fork validates the proof via the Circle STARK TZE.</li>
                </ul>
              </div>
            </div>
          </article>
        </div>
      </div>
    </section>
  );
}
