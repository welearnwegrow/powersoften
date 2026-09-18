# Powers of Ten: Our Universe

An educational card-sorting game. Arrange nine cards from the smallest known
length in physics to the scale of the observable universe — from the Planck
length (10⁻³⁵ m) to the co-moving diameter of the universe (10²⁶ m).

Based on the AstroEDU *Powers of Ten* card game by **Jaya Ramchandani**,
licensed CC BY-NC-SA 4.0.

## Play

Open `index.html` in a browser, or host the folder anywhere static
(GitHub Pages, Netlify, etc.).

- **Four levels** — Subatomic, Molecular, Human-scale, Cosmological.
- **Order the cards** smallest → largest: tap two cards to swap, or drag to reorder.
- **Ready** checks your order; a red arrow shows which way a misplaced card belongs.
- **Adaptive insights** explain how each card you got wrong compares in scale to its neighbours.
- **Stars** per level (3 = solved first try), a per-run timer, and a shared leaderboard.

## Files

```
index.html              The game (open this)
support.js              Runtime — must sit next to index.html
images/                 The 36 card photographs
cloudflare-worker/      Optional shared-leaderboard backend + setup guide
```

`index.html` loads `support.js` and the `images/` folder with relative paths,
so keep the three together.

## Hosting on GitHub Pages

1. Put the contents of this folder in your repository (at the root, or in `/docs`).
2. Repo **Settings → Pages** → choose the branch and folder → **Save**.
3. Your game goes live at `https://<username>.github.io/<repo>/`.

## Leaderboard

Scores are saved locally on each device by default. For a leaderboard shared
across all players, deploy the Cloudflare Worker in `cloudflare-worker/`
(step-by-step in its own `README.md`) and paste your Worker URL into the
`LB_ENDPOINT` line near the top of `index.html`. Leave it empty to stay local.

## Credits

Created by Jaya Ramchandani. Game design input by Chirag Ramchandani; content
input by Shermeen Lee; first-iteration design by Abrar Burk. Image credits are
listed in the game's About screen. Licensed CC BY-NC-SA 4.0 — co-branding is
welcome for commercial copies.
