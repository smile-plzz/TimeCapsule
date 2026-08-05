# TimeCapsule — live status

> Rewrite this file to match reality after material changes. Not append-only (history → `CHANGELOG.md`).
> Cross-machine digest also lives in claude-hub `repos/TimeCapsule/STATUS.md` — keep the two aligned on state and next steps.

**Verified against:** `main` @ `032bd56` (2026-08-05)  
**Phase:** UI prototype + demo data · **not** real-archive MVP yet

---

## One-liner

Privacy-first personal memory explorer: any calendar day across all years from a Facebook archive. Tagline: *Every day has a story. Rediscover yours.*

## Stack

| Layer | Choice |
|-------|--------|
| UI | React 19 + TypeScript + Vite 6 |
| Styling | Tailwind CSS 4 (`@tailwindcss/vite`) |
| Dates | `date-fns` |
| ZIP (planned) | `jszip` (dependency present; parser not wired) |
| Icons | `lucide-react` |

**Commands:** `npm install` · `npm run dev` · `npm run build` · `npm run preview`  
**Secrets:** none

## What works now (demo data)

| Surface | Status | Notes |
|---------|--------|--------|
| Any-Day Explorer + year stack | ✅ | Default Aug 5; UVP demoable |
| Calendar heatmap → explorer | ✅ | |
| Search (text, location, people, tags) | ✅ | |
| Anniversary collections | ✅ | Filter-based on sample set |
| Compare years | ✅ | Side-by-side same month/day |
| Import UI + privacy copy | ✅ | File picker present; real parse = alert stub |
| Sample memories | ✅ | `src/data/sampleMemories.ts` |
| Real Facebook ZIP/JSON parse | ❌ | Next milestone |
| Media resolution / photo viewer | ❌ | Needs archive paths |
| On-device AI summaries | ❌ | Post-import |

## Architecture snapshot

```
index.html → src/main.tsx → src/App.tsx
src/lib/types.ts          Memory, Mood, ViewMode
src/data/sampleMemories.ts  demo corpus + COLLECTIONS
```

Single-file UI for now (`App.tsx` holds views + `MemoryCard` + `Heatmap`). Split when ZIP pipeline lands.

## Open risks / attention

1. **Import is the critical path** — without ZIP parse, product is a polished demo only.
2. **`jszip` unused** — wire or drop to avoid false “ready” signal.
3. **No tests / lint scripts** — acceptable for prototype; add before ship gate (audits 02/03).
4. **Heatmap / collections are roadmap-leaning** — fine for demo; don’t block parser work (audit 02).

## Next steps (ordered)

1. Facebook ZIP + JSON parser → populate `Memory[]` from real export (domain 03).
2. Media path resolution + in-flow photo viewer.
3. Idempotent re-import + clear progress/error UX.
4. Local AI summaries with grounding + AI-off path (domain 05).
5. Run ship pack audits 01–05 on a real fixture archive.

## Pointers

| Doc | Role |
|-----|------|
| [`PRODUCT.md`](PRODUCT.md) | Product truth |
| [`CLAUDE.md`](CLAUDE.md) | Engineering guidance |
| [`CHANGELOG.md`](CHANGELOG.md) | Shipped history |
| [`docs/TRACKING.md`](docs/TRACKING.md) | How to keep status alive |
| [`audits/`](audits/) | Evaluation system |
