import { useState } from 'react';
import { StylesView } from './components/StylesView';
import { ExercisesView } from './components/ExercisesView';
import { PlansView } from './components/PlansView';
import { HevyFoldersView } from './components/HevyFoldersView';
import { ThemeToggle } from './components/ThemeToggle';
import {
  exercises,
  getLegendRoutineGroups,
  getLegendRoutines,
  hevyFolders,
  styles,
} from './lib/db';
import type { Theme } from './lib/theme';

type Tab = 'methodologies' | 'plans' | 'hevy' | 'exercises';

const TABS: { id: Tab; label: string }[] = [
  { id: 'methodologies', label: 'Methodologies' },
  { id: 'plans', label: 'Training Routines' },
  { id: 'hevy', label: 'My Routines' },
  { id: 'exercises', label: 'Exercises' },
];

function renderTab(tab: Tab) {
  switch (tab) {
    case 'methodologies':
      return <StylesView />;
    case 'plans':
      return <PlansView />;
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
  const [tab, setTab] = useState<Tab>('methodologies');
  const routineCount = getLegendRoutineGroups().length;
  const workoutCount = getLegendRoutines().length;

  return (
    <div className="app">
      <header className="hero">
        <div className="hero-top">
          <ThemeToggle initialTheme={initialTheme} />
        </div>
        <h1>
          Iron <span className="accent">Legends</span>
        </h1>
        <p>
          A public reference for bodybuilding&apos;s greatest training
          methodologies — Dorian Yates, Mike Mentzer, Ronnie Coleman, and Greg
          Doucette. Read how each legend trained, browse complete training
          routines with every warm-up and working set spelled out, or open my
          personal Hevy folders to log your own workouts.
        </p>
        <div className="hero-stats">
          <div className="hero-stat">
            <div className="n">{styles.length}</div>
            <div className="l">Methodologies</div>
          </div>
          <div className="hero-stat">
            <div className="n">{routineCount}</div>
            <div className="l">Training routines</div>
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
            <div className="l">My routines</div>
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
        Iron Legends — train hard, recover fully, track everything. Methodology
        research for lifters everywhere.
      </footer>
    </div>
  );
}
