import { useState } from 'react';
import { StylesView } from './components/StylesView';
import { ExercisesView } from './components/ExercisesView';
import { PlansView } from './components/PlansView';
import { exercises, routines, styles } from './lib/db';

type Tab = 'plans' | 'exercises' | 'styles';

const TABS: { id: Tab; label: string }[] = [
  { id: 'plans', label: 'Plans' },
  { id: 'exercises', label: 'Exercises' },
  { id: 'styles', label: 'Curators' },
];

function renderTab(tab: Tab) {
  switch (tab) {
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
  const [tab, setTab] = useState<Tab>('plans');

  return (
    <div className="app">
      <header className="hero">
        <h1>
          Iron <span className="accent">Legends</span>
        </h1>
        <p>
          Training plans from bodybuilding's greatest, each with the curator behind
          it — Dorian Yates, Mike Mentzer, Ronnie Coleman &amp; Greg Doucette. Find a
          plan, follow the exact split, and log it in Hevy.
        </p>
        <div className="hero-stats">
          <div className="hero-stat">
            <div className="n">{styles.length}</div>
            <div className="l">Curators</div>
          </div>
          <div className="hero-stat">
            <div className="n">{routines.length}</div>
            <div className="l">Plans</div>
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
