'use client';

import { Footer } from '@/components/layout/Footer';
import { Header } from '@/components/layout/Header';
import { PixelIcon } from '@/components/icons/PixelIcon';
import { useRevealOnScroll } from '@/hooks/useRevealOnScroll';
import Image from 'next/image';

// Feature data for the architecture sections
const features = [
  {
    title: 'The Bridge (The TZE)',
    icon: '/ascii-circle.png',
    link: 'https://github.com/zcash/zips/pull/1107',
    items: [
      {
        label: 'The Mechanism:',
        text: 'A "Transparent Zcash Extension" (TZE). Think of it as a portal in the Zcash code that lets it read STARK proofs.',
        starkLink: 'https://starkware.co/stark/',
      },
      {
        label: 'The Guarantee:',
        text: 'It is not a multisig. It is a Consensus Rule. If the L2 tries to steal funds, the L1 math rejects the block.',
      },
    ],
    position: 'left',
  },
  {
    title: 'The Eyes (Zoro)',
    icon: '/ascii-cube.png',
    link: 'https://forum.zcashcommunity.com/t/zoro-a-stark-proven-zcash-light-client-in-cairo/53220',
    items: [
      {
        label: 'What it is:',
        text: 'A "Light Client" that verifies Zcash.',
      },
      {
        label: 'The Magic:',
        text: 'It shrinks the entire history of Zcash (gigabytes) into a 50KB receipt. This lets mobile phones and the L2 verify Zcash state without trusting a server.',
      },
    ],
    position: 'right',
  },
  {
    title: 'The Infrastructure (Karnot)',
    icon: '/ascii-diamond.png',
    link: 'https://x.com/karnotxyz',
    items: [
      {
        label: 'Who they are:',
        text: 'The engine room. The team keeping the lights on.',
      },
      {
        label: 'What they provide:',
        text: 'The physics for the math. RPC nodes. Explorers. Invisible rails.',
      },
    ],
    position: 'left',
  },
  {
    title: 'The Interface (Session Keys)',
    icon: '/ascii-cylinder.png',
    link: 'https://hackmd.io/@m-kus/BJTINvjk-g',
    items: [
      {
        label: 'The Bottleneck:',
        text: 'Zcash wallets cannot sign game moves yet. Manual signing kills the speed.',
      },
      {
        label: 'The Fix:',
        text: 'A temporary browser key. It signs interactions automatically. You approve once. You play infinitely. Web 2 UX.',
      },
    ],
    position: 'right',
  },
  {
    title: 'The Stack',
    icon: '/ascii-cone.png',
    readMoreLink: 'https://x.com/starkience/status/1993612235302723920',
    items: [
      { label: 'Sequencer:', text: 'Madara (Rust-based Starknet Client).', link: 'https://github.com/madara-alliance/madara' },
      { label: 'Prover:', text: 'Stwo (Circle-STARKs).', link: 'https://github.com/starkware-libs/stwo-cairo' },
      { label: 'L1 Node:', text: 'Zebra (Zcash Node with TZE fork).', link: 'https://github.com/AbdelStark/zebra' },
      { label: 'Explorer:', text: 'Cosmos (Open-source Starknet explorer).', link: 'https://github.com/justmert/cosmos' },
    ],
    position: 'left',
  },
];

// Flow diagram steps
const flowSteps = [
  { type: 'box', label: 'User Transaction', thick: true },
  { type: 'arrow' },
  { type: 'diamond', label: 'Madara\nSequencer' },
  { type: 'arrow-long', sublabel: 'Generate Trace' },
  { type: 'box', label: 'Generate Trace', thick: false },
  { type: 'arrow' },
  { type: 'diamond', label: 'Stwo\nProver' },
  { type: 'arrow-long', sublabel: 'Proving' },
  { type: 'box', label: 'Generate ZK Proof', thick: false },
  { type: 'arrow' },
  { type: 'diamond', label: 'Zebra\nL1 Node' },
  { type: 'arrow-long', sublabel: 'Verification' },
  { type: 'box', label: 'TZE Verifier', thick: false },
  { type: 'arrow' },
  { type: 'box', label: 'L1 Anchor\nState Updated', thick: true },
];

