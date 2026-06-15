import { NextRequest, NextResponse } from "next/server";
import { PlacesApiPlace, Restaurant } from "@/lib/types";
import { rateLimit, clientIp } from "@/lib/ratelimit";
import { CUISINES, PRICE_LEVEL_API_MAP, PRICE_LEVEL_MAP } from "@/lib/cuisines";

const PLACES_API_URL = "https://places.googleapis.com/v1/places:searchNearby";
const FIELD_MASK = [
  "places.id",
  "places.displayName",
  "places.rating",
  "places.userRatingCount",
  "places.priceLevel",
  "places.formattedAddress",
  "places.location",
  "places.types",
  "places.primaryTypeDisplayName",
  "places.currentOpeningHours",
  "places.photos",
  "places.googleMapsUri",
  "places.websiteUri",
  "places.editorialSummary",
].join(",");

function getDistanceKm(lat1: number, lng1: number, lat2: number, lng2: number) {
  const R = 6371;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLng = ((lng2 - lng1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLng / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

export async function POST(req: NextRequest) {
  const apiKey = process.env.GOOGLE_PLACES_API_KEY;
  if (!apiKey) {
    return NextResponse.json({ error: "API key not configured" }, { status: 500 });
  }

  // Throttle abuse before hitting the paid Google Places API.
  const rl = rateLimit(`places:${clientIp(req)}`, { limit: 30, windowMs: 60_000 });
  if (!rl.ok) {
    return NextResponse.json(
      { error: "Too many requests. Please slow down." },
      { status: 429, headers: { "Retry-After": String(rl.retryAfterSec) } },
    );
  }

  const { lat, lng, radius, priceLevels, cuisines, minRating, minReviews } = await req.json();

  // Build includedTypes from selected cuisines
  let includedTypes: string[] = [];
  if (cuisines && cuisines.length > 0) {
    const cuisineMap = Object.fromEntries(CUISINES.map((c) => [c.id, c.placeTypes]));
    includedTypes = cuisines.flatMap((id: string) => cuisineMap[id] ?? []);
  } else {
    includedTypes = ["restaurant"];
  }

  // Build price level filters
  const priceLevelFilter =
    priceLevels && priceLevels.length > 0
      ? priceLevels.map((p: number) => PRICE_LEVEL_API_MAP[p]).filter(Boolean)
      : undefined;

  const body: Record<string, unknown> = {
    locationRestriction: {
      circle: {
        center: { latitude: lat, longitude: lng },
        radius: Math.min(radius, 5000),
      },
    },
    maxResultCount: 20,
    rankPreference: "POPULARITY",
  };

  if (includedTypes.length > 0) {
    // API supports max 50 types; deduplicate
    body.includedTypes = [...new Set(includedTypes)].slice(0, 50);
  }

  if (minRating && minRating > 0) {
    body.minRating = minRating;
  }

  if (priceLevelFilter && priceLevelFilter.length > 0) {
    body.priceLevels = priceLevelFilter;
  }

  const res = await fetch(PLACES_API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Goog-Api-Key": apiKey,
      "X-Goog-FieldMask": FIELD_MASK,
    },
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    const errorText = await res.text();
    console.error("Places API error:", errorText);
    return NextResponse.json({ error: "Places API error", detail: errorText }, { status: res.status });
  }

  const data = await res.json();
  const places: PlacesApiPlace[] = data.places ?? [];

  const restaurants: (Restaurant & { distanceKm: number })[] = places
    .map((p) => {
      const priceNum = p.priceLevel ? (PRICE_LEVEL_MAP[p.priceLevel] ?? null) : null;
      const photoRef = p.photos?.[0]?.name ?? null;
      const placeLat = p.location.latitude;
      const placeLng = p.location.longitude;
      const distanceKm = getDistanceKm(lat, lng, placeLat, placeLng);

      return {
        id: p.id,
        name: p.displayName.text,
        rating: p.rating ?? 0,
        reviewCount: p.userRatingCount ?? 0,
        priceLevel: priceNum,
        address: p.formattedAddress ?? "",
        location: { lat: placeLat, lng: placeLng },
        types: p.types ?? [],
        primaryType: p.primaryTypeDisplayName?.text ?? "",
        isOpenNow: p.currentOpeningHours?.openNow ?? null,
        // Route through our server-side proxy so the API key never reaches the
        // browser (see app/api/photo/route.ts).
        photoReference: photoRef
          ? `/api/photo?ref=${encodeURIComponent(photoRef)}`
          : null,
        googleMapsUri: p.googleMapsUri ?? `https://maps.google.com/?q=${placeLat},${placeLng}`,
        websiteUri: p.websiteUri ?? null,
        editorialSummary: p.editorialSummary?.text ?? null,
        distanceKm,
      };
    })
    // Filter by minimum reviews client-side
    .filter((r) => r.reviewCount >= (minReviews ?? 0))
    // Filter by price level client-side — the Places API doesn't strictly enforce this
    .filter((r) => {
      if (!priceLevels || priceLevels.length === 0) return true;
      return r.priceLevel !== null && priceLevels.includes(r.priceLevel);
    })
    // Sort by rating desc, then review count desc
    .sort((a, b) => b.rating - a.rating || b.reviewCount - a.reviewCount);

  return NextResponse.json({ restaurants });
}
