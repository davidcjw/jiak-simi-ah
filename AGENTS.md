<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

# Jiak Simi Ah — Agent Guide

## What this app does

Singapore-only food decider. User grants geolocation → filters (cuisine, price, rating, reviews, radius) → calls Google Places API (New) Nearby Search → displays results → optional spin-the-wheel randomiser.

## Stack

- **Next.js 16** (App Router) with **Tailwind CSS v4** (`@import "tailwindcss"` syntax — no `tailwind.config.ts`)
- **React 19** — use `"use client"` only where browser APIs or state are needed; the API route is server-side
- **TypeScript strict mode**

## Key files

| File | Purpose |
|---|---|
| `app/page.tsx` | Main page — all state lives here; client component |
| `app/api/places/route.ts` | Server-side proxy for Google Places Nearby Search; keeps API key off the client |
| `components/FilterPanel.tsx` | Controlled filter UI (radius, price, rating, reviews, cuisine) |
| `components/RestaurantCard.tsx` | Displays one restaurant; accepts `highlight` prop for picked state |
| `components/SpinWheel.tsx` | Slot-machine style randomiser; calls `onResult` callback when done |
| `lib/types.ts` | Shared interfaces (`Restaurant`, `FilterState`, `PlacesApiPlace`, etc.) |
| `lib/cuisines.ts` | Cuisine list with Google Places `includedTypes` mappings; also `RADIUS_OPTIONS` and price level maps |

## API route contract

**POST `/api/places`**

Request body:
```json
{
  "lat": 1.3521,
  "lng": 103.8198,
  "radius": 1000,
  "priceLevels": [1, 2],
  "cuisines": ["chinese", "malay"],
  "minRating": 3.5,
  "minReviews": 100
}
```

Response: `{ restaurants: Restaurant[] }` — each item also carries `distanceKm`.

`minReviews` is filtered client-side in the route (Google Places API does not support this natively). All other filters are passed to the Places API.

## Environment

`GOOGLE_PLACES_API_KEY` must be set — server-side only (no `NEXT_PUBLIC_` prefix). Without it the API route returns a 500.

## Cuisine mapping

Each cuisine in `lib/cuisines.ts` maps an ID (e.g. `"japanese"`) to one or more Google Places `includedTypes` strings (e.g. `["japanese_restaurant", "sushi_restaurant", "ramen_restaurant"]`). When no cuisines are selected, the route falls back to `["restaurant", "food"]`.

## What NOT to do

- Do not move `GOOGLE_PLACES_API_KEY` to a `NEXT_PUBLIC_` variable — it would expose the key in the browser bundle.
- Do not call the Google Places API directly from the client — always go through `/api/places`.
- Do not add a `tailwind.config.ts` — this project uses Tailwind v4's CSS-based config.
- Do not change the `@import "tailwindcss"` in `globals.css` to the v3 `@tailwind` directives.

## Running locally

```bash
cp .env.local.example .env.local   # add your API key
npm run dev
```

## Linting & type checking

```bash
npm run lint
npx tsc --noEmit
```

Both must pass before considering a change ready.

## API protection

`app/api/places/route.ts` proxies the **paid** Google Places API, so it's guarded by
`lib/ratelimit.ts` (`rateLimit`/`clientIp`): a per-IP rate limit (30/min → 429 +
`Retry-After`) after the API-key check, before the Places call. The limiter is in-memory /
per-instance (zero-dep) — for hard, edge-level protection add a **Vercel WAF rate-limit
rule** (free on Hobby; blocks before the paid call runs).
