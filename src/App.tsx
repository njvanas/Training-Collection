import { useState } from 'react';
import { StylesView } from './components/StylesView';
import { ExercisesView } from './components/ExercisesView';
import { PlansView } from './components/PlansView';
import { MyCollectionView } from './components/MyCollectionView';
import {
  exercises,
  getPersonalRoutines,
  getLegendRoutines,
  myCollection,
  styles,
} from './lib/db';

type Tab = 'my-hevy' | 'plans' | 'exercises' | 'styles';

const TABS: { id: Tab; label: string }[] = [
  { id: 'my-hevy', label: 'My Hevy' },
  { id: 'plans', label: 'Legend Plans' },
  { id: 'styles', label: 'Curators' },
  { id: 'exercises', label: 'Exercises' },
];

function renderTab(tab: Tab) {
  switch (tab) {
    case 'my-hevy':
      return <MyCollectionView />;
    case 'plans':
      return <PlansView />;
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
  const legendCount = getLegendRoutines().length;

  return (
    <div className="app">
      <header className="hero">
        <h1>
          Iron <span className="accent">Legends</span>
        </h1>
        <p>
          Your personal Hevy programming plus reference plans from bodybuilding's
          greatest — Dorian Yates, Mike Mentzer, Ronnie Coleman &amp; Greg
          Doucette. Pick a folder, follow the split, log it in Hevy.
        </p>
        <div className="hero-stats">
          <div className="hero-stat">
            <div className="n">{myCollection.hevyFolders.length}</div>
            <div className="l">Hevy folders</div>
          </div>
          <div className="hero-stat">
            <div className="n">{personalCount}</div>
            <div className="l">My routines</div>
          </div>
          <div className="hero-stat">
            <div className="n">{legendCount}</div>
            <div className="l">Legend plans</div>
          </div>
          <div className="hero-stat">
            <div className="n">{styles.length}</div>
            <div className="l">Curators</div>
          </div>
          <div className="hero-stat">
            <div className="n">{exercises.length}</div>
            <div className="l">Exercises</div>
          </div>
        </div>
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
