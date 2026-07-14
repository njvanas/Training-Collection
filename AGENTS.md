# AGENTS.md

## Project overview

Personal training database centered on Dorian Yates' **Blood & Guts** method.
Content is validated JSON (styles, exercises, routines) served by a Vite + React +
TypeScript app. See `README.md` for the data model, scripts, and how to add
content.

## Cursor Cloud specific instructions

- This is a single-service front-end app (no backend, no database, no external
  services). Everything runs from the JSON files in `src/data/`.
- Standard commands are documented in `README.md` / `package.json` scripts. Run
  the dev server with `npm run dev` (Vite serves at http://localhost:5173).
- The dependency install (`npm install`) is handled by the startup update script,
  so you normally don't need to run it manually.
- The "database" is the JSON in `src/data/`. Referential integrity (routine →
  exercise via `exerciseId`, routine → style via `styleId`) and schema validity
  are enforced by `src/lib/db.ts` and covered by `src/lib/db.test.ts` — run
  `npm test` after any data edit; it fails on bad or dangling data.
- When adding an exercise, set its `hevyName` to the exact label used in the Hevy
  app so routines map 1:1 to Hevy; routines reference exercises by `id`, not name.
- `npm run build` runs `tsc -b` first, so TypeScript errors will fail the build,
  not just the bundling step.
