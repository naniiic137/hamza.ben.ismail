# HBI-OS — Hamza Ben Ismail's Portfolio

A pixel-art space odyssey portfolio. The universe behind the page is a real-time
Three.js scene rendered at low resolution, then upscaled with nearest-neighbour
filtering, Bayer-dithered and quantized to a fixed 24-colour palette — so the 3D
planets, gas giant, asteroid belt and satellite read as true pixel art.

**Live:** https://www.hamzabenismail.cloud-ip.cc

## Features

- **Pixel-shaded WebGL universe** — procedural planets (GLSL simplex/fbm noise), night-side city lights, clouds, atmosphere, banded gas giant with rings, instanced asteroid belt, orbiting moon + satellite, shooting stars, nebula sky.
- **Scroll-driven camera** — each section is a stop on a spline flight path (GSAP ScrollTrigger + Lenis smooth scroll).
- **Boot sequence**, HUD navigation, sector tracker and telemetry readout.
- **Procedural sprites** — every project gets a unique, animated "space invader" generated from its id.
- **Holographic portrait** — the profile photo is dithered into a pixel hologram in the browser; hover to decode.
- **Mission briefings** — project detail modal with a typed summary.
- **Interactive terminal** — `help`, `whoami`, `projects`, `neofetch`, `goto`, `hire`, `play`…
- **BUG INVADERS** — a hidden arcade game (PLAY button or the Konami code ↑↑↓↓←→←→BA), with keyboard and touch controls and a saved high score.
- **Chiptune SFX** synthesized live with WebAudio (off by default).
- Accessible: semantic HTML, keyboard navigation, focus styles, `prefers-reduced-motion` support, WebGL fallback.

## Stack

TypeScript · Vite · Three.js · GLSL · GSAP (ScrollTrigger) · Lenis · Fontsource

## Develop

```bash
npm install
npm run dev       # http://localhost:5173
npm run build     # type-check + production build to dist/
npm run preview   # serve the production build
```

## Editing content

All text — profile, projects, skills, experience — lives in
[`src/data/content.ts`](src/data/content.ts). Add a project there and its card,
sprite, filters, terminal listing and counts update automatically.

## Deploying

`.github/workflows/deploy.yml` builds the site and publishes `dist/` to GitHub
Pages on every push to `main`. One-time setup: **Settings → Pages → Build and
deployment → Source: GitHub Actions**. `public/CNAME` keeps the custom domain.
