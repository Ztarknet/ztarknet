"use client";

import React from "react";
import Link from "next/link";
import { useRevealOnScroll } from "@/hooks/useRevealOnScroll";
import { GlowingEffect } from "@/components/ui/glowing-effect";
import { Shield, Server, Cpu, Send, ArrowDownUp } from "lucide-react";

export function Stack() {
  useRevealOnScroll();

  return (
    <section className="py-[120px] px-8 bg-[rgb(6,6,8)]" id="stack">
      <div className="max-w-container mx-auto">
        <div className="mb-12">
          <p className="eyebrow">PoC stack</p>
          <h2 className="text-[clamp(2rem,4vw,2.8rem)] leading-[1.2] font-bold tracking-tight">
            Minimal components, maximum signal
          </h2>
        </div>

        {/* Architecture Stack Diagram Card */}
        <div className="mb-12 reveal-on-scroll">
          <div className="relative rounded-2xl border border-[rgba(255,137,70,0.25)] bg-[rgb(8,8,12)] p-2 md:rounded-3xl md:p-3 max-w-[320px] mx-auto">
            <GlowingEffect
              spread={40}
              glow={true}
              disabled={false}
              proximity={64}
              inactiveZone={0.01}
            />
            <div className="relative overflow-hidden rounded-xl bg-gradient-to-br from-[rgb(12,12,18)] to-[rgb(6,6,9)] p-6 shadow-[0_18px_36px_rgba(0,0,0,0.35)]">
          <div className="flex flex-col items-center gap-3">
            {/* Layer 1: Zcash L1 */}
            <div className="w-full">
              <div className="flex items-center gap-3 p-4 rounded-lg border border-[rgba(255,137,70,0.3)] bg-[rgba(255,137,70,0.05)] transition-all duration-300 hover:border-[rgba(255,137,70,0.6)] hover:bg-[rgba(255,137,70,0.1)]">
                <div className="flex items-center justify-center w-10 h-10 rounded-lg border border-[rgba(255,137,70,0.3)] bg-[rgba(255,137,70,0.05)]">
                  <Shield className="h-5 w-5 text-[rgba(255,137,70,0.8)]" />
                </div>
                <div className="flex-1">
                  <h4 className="text-sm font-semibold text-white">Zcash L1</h4>
                  <p className="text-xs text-[rgba(255,255,255,0.6)]">Consensus Layer</p>
                </div>
              </div>
            </div>

            {/* Arrow with Animation */}
            <div className="flex flex-col items-center relative h-16">
              <div className="absolute top-0 w-px h-6 bg-gradient-to-b from-[rgba(255,137,70,0.3)] to-transparent"></div>
              <div className="absolute top-0 w-px h-full flex items-start overflow-hidden">
                <div className="w-2 h-2 rounded-full bg-[rgba(255,137,70,0.8)] animate-[slideDown_2s_ease-in-out_infinite]"></div>
              </div>
              <ArrowDownUp className="h-4 w-4 text-[rgba(255,137,70,0.5)] my-auto relative z-10" />
              <div className="absolute bottom-0 w-px h-6 bg-gradient-to-t from-[rgba(255,137,70,0.3)] to-transparent"></div>
            </div>

            {/* Layer 2: TZE Tx Builder */}
            <div className="w-full">
              <div className="flex items-center gap-3 p-4 rounded-lg border border-[rgba(255,137,70,0.3)] bg-[rgba(255,137,70,0.05)] transition-all duration-300 hover:border-[rgba(255,137,70,0.6)] hover:bg-[rgba(255,137,70,0.1)]">
                <div className="flex items-center justify-center w-10 h-10 rounded-lg border border-[rgba(255,137,70,0.3)] bg-[rgba(255,137,70,0.05)]">
                  <Send className="h-5 w-5 text-[rgba(255,137,70,0.8)]" />
                </div>
                <div className="flex-1">
                  <h4 className="text-sm font-semibold text-white">TZE Tx Builder</h4>
                  <p className="text-xs text-[rgba(255,255,255,0.6)]">Proof Bundling</p>
                </div>
              </div>
            </div>

            {/* Arrow with Animation */}
            <div className="flex flex-col items-center relative h-16">
              <div className="absolute top-0 w-px h-6 bg-gradient-to-b from-[rgba(255,137,70,0.3)] to-transparent"></div>
              <div className="absolute top-0 w-px h-full flex items-start overflow-hidden">
                <div className="w-2 h-2 rounded-full bg-[rgba(255,137,70,0.8)] animate-[slideDown_2s_ease-in-out_infinite]"></div>
              </div>
              <ArrowDownUp className="h-4 w-4 text-[rgba(255,137,70,0.5)] my-auto relative z-10" />
              <div className="absolute bottom-0 w-px h-6 bg-gradient-to-t from-[rgba(255,137,70,0.3)] to-transparent"></div>
            </div>

            {/* Layer 3: Stwo/Cairo */}
            <div className="w-full">
              <div className="flex items-center gap-3 p-4 rounded-lg border border-[rgba(255,137,70,0.3)] bg-[rgba(255,137,70,0.05)] transition-all duration-300 hover:border-[rgba(255,137,70,0.6)] hover:bg-[rgba(255,137,70,0.1)]">
                <div className="flex items-center justify-center w-10 h-10 rounded-lg border border-[rgba(255,137,70,0.3)] bg-[rgba(255,137,70,0.05)]">
                  <Cpu className="h-5 w-5 text-[rgba(255,137,70,0.8)]" />
                </div>
                <div className="flex-1">
                  <h4 className="text-sm font-semibold text-white">Stwo/Cairo</h4>
                  <p className="text-xs text-[rgba(255,255,255,0.6)]">Proof Generation</p>
                </div>
              </div>
            </div>

            {/* Arrow with Animation */}
            <div className="flex flex-col items-center relative h-16">
              <div className="absolute top-0 w-px h-6 bg-gradient-to-b from-[rgba(255,137,70,0.3)] to-transparent"></div>
              <div className="absolute top-0 w-px h-full flex items-start overflow-hidden">
                <div className="w-2 h-2 rounded-full bg-[rgba(255,137,70,0.8)] animate-[slideDown_2s_ease-in-out_infinite]"></div>
              </div>
              <ArrowDownUp className="h-4 w-4 text-[rgba(255,137,70,0.5)] my-auto relative z-10" />
              <div className="absolute bottom-0 w-px h-6 bg-gradient-to-t from-[rgba(255,137,70,0.3)] to-transparent"></div>
            </div>

            {/* Layer 4: Madara */}
            <div className="w-full">
              <div className="flex items-center gap-3 p-4 rounded-lg border border-[rgba(255,137,70,0.3)] bg-[rgba(255,137,70,0.05)] transition-all duration-300 hover:border-[rgba(255,137,70,0.6)] hover:bg-[rgba(255,137,70,0.1)]">
                <div className="flex items-center justify-center w-10 h-10 rounded-lg border border-[rgba(255,137,70,0.3)] bg-[rgba(255,137,70,0.05)]">
                  <Server className="h-5 w-5 text-[rgba(255,137,70,0.8)]" />
                </div>
                <div className="flex-1">
                  <h4 className="text-sm font-semibold text-white">Madara</h4>
                  <p className="text-xs text-[rgba(255,255,255,0.6)]">L2 Sequencer</p>
                </div>
              </div>
            </div>
          </div>
            </div>
          </div>
        </div>
        
        <ul className="grid grid-cols-1 grid-rows-none gap-4 md:grid-cols-12 lg:gap-4">
          <GridItem
            area="md:[grid-area:1/1/2/7] xl:[grid-area:1/1/2/5]"
            icon={<Shield className="h-4 w-4 text-[rgba(255,137,70,0.8)]" />}
            title="Zebra + Circle STARK TZE"
            description="A forked Zebra node hosts the draft TZE verifier, aligning with ZIP-222/245 to ensure transactions anchor proofs in canonical digests."
            link="https://github.com/AbdelStark/zebra"
            linkText="Explore the fork"
          />
          
          <GridItem
            area="md:[grid-area:1/7/2/13] xl:[grid-area:1/5/2/9]"
            icon={<Server className="h-4 w-4 text-[rgba(255,137,70,0.8)]" />}
            title="Madara (Rust)"
            description="Starknet-compatible client providing JSON-RPC, state commitments, and mempool logic. The devnet spins up with a single command."
            link="https://github.com/madara-alliance/madara"
            linkText="Check the client"
          />
          
          <GridItem
            area="md:[grid-area:2/1/4/7] xl:[grid-area:1/9/3/13]"
            icon={<Cpu className="h-4 w-4 text-[rgba(255,137,70,0.8)]" />}
            title="Stwo / Cairo"
            description="Circle STARK prover stack validating Cairo execution traces for each L2 block. JSON workflows first, native integrations next. This is the computational heart of Ztarknet, ensuring that every state transition is provably correct and efficiently verifiable on Zcash L1."
            link="https://github.com/starkware-libs/stwo-cairo"
            linkText="Dive into Stwo"
          />
          
          <GridItem
            area="md:[grid-area:2/7/3/13] xl:[grid-area:2/1/3/9]"
            icon={<Send className="h-4 w-4 text-[rgba(255,137,70,0.8)]" />}
            title="TZE Tx builder"
            description="Custom Rust glue to bundle proofs and state roots into witness bytes that a Zebra node validates before minting the next anchor."
            link="https://github.com/zcash/zips/pull/1107"
            linkText="Read the draft ZIP"
          />
        </ul>
      </div>
    </section>
  );
}

