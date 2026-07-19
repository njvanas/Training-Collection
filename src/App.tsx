import { useState } from 'react';
import { ExercisesView } from './components/ExercisesView';
import { HevyFoldersView } from './components/HevyFoldersView';
import { LegendsExplorer } from './components/LegendsExplorer';
import { ThemeToggle } from './components/ThemeToggle';
import {
  exercises,
  getLegendRoutineGroups,
  getLegendRoutines,
  hevyFolders,
  styles,
} from './lib/db';
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
  const routineCount = getLegendRoutineGroups().length;
  const workoutCount = getLegendRoutines().length;

  return (
    <div className="app">
      <div className="atmosphere" aria-hidden />

      <header className="hero">
        <div className="hero-top">
          <p className="hero-brand-mark">Iron Legends</p>
          <ThemeToggle initialTheme={initialTheme} />
        </div>
        <h1>
          Find how the
          <span className="accent"> legends </span>
          trained
        </h1>
        <p>
          Search a bodybuilder, open their methodology, and dig into every
          training routine with warm-ups, working sets, and failure protocols
          laid out clearly.
        </p>
        <div className="hero-stats" aria-label="Collection size">
          <div className="hero-stat">
            <div className="n">{styles.length}</div>
            <div className="l">Legends</div>
          </div>
          <div className="hero-stat">
            <div className="n">{routineCount}</div>
            <div className="l">Routines</div>
          </div>
          <div className="hero-stat">
            <div className="n">{workoutCount}</div>
            <div className="l">Workouts</div>
          </div>
          <div className="hero-stat">
            <div className="n">{exercises.length}</div>
            <div className="l">Exercises</div>
          </div>
          <div className="hero-stat">
            <div className="n">{hevyFolders.length}</div>
            <div className="l">My folders</div>
          </div>
        </div>
      </header>

      <nav className="tabs" aria-label="Main sections">
        {TABS.map((t) => (
          <button
            key={t.id}
            type="button"
            className={`tab${tab === t.id ? ' active' : ''}`}
            onClick={() => setTab(t.id)}
          >
            {t.label}
          </button>
        ))}
      </nav>

      {renderTab(tab)}

      <footer className="footer">
        Iron Legends — train hard, recover fully, track everything.
      </footer>
    </div>
  );
}
