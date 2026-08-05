# TimeCapsule

**Every day has a story. Rediscover yours.**

TimeCapsule is a personal memory explorer that transforms a user’s Facebook archive into a searchable, interactive timeline. Instead of waiting for Facebook to remind you of memories, you can instantly travel to any date across all years and rediscover what happened.

Everything runs **entirely offline** in your browser. No cloud upload. No Facebook login. Privacy first.

## Live Demo / Run Locally

```bash
git clone https://github.com/smile-plzz/TimeCapsule.git
cd TimeCapsule
npm install
npm run dev
```

Then open http://localhost:5173

## Features (MVP implemented)

- **Any-Day Explorer** — Pick any month + day and see every memory from that calendar day across all years (vertical Timeline Stack).
- **Calendar Heatmap** — GitHub-style contribution graph of your posting activity. Click any day to jump into the explorer.
- **Search Everything** — Full-text search across captions, locations, people, and tags.
- **Anniversary Collections** — Auto-generated collections for Birthdays, Eids, New Years, Valentines, Vacations, Graduations.
- **Compare Years** — Side-by-side view of the same calendar day in two different years.
- **Demo data** — Rich sample memories so you can explore the UI immediately.
- **Import UI** — Ready for Facebook ZIP; full JSON parser is the next milestone.

## Tech Stack

- React 19 + TypeScript
- Vite 8
- Tailwind CSS v4
- date-fns, lucide-react, clsx, JSZip

## Product Vision

Full product concept lives in [`PRODUCT.md`](PRODUCT.md).
Engineering guidance in [`CLAUDE.md`](CLAUDE.md).
Product audits in [`audits/`](audits/).

## Privacy

- No server required for core use
- No Facebook authentication
- Archive never leaves the device
- All processing is local

## License

MIT

---

Built for people who have years of digital history waiting to be rediscovered.
