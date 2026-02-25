const menuToggle = document.querySelector('.menu-toggle');
const nav = document.querySelector('nav');
if (menuToggle && nav) {
  menuToggle.addEventListener('click', () => nav.classList.toggle('open'));
}

const flowDescription = document.getElementById('flowDescription');
document.querySelectorAll('.flow-node').forEach((node) => {
  node.addEventListener('mouseenter', () => {
    if (flowDescription) flowDescription.textContent = node.dataset.desc;
  });
});

const revealItems = document.querySelectorAll('.reveal');
const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.18 }
);
revealItems.forEach((item) => observer.observe(item));

if (window.gsap) {
  gsap.to('.brand', {
    textShadow: '0 0 24px rgba(106, 167, 255, 0.7)',
    duration: 1.8,
    yoyo: true,
    repeat: -1,
    ease: 'sine.inOut',
  });
  gsap.from('.hero h1, .hero p, .cta-row', {
    y: 14,
    opacity: 0,
    duration: 0.8,
    stagger: 0.12,
    ease: 'power2.out',
  });
}

const year = document.getElementById('year');
if (year) year.textContent = new Date().getFullYear();
