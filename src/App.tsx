import { useState } from 'react';
import { ExercisesView } from './components/ExercisesView';
import { HevyFoldersView } from './components/HevyFoldersView';
import { LegendsExplorer } from './components/LegendsExplorer';
import { ThemeToggle } from './components/ThemeToggle';
import type { Theme } from './lib/theme';

type Tab = 'legends' | 'hevy' | 'exercises';

const TABS: { id: Tab; label: string }[] = [
  { id: 'legends', label: 'Legends' },
  { id: 'hevy', label: 'My Routines' },
  { id: 'exercises', label: 'Exercises' },
];

function renderTab(tab: Tab) {
  switch (tab) {
    case 'legends':
      return <LegendsExplorer />;
    case 'hevy':
      return <HevyFoldersView />;
    case 'exercises':
      return <ExercisesView />;
    default: {
      const exhaustive: never = tab;
      return exhaustive;
    }
  }
}

type AppProps = {
  initialTheme: Theme;
};

export function App({ initialTheme }: AppProps) {
  const [tab, setTab] = useState<Tab>('legends');

  return (
    <div className="app">
      <div className="atmosphere" aria-hidden />

      <header className="chrome">
        <a className="chrome-brand" href="#top">
          Iron <span>Legends</span>
        </a>
        <nav className="chrome-nav" aria-label="Main sections">
          {TABS.map((t) => (
            <button
              key={t.id}
              type="button"
              className={`chrome-link${tab === t.id ? ' active' : ''}`}
              onClick={() => setTab(t.id)}
            >
              {t.label}
            </button>
          ))}
        </nav>
        <ThemeToggle initialTheme={initialTheme} />
      </header>

      <main id="top" className="main">
        {tab !== 'legends' ? (
          <section className="page-masthead">
            <h1 className="page-masthead-title">
              {tab === 'hevy' ? 'My Routines' : 'Exercises'}
            </h1>
            <p className="page-masthead-copy">
              {tab === 'hevy'
                ? 'Open your personal Hevy folders to log workouts.'
                : 'Browse the shared exercise library used across legend routines.'}
            </p>
          </section>
        ) : null}
        {renderTab(tab)}
      </main>

      <footer className="footer">
        Iron Legends — train hard, recover fully, track everything.
      </footer>
    </div>
  );
}
