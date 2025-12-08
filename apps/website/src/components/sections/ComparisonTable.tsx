'use client'

import { Tab, TabGroup, TabList, TabPanel, TabPanels } from '@headlessui/react'
import { CheckIcon, XMarkIcon } from '@heroicons/react/20/solid'
import { clsx } from 'clsx'

const tiers = [
  {
    name: 'Soft Compute',
    id: 'soft',
    description: 'The status quo. Permissioned.',
    featured: false,
  },
  {
    name: 'Hard Compute',
    id: 'hard',
    description: 'The future. Sovereign.',
    featured: true,
  },
]

const features = [
  { name: "The Admin", soft: "A CEO or a Foundation", hard: "Math (STARK Proofs)" },
  { name: "The Guarantee", soft: "\"Trust us, we won't ban you\"", hard: "\"We can't ban you\"" },
  { name: "The Role", soft: "You are a Tenant", hard: "You are an Owner" },
  { name: "The Asset", soft: "Wrapped ZEC (An IOU)", hard: "Bridged ZEC (Enforced)" },
  { name: "The Vibe", soft: "Corporate, Fast, Shiny", hard: "Industrial, Permanent, Heavy" },
  { name: "The User", soft: "Mercenary (Yield Farmer)", hard: "Missionary (Privacy Sovereign)" },
];

function classNames(...classes: (string | undefined | null | false)[]) {
  return classes.filter(Boolean).join(' ')
}

export function ComparisonTable() {
  return (
    <div className="font-mono text-sm sm:text-base">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        
        {/* Mobile View (Tabs) */}
        <TabGroup className="sm:hidden">
          <TabList className="flex gap-4 p-1 rounded-xl bg-white/5 border border-[#e96b2d]/30 border-dashed">
            {tiers.map((tier) => (
              <Tab
                key={tier.name}
                className={({ selected }) =>
                  classNames(
                    'w-full rounded-lg py-2.5 text-sm font-bold leading-5 transition-all outline-none',
                    selected
                      ? 'bg-[#e96b2d] text-white shadow-sm'
                      : 'text-gray-400 hover:bg-white/[0.12] hover:text-white'
                  )
                }
              >
                {tier.name}
              </Tab>
            ))}
          </TabList>
          <TabPanels className="mt-6">
            {tiers.map((tier) => (
              <TabPanel
                key={tier.name}
                className={classNames(
                  'rounded-xl bg-white/5 p-6 border border-[#e96b2d]/30 border-dashed relative overflow-hidden',
                  tier.featured ? 'border-[#e96b2d]/50 bg-[#e96b2d]/5' : ''
                )}
              >
                 <div className="flex flex-col gap-2 mb-8">
                    <h3 className={classNames("text-xl font-bold uppercase tracking-wider", tier.featured ? "text-[#e96b2d]" : "text-white/70")}>
                        {tier.name}
                    </h3>
                    <p className="text-sm text-gray-400 font-medium border-l-2 border-dashed border-[#e96b2d]/30 pl-3">
                        {tier.description}
                    </p>
                 </div>
                 
                 <dl className="space-y-6">
                    {features.map((feature) => (
                        <div key={feature.name} className="relative">
                            <dt className="text-[10px] uppercase tracking-[0.2em] text-gray-500 mb-1 font-bold">
                                {feature.name}
                            </dt>
                            <dd className={classNames(
                                "text-base p-3 rounded bg-black/20 border border-dashed border-[#e96b2d]/30 flex items-start gap-3",
                                tier.featured ? "text-white" : "text-gray-400"
                            )}>
                                {!tier.featured && <XMarkIcon className="h-5 w-5 text-[#e96b2d] shrink-0" aria-hidden="true" />}
                                <span>{feature[tier.id as keyof typeof feature]}</span>
                            </dd>
                        </div>
                    ))}
                 </dl>
              </TabPanel>
            ))}
          </TabPanels>
        </TabGroup>

        {/* Desktop View (Table) */}
        <div className="hidden sm:block">
            <div className="relative overflow-hidden rounded-2xl bg-black/20 border border-[#e96b2d]/30 border-dashed backdrop-blur-sm">
                 <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="border-b border-dashed border-[#e96b2d]/30">
                            <th className="p-6 w-1/4 bg-white/5 text-xs uppercase tracking-widest text-gray-500 font-medium">Feature</th>
                            {tiers.map((tier) => (
                                <th key={tier.name} className={classNames(
                                    "p-6 text-left w-[37.5%]",
                                    tier.featured ? "bg-[#e96b2d]/10" : "bg-white/[0.02]"
                                )}>
                                    <div className="flex flex-col gap-1">
                                        <div className={classNames(
                                            "text-lg font-bold uppercase tracking-wide", 
                                            tier.featured ? "text-[#e96b2d]" : "text-gray-400"
                                        )}>
                                            {tier.name}
                                        </div>
                                        <div className="text-xs font-normal text-gray-500 font-sans">
                                            {tier.description}
                                        </div>
                                    </div>
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-dashed divide-[#e96b2d]/30">
                        {features.map((feature) => (
                            <tr key={feature.name} className="group hover:bg-white/[0.02] transition-colors">
                                <th scope="row" className="p-6 text-xs font-bold uppercase tracking-wider text-gray-500 bg-white/[0.02]">
                                    {feature.name}
                                </th>
                                
                                {/* Soft Compute Cell */}
                                <td className="p-6 text-sm text-gray-400 border-r border-dashed border-[#e96b2d]/30 group-hover:bg-red-500/5 transition-colors duration-300">
                                    <div className="flex items-start gap-3 opacity-80">
                                        <XMarkIcon className="h-5 w-5 text-[#e96b2d] shrink-0" aria-hidden="true" />
                                        <span>
                                            {feature.soft}
                                        </span>
                                    </div>
                                </td>

                                {/* Hard Compute Cell */}
                                <td className="p-6 text-sm font-bold text-white bg-[#e96b2d]/5 group-hover:bg-[#e96b2d]/10 transition-colors duration-300 relative overflow-hidden">
                                    <div className="flex items-start gap-3 relative z-10">
                                        <CheckIcon className="h-5 w-5 text-[#e96b2d] shrink-0" aria-hidden="true" />
                                        <span>
                                            {feature.hard}
                                        </span>
                                    </div>
                                    {/* Subtle highlight effect */}
                                    <div className="absolute inset-0 bg-gradient-to-r from-[#e96b2d]/0 via-[#e96b2d]/5 to-[#e96b2d]/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 translate-x-[-100%] group-hover:translate-x-[100%] transform" />
                                </td>
                            </tr>
                        ))}
                    </tbody>
                 </table>
            </div>
        </div>
      </div>
    </div>
  )
}
