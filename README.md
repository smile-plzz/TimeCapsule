# TimeCapsule

**Every day has a story. Rediscover yours.**

TimeCapsule is a personal memory explorer that transforms a user’s Facebook archive into a searchable, interactive timeline. Instead of waiting for Facebook to surface a single memory, you can instantly travel to any date across all years of your history and see everything that happened that day — every year.

The app is privacy-first and offline-first: import your exported Facebook ZIP, and all parsing, indexing, and AI run on your device. No cloud upload. No Facebook login.

## Why this exists

Facebook Memories is passive — it only reminds you of *today’s* date. Questions like “What was I doing every August 5 for the last 15 years?” or “How has my birthday changed every year?” still require manual timeline browsing. TimeCapsule makes those questions answerable in one click.

## Status

Concept / pre-implementation (repository created 2026-08-05). Full product vision lives in [`PRODUCT.md`](PRODUCT.md). Engineering guidance for Claude Code lives in [`CLAUDE.md`](CLAUDE.md).

## MVP (planned)

- Import Facebook ZIP + JSON parser
- Calendar picker → same-day-across-years view
- Search, timeline stack, photo viewer
- Local AI summaries, theme extraction, year comparison

## Privacy promise

Your archive never leaves your machine. Processing is local. There is no Facebook authentication flow and no server that stores your memories.
