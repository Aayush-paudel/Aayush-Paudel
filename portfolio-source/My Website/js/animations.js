/**
 * All scroll-triggered and hover-triggered animation wiring.
 * Runs once the DOM has been populated by render.js.
 */
(function () {
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  function init() {
    if (typeof gsap === 'undefined') return;
    gsap.registerPlugin(ScrollTrigger);

    heroEntrance();
    sectionReveals();
    counters();
    timelineReveal();
    tilt3D();
    scrollProgress();
    navScrollBehavior();
    parallaxDevice();
  }

  // ---------------- HERO ENTRANCE (one orchestrated sequence) ----------------
  function heroEntrance() {
    const tl = gsap.timeline({ delay: reducedMotion ? 0 : 0.2 });
    tl.from('#hero-eyebrow', { y: 24, opacity: 0, duration: 0.7, ease: 'power3.out' })
      .from('#hero-title', { y: 34, opacity: 0, duration: 0.8, ease: 'power3.out' }, '-=0.5')
      .from('#hero-desc', { y: 24, opacity: 0, duration: 0.7, ease: 'power3.out' }, '-=0.5')
      .from('.hero-actions .btn', { y: 20, opacity: 0, duration: 0.6, stagger: 0.1, ease: 'power3.out' }, '-=0.45')
      .from('.hero-scroll-hint', { opacity: 0, duration: 0.6 }, '-=0.2');
  }

  // ---------------- GENERIC SECTION REVEALS ----------------
  function sectionReveals() {
    const targets = document.querySelectorAll(
      '.section-title, .section-sub, .stats-grid, .skills-tabs, .about-card-wrap, .about-copy > *, .projects-filters, .timeline, .services-grid, .achievements-grid, .github-panel, .contact-form, .contact-links, .social-icons, .featured-copy > *, .featured-device'
    );
    targets.forEach((t) => {
      gsap.from(t, {
        scrollTrigger: { trigger: t, start: 'top 88%', once: true },
        y: 30, opacity: 0, duration: 0.7, ease: 'power2.out'
      });
    });

    // Grids: stagger children in
    document.querySelectorAll('.skills-grid, .achievements-grid, .services-grid').forEach((grid) => {
      ScrollTrigger.create({
        trigger: grid, start: 'top 85%', once: true,
        onEnter: () => gsap.from(grid.children, { y: 26, opacity: 0, duration: 0.6, stagger: 0.08, ease: 'power2.out' })
      });
    });

    ScrollTrigger.create({
      trigger: '#projects-grid', start: 'top 85%',
      onEnter: () => gsap.from('#projects-grid .project-card', { y: 30, opacity: 0, duration: 0.6, stagger: 0.08, ease: 'power2.out' }),
      once: true
    });
  }

  // Projects grid gets re-run after filtering, so give it its own light reveal handler too
  document.addEventListener('click', (e) => {
    if (!e.target.closest('.filter-btn') || typeof gsap === 'undefined') return;
    requestAnimationFrame(() => {
      gsap.from('#projects-grid .project-card', { y: 20, opacity: 0, duration: 0.5, stagger: 0.06, ease: 'power2.out' });
    });
  });
  document.addEventListener('click', (e) => {
    if (!e.target.closest('.skills-tab') || typeof gsap === 'undefined') return;
    requestAnimationFrame(() => {
      gsap.from('#skills-grid .skill-card', { y: 16, opacity: 0, duration: 0.45, stagger: 0.05, ease: 'power2.out' });
    });
  });

  // ---------------- STAT COUNTERS ----------------
  function counters() {
    document.querySelectorAll('.stat-value').forEach((node) => {
      const target = parseFloat(node.dataset.target || '0');
      const suffix = node.dataset.suffix || '';
      ScrollTrigger.create({
        trigger: node, start: 'top 90%', once: true,
        onEnter: () => {
          const obj = { val: 0 };
          gsap.to(obj, {
            val: target, duration: 1.6, ease: 'power2.out',
            onUpdate: () => { node.textContent = Math.round(obj.val) + suffix; }
          });
        }
      });
    });
  }

  // ---------------- TIMELINE NODE GLOW ----------------
  function timelineReveal() {
    document.querySelectorAll('.timeline-item').forEach((item) => {
      ScrollTrigger.create({
        trigger: item, start: 'top 75%',
        onEnter: () => item.classList.add('in-view'),
        onLeaveBack: () => item.classList.remove('in-view')
      });
      gsap.from(item, { scrollTrigger: { trigger: item, start: 'top 85%', once: true }, x: -24, opacity: 0, duration: 0.6, ease: 'power2.out' });
    });
  }

  // ---------------- 3D TILT (about card, skill cards, project cards, achievements) ----------------
  function tilt3D() {
    if (reducedMotion || window.matchMedia('(hover:none)').matches) return;
    const tiltables = document.querySelectorAll('.about-card, .skill-card, .project-card, .achievement-card');
    tiltables.forEach((cardHost) => {
      cardHost.addEventListener('mousemove', (e) => {
        const rect = cardHost.getBoundingClientRect();
        const x = (e.clientX - rect.left) / rect.width - 0.5;
        const y = (e.clientY - rect.top) / rect.height - 0.5;
        gsap.to(cardHost, { rotateY: x * 10, rotateX: -y * 10, duration: 0.4, ease: 'power2.out', transformPerspective: 800 });
      });
      cardHost.addEventListener('mouseleave', () => {
        gsap.to(cardHost, { rotateY: 0, rotateX: 0, duration: 0.6, ease: 'power3.out' });
      });
    });
  }

  // ---------------- FEATURED DEVICE PARALLAX ----------------
  function parallaxDevice() {
    const device = document.getElementById('device-laptop');
    if (!device) return;
    gsap.to(device, {
      scrollTrigger: { trigger: '#featured', start: 'top bottom', end: 'bottom top', scrub: 1 },
      rotateY: -4, rotateX: -2, y: -30, ease: 'none'
    });
    if (!window.matchMedia('(hover:none)').matches) {
      document.getElementById('featured').addEventListener('mousemove', (e) => {
        const rect = e.currentTarget.getBoundingClientRect();
        const x = (e.clientX - rect.left) / rect.width - 0.5;
        const y = (e.clientY - rect.top) / rect.height - 0.5;
        gsap.to(device, { rotateY: -14 + x * 10, rotateX: 4 - y * 8, duration: 0.6, ease: 'power2.out' });
      });
    }
  }

  // ---------------- SCROLL PROGRESS BAR ----------------
  function scrollProgress() {
    const bar = document.getElementById('scroll-progress');
    if (!bar) return;
    window.addEventListener('scroll', () => {
      const h = document.documentElement;
      const scrolled = (h.scrollTop) / (h.scrollHeight - h.clientHeight) * 100;
      bar.style.width = scrolled + '%';
    }, { passive: true });
  }

  // ---------------- NAV HIDE ON SCROLL DOWN ----------------
  function navScrollBehavior() {
    const nav = document.getElementById('navbar');
    if (!nav) return;
    let lastY = window.scrollY;
    window.addEventListener('scroll', () => {
      const y = window.scrollY;
      if (y > 120 && y > lastY) nav.classList.add('nav-hidden');
      else nav.classList.remove('nav-hidden');
      nav.classList.toggle('nav-scrolled', y > 40);
      lastY = y;
    }, { passive: true });
  }

  window.addEventListener('site:loaded', init);
  // If the load event already fired before this script attached the listener
  if (document.body.classList.contains('loaded')) init();
})();
