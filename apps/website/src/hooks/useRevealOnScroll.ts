'use client';

import { useEffect } from 'react';

export function useRevealOnScroll() {
  useEffect(() => {
    const revealTargets = document.querySelectorAll('.reveal-on-scroll');

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            observer.unobserve(entry.target);
          }
        });
      },
      {
        threshold: 0.2,
      }
    );

    revealTargets.forEach((target, index) => {
      const element = target as HTMLElement;
      if (!element.style.getPropertyValue('--reveal-delay')) {
        element.style.setProperty('--reveal-delay', `${index * 40}ms`);
      }
      observer.observe(target);
    });

    return () => {
      revealTargets.forEach((target) => observer.unobserve(target));
    };
  }, []);
}
