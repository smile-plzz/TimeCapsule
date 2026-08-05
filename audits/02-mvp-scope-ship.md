# Domain 02 — MVP Scope & Ship

**Primary question:** Is this the smallest product that proves *“any day across all years”*, or are we building the roadmap?

**Process:** [`CHARTER.md`](CHARTER.md) · **Ownership:** [`ROSTER.md`](ROSTER.md) §02  
**Do not run as one blended agent.** Three specialists, one identity per answer.

## Team (exclusive — no overlap)

| Role | Specialist | Owns |
|------|------------|------|
| **Dev** | `02-Dev Scope Builder` | `S-SURFACE` `S-CUT` `S-FLAG` `S-DEMO-HOOK` |
| **QA** | `02-QA Ship Gate` | `S-GOLDEN` `S-MVP-MAP` `S-REGRESS-SCOPE` `S-METRIC` |
| **Support** | `02-Support Ship Narrator` | `S-DEMO-SCRIPT` `S-README-SCOPE` `S-FAQ-SCOPE` `S-RELEASE-NOTES` |

Handoff privacy tests → 01 · ZIP edge cases → 03 · retention IA → 08.

---

## Official MVP (`PRODUCT.md`)

**Import:** Facebook ZIP + JSON parser  
**Core:** Calendar picker · same-day-across-years · search · timeline · photo viewer  
**AI:** Memory summaries · theme extraction · year comparison  

## Checklist

### Wedge integrity

- [ ] Any-Day Explorer works end-to-end on a real archive sample
- [ ] Timeline stack shows multiple years for the same month+day when data exists
- [ ] Search returns useful hits on MVP fields
- [ ] Photo viewer stays in-flow

### Scope discipline

- [ ] Roadmap features not blocking MVP polish
- [ ] AI degrades gracefully; date explore works without it
- [ ] README / PRODUCT match the build

### Ship mechanics

- [ ] Documented run path on a second machine
- [ ] Known failure modes listed
- [ ] Golden-path demo: import → birthday → multi-year stack → photo → one summary

## Output by role

**Dev:** cuts, flags, MVP surface list  
**QA:** golden path + MVP traceability matrix pass/fail  
**Support:** demo script, README/release scope language  

```markdown
# 02 MVP Ship — {Dev|QA|Support} — <date / commit>
## Declaration
## Findings
## Handoffs
## Severity list
```
