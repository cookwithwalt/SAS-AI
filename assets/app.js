const header = document.querySelector('.site-header');
const menuToggle = document.querySelector('.menu-toggle');
const nav = document.querySelector('nav');
const navLinks = nav ? [...nav.querySelectorAll('a[href^="#"]')] : [];

if (menuToggle && header) {
  menuToggle.addEventListener('click', () => header.classList.toggle('open'));
}

if (nav) {
  nav.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', () => header?.classList.remove('open'));
  });
}

const revealEls = document.querySelectorAll('.reveal');
const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) entry.target.classList.add('is-visible');
    });
  },
  { threshold: 0.16 }
);
revealEls.forEach((el) => observer.observe(el));

if (window.gsap) {
  gsap.to('.orb', {
    y: -26,
    duration: 4,
    stagger: 0.35,
    repeat: -1,
    yoyo: true,
    ease: 'sine.inOut'
  });
}

const sections = navLinks
  .map((link) => document.querySelector(link.getAttribute('href')))
  .filter(Boolean);

if (sections.length) {
  const sectionObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      const id = `#${entry.target.id}`;
      navLinks.forEach((link) => {
        link.classList.toggle('active', link.getAttribute('href') === id);
      });
    });
  }, { rootMargin: '-35% 0px -45% 0px' });

  sections.forEach((section) => sectionObserver.observe(section));
}

const flowDescription = document.getElementById('flowDescription');
document.querySelectorAll('.flow-node').forEach((node) => {
  node.addEventListener('mouseenter', () => {
    document.querySelectorAll('.flow-node').forEach((n) => n.classList.remove('active'));
    node.classList.add('active');
    if (flowDescription) flowDescription.textContent = node.dataset.flow;
  });
  node.addEventListener('click', () => node.dispatchEvent(new Event('mouseenter')));
});

const stackDescription = document.getElementById('stackDescription');
document.querySelectorAll('.stack-wall button').forEach((item) => {
  item.addEventListener('mouseenter', () => {
    if (stackDescription) stackDescription.textContent = item.dataset.desc;
  });
});

const counters = document.querySelectorAll('[data-count]');
const counterObserver = new IntersectionObserver((entries, obs) => {
  entries.forEach((entry) => {
    if (!entry.isIntersecting) return;
    const target = Number(entry.target.dataset.count);
    const duration = 1100;
    const start = performance.now();

    const tick = (now) => {
      const progress = Math.min((now - start) / duration, 1);
      entry.target.textContent = Math.floor(progress * target).toLocaleString();
      if (progress < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
    obs.unobserve(entry.target);
  });
}, { threshold: 0.5 });

counters.forEach((counter) => counterObserver.observe(counter));

const magneticButtons = document.querySelectorAll('.magnetic');
magneticButtons.forEach((btn) => {
  btn.addEventListener('mousemove', (event) => {
    if (window.matchMedia('(max-width: 760px)').matches) return;
    const rect = btn.getBoundingClientRect();
    const x = event.clientX - rect.left - rect.width / 2;
    const y = event.clientY - rect.top - rect.height / 2;
    btn.style.transform = `translate(${x * 0.08}px, ${y * 0.08}px)`;
  });
  btn.addEventListener('mouseleave', () => {
    btn.style.transform = '';
  });
});

const tiltCards = document.querySelectorAll('.tilt');
tiltCards.forEach((card) => {
  card.addEventListener('mousemove', (event) => {
    if (window.matchMedia('(max-width: 980px)').matches) return;
    const rect = card.getBoundingClientRect();
    const x = (event.clientX - rect.left) / rect.width - 0.5;
    const y = (event.clientY - rect.top) / rect.height - 0.5;
    card.style.transform = `perspective(700px) rotateX(${y * -5}deg) rotateY(${x * 7}deg) translateY(-4px)`;
  });
  card.addEventListener('mouseleave', () => {
    card.style.transform = '';
  });
});

const cursorGlow = document.querySelector('.cursor-glow');
if (cursorGlow && window.matchMedia('(pointer:fine)').matches) {
  window.addEventListener('pointermove', (event) => {
    cursorGlow.style.left = `${event.clientX}px`;
    cursorGlow.style.top = `${event.clientY}px`;
  });
}

const canvas = document.getElementById('neuralCanvas');
if (canvas) {
  const ctx = canvas.getContext('2d');
  const nodes = Array.from({ length: 34 }, () => ({
    x: Math.random(),
    y: Math.random(),
    vx: (Math.random() - 0.5) * 0.002,
    vy: (Math.random() - 0.5) * 0.002
  }));

  const resize = () => {
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = Math.floor(window.innerWidth * dpr);
    canvas.height = Math.floor(window.innerHeight * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  };

  const draw = () => {
    const w = window.innerWidth;
    const h = window.innerHeight;
    ctx.clearRect(0, 0, w, h);

    nodes.forEach((node) => {
      node.x += node.vx;
      node.y += node.vy;
      if (node.x < 0 || node.x > 1) node.vx *= -1;
      if (node.y < 0 || node.y > 1) node.vy *= -1;

      ctx.fillStyle = 'rgba(119, 183, 255, 0.62)';
      ctx.beginPath();
      ctx.arc(node.x * w, node.y * h, 1.4, 0, Math.PI * 2);
      ctx.fill();
    });

    for (let i = 0; i < nodes.length; i += 1) {
      for (let j = i + 1; j < nodes.length; j += 1) {
        const dx = (nodes[i].x - nodes[j].x) * w;
        const dy = (nodes[i].y - nodes[j].y) * h;
        const dist = Math.hypot(dx, dy);
        if (dist < 140) {
          ctx.strokeStyle = `rgba(133, 184, 255, ${0.17 - dist / 1000})`;
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.moveTo(nodes[i].x * w, nodes[i].y * h);
          ctx.lineTo(nodes[j].x * w, nodes[j].y * h);
          ctx.stroke();
        }
      }
    }

    requestAnimationFrame(draw);
  };

  resize();
  window.addEventListener('resize', resize);
  requestAnimationFrame(draw);
}
