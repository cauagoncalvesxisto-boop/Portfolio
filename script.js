/* ═══════════════════════════════════════════════════════════
   CX — BACKEND PORTFOLIO · script.js
   ═══════════════════════════════════════════════════════════ */

'use strict';

// ─── CUSTOM CURSOR ────────────────────────────────────────────
const cursor      = document.getElementById('cursor');
const cursorTrail = document.getElementById('cursorTrail');

let mouseX = 0, mouseY = 0;
let trailX = 0, trailY = 0;

if (cursor && cursorTrail) {
  document.addEventListener('mousemove', e => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    cursor.style.left = mouseX + 'px';
    cursor.style.top  = mouseY + 'px';
  });

  // Smooth trail
  (function animateTrail() {
    trailX += (mouseX - trailX) * 0.12;
    trailY += (mouseY - trailY) * 0.12;
    cursorTrail.style.left = trailX + 'px';
    cursorTrail.style.top  = trailY + 'px';
    requestAnimationFrame(animateTrail);
  })();

  // Hover state
  document.querySelectorAll('a, button, .stack-card, .sys-panel, .contact-btn, .tag').forEach(el => {
    el.addEventListener('mouseenter', () => document.body.classList.add('cursor-hover'));
    el.addEventListener('mouseleave', () => document.body.classList.remove('cursor-hover'));
  });
}

// ─── NAVBAR SCROLL ────────────────────────────────────────────
const navbar = document.getElementById('navbar');

const onScroll = () => {
  if (window.scrollY > 60) navbar.classList.add('scrolled');
  else navbar.classList.remove('scrolled');
};

window.addEventListener('scroll', onScroll, { passive: true });

// ─── HAMBURGER ────────────────────────────────────────────────
const hamburger  = document.getElementById('hamburger');
const mobileMenu = document.getElementById('mobileMenu');

if (hamburger && mobileMenu) {
  hamburger.addEventListener('click', () => {
    const open = hamburger.classList.toggle('open');
    mobileMenu.classList.toggle('open', open);
  });

  mobileMenu.querySelectorAll('.mobile-link').forEach(link => {
    link.addEventListener('click', () => {
      hamburger.classList.remove('open');
      mobileMenu.classList.remove('open');
    });
  });
}

// ─── TERMINAL TYPEWRITER ──────────────────────────────────────
const terminalTarget = document.getElementById('terminalText');
const messages = [
  'Engineering backend systems',
  'Designing REST APIs',
  'Structuring databases',
  'Building auth pipelines',
  'Scaling server logic',
];

let msgIdx = 0, charIdx = 0, deleting = false;

function typewrite() {
  if (!terminalTarget) return;
  const current = messages[msgIdx];

  if (!deleting) {
    charIdx++;
    terminalTarget.textContent = current.slice(0, charIdx);
    if (charIdx === current.length) {
      deleting = true;
      setTimeout(typewrite, 2200);
      return;
    }
  } else {
    charIdx--;
    terminalTarget.textContent = current.slice(0, charIdx);
    if (charIdx === 0) {
      deleting = false;
      msgIdx = (msgIdx + 1) % messages.length;
    }
  }

  setTimeout(typewrite, deleting ? 38 : 62);
}

typewrite();

// ─── SCROLL REVEAL ────────────────────────────────────────────
const revealEls = document.querySelectorAll('.reveal-up, .reveal-fade');

const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry, i) => {
    if (entry.isIntersecting) {
      // stagger cards by data-delay
      const delay = entry.target.dataset.delay
        ? parseFloat(entry.target.dataset.delay) * 100
        : 0;
      setTimeout(() => {
        entry.target.classList.add('visible');
      }, delay);
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.12 });

revealEls.forEach(el => revealObserver.observe(el));

// ─── SKILL BAR ANIMATION ──────────────────────────────────────
const bars = document.querySelectorAll('.card-bar-fill, .sys-bar-fill');

const barObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const el = entry.target;
      const target = el.dataset.width || el.style.width || '0';
      // For sys-bar-fill width is set via inline style already
      if (el.dataset.width) {
        el.style.width = el.dataset.width + '%';
      } else {
        // re-trigger transition
        const w = el.style.width;
        el.style.width = '0';
        requestAnimationFrame(() => {
          requestAnimationFrame(() => { el.style.width = w; });
        });
      }
      barObserver.unobserve(el);
    }
  });
}, { threshold: 0.3 });

bars.forEach(bar => {
  // Reset sys-bar-fill to 0 so transition fires
  if (bar.classList.contains('sys-bar-fill')) {
    const w = bar.style.width;
    bar.style.width = '0';
    bar.dataset._target = w;
  }
  barObserver.observe(bar);
});

// Re-trigger sys-bar-fill
const sysBarObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const el = entry.target;
      const target = el.dataset._target;
      if (target) {
        requestAnimationFrame(() => { el.style.width = target; });
      }
      sysBarObserver.unobserve(el);
    }
  });
}, { threshold: 0.3 });

document.querySelectorAll('.sys-bar-fill').forEach(el => sysBarObserver.observe(el));

// ─── PARALLAX GLOW ────────────────────────────────────────────
const glowEl  = document.querySelector('.hero-glow');
const glowEl2 = document.querySelector('.hero-glow--2');

document.addEventListener('mousemove', e => {
  if (!glowEl) return;
  const xPct = (e.clientX / window.innerWidth - 0.5) * 2;
  const yPct = (e.clientY / window.innerHeight - 0.5) * 2;
  glowEl.style.transform  = `translate(${xPct * 30}px, ${yPct * 30}px)`;
  if (glowEl2) glowEl2.style.transform = `translate(${xPct * -20}px, ${yPct * -20}px)`;
});

// ─── SMOOTH ANCHOR SCROLL ─────────────────────────────────────
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', e => {
    const target = document.querySelector(anchor.getAttribute('href'));
    if (!target) return;
    e.preventDefault();
    target.scrollIntoView({ behavior: 'smooth', block: 'start' });
  });
});

// ─── HERO COUNTER ENTRANCE ────────────────────────────────────
const counterNums = document.querySelectorAll('.counter-num');
let countersStarted = false;

const counterObserver = new IntersectionObserver((entries) => {
  if (entries[0].isIntersecting && !countersStarted) {
    countersStarted = true;
    counterNums.forEach(el => {
      el.style.opacity = '0';
      el.style.transform = 'translateY(10px)';
      el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    });
    counterNums.forEach((el, i) => {
      setTimeout(() => {
        el.style.opacity = '1';
        el.style.transform = 'translateY(0)';
      }, 800 + i * 120);
    });
    counterObserver.disconnect();
  }
}, { threshold: 0.5 });

const heroEl = document.getElementById('hero');
if (heroEl) counterObserver.observe(heroEl);

// ─── STACK CARD STAGGER ───────────────────────────────────────
document.querySelectorAll('.stack-card').forEach((card, i) => {
  card.dataset.delay = i;
});

// ─── COLLAB SECTION HOVER ─────────────────────────────────────
const collabTitle = document.querySelector('.collab-title');
if (collabTitle) {
  collabTitle.addEventListener('mousemove', e => {
    const rect = collabTitle.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width - 0.5) * 10;
    const y = ((e.clientY - rect.top)  / rect.height - 0.5) * 5;
    collabTitle.style.transform = `perspective(600px) rotateX(${-y}deg) rotateY(${x}deg)`;
  });
  collabTitle.addEventListener('mouseleave', () => {
    collabTitle.style.transform = '';
  });
}

// ─── INIT ─────────────────────────────────────────────────────
onScroll();
console.log('%c[CX] Backend systems online.', 'font-family:monospace;color:#888;');
