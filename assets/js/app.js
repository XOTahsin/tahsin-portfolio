const root = document.documentElement;
const $ = (selector, scope = document) => scope.querySelector(selector);
const $$ = (selector, scope = document) => [...scope.querySelectorAll(selector)];

// Theme preference: saved locally, with dark mode as the default.
const themeButton = $('#theme-toggle');
const storedTheme = (() => { try { return localStorage.getItem('tahsin-theme'); } catch { return null; } })();
if (storedTheme === 'light' || storedTheme === 'dark') root.dataset.theme = storedTheme;
function updateThemeButton() {
  const light = root.dataset.theme === 'light';
  themeButton?.setAttribute('aria-pressed', String(light));
  themeButton?.setAttribute('aria-label', light ? 'Switch to dark theme' : 'Switch to light theme');
}
updateThemeButton();
themeButton?.addEventListener('click', () => {
  root.dataset.theme = root.dataset.theme === 'light' ? 'dark' : 'light';
  try { localStorage.setItem('tahsin-theme', root.dataset.theme); } catch { /* Storage may be unavailable. */ }
  updateThemeButton();
});

// Mobile navigation.
const mobileToggle = $('#mobile-menu-toggle');
const mobileMenu = $('#mobile-menu');
function closeMobileMenu() {
  if (!mobileMenu || !mobileToggle) return;
  mobileMenu.hidden = true;
  mobileToggle.setAttribute('aria-expanded', 'false');
  mobileToggle.setAttribute('aria-label', 'Open navigation');
}
mobileToggle?.addEventListener('click', () => {
  const opening = mobileMenu.hidden;
  mobileMenu.hidden = !opening;
  mobileToggle.setAttribute('aria-expanded', String(opening));
  mobileToggle.setAttribute('aria-label', opening ? 'Close navigation' : 'Open navigation');
});
$$('#mobile-menu a').forEach(link => link.addEventListener('click', closeMobileMenu));

// Scroll position and active section state.
const progressBar = $('#scroll-progress-bar');
const backToTop = $('#back-to-top');
const desktopLinks = $$('.desktop-nav a');
let scrollQueued = false;
function updateScrollUI() {
  const scrollable = document.documentElement.scrollHeight - window.innerHeight;
  const progress = scrollable > 0 ? window.scrollY / scrollable : 0;
  if (progressBar) progressBar.style.transform = `scaleX(${Math.min(1, Math.max(0, progress))})`;
  backToTop?.classList.toggle('is-visible', window.scrollY > 620);
  scrollQueued = false;
}
window.addEventListener('scroll', () => {
  if (!scrollQueued) { requestAnimationFrame(updateScrollUI); scrollQueued = true; }
}, { passive: true });
updateScrollUI();
backToTop?.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));

const sectionObserver = 'IntersectionObserver' in window ? new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (!entry.isIntersecting) return;
    const id = entry.target.id;
    desktopLinks.forEach(link => link.classList.toggle('is-active', link.getAttribute('href') === `#${id}`));
  });
}, { rootMargin: '-35% 0px -55% 0px', threshold: 0 }) : null;
$$('main section[id]').forEach(section => sectionObserver?.observe(section));

// Reveal only when motion is allowed; content remains visible without JS.
const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
if (!reduceMotion && 'IntersectionObserver' in window) {
  const revealObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) { entry.target.classList.add('is-visible'); revealObserver.unobserve(entry.target); }
    });
  }, { threshold: 0.12 });
  $$('.section-heading, .project-card, .about-visual, .about-copy, .capability-card, .focus-item, .github-panel, .process-step').forEach(el => {
    el.classList.add('reveal'); revealObserver.observe(el);
  });
} else {
  $$('.reveal').forEach(el => el.classList.add('is-visible'));
}

// Subtle cursor-following ambient light. Does not replace the system cursor.
let pointerFrame = 0;
window.addEventListener('pointermove', event => {
  if (event.pointerType !== 'mouse' || pointerFrame) return;
  pointerFrame = requestAnimationFrame(() => {
    root.style.setProperty('--pointer-x', `${event.clientX}px`);
    root.style.setProperty('--pointer-y', `${event.clientY}px`);
    pointerFrame = 0;
  });
}, { passive: true });

// Filter the featured work cards.
const filterButtons = $$('.filter-chip');
const projectCards = $$('.project-card[data-category]');
filterButtons.forEach(button => button.addEventListener('click', () => {
  const filter = button.dataset.filter;
  filterButtons.forEach(item => {
    const active = item === button;
    item.classList.toggle('is-active', active);
    item.setAttribute('aria-pressed', String(active));
  });
  projectCards.forEach(card => card.classList.toggle('is-hidden', filter !== 'all' && card.dataset.category !== filter));
}));

