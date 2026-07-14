# Training Collection — Iron Legends

A personal training database of bodybuilding's greatest training methodologies. It
catalogs training **styles/methodologies**, an **exercise** library, and concrete
**routines** with exact splits, so I can reference them while programming workouts.

Methodologies currently covered:

- **Blood & Guts** — Dorian Yates (HIT, one all-out set beyond failure), including
  my personal [Hevy](https://hevy.com/folder/1619207) "Bulk like Dorian" folder.
- **Heavy Duty** — Mike Mentzer (HIT, one set to failure, long rest, Ideal &
  Consolidation routines).
- **High-Volume Powerbuilding** — Ronnie Coleman (heavy compounds + high volume,
  6-day split hitting each muscle twice).
- **Harder Than Last Time (HTLT)** — Greg Doucette (progressive overload,
  controlled tempo, train each muscle 2×/week, sustainability).

The data lives as validated JSON and is served by a small React app for easy
browsing, filtering by methodology, and searching.

## What's inside

- **Training style** — the Blood & Guts methodology: principles, guidelines
  (frequency, warm-up/working-set protocol, rep ranges), the weekly split, the
  intensity techniques (forced reps, rest-pause, negatives, drop sets, etc.), and
  sources.
- **Exercises** — a searchable library with primary/secondary muscles, equipment,
  compound/isolation category, execution cues, and Blood & Guts notes. Each
  exercise records its Hevy name so it maps 1:1 to the app.
- **Routines** — my personal Hevy days (Back, Chest + Biceps, Legs quad/ham,
  Shoulders + Triceps, Walking) plus classic Dorian Yates reference splits. Every
  slot lists sets, rep range, superset grouping, and the W1/W2/F1/F2 warm-up and
  failure-set weight scheme.

## Data model

All content is plain JSON under `src/data/`, validated at load time and in tests
with [Zod](https://zod.dev) schemas defined in `src/schema/`:

- `src/data/styles.json` — `TrainingStyle[]`
- `src/data/exercises.json` — `Exercise[]`
- `src/data/routines.json` — `Routine[]` (each `RoutineExercise` references an
  exercise by `id` and a routine references a style by `styleId`)

`src/lib/db.ts` loads and validates the files, exposes query helpers, and checks
referential integrity (no routine may reference an unknown exercise or style).

To add content, edit the relevant JSON file. `npm test` will fail if the data is
malformed or references break.

## Getting started

Requires Node.js 20+.

```bash
npm install      # install dependencies
npm run dev      # start the dev server at http://localhost:5173
```

## Scripts

| Command | Description |
| --- | --- |
| `npm run dev` | Start the Vite dev server (http://localhost:5173). |
| `npm run build` | Type-check and build the production bundle to `dist/`. |
| `npm run preview` | Preview the production build locally. |
| `npm run lint` | Run ESLint. |
| `npm run typecheck` | Type-check without emitting. |
| `npm test` | Run the Vitest data-integrity suite. |

## Automated workflow

This repo is set up so a plain-language request turns into a deployed change with
no manual build/deploy steps:

1. **Request** — describe the change (e.g. "add a push day", "bump the RDL to 4
   sets", "fix the calf rep range"). A Cursor cloud agent edits the JSON in
   `src/data/` (and any UI as needed).
2. **Verify** — the agent runs `npm run lint`, `npm run typecheck`, `npm test`,
   and `npm run build` locally, and the **CI** workflow
   (`.github/workflows/ci.yml`) re-runs them on every push/PR. `npm test`
   enforces schema validity and referential integrity, so broken data can't ship.
3. **Integrate** — the change lands on `main` (direct commit for quick edits, or a
   PR that gets merged once green).
4. **Deploy** — pushing to `main` triggers `.github/workflows/deploy.yml`, which
   builds and publishes to **GitHub Pages** at
   `https://njvanas.github.io/Training-Collection/`. The deploy self-enables Pages
   on first run, so there's nothing to toggle in settings.
5. **Maintain** — **Dependabot** (`.github/dependabot.yml`) opens weekly PRs to
   keep npm packages and GitHub Actions up to date; CI validates them
   automatically.

GitHub Actions used:

| Workflow | Trigger | Purpose |
| --- | --- | --- |
| `ci.yml` | push to `main`, PRs, manual | Lint, type-check, test, build (the review gate). |
| `deploy.yml` | push to `main`, manual | Build and deploy to GitHub Pages. |

## Tech stack

Vite + React + TypeScript, Zod for schema validation, Vitest for tests, ESLint
for linting, GitHub Actions for CI/CD, GitHub Pages for hosting.
