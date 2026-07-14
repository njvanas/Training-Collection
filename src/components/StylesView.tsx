import { styles } from '../lib/db';
import { titleCase } from '../lib/format';

export function StylesView() {
  return (
    <div>
      {styles.map((style) => (
        <div key={style.id} style={{ marginBottom: 32 }}>
          <div className="section">
            <h2>{style.name}</h2>
            <p className="sub">Created by {style.creator}</p>
            <p className="principles">{style.summary}</p>
          </div>

          <div className="section">
            <h2>Principles</h2>
            <ul className="principles">
              {style.principles.map((p, i) => (
                <li key={i}>{p}</li>
              ))}
            </ul>
          </div>

          <div className="section">
            <h2>Guidelines</h2>
            <div className="grid">
              <div className="card">
                <h3>Frequency</h3>
                <p className="sub">Training days: {style.guidelines.trainingDaysPerWeek}</p>
                <p className="sub">Per muscle: {style.guidelines.frequencyPerMuscle}</p>
              </div>
              <div className="card">
                <h3>Warm-ups</h3>
                <p className="sub">{style.guidelines.warmupProtocol}</p>
              </div>
              <div className="card">
                <h3>Working sets</h3>
                <p className="sub">{style.guidelines.workingSetProtocol}</p>
              </div>
              <div className="card">
                <h3>Rep ranges</h3>
                <div className="chips">
                  {style.guidelines.repRanges.map((r, i) => (
                    <span className="chip" key={i}>
                      {r.target}: {r.range}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {style.intensityTechniques.length > 0 ? (
            <div className="section">
              <h2>Intensity techniques</h2>
              <div className="chips">
                {style.intensityTechniques.map((t) => (
                  <span className="chip accent" key={t}>
                    {titleCase(t)}
                  </span>
                ))}
              </div>
            </div>
          ) : null}

          <div className="section">
            <h2>Weekly split</h2>
            <div className="grid">
              {style.splitOverview.map((day) => (
                <div className="card" key={day.day}>
                  <h3>{day.day}</h3>
                  <p className="sub">{day.focus}</p>
                </div>
              ))}
            </div>
          </div>

          {style.sources.length > 0 ? (
            <div className="section">
              <h2>Sources</h2>
              <ul className="principles">
                {style.sources.map((s) => (
                  <li key={s.url}>
                    <a href={s.url} target="_blank" rel="noreferrer">
                      {s.title}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ) : null}
        </div>
      ))}
    </div>
  );
}
