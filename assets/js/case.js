(() => {
  const root = document.documentElement;
  const toggle = document.querySelector('.theme-toggle');
  const meta = document.querySelector('meta[name="theme-color"]');
  const setTheme = (theme) => {
    root.dataset.theme = theme;
    toggle?.setAttribute('aria-label', theme === 'night' ? 'Switch to paper theme' : 'Switch to night theme');
    meta?.setAttribute('content', theme === 'night' ? '#191a16' : '#f1eee4');
    try { localStorage.setItem('xotahsin-theme', theme); } catch (_) {}
  };
  try {
    const stored = localStorage.getItem('xotahsin-theme');
    if (stored === 'paper' || stored === 'night') setTheme(stored);
  } catch (_) {}
  toggle?.addEventListener('click', () => setTheme(root.dataset.theme === 'night' ? 'paper' : 'night'));
  const year = document.querySelector('#case-year');
  if (year) year.textContent = String(new Date().getFullYear());
})();