// Command palette: Ctrl/Cmd + K, Escape to close, and inline search.
const commandDialog = $('#command-dialog');
const commandTrigger = $('#command-trigger');
const commandSearch = $('#command-search');
const commandOptions = $('#command-options');
function openCommandPalette() {
  if (!commandDialog || typeof commandDialog.showModal !== 'function') return;
  if (!commandDialog.open) commandDialog.showModal();
  commandSearch.value = '';
  filterCommandOptions('');
  requestAnimationFrame(() => commandSearch.focus());
}
function filterCommandOptions(query) {
  const term = query.trim().toLowerCase();
  $$('[data-command]', commandOptions).forEach(option => {
    option.hidden = term && !option.textContent.toLowerCase().includes(term);
  });
}
commandTrigger?.addEventListener('click', openCommandPalette);
commandSearch?.addEventListener('input', event => filterCommandOptions(event.target.value));
commandOptions?.addEventListener('click', event => {
  const action = event.target.closest('[data-command]');
  if (!action) return;
  const target = action.dataset.command;
  if (target === 'github') return;
  commandDialog.close();
  document.getElementById(target)?.scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth' });
});
document.addEventListener('keydown', event => {
  if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'k') { event.preventDefault(); openCommandPalette(); }
  if (event.key === 'Escape') closeMobileMenu();
});

// Copy email with a graceful fallback.
const toast = $('#toast');
let toastTimeout;
function showToast(message) {
  if (!toast) return;
  toast.textContent = message;
  toast.classList.add('is-visible');
  clearTimeout(toastTimeout);
  toastTimeout = setTimeout(() => toast.classList.remove('is-visible'), 2200);
}
$('#copy-email')?.addEventListener('click', async event => {
  const email = event.currentTarget.dataset.email;
  try {
    await navigator.clipboard.writeText(email);
    showToast('Email address copied.');
  } catch {
    showToast(email);
  }
});

const year = $('#current-year');
if (year) year.textContent = String(new Date().getFullYear());

// This feature is non-essential: the site remains complete if GitHub is rate-limited or offline.
async function loadGitHubSnapshot() {
  const note = $('#github-note');
  const repoList = $('#repo-list');
  try {
    const headers = { Accept: 'application/vnd.github+json' };
    const [profileResponse, reposResponse] = await Promise.all([
      fetch('https://api.github.com/users/XOTahsin', { headers, cache: 'no-store' }),
      fetch('https://api.github.com/users/XOTahsin/repos?sort=updated&per_page=4&type=owner', { headers, cache: 'no-store' })
    ]);
    if (!profileResponse.ok || !reposResponse.ok) throw new Error('GitHub returned a non-success response.');
    const [profile, repos] = await Promise.all([profileResponse.json(), reposResponse.json()]);
    $('#github-name').textContent = profile.name || profile.login || 'XOTahsin';
    $('#github-bio').textContent = profile.bio || 'Public developer profile';
    const avatarImage = document.createElement('img');
    avatarImage.src = profile.avatar_url; avatarImage.alt = ''; avatarImage.referrerPolicy = 'no-referrer';
    $('#github-avatar').replaceChildren(avatarImage);
    $('#github-avatar').classList.add('has-avatar');
    $('#github-repos').textContent = Number(profile.public_repos || 0).toLocaleString();
    $('#github-followers').textContent = Number(profile.followers || 0).toLocaleString();
    $('#github-following').textContent = Number(profile.following || 0).toLocaleString();
    repoList.replaceChildren();
    repos.filter(repo => !repo.fork).slice(0, 4).forEach(repo => {
      const link = document.createElement('a');
      link.className = 'repo-item'; link.href = repo.html_url; link.target = '_blank'; link.rel = 'noopener noreferrer';
      const name = document.createElement('strong'); name.textContent = repo.name;
      const description = document.createElement('p'); description.textContent = repo.description || 'Public repository';
      const meta = document.createElement('div'); meta.className = 'repo-item-meta';
      const language = document.createElement('span'); language.textContent = repo.language || 'Project';
      const stars = document.createElement('span'); stars.textContent = `☆ ${repo.stargazers_count || 0}`;
      meta.append(language, stars); link.append(name, description, meta); repoList.append(link);
    });
    if (!repoList.children.length) repoList.textContent = 'No public repositories were returned.';
    if (note) note.textContent = 'Snapshot loaded from the public GitHub API. Counts reflect the profile response at the time of this visit.';
  } catch (error) {
    if (repoList) repoList.innerHTML = '<div class="repo-loading">GitHub data is temporarily unavailable. The profile link above is always available.</div>';
    if (note) note.textContent = 'Live data could not be loaded. This does not affect the rest of the portfolio.';
  }
}
loadGitHubSnapshot();
