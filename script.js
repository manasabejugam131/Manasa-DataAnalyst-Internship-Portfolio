/* ============================================================
   BEJUGAM MANASA — PORTFOLIO SCRIPTS
   ============================================================ */

/* ── THEME TOGGLE ─────────────────────────────────────────── */
const themeToggle = document.getElementById('themeToggle');
const html = document.documentElement;

// Persist preference
const savedTheme = localStorage.getItem('theme') || 'dark';
html.setAttribute('data-theme', savedTheme);

themeToggle.addEventListener('click', () => {
  const current = html.getAttribute('data-theme');
  const next = current === 'dark' ? 'light' : 'dark';
  html.setAttribute('data-theme', next);
  localStorage.setItem('theme', next);
});

/* ── MOBILE NAV ───────────────────────────────────────────── */
const hamburger = document.getElementById('hamburger');
const mobileMenu = document.getElementById('mobileMenu');

hamburger.addEventListener('click', () => {
  hamburger.classList.toggle('open');
  mobileMenu.classList.toggle('open');
});

document.querySelectorAll('.nav__mobile-link').forEach(link => {
  link.addEventListener('click', () => {
    hamburger.classList.remove('open');
    mobileMenu.classList.remove('open');
  });
});

/* ── SCROLLED NAV ─────────────────────────────────────────── */
const nav = document.getElementById('nav');
window.addEventListener('scroll', () => {
  nav.classList.toggle('scrolled', window.scrollY > 30);
}, { passive: true });

/* ── HERO GRID CANVAS ─────────────────────────────────────── */
function initHeroGrid() {
  const canvas = document.getElementById('heroGrid');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  let W, H;

  function resize() {
    W = canvas.width = canvas.offsetWidth;
    H = canvas.height = canvas.offsetHeight;
  }

  function draw() {
    ctx.clearRect(0, 0, W, H);
    const isDark = html.getAttribute('data-theme') === 'dark';
    ctx.strokeStyle = isDark ? 'rgba(109,140,255,0.12)' : 'rgba(76,110,245,0.08)';
    ctx.lineWidth = 1;

    const gap = 48;
    for (let x = 0; x <= W; x += gap) {
      ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, H); ctx.stroke();
    }
    for (let y = 0; y <= H; y += gap) {
      ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(W, y); ctx.stroke();
    }
  }

  resize();
  draw();
  window.addEventListener('resize', () => { resize(); draw(); }, { passive: true });

  // Redraw on theme change
  const observer = new MutationObserver(draw);
  observer.observe(html, { attributes: true, attributeFilter: ['data-theme'] });
}
initHeroGrid();

/* ── REVEAL ON SCROLL ─────────────────────────────────────── */
function initReveal() {
  const els = document.querySelectorAll('.reveal');
  const io = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.classList.add('visible');
        io.unobserve(e.target);
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

  els.forEach(el => io.observe(el));
}
initReveal();

/* ── SKILL BARS ───────────────────────────────────────────── */
function initSkillBars() {
  const bars = document.querySelectorAll('.skill-bar');
  const io = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        const level = e.target.getAttribute('data-level');
        const fill = e.target.querySelector('.skill-bar__fill');
        if (fill) {
          setTimeout(() => { fill.style.width = level + '%'; }, 120);
        }
        io.unobserve(e.target);
      }
    });
  }, { threshold: 0.5 });
  bars.forEach(b => io.observe(b));
}
initSkillBars();

/* ── SOFT SKILL RINGS ─────────────────────────────────────── */
function initRings() {
  // Inject SVG gradient defs once
  const defs = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  defs.innerHTML = `
    <defs>
      <linearGradient id="ringGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="#6d8cff"/>
        <stop offset="100%" stop-color="#a78bfa"/>
      </linearGradient>
    </defs>
  `;
  defs.style.cssText = 'position:absolute;width:0;height:0;overflow:hidden;';
  document.body.prepend(defs);

  const rings = document.querySelectorAll('.soft-skill__ring');
  const CIRC = 2 * Math.PI * 28; // circumference for r=28

  const io = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        const pct = parseFloat(e.target.getAttribute('data-pct')) / 100;
        const progress = e.target.querySelector('.soft-skill__progress');
        if (progress) {
          const offset = CIRC * (1 - pct);
          setTimeout(() => { progress.style.strokeDashoffset = offset; }, 180);
        }
        io.unobserve(e.target);
      }
    });
  }, { threshold: 0.5 });
  rings.forEach(r => io.observe(r));
}
initRings();

/* ── ACTIVE NAV LINK ON SCROLL ────────────────────────────── */
function initActiveNav() {
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav__links a');

  const io = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        const id = e.target.id;
        navLinks.forEach(a => {
          a.style.color = a.getAttribute('href') === `#${id}` ? 'var(--text-primary)' : '';
        });
      }
    });
  }, { threshold: 0.4 });

  sections.forEach(s => io.observe(s));
}
initActiveNav();

/* ── CONTACT FORM ─────────────────────────────────────────── */
const form = document.getElementById('contactForm');
const formSuccess = document.getElementById('formSuccess');

if (form) {
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const btn = form.querySelector('.btn--primary');
    btn.disabled = true;
    btn.querySelector('.btn-text').textContent = 'Sending…';

    // Simulate sending (replace with real form handler / Formspree)
    setTimeout(() => {
      form.reset();
      formSuccess.classList.add('visible');
      btn.disabled = false;
      btn.querySelector('.btn-text').textContent = 'Send Message';
      setTimeout(() => formSuccess.classList.remove('visible'), 5000);
    }, 1200);
  });
}

/* ── SMOOTH SCROLL OFFSET (for fixed nav) ─────────────────── */
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', (e) => {
    const target = document.querySelector(anchor.getAttribute('href'));
    if (!target) return;
    e.preventDefault();
    const offset = target.getBoundingClientRect().top + window.scrollY - 76;
    window.scrollTo({ top: offset, behavior: 'smooth' });
  });
});

/* ── CURSOR GLOW (desktop only) ──────────────────────────── */
if (window.matchMedia('(hover: hover) and (pointer: fine)').matches) {
  const glow = document.createElement('div');
  glow.style.cssText = `
    position: fixed;
    pointer-events: none;
    width: 300px;
    height: 300px;
    border-radius: 50%;
    background: radial-gradient(circle, rgba(109,140,255,0.07) 0%, transparent 70%);
    transform: translate(-50%, -50%);
    transition: left 0.15s ease, top 0.15s ease;
    z-index: 0;
    mix-blend-mode: screen;
  `;
  document.body.appendChild(glow);

  document.addEventListener('mousemove', (e) => {
    glow.style.left = e.clientX + 'px';
    glow.style.top = e.clientY + 'px';
  }, { passive: true });
}

/* ── STAGGERED HERO ANIMATION ON LOAD ─────────────────────── */
window.addEventListener('load', () => {
  document.querySelectorAll('.hero .reveal').forEach((el, i) => {
    setTimeout(() => el.classList.add('visible'), 100 + i * 90);
  });
});
