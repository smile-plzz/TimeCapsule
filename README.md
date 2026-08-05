# TimeCapsule

**Every day has a story. Rediscover yours.**

TimeCapsule turns a Facebook archive into a searchable, interactive personal timeline. Pick any calendar day and instantly see every memory from that day across all the years you have.

Privacy-first and offline-first: import happens locally, processing stays on your device, and there is no Facebook login.

## Run it

```bash
git clone https://github.com/smile-plzz/TimeCapsule.git
cd TimeCapsule
npm install
npm run dev
```

Open http://localhost:5173

Demo data is pre-loaded. On first visit a short onboarding explains how to get your real Facebook archive.

## What works today (MVP surfaces)

| Surface | Status |
|---------|--------|
| **Any-Day Explorer** + Timeline Stack | ✅ Working with demo data |
| **Calendar Heatmap** (clickable) | ✅ |
| **Search** (captions, locations, people, tags) | ✅ |
| **Anniversary Collections** | ✅ |
| **Compare Years** | ✅ |
| **Guided onboarding** (how / why / where to export) | ✅ |
| **Import UI** | ✅ UI + privacy messaging; real Facebook ZIP/JSON parser is the next milestone |
| Photo viewer for real media | Not yet (needs archive media resolution) |
| On-device AI summaries | Not yet |

## Golden-path demo (under 60 seconds)

1. Open the app → short onboarding (or skip) → land on **Any-Day Explorer** for August 5.
2. Scroll the vertical stack — memories from 2009 through 2025 appear for the same calendar day.
3. Switch to **Heatmap**, click a dense square → jumps back to Explorer for that day.
4. Try **Search** for “Japan” or “birthday”.
5. Open **Collections** → “My Birthdays”.

## How to get your real Facebook data

See the in-app onboarding or the full guide: [`docs/facebook-export-guide.md`](docs/facebook-export-guide.md)

**Critical:** request the archive in **JSON** format (not HTML).

## Product truth

- Full vision, user stories, MVP definition, and roadmap → [`PRODUCT.md`](PRODUCT.md)
- Engineering invariants and current architecture notes → [`CLAUDE.md`](CLAUDE.md)
- Structured evaluation system → [`audits/`](audits/)

## Privacy promise

- No server that receives your archive
- No Facebook authentication flow
- All processing intended to stay on-device

## Next engineering priorities (from PRODUCT.md + audits)

1. Real Facebook ZIP + JSON parser (domain 03) — **critical path**
2. Media path resolution + in-flow photo viewer
3. Local AI summaries that degrade gracefully (domain 05)

## License

MIT
