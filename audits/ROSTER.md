# TimeCapsule specialist roster — exclusive ownership matrix

Read with [`CHARTER.md`](CHARTER.md). **Each concern ID has exactly one owner (Domain × Role).**
If you are not the owner, handoff — do not dual-write.

Concern IDs are stable handles for tickets and anti-overlap declarations.

---

## 01 — Privacy & Trust

| Role | Specialist name | Exclusive concerns (only these) |
|------|-----------------|----------------------------------|
| **Dev** | `01-Dev Privacy Engineer` | `P-NET` network surfaces in code · `P-DEP` dependency phone-home risk · `P-AI-PATH` local vs remote inference wiring · `P-WIPE` delete-all-data implementation · `P-LOG` log redaction hooks |
| **QA** | `01-QA Privacy Verifier` | `P-TEST-OFFLINE` core flows with network blocked · `P-TEST-EXFIL` traffic/assert no archive upload · `P-TEST-OPTIN` optional remote is opt-in · `P-REGRESS` privacy regression fixtures |
| **Support** | `01-Support Trust Writer` | `P-COPY` privacy onboarding/settings strings · `P-HELP` “how we handle your ZIP” help · `P-DISCLOSE` accurate claims vs overclaim · `P-WIPE-UX` user instructions to wipe data |

**Out of scope for 01:** parser performance (→03), AI factual grounding (→05), JTBD (→06).

---

## 02 — MVP Scope & Ship

| Role | Specialist name | Exclusive concerns |
|------|-----------------|--------------------|
| **Dev** | `02-Dev Scope Builder` | `S-SURFACE` implement only MVP surfaces · `S-CUT` technical deferral of roadmap features · `S-FLAG` feature flags for non-MVP · `S-DEMO-HOOK` hooks needed for golden-path demo |
| **QA** | `02-QA Ship Gate` | `S-GOLDEN` golden-path pass/fail · `S-MVP-MAP` feature↔MVP traceability matrix · `S-REGRESS-SCOPE` roadmap UI not leaking into default path · `S-METRIC` measurable time-to-first-memory on fixture |
| **Support** | `02-Support Ship Narrator` | `S-DEMO-SCRIPT` external demo script · `S-README-SCOPE` README matches shipped scope · `S-FAQ-SCOPE` “why isn’t X built” answers · `S-RELEASE-NOTES` what this version is / is not |

**Out of scope for 02:** privacy exfil tests (→01), ZIP format edge cases (→03), retention IA (→08).

---

## 03 — Archive & Import

| Role | Specialist name | Exclusive concerns |
|------|-----------------|--------------------|
| **Dev** | `03-Dev Import Pipeline` | `I-PARSE` JSON/HTML parser design · `I-MEDIA` media path resolution · `I-STREAM` memory/streaming strategy · `I-IDEM` re-import/idempotency · `I-ERR` per-file soft-fail behavior |
| **QA** | `03-QA Archive Realism` | `I-FIX` fixture matrix (sparse, large, missing media, non-English) · `I-FAIL` failure-mode table pass/fail · `I-PERF` import duration/memory on reference size · `I-TZ` same-calendar-day timezone cases |
| **Support** | `03-Support Export Guide` | `I-EXPORT-DOC` Facebook export instructions · `I-FORMAT` supported format statements · `I-PROGRESS-UX` progress/error user language · `I-RECOVER` “import failed, try this” flows |

**Out of scope for 03:** AI summary quality (→05), market positioning (→06), visual nostalgia polish (→04) except import empty states owned by Support here.

---

## 04 — Memory Experience

| Role | Specialist name | Exclusive concerns |
|------|-----------------|--------------------|
| **Dev** | `04-Dev Experience Implementer` | `X-DAY-UI` day/timeline stack UI structure · `X-NAV` primary navigation to Any-Day Explorer · `X-MEDIA-VIEW` photo viewer in-flow · `X-PERF-UI` scroll/virtualization for long stacks · `X-A11Y` basic a11y hooks |
| **QA** | `04-QA Experience Tester` | `X-FIRST` first-session task success · `X-SCAN` multi-year scannability checks · `X-EMPTY` empty-state correctness · `X-TONE-CHECK` flag clinical/analytics copy in UI (report only) |
| **Support** | `04-Support Voice & Microcopy` | `X-VOICE` product voice strings · `X-EMPTY-COPY` empty/error microcopy · `X-SUGGEST` suggested-day labels · `X-ONBOARD-LIGHT` minimal post-import orientation copy |

**Out of scope for 04:** network privacy (→01), parser bugs (→03), AI hallucination (→05).

---

## 05 — AI Integrity

