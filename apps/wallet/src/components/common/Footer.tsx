import Image from 'next/image';
import Link from 'next/link';

export function Footer() {
  return (
    <footer className="relative bg-[#E96B2D] overflow-hidden">
      {/* ASCII Art Background */}
      <div className="absolute inset-0 w-full h-full flex items-center justify-center overflow-hidden">
        <Image
          src="/ascii-art.png"
          alt=""
          width={960}
          height={536}
          className="opacity-60 pointer-events-none"
          aria-hidden="true"
        />
      </div>

      {/* Main Container */}
      <div className="relative z-10 max-w-container mx-auto">
        <div className="flex">
          {/* Footer Logo (Z icon) on the left */}
          <div className="shrink-0">
            <Image
              src="/footer-logo.svg"
              alt=""
              width={180}
              height={180}
              className="pointer-events-none"
              aria-hidden="true"
            />
          </div>

          {/* Content */}
          <div className="flex flex-col justify-between py-6 pl-8">
            {/* CTA Button */}
            <Link
              href="https://ztarknet.cash"
              className="inline-flex items-center justify-center px-5 py-4 bg-white rounded-full text-[#0B0A18] font-semibold text-base hover:bg-white/90 transition-colors w-fit"
            >
              Back to Homepage
            </Link>

            {/* Copyright */}
            <p className="text-[#0B0A18] text-xs font-medium leading-6">
              Copyright — Starkware 2025
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
