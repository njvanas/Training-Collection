import { useState } from 'react';
import { getPersonalRoutines, myCollection } from '../lib/db';
import { RoutineCard } from './RoutineCard';
import { RoutineIndex } from './RoutineIndex';

export function MyCollectionView() {
  const routines = getPersonalRoutines();
  const [activeId, setActiveId] = useState<string | undefined>();

  return (
    <div className="collection-layout">
      <section className="collection-intro">
        <h2 className="section-heading">{myCollection.name}</h2>
        <p className="sub">{myCollection.summary}</p>
        <div className="collection-actions">
          <a
            className="collection-link"
            href={myCollection.hevyFolder.url}
            target="_blank"
            rel="noreferrer"
          >
            {myCollection.hevyFolder.name} →
          </a>
          {myCollection.hevyFolder.note ? (
            <p className="sub collection-note">{myCollection.hevyFolder.note}</p>
          ) : null}
        </div>
      </section>

      {myCollection.trainingNotes.length > 0 ? (
        <section className="collection-notes">
          <h3 className="mini-heading">How I program these days</h3>
          <ul className="principles">
            {myCollection.trainingNotes.map((note, i) => (
              <li key={i}>{note}</li>
            ))}
          </ul>
        </section>
      ) : null}

      <RoutineIndex entries={myCollection.splitOverview} activeId={activeId} />

      <div
        className="routine-list"
        onClick={(event) => {
          const target = event.target as HTMLElement;
          const article = target.closest<HTMLElement>('[id^="routine-"]');
          if (article?.id.startsWith('routine-')) {
            setActiveId(article.id.replace('routine-', ''));
          }
        }}
      >
        {routines.map((routine, index) => (
          <RoutineCard
            key={routine.id}
            routine={routine}
            collapsible
            defaultOpen={index === 0}
            showStyle={false}
          />
        ))}
      </div>
    </div>
  );
}
