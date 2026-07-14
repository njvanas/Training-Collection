import { useState } from 'react';
import { getHevyFolder, getPersonalRoutines, hevyFolders, myCollection } from '../lib/db';
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
        <h3 className="mini-heading">Hevy folders ({hevyFolders.length})</h3>
        <div className="folder-grid">
          {hevyFolders.map((folder) => {
            const indexedCount = routines.filter(
              (r) => r.hevyFolderId === folder.id,
            ).length;
            const hevyCount = folder.routinesInHevy.length;
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
                    {indexedCount > 0
                      ? `${indexedCount} indexed`
                      : `${hevyCount} in Hevy`}
                  </span>
                </div>
                {folder.note ? <p className="sub folder-note">{folder.note}</p> : null}
                <ul className="folder-routines">
                  {folder.routinesInHevy.map((title) => (
                    <li key={title}>{title}</li>
                  ))}
                </ul>
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

      <section className="indexed-routines">
        <h3 className="mini-heading">Indexed routines — Bulk like Dorian</h3>
        <p className="sub section-lead">
          Full set schemes for the main bulk folder. Other folders open in Hevy
          above.
        </p>
        <RoutineIndex entries={myCollection.splitOverview} activeId={activeId} />
      </section>

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
