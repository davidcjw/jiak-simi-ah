# 🍜 Jiak Simi Ah?

[![CI](https://github.com/davidcjw/jiak-simi-ah/actions/workflows/ci.yml/badge.svg)](https://github.com/davidcjw/jiak-simi-ah/actions/workflows/ci.yml)

> *"Jiak Simi Ah?"* — Singlish for "What to eat?"

[![Live Demo](https://img.shields.io/badge/Live%20Demo-jiak--simi--ah.vercel.app-orange?style=flat-square&logo=vercel)](https://jiak-simi-ah.vercel.app)
[![Next.js](https://img.shields.io/badge/Next.js-16-black?style=flat-square&logo=next.js)](https://nextjs.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-v4-38bdf8?style=flat-square&logo=tailwindcss)](https://tailwindcss.com/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-3178c6?style=flat-square&logo=typescript)](https://www.typescriptlang.org/)

A Singapore food decider web app for people (and groups) who can't make up their minds about where to eat. Finds highly-rated restaurants near your current location with smart filters and a spin-the-wheel randomiser.

## Features

| Feature | Description |
|---|---|
| 📍 Geolocation | Finds food near you; falls back to Singapore centre if denied |
| 🔍 Smart filters | Cuisine (16 types), budget ($/$$/$$$$), min rating, min reviews, radius |
| 🔃 Sort results | Toggle between top-rated or nearest-first ordering |
| 🎰 Spin the Wheel | Animated slot-machine randomiser picks from your results |
| 🎲 Feeling Lucky | Instant random pick with scroll-to-card highlight |
| 🟢 Open/Closed | Live status so you don't walk somewhere closed |
| 🗺️ Maps link | One tap to open directions in Google Maps |

## Getting Started

### Prerequisites

- Node.js 18+
- A **Google Places API (New)** key — [how to get one](https://console.cloud.google.com/)

### Installation

```bash
git clone https://github.com/davidcjw/jiak-simi-ah.git
cd jiak-simi-ah
npm install
cp .env.local.example .env.local
```

Edit `.env.local` and add your key:

```env
GOOGLE_PLACES_API_KEY=your_key_here
```

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Deployment

The app is deployed on [Vercel](https://vercel.com) via the GitHub integration.

To deploy your own copy:

1. Fork the repo
2. Import it in [vercel.com/new](https://vercel.com/new)
3. Add `GOOGLE_PLACES_API_KEY` under **Settings → Environment Variables**
4. Deploy

## Project Structure

```
app/
  page.tsx              # Main UI (client component)
  layout.tsx            # Root layout + metadata
  globals.css           # Tailwind v4 base styles
  api/places/route.ts   # Server-side Google Places proxy
components/
  FilterPanel.tsx       # Radius, price, rating, cuisine filters
  RestaurantCard.tsx    # Individual restaurant display card
  SpinWheel.tsx         # Animated randomiser
lib/
  types.ts              # Shared TypeScript interfaces
  cuisines.ts           # Cuisine definitions + price level mappings
```

## Environment Variables

| Variable | Required | Description |
|---|---|---|
| `GOOGLE_PLACES_API_KEY` | Yes | Google Places API (New) key — kept server-side only |

## Tech Stack

- [Next.js 16](https://nextjs.org/) — App Router, server-side API route for key security
- [Tailwind CSS v4](https://tailwindcss.com/) — CSS-first config (`@import "tailwindcss"`)
- [Google Places API (New)](https://developers.google.com/maps/documentation/places/web-service/op-overview) — Nearby Search with rating, price, and type filters
- TypeScript

## Contributing

Pull requests welcome. For major changes, open an issue first.

## License

MIT
