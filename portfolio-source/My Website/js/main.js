/**
 * Wires up: mobile nav, active-section tracking, project modal,
 * contact form validation, back-to-top, and a couple of tasteful
 * easter eggs. Runs after render.js has populated the DOM.
 */
document.addEventListener('DOMContentLoaded', () => {
  if (window.SITE_DATA) window.PortfolioRender.all();
  if (window.PortfolioScenes) window.PortfolioScenes.init();

  initNav();
  initActiveSection();
  initModal();
  initContactForm();
  initBackToTop();
  initEasterEggs();
});

// ============================================================
// NAVIGATION
// ============================================================
function initNav() {
  const toggle = document.getElementById('nav-toggle');
  const links = document.getElementById('nav-links');
  if (!toggle || !links) return;

  toggle.addEventListener('click', () => {
    const open = links.classList.toggle('open');
    toggle.classList.toggle('open', open);
    toggle.setAttribute('aria-expanded', String(open));
  });

  links.querySelectorAll('.nav-link').forEach((link) => {
    link.addEventListener('click', () => {
      links.classList.remove('open');
      toggle.classList.remove('open');
      toggle.setAttribute('aria-expanded', 'false');
    });
  });
}

function initActiveSection() {
  const sections = document.querySelectorAll('main > section[id]');
  const navLinks = document.querySelectorAll('.nav-link');
  if (!sections.length || !('IntersectionObserver' in window)) return;

  const io = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      const id = entry.target.id;
      navLinks.forEach((link) => {
        link.classList.toggle('active', link.dataset.section === id);
      });
    });
  }, { rootMargin: '-40% 0px -55% 0px', threshold: 0 });

  sections.forEach((s) => io.observe(s));
}

// ============================================================
// PROJECT MODAL
// ============================================================
(function () {
  window.PortfolioModal = {
    open(id) {
      const D = window.SITE_DATA;
      const proj = D.PROJECTS.find(p => p.id === id);
      if (!proj) return;

      const overlay = document.getElementById('project-modal');
      const content = document.getElementById('modal-content');
      content.innerHTML = `
        <img class="modal-img" src="${proj.image}" alt="${proj.name}" />
        <div class="modal-content">
          <p class="modal-tag"><i class="${(window.CATEGORY_ICONS && window.CATEGORY_ICONS[proj.category]) || 'fa-solid fa-shapes'}"></i>&nbsp; ${proj.category}</p>
          <h3>${proj.name}</h3>
          <div class="modal-section">
            <h4>Overview</h4>
            <p>${proj.short}</p>
          </div>
          <div class="modal-section">
            <h4>Problem</h4>
            <p>${proj.problem || '—'}</p>
          </div>
          <div class="modal-section">
            <h4>Solution</h4>
            <p>${proj.solution || '—'}</p>
          </div>
          <div class="modal-section">
            <h4>Key Features</h4>
            <ul>${(proj.features || []).map(f => `<li>${f}</li>`).join('')}</ul>
          </div>
          <div class="modal-section">
            <h4>Technologies</h4>
            <div class="project-tech-tags">${proj.tech.map(t => `<span class="tech-tag">${t}</span>`).join('')}</div>
          </div>
          <div class="modal-actions">
            ${proj.github ? `<a href="${proj.github}" target="_blank" rel="noopener" class="btn btn-outline magnetic"><i class="fa-brands fa-github"></i>&nbsp; Code</a>` : ''}
            ${proj.demo ? `<a href="${proj.demo}" target="_blank" rel="noopener" class="btn btn-primary magnetic"><i class="fa-solid fa-arrow-up-right-from-square"></i>&nbsp; Live Demo</a>` : ''}
          </div>
        </div>
      `;
      overlay.classList.add('open');
      overlay.setAttribute('aria-hidden', 'false');
      document.body.style.overflow = 'hidden';
      document.getElementById('modal-close').focus();
    },
    close() {
      const overlay = document.getElementById('project-modal');
      overlay.classList.remove('open');
      overlay.setAttribute('aria-hidden', 'true');
      document.body.style.overflow = '';
    }
  };
})();

function initModal() {
  const overlay = document.getElementById('project-modal');
  const closeBtn = document.getElementById('modal-close');
  if (!overlay || !closeBtn) return;

  closeBtn.addEventListener('click', () => window.PortfolioModal.close());
  overlay.addEventListener('click', (e) => { if (e.target === overlay) window.PortfolioModal.close(); });
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && overlay.classList.contains('open')) window.PortfolioModal.close();
  });
}

