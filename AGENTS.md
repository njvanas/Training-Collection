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

## Automation workflow (how changes ship)

The owner wants a hands-off pipeline: they describe a change in plain language and
it should end up deployed. When acting on a request for this repo:

1. Make the edit (usually JSON in `src/data/`; UI under `src/` when needed).
2. Validate locally: `npm run lint`, `npm run typecheck`, `npm test`,
   `npm run build`. Do not ship if any fail — `npm test` guards data integrity.
3. Land it on `main`: small/low-risk data edits may be committed directly to
   `main`; larger changes go via a PR that is merged once CI is green. The owner
   has authorized committing and merging as needed for this project.
4. Deployment is automatic: any push to `main` runs `deploy.yml` and publishes to
   GitHub Pages (`https://njvanas.github.io/Training-Collection/`). `deploy.yml`
   self-enables Pages via `configure-pages` `enablement: true`, so no manual
   settings toggle is needed.
5. CI (`ci.yml`) runs lint/typecheck/test/build on every push and PR; Dependabot
   (`.github/dependabot.yml`) keeps deps and actions current.

Never force-push or rewrite published history. Prefer editing the JSON data over
hardcoding content in components.