export default function ArchitecturePage(): React.ReactElement {
  useRevealOnScroll();

  return (
    <>
      <Header />
      <main>
        {/* Hero Section with Video Background - Same as Home Hero */}
        <section className="relative h-screen max-h-[1100px] xl:max-h-auto overflow-hidden" id="top">
          {/* Video background */}
          <video
            autoPlay
            loop
            muted
            playsInline
            className="absolute inset-0 w-full h-full object-cover z-0 opacity-40"
          >
            <source src="/background-2.mp4" type="video/mp4" />
          </video>

          {/* Content - padding-top = spacing above header (12px/24px) + header (~50px/60px) + same spacing below */}
          <div className="relative z-10 h-full max-w-container mx-auto px-4 lg:px-0 pt-[74px] lg:pt-[108px] flex items-center">
            <div className="flex flex-col gap-6 md:gap-10">
              {/* Main headline */}
              <h1 className="text-4xl md:text-6xl lg:text-7xl leading-[1.05] font-black tracking-tight">
                <span className="text-white">System </span>
                <span className="text-[#e96b2d]">Architecture.</span>
              </h1>

              {/* Subtitle */}
              <div className="max-w-4xl space-y-4 text-lg md:text-xl leading-relaxed text-white/90">
                <p>
                  Architecture is not about what you build. It is about what you remove.
                </p>
                <p>
                  Most scaling solutions are just digital banks run by committees. They call it a
                  bridge, it is a multisig. They trade the certainty of code for the whims of signers.
                </p>
                <p>
                  Ztarknet optimizes the human out of the loop. There are no admins, no federations,
                  and no "honest majority" assumptions.
                </p>
                <p>
                  There is only a Transparent Zcash Extension (TZE) enforced by consensus. The system
                  does not ask for permission. It asks for a proof.
                </p>
                <p className="text-white font-medium">The only authority here is mathematics.</p>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="relative py-16 lg:py-24">
          <div className="max-w-container mx-auto px-4 lg:px-0">
            <div className="space-y-24">
              {features.map((feature, index) => (
                <div
                  key={feature.title}
                  className={`flex flex-col ${
                    feature.position === 'right' ? 'lg:flex-row-reverse' : 'lg:flex-row'
                  } items-start gap-8 lg:gap-16`}
                >
                  {/* Image Icon */}
                  <div className="w-[150px] h-[150px] lg:w-[233px] lg:h-[233px] rounded-[20px] border border-[rgba(233,107,45,0.3)] overflow-hidden flex-shrink-0 relative">
                    <Image
                      src={`/${index + 1}.png`}
                      alt={feature.title}
                      fill
                      className="object-cover"
                    />
                  </div>

                  {/* Content */}
                  <div className="flex-1">
                    <h2 className="text-3xl md:text-4xl lg:text-[50px] font-bold text-[#e96b2d] mb-6 leading-tight">
                      {feature.title}
                    </h2>
                    <ul className="space-y-4">
                      {feature.items.map((item: { label: string; text: string; link?: string; starkLink?: string }) => (
                        <li key={item.label} className="text-white text-base lg:text-[16px] leading-[1.4]">
                          <span className="font-bold">{item.label}</span>{' '}
                          {item.link ? (
                            <a
                              href={item.link}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="hover:text-[#e96b2d] transition-colors underline underline-offset-2"
                            >
                              {item.text}
                            </a>
                          ) : item.starkLink ? (
                            <span>
                              A "Transparent Zcash Extension" (TZE). Think of it as a portal in the Zcash code that lets it read{' '}
                              <a
                                href={item.starkLink}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-[#e96b2d] hover:text-white transition-colors underline underline-offset-2"
                              >
                                STARK proofs
                              </a>
                              .
                            </span>
                          ) : (
                            <span>{item.text}</span>
                          )}
                        </li>
                      ))}
                    </ul>
                    {/* Links under the text */}
                    {feature.link && (
                      <a
                        href={feature.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 mt-6 text-[#e96b2d] hover:text-white transition-colors underline underline-offset-2"
                      >
                        Learn more
                        <PixelIcon size={12} />
                      </a>
                    )}
                    {feature.readMoreLink && (
                      <a
                        href={feature.readMoreLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 mt-6 text-[#e96b2d] hover:text-white transition-colors underline underline-offset-2"
                      >
                        Read more
                        <PixelIcon size={12} />
                      </a>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Docker Command Section - with video background like home Architecture */}
        <section className="relative py-10 lg:py-12">
          <div className="max-w-container mx-auto px-4 lg:px-0">
            <div className="relative border border-[#e96b2d] rounded-2xl overflow-hidden">
              {/* Video Background */}
              <video
                autoPlay
                loop
                muted
                playsInline
                className="absolute inset-0 w-full h-full object-cover opacity-30"
              >
                <source src="/background-2.mp4" type="video/mp4" />
              </video>

              {/* Content - Code style */}
              <div className="relative z-10 px-4 py-6 md:px-8 md:py-8 flex items-center justify-center gap-3 md:gap-4">
                {/* Code */}
                <code className="text-[#e96b2d] font-mono text-sm md:text-lg lg:text-xl leading-[1.4] break-all md:break-normal">
                  docker compose -f docker-compose.devnet.yml up
                </code>

                {/* Copy button - inline right */}
                <button
                  type="button"
                  onClick={() => {
                    navigator.clipboard.writeText('docker compose -f docker-compose.devnet.yml up');
                  }}
                  className="flex-shrink-0 p-2 bg-black/40 hover:bg-[#e96b2d] rounded-lg text-[#e96b2d] hover:text-white transition-colors"
                  title="Copy to clipboard"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect width="14" height="14" x="8" y="8" rx="2" ry="2"/>
                    <path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"/>
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* Flow Diagram Section - Cleaner Design */}
        <section className="relative py-16 lg:py-24">
          <div className="max-w-container mx-auto px-4 lg:px-0">
            <div className="flex flex-col items-center">
              {/* User Transaction - Start */}
              <div className="relative">
                <div className="border-2 border-[#e96b2d] bg-[#e96b2d]/10 backdrop-blur px-6 py-4 md:px-8 md:py-6 min-w-[240px] md:min-w-[350px] rounded-lg">
                  <p className="text-white font-bold text-sm md:text-lg text-center">User Transaction</p>
                </div>
              </div>

              {/* Connector */}
              <div className="w-px h-12 bg-gradient-to-b from-[#e96b2d] to-[#e96b2d]/50" />

              {/* Madara Sequencer */}
              <div className="relative flex items-center gap-6">
                <div className="w-[100px] h-[100px] md:w-[140px] md:h-[140px] border-2 border-[#e96b2d] rotate-45 bg-[#0b0a18]" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <p className="text-[#e96b2d] font-bold text-xs md:text-base text-center leading-tight">
                    Madara<br />Sequencer
                  </p>
                </div>
              </div>

              {/* Action Label */}
              <div className="flex flex-col items-center mt-4">
                <div className="w-px h-10 bg-[#e96b2d]/50" />
                <div className="bg-[#e96b2d] px-4 py-2 rounded">
                  <p className="text-white font-semibold text-sm">Generate Trace</p>
                </div>
                <div className="w-px h-10 bg-[#e96b2d]/50" />
              </div>

              {/* Generate Trace Box */}
              <div className="border border-[#e96b2d]/60 px-6 py-4 md:px-8 md:py-5 min-w-[240px] md:min-w-[350px] rounded-lg bg-[#0b0a18]">
                <p className="text-white/80 font-medium text-sm md:text-base text-center">Generate Trace</p>
              </div>

              {/* Connector */}
              <div className="w-px h-12 bg-gradient-to-b from-[#e96b2d]/50 to-[#e96b2d]" />

              {/* Stwo Prover */}
              <div className="relative flex items-center gap-6">
                <div className="w-[100px] h-[100px] md:w-[140px] md:h-[140px] border-2 border-[#e96b2d] rotate-45 bg-[#0b0a18]" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <p className="text-[#e96b2d] font-bold text-xs md:text-base text-center leading-tight">
                    Stwo<br />Prover
                  </p>
                </div>
              </div>

              {/* Action Label */}
              <div className="flex flex-col items-center mt-4">
                <div className="w-px h-10 bg-[#e96b2d]/50" />
                <div className="bg-[#e96b2d] px-4 py-2 rounded">
                  <p className="text-white font-semibold text-sm">Proving</p>
                </div>
                <div className="w-px h-10 bg-[#e96b2d]/50" />
              </div>

              {/* Generate ZK Proof Box */}
              <div className="border border-[#e96b2d]/60 px-6 py-4 md:px-8 md:py-5 min-w-[240px] md:min-w-[350px] rounded-lg bg-[#0b0a18]">
                <p className="text-white/80 font-medium text-sm md:text-base text-center">Generate ZK Proof</p>
              </div>

              {/* Connector */}
              <div className="w-px h-12 bg-gradient-to-b from-[#e96b2d]/50 to-[#e96b2d]" />

              {/* Zebra L1 Node */}
              <div className="relative flex items-center gap-6">
                <div className="w-[100px] h-[100px] md:w-[140px] md:h-[140px] border-2 border-[#e96b2d] rotate-45 bg-[#0b0a18]" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <p className="text-[#e96b2d] font-bold text-xs md:text-base text-center leading-tight">
                    Zebra<br />L1 Node
                  </p>
                </div>
              </div>

              {/* Action Label */}
              <div className="flex flex-col items-center mt-4">
                <div className="w-px h-10 bg-[#e96b2d]/50" />
                <div className="bg-[#e96b2d] px-4 py-2 rounded">
                  <p className="text-white font-semibold text-sm">Verification</p>
                </div>
                <div className="w-px h-10 bg-[#e96b2d]/50" />
              </div>

              {/* TZE Verifier Box */}
              <div className="border border-[#e96b2d]/60 px-6 py-4 md:px-8 md:py-5 min-w-[240px] md:min-w-[350px] rounded-lg bg-[#0b0a18]">
                <p className="text-white/80 font-medium text-sm md:text-base text-center">TZE Verifier</p>
              </div>

              {/* Connector */}
              <div className="w-px h-12 bg-gradient-to-b from-[#e96b2d]/50 to-[#e96b2d]" />

              {/* L1 Anchor - End */}
              <div className="relative">
                <div className="border-2 border-[#e96b2d] bg-[#e96b2d]/10 backdrop-blur px-6 py-4 md:px-8 md:py-6 min-w-[240px] md:min-w-[350px] rounded-lg">
                  <p className="text-white font-bold text-sm md:text-lg text-center">
                    L1 Anchor<br />State Updated
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Video Section - Google Drive Embed */}
        <section className="relative pb-16 md:pb-24">
          <div className="max-w-container mx-auto px-4 lg:px-0">
            <div className="w-full max-w-4xl mx-auto aspect-video rounded-xl overflow-hidden bg-[#0b0a18] border border-[#e96b2d]/20">
              <iframe
                src="https://drive.google.com/file/d/1qnO_oC6b3dvnZEVda1_H53MlF0khPOc3/preview"
                width="100%"
                height="100%"
                allow="autoplay; encrypted-media"
                allowFullScreen
                className="w-full h-full"
                title="Ztarknet Architecture Video"
              />
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}

