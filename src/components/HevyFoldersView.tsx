import { hevyFolders, myCollection } from '../lib/db';

export function HevyFoldersView() {
  return (
    <div className="collection-layout">
      <section className="collection-intro">
        <h2 className="section-heading">{myCollection.name}</h2>
        <p className="sub">{myCollection.summary}</p>
        <p className="sub section-lead">
          Tap a folder to open it in Hevy. Save it to your profile and log workouts
          there — no account needed to browse this site.
        </p>
      </section>

      <section className="hevy-folders">
        <div className="folder-grid">
          {hevyFolders.map((folder) => (
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
                  {folder.routinesInHevy.length} routine
                  {folder.routinesInHevy.length === 1 ? '' : 's'}
                </span>
              </div>
              {folder.note ? <p className="sub folder-note">{folder.note}</p> : null}
              <span className="folder-open">Open in Hevy →</span>
            </a>
          ))}
        </div>
      </section>
    </div>
  );
}