interface GridItemProps {
  area: string;
  icon: React.ReactNode;
  title: string;
  description: React.ReactNode;
  link: string;
  linkText: string;
}

const GridItem = ({ area, icon, title, description, link, linkText }: GridItemProps) => {
  return (
    <li className={`min-h-[16rem] list-none reveal-on-scroll ${area}`}>
      <div className="group relative h-full rounded-2xl border border-[rgba(255,137,70,0.25)] bg-[rgb(8,8,12)] p-2 md:rounded-3xl md:p-3 transition-all duration-300">
        <GlowingEffect
          spread={40}
          glow={true}
          disabled={false}
          proximity={64}
          inactiveZone={0.01}
        />
        <div className="relative flex h-full flex-col justify-between gap-6 overflow-hidden rounded-xl bg-gradient-to-br from-[rgb(12,12,18)] to-[rgb(6,6,9)] p-6 md:p-6 shadow-[0_18px_36px_rgba(0,0,0,0.35)] transition-all duration-300 group-hover:shadow-[0_18px_36px_rgba(255,137,70,0.15)]">
          {/* Gradient overlay on hover */}
          <div className="absolute inset-0 bg-gradient-to-br from-[rgba(255,137,70,0.08)] via-[rgba(255,255,255,0.03)] to-[rgba(255,167,70,0.05)] opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-xl pointer-events-none" />
          
          <div className="relative flex flex-1 flex-col justify-between gap-3 z-10">
            <div className="w-fit rounded-lg border border-[rgba(255,137,70,0.3)] bg-[rgba(255,137,70,0.05)] p-2 transition-all duration-300 group-hover:border-[rgba(255,137,70,0.5)] group-hover:bg-[rgba(255,137,70,0.1)] [&_svg]:transition-colors [&_svg]:duration-300 group-hover:[&_svg]:text-[rgba(255,137,70,1)]">
              {icon}
            </div>
            <div className="space-y-3">
              <h3 className="-tracking-4 pt-0.5 font-sans text-xl/[1.375rem] font-semibold text-balance text-white md:text-2xl/[1.875rem] transition-colors duration-300 group-hover:text-[rgba(255,137,70,0.95)]">
                {title}
              </h3>
              <h2 className="font-sans text-sm/[1.125rem] text-[rgba(255,255,255,0.7)] md:text-base/[1.375rem] [&_b]:md:font-semibold [&_strong]:md:font-semibold">
                {description}
              </h2>
            </div>
          </div>
          {link && (
            <Link
              href={link}
              target="_blank"
              rel="noreferrer"
              className="relative z-10 text-sm text-[rgba(255,137,70,0.8)] md:text-base font-medium transition-all duration-300 hover:text-[rgba(255,137,70,1)] hover:underline group-hover:translate-x-1 inline-flex items-center gap-1"
            >
              {linkText} <span className="transition-transform duration-300 group-hover:translate-x-1">→</span>
            </Link>
          )}
        </div>
      </div>
    </li>
  );
}


