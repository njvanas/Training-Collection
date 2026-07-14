import { useState } from 'react';
import { StylesView } from './components/StylesView';
import { ExercisesView } from './components/ExercisesView';
import { RoutinesView } from './components/RoutinesView';
import { exercises, routines, styles } from './lib/db';

type Tab = 'routines' | 'exercises' | 'styles';

const TABS: { id: Tab; label: string }[] = [
  { id: 'routines', label: 'Routines' },
  { id: 'exercises', label: 'Exercises' },
  { id: 'styles', label: 'Methodologies' },
];

function renderTab(tab: Tab) {
  switch (tab) {
    case 'routines':
      return <RoutinesView />;
    case 'exercises':
      return <ExercisesView />;
    case 'styles':
      return <StylesView />;
    default: {
      const exhaustive: never = tab;
      return exhaustive;
    }
  }
}

export function App() {
  const [tab, setTab] = useState<Tab>('routines');

  return (
    <div className="app">
      <header className="header">
        <h1>
          Iron <span className="accent">Legends</span> — Training Collection
        </h1>
        <p>
          A personal database of bodybuilding's greatest training methodologies —
          Dorian Yates' Blood &amp; Guts, Mike Mentzer's Heavy Duty, Ronnie
          Coleman's high-volume powerbuilding, and Greg Doucette's Harder Than Last
          Time. {styles.length} methodologies, {routines.length} routines, and{' '}
          {exercises.length} exercises to reference for your Hevy workouts.
        </p>
      </header>

      <nav className="tabs">
        {TABS.map((t) => (
          <button
            key={t.id}
            className={`tab${tab === t.id ? ' active' : ''}`}
            onClick={() => setTab(t.id)}
          >
            {t.label}
          </button>
        ))}
      </nav>

      {renderTab(tab)}

      <footer className="footer">
        Train hard, recover fully, track everything. — inspired by the greats:
        Yates, Mentzer, Coleman &amp; Doucette.
      </footer>
    </div>
  );
}
