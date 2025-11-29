'use client';

import { Button } from '@workspace/ui/components/button';
import { NavBody, NavItems, Navbar } from '@workspace/ui/components/resizable-navbar';
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@workspace/ui/components/sheet';
import { Github, Menu, X } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import React, { useState } from 'react';

export function Header() {
  const [isOpen, setIsOpen] = useState(false);

  const navLinks = [
    { name: 'Thesis', link: '#thesis' },
    { name: 'Architecture', link: '#architecture' },
    { name: 'Stack', link: '#stack' },
    { name: 'Resources', link: '#resources' },
    { name: 'Explorer', link: 'https://explorer.ztarknet.cash' },
  ];

  const handleLinkClick = () => {
    setIsOpen(false);
  };

  return (
    <header className="relative">
      {/* Desktop Resizable Navbar */}
      <Navbar className="fixed top-3 lg:top-6 px-4 lg:px-8 hidden lg:block">
        <NavBody className="border border-[rgba(255,107,26,0.2)] !bg-black/90 backdrop-blur-xl !shadow-[0_0_24px_rgba(255,107,26,0.1)] hover:border-[rgba(255,107,26,0.4)] transition-colors !px-3 !py-2.5 max-w-container">
          {/* Logo */}
          <Link
            href="#top"
            className="relative z-20 inline-flex items-center ml-2"
          >
            <Image src="/logo.svg" alt="Ztarknet logo" width={160} height={28} />
          </Link>

          {/* Navigation Items */}
          <NavItems
            items={navLinks}
            className="!text-[var(--muted)] hover:!text-foreground [&_a]:!text-[var(--muted)] [&_a:hover]:!text-foreground [&_.absolute]:!bg-[rgba(255,107,26,0.15)] [&_.absolute]:!rounded-full mr-2"
          />

          {/* GitHub Button */}
          <div className="relative z-20">
            <Button
              variant="ghost"
              asChild
              className="hover:bg-[rgba(255,107,26,0.1)] hover:text-[var(--accent)]"
            >
              <Link
                href="https://github.com/AbdelStark/ztarknet"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2"
              >
                <Github className="h-4 w-4" />
                GitHub
              </Link>
            </Button>
          </div>
        </NavBody>
      </Navbar>

      {/* Mobile Navigation (Classic with Sheet) */}
      <nav className="lg:hidden flex items-center justify-between px-3 py-2.5 fixed top-3 left-0 right-0 z-[200] bg-black border border-[rgba(255,107,26,0.2)] rounded-full mx-8 backdrop-blur-xl">
        <Link
          href="#top"
          className="inline-flex items-center"
        >
          <Image src="/logo.svg" alt="Ztarknet logo" width={120} height={22} />
        </Link>

        <div className="flex items-center gap-2">
          {/* GitHub Icon Button */}
          <Button
            variant="ghost"
            size="icon"
            asChild
            className="hover:bg-[rgba(255,107,26,0.1)] hover:text-[var(--accent)]"
          >
            <Link href="https://github.com/AbdelStark/ztarknet" target="_blank" rel="noreferrer">
              <Github className="h-5 w-5" />
              <span className="sr-only">GitHub</span>
            </Link>
          </Button>

          {/* Menu Trigger */}
          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon">
                {isOpen ? (
                  <X className="h-5 w-5 transition-transform duration-300" />
                ) : (
                  <Menu className="h-5 w-5 transition-transform duration-300" />
                )}
                <span className="sr-only">{isOpen ? 'Close menu' : 'Open menu'}</span>
              </Button>
            </SheetTrigger>
            <SheetContent
              side="right"
              className="w-full bg-black border-l-[rgba(255,107,26,0.2)] backdrop-blur-xl pt-20"
            >
              <SheetHeader className="hidden">
                <SheetTitle className="text-left text-foreground flex items-center">
                  <Image src="/logo.svg" alt="Ztarknet logo" width={120} height={22} />
                </SheetTitle>
              </SheetHeader>
              <div className="flex flex-col gap-6 mt-8">
                <nav className="flex flex-col gap-4">
                  {navLinks.map((link) => (
                    <SheetClose asChild key={link.link}>
                      <Link
                        href={link.link}
                        target={link.link.startsWith('http') ? '_blank' : undefined}
                        rel={link.link.startsWith('http') ? 'noreferrer' : undefined}
                        onClick={handleLinkClick}
                        className="text-lg text-[var(--muted)] hover:text-foreground transition-colors py-2 border-b border-[rgba(255,107,26,0.1)] hover:border-[rgba(255,107,26,0.3)]"
                      >
                        {link.name}
                      </Link>
                    </SheetClose>
                  ))}
                </nav>
                <Button variant="primary" asChild className="w-full">
                  <Link
                    href="https://github.com/AbdelStark/ztarknet"
                    target="_blank"
                    rel="noreferrer"
                    onClick={handleLinkClick}
                  >
                    GitHub
                  </Link>
                </Button>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </nav>
    </header>
  );
}
