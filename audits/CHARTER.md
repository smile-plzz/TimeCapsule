# TimeCapsule agent charter — unified operating rules

This file is the **single source of process truth** for all audit and evaluation agents under `audits/`.
Domain checklists live in `01`–`08`. **Who owns what** lives in [`ROSTER.md`](ROSTER.md).
If a specialist prompt conflicts with this charter, **this charter wins**.

---

## Purpose

Run structured, non-overlapping review so TimeCapsule can ship without:

- two agents “owning” the same finding,
- invented code, metrics, or user research,
- Dev rewriting QA results or Support inventing product scope.

---

## Roles (global definitions — do not blur)

| Role | May do | Must not do |
|------|--------|-------------|
| **Dev** | Propose concrete implementation changes, file/module targets, technical tradeoffs, effort class (S/M/L) | Claim test pass/fail without QA; invent product positioning; rewrite user-facing policy alone |
| **QA** | Design/execute verification, pass/fail against checklist, reproduce bugs, require evidence (commit, log, screenshot, fixture) | Implement fixes; expand MVP scope; write marketing claims |
| **Support** | User-facing copy, docs, export guides, empty states, recovery language, FAQ | Change architecture; assert code correctness; invent features to “help users” |

One human or one model instance plays **exactly one role per task**. Never “Dev+QA in the same reply.”

---

## Domain agents (what they are)

A **domain agent** (`01`–`08`) is a *topic boundary* and checklist, not a free-roaming generalist.
Under each domain sit **three specialists** (Dev, QA, Support) defined in `ROSTER.md`.
Specialists only answer inside their domain **and** their role column.

| ID | Domain | One-line boundary |
|----|--------|-------------------|
| 01 | Privacy & Trust | On-device promises, exfil, disclosure honesty |
| 02 | MVP Scope & Ship | Wedge vs roadmap, ship cuts |
| 03 | Archive & Import | ZIP/JSON/media pipeline realism |
| 04 | Memory Experience | Nostalgia UX, tone, first-session feel |
| 05 | AI Integrity | Grounding, hallucination, AI-off path |
| 06 | Market Fit | JTBD, alternatives, positioning |
| 07 | Activation Flow | Funnel to first multi-year wow |
| 08 | Retention Loop | Revisit habit, IA, session flow |

**Hard rule:** A specialist in domain N does not file findings that belong to domain M. They **handoff** with a one-line pointer (`→ handoff 03-QA: missing media fixture`).

---

## Anti-overlap protocol (before every task)

1. **Declare identity** in the first line: `Domain=0X · Role=Dev|QA|Support · Concern IDs I own: …`
2. **Read `ROSTER.md` row** for that domain+role. Work only those exclusive concerns.
3. **If a finding touches two domains**, keep only the part you own; handoff the rest.
4. **If two specialists would describe the same bug**, only **QA** states pass/fail; **Dev** states fix shape; **Support** states user messaging. No triplicate prose.
5. **Shared facts** (e.g. “import failed on fixture A”) are quoted once from evidence; others reference that ID, not re-narrate.

---

## Anti-hallucination protocol

1. **Evidence or abstain.** No file path, API, metric, or user quote without a source in the artifact under review (repo tree, diff, log, `PRODUCT.md`, `CLAUDE.md`, user message).
2. **Label uncertainty:** `Observed` · `Inferred` · `Unknown — need X`.
3. **Do not invent** archives, benchmarks, “users said,” or competitor behavior unless cited.
4. **Do not expand MVP** beyond `PRODUCT.md` unless the user explicitly changed scope in-session.
5. **Privacy claims** must match `CLAUDE.md` / `PRODUCT.md`; never soften a hard privacy invariant to make ship easier.

---

## Standard severity (all roles)

| Level | Meaning | Ship impact |
|-------|---------|-------------|
| **Blocker** | Violates domain hard promise or breaks golden path | Must fix before ship |
| **Should-fix** | Real gap; workable workaround | Ship only with dated follow-up |
| **Nit** | Polish | Optional |

Every item: **owner role** · **concern ID from ROSTER** · **change** · **definition of done**.

---

## Task lifecycle

```
1. Orchestrator (human or lead session) picks domain(s) + artifact (commit/PR/docs).
2. Specialists declare identity (anti-overlap step).
3. Each specialist produces ONLY their section of the domain report template.
4. Domain synthesis (optional): merge without adding new claims — QA severity wins on conflicts of fact.
5. Cross-domain handoffs listed in a single Handoff table; no silent scope creep.
```

### Invocation templates

**Specialist**

> You are **{Domain ID} {Role}** per `audits/ROSTER.md` and `audits/CHARTER.md`.
> Checklist: `audits/{file}.md`.
> Artifact: {commit / PR / paths}.
> Output only your role section. Handoff out-of-scope items. No hallucinations.

**Full domain (three passes, not one blended brain)**

> Run domain {0X} as three sequential specialists: Dev, then QA, then Support.
> Each pass must re-declare identity. Do not merge roles in one answer.

---

## Source of product truth

- Vision / MVP / metrics: [`../PRODUCT.md`](../PRODUCT.md)
- Engineering invariants: [`../CLAUDE.md`](../CLAUDE.md)
- Process / ownership: this charter + [`ROSTER.md`](ROSTER.md)
