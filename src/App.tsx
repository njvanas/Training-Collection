import { useState } from 'react';
import { StylesView } from './components/StylesView';
import { ExercisesView } from './components/ExercisesView';
import { RoutinesView } from './components/RoutinesView';
import { MyCollectionView } from './components/MyCollectionView';
import {
  exercises,
  getPersonalRoutines,
  legendRoutines,
  styles,
} from './lib/db';

type Tab = 'my-hevy' | 'routines' | 'exercises' | 'styles';

const TABS: { id: Tab; label: string }[] = [
  { id: 'my-hevy', label: 'My Hevy' },
  { id: 'routines', label: 'Legend Routines' },
  { id: 'styles', label: 'Methodologies' },
  { id: 'exercises', label: 'Exercises' },
];

function renderTab(tab: Tab) {
  switch (tab) {
    case 'my-hevy':
      return <MyCollectionView />;
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
  const [tab, setTab] = useState<Tab>('my-hevy');
  const personalCount = getPersonalRoutines().length;

  return (
    <div className="app">
      <header className="header">
        <h1>
          Iron <span className="accent">Legends</span> — Training Collection
        </h1>
        <p>
          Your personal Hevy programming, plus reference splits and methodologies
          from Dorian Yates, Mike Mentzer, Ronnie Coleman, and Greg Doucette.{' '}
          {personalCount} personal routines, {legendRoutines.length} legend
          routines, {styles.length} methodologies, and {exercises.length}{' '}
          exercises.
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
