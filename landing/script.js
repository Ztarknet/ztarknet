const revealTargets = document.querySelectorAll(
  ".hero-grid .grid-card, .thesis-card, .arch-column, .stack-card, .roadmap-step, .resource-chip"
);

const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);
      }
    });
  },
  {
    threshold: 0.2,
  }
);

revealTargets.forEach((target, index) => {
  target.style.setProperty("--reveal-delay", `${index * 40}ms`);
  observer.observe(target);
});

const nav = document.querySelector(".nav");
if (nav) {
  nav.classList.add("nav-visible");
  let lastScroll = 0;

  window.addEventListener("scroll", () => {
    const current = window.scrollY;
    const isScrollingDown = current > lastScroll && current > 120;
    nav.classList.toggle("nav-hidden", isScrollingDown);
    nav.classList.toggle("nav-visible", !isScrollingDown);
    lastScroll = current;
  });
}
