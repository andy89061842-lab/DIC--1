/* =========================================
   APP.JS  —  Personal Page Scripts
   ========================================= */

'use strict';

// ─────────────────────────────────────────
// 1. NAVBAR — scroll shrink + hamburger
// ─────────────────────────────────────────
const navbar    = document.getElementById('navbar');
const hamburger = document.getElementById('hamburger');
const navLinks  = document.getElementById('nav-links');

window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 50);
});

hamburger.addEventListener('click', () => {
  navLinks.classList.toggle('open');
});

// Close menu on link click
navLinks.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => navLinks.classList.remove('open'));
});

// ─────────────────────────────────────────
// 2. LIVE CLOCK  (Taiwan Standard Time UTC+8)
// ─────────────────────────────────────────
const DAYS   = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];
const MONTHS = ['January','February','March','April','May','June',
                'July','August','September','October','November','December'];

const elTime   = document.getElementById('clock-time');
const elDate   = document.getElementById('clock-date');
const elSegH   = document.getElementById('seg-h');
const elSegM   = document.getElementById('seg-m');
const elSegS   = document.getElementById('seg-s');
const handHour = document.getElementById('hand-hour');
const handMin  = document.getElementById('hand-minute');
const handSec  = document.getElementById('hand-second');

function pad(n) { return String(n).padStart(2, '0'); }

function getTaiwanTime() {
  // Use Intl to safely derive Taiwan time regardless of local tz
  const now = new Date();
  const twStr = now.toLocaleString('en-US', { timeZone: 'Asia/Taipei' });
  return new Date(twStr);
}

function updateClock() {
  const t = getTaiwanTime();
  const h = t.getHours();
  const m = t.getMinutes();
  const s = t.getSeconds();

  // Digital
  elTime.textContent = `${pad(h)}:${pad(m)}:${pad(s)}`;
  elSegH.textContent = pad(h);
  elSegM.textContent = pad(m);
  elSegS.textContent = pad(s);
  elDate.textContent = `${DAYS[t.getDay()]}, ${MONTHS[t.getMonth()]} ${t.getDate()}, ${t.getFullYear()}`;

  // Analog — smooth degree calculation
  const secDeg  = s * 6;
  const minDeg  = m * 6 + s * 0.1;
  const hourDeg = (h % 12) * 30 + m * 0.5;

  handSec.style.transform = `rotate(${secDeg}deg)`;
  handMin.style.transform  = `rotate(${minDeg}deg)`;
  handHour.style.transform = `rotate(${hourDeg}deg)`;
}

updateClock();
setInterval(updateClock, 1000);

// ─────────────────────────────────────────
// 3. ANALOG CLOCK — tick marks
// ─────────────────────────────────────────
(function buildTicks() {
  const g = document.getElementById('tick-marks');
  for (let i = 0; i < 60; i++) {
    const angle  = i * 6;
    const isHour = i % 5 === 0;
    const r1     = isHour ? 78 : 83;
    const r2     = 88;
    const rad    = (angle - 90) * (Math.PI / 180);
    const x1 = 100 + r1 * Math.cos(rad);
    const y1 = 100 + r1 * Math.sin(rad);
    const x2 = 100 + r2 * Math.cos(rad);
    const y2 = 100 + r2 * Math.sin(rad);

    const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
    line.setAttribute('x1', x1); line.setAttribute('y1', y1);
    line.setAttribute('x2', x2); line.setAttribute('y2', y2);
    line.setAttribute('stroke', isHour ? 'rgba(255,255,255,0.5)' : 'rgba(255,255,255,0.15)');
    line.setAttribute('stroke-width', isHour ? '2' : '1');
    g.appendChild(line);
  }
})();

