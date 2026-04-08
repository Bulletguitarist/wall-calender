# Wall Calendar — Playful & Modern

Interactive wall calendar built with **Next.js 14 App Router** + CSS Modules.

## What's New in v2

| Feature | Details |
|---|---|
| Flip animation | 3D rotateX on month change |
| Indian holidays | 15+ holidays with red dot + hover tooltip |
| Drag to select | Mousedown + drag across days to select range |
| Image upload | Click hero area to upload your own photo |
| 5 bold themes | Sunset, Ocean, Forest, Candy, Gold |
| Neo-brutalist UI | Bold borders, box-shadow, Syne font |

## Run Locally

```bash
npm install
npm run dev
# open http://localhost:3000
```

## Deploy to Vercel

```bash
npx vercel
```

## Project Structure

```
src/
├── app/
│   ├── layout.jsx
│   ├── page.jsx
│   └── globals.css
├── components/
│   ├── WallCalendar.jsx / .module.css
│   ├── HeroPanel.jsx    / .module.css   ← image upload + canvas gradient
│   ├── CalendarGrid.jsx / .module.css   ← flip anim + drag select + holidays
│   ├── NotesPanel.jsx   / .module.css
│   ├── ThemeBar.jsx     / .module.css
│   └── Spiral.jsx       / .module.css
├── hooks/
│   └── useCalendarStore.js   ← all state + localStorage
└── utils/
    ├── themes.js             ← theme configs + Indian holidays
    └── dates.js              ← calendar math
```

## How to Use

- **Select range**: Click start date → click end date (or drag)
- **Change theme**: Use the Vibe bar at the bottom
- **Upload photo**: Click the hero image area
- **Add notes**: Type in the left panel; range notes appear after selecting dates
- **Holidays**: Red dot on holiday dates, hover to see name
