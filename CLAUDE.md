# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this is

TimeCapsule is a personal memory explorer that turns a user's downloaded Facebook archive into a searchable, interactive timeline. Users pick any month + day and immediately see every memory from that calendar day across all years of their history ("what was I doing every August 5?"), plus search, heatmaps, anniversary collections, year comparisons, and (later) AI summaries and life-chapter grouping. Tagline: *Every day has a story. Rediscover yours.*

The application is **privacy-first and offline-first**: the user exports their Facebook archive (ZIP), imports it locally, and all parsing/indexing/AI runs on-device. No Facebook login, no cloud upload of personal data.

See `PRODUCT.md` for the full product vision, user stories, MVP scope, roadmap, and success metrics. This file is the engineering guidance; that file is the product source of truth.

## Commands

```bash
npm install          # install dependencies
npm run dev          # start Vite dev server (http://localhost:5173)
npm run build        # production build
npm run preview      # preview production build
```

No test runner or lint command is wired yet. When added, document them here.

There are currently **no environment variables or secrets** required. The app is designed to run fully offline after the initial `npm install`.

## Architecture (current)

**Entry**
- `index.html` → `src/main.tsx` → `src/App.tsx`

**Data**
- `src/lib/types.ts` — Memory, Mood, ViewMode, etc.
- `src/data/sampleMemories.ts` — rich demo data used until a real Facebook ZIP is imported

**UI surfaces (MVP-aligned)**
- Any-Day Explorer + Timeline Stack (primary UVP)
- Calendar Heatmap (activity density, clickable into Explorer)
- Search (captions, locations, people, tags)
- Anniversary Collections
- Compare Years
- Import screen (demo + placeholder for real ZIP)

**Hard constraints that must survive**
- All personal data stays on the user's device.
- No network calls that transmit archive contents or derived personal data.
- No Facebook OAuth / login flow.
- Import path must tolerate incomplete or partially corrupted archives gracefully.

## Conventions to preserve when editing

- **Privacy is non-negotiable.** Never introduce a cloud path, telemetry that includes memory content, or a requirement for the user to stay online after import. If a future feature needs a model that cannot run locally, surface the trade-off explicitly and keep the core offline path intact.
- Prefer local-first data structures that can be rebuilt from the original ZIP (idempotent re-import) over opaque binary caches that become the only source of truth.
- Keep the product voice human and nostalgic, not corporate or surveillance-adjacent. UI copy and AI summary tone should help the user *rediscover*, not *analyze themselves like a dataset*.
- Do not invent product scope beyond what is written in `PRODUCT.md` without checking with the user; the vision is deliberately large and the MVP is deliberately small.

## Audit system

Structured review lives under `audits/`. Start with `audits/CHARTER.md` and `audits/ROSTER.md` before running any specialist pass.
