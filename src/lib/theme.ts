export type Theme = 'light' | 'dark';

const STORAGE_KEY = 'iron-legends-theme';

export function getStoredTheme(): Theme | null {
  try {
    const value = localStorage.getItem(STORAGE_KEY);
    if (value === 'light' || value === 'dark') return value;
  } catch {
    /* private browsing or blocked storage */
  }
  return null;
}

export function getPreferredTheme(): Theme {
  return getStoredTheme() ?? 'light';
}

export function applyTheme(theme: Theme): void {
  document.documentElement.dataset.theme = theme;
  document.documentElement.style.colorScheme = theme;

  let meta = document.querySelector<HTMLMetaElement>(
    'meta[name="theme-color"][data-dynamic]',
  );
  if (!meta) {
    meta = document.createElement('meta');
    meta.name = 'theme-color';
    meta.dataset.dynamic = 'true';
    document.head.appendChild(meta);
  }
  meta.content = theme === 'dark' ? '#0f1117' : '#5b4fe8';
}

export function storeTheme(theme: Theme): void {
  try {
    localStorage.setItem(STORAGE_KEY, theme);
  } catch {
    /* ignore */
  }
}

export function initTheme(): Theme {
  const theme = getPreferredTheme();
  applyTheme(theme);
  return theme;
}