// ============================================================
// CONTACT FORM
// ============================================================
function initContactForm() {
  const form = document.getElementById('contact-form');
  if (!form) return;
  const status = document.getElementById('cf-status');
  const submitBtn = document.getElementById('cf-submit');

  const fields = {
    name: { input: document.getElementById('cf-name'), validate: v => v.trim().length >= 2 || 'Please enter your name.' },
    email: { input: document.getElementById('cf-email'), validate: v => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v) || 'Enter a valid email address.' },
    message: { input: document.getElementById('cf-message'), validate: v => v.trim().length >= 10 || 'Message should be at least 10 characters.' }
  };

  Object.values(fields).forEach(({ input }) => {
    input.addEventListener('input', () => input.classList.toggle('has-value', input.value.length > 0));
    input.addEventListener('blur', () => validateField(input.id));
  });

  function validateField(id) {
    const key = id.replace('cf-', '');
    const field = fields[key];
    const result = field.validate(field.input.value);
    const errorEl = form.querySelector(`.form-error[data-for="${id}"]`);
    if (result === true) {
      errorEl.textContent = '';
      field.input.setAttribute('aria-invalid', 'false');
      return true;
    }
    errorEl.textContent = result;
    field.input.setAttribute('aria-invalid', 'true');
    return false;
  }

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const allValid = Object.keys(fields)
      .map(key => validateField('cf-' + key))
      .every(Boolean);

    if (!allValid) {
      status.textContent = 'Please fix the highlighted fields.';
      status.className = 'form-status error';
      return;
    }

    submitBtn.classList.add('loading');
    submitBtn.disabled = true;
    status.textContent = '';
    status.className = 'form-status';

    // No backend is wired up — replace this with your real submit call
    // (fetch to your API, Formspree, EmailJS, etc.)
    setTimeout(() => {
      submitBtn.classList.remove('loading');
      submitBtn.disabled = false;
      status.textContent = "Message ready — connect this form to your email service (see README) to actually send it.";
      status.className = 'form-status success';
      form.reset();
      Object.values(fields).forEach(f => f.input.classList.remove('has-value'));
    }, 900);
  });
}

// ============================================================
// BACK TO TOP
// ============================================================
function initBackToTop() {
  const btn = document.getElementById('back-to-top');
  if (!btn) return;
  window.addEventListener('scroll', () => {
    btn.style.opacity = window.scrollY > 500 ? '1' : '0';
    btn.style.pointerEvents = window.scrollY > 500 ? 'auto' : 'none';
  }, { passive: true });
  btn.style.opacity = '0';
  btn.style.pointerEvents = 'none';
  btn.style.transition = 'opacity .3s';
  btn.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
}

// ============================================================
// EASTER EGGS
// ============================================================
function initEasterEggs() {
  // 1) Click the logo 5 times fast → dev mode overlay
  const logo = document.getElementById('nav-logo');
  let clickCount = 0, clickTimer = null;
  if (logo) {
    logo.addEventListener('click', (e) => {
      clickCount++;
      clearTimeout(clickTimer);
      clickTimer = setTimeout(() => { clickCount = 0; }, 1200);
      if (clickCount >= 5) {
        e.preventDefault();
        clickCount = 0;
        showDevMode();
      }
    });
  }

  // 2) Konami code → same dev mode, different message
  const sequence = ['ArrowUp','ArrowUp','ArrowDown','ArrowDown','ArrowLeft','ArrowRight','ArrowLeft','ArrowRight','b','a'];
  let pos = 0;
  document.addEventListener('keydown', (e) => {
    pos = (e.key === sequence[pos]) ? pos + 1 : 0;
    if (pos === sequence.length) {
      pos = 0;
      showDevMode('Konami code accepted. You clearly read source code for fun — let\'s talk.');
    }
  });

  function showDevMode(customMsg) {
    const overlay = document.getElementById('dev-mode');
    const msg = document.getElementById('dev-mode-msg');
    msg.textContent = customMsg || 'You found the secret. Thanks for poking around the code — that curiosity is exactly what this site is about.';
    overlay.classList.add('show');
    setTimeout(() => overlay.classList.remove('show'), 3200);
  }
}
