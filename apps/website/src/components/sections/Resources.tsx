'use client';

import { useRevealOnScroll } from '@/hooks/useRevealOnScroll';
import Link from 'next/link';
import type React from 'react';

export function Resources() {
  useRevealOnScroll();

  const resources = [
    {
      title: 'Ztarknet repository',
      href: 'https://github.com/AbdelStark/ztarknet',
    },
    {
      title: 'Circle STARK-enabled Zebra fork',
      href: 'https://github.com/AbdelStark/zebra',
    },
    {
      title: 'Circle STARK TZE draft ZIP',
      href: 'https://github.com/zcash/zips/pull/1107',
    },
    {
      title: 'Starknet protocol intro',
      href: 'https://docs.starknet.io/learn/protocol/intro',
    },
    {
      title: 'Stwo/Cairo proof stack',
      href: 'https://github.com/starkware-libs/stwo-cairo',
    },
    {
      title: 'Madara sequencer',
      href: 'https://github.com/madara-alliance/madara',
    },
  ];

  return (
    <section className="section-padding px-8 bg-[rgba(6,6,8,0.75)]" id="resources">
      <div className="max-w-container mx-auto">
        <div className="mb-12">
          <p className="eyebrow">Deep dive</p>
          <h2 className="text-[clamp(2rem,4vw,2.8rem)] leading-[1.2] font-bold tracking-tight">
            Resources & references
          </h2>
        </div>

        <div className="flex flex-wrap gap-5">
          {resources.map((resource, index) => (
            <Link
              key={resource.href}
              href={resource.href}
              target="_blank"
              rel="noreferrer"
              className="reveal-on-scroll px-4 py-3.5 rounded-full border border-[rgba(255,137,70,0.4)] bg-[rgba(12,12,16,0.8)] font-mono text-xs tracking-[0.12em] uppercase text-[rgba(255,137,70,0.76)] transition-all duration-[250ms] hover:-translate-y-1 hover:border-[var(--accent)]"
              style={{ '--reveal-delay': `${index * 40}ms` } as React.CSSProperties}
            >
              {resource.title}
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
