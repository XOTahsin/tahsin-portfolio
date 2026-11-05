const root = document.documentElement;
const themeButton = document.querySelector('#theme-toggle');
let saved = null;
try { saved = localStorage.getItem('tahsin-theme'); } catch { /* Storage may be disabled. */ }
if (saved === 'light' || saved === 'dark') root.dataset.theme = saved;
function syncThemeControl() {
  const light = root.dataset.theme === 'light';
  themeButton?.setAttribute('aria-pressed', String(light));
  themeButton?.setAttribute('aria-label', light ? 'Switch to dark theme' : 'Switch to light theme');
}
syncThemeControl();
themeButton?.addEventListener('click', () => {
  root.dataset.theme = root.dataset.theme === 'light' ? 'dark' : 'light';
  try { localStorage.setItem('tahsin-theme', root.dataset.theme); } catch { /* Storage may be disabled. */ }
  syncThemeControl();
});
const bar = document.querySelector('#scroll-progress-bar');
let queued = false;
function updateProgress() {
  const total = document.documentElement.scrollHeight - innerHeight;
  const value = total > 0 ? scrollY / total : 0;
  if (bar) bar.style.transform = `scaleX(${Math.min(1, Math.max(0, value))})`;
  queued = false;
}
addEventListener('scroll', () => { if (!queued) { requestAnimationFrame(updateProgress); queued = true; } }, { passive: true });
updateProgress();
const year = document.querySelector('#current-year');
if (year) year.textContent = String(new Date().getFullYear());
