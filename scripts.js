/* ============================================================
   Premium Editorial — interactions
   ============================================================ */

// Custom cursor (dot + ring with hover affordance)
(function () {
  if (!window.matchMedia('(hover: hover) and (pointer: fine)').matches) return;
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  if (!('PointerEvent' in window)) return;

  const dot = document.querySelector('.cursor-dot');
  const ring = document.querySelector('.cursor-ring');
  if (!dot || !ring) return;

  let mx = window.innerWidth / 2, my = window.innerHeight / 2;
  let rx = mx, ry = my;
  let visible = false;

  window.addEventListener('pointermove', (e) => {
    mx = e.clientX; my = e.clientY;
    if (!visible) {
      visible = true;
      dot.style.opacity = 1;
      ring.style.opacity = 0.45;
    }
    dot.style.transform = `translate(${mx}px, ${my}px) translate(-50%, -50%)`;
  }, { passive: true });

  window.addEventListener('pointerleave', () => {
    visible = false;
    dot.style.opacity = 0;
    ring.style.opacity = 0;
  });

  function loop() {
    rx += (mx - rx) * 0.18;
    ry += (my - ry) * 0.18;
    ring.style.transform = `translate(${rx}px, ${ry}px) translate(-50%, -50%)`;
    requestAnimationFrame(loop);
  }
  loop();

  const hoverSelector = 'a, button, .card, .work, .plate, [role="button"], input, textarea, select';
  document.addEventListener('pointerover', (e) => {
    if (e.target.closest && e.target.closest(hoverSelector)) {
      ring.classList.add('is-hover');
      dot.classList.add('is-hover');
    }
  });
  document.addEventListener('pointerout', (e) => {
    if (e.target.closest && e.target.closest(hoverSelector)) {
      ring.classList.remove('is-hover');
      dot.classList.remove('is-hover');
    }
  });
})();

// Scroll progress bar
(function () {
  const bar = document.getElementById('scrollProgress');
  if (!bar) return;
  let ticking = false;
  function update() {
    const h = document.documentElement;
    const max = h.scrollHeight - h.clientHeight;
    const p = max > 0 ? h.scrollTop / max : 0;
    bar.style.transform = `scaleX(${p})`;
    ticking = false;
  }
  window.addEventListener('scroll', () => {
    if (!ticking) { requestAnimationFrame(update); ticking = true; }
  }, { passive: true });
  update();
})();

// Reveal-on-scroll
(function () {
  const els = document.querySelectorAll('.reveal');
  if (!els.length) return;
  if (!('IntersectionObserver' in window)) {
    els.forEach(el => el.classList.add('is-visible'));
    return;
  }
  const obs = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        obs.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -8% 0px' });
  els.forEach(el => obs.observe(el));
})();

// Active nav indicator
(function () {
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-link[href^="#"]');
  if (!sections.length || !navLinks.length || !('IntersectionObserver' in window)) return;

  const linkById = {};
  navLinks.forEach(link => {
    const id = link.getAttribute('href').slice(1);
    if (id) linkById[id] = link;
  });

  const obs = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      const id = entry.target.id;
      if (!linkById[id]) return;
      if (entry.isIntersecting) {
        Object.values(linkById).forEach(l => l.classList.remove('active'));
        linkById[id].classList.add('active');
      }
    });
  }, { rootMargin: '-40% 0px -55% 0px', threshold: 0 });

  sections.forEach(s => { if (linkById[s.id]) obs.observe(s); });
})();

// Mobile nav (hamburger + overlay)
(function () {
  const toggle = document.getElementById('navToggle');
  const overlay = document.getElementById('navOverlay');
  if (!toggle || !overlay) return;

  const links = overlay.querySelectorAll('.nav-overlay-link');

  function open() {
    overlay.hidden = false;
    requestAnimationFrame(() => overlay.setAttribute('data-open', 'true'));
    toggle.setAttribute('aria-expanded', 'true');
    toggle.setAttribute('aria-label', 'Close menu');
    document.body.classList.add('nav-open');
  }

  function close() {
    overlay.removeAttribute('data-open');
    toggle.setAttribute('aria-expanded', 'false');
    toggle.setAttribute('aria-label', 'Open menu');
    document.body.classList.remove('nav-open');
    setTimeout(() => { overlay.hidden = true; }, 300);
  }

  toggle.addEventListener('click', () => {
    const expanded = toggle.getAttribute('aria-expanded') === 'true';
    expanded ? close() : open();
  });

  links.forEach((a) => a.addEventListener('click', close));

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && toggle.getAttribute('aria-expanded') === 'true') close();
  });

  // Auto-close if viewport grows past breakpoint while open
  window.matchMedia('(min-width: 701px)').addEventListener('change', (e) => {
    if (e.matches && toggle.getAttribute('aria-expanded') === 'true') close();
  });
})();

// Subtle parallax on the hero plate
(function () {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  const plate = document.querySelector('.plate');
  if (!plate) return;
  let target = 0, current = 0;
  function onScroll() {
    target = Math.max(-30, Math.min(30, window.scrollY * -0.04));
  }
  function loop() {
    current += (target - current) * 0.08;
    plate.style.translate = `0 ${current}px`;
    requestAnimationFrame(loop);
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  loop();
})();
