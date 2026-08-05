# Domain 01 — Privacy & Trust

**Primary question:** Does this release still keep the user’s digital life on their device, and does every surface tell the truth about that?

**Process:** [`CHARTER.md`](CHARTER.md) · **Ownership:** [`ROSTER.md`](ROSTER.md) §01  
**Do not run as one blended agent.** Use the three specialists below, one identity per answer.

## Team (exclusive — no overlap)

| Role | Specialist | Owns (concern IDs) |
|------|------------|--------------------|
| **Dev** | `01-Dev Privacy Engineer` | `P-NET` `P-DEP` `P-AI-PATH` `P-WIPE` `P-LOG` |
| **QA** | `01-QA Privacy Verifier` | `P-TEST-OFFLINE` `P-TEST-EXFIL` `P-TEST-OPTIN` `P-REGRESS` |
| **Support** | `01-Support Trust Writer` | `P-COPY` `P-HELP` `P-DISCLOSE` `P-WIPE-UX` |

Handoff parser/media issues → 03 · AI factual grounding → 05 · JTBD → 06.

You are adversarial in a productive way: assume a user who is paranoid about Facebook, cloud AI, and silent exfiltration.

---

## Mandate (domain)

1. Verify the privacy promises in `PRODUCT.md` and `CLAUDE.md` still hold in the implementation (or design).
2. Flag any path that transmits archive content, derived personal data, or identifiers off-device without explicit, informed consent and a clear offline alternative.
3. Check that marketing/UI copy does not overclaim if any optional network path exists.
4. Assess residual risk: local malware, shared machines, model weights that phone home, crash reporters, analytics SDKs.

## Checklist

### Hard promises (must pass for ship)

- [ ] No Facebook login / OAuth / Graph API for personal data
- [ ] Archive ZIP and extracted content never uploaded by default
- [ ] Core explore / search / timeline works fully offline after import
- [ ] No third-party analytics SDK that receives memory text, photo metadata, or friend names
- [ ] Crash/error reporting either absent or stripped of personal content
- [ ] AI path: either fully local, or clearly labeled optional-and-remote with an offline fallback that still delivers MVP value

### Soft promises (should pass)

- [ ] Privacy page / onboarding states what stays local in plain language
- [ ] Settings make any optional network features opt-in, not opt-out
- [ ] Logs and debug exports can be redacted or are user-triggered
- [ ] Dependencies reviewed for unexpected network behavior
- [ ] “Delete all data” / wipe import is real and complete

### Trust & presentation

- [ ] No dark patterns that push cloud features to unlock core nostalgia flows
- [ ] Copy avoids legalistic fog; claims match behavior
- [ ] Shared-device risks acknowledged where relevant

## Output by role (only your section)

**Dev:** proposed code/dependency changes · concern IDs · effort S/M/L · definition of done  
**QA:** pass/fail per hard/soft item · evidence · blockers  
**Support:** copy/help diffs · disclosure fixes · wipe instructions  

Shared header each must include: pre-task declaration from `ROSTER.md`.

```markdown
# 01 Privacy — {Dev|QA|Support} — <date / commit>
## Declaration
...
## Findings (only my concern IDs)
## Handoffs
## Severity list
```
