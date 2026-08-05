# TimeCapsule — live status

> Rewrite this file to match reality after material changes. Not append-only (history → `CHANGELOG.md`).

**Verified against:** `main` (2026-08-05)  
**Phase:** UI finalized (minimal collapsible) + real ZIP parser + media blobs · ship audits still open

---

## One-liner

Privacy-first personal memory explorer: any calendar day across all years from a Facebook archive. Tagline: *Every day has a story. Rediscover yours.*

## Stack

| Layer | Choice |
|-------|--------|
| UI | React 19 + TypeScript + Vite 6 |
| Styling | Tailwind CSS 4 + zinc minimal system |
| Dates | `date-fns` |
| ZIP | `jszip` |
| Icons | `lucide-react` |

**Commands:** `npm install` · `npm run dev` · `npm run build` · `npm run typecheck` · `npm run preview`  
**Secrets:** none

## What works now

| Surface | Status |
|---------|--------|
| Collapsible sidebar (desktop, persisted) | ✅ |
| Collapsible year groups (Any-Day) | ✅ |
| Any-Day Explorer + heatmap + search + collections + compare | ✅ |
| Modern minimal zinc UI + Inter | ✅ |
| Import UI + Facebook JSON ZIP parser + media blob resolution | ✅ |
| Sample memories / golden-path demo | ✅ |
| On-device AI summaries | ❌ |
| Ship audits 01–05 on real fixture | ❌ |

## Next steps (ordered)

1. Real archive fixture matrix (audit 03) + edge-case parser fixes.
2. Media lightbox + missing-media placeholders.
3. Local AI summaries with grounding + AI-off path (domain 05).
4. Ship pack audits 01–05.

## Pointers

| Doc | Role |
|-----|------|
| [`PRODUCT.md`](PRODUCT.md) | Product truth |
| [`CLAUDE.md`](CLAUDE.md) | Engineering guidance |
| [`CHANGELOG.md`](CHANGELOG.md) | Shipped history |
| [`audits/`](audits/) | Evaluation system |
