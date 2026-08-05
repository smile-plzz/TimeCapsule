# Live project tracking — how to keep docs true

TimeCapsule uses **two layers** of status. Update both when state changes materially.

## Layers

| Layer | Location | Audience | Style |
|-------|----------|----------|--------|
| **In-repo** | `STATUS.md`, `CHANGELOG.md` | Anyone cloning the project | `STATUS` = current truth (overwrite). `CHANGELOG` = append-only history |
| **Cross-machine** | claude-hub `repos/TimeCapsule/` | Future Claude/human sessions | `STATUS.md` short digest; `LOG.md` append; `references.md` pointers; `INDEX.md` one-line row |

Product/engineering truth does **not** live in status files:

- Product → `PRODUCT.md`
- Architecture/commands/invariants → `CLAUDE.md`
- Evaluation process → `audits/CHARTER.md` + `ROSTER.md`

## When to update

Update after any of:

- New milestone (e.g. ZIP parser works on a real export)
- Stack or architecture change
- Ship/blocker decision from an audit pass
- Parallel session leaves `main` different from what status describes

Skip pure typos and comment-only edits.

## In-repo checklist

1. **`STATUS.md`** — rewrite: phase, what works table, risks, ordered next steps, verified commit short SHA.
2. **`CHANGELOG.md`** — prepend a dated section (do not rewrite old entries).
3. **`CLAUDE.md`** — only if commands, architecture map, or invariants changed.
4. **`README.md`** — only if run instructions or “what works today” diverged.

## claude-hub checklist

1. `repos/TimeCapsule/STATUS.md` — mirror phase + next steps (keep shorter than in-repo STATUS).
2. `repos/TimeCapsule/LOG.md` — append one dated entry.
3. `repos/TimeCapsule/references.md` — if new canonical files appeared.
4. `INDEX.md` — refresh TimeCapsule row (last activity, state, needs attention).

## Status header convention

Keep this block at the top of in-repo `STATUS.md`:

```markdown
**Verified against:** `main` @ `<short-sha>` (<YYYY-MM-DD>)
**Phase:** <one phrase>
```

After editing, set short-sha from `git rev-parse --short HEAD`.

## Parallel sessions

If another session is coding:

1. Pull / re-read `main` before rewriting STATUS.
2. Prefer observed tree over assumptions (“parser planned” ≠ “parser works”).
3. Note unknown items under risks rather than inventing completion.

## Audit linkage

When an audit pass runs, record in CHANGELOG:

- Domain + role (e.g. `03-QA`)
- Verdict
- Blocker count (details can stay in issue/PR; status only needs the headline)

Do not paste full audit reports into STATUS.md.
