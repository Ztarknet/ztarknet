import { useEffect } from 'react';

/**
 * Hook to reveal elements on scroll with staggered animation delays.
 * Elements with the class "reveal-on-scroll" will animate in when they
 * become visible in the viewport.
 *
 * Automatically assigns staggered delays (40ms increments) based on DOM order.
 * Elements can also specify custom delays via --reveal-delay CSS variable.
 */
export function useRevealOnScroll() {
  useEffect(() => {
    const observedElements = new Set();

    const intersectionObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            // Use requestAnimationFrame to ensure smooth animation
            requestAnimationFrame(() => {
              entry.target.classList.add('is-visible');

              // After transition completes, remove the reveal class to prevent transform conflicts
              const handleTransitionEnd = (e) => {
                if (e.propertyName === 'transform' || e.propertyName === 'opacity') {
                  entry.target.classList.remove('reveal-on-scroll');
                  entry.target.removeEventListener('transitionend', handleTransitionEnd);
                }
              };
              entry.target.addEventListener('transitionend', handleTransitionEnd);
            });
            // Unobserve after first reveal to prevent re-triggering
            intersectionObserver.unobserve(entry.target);
            observedElements.delete(entry.target);
          }
        });
      },
      {
        threshold: 0.1, // Trigger when 10% of element is visible
        rootMargin: '50px', // Start animating slightly before element enters viewport
      }
    );

    const observeElements = () => {
      const revealTargets = document.querySelectorAll('.reveal-on-scroll:not(.is-visible)');

      revealTargets.forEach((target, index) => {
        // Skip if already observing this element
        if (observedElements.has(target)) return;

        const element = target;
        const delay = index * 40; // 40ms stagger between each element

        // Set the delay as a CSS variable for the transition
        if (!element.style.getPropertyValue('--reveal-delay')) {
          element.style.setProperty('--reveal-delay', `${delay}ms`);
        }

        // Check if element is already in viewport
        const rect = element.getBoundingClientRect();
        const isInViewport = (
          rect.top >= -50 &&
          rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) + 50
        );

        if (isInViewport) {
          // For elements already in viewport, manually trigger reveal with stagger
          // Set CSS delay to 0 since we're handling the delay with setTimeout
          element.style.setProperty('--reveal-delay', '0ms');

          setTimeout(() => {
            requestAnimationFrame(() => {
              element.classList.add('is-visible');

              // After transition completes, remove the reveal class
              const handleTransitionEnd = (e) => {
                if (e.propertyName === 'transform' || e.propertyName === 'opacity') {
                  element.classList.remove('reveal-on-scroll');
                  element.removeEventListener('transitionend', handleTransitionEnd);
                }
              };
              element.addEventListener('transitionend', handleTransitionEnd);
            });
          }, delay);
          observedElements.add(target);
        } else {
          // For elements not in viewport, use IntersectionObserver
          intersectionObserver.observe(target);
          observedElements.add(target);
        }
      });
    };

    // Initial observation after a small delay to ensure DOM is ready
    const initialTimeout = setTimeout(observeElements, 50);

    // Set up MutationObserver to watch for new elements being added
    const mutationObserver = new MutationObserver((mutations) => {
      // Check if any new .reveal-on-scroll elements were added
      let shouldObserve = false;
      mutations.forEach((mutation) => {
        mutation.addedNodes.forEach((node) => {
          if (node.nodeType === 1) { // Element node
            if (node.classList?.contains('reveal-on-scroll') ||
                node.querySelector?.('.reveal-on-scroll')) {
              shouldObserve = true;
            }
          }
        });
      });

      if (shouldObserve) {
        // Small delay to ensure the new elements are fully rendered
        setTimeout(observeElements, 50);
      }
    });

    // Observe the document body for changes
    mutationObserver.observe(document.body, {
      childList: true,
      subtree: true,
    });

    // Cleanup on unmount
    return () => {
      clearTimeout(initialTimeout);
      intersectionObserver.disconnect();
      mutationObserver.disconnect();
      observedElements.clear();
    };
  }, []); // Run only once on mount
}
