/* ================================================================
   PORTFOLIO V2 — main.js
   GSAP + Lenis + VanillaTilt + Custom Cursor + Magnetic
   ================================================================ */

// ──────────────────────────────────────────
// 1. REGISTER GSAP PLUGINS
// ──────────────────────────────────────────
gsap.registerPlugin(ScrollTrigger, TextPlugin);

// ──────────────────────────────────────────
// 2. LOADER
// ──────────────────────────────────────────
const loader = document.getElementById('loader');
const loaderBar = document.getElementById('loaderBar');
const loaderPct = document.getElementById('loaderPercent');

let progress = 0;
const loadInterval = setInterval(() => {
  progress += Math.random() * 18 + 4;
  if (progress >= 100) { progress = 100; clearInterval(loadInterval); initSite(); }
  loaderBar.style.width = progress + '%';
  loaderPct.textContent = Math.floor(progress) + '%';
}, 80);

function initSite() {
  setTimeout(() => {
    loader.classList.add('hidden');
    document.body.style.overflow = '';
    animateHero();
  }, 400);
}
document.body.style.overflow = 'hidden';

// ──────────────────────────────────────────
// 3. LENIS SMOOTH SCROLL
// ──────────────────────────────────────────
let lenis;
try {
  lenis = new Lenis({
    duration: 1.2,
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    smoothWheel: true,
  });

  lenis.on('scroll', ScrollTrigger.update);

  gsap.ticker.add((time) => {
    lenis.raf(time * 1000);
  });
  gsap.ticker.lagSmoothing(0);
} catch(e) {
  console.warn('Lenis init failed, using native scroll', e);
}

// ──────────────────────────────────────────
// 4. CUSTOM CURSOR
// ──────────────────────────────────────────
const cursor = document.getElementById('cursor');
const follower = document.getElementById('cursorFollower');

if (window.innerWidth > 640 && cursor) {
  let mouseX = 0, mouseY = 0;
  let followerX = 0, followerY = 0;

  // GSAP quickTo for smooth tracking
  const xTo = gsap.quickTo(cursor, 'x', { duration: 0.15, ease: 'power3' });
  const yTo = gsap.quickTo(cursor, 'y', { duration: 0.15, ease: 'power3' });
  const xFol = gsap.quickTo(follower, 'x', { duration: 0.5, ease: 'power3' });
  const yFol = gsap.quickTo(follower, 'y', { duration: 0.5, ease: 'power3' });

  window.addEventListener('mousemove', (e) => {
    xTo(e.clientX);
    yTo(e.clientY);
    xFol(e.clientX);
    yFol(e.clientY);
  }, { passive: true });

  // Cursor states
  document.querySelectorAll('[data-cursor="link"]').forEach(el => {
    el.addEventListener('mouseenter', () => document.body.classList.add('cursor-hover'));
    el.addEventListener('mouseleave', () => document.body.classList.remove('cursor-hover'));
  });
}

// ──────────────────────────────────────────
// 5. MAGNETIC BUTTONS
// ──────────────────────────────────────────
function initMagnetic() {
  document.querySelectorAll('.magnetic').forEach(el => {
    el.addEventListener('mousemove', (e) => {
      const rect = el.getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;
      const dx = (e.clientX - cx) * 0.35;
      const dy = (e.clientY - cy) * 0.35;
      gsap.to(el, { x: dx, y: dy, duration: 0.3, ease: 'power2.out' });
    });
    el.addEventListener('mouseleave', () => {
      gsap.to(el, { x: 0, y: 0, duration: 0.5, ease: 'elastic.out(1, 0.5)' });
    });
  });
}

// ──────────────────────────────────────────
// 6. VANILLA TILT
// ──────────────────────────────────────────
function initTilt() {
  if (typeof VanillaTilt === 'undefined') return;
  VanillaTilt.init(document.querySelectorAll('[data-tilt]'), {
    max: 8, speed: 400, glare: true, 'max-glare': 0.1,
  });
}

// ──────────────────────────────────────────
// 7. HERO ANIMATION SEQUENCE
// ──────────────────────────────────────────
function animateHero() {
  const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });

  // Fade in background
  tl.from('.hero-aurora', { opacity: 0, duration: 1.5, ease: 'power2.out' })

  // Tag
  .from('#heroTag', { opacity: 0, y: 20, duration: 0.6 }, '-=0.8')

  // Title lines stagger
  .from('.ht-line', {
    opacity: 0, y: 60, duration: 0.9,
    stagger: 0.12, ease: 'power4.out'
  }, '-=0.4')

  // Description
  .fromTo('#heroDesc', { opacity: 0, y: 24 }, { opacity: 1, y: 0, duration: 0.7 }, '-=0.4')

  // Typed
  .to('#heroTyped', { opacity: 1, duration: 0.3 }, '-=0.2')

  // Actions
  .to('#heroActions', { opacity: 1, duration: 0.5 }, '-=0.1')
  .from('#heroActions a', { y: 20, stagger: 0.1, duration: 0.5, ease: 'back.out(1.5)' }, '<')

  // Socials
  .to('#heroSocials', { opacity: 1, duration: 0.5 }, '-=0.3')
  .from('#heroSocials a', { y: 20, stagger: 0.07, duration: 0.5 }, '<')

  // Right side
  .from('#heroRight', {
    opacity: 0, x: 40, duration: 1, ease: 'power3.out'
  }, 0.3);

  // Typed.js after animation
  tl.call(() => {
    try {
      new Typed('#heroTyped', {
        strings: [
          'building REST APIs...',
          'optimizing PostgreSQL...',
          'writing Go microservices...',
          'deploying to production...',
          'available for freelance ✓'
        ],
        typeSpeed: 50,
        backSpeed: 30,
        backDelay: 2000,
        loop: true,
        showCursor: false,
      });
    } catch(e) {}
  });

  // Counter animation
  tl.call(() => animateCounters());
}

