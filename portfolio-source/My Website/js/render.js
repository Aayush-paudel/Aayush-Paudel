/**
 * Takes everything in window.SITE_DATA (config.js) and renders it into
 * the page. Keeping this separate from main.js means anyone editing
 * config.js never has to touch markup.
 */
(function () {
  const D = window.SITE_DATA;
  if (!D) return;
  const $ = (sel, ctx) => (ctx || document).querySelector(sel);
  const $$ = (sel, ctx) => Array.from((ctx || document).querySelectorAll(sel));

  function el(tag, attrs = {}, html) {
    const node = document.createElement(tag);
    Object.entries(attrs).forEach(([k, v]) => {
      if (k === 'class') node.className = v;
      else node.setAttribute(k, v);
    });
    if (html !== undefined) node.innerHTML = html;
    return node;
  }

  // ---------------- PERSONAL INFO ----------------
  function renderPersonalInfo() {
    const p = D.PERSONAL_INFO;
    document.title = `${p.name} — ${p.role}`;
    $('#loader-initials').textContent = p.initials;
    $('#nav-logo-name').textContent = p.name.split(' ')[0];
    $('#hero-name').textContent = p.name;
    $('#hero-title').innerHTML = p.role.replace(' & ', ' &amp; <br/>');
    $('#hero-desc').textContent = p.tagline;
    $('#hero-cv').setAttribute('href', p.resumeUrl);
    $('#hero-cv').setAttribute('download', '');
    $('#about-card-name').textContent = p.name;
    $('#about-card-role').textContent = p.role;
    const photoEl = $('#about-photo');
    if (p.avatar) {
      photoEl.innerHTML = `<img src="${p.avatar}" alt="${p.name}" />`;
    } else {
      photoEl.textContent = p.initials;
    }
    $('#about-bio').innerHTML = p.bio.map(par => `<p>${par}</p>`).join('');
    $('#about-education').textContent = p.education;
    $('#about-location').textContent = p.location;
    $('#about-interests').textContent = p.interests;
    $('#about-goal').textContent = p.goal;
    $('#footer-text').textContent = `Built by ${p.name} — with Three.js, GSAP and too much coffee.`;
    $('#contact-sub').textContent = `Have a project, a role, or just want to talk shop? Reach out — I'm at ${p.email}.`;
  }

  // ---------------- STATS ----------------
  function renderStats() {
    const grid = $('#stats-grid');
    grid.innerHTML = '';
    D.STATS.forEach((s) => {
      const item = el('div', { class: 'stat-item' }, `
        <div class="stat-value" data-target="${s.value}" data-suffix="${s.suffix || ''}">0${s.suffix || ''}</div>
        <div class="stat-label">${s.label}</div>
      `);
      grid.appendChild(item);
    });
  }

  // ---------------- SKILLS ----------------
  function renderSkills() {
    const tabsWrap = $('#skills-tabs');
    const grid = $('#skills-grid');
    const categories = Object.keys(D.SKILLS);

    tabsWrap.innerHTML = '';
    categories.forEach((cat, i) => {
      const tab = el('button', { class: 'skills-tab' + (i === 0 ? ' active' : ''), 'data-cat': cat }, cat);
      tabsWrap.appendChild(tab);
    });

    function paint(cat) {
      grid.innerHTML = '';
      D.SKILLS[cat].forEach((skill) => {
        const card = el('div', { class: 'skill-card', tabindex: '0' }, `
          <div class="skill-card-top">
            <i class="${skill.icon}"></i>
            <span class="skill-card-name">${skill.name}</span>
          </div>
          <div class="skill-bar"><span data-level="${skill.level}"></span></div>
          <div class="skill-level">${skill.level}%</div>
        `);
        grid.appendChild(card);
      });
      requestAnimationFrame(() => {
        $$('.skill-bar span', grid).forEach((bar) => {
          requestAnimationFrame(() => { bar.style.width = bar.dataset.level + '%'; });
        });
      });
    }
    paint(categories[0]);

    tabsWrap.addEventListener('click', (e) => {
      const btn = e.target.closest('.skills-tab');
      if (!btn) return;
      $$('.skills-tab', tabsWrap).forEach(t => t.classList.remove('active'));
      btn.classList.add('active');
      paint(btn.dataset.cat);
    });
  }

  // ---------------- PROJECTS ----------------
  const CATEGORY_ICONS = {
    Web: 'fa-solid fa-globe',
    AI: 'fa-solid fa-brain',
    Robotics: 'fa-solid fa-robot',
    Apps: 'fa-solid fa-mobile-screen',
    Other: 'fa-solid fa-shapes'
  };
  window.CATEGORY_ICONS = CATEGORY_ICONS;

  function renderProjects() {
    const filtersWrap = $('#projects-filters');
    const grid = $('#projects-grid');
    const cats = ['All', ...new Set(D.PROJECTS.map(p => p.category))];

    filtersWrap.innerHTML = '';
    cats.forEach((cat, i) => {
      filtersWrap.appendChild(el('button', { class: 'filter-btn' + (i === 0 ? ' active' : ''), 'data-filter': cat }, cat));
    });

    function paint(filter) {
      grid.innerHTML = '';
      const list = filter === 'All' ? D.PROJECTS : D.PROJECTS.filter(p => p.category === filter);
      list.forEach((proj) => {
        const card = el('article', { class: 'project-card', 'data-id': proj.id, tabindex: '0', role: 'button', 'aria-label': `View details for ${proj.name}` }, `
          <div class="project-card-img">
            <img src="${proj.image}" alt="${proj.name} preview" loading="lazy" />
            <span class="project-card-icon" title="${proj.category}"><i class="${CATEGORY_ICONS[proj.category] || CATEGORY_ICONS.Other}"></i></span>
          </div>
          <div class="project-card-body">
            <h3 class="project-card-name">${proj.name}</h3>
            <p class="project-card-desc">${proj.short}</p>
            <div class="project-tech-tags">${proj.tech.map(t => `<span class="tech-tag">${t}</span>`).join('')}</div>
            <div class="project-card-actions">
              ${proj.github ? `<a href="${proj.github}" target="_blank" rel="noopener" class="icon-btn" aria-label="GitHub repository" onclick="event.stopPropagation()"><i class="fa-brands fa-github"></i></a>` : ''}
              ${proj.demo ? `<a href="${proj.demo}" target="_blank" rel="noopener" class="icon-btn" aria-label="Live demo" onclick="event.stopPropagation()"><i class="fa-solid fa-arrow-up-right-from-square"></i></a>` : ''}
              <span class="view-details-link">View Details</span>
            </div>
          </div>
        `);
        grid.appendChild(card);
      });
    }
    paint('All');

    filtersWrap.addEventListener('click', (e) => {
      const btn = e.target.closest('.filter-btn');
      if (!btn) return;
      $$('.filter-btn', filtersWrap).forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      paint(btn.dataset.filter);
    });

    grid.addEventListener('click', (e) => {
      const card = e.target.closest('.project-card');
      if (!card) return;
      window.PortfolioModal.open(card.dataset.id);
    });
    grid.addEventListener('keypress', (e) => {
      if (e.key !== 'Enter') return;
      const card = e.target.closest('.project-card');
      if (!card) return;
      window.PortfolioModal.open(card.dataset.id);
    });
  }

  // ---------------- FEATURED PROJECT ----------------
  function renderFeatured() {
    const proj = D.PROJECTS.find(p => p.featured) || D.PROJECTS[0];
    if (!proj) return;
    $('#featured-title').textContent = proj.name;
    $('#featured-desc').textContent = proj.solution || proj.short;
    $('#featured-tech').innerHTML = proj.tech.map(t => `<span class="tech-tag">${t}</span>`).join('');
    $('#device-img').setAttribute('src', proj.image);
    $('#device-img').setAttribute('alt', proj.name);
    const link = $('#featured-link');
    link.addEventListener('click', (e) => { e.preventDefault(); window.PortfolioModal.open(proj.id); });
  }

  // ---------------- TIMELINE ----------------
  function renderTimeline() {
    const wrap = $('#timeline');
    wrap.innerHTML = '';
    D.EXPERIENCE.forEach((item) => {
      wrap.appendChild(el('div', { class: 'timeline-item' }, `
        <div class="timeline-node"></div>
        <div class="timeline-year">${item.year}</div>
        <div class="timeline-title">${item.title}</div>
        <div class="timeline-desc">${item.desc}</div>
      `));
    });
  }

  // ---------------- ACHIEVEMENTS ----------------
  function renderAchievements() {
    const wrap = $('#achievements-grid');
    wrap.innerHTML = '';
    D.ACHIEVEMENTS.forEach((a) => {
      wrap.appendChild(el('div', { class: 'achievement-card' }, `
        <i class="${a.icon}"></i>
        <div class="achievement-title">${a.title}</div>
        <div class="achievement-org">${a.org}</div>
      `));
    });
  }

  // ---------------- SERVICES ----------------
  function renderServices() {
    const wrap = $('#services-grid');
    wrap.innerHTML = '';
    D.SERVICES.forEach((s) => {
      wrap.appendChild(el('div', { class: 'service-card' }, `
        <i class="${s.icon}"></i>
        <h3>${s.title}</h3>
        <p>${s.desc}</p>
      `));
    });
  }

  // ---------------- GITHUB ----------------
  async function renderGithub() {
    const panel = $('#github-panel');
    const username = D.GITHUB.username;
    if (!D.GITHUB.useLiveApi || !username || username === 'yourusername') {
      panel.innerHTML = `<div class="github-loading">Set <code>GITHUB.username</code> in <code>js/config.js</code> to pull live stats for your account.</div>`;
      return;
    }
    try {
      const [userRes, reposRes] = await Promise.all([
        fetch(`https://api.github.com/users/${username}`),
        fetch(`https://api.github.com/users/${username}/repos?per_page=100`)
      ]);
      if (!userRes.ok || !reposRes.ok) throw new Error('GitHub API error');
      const user = await userRes.json();
      const repos = await reposRes.json();

      const langCount = {};
      let stars = 0;
      repos.forEach(r => {
        if (r.language) langCount[r.language] = (langCount[r.language] || 0) + 1;
        stars += r.stargazers_count || 0;
      });
      const topLangs = Object.entries(langCount).sort((a, b) => b[1] - a[1]).slice(0, 6);

      panel.innerHTML = `
        <div class="github-stat"><div class="github-stat-value">${user.public_repos}</div><div class="github-stat-label">Public Repos</div></div>
        <div class="github-stat"><div class="github-stat-value">${stars}</div><div class="github-stat-label">Total Stars</div></div>
        <div class="github-stat"><div class="github-stat-value">${user.followers}</div><div class="github-stat-label">Followers</div></div>
        <div class="github-stat"><div class="github-stat-value">${topLangs.length}</div><div class="github-stat-label">Languages</div></div>
        <div class="github-langs">${topLangs.map(([lang]) => `<span class="tech-tag">${lang}</span>`).join('')}</div>
        <div class="github-panel-link"><a class="btn btn-outline magnetic" href="https://github.com/${username}" target="_blank" rel="noopener">View GitHub Profile</a></div>
      `;
    } catch (err) {
      panel.innerHTML = `<div class="github-loading">Couldn't reach the GitHub API right now — <a href="https://github.com/${username}" target="_blank" rel="noopener" style="color:var(--accent-cyan)">view the profile directly</a>.</div>`;
    }
  }

  // ---------------- CONTACT / SOCIAL ----------------
  function renderContact() {
    const p = D.PERSONAL_INFO;
    const linksWrap = $('#contact-links');
    linksWrap.innerHTML = `
      <li><a href="mailto:${p.email}"><i class="fa-solid fa-envelope"></i> ${p.email}</a></li>
      <li><a href="#" id="contact-location-link" style="pointer-events:none;"><i class="fa-solid fa-location-dot"></i> ${p.location}</a></li>
    `;
    const socialWrap = $('#social-icons');
    socialWrap.innerHTML = '';
    D.SOCIAL_LINKS.forEach((s) => {
      socialWrap.appendChild(el('a', { href: s.url, target: '_blank', rel: 'noopener', class: 'social-icon', 'aria-label': s.name }, `
        <i class="${s.icon}"></i><span class="tooltip">${s.name}</span>
      `));
    });
  }

  window.PortfolioRender = {
    all() {
      renderPersonalInfo();
      renderStats();
      renderSkills();
      renderProjects();
      renderFeatured();
      renderTimeline();
      renderAchievements();
      renderServices();
      renderGithub();
      renderContact();
    }
  };
})();
