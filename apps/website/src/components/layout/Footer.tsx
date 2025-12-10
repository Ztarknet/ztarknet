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
      <div className="relative z-10 max-w-container mx-auto px-0 sm:px-4 lg:px-0">
        {/* Horizontal layout with 1/3 logo and 2/3 content on mobile */}
        <div className="grid grid-cols-3 items-stretch gap-4 md:flex md:flex-row md:items-center">
          {/* Footer Logo (Z icon) */}
          <div className="shrink-0 col-span-1 flex justify-center md:w-auto md:justify-start">
            <Image
              src="/footer-logo.svg"
              alt=""
              width={180}
              height={180}
              className="pointer-events-none w-auto h-full max-h-[220px] md:w-[180px] md:h-[300px]"
              aria-hidden="true"
            />
          </div>

          {/* Content */}
          <div className="col-span-2 flex flex-col items-start justify-center md:justify-between py-4 md:py-6 md:pl-8 gap-2 md:gap-3">
            {/* CTA Button */}
            <Link
              href="https://github.com/ztarknet/quickstart"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center justify-center px-5 py-3 md:py-4 bg-white rounded-full text-[#0B0A18] font-semibold text-sm md:text-base hover:bg-white/90 transition-colors w-fit"
            >
              Launch the Engine
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
