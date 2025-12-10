'use client'

import { Tab, TabGroup, TabList, TabPanel, TabPanels } from '@headlessui/react'
import { PixelCheckIcon } from '@/components/icons/PixelCheckIcon'
import { PixelCrossIcon } from '@/components/icons/PixelCrossIcon'

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
      <div className="mx-auto max-w-7xl px-0 sm:px-6 lg:px-8">
        
        {/* Mobile View (Tabs) */}
        <TabGroup className="sm:hidden">
          <TabList className="flex gap-4 p-1 bg-white/5 border border-[#e96b2d]/30 mx-4 sm:mx-0">
            {tiers.map((tier) => (
              <Tab
                key={tier.name}
                className={({ selected }) =>
                  classNames(
                    'w-full py-2.5 text-sm font-bold leading-5 transition-all outline-none',
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
          <TabPanels className="mt-6 mx-0 sm:mx-0">
            {tiers.map((tier) => (
              <TabPanel
                key={tier.name}
                className={classNames(
                  'bg-white/5 p-4 sm:p-6 border-y border-[#e96b2d]/30 sm:border relative overflow-hidden',
                  tier.featured ? 'border-[#e96b2d]/50 bg-[#e96b2d]/5' : ''
                )}
              >
                 <div className="flex flex-col gap-2 mb-8">
                    <h3 className="text-xl font-bold uppercase tracking-wider text-white">
                        {tier.name}
                    </h3>
                    <p className="text-sm text-gray-400 font-medium border-l-2 border-[#e96b2d]/30 pl-3">
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
                                "text-base p-3 bg-black/20 border border-[#e96b2d]/30 flex items-start gap-3",
                                tier.featured ? "text-white" : "text-gray-400"
                            )}>
                                {tier.featured ? (
                                  <PixelCheckIcon className="text-[#e96b2d] shrink-0" size={20} />
                                ) : (
                                  <PixelCrossIcon className="text-[#e96b2d] shrink-0" size={20} />
                                )}
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
            <div className="relative overflow-hidden bg-black/20 backdrop-blur-sm">
                 <table className="w-full text-left border-collapse">
                    <thead>
                        <tr>
                            <th className="p-6 w-1/4 bg-transparent"></th>
                            {tiers.map((tier) => (
                                <th key={tier.name} className={classNames(
                                    "p-6 text-left w-[37.5%] border border-[#e96b2d]/30",
                                    tier.featured ? "bg-[#e96b2d]/10" : "bg-white/[0.02]"
                                )}>
                                    <div className="flex flex-col gap-1">
                                        <div className="text-lg font-bold uppercase tracking-wide text-white">
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
                    <tbody>
                        {features.map((feature, index) => (
                            <tr key={feature.name} className="group hover:bg-white/[0.02] transition-colors">
                                <th scope="row" className={classNames(
                                    "p-6 text-xs font-bold uppercase tracking-wider text-gray-500 bg-white/[0.02] border-l border-r border-b border-[#e96b2d]/30",
                                    index === 0 ? "border-t" : ""
                                )}>
                                    {feature.name}
                                </th>
                                
                                {/* Soft Compute Cell */}
                                <td className="p-6 text-sm text-gray-400 border-x border-b border-[#e96b2d]/30 group-hover:bg-red-500/5 transition-colors duration-300">
                                    <div className="flex items-start gap-3 opacity-80">
                                        <PixelCrossIcon className="text-[#e96b2d] shrink-0" size={20} />
                                        <span>
                                            {feature.soft}
                                        </span>
                                    </div>
                                </td>

                                {/* Hard Compute Cell */}
                                <td className="p-6 text-sm font-bold text-white bg-[#e96b2d]/5 group-hover:bg-[#e96b2d]/10 transition-colors duration-300 relative overflow-hidden border-l border-r border-b border-[#e96b2d]/30">
                                    <div className="flex items-start gap-3 relative z-10">
                                        <PixelCheckIcon className="text-[#e96b2d] shrink-0" size={20} />
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
