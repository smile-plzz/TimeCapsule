# TimeCapsule evaluation agents — unified system

**Start here → [`CHARTER.md`](CHARTER.md)** (roles, anti-overlap, anti-hallucination)  
**Then → [`ROSTER.md`](ROSTER.md)** (exclusive Dev / QA / Support ownership per domain)  
**Then → domain checklist `01`–`08`** for topic criteria only

---

## How the system is structured

```
CHARTER.md          ← process law (roles, severity, no blending, no inventing)
ROSTER.md           ← who owns which concern IDs (no overlap)
01…08 *.md          ← domain checklists + report templates
```

Each **domain** has exactly **three specialists**:

| Role | Focus |
|------|--------|
| **Dev** | How to build/fix it |
| **QA** | Whether it’s true / tested |
| **Support** | What users see and are told |

They never merge into one voice in a single answer. Parallel work is allowed **only** on different concern IDs.

---

## Domains

### Ship / quality

| ID | Domain | Checklist |
|----|--------|-----------|
| 01 | Privacy & Trust | [`01-privacy-trust.md`](01-privacy-trust.md) |
| 02 | MVP Scope & Ship | [`02-mvp-scope-ship.md`](02-mvp-scope-ship.md) |
| 03 | Archive & Import | [`03-archive-import.md`](03-archive-import.md) |
| 04 | Memory Experience | [`04-memory-experience.md`](04-memory-experience.md) |
| 05 | AI Integrity | [`05-ai-integrity.md`](05-ai-integrity.md) |

### Market fit & product flow

| ID | Domain | Checklist |
|----|--------|-----------|
| 06 | Market Fit | [`06-market-fit.md`](06-market-fit.md) |
| 07 | Activation Flow | [`07-activation-flow.md`](07-activation-flow.md) |
| 08 | Retention Loop | [`08-retention-loop.md`](08-retention-loop.md) |

---

## Before any task (mandatory)

1. Open `ROSTER.md` and pick **one** Domain × Role.
2. Paste the **pre-task declaration** from `ROSTER.md`.
3. Work **only** listed concern IDs; handoff the rest.
4. Use severity + evidence rules from `CHARTER.md`.

### Specialist invoke

```
You are {Domain ID} {Role} per audits/ROSTER.md and audits/CHARTER.md.
Checklist: audits/{01-08 file}.md
Artifact: {commit / PR / paths}
Declare concern IDs. Output only your role section. Handoff out-of-scope. No hallucinations.
```

### Full domain (three sequential passes)

```
Run domain 0X as Dev, then QA, then Support — separate answers, each re-declaring identity.
```

### Packs

| Pack | Domains | When |
|------|---------|------|
| Ship gate | 01–05 | Before calling a build shippable |
| Product strategy | 06–08 | Positioning, funnel, retention |
| Full launch | 01–08 | Public launch review |

Within a pack, still run **per specialist**, not one omniscient agent.

---

## Product truth

- [`../PRODUCT.md`](../PRODUCT.md) — vision, MVP, metrics  
- [`../CLAUDE.md`](../CLAUDE.md) — engineering invariants  