| Role | Specialist name | Exclusive concerns |
|------|-----------------|--------------------|
| **Dev** | `05-Dev AI Grounding` | `A-RETRIEVE` retrieval/citation wiring · `A-PROMPT` prompt constraints & abstention · `A-OFF` AI-off / degrade path · `A-INJECT` untrusted caption handling · `A-REMOTE` if remote: minimize payload (still subject to 01-Dev `P-AI-PATH`) |
| **QA** | `05-QA Factual Auditor` | `A-BLIND` grounded summary spot-checks · `A-SPARSE` sparse-data abstention tests · `A-OFF-TEST` core app with AI disabled · `A-HALL` documented hallucination cases |
| **Support** | `05-Support AI Disclosure` | `A-LABEL` “experimental / grounded in your posts” labeling · `A-HELP-AI` how summaries work · `A-SENSITIVE` careful language around hard life events · `A-DEFAULT` recommend default on/off copy |

**Handoff:** Remote inference enabled → **must** handoff network/opt-in proof to **01-QA** (`P-TEST-OPTIN`).

---

## 06 — Market Fit

| Role | Specialist name | Exclusive concerns |
|------|-----------------|--------------------|
| **Dev** | `06-Dev Fit Instrumentation` | `M-EVENT` local analytics events that measure fit *without* content exfil (coordinate `P-LOG`) · `M-EXPERIMENT` technical hooks for A/B or concierge tests · `M-CONSTRAINT` enforce Facebook-only scope in product surface |
| **QA** | `06-QA Fit Evidence` | `M-CLAIM` claims vs shipped reality checklist · `M-ALT` structured alternative comparison table accuracy · `M-BARRIER` export/install barrier observations from test runs |
| **Support** | `06-Support Positioning` | `M-JTBD` job-to-be-done wording · `M-PITCH` one-breath “why not Memories” · `M-SEGMENT` primary vs secondary audience copy · `M-CUT-LANG` remove unproven platform language |

**Out of scope for 06:** implementing import (→03), retention IA structure (→08) except messaging.

---

## 07 — Activation Flow

| Role | Specialist name | Exclusive concerns |
|------|-----------------|--------------------|
| **Dev** | `07-Dev Activation Path` | `V-DEFAULT` post-import default route to first day magic · `V-PROGRESS` import progress implementation · `V-SHORTCUT` suggested-day / deep-link into UVP · `V-RESUME` resume failed import |
| **QA** | `07-QA Funnel Timer` | `V-TIME` stage timing measurements · `V-DROP` drop-off reproduction · `V-GOLDEN-ACT` activation golden path · `V-WRONG-FMT` wrong export format UX test |
| **Support** | `07-Support Activation Guide` | `V-EXPORT-STEPS` step-by-step export guide · `V-FIRST-RUN` first-run copy sequence · `V-RECOVERY` activation failure help · `V-RETELL` one-sentence user retell test content |

**Overlap guard:** Export *format support* statements owned by **03-Support** (`I-FORMAT`); **07-Support** sequences steps and first-run narrative only.

---

## 08 — Retention Loop

| Role | Specialist name | Exclusive concerns |
|------|-----------------|--------------------|
| **Dev** | `08-Dev Habit Surfaces` | `R-IA` navigation hierarchy / primary hub · `R-RETURN` recents, suggested questions, warm index · `R-UPDATE` re-import/update library path · `R-LINK` cross-links day↔media↔search |
| **QA** | `08-QA Revisit Tests` | `R-SECOND` second-session task success · `R-LOOP` loop steps observable in build · `R-DEAD` dead-end navigation findings · `R-METRIC` local revisit proxies if any |
| **Support** | `08-Support Continuity Copy` | `R-RETURN-COPY` return entry messaging · `R-NEXT` post-success next action copy · `R-NO-GUILT` ban streak/guilt language · `R-STALE` “update your archive” user guidance |

**Out of scope for 08:** first-time export tutorial depth (→07), privacy wipe (→01).

---

## Quick handoff map

| If you notice… | Handoff to |
|----------------|------------|
| Traffic leaves machine / cloud AI | 01-Dev / 01-QA |
| Roadmap feature on default path | 02-QA / 02-Dev |
| ZIP parse / missing photo files | 03-Dev / 03-QA |
| Cold clinical UI / weak day stack | 04-Dev / 04-QA |
| Summary invents a trip | 05-QA / 05-Dev |
| Pitch promises Instagram | 06-Support / 02-Support |
| User lost before first wow | 07-* |
| No reason to open next week | 08-* |

---

## Pre-task declaration (copy-paste)

```
Domain: 0_
Role: Dev | QA | Support
Specialist: (name from table)
Concern IDs I own this task: …
Concern IDs I will handoff: …
Artifact under review: …
Evidence policy: Observed / Inferred / Unknown only
```
