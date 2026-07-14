# Training Collection — Blood & Guts

A personal training database built around Dorian Yates' **Blood & Guts**
high-intensity method. It catalogs training **styles**, an **exercise** library,
and concrete **routines** (including my personal [Hevy](https://hevy.com/folder/1619207)
"Bulk like Dorian" folder) so I can reference them while programming workouts.

The data lives as validated JSON and is served by a small React app for easy
browsing and searching.

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

## Tech stack

Vite + React + TypeScript, Zod for schema validation, Vitest for tests, ESLint
for linting.