// ──────────────────────────────────────────
// 8. COUNTER ANIMATION
// ──────────────────────────────────────────
function animateCounters() {
  document.querySelectorAll('.stat-n').forEach(el => {
    const target = parseInt(el.dataset.count);
    gsap.to({ val: 0 }, {
      val: target,
      duration: 2,
      ease: 'power2.out',
      onUpdate: function() { el.textContent = Math.floor(this.targets()[0].val); }
    });
  });
}

// ──────────────────────────────────────────
// 9. SCROLL ANIMATIONS (GSAP ScrollTrigger)
// ──────────────────────────────────────────
function initScrollAnimations() {
  // Reveal up elements
  gsap.utils.toArray('.reveal-up').forEach((el, i) => {
    gsap.set(el, { y: 40, opacity: 0 }); // ← initial state FIRST
    gsap.to(el, {
      opacity: 1,
      y: 0,
      duration: 0.85,
      ease: 'power3.out',
      scrollTrigger: {
        trigger: el,
        start: 'top 85%',
        toggleActions: 'play none none none'
      },
      delay: (i % 3) * 0.1
    });
  });

  // Reveal right elements
  gsap.utils.toArray('.reveal-right').forEach(el => {
    gsap.to(el, {
      opacity: 1,
      x: 0,
      duration: 0.9,
      ease: 'power3.out',
      scrollTrigger: {
        trigger: el,
        start: 'top 80%',
      }
    });
    gsap.set(el, { x: 50 });
  });

  // Section titles split reveal
  document.querySelectorAll('.section-title').forEach(el => {
    gsap.from(el, {
      opacity: 0, y: 40, duration: 0.9, ease: 'power3.out',
      scrollTrigger: { trigger: el, start: 'top 85%' }
    });
  });

  // Skill bars
  gsap.utils.toArray('.sm-fill').forEach(bar => {
    ScrollTrigger.create({
      trigger: bar,
      start: 'top 90%',
      onEnter: () => {
        bar.style.width = bar.dataset.w + '%';
      }
    });
  });

  // Services cards stagger — use fromTo to avoid double opacity conflict
  gsap.fromTo('.svc-card',
    { opacity: 0, y: 50 },
    {
      opacity: 1, y: 0, stagger: 0.1, duration: 0.7, ease: 'power3.out',
      scrollTrigger: { trigger: '.services-grid', start: 'top 80%' }
    }
  );

  // Stack cards stagger
  gsap.from('.stack-card', {
    opacity: 0, y: 30, scale: 0.95,
    stagger: 0.06, duration: 0.6, ease: 'back.out(1.5)',
    scrollTrigger: { trigger: '.stack-grid', start: 'top 80%' }
  });

  // Marquee parallax feel - speed boost on scroll
  ScrollTrigger.create({
    trigger: '.marquee-section',
    start: 'top bottom',
    end: 'bottom top',
    onEnter: () => {
      document.querySelector('.marquee-track').style.animationDuration = '20s';
    },
    onLeave: () => {
      document.querySelector('.marquee-track').style.animationDuration = '30s';
    }
  });
}

// ──────────────────────────────────────────
// 10. NAVBAR
// ──────────────────────────────────────────
function initNav() {
  const nav = document.getElementById('nav');
  const links = document.querySelectorAll('.nav-link');

  ScrollTrigger.create({
    start: 'top -60',
    onUpdate: (self) => {
      nav.classList.toggle('scrolled', self.scroll() > 60);
    }
  });

  // Active link on scroll
  const sections = document.querySelectorAll('section[id]');
  window.addEventListener('scroll', () => {
    let cur = '';
    sections.forEach(sec => {
      if (window.scrollY >= sec.offsetTop - 140) cur = sec.id;
    });
    links.forEach(l => {
      l.classList.remove('active');
      if (l.getAttribute('href') === '#' + cur) l.classList.add('active');
    });
  }, { passive: true });

  // Smooth scroll for all anchor links
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', e => {
      const target = document.querySelector(a.getAttribute('href'));
      if (!target) return;
      e.preventDefault();
      if (lenis) {
        lenis.scrollTo(target, { offset: -80, duration: 1.5 });
      } else {
        target.scrollIntoView({ behavior: 'smooth' });
      }
      // Close mobile menu
      document.getElementById('mobileMenu').classList.remove('open');
      document.getElementById('hamburger').classList.remove('open');
    });
  });
}

