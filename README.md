# Tennis Scorer

One-tap tennis match scoring for your phone: 1st serve → Ace / In / Fault, 2nd serve → Ace / In / Double fault, then who won the point.
Configurable match (names, best of 1/3/5, games per set, tiebreak, match tiebreak, ad/no-ad, first server), multi-level undo,
save & resume several matches, history, and end-of-match stats (serve %, break points, streaks…) with share/copy.

All data stays on the device (localStorage). It is an offline-capable PWA: after the first visit it works without a connection.

## Use on iPhone
Open the GitHub Pages URL in Safari → Share → **Add to Home Screen**.

## Deploy
Push this folder to a GitHub repo, then Settings → Pages → Deploy from branch → `main` / `(root)`.
The site is a single `index.html` plus `sw.js`, `manifest.webmanifest` and icons — no build step.
When you change any file, bump `VERSION` in `sw.js` so installed copies update.
