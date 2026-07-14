import { hevyFolders, myCollection } from '../lib/db';

export function HevyFoldersView() {
  return (
    <div className="collection-layout">
      <section className="collection-intro personal-intro">
        <div className="personal-badge">Personal collection</div>
        <h2 className="section-heading">{myCollection.name}</h2>
        <p className="sub">{myCollection.summary}</p>
        <p className="sub section-lead">
          These are my folders in Hevy — not legend reference routines. Tap a folder
          to open it in the app, save it to your profile, and start logging.
        </p>
      </section>

      <section className="hevy-folders personal-folders">
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
