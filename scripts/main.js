const header = document.querySelector('.site-header');
const menuToggle = document.querySelector('.menu-toggle');
const nav = document.querySelector('nav');
const internalLinks = nav ? [...nav.querySelectorAll('a[href^="#"]')] : [];

if (menuToggle && header) {
  menuToggle.addEventListener('click', () => {
    header.classList.toggle('open');
  });
}

if (nav) {
  nav.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', () => header?.classList.remove('open'));
  });
}

const onScroll = () => {
  if (!header) return;
  header.classList.toggle('is-compact', window.scrollY > 16);
};
window.addEventListener('scroll', onScroll, { passive: true });
onScroll();

const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (!entry.isIntersecting) return;
    entry.target.classList.add('is-visible');
    revealObserver.unobserve(entry.target);
  });
}, { threshold: 0.16 });

document.querySelectorAll('.reveal').forEach((el) => revealObserver.observe(el));

const anchorSections = internalLinks
  .map((link) => document.querySelector(link.getAttribute('href')))
  .filter(Boolean);

if (anchorSections.length) {
  const sectionObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      const activeId = `#${entry.target.id}`;
      internalLinks.forEach((link) => {
        link.classList.toggle('active', link.getAttribute('href') === activeId);
      });
    });
  }, { rootMargin: '-35% 0px -45% 0px' });

  anchorSections.forEach((section) => sectionObserver.observe(section));
}

const connectionLine = document.querySelector('.connection-line');
if (connectionLine) {
  const connectionObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        connectionObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.4 });

  connectionObserver.observe(connectionLine);
}