// ──────────────────────────────────────────
// 11. HAMBURGER
// ──────────────────────────────────────────
function initHamburger() {
  const btn = document.getElementById('hamburger');
  const menu = document.getElementById('mobileMenu');
  btn.addEventListener('click', () => {
    btn.classList.toggle('open');
    menu.classList.toggle('open');
    if (lenis) {
      menu.classList.contains('open') ? lenis.stop() : lenis.start();
    }
  });
}

// ──────────────────────────────────────────
// 12. CONTACT FORM — FormSubmit.co (Zero Setup)
// ──────────────────────────────────────────
function initForm() {
  const form = document.getElementById('contactForm');
  const btn  = document.getElementById('cfSubmit');
  if (!form) return;

  const ENDPOINT = 'https://formsubmit.co/ajax/bektrade4444@gmail.com';

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const text = btn.querySelector('.bs-text');
    const icon = btn.querySelector('.bs-icon');

    const name    = form.cfName.value.trim();
    const email   = form.cfEmail.value.trim();
    const budget  = form.cfBudget?.value || 'Not specified';
    const message = form.cfMessage.value.trim();

    if (!name || !email || !message) return;

    // Loading state
    btn.disabled = true;
    text.textContent = 'Sending...';
    if (icon) icon.style.display = 'none';
    gsap.to(btn, { scale: 0.97, duration: 0.15 });

    try {
      const res = await fetch(ENDPOINT, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({
          name: name,
          email: email,
          budget: budget,
          message: message,
          _subject: `Portfolio Contact: ${name}`
        })
      });

      if (!res.ok) throw new Error('Network error');

      // ✅ SUCCESS
      text.textContent = '✓ Message Sent!';
      btn.classList.add('success');
      gsap.to(btn, { scale: 1, duration: 0.4, ease: 'back.out(1.5)' });
      form.reset();

      // Confetti effect
      gsap.fromTo('.contact-info', 
        { x: 0 }, 
        { x: 5, yoyo: true, repeat: 3, duration: 0.08 }
      );

    } catch (err) {
      console.warn('FormSubmit failed, fallback to mailto:', err);
      // Fallback: mailto
      const sub  = encodeURIComponent(`[Portfolio] ${name} — ${budget}`);
      const body = encodeURIComponent(`Name: ${name}\nEmail: ${email}\nBudget: ${budget}\n\nMessage:\n${message}`);
      window.open(`mailto:bektrade4444@gmail.com?subject=${sub}&body=${body}`, '_blank');
      text.textContent = '✓ Email Opened!';
      btn.classList.add('success');
      gsap.to(btn, { scale: 1, duration: 0.4, ease: 'back.out(1.5)' });
    }

    setTimeout(() => {
      text.textContent = 'Send Message';
      if (icon) icon.style.display = '';
      btn.classList.remove('success');
      btn.disabled = false;
    }, 4000);
  });
}

// ──────────────────────────────────────────
// 13. PARALLAX ON AURORA
// ──────────────────────────────────────────
function initParallax() {
  gsap.to('.aurora-img', {
    y: '20%',
    ease: 'none',
    scrollTrigger: {
      trigger: '.hero',
      start: 'top top',
      end: 'bottom top',
      scrub: 1.5
    }
  });
}

// ──────────────────────────────────────────
// 14. SCRAMBLE TEXT on hover (manual)
// ──────────────────────────────────────────
function scramble(el, text) {
  const chars = '!@#$%^&*ABCDEFGHIJKabcdefghij0123456789';
  let frame = 0;
  const totalFrames = 20;
  const interval = setInterval(() => {
    el.textContent = text.split('').map((c, i) => {
      if (i < frame / totalFrames * text.length) return text[i];
      return chars[Math.floor(Math.random() * chars.length)];
    }).join('');
    frame++;
    if (frame > totalFrames) {
      clearInterval(interval);
      el.textContent = text;
    }
  }, 35);
}

document.querySelectorAll('.nav-link').forEach(el => {
  const orig = el.textContent;
  el.addEventListener('mouseenter', () => scramble(el, orig));
});

// ──────────────────────────────────────────
// 15. INIT ALL
// ──────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  initNav();
  initHamburger();
  initMagnetic();
  initTilt();
  initScrollAnimations();
  initParallax();
  initForm();
});

// ──────────────────────────────────────────
// 16. DEV CONSOLE BRANDING
// ──────────────────────────────────────────
console.log(
  '%c Behruz Mizrobov %c Backend Developer %c ',
  'background:#22d3ee;color:#000;font-weight:700;padding:4px 8px;border-radius:4px 0 0 4px',
  'background:#818cf8;color:#fff;font-weight:600;padding:4px 8px',
  'background:transparent',
);
console.log('%c github.com/Behruzmizrobov1', 'color:#94a3b8;font-size:11px');
