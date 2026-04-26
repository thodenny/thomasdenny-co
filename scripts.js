// Fade-in on scroll for elements marked .fade-in
(function () {
  const els = document.querySelectorAll('.fade-in');
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
  }, { threshold: 0.15, rootMargin: '0px 0px -60px 0px' });
  els.forEach(el => obs.observe(el));
})();

// Active nav indicator: highlight the nav link for whichever section is centered in the viewport
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
