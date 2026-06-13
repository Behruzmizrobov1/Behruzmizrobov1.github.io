/* ================================================
   Portfolio JS — Animations, Interactions
   ================================================ */

// ── PARTICLES
function createParticles() {
  const container = document.getElementById('particles');
  const count = 25;
  for (let i = 0; i < count; i++) {
    const p = document.createElement('div');
    p.classList.add('particle');
    const size = Math.random() * 4 + 1;
    const colors = ['#00d4ff', '#7c3aed', '#00ff88'];
    const color = colors[Math.floor(Math.random() * colors.length)];
    p.style.cssText = `
      width: ${size}px; height: ${size}px;
      left: ${Math.random() * 100}%;
      background: ${color};
      animation-duration: ${Math.random() * 15 + 10}s;
      animation-delay: ${Math.random() * 10}s;
    `;
    container.appendChild(p);
  }
}

// ── NAVBAR SCROLL
const navbar = document.getElementById('navbar');
const navLinks = document.querySelectorAll('.nav-link');
const sections = document.querySelectorAll('section[id]');

window.addEventListener('scroll', () => {
  if (window.scrollY > 50) {
    navbar.classList.add('scrolled');
  } else {
    navbar.classList.remove('scrolled');
  }

  // Active nav link
  let current = '';
  sections.forEach(sec => {
    const sectionTop = sec.offsetTop - 100;
    if (window.scrollY >= sectionTop) current = sec.getAttribute('id');
  });
  navLinks.forEach(link => {
    link.classList.remove('active');
    if (link.getAttribute('href') === `#${current}`) {
      link.classList.add('active');
    }
  });
}, { passive: true });

// Smooth scroll for nav links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function(e) {
    const target = document.querySelector(this.getAttribute('href'));
    if (target) {
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth' });
      // Close mobile menu
      document.getElementById('navLinks').classList.remove('open');
    }
  });
});

// ── HAMBURGER MENU
const hamburger = document.getElementById('hamburger');
const navLinksEl = document.getElementById('navLinks');
hamburger.addEventListener('click', () => {
  navLinksEl.classList.toggle('open');
});

// ── COUNTER ANIMATION
function animateCounters() {
  const counters = document.querySelectorAll('.stat-num');
  counters.forEach(counter => {
    const target = parseInt(counter.dataset.target);
    const duration = 2000;
    const step = target / (duration / 16);
    let current = 0;
    const timer = setInterval(() => {
      current += step;
      if (current >= target) {
        current = target;
        clearInterval(timer);
      }
      counter.textContent = Math.floor(current);
    }, 16);
  });
}

// ── SKILL BARS ANIMATION
function animateSkillBars() {
  const bars = document.querySelectorAll('.skill-fill');
  bars.forEach(bar => {
    const width = bar.dataset.width;
    setTimeout(() => {
      bar.style.width = width + '%';
    }, 200);
  });
}

// ── INTERSECTION OBSERVER
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      
      // Trigger special animations
      if (entry.target.id === 'home') {
        setTimeout(animateCounters, 500);
      }
      if (entry.target.id === 'skills') {
        setTimeout(animateSkillBars, 300);
      }
    }
  });
}, { threshold: 0.1 });

sections.forEach(section => observer.observe(section));

// Fade-in elements
const fadeEls = document.querySelectorAll('.fade-in, .slide-left, .slide-right');
const elObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry, i) => {
    if (entry.isIntersecting) {
      setTimeout(() => entry.target.classList.add('visible'), i * 100);
    }
  });
}, { threshold: 0.1 });
fadeEls.forEach(el => elObserver.observe(el));

// ── TYPING EFFECT
function typeEffect(el, text, speed = 60) {
  el.textContent = '';
  let i = 0;
  const timer = setInterval(() => {
    el.textContent += text[i];
    i++;
    if (i >= text.length) clearInterval(timer);
  }, speed);
}

// ── CONTACT FORM
const form = document.getElementById('contactForm');
const submitBtn = document.getElementById('submitBtn');

form.addEventListener('submit', function(e) {
  e.preventDefault();
  
  const btnText = submitBtn.querySelector('.btn-text');
  submitBtn.disabled = true;
  btnText.textContent = 'Sending...';
  
  // Simulate send (replace with real backend/email service)
  setTimeout(() => {
    btnText.textContent = '✓ Message Sent!';
    submitBtn.style.background = 'linear-gradient(135deg, #00ff88, #00d4aa)';
    form.reset();
    
    setTimeout(() => {
      btnText.textContent = 'Send Message';
      submitBtn.disabled = false;
      submitBtn.style.background = '';
    }, 3000);
  }, 1500);
});

// ── CARD HOVER 3D TILT
document.querySelectorAll('.project-card, .service-card').forEach(card => {
  card.addEventListener('mousemove', (e) => {
    const rect = card.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    card.style.transform = `perspective(600px) rotateY(${x * 6}deg) rotateX(${-y * 6}deg) translateY(-4px)`;
  });
  card.addEventListener('mouseleave', () => {
    card.style.transform = '';
  });
});

// ── TERMINAL TYPING
const aboutSection = document.getElementById('about');
const aboutObserver = new IntersectionObserver((entries) => {
  if (entries[0].isIntersecting) {
    const outputEl = document.getElementById('terminalOutput');
    if (outputEl) {
      outputEl.style.opacity = '0';
      setTimeout(() => {
        outputEl.style.transition = 'opacity 0.5s';
        outputEl.style.opacity = '1';
      }, 800);
    }
    aboutObserver.disconnect();
  }
}, { threshold: 0.3 });
if (aboutSection) aboutObserver.observe(aboutSection);

// ── CURSOR GLOW (subtle)
const cursorGlow = document.createElement('div');
cursorGlow.style.cssText = `
  position: fixed; width: 300px; height: 300px;
  border-radius: 50%; pointer-events: none; z-index: 0;
  background: radial-gradient(circle, rgba(0,212,255,0.04) 0%, transparent 70%);
  transform: translate(-50%, -50%); transition: 0.1s;
`;
document.body.appendChild(cursorGlow);
document.addEventListener('mousemove', (e) => {
  cursorGlow.style.left = e.clientX + 'px';
  cursorGlow.style.top = e.clientY + 'px';
}, { passive: true });

// ── INIT
document.addEventListener('DOMContentLoaded', () => {
  createParticles();
  animateCounters();
  
  // Animate visible skill bars on load if skills section is visible
  const skillsSection = document.getElementById('skills');
  if (skillsSection) {
    const rect = skillsSection.getBoundingClientRect();
    if (rect.top < window.innerHeight) animateSkillBars();
  }
});

console.log('%c Behruz Portfolio 🚀', 'font-size:20px; font-weight:bold; color:#00d4ff;');
console.log('%c Backend Developer · Go & Python', 'font-size:12px; color:#8899aa;');
