"use client";

import { Restaurant } from "@/lib/types";
import Image from "next/image";

interface RestaurantCardProps {
  restaurant: Restaurant & { distanceKm: number };
  highlight?: boolean;
}

function PriceTag({ level }: { level: number | null }) {
  if (level === null) return null;
  return (
    <span className="text-green-600 font-semibold text-sm">
      {"$".repeat(level)}
      <span className="text-green-200">{"$".repeat(Math.max(0, 3 - level))}</span>
    </span>
  );
}

function Stars({ rating }: { rating: number }) {
  const full = Math.floor(rating);
  const half = rating % 1 >= 0.5;
  return (
    <span className="text-yellow-400 text-sm">
      {"★".repeat(full)}
      {half && "½"}
      <span className="text-gray-200">{"★".repeat(Math.max(0, 5 - full - (half ? 1 : 0)))}</span>
    </span>
  );
}

export default function RestaurantCard({ restaurant: r, highlight }: RestaurantCardProps) {
  const distLabel =
    r.distanceKm < 1
      ? `${Math.round(r.distanceKm * 1000)}m`
      : `${r.distanceKm.toFixed(1)}km`;

  return (
    <div
      className={`bg-white rounded-2xl overflow-hidden shadow-sm border transition-all hover:shadow-md ${
        highlight
          ? "border-red-500 ring-2 ring-red-300 shadow-red-100"
          : "border-green-100"
      }`}
    >
      {/* Photo */}
      <div className="relative h-40 bg-green-50">
        {r.photoReference ? (
          <Image
            src={r.photoReference}
            alt={r.name}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, 400px"
            unoptimized
          />
        ) : (
          <div className="h-full flex items-center justify-center text-5xl opacity-30">🍽️</div>
        )}
        {r.isOpenNow !== null && (
          <span
            className={`absolute top-2 right-2 text-xs font-semibold px-2 py-0.5 rounded-full ${
              r.isOpenNow
                ? "bg-green-500 text-white"
                : "bg-red-400 text-white"
            }`}
          >
            {r.isOpenNow ? "Open" : "Closed"}
          </span>
        )}
        {highlight && (
          <span className="absolute top-2 left-2 bg-red-600 text-white text-xs font-bold px-2 py-0.5 rounded-full animate-pulse">
            ✨ Picked!
          </span>
        )}
      </div>

      {/* Content */}
      <div className="p-4 space-y-2">
        <div className="flex items-start justify-between gap-2">
          <h3 className="font-bold text-gray-900 leading-tight">{r.name}</h3>
          <PriceTag level={r.priceLevel} />
        </div>

        {r.primaryType && (
          <span className="inline-block bg-green-50 text-green-700 text-xs px-2 py-0.5 rounded-full border border-green-100">
            {r.primaryType}
          </span>
        )}

        <div className="flex items-center gap-2">
          <Stars rating={r.rating} />
          <span className="text-sm text-gray-600">
            {r.rating.toFixed(1)} <span className="text-gray-400">({r.reviewCount.toLocaleString()})</span>
          </span>
        </div>

        {r.editorialSummary && (
          <p className="text-xs text-gray-500 line-clamp-2">{r.editorialSummary}</p>
        )}

        <div className="flex items-center justify-between pt-1">
          <span className="text-xs text-gray-400">📍 {distLabel} away</span>
          <div className="flex gap-2">
            {r.websiteUri && (
              <a
                href={r.websiteUri}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs text-green-700 hover:underline"
              >
                Website
              </a>
            )}
            <a
              href={r.googleMapsUri}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs bg-green-800 text-white px-2 py-1 rounded-lg hover:bg-green-900 transition-colors"
            >
              Maps →
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
