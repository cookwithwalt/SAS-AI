const header = document.querySelector('.site-header');
const menuToggle = document.querySelector('.menu-toggle');
const nav = document.querySelector('nav');

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
      if (entry.isIntersecting) {
        entry.target.style.opacity = 1;
        entry.target.style.transform = 'translateY(0)';
      }
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
    const duration = 1200;
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
    const rect = card.getBoundingClientRect();
    const x = (event.clientX - rect.left) / rect.width - 0.5;
    const y = (event.clientY - rect.top) / rect.height - 0.5;
    card.style.transform = `perspective(700px) rotateX(${y * -5}deg) rotateY(${x * 7}deg) translateY(-4px)`;
  });
  card.addEventListener('mouseleave', () => {
    card.style.transform = '';
  });
});

const canvas = document.getElementById('neuralCanvas');
if (canvas) {
  const ctx = canvas.getContext('2d');
  const nodes = Array.from({ length: 38 }, () => ({ x: Math.random(), y: Math.random(), vx: (Math.random() - 0.5) * 0.002, vy: (Math.random() - 0.5) * 0.002 }));

  const resize = () => {
    canvas.width = window.innerWidth * window.devicePixelRatio;
    canvas.height = window.innerHeight * window.devicePixelRatio;
    ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
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

      const px = node.x * w;
      const py = node.y * h;
      ctx.fillStyle = 'rgba(119, 183, 255, 0.65)';
      ctx.beginPath();
      ctx.arc(px, py, 1.5, 0, Math.PI * 2);
      ctx.fill();
    });

    for (let i = 0; i < nodes.length; i++) {
      for (let j = i + 1; j < nodes.length; j++) {
        const dx = (nodes[i].x - nodes[j].x) * w;
        const dy = (nodes[i].y - nodes[j].y) * h;
        const dist = Math.hypot(dx, dy);
        if (dist < 130) {
          ctx.strokeStyle = `rgba(133, 184, 255, ${0.16 - dist / 1000})`;
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
