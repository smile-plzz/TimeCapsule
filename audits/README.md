# TimeCapsule evaluation & audit agents

Specialized agents for evaluating TimeCapsule before and during ship.
Invoke any one (or a set) against the current tree, a PR, a demo build, or the product docs.

## Ship / quality audits

| Agent | File | Primary question |
|-------|------|------------------|
| **Privacy & Trust** | [`01-privacy-trust.md`](01-privacy-trust.md) | Does this still keep memories on-device and honest about it? |
| **MVP Scope & Ship** | [`02-mvp-scope-ship.md`](02-mvp-scope-ship.md) | Is this the smallest thing that proves the UVP, or are we building the roadmap? |
| **Archive & Import** | [`03-archive-import.md`](03-archive-import.md) | Will real Facebook ZIPs actually load, fast, and recover from mess? |
| **Memory Experience** | [`04-memory-experience.md`](04-memory-experience.md) | Does the first session feel like rediscovery, not a database browser? |
| **AI Integrity** | [`05-ai-integrity.md`](05-ai-integrity.md) | Do AI summaries help without inventing a life the user didn’t live? |

## Market fit & product flow evaluations

| Agent | File | Primary question |
|-------|------|------------------|
| **Market Fit** | [`06-market-fit.md`](06-market-fit.md) | Who is this for, what job does it own, and why not Memories/Photos instead? |
| **Activation Flow** | [`07-activation-flow.md`](07-activation-flow.md) | How fast from install/export to first multi-year “wow,” and where does the funnel break? |
| **Retention Loop** | [`08-retention-loop.md`](08-retention-loop.md) | After the first wow, why open it again — and does navigation support that loop? |

## How to run

Give the agent file + the artifact under review (code, PR diff, demo notes, or `PRODUCT.md` / `CLAUDE.md`) and ask it to produce the verdict section in its required output format.

Example prompt:

> You are the Market Fit evaluation agent defined in `audits/06-market-fit.md`. Review TimeCapsule’s product docs and current build. Produce the full evaluation report in the required output format.

### Suggested packs

- **Ship gate:** agents 01–05 (all blockers cleared)
- **Product strategy:** agents 06–08 (fit, activation, retention)
- **Full review:** 01–08 before calling a public launch

Treat any **Blocker** as non-negotiable; **Should-fix** can ship with a dated follow-up; **Nits** are optional.

## Source of truth

- Product vision & MVP: [`../PRODUCT.md`](../PRODUCT.md)
- Engineering invariants: [`../CLAUDE.md`](../CLAUDE.md)
