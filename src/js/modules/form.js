export function initForm() {
  const form = document.getElementById('contactForm');
  const btn  = document.getElementById('cfSubmit');
  if (!form) return;

  form.action = 'https://formsubmit.co/bektrade4444@gmail.com';
  form.method = 'POST';

  form.addEventListener('submit', () => {
    const text = btn.querySelector('.bs-text');
    const icon = btn.querySelector('.bs-icon');

    btn.disabled = true;
    text.textContent = 'Sending...';
    if (icon) icon.style.display = 'none';
    
    if (window.gsap) {
      window.gsap.to(btn, { scale: 0.97, duration: 0.15 });
    }
  });
}
