(() => {
  const root = document.documentElement;
  const themeToggle = document.querySelector('.theme-toggle');
  const themeMeta = document.querySelector('meta[name="theme-color"]');

  const setTheme = (theme) => {
    root.dataset.theme = theme;
    const night = theme === 'night';
    themeToggle?.setAttribute('aria-label', night ? 'Switch to paper theme' : 'Switch to night theme');
    themeMeta?.setAttribute('content', night ? '#191a16' : '#f1eee4');
    try { localStorage.setItem('xotahsin-theme', theme); } catch (_) { /* Storage can be disabled. */ }
  };

  try {
    const stored = localStorage.getItem('xotahsin-theme');
    if (stored === 'paper' || stored === 'night') setTheme(stored);
  } catch (_) { /* Keep the paper theme when storage is unavailable. */ }

  themeToggle?.addEventListener('click', () => setTheme(root.dataset.theme === 'night' ? 'paper' : 'night'));

  const menuToggle = document.querySelector('.menu-toggle');
  const nav = document.querySelector('.primary-nav');
  const closeMenu = () => {
    nav?.classList.remove('is-open');
    menuToggle?.setAttribute('aria-expanded', 'false');
    menuToggle?.setAttribute('aria-label', 'Open navigation');
  };
  menuToggle?.addEventListener('click', () => {
    const open = menuToggle.getAttribute('aria-expanded') !== 'true';
    menuToggle.setAttribute('aria-expanded', String(open));
    menuToggle.setAttribute('aria-label', open ? 'Close navigation' : 'Open navigation');
    nav?.classList.toggle('is-open', open);
  });
  nav?.querySelectorAll('a').forEach((link) => link.addEventListener('click', closeMenu));
  window.addEventListener('resize', () => { if (window.innerWidth > 700) closeMenu(); }, { passive: true });

  const filters = [...document.querySelectorAll('[data-filter]')];
  const projects = [...document.querySelectorAll('.project[data-category]')];
  filters.forEach((button) => {
    button.addEventListener('click', () => {
      const filter = button.dataset.filter;
      filters.forEach((item) => {
        const active = item === button;
        item.classList.toggle('is-active', active);
        item.setAttribute('aria-pressed', String(active));
      });
      projects.forEach((project) => {
        project.classList.toggle('is-hidden', filter !== 'all' && project.dataset.category !== filter);
      });
    });
  });

  const dialog = document.querySelector('.command-dialog');
  const search = dialog?.querySelector('.command-search input');
  const resultLinks = [...(dialog?.querySelectorAll('.command-results a') || [])];
  const closeButton = dialog?.querySelector('.command-close');
  let visibleResults = resultLinks;
  let activeResult = 0;

  const setActiveResult = (index) => {
    if (!visibleResults.length) return;
    activeResult = (index + visibleResults.length) % visibleResults.length;
    visibleResults.forEach((link, i) => {
      link.classList.toggle('is-selected', i === activeResult);
      if (i === activeResult) link.setAttribute('aria-current', 'true');
      else link.removeAttribute('aria-current');
    });
    visibleResults[activeResult]?.scrollIntoView({ block: 'nearest' });
  };
  const openPalette = () => {
    if (!dialog || dialog.open) return;
    dialog.showModal();
    if (search) { search.value = ''; search.dispatchEvent(new Event('input')); search.focus(); }
  };
  const closePalette = () => { if (dialog?.open) dialog.close(); };

  closeButton?.addEventListener('click', closePalette);
  search?.addEventListener('input', () => {
    const query = search.value.trim().toLowerCase();
    visibleResults = resultLinks.filter((link) => link.textContent.toLowerCase().includes(query));
    resultLinks.forEach((link) => { link.hidden = !visibleResults.includes(link); });
    setActiveResult(0);
  });
  search?.addEventListener('keydown', (event) => {
    if (event.key === 'ArrowDown') { event.preventDefault(); setActiveResult(activeResult + 1); }
    if (event.key === 'ArrowUp') { event.preventDefault(); setActiveResult(activeResult - 1); }
    if (event.key === 'Enter' && visibleResults[activeResult]) { event.preventDefault(); visibleResults[activeResult].click(); closePalette(); }
  });
  dialog?.querySelectorAll('.command-results a').forEach((link) => {
    link.addEventListener('click', () => closePalette());
    link.addEventListener('mouseenter', () => setActiveResult(visibleResults.indexOf(link)));
  });
  dialog?.addEventListener('click', (event) => { if (event.target === dialog) closePalette(); });
  document.addEventListener('keydown', (event) => {
    const target = event.target;
    const typing = target instanceof HTMLElement && (target.isContentEditable || ['INPUT', 'TEXTAREA', 'SELECT'].includes(target.tagName));
    if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === 'k') { event.preventDefault(); openPalette(); }
    if (event.key === '/' && !typing && !dialog?.open) { event.preventDefault(); openPalette(); }
  });

  const year = document.querySelector('#year');
  if (year) year.textContent = String(new Date().getFullYear());

  // A tiny live window into public repositories, with a static fallback already in the HTML.
  const repoList = document.querySelector('#github-repos');
  const repoStatus = document.querySelector('#github-status');
  if (repoList && window.fetch) {
    fetch('https://api.github.com/users/XOTahsin/repos?per_page=100&sort=updated', {
      headers: { Accept: 'application/vnd.github+json' },
      cache: 'no-store'
    }).then((response) => {
      if (!response.ok) throw new Error(`GitHub returned ${response.status}`);
      return response.json();
    }).then((repos) => {
      const latest = repos
        .filter((repo) => !repo.fork && !repo.archived && repo.html_url)
        .sort((a, b) => new Date(b.updated_at) - new Date(a.updated_at))
        .slice(0, 3);
      if (!latest.length) return;
      const fragment = document.createDocumentFragment();
      latest.forEach((repo, index) => {
        const link = document.createElement('a');
        link.href = repo.html_url;
        link.target = '_blank';
        link.rel = 'noopener noreferrer';
        const label = document.createElement('span');
        label.className = 'mono';
        label.textContent = `PUBLIC / ${String(index + 1).padStart(2, '0')}`;
        const name = document.createElement('strong');
        name.textContent = repo.name.replace(/[-_]/g, ' ');
        const note = document.createElement('small');
        const date = repo.updated_at ? new Date(repo.updated_at).toLocaleDateString(undefined, { month: 'short', year: 'numeric' }) : 'Updated recently';
        note.textContent = [repo.language, date].filter(Boolean).join(' · ');
        const arrow = document.createElement('b');
        arrow.textContent = '↗';
        link.append(label, name, note, arrow);
        fragment.append(link);
      });
      repoList.replaceChildren(fragment);
      if (repoStatus) repoStatus.textContent = 'LIVE FROM GITHUB / PUBLIC REPOSITORIES';
    }).catch(() => {
      if (repoStatus) repoStatus.textContent = 'PUBLIC REPOSITORIES / STATIC FALLBACK';
    });
  }

  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if ('IntersectionObserver' in window && !reduceMotion) {
    const revealTargets = document.querySelectorAll('.section-heading, .project, .workshop, .about__grid, .principle, .toolbox, .contact__body');
    const observer = new IntersectionObserver((entries, obs) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          obs.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -35px 0px' });
    revealTargets.forEach((element) => { element.classList.add('reveal'); observer.observe(element); });
  }
})();
