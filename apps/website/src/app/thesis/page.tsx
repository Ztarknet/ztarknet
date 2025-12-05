'use client';

import { Footer } from '@/components/layout/Footer';
import { Header } from '@/components/layout/Header';
import { useRevealOnScroll } from '@/hooks/useRevealOnScroll';
import { useState, useEffect, useRef, useCallback } from 'react';

// Table data
const data = [
  { feature: "The Admin", soft: "A CEO or a Foundation.", hard: "Math. (STARK Proofs)." },
  { feature: "The Guarantee", soft: "\"Trust us, we won't ban you.\"", hard: "\"We can't ban you.\"" },
  { feature: "The Role", soft: "You are a Tenant.", hard: "You are an Owner." },
  { feature: "The Asset", soft: "Wrapped ZEC (An IOU).", hard: "Bridged ZEC (Cryptographically Enforced)." },
  { feature: "The Vibe", soft: "Corporate, Fast, Shiny.", hard: "Industrial, Permanent, Heavy." },
  { feature: "The User", soft: "Mercenary (Yield Farmer).", hard: "Missionary (Privacy Sovereign)." },
];

const headers = { feature: "Feature", soft: "Soft Compute (Solana / AWS)", hard: "Hard Compute (Ztarknet)" };

// Helper functions
const wrapText = (text: string, width: number): string[] => {
  if (width <= 0) return [text];
  const words = text.split(' ');
  const lines: string[] = [];
  let current = '';
  
  for (const word of words) {
    if (current.length === 0) {
      current = word;
    } else if (current.length + 1 + word.length <= width) {
      current += ' ' + word;
    } else {
      lines.push(current);
      current = word;
    }
  }
  if (current) lines.push(current);
  return lines.length ? lines : [''];
};

const pad = (str: string | undefined, width: number): string => {
  const s = str || '';
  return s + ' '.repeat(Math.max(0, width - s.length));
};

const separator = (widths: number[]): string => {
  return '+' + widths.map(w => '-'.repeat(w + 2)).join('+') + '+';
};

const renderRow = (cols: string[], widths: number[]): string[] => {
  const wrapped = cols.map((c, i) => wrapText(c, widths[i] ?? 10));
  const maxLines = Math.max(...wrapped.map(w => w.length));
  const lines: string[] = [];
  
  for (let i = 0; i < maxLines; i++) {
    const row = wrapped.map((w, j) => ' ' + pad(w[i] || '', widths[j] ?? 10) + ' ');
    lines.push('|' + row.join('|') + '|');
  }
  return lines;
};

// Card component for mobile view
interface AsciiCardProps {
  row: { feature: string; soft: string; hard: string };
  charWidth: number;
}

function AsciiCard({ row, charWidth }: AsciiCardProps) {
  const innerWidth = charWidth - 4;
  const sep = '+' + '-'.repeat(charWidth - 2) + '+';
  
  const titleLines = wrapText(row.feature, innerWidth);
  const softLabel = wrapText('Soft Compute:', innerWidth);
  const softValue = wrapText(row.soft, innerWidth);
  const hardLabel = wrapText('Hard Compute:', innerWidth);
  const hardValue = wrapText(row.hard, innerWidth);
  
  const allLines: { content: string; isSep: boolean; isTitle: boolean; isLabel: boolean }[] = [
    { content: sep, isSep: true, isTitle: false, isLabel: false },
    ...titleLines.map(l => ({ content: pad(l, innerWidth), isSep: false, isTitle: true, isLabel: false })),
    { content: sep, isSep: true, isTitle: false, isLabel: false },
    ...softLabel.map(l => ({ content: pad(l, innerWidth), isSep: false, isTitle: false, isLabel: true })),
    ...softValue.map(l => ({ content: pad(l, innerWidth), isSep: false, isTitle: false, isLabel: false })),
    { content: '+' + '-'.repeat(charWidth - 2) + '+', isSep: true, isTitle: false, isLabel: false },
    ...hardLabel.map(l => ({ content: pad(l, innerWidth), isSep: false, isTitle: false, isLabel: true })),
    ...hardValue.map(l => ({ content: pad(l, innerWidth), isSep: false, isTitle: false, isLabel: false })),
    { content: sep, isSep: true, isTitle: false, isLabel: false },
  ];
  
  return (
    <div className="mb-4">
      {allLines.map((line, i) => (
        <div key={i}>
          {line.isSep ? (
            <span className="text-[#e96b2d]/40">{line.content}</span>
          ) : (
            <>
              <span className="text-[#e96b2d]/40">| </span>
              <span className={line.isTitle ? 'text-white font-bold' : line.isLabel ? 'text-[#e96b2d]/50' : 'text-[#e96b2d]'}>
                {line.content}
              </span>
              <span className="text-[#e96b2d]/40"> |</span>
            </>
          )}
        </div>
      ))}
    </div>
  );
}

