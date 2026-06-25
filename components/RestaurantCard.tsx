"use client";

import { Restaurant } from "@/lib/types";
import { Card, Text, Tag, Badge, Button } from "@/lib/pulze-ds";
import Image from "next/image";

interface RestaurantCardProps {
  restaurant: Restaurant & { distanceKm: number };
  highlight?: boolean;
}

function PriceTag({ level }: { level: number | null }) {
  if (level === null) return null;
  return (
    <Text as="span" size="small" weight="semibold" style={{ color: "var(--pz-teal)" }}>
      {"$".repeat(level)}
      <span style={{ color: "var(--pz-line-strong)" }}>{"$".repeat(Math.max(0, 3 - level))}</span>
    </Text>
  );
}

function Stars({ rating }: { rating: number }) {
  const full = Math.floor(rating);
  const half = rating % 1 >= 0.5;
  return (
    <span style={{ color: "var(--pz-orange)", fontSize: "var(--pz-fs-small)", letterSpacing: "0.5px" }}>
      {"★".repeat(full)}
      {half && "½"}
      <span style={{ color: "var(--pz-line-strong)" }}>
        {"★".repeat(Math.max(0, 5 - full - (half ? 1 : 0)))}
      </span>
    </span>
  );
}

export default function RestaurantCard({ restaurant: r, highlight }: RestaurantCardProps) {
  const distLabel =
    r.distanceKm < 1
      ? `${Math.round(r.distanceKm * 1000)}m`
      : `${r.distanceKm.toFixed(1)}km`;

  return (
    <Card
      tone="paper"
      radius="lg"
      elevation="soft"
      interactive
      className="overflow-hidden"
      style={
        highlight
          ? { outline: "2px solid var(--pz-purple)", outlineOffset: "2px" }
          : undefined
      }
    >
      {/* Photo */}
      <div className="relative h-44" style={{ background: "var(--pz-cream)" }}>
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
          <div className="h-full flex items-center justify-center text-5xl opacity-20">🍽️</div>
        )}
        {highlight && (
          <span className="absolute top-3 left-3">
            <Badge color="purple" solid>✨ Picked!</Badge>
          </span>
        )}
        {r.isOpenNow !== null && (
          <span className="absolute top-3 right-3">
            {r.isOpenNow ? (
              <Badge color="teal" solid>Open</Badge>
            ) : (
              <Tag>Closed</Tag>
            )}
          </span>
        )}
      </div>

      {/* Content */}
      <div className="p-5 flex flex-col gap-2.5">
        <div className="flex items-start justify-between gap-3">
          <Text size="lead" weight="semibold" className="leading-snug">{r.name}</Text>
          <span className="shrink-0 pt-1"><PriceTag level={r.priceLevel} /></span>
        </div>

        {r.primaryType && <span><Tag>{r.primaryType}</Tag></span>}

        <div className="flex items-center gap-2">
          <Stars rating={r.rating} />
          <Text as="span" size="small" tone="muted">
            <span style={{ color: "var(--pz-ink)", fontWeight: 600 }}>{r.rating.toFixed(1)}</span>{" "}
            ({r.reviewCount.toLocaleString()})
          </Text>
        </div>

        {r.editorialSummary && (
          <Text size="small" tone="muted" className="line-clamp-2">{r.editorialSummary}</Text>
        )}

        <div className="flex items-center justify-between gap-3 pt-1">
          <Text as="span" size="small" tone="muted">📍 {distLabel} away</Text>
          <div className="flex items-center gap-3">
            {r.websiteUri && (
              <Text
                as="a"
                size="small"
                weight="medium"
                tone="accent"
                href={r.websiteUri}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:underline"
              >
                Website
              </Text>
            )}
            <Button
              as="a"
              href={r.googleMapsUri}
              target="_blank"
              rel="noopener noreferrer"
              variant="accent"
              size="sm"
            >
              Maps →
            </Button>
          </div>
        </div>
      </div>
    </Card>
  );
}
