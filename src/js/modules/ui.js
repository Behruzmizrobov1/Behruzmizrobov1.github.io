export function initScramble() {
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
}
