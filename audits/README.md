# TimeCapsule audit agents

Five specialized auditors for evaluating TimeCapsule before and during ship.
Invoke any one (or all) against the current tree, a PR, a demo build, or the product docs.

| Agent | File | Primary question |
|-------|------|------------------|
| **Privacy & Trust** | [`01-privacy-trust.md`](01-privacy-trust.md) | Does this still keep memories on-device and honest about it? |
| **MVP Scope & Ship** | [`02-mvp-scope-ship.md`](02-mvp-scope-ship.md) | Is this the smallest thing that proves the UVP, or are we building the roadmap? |
| **Archive & Import** | [`03-archive-import.md`](03-archive-import.md) | Will real Facebook ZIPs actually load, fast, and recover from mess? |
| **Memory Experience** | [`04-memory-experience.md`](04-memory-experience.md) | Does the first session feel like rediscovery, not a database browser? |
| **AI Integrity** | [`05-ai-integrity.md`](05-ai-integrity.md) | Do AI summaries help without inventing a life the user didn’t live? |

## How to run

Give the agent file + the artifact under review (code, PR diff, demo recording notes, or `PRODUCT.md` / `CLAUDE.md`) and ask it to produce the **Ship verdict** section at the bottom of its template.

Example prompt:

> You are the Privacy & Trust audit agent defined in `audits/01-privacy-trust.md`. Review the current TimeCapsule codebase and docs. Produce the full audit report in the required output format.

Run all five before calling a build “shippable.” Treat any **Blocker** as non-negotiable; **Should-fix** items can ship with a dated follow-up; **Nits** are optional.

## Source of truth

- Product vision & MVP: [`../PRODUCT.md`](../PRODUCT.md)
- Engineering invariants: [`../CLAUDE.md`](../CLAUDE.md)
