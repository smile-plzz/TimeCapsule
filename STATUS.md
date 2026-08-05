# TimeCapsule — live status

> Rewrite this file to match reality after material changes. Not append-only (history → `CHANGELOG.md`).
> Cross-machine digest also lives in claude-hub `repos/TimeCapsule/STATUS.md` — keep the two aligned on state and next steps.

**Verified against:** `main` @ `9d6d9c4` (2026-08-05)  
**Phase:** UI prototype + real ZIP parser · media resolution in progress · **not** full real-archive MVP yet

---

## One-liner

Privacy-first personal memory explorer: any calendar day across all years from a Facebook archive. Tagline: *Every day has a story. Rediscover yours.*

## Stack

| Layer | Choice |
|-------|--------|
| UI | React 19 + TypeScript + Vite 6 |
| Styling | Tailwind CSS 4 (`@tailwindcss/vite`) |
| Dates | `date-fns` |
| ZIP | `jszip` (wired in `facebookParser.ts`) |
| Icons | `lucide-react` |

**Commands:** `npm install` · `npm run dev` · `npm run build` · `npm run typecheck` · `npm run preview`  
**Secrets:** none

## What works now

| Surface | Status | Notes |
|---------|--------|--------|
| Any-Day Explorer + year stack | ✅ | Default Aug 5; UVP demoable |
| Calendar heatmap → explorer | ✅ | |
| Search (text, location, people, tags) | ✅ | |
| Anniversary collections | ✅ | Filter-based on sample set |
| Compare years | ✅ | Side-by-side same month/day |
| Import UI + privacy copy | ✅ | |
| Sample memories | ✅ | `src/data/sampleMemories.ts` |
| Real Facebook ZIP + JSON parse | ✅ | `parseFacebookZip` in `src/lib/facebookParser.ts`; soft-fail per file; HTML export rejected |
| Media path resolution / photo viewer | ⏳ | Next milestone — extract URIs + blob URLs from ZIP |
| On-device AI summaries | ❌ | Post-import |

## Architecture snapshot

```
index.html → src/main.tsx → src/App.tsx
src/lib/types.ts              Memory, Mood, ViewMode
src/lib/facebookParser.ts     ZIP → Memory[] (posts + basic fields)
src/components/ImportPanel.tsx  file picker + progress + privacy copy
src/data/sampleMemories.ts    demo corpus + COLLECTIONS
```

Import replaces the in-memory set and jumps to Explorer on the first memory’s day.

## Open risks / attention

1. **Media is the remaining critical path for “real archive” feel** — without resolved photos, imported posts are text-only.
2. **Parser is heuristic** — Meta JSON shapes vary by export year/region; needs fixture matrix (audit 03).
3. **No tests / lint scripts** — acceptable for prototype; add before ship gate (audits 02/03).
4. **Heatmap / collections are roadmap-leaning** — fine for demo; don’t block media work (audit 02).

## Next steps (ordered)

1. Media path resolution + in-flow photo viewer (extract `uri` from attachments → blob URL from ZIP).
2. Idempotent re-import polish + clearer multi-error / warning UX.
3. Local AI summaries with grounding + AI-off path (domain 05).
4. Run ship pack audits 01–05 on a real fixture archive.
5. Optional: people/tags extraction from tagged users and more post types.

## Pointers

| Doc | Role |
|-----|------|
| [`PRODUCT.md`](PRODUCT.md) | Product truth |
| [`CLAUDE.md`](CLAUDE.md) | Engineering guidance |
| [`CHANGELOG.md`](CHANGELOG.md) | Shipped history |
| [`docs/TRACKING.md`](docs/TRACKING.md) | How to keep status alive |
| [`audits/`](audits/) | Evaluation system |
