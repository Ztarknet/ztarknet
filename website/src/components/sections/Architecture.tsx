"use client";

import React from "react";
import { useRevealOnScroll } from "@/hooks/useRevealOnScroll";
import { GlowingEffect } from "@/components/ui/glowing-effect";
import { Layers, Sparkles, Coins, Database, Zap, Shield, CheckCircle, ArrowRight, FileText, Package } from "lucide-react";

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

        {/* Flow Diagram Card */}
        <div className="mb-12 reveal-on-scroll">
          <div className="relative rounded-2xl border border-[rgba(255,137,70,0.25)] bg-[rgb(8,8,12)] p-2 md:rounded-3xl md:p-3">
            <GlowingEffect
              spread={40}
              glow={true}
              disabled={false}
              proximity={64}
              inactiveZone={0.01}
            />
            <div className="relative overflow-hidden rounded-xl bg-gradient-to-br from-[rgb(12,12,18)] to-[rgb(6,6,9)] p-8 shadow-[0_18px_36px_rgba(0,0,0,0.35)]">
              <div className="flex flex-col md:flex-row items-center justify-center gap-4 md:gap-2">
                {/* Step 1 */}
                <div className="flex flex-col items-center text-center max-w-[140px] z-10">
                  <div className="w-16 h-16 rounded-xl border border-[rgba(255,137,70,0.3)] bg-[rgba(255,137,70,0.05)] flex items-center justify-center mb-3 transition-all duration-300 hover:border-[rgba(255,137,70,0.6)] hover:bg-[rgba(255,137,70,0.1)]">
                    <Database className="h-8 w-8 text-[rgba(255,137,70,0.8)]" />
                  </div>
                  <h4 className="text-sm font-semibold text-white mb-1">Madara L2</h4>
                  <p className="text-xs text-[rgba(255,255,255,0.6)]">Sequencing</p>
                </div>

                {/* Animated Connection 1 */}
                <div className="hidden md:flex items-center relative w-16">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full h-px bg-[rgba(255,137,70,0.2)]"></div>
                  </div>
                  <div className="absolute inset-0 flex items-center overflow-hidden">
                    <div className="w-2 h-2 rounded-full bg-[rgba(255,137,70,0.8)] animate-[slideRight_2s_ease-in-out_infinite]"></div>
                  </div>
                  <ArrowRight className="h-4 w-4 text-[rgba(255,137,70,0.5)] ml-auto relative z-10" />
                </div>

                {/* Step 2 */}
                <div className="flex flex-col items-center text-center max-w-[140px] z-10">
                  <div className="w-16 h-16 rounded-xl border border-[rgba(255,137,70,0.3)] bg-[rgba(255,137,70,0.05)] flex items-center justify-center mb-3 transition-all duration-300 hover:border-[rgba(255,137,70,0.6)] hover:bg-[rgba(255,137,70,0.1)]">
                    <Zap className="h-8 w-8 text-[rgba(255,137,70,0.8)]" />
                  </div>
                  <h4 className="text-sm font-semibold text-white mb-1">Execute</h4>
                  <p className="text-xs text-[rgba(255,255,255,0.6)]">Batch Txs</p>
                </div>

                {/* Animated Connection 2 */}
                <div className="hidden md:flex items-center relative w-16">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full h-px bg-[rgba(255,137,70,0.2)]"></div>
                  </div>
                  <div className="absolute inset-0 flex items-center overflow-hidden">
                    <div className="w-2 h-2 rounded-full bg-[rgba(255,137,70,0.8)] animate-[slideRight_2s_ease-in-out_infinite_0.4s]" style={{ animationDelay: '0.4s' }}></div>
                  </div>
                  <ArrowRight className="h-4 w-4 text-[rgba(255,137,70,0.5)] ml-auto relative z-10" />
                </div>

                {/* Step 3 */}
                <div className="flex flex-col items-center text-center max-w-[140px] z-10">
                  <div className="w-16 h-16 rounded-xl border border-[rgba(255,137,70,0.3)] bg-[rgba(255,137,70,0.05)] flex items-center justify-center mb-3 transition-all duration-300 hover:border-[rgba(255,137,70,0.6)] hover:bg-[rgba(255,137,70,0.1)]">
                    <Sparkles className="h-8 w-8 text-[rgba(255,137,70,0.8)]" />
                  </div>
                  <h4 className="text-sm font-semibold text-white mb-1">Stwo Proof</h4>
                  <p className="text-xs text-[rgba(255,255,255,0.6)]">Generation</p>
                </div>

                {/* Animated Connection 3 */}
                <div className="hidden md:flex items-center relative w-16">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full h-px bg-[rgba(255,137,70,0.2)]"></div>
                  </div>
                  <div className="absolute inset-0 flex items-center overflow-hidden">
                    <div className="w-2 h-2 rounded-full bg-[rgba(255,137,70,0.8)] animate-[slideRight_2s_ease-in-out_infinite_0.8s]" style={{ animationDelay: '0.8s' }}></div>
                  </div>
                  <ArrowRight className="h-4 w-4 text-[rgba(255,137,70,0.5)] ml-auto relative z-10" />
                </div>

                {/* Step 4 */}
                <div className="flex flex-col items-center text-center max-w-[140px] z-10">
                  <div className="w-16 h-16 rounded-xl border border-[rgba(255,137,70,0.3)] bg-[rgba(255,137,70,0.05)] flex items-center justify-center mb-3 transition-all duration-300 hover:border-[rgba(255,137,70,0.6)] hover:bg-[rgba(255,137,70,0.1)]">
                    <Shield className="h-8 w-8 text-[rgba(255,137,70,0.8)]" />
                  </div>
                  <h4 className="text-sm font-semibold text-white mb-1">Zcash L1</h4>
                  <p className="text-xs text-[rgba(255,255,255,0.6)]">Verify TZE</p>
                </div>

                {/* Animated Connection 4 */}
                <div className="hidden md:flex items-center relative w-16">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full h-px bg-[rgba(255,137,70,0.2)]"></div>
                  </div>
                  <div className="absolute inset-0 flex items-center overflow-hidden">
                    <div className="w-2 h-2 rounded-full bg-[rgba(255,137,70,0.8)] animate-[slideRight_2s_ease-in-out_infinite_1.2s]" style={{ animationDelay: '1.2s' }}></div>
                  </div>
                  <ArrowRight className="h-4 w-4 text-[rgba(255,137,70,0.5)] ml-auto relative z-10" />
                </div>

                {/* Step 5 */}
                <div className="flex flex-col items-center text-center max-w-[140px] z-10">
                  <div className="w-16 h-16 rounded-xl border border-[rgba(255,137,70,0.3)] bg-[rgba(255,137,70,0.05)] flex items-center justify-center mb-3 transition-all duration-300 hover:border-[rgba(255,137,70,0.6)] hover:bg-[rgba(255,137,70,0.1)]">
                    <CheckCircle className="h-8 w-8 text-[rgba(255,137,70,0.8)]" />
                  </div>
                  <h4 className="text-sm font-semibold text-white mb-1">Validated</h4>
                  <p className="text-xs text-[rgba(255,255,255,0.6)]">Anchor</p>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <article className="group reveal-on-scroll relative h-full rounded-2xl border border-[rgba(255,137,70,0.25)] bg-[rgb(8,8,12)] p-2 md:rounded-3xl md:p-3 transition-all duration-300">
            <GlowingEffect
              spread={40}
              glow={true}
              disabled={false}
              proximity={64}
              inactiveZone={0.01}
            />
            <div className="relative flex h-full flex-col gap-4 overflow-hidden rounded-xl bg-gradient-to-br from-[rgb(12,12,18)] to-[rgb(6,6,9)] p-[30px] shadow-[0_18px_36px_rgba(0,0,0,0.35)] transition-all duration-300 group-hover:shadow-[0_18px_36px_rgba(255,137,70,0.15)]">
              {/* Gradient overlay on hover */}
              <div className="absolute inset-0 bg-gradient-to-br from-[rgba(255,137,70,0.08)] via-[rgba(255,255,255,0.03)] to-[rgba(255,167,70,0.05)] opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-xl pointer-events-none" />
              
              <div className="relative flex flex-1 flex-col gap-4 z-10">
                <div className="w-fit rounded-lg border border-[rgba(255,137,70,0.3)] bg-[rgba(255,137,70,0.05)] p-2 transition-all duration-300 group-hover:border-[rgba(255,137,70,0.5)] group-hover:bg-[rgba(255,137,70,0.1)] [&_svg]:transition-colors [&_svg]:duration-300 group-hover:[&_svg]:text-[rgba(255,137,70,1)]">
                  <Layers className="h-4 w-4 text-[rgba(255,137,70,0.8)]" />
                </div>
                <h3 className="text-xl font-bold mb-4 text-white transition-colors duration-300 group-hover:text-[rgba(255,137,70,0.95)]">L2 Sequencing</h3>
                <ul className="mt-[18px] text-[rgba(255,255,255,0.7)] leading-relaxed space-y-2">
                <li>Madara batches and executes Starknet-style transactions.</li>
                <li>State updates emit a new L2 root per block.</li>
                  <li>Execution traces feed directly into prover workers.</li>
                </ul>
              </div>
            </div>
          </article>
          
          <article className="group reveal-on-scroll relative h-full rounded-2xl border border-[rgba(255,137,70,0.25)] bg-[rgb(8,8,12)] p-2 md:rounded-3xl md:p-3 transition-all duration-300">
            <GlowingEffect
              spread={40}
              glow={true}
              disabled={false}
              proximity={64}
              inactiveZone={0.01}
            />
            <div className="relative flex h-full flex-col gap-4 overflow-hidden rounded-xl bg-gradient-to-br from-[rgb(12,12,18)] to-[rgb(6,6,9)] p-[30px] shadow-[0_18px_36px_rgba(0,0,0,0.35)] transition-all duration-300 group-hover:shadow-[0_18px_36px_rgba(255,137,70,0.15)]">
              {/* Gradient overlay on hover */}
              <div className="absolute inset-0 bg-gradient-to-br from-[rgba(255,137,70,0.08)] via-[rgba(255,255,255,0.03)] to-[rgba(255,167,70,0.05)] opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-xl pointer-events-none" />
              
              <div className="relative flex flex-1 flex-col gap-4 z-10">
                <div className="w-fit rounded-lg border border-[rgba(255,137,70,0.3)] bg-[rgba(255,137,70,0.05)] p-2 transition-all duration-300 group-hover:border-[rgba(255,137,70,0.5)] group-hover:bg-[rgba(255,137,70,0.1)] [&_svg]:transition-colors [&_svg]:duration-300 group-hover:[&_svg]:text-[rgba(255,137,70,1)]">
                  <Sparkles className="h-4 w-4 text-[rgba(255,137,70,0.8)]" />
                </div>
                <h3 className="text-xl font-bold mb-4 text-white transition-colors duration-300 group-hover:text-[rgba(255,137,70,0.95)]">Proof Generation</h3>
                <ul className="mt-[18px] text-[rgba(255,255,255,0.7)] leading-relaxed space-y-2">
                <li>Stwo/Cairo produces Circle STARK proofs for each block.</li>
                <li>
                  Public inputs commit to <code className="font-mono text-[rgba(255,137,70,0.9)]">root_k</code> and{" "}
                  <code className="font-mono text-[rgba(255,137,70,0.9)]">root_{"{k+1}"}</code>.
                </li>
                  <li>Optional aggregation once the PoC is stable.</li>
                </ul>
              </div>
            </div>
          </article>
          
          <article className="group reveal-on-scroll relative h-full rounded-2xl border border-[rgba(255,137,70,0.25)] bg-[rgb(8,8,12)] p-2 md:rounded-3xl md:p-3 transition-all duration-300">
            <GlowingEffect
              spread={40}
              glow={true}
              disabled={false}
              proximity={64}
              inactiveZone={0.01}
            />
            <div className="relative flex h-full flex-col gap-4 overflow-hidden rounded-xl bg-gradient-to-br from-[rgb(12,12,18)] to-[rgb(6,6,9)] p-[30px] shadow-[0_18px_36px_rgba(0,0,0,0.35)] transition-all duration-300 group-hover:shadow-[0_18px_36px_rgba(255,137,70,0.15)]">
              {/* Gradient overlay on hover */}
              <div className="absolute inset-0 bg-gradient-to-br from-[rgba(255,137,70,0.08)] via-[rgba(255,255,255,0.03)] to-[rgba(255,167,70,0.05)] opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-xl pointer-events-none" />
              
              <div className="relative flex flex-1 flex-col gap-4 z-10">
                <div className="w-fit rounded-lg border border-[rgba(255,137,70,0.3)] bg-[rgba(255,137,70,0.05)] p-2 transition-all duration-300 group-hover:border-[rgba(255,137,70,0.5)] group-hover:bg-[rgba(255,137,70,0.1)] [&_svg]:transition-colors [&_svg]:duration-300 group-hover:[&_svg]:text-[rgba(255,137,70,1)]">
                  <Coins className="h-4 w-4 text-[rgba(255,137,70,0.8)]" />
                </div>
                <h3 className="text-xl font-bold mb-4 text-white transition-colors duration-300 group-hover:text-[rgba(255,137,70,0.95)]">Zcash Settlement</h3>
                <ul className="mt-[18px] text-[rgba(255,255,255,0.7)] leading-relaxed space-y-2">
                <li>TZE transaction spends the previous anchor UTXO.</li>
                <li>Witness carries the proof; precondition locks the next root.</li>
                  <li>Zebra fork validates the proof via the Circle STARK TZE.</li>
                </ul>
              </div>
            </div>
          </article>
        </div>

        {/* Transaction Flow Mini-Diagram Card */}
        <div className="max-w-[880px] mx-auto mt-9">
          <div className="relative rounded-2xl border border-[rgba(255,137,70,0.25)] bg-[rgb(8,8,12)] p-2 md:rounded-3xl md:p-3 mb-6">
            <GlowingEffect
              spread={40}
              glow={true}
              disabled={false}
              proximity={64}
              inactiveZone={0.01}
            />
            <div className="relative overflow-hidden rounded-xl bg-gradient-to-br from-[rgb(12,12,18)] to-[rgb(6,6,9)] p-6 shadow-[0_18px_36px_rgba(0,0,0,0.35)]">
          <div className="flex flex-col md:flex-row items-center justify-center gap-3 md:gap-2">
            {/* Step 1 */}
            <div className="flex flex-col items-center text-center z-10">
              <div className="w-12 h-12 rounded-lg border border-[rgba(255,137,70,0.3)] bg-[rgba(255,137,70,0.05)] flex items-center justify-center mb-2">
                <FileText className="h-6 w-6 text-[rgba(255,137,70,0.8)]" />
              </div>
              <span className="text-xs text-[rgba(255,255,255,0.7)]">State Root</span>
            </div>

            {/* Animated Connection */}
            <div className="hidden md:flex items-center relative w-12">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full h-px bg-[rgba(255,137,70,0.2)]"></div>
              </div>
              <div className="absolute inset-0 flex items-center overflow-hidden">
                <div className="w-2 h-2 rounded-full bg-[rgba(255,137,70,0.8)] animate-[slideRight_2s_ease-in-out_infinite]"></div>
              </div>
              <ArrowRight className="h-4 w-4 text-[rgba(255,137,70,0.5)] ml-auto relative z-10" />
            </div>

            {/* Step 2 */}
            <div className="flex flex-col items-center text-center z-10">
              <div className="w-12 h-12 rounded-lg border border-[rgba(255,137,70,0.3)] bg-[rgba(255,137,70,0.05)] flex items-center justify-center mb-2">
                <Sparkles className="h-6 w-6 text-[rgba(255,137,70,0.8)]" />
              </div>
              <span className="text-xs text-[rgba(255,255,255,0.7)]">Prove</span>
            </div>

            {/* Animated Connection */}
            <div className="hidden md:flex items-center relative w-12">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full h-px bg-[rgba(255,137,70,0.2)]"></div>
              </div>
              <div className="absolute inset-0 flex items-center overflow-hidden">
                <div className="w-2 h-2 rounded-full bg-[rgba(255,137,70,0.8)] animate-[slideRight_2s_ease-in-out_infinite]" style={{ animationDelay: '0.4s' }}></div>
              </div>
              <ArrowRight className="h-4 w-4 text-[rgba(255,137,70,0.5)] ml-auto relative z-10" />
            </div>

            {/* Step 3 */}
            <div className="flex flex-col items-center text-center z-10">
              <div className="w-12 h-12 rounded-lg border border-[rgba(255,137,70,0.3)] bg-[rgba(255,137,70,0.05)] flex items-center justify-center mb-2">
                <Shield className="h-6 w-6 text-[rgba(255,137,70,0.8)]" />
              </div>
              <span className="text-xs text-[rgba(255,255,255,0.7)]">Verify TZE</span>
            </div>

            {/* Animated Connection */}
            <div className="hidden md:flex items-center relative w-12">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full h-px bg-[rgba(255,137,70,0.2)]"></div>
              </div>
              <div className="absolute inset-0 flex items-center overflow-hidden">
                <div className="w-2 h-2 rounded-full bg-[rgba(255,137,70,0.8)] animate-[slideRight_2s_ease-in-out_infinite]" style={{ animationDelay: '0.8s' }}></div>
              </div>
              <ArrowRight className="h-4 w-4 text-[rgba(255,137,70,0.5)] ml-auto relative z-10" />
            </div>

            {/* Step 4 */}
            <div className="flex flex-col items-center text-center z-10">
              <div className="w-12 h-12 rounded-lg border border-[rgba(255,137,70,0.3)] bg-[rgba(255,137,70,0.05)] flex items-center justify-center mb-2">
                <Package className="h-6 w-6 text-[rgba(255,137,70,0.8)]" />
              </div>
              <span className="text-xs text-[rgba(255,255,255,0.7)]">New UTXO</span>
            </div>
          </div>
            </div>
          </div>
          
          <p className="text-center text-[rgba(201,201,210,0.75)]">
            It&apos;s a clean UTXO chain of anchors: prove the state transition, hand the
            verifier the bytes, and let Zcash consensus seal the next root. No ceremony,
            no sidecar trust assumptions.
          </p>
        </div>
      </div>
    </section>
  );
}