// ─────────────────────────────────────────
// 4. PARTICLE BACKGROUND
// ─────────────────────────────────────────
(function initParticles() {
  const container = document.getElementById('particles');
  const count = 60;

  for (let i = 0; i < count; i++) {
    const p = document.createElement('div');
    const size  = Math.random() * 3 + 1;
    const x     = Math.random() * 100;
    const y     = Math.random() * 100;
    const dur   = Math.random() * 20 + 10;
    const delay = Math.random() * 10;
    const op    = Math.random() * 0.4 + 0.05;

    Object.assign(p.style, {
      position: 'absolute',
      width:  size + 'px',
      height: size + 'px',
      left:   x + '%',
      top:    y + '%',
      background: `rgba(${Math.random()>0.5?'99,102,241':'168,85,247'}, ${op})`,
      borderRadius: '50%',
      animation: `particleFloat ${dur}s ${delay}s ease-in-out infinite alternate`,
      pointerEvents: 'none',
    });
    container.appendChild(p);
  }

  // Inject keyframes dynamically
  const style = document.createElement('style');
  style.textContent = `
    @keyframes particleFloat {
      from { transform: translate(0,0) scale(1); opacity: 0.1; }
      to   { transform: translate(${Math.random()*40-20}px, ${Math.random()*60-30}px) scale(1.5); opacity: 0.5; }
    }
  `;
  document.head.appendChild(style);
})();

// ─────────────────────────────────────────
// 5. SCROLL REVEAL
// ─────────────────────────────────────────
const revealEls = document.querySelectorAll(
  '.skill-card, .project-card, .contact-card, .section-header, .clock-digital, .clock-analog'
);

revealEls.forEach((el, i) => {
  el.classList.add('reveal');
  // staggered delay per card index within its parent
  const siblings = [...el.parentElement.children];
  const idx = siblings.indexOf(el);
  el.style.transitionDelay = `${idx * 0.08}s`;
});

const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      // Animate skill bars once visible
      const fill = entry.target.querySelector('.skill-fill');
      if (fill) fill.classList.add('animated');
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.15 });

revealEls.forEach(el => revealObserver.observe(el));

// ─────────────────────────────────────────
// 6. SKILLS FILTER
// ─────────────────────────────────────────
const filterBtns  = document.querySelectorAll('.filter-btn');
const skillCards  = document.querySelectorAll('.skill-card');

filterBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    filterBtns.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');

    const filter = btn.dataset.filter;
    skillCards.forEach(card => {
      const match = filter === 'all' || card.dataset.category === filter;
      card.style.display = match ? '' : 'none';
    });
  });
});

// ─────────────────────────────────────────
// 7. ACTIVE NAV LINK (scroll spy)
// ─────────────────────────────────────────
const sections   = document.querySelectorAll('section[id]');
const navAnchors = document.querySelectorAll('.nav-links a');

const spyObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      navAnchors.forEach(a => a.classList.remove('active-link'));
      const active = document.querySelector(`.nav-links a[href="#${entry.target.id}"]`);
      if (active) active.classList.add('active-link');
    }
  });
}, { threshold: 0.45 });

sections.forEach(s => spyObserver.observe(s));

// Add active link style
const linkStyle = document.createElement('style');
linkStyle.textContent = `.nav-links a.active-link { color: var(--text-primary) !important; }
.nav-links a.active-link::after { width: 100% !important; }`;
document.head.appendChild(linkStyle);

// ─────────────────────────────────────────
// 8. HERO TYPING EFFECT  (name)
// ─────────────────────────────────────────
(function typeHero() {
  const el   = document.getElementById('hero-name');
  const text = el.textContent;
  el.textContent = '';
  el.style.minHeight = '1.2em';

  let i = 0;
  const cursor = document.createElement('span');
  cursor.style.cssText = 'display:inline-block;width:3px;height:0.85em;background:currentColor;margin-left:2px;vertical-align:middle;animation:blink 1s step-start infinite;';
  el.appendChild(cursor);

  function type() {
    if (i < text.length) {
      el.insertBefore(document.createTextNode(text[i++]), cursor);
      setTimeout(type, 80 + Math.random() * 60);
    } else {
      setTimeout(() => cursor.remove(), 1500);
    }
  }

  setTimeout(type, 800);
})();

console.log('%c Personal Page loaded! 🚀 ', 'background:#6366f1;color:#fff;padding:6px 12px;border-radius:4px;font-weight:bold');
