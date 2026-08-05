# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this is

TimeCapsule is a personal memory explorer that turns a user's downloaded Facebook archive into a searchable, interactive timeline. Users pick any month + day and immediately see every memory from that calendar day across all years of their history ("what was I doing every August 5?"), plus search, heatmaps, anniversary collections, AI summaries, year comparisons, and life-chapter grouping. Tagline: *Every day has a story. Rediscover yours.*

The application is **privacy-first and offline-first**: the user exports their Facebook archive (ZIP), imports it locally, and all parsing/indexing/AI runs on-device. No Facebook login, no cloud upload of personal data.

See `PRODUCT.md` for the full product vision, user stories, MVP scope, roadmap, and success metrics. This file is the engineering guidance; that file is the product source of truth.

## Commands

None yet. The repository is at concept / pre-implementation stage (created 2026-08-05). There is no package.json, no build, no test, no lint tooling.

When implementation begins, document the install/run/test/lint/deploy commands here, including how local secrets/env vars (if any) are supplied. Prefer stating plainly what tooling does *not* exist rather than leaving it to be discovered by trial.

## Architecture

Not implemented. Planned shape for MVP (from `PRODUCT.md`):

**Import**
- Facebook ZIP download
- JSON parser over the archive contents (posts, photos, videos, check-ins, etc.)

**Core**
- Calendar picker (month + day)
- Same-day-across-years filter / timeline stack
- Full-text search (captions, locations, tags; comments optional)
- Photo viewer
- Calendar heatmap (activity density per day)

**AI (local / on-device)**
- Memory summaries ("you posted about university admissions almost every August 2015–2018")
- Theme extraction
- Year-over-year comparison
- Mood estimation (later)
- Life-chapter grouping (later)

**Hard constraints that must survive into the first real architecture**
- All personal data stays on the user's device.
- No network calls that transmit archive contents or derived personal data.
- No Facebook OAuth / login flow.
- Import path must tolerate incomplete or partially corrupted archives gracefully.

When real code lands, replace this section with concrete file paths, entry points, and how the layers connect (parser → index → query UI → AI summarizer). Name the specific functions/modules a future edit would actually touch.

## Conventions to preserve when editing

- **Privacy is non-negotiable.** Never introduce a cloud path, telemetry that includes memory content, or a requirement for the user to stay online after import. If a future feature needs a model that cannot run locally, surface the trade-off explicitly and keep the core offline path intact.
- Prefer local-first data structures that can be rebuilt from the original ZIP (idempotent re-import) over opaque binary caches that become the only source of truth.
- Keep the product voice human and nostalgic, not corporate or surveillance-adjacent. UI copy and AI summary tone should help the user *rediscover*, not *analyze themselves like a dataset*.
- Do not invent product scope beyond what is written in `PRODUCT.md` without checking with the user; the vision is deliberately large and the MVP is deliberately small.
