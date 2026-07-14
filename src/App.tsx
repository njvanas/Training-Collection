import { useState } from 'react';
import { StylesView } from './components/StylesView';
import { ExercisesView } from './components/ExercisesView';
import { PlansView } from './components/PlansView';
import { HevyFoldersView } from './components/HevyFoldersView';
import {
  exercises,
  getLegendRoutines,
  hevyFolders,
  styles,
} from './lib/db';

type Tab = 'methodologies' | 'plans' | 'hevy' | 'exercises';

const TABS: { id: Tab; label: string }[] = [
  { id: 'methodologies', label: 'Methodologies' },
  { id: 'plans', label: 'Training Plans' },
  { id: 'hevy', label: 'Hevy Folders' },
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

export function App() {
  const [tab, setTab] = useState<Tab>('methodologies');
  const planCount = getLegendRoutines().length;

  return (
    <div className="app">
      <header className="hero">
        <h1>
          Iron <span className="accent">Legends</span>
        </h1>
        <p>
          A public reference for bodybuilding&apos;s greatest training
          methodologies — Dorian Yates, Mike Mentzer, Ronnie Coleman, and Greg
          Doucette. Read how each legend trained, browse complete plans with
          every warm-up and working set spelled out, or open ready-made folders
          in Hevy.
        </p>
        <div className="hero-stats">
          <div className="hero-stat">
            <div className="n">{styles.length}</div>
            <div className="l">Methodologies</div>
          </div>
          <div className="hero-stat">
            <div className="n">{planCount}</div>
            <div className="l">Training plans</div>
          </div>
          <div className="hero-stat">
            <div className="n">{exercises.length}</div>
            <div className="l">Exercises</div>
          </div>
          <div className="hero-stat">
            <div className="n">{hevyFolders.length}</div>
            <div className="l">Hevy folders</div>
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
        Iron Legends — train hard, recover fully, track everything. Methodology
        research for lifters everywhere.
      </footer>
    </div>
  );
}
