# Champion Quest

A Loldle-inspired League of Legends champion guessing game built with React + Vite.

## Features

- Unlimited champion guessing
- Classic comparison clues (gender, position, class, resource, range, region, release year)
- Quote clue unlocks after 5 guesses
- Ability icon clue unlocks after 11 guesses
- Cropped splash-art clue unlocks after 17 guesses
- Newest guess appears at the top of the comparison grid
- Champion portraits are loaded from Riot Data Dragon instead of being stored as local PNGs
- Locke is included in the 173-champion roster
- Local browser statistics (played, wins, streaks)

## Run locally

```bash
npm install
npm run dev
```

## Build

```bash
npm run build
```

Champion portraits, ability icons, and splash art use Riot's Data Dragon/CDN URLs. If Riot changes the Data Dragon version or asset paths, update the version constants in the app.
