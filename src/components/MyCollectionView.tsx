import { useState } from 'react';
import { getHevyFolder, getPersonalRoutines, myCollection } from '../lib/db';
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
      </section>

      <section className="hevy-folders">
        <h3 className="mini-heading">Hevy folders</h3>
        <div className="folder-grid">
          {myCollection.hevyFolders.map((folder) => {
            const count = routines.filter((r) => r.hevyFolderId === folder.id).length;
            return (
              <a
                key={folder.id}
                className="folder-card"
                href={folder.url}
                target="_blank"
                rel="noreferrer"
              >
                <div className="folder-card-head">
                  <span className="folder-label">{folder.name}</span>
                  <span className="folder-count">
                    {count} routine{count === 1 ? '' : 's'}
                  </span>
                </div>
                {folder.note ? <p className="sub folder-note">{folder.note}</p> : null}
                <span className="folder-open">Open in Hevy →</span>
              </a>
            );
          })}
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
        {routines.map((routine, index) => {
          const folder = routine.hevyFolderId
            ? getHevyFolder(routine.hevyFolderId)
            : undefined;
          return (
            <RoutineCard
              key={routine.id}
              routine={{
                ...routine,
                source: folder
                  ? { name: folder.name, url: folder.url }
                  : routine.source,
              }}
              collapsible
              defaultOpen={index === 0}
              showStyle={false}
            />
          );
        })}
      </div>
    </div>
  );
}
