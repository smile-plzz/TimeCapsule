# TimeCapsule — Product Concept

**Tagline:** Every day has a story. Rediscover yours.

## Vision

TimeCapsule is a personal memory explorer that transforms a user’s Facebook archive into a searchable, interactive timeline. Instead of waiting for Facebook to remind you of memories, users can instantly travel to any date across all years and rediscover what happened.

The application works entirely offline using a downloaded Facebook archive, ensuring privacy while giving users powerful ways to revisit their digital history.

## Problem Statement

Current social media platforms present memories chronologically but don’t allow meaningful exploration.

Examples users cannot answer easily today:

- “What was I doing every August 5 for the last 15 years?”
- “How has my birthday changed every year?”

TimeCapsule solves this by indexing every memory and allowing users to search across years using the same calendar day.

## Target Users

**Primary**

People with 5–15+ years of Facebook history.

**Secondary**

- Digital journal enthusiasts
- Photographers
- Researchers
- Families
- Content creators
- Nostalgia lovers

## Core Features

### 1. Any-Day Explorer ⭐

Select month + day (e.g. August 5). Results show every year that had activity on that day — photos, status updates, trips, birthdays, lockdown posts, concerts, weddings — so the user sees their entire life on that day rather than a single algorithmic reminder.

### 2. Timeline Stack

Memories stacked vertically by year (2025 → 2009), making multi-year patterns immediately visible.

### 3. Calendar Heatmap

GitHub-style contribution graph. Each day encodes number of posts / photos / videos / check-ins. Clicking a square opens every memory from that day.

### 4. Anniversary Collections

Automatically generated collections such as “My Birthdays”, “My Eids”, “My New Year’s”, “My Valentine’s Days”, “My Exam Results”, “My Convocations”, “My Vacations”.

### 5. Search Everything

Free-text search over captions, locations, comments (optional), tagged friends, and (future) OCR inside photos.

### 6. Mood Timeline

AI estimates emotion (happy / sad / excited / quiet / celebration periods). Users can explore “happiest Augusts” or “stressful exam seasons”.

### 7. Compare Years

Side-by-side comparison of the same calendar day across two years (photos, posts, friends, locations, music, optional weather).

### 8. Life Chapters

AI groups memories into eras: High School → University → First Job → COVID → Marriage → Travel Era → Current Life.

### 9. Memory Replay

Select a year range and watch memories play automatically like a movie.

### 10. Relationship Timeline

Search a friend’s name and see every photo, tag, conversation reference, and trip together.

## AI Features

Beyond listing posts, AI explains patterns:

- “You posted about university admissions almost every August between 2015 and 2018.”
- “You travelled significantly more between 2017–2019.”
- “You gradually stopped posting text updates and began sharing photos.”

## Privacy

- Everything runs locally.
- No cloud upload of archive contents.
- No Facebook login.
- User imports their exported archive.
- All processing happens on-device.

## User Stories

1. As a long-time Facebook user, I want to select any calendar day so I can revisit memories from that date across every year.
2. As someone feeling nostalgic, I want AI to summarize what happened during a particular period so I can understand how my life has evolved.
3. As a photographer, I want to browse every picture taken on a specific day throughout the years so I can see how my photography has improved.
4. As a traveler, I want to search destinations across my archive so I can revisit every trip I’ve taken.
5. As a parent, I want to watch my child’s birthday memories from every year so I can experience their growth as one continuous story.
6. As a researcher, I want to analyze posting frequency, locations, and themes so I can understand long-term behavioral patterns.

## MVP Scope

**Import**
- Facebook ZIP
- JSON parser

**Core**
- Calendar picker
- Same-day-across-years filter
- Search
- Timeline
- Photo viewer

**AI**
- Memory summaries
- Theme extraction
- Year comparison

## Future Roadmap

- Instagram archive support
- Google Photos integration
- Apple Photos support
- WhatsApp exported chats
- X (Twitter) archive
- Threads archive
- Email timeline
- Spotify listening history
- Location history
- “This Week Through the Years” view
- AI-generated autobiography
- Printable memory books
- Shared family timelines

## Success Metrics

- Import completion rate >95%
- First memory discovery in under 60 seconds
- Users revisit the app multiple times per month
- High engagement with AI-generated memory summaries
- Average session duration exceeding 10 minutes for users with large archives

## Unique Value Proposition

Unlike Facebook Memories, which shows one day from the past, TimeCapsule lets users search their entire digital life by date, theme, place, person, or emotion. It turns a static archive into an interactive personal history browser, giving users control over how they rediscover their memories rather than relying on algorithmic reminders.
