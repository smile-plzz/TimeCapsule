# Changelog

All notable project changes. Newest first.
Format: date · summary · optional commit range.

---

## 2026-08-05 — Status sync (parser is live)

- `STATUS.md` updated: real Facebook ZIP/JSON parser is implemented and wired through ImportPanel → App.
- Next priority reframed to media path resolution + in-flow photo viewer.
- CHANGELOG/STATUS no longer claim the import handler is stubbed.

## 2026-08-05 — Live tracking docs

- Added `STATUS.md` (current state), `CHANGELOG.md`, `docs/TRACKING.md` (update protocol).
- Aligns in-repo tracking with claude-hub cross-machine status.

## 2026-08-05 — Unified audit system

- `audits/CHARTER.md` — roles, anti-overlap, anti-hallucination.
- `audits/ROSTER.md` — exclusive Dev / QA / Support concern IDs per domain.
- Domains 01–08 bound to three specialists each (no blended agent).

## 2026-08-05 — Product evaluation agents

- Domains 06 Market Fit, 07 Activation Flow, 08 Retention Loop.

## 2026-08-05 — Ship audit agents

- Domains 01–05 (privacy, MVP scope, archive import, memory experience, AI integrity).

## 2026-08-05 — App prototype (parallel session)

- Vite + React 19 + TypeScript + Tailwind 4 scaffold.
- `src/App.tsx`: Any-Day Explorer, heatmap, search, collections, compare years, import UI.
- `src/data/sampleMemories.ts` demo corpus; golden path demoable without real ZIP.
- `jszip` + `facebookParser.ts` + `ImportPanel` for real JSON ZIP imports.
- README / CLAUDE.md updated for commands and current architecture.

## 2026-08-05 — Project foundation

- Repo created; `PRODUCT.md` full vision; initial `CLAUDE.md`; expanded README.
