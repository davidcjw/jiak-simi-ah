import { NextRequest, NextResponse } from "next/server";
import { rateLimit, clientIp } from "@/lib/ratelimit";

// Server-side proxy for Google Places photo media. The Places API key must NEVER
// reach the browser, so the client receives `/api/photo?ref=<resource name>` and
// this route attaches the key server-side, fetches the image, and streams it back.
const PLACES_BASE = "https://places.googleapis.com/v1";

// Photo resource names look like `places/<id>/photos/<id>`. Constrain the input so
// it can only ever address the photo media endpoint (no SSRF via arbitrary paths).
const PHOTO_REF_RE = /^places\/[A-Za-z0-9_-]+\/photos\/[A-Za-z0-9_-]+$/;

export async function GET(req: NextRequest) {
  const apiKey = process.env.GOOGLE_PLACES_API_KEY;
  if (!apiKey) {
    return NextResponse.json({ error: "API key not configured" }, { status: 500 });
  }

  // Throttle abuse before hitting the paid Places Photo endpoint.
  const rl = rateLimit(`photo:${clientIp(req)}`, { limit: 120, windowMs: 60_000 });
  if (!rl.ok) {
    return NextResponse.json(
      { error: "Too many requests. Please slow down." },
      { status: 429, headers: { "Retry-After": String(rl.retryAfterSec) } },
    );
  }

  const ref = req.nextUrl.searchParams.get("ref");
  if (!ref || !PHOTO_REF_RE.test(ref)) {
    return NextResponse.json({ error: "Invalid photo reference" }, { status: 400 });
  }

  const url = `${PLACES_BASE}/${ref}/media?maxHeightPx=400&maxWidthPx=600&key=${apiKey}`;
  const upstream = await fetch(url);
  if (!upstream.ok || !upstream.body) {
    return NextResponse.json({ error: "Photo fetch failed" }, { status: 502 });
  }

  return new NextResponse(upstream.body, {
    status: 200,
    headers: {
      "Content-Type": upstream.headers.get("Content-Type") ?? "image/jpeg",
      // Photos are immutable for a given ref; let the browser/CDN cache them.
      "Cache-Control": "public, max-age=86400, s-maxage=86400, immutable",
    },
  });
}
