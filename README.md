# Moda Management

Two static sites, no build step.

- `/` — Staff console + member portal (prototype; localStorage data, no real auth). Open `index.html`.
- `/website` — Public marketing site. Open `website/index.html`.

## Deploy on Vercel
Two projects from this repo:
- Console: Root Directory `.`, Framework Preset **Other**, no build command, output `.`
- Website: Root Directory `website`, Framework Preset **Other**, no build command, output `.`

Each folder has its own `vercel.json`. Swap photos in `assets/photos/` with real photography before launch.
