# Domain 03 — Archive & Import

**Primary question:** Will messy real Facebook exports load — and what breaks when they don’t?

**Process:** [`CHARTER.md`](CHARTER.md) · **Ownership:** [`ROSTER.md`](ROSTER.md) §03  
**Do not run as one blended agent.**

## Team (exclusive — no overlap)

| Role | Specialist | Owns |
|------|------------|------|
| **Dev** | `03-Dev Import Pipeline` | `I-PARSE` `I-MEDIA` `I-STREAM` `I-IDEM` `I-ERR` |
| **QA** | `03-QA Archive Realism` | `I-FIX` `I-FAIL` `I-PERF` `I-TZ` |
| **Support** | `03-Support Export Guide` | `I-EXPORT-DOC` `I-FORMAT` `I-PROGRESS-UX` `I-RECOVER` |

Handoff AI quality → 05 · activation *sequence* copy → 07 (format support statements stay here as `I-FORMAT`).

---

## Checklist

### Format & parsing

- [ ] Supported export format/version documented
- [ ] Unknown fields soft-tolerated
- [ ] Timestamp/timezone strategy stated
- [ ] Common memory model for posts/photos/videos/check-ins
- [ ] Per-file soft-fail without aborting whole import

### Scale & media

- [ ] Progress UI · reasonable memory use · index time acceptable
- [ ] Media paths resolved; missing media placeholders
- [ ] Re-import idempotent; cancel leaves clear state; full wipe possible

### Edge probes

- Sparse years · photo-only · non-English/RTL · export without comments · midnight timezone on same-calendar-day

## Output by role

**Dev:** parser/media/stream design changes  
**QA:** fixture matrix + failure-mode table + perf notes  
**Support:** export guide + format + recovery language  

```markdown
# 03 Archive Import — {Dev|QA|Support} — <date / commit>
## Declaration
## Findings
## Handoffs
## Severity list
```
