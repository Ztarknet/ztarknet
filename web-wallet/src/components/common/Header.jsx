import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [hoveredIndex, setHoveredIndex] = useState(null);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 100);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Landing', href: 'https://ztarknet.cash', external: true },
    { name: 'Zcash Explorer', href: 'https://explorer.ztarknet.cash/', external: true },
    { name: 'Ztarknet Explorer', href: 'https://explorer-zstarknet.d.karnot.xyz/', external: true },
    { name: 'Faucet', href: 'https://faucet.ztarknet.cash', external: true },
  ];

  const handleLinkClick = () => {
    setIsMenuOpen(false);
  };

  return (
    <header className="fixed top-0 left-0 right-0 pt-3 px-8 z-[100] shrink-0">
      {/* Desktop Navigation */}
      <motion.nav
        className={`flex items-center justify-between max-w-container mx-auto backdrop-blur-[20px] bg-black/90 border rounded-full shadow-[0_0_24px_rgba(255,107,26,0.1)] transition-[border-color] duration-300 hover:border-[rgba(255,107,26,0.4)] ${
          isScrolled
            ? 'py-2 px-5 border-[rgba(255,107,26,0.2)]'
            : 'py-2.5 px-7 border-[rgba(255,107,26,0.2)]'
        }`}
        animate={{
          width: isScrolled ? '55%' : '100%',
          minWidth: isScrolled ? 'min(100%,700px)' : '0px',
          y: isScrolled ? 20 : 0,
        }}
        transition={{
          type: 'spring',
          stiffness: 200,
          damping: 50,
        }}
      >
        {/* Logo / Brand */}
        <a
          href="#top"
          className={`inline-flex items-center font-bold tracking-widest uppercase text-sm transition-all duration-300 ${
            isScrolled ? 'gap-2.5 text-[0.85rem]' : 'gap-3'
          }`}
        >
          <img
            src="/ztarknet-logo.png"
            alt="Ztarknet logo"
            className={`drop-shadow-[0_0_10px_rgba(255,107,26,0.5)] transition-all duration-300 ${
              isScrolled ? 'w-9 h-9' : 'w-10 h-10'
            }`}
          />
          <span>Ztarknet Wallet</span>
        </a>

        {/* Navigation Links - Desktop */}
        <div
          className={`hidden md:flex flex-1 justify-start transition-all duration-300 ${
            isScrolled ? 'gap-0.5 ml-4' : 'gap-2 ml-8'
          }`}
          onMouseLeave={() => setHoveredIndex(null)}
        >
          {navLinks.map((link, idx) => (
            <a
              key={idx}
              href={link.href}
              className={`relative inline-flex items-center justify-center rounded-full text-sm font-medium text-muted hover:text-foreground transition-all duration-200 border border-transparent ${
                isScrolled ? 'py-1.5 px-3 text-[0.85rem]' : 'py-2 px-4'
              }`}
              target={link.external ? '_blank' : undefined}
              rel={link.external ? 'noreferrer' : undefined}
              onMouseEnter={() => setHoveredIndex(idx)}
            >
              {hoveredIndex === idx && (
                <motion.div
                  layoutId="hovered"
                  className="absolute inset-0 bg-[rgba(255,107,26,0.15)] rounded-full z-[-1]"
                  transition={{
                    type: 'spring',
                    stiffness: 380,
                    damping: 30,
                  }}
                />
              )}
              <span className="relative z-[1]">{link.name}</span>
            </a>
          ))}
        </div>

        {/* Action Buttons */}
        <div className={`hidden md:flex gap-3 ${isScrolled ? 'gap-3' : ''}`}>
          <a
            className={`inline-flex items-center justify-center gap-2.5 rounded-full font-semibold tracking-wide border transition-all duration-200 cursor-pointer border-[rgba(255,107,26,0.3)] text-foreground hover:border-accent hover:-translate-y-0.5 ${
              isScrolled ? 'py-2 px-3.5 text-[0.85rem]' : 'py-2.5 px-5 text-sm'
            }`}
            href="https://github.com/AbdelStark/ztarknet"
            target="_blank"
            rel="noreferrer"
          >
            <svg className="mr-1.5" viewBox="0 0 24 24" width="16" height="16" fill="currentColor">
              <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
            </svg>
            GitHub
          </a>
        </div>

        {/* Mobile Menu Toggle */}
        <button
          className="hidden max-md:block bg-transparent border-0 text-foreground cursor-pointer p-2 transition-colors duration-200 hover:text-accent"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          aria-label={isMenuOpen ? 'Close menu' : 'Open menu'}
        >
          {isMenuOpen ? (
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          ) : (
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="3" y1="12" x2="21" y2="12"></line>
              <line x1="3" y1="6" x2="21" y2="6"></line>
              <line x1="3" y1="18" x2="21" y2="18"></line>
            </svg>
          )}
        </button>
      </motion.nav>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            className="hidden max-md:block fixed top-[90px] left-0 right-0 bg-black/95 backdrop-blur-[20px] border-b border-[rgba(255,107,26,0.2)] z-[99] py-6 px-8"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
          >
            <div className="max-w-container mx-auto flex flex-col gap-4">
              {navLinks.map((link, idx) => (
                <a
                  key={idx}
                  href={link.href}
                  className="py-3 px-4 text-lg font-medium text-muted transition-all duration-200 border-b border-[rgba(255,107,26,0.1)] hover:text-foreground hover:border-[rgba(255,107,26,0.3)] hover:translate-x-1"
                  onClick={handleLinkClick}
                  target={link.external ? '_blank' : undefined}
                  rel={link.external ? 'noreferrer' : undefined}
                >
                  {link.name}
                </a>
              ))}
              <a
                className="mt-2 w-full inline-flex items-center justify-center gap-2.5 rounded-full text-sm font-semibold tracking-wide py-2.5 px-5 border transition-all duration-200 cursor-pointer border-[rgba(255,107,26,0.3)] text-foreground hover:border-accent hover:-translate-y-0.5"
                href="https://github.com/AbdelStark/ztarknet"
                target="_blank"
                rel="noreferrer"
                onClick={handleLinkClick}
              >
                <svg className="mr-1.5" viewBox="0 0 24 24" width="16" height="16" fill="currentColor">
                  <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                </svg>
                GitHub
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