// Main ASCII Table component
function ResponsiveAsciiTable() {
  const containerRef = useRef<HTMLDivElement>(null);
  const measureRef = useRef<HTMLSpanElement>(null);
  const [charWidth, setCharWidth] = useState(80);
  const [isCard, setIsCard] = useState(false);
  
  const measure = useCallback(() => {
    if (!containerRef.current || !measureRef.current) return;
    const containerPx = containerRef.current.offsetWidth - 32;
    const charPx = measureRef.current.offsetWidth / 10;
    const chars = Math.floor(containerPx / charPx);
    setCharWidth(chars);
    setIsCard(chars < 70);
  }, []);
  
  useEffect(() => {
    measure();
    const ro = new ResizeObserver(measure);
    if (containerRef.current) ro.observe(containerRef.current);
    return () => ro.disconnect();
  }, [measure]);
  
  const getColumnWidths = (): number[] => {
    const overhead = 10;
    const available = charWidth - overhead;
    const col1 = Math.max(8, Math.floor(available * 0.18));
    const col2 = Math.max(10, Math.floor(available * 0.41));
    const col3 = Math.max(10, available - col1 - col2);
    return [col1, col2, col3];
  };
  
  const widths = getColumnWidths();
  
  const renderTable = () => {
    const lines: { text: string; isHeader: boolean; isSeparator: boolean }[] = [];
    lines.push({ text: separator(widths), isHeader: false, isSeparator: true });
    renderRow([headers.feature, headers.soft, headers.hard], widths).forEach(l => 
      lines.push({ text: l, isHeader: true, isSeparator: false })
    );
    lines.push({ text: separator(widths), isHeader: false, isSeparator: true });
    
    data.forEach((row) => {
      renderRow([row.feature, row.soft, row.hard], widths).forEach(l => 
        lines.push({ text: l, isHeader: false, isSeparator: false })
      );
      lines.push({ text: separator(widths), isHeader: false, isSeparator: true });
    });
    
    return lines.map((line, i) => {
      if (line.isSeparator) {
        return <div key={i} className="text-[#e96b2d]/40">{line.text}</div>;
      }
      
      // Split by | to style pipes separately
      const parts = line.text.split('|');
      return (
        <div key={i}>
          {parts.map((part, j) => (
            <span key={j}>
              {j > 0 && <span className="text-[#e96b2d]/40">|</span>}
              <span className={line.isHeader ? 'text-[#e96b2d] font-bold' : j === 1 ? 'text-white' : 'text-[#e96b2d]'}>
                {part}
              </span>
            </span>
          ))}
        </div>
      );
    });
  };
  
  const renderCards = () => {
    const cardWidth = Math.max(20, charWidth);
    return (
      <>
        {data.map((row, i) => (
          <AsciiCard key={i} row={row} charWidth={cardWidth} />
        ))}
      </>
    );
  };
  
  return (
    <div ref={containerRef} className="w-full flex justify-center">
      <span 
        ref={measureRef} 
        className="absolute opacity-0 pointer-events-none whitespace-pre font-mono text-sm"
      >
        0123456789
      </span>
      
      <div className="whitespace-pre leading-relaxed font-mono text-sm">
        {isCard ? renderCards() : renderTable()}
      </div>
    </div>
  );
}

export default function ThesisPage(): React.ReactElement {
  useRevealOnScroll();

  return (
    <>
      <Header />
      <main>
        {/* Hero Section with Video Background */}
        <section className="relative h-screen max-h-[1100px] xl:max-h-auto overflow-hidden" id="top">
          {/* Video background */}
          <video
            autoPlay
            loop
            muted
            playsInline
            className="absolute inset-0 w-full h-full object-cover z-0 opacity-40"
          >
            <source src="/hero.mp4" type="video/mp4" />
          </video>

          {/* Content */}
          <div className="relative z-10 h-full max-w-container mx-auto px-4 lg:px-0 pt-[74px] lg:pt-[108px] flex items-center">
            <div className="flex flex-col gap-6 md:gap-10 max-w-4xl">
              {/* Main headline */}
              <h1 className="text-5xl md:text-7xl lg:text-[84px] font-black tracking-tight text-white leading-none">
                Thesis
              </h1>

              {/* Manifesto Text */}
              <div className="space-y-6">
                <p className="text-lg md:text-xl italic text-[#e96b2d] leading-[1.6]">
                  Civilization advances by replacing trust with truth.
                </p>
                <p className="text-lg md:text-xl italic text-[#e96b2d] leading-[1.6]">
                  The current internet is soft. It relies on the permission of strangers. You are a
                  tenant in their database. If the landlord changes the locks, you are evicted.
                </p>
                <p className="text-lg md:text-xl italic text-[#e96b2d] leading-[1.6]">
                  Ztarknet is hard. It relies on the laws of mathematics. It does not care who you
                  are. It only cares about your proof. You are not a user. You are an owner.
                </p>
                <p className="text-lg md:text-xl italic font-semibold text-white leading-[1.6]">
                  The shift is inevitable.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Comparison Table Section */}
        <section className="relative py-16 md:py-24">
          <div className="max-w-5xl mx-auto px-4">
            <ResponsiveAsciiTable />
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
                title="Ztarknet Thesis Video"
              />
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
