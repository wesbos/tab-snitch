# Tab Snitch

Fake a browser tab's title and favicon. Bookmarkable decoy URLs so you can refresh and keep the prank going.

![Tab Snitch screenshot](docs/screenshot.png)

## URLs

- `/gmail/inbox-453` — preset favicon + title slug
- `/d/sentry.io/bug-report` — any domain's favicon + title slug
- `/` — the editor (also renders pre-filled on any decoy URL)

## Dev

```sh
npm install
npm run dev      # wrangler dev
npm run deploy   # wrangler deploy
```

Presets live in `src/presets.ts`; quick picks in `src/quickPicks.ts`.
