export function initForm() {
  const form = document.getElementById('contactForm');
  const btn  = document.getElementById('cfSubmit');
  if (!form) return;

  form.action = 'https://formsubmit.co/bektrade4444@gmail.com';
  form.method = 'POST';

  form.addEventListener('submit', async (e) => {
    e.preventDefault(); // Prevent the browser from redirecting to FormSubmit
    
    const text = btn.querySelector('.bs-text');
    const icon = btn.querySelector('.bs-icon');

    // Show loading state
    btn.disabled = true;
    text.textContent = 'Sending...';
    if (icon) icon.style.display = 'none';
    
    if (window.gsap) {
      window.gsap.to(btn, { scale: 0.97, duration: 0.15 });
    }

    try {
      const formData = new FormData(form);
      const response = await fetch(form.action, {
        method: 'POST',
        body: formData,
        headers: {
          'Accept': 'application/json'
        }
      });

      if (response.ok) {
        text.textContent = 'Sent Successfully!';
        btn.style.backgroundColor = '#10b981'; // green color
        form.reset();
      } else {
        text.textContent = 'Error. Try Again';
        btn.disabled = false;
        if (icon) icon.style.display = 'inline-block';
      }
    } catch (err) {
      text.textContent = 'Network Error';
      btn.disabled = false;
      if (icon) icon.style.display = 'inline-block';
    }

    if (window.gsap) {
      window.gsap.to(btn, { scale: 1, duration: 0.15 });
    }
  });
}
