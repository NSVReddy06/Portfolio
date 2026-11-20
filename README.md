# Sai Vikas Reddy | Portfolio

A personal portfolio site built with Vite, React, Three.js (react-three-fiber) and Framer Motion.
It builds to a static `dist/` folder, so it can be hosted free on Vercel or Netlify.

## Run locally

```bash
npm install
npm run dev       # http://localhost:5173
npm run build     # production build in dist/
npm run preview   # serve the production build
```

## Edit content

All text, links, projects, skills and awards live in **`src/data.js`**.
To show LinkedIn and GitHub links, paste your URLs into `linkedin` and `github`.
Links left empty are hidden.

## Deploy

### Vercel
1. Push this folder to a GitHub repo.
2. On vercel.com, choose **Add New → Project** and import the repo.
3. Vercel detects Vite automatically (settings are in `vercel.json`). Click **Deploy**.

Or from the terminal: `npx vercel` (and `npx vercel --prod` for production).

### Netlify
1. Push this folder to a GitHub repo.
2. On app.netlify.com, choose **Add new site → Import an existing project** and pick the repo.
3. The build settings come from `netlify.toml` (`npm run build`, publish `dist`). Click **Deploy**.

Without Git: run `npm run build`, then drag the `dist/` folder onto app.netlify.com/drop.

## What's inside

| File | Purpose |
| --- | --- |
| `src/components/NeuralScene.jsx` | The 3D neural network background (WebGL shaders, travelling signals, mouse parallax, scroll motion) |
| `src/components/Skills.jsx` | Draggable 3D skill sphere (CSS 3D) and marquee |
| `src/components/ui.jsx` | Shared effects: reveal-on-scroll, text scramble, 3D tilt cards, magnetic buttons, counters, icons |
| `src/components/Hero.jsx`, `Navbar.jsx`, `Sections.jsx`, `Extras.jsx` | Page sections |
| `src/styles.css` | All styling |

Accessibility and performance:
- The 3D scene loads in a separate chunk after the page text.
- A static gradient replaces the 3D scene when WebGL isn't available.
- Animations slow down or stop when the OS "reduce motion" setting is on.
- Mobile devices get fewer particles.
