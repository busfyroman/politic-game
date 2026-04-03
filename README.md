# Kradni a Vládni 🏛️💰

Satirická browser hra o slovenských politikoch. Top-down GTA 1 štýl, Canvas 2D engine, reálne fotky a voice klipy politikov.

## Spustenie lokálne

```bash
# 1. Nainštaluj závislosti
npm install

# 2. Spusti dev server
npm run dev

# 3. Otvor v prehliadači
open http://localhost:3000
```

## Production build

```bash
npm run build
npm run start
```

## Deploy na Vercel

### Cez Vercel Dashboard (odporúčané)

1. Choď na [vercel.com](https://vercel.com) a prihlás sa cez GitHub
2. Klikni **"Add New Project"**
3. Importuj repo **`busfyroman/politic-game`**
4. Vercel automaticky detekuje Next.js — nechaj všetko default:
   - **Framework Preset:** Next.js
   - **Build Command:** `next build`
   - **Output Directory:** `.next`
5. Klikni **"Deploy"**
6. Po pár minútach bude hra live na `politic-game.vercel.app`

### Cez Vercel CLI (alternatíva)

```bash
# Nainštaluj Vercel CLI
npm i -g vercel

# Prihlás sa
vercel login

# Deploy (z root priečinka projektu)
vercel

# Production deploy
vercel --prod
```

## Tech Stack

- **Framework:** Next.js 16 (App Router)
- **Rendering:** Canvas 2D (custom game engine)
- **Jazyk:** TypeScript
- **Štýly:** Tailwind CSS
- **Audio:** Web Audio API + HTMLAudioElement

## Ovládanie

| Akcia | Klávesnica | Mobil |
|-------|-----------|-------|
| Pohyb | WASD / Šípky | Virtuálny joystick |
| Dash | Shift | Dash tlačidlo |
| Skill | Space | Skill tlačidlo |
| Zobrať | Automaticky (blízkosť) | Automaticky |

## Štruktúra projektu

```
├── app/
│   ├── page.tsx          # Landing page s výberom postavy
│   ├── game/page.tsx     # Herná stránka
│   ├── layout.tsx        # Root layout
│   └── globals.css       # Globálne štýly
├── components/
│   └── GameCanvas.tsx    # Hlavný herný komponent (Canvas 2D engine)
├── game/
│   ├── data/
│   │   └── gameConfig.ts # Levely, mapy, itemy, nepriatelia
│   └── utils/
│       └── sounds.ts     # Audio systém (SFX + voice klipy)
├── public/
│   ├── assets/photos/    # Fotky politikov
│   └── audio/            # Voice klipy (voice1-30.mp3)
└── package.json
```
