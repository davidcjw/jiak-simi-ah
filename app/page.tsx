"use client";

import { useState, useEffect, useCallback } from "react";
import FilterPanel from "@/components/FilterPanel";
import RestaurantCard from "@/components/RestaurantCard";
import SpinWheel from "@/components/SpinWheel";
import GithubStarButton from "@/components/GithubStarButton";
import { Card, Text, Button, Badge } from "@/lib/pulze-ds";
import { FilterState, Location, Restaurant } from "@/lib/types";

const DEFAULT_FILTERS: FilterState = {
  radius: 1000,
  priceLevels: [],
  cuisines: [],
  minRating: 3,
  minReviews: 100,
};

const SG_CENTER: Location = { lat: 1.3521, lng: 103.8198 };

type Tab = "list" | "spin";
type SortBy = "rating" | "distance";

export default function Home() {
  const [filters, setFilters] = useState<FilterState>(DEFAULT_FILTERS);
  const [location, setLocation] = useState<Location | null>(null);
  const [locationError, setLocationError] = useState<string | null>(null);
  const [restaurants, setRestaurants] = useState<(Restaurant & { distanceKm: number })[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searched, setSearched] = useState(false);
  const [pickedId, setPickedId] = useState<string | null>(null);
  const [tab, setTab] = useState<Tab>("list");
  const [filtersOpen, setFiltersOpen] = useState(true);
  const [sortBy, setSortBy] = useState<SortBy>("rating");

  useEffect(() => {
    // One-time sync with the browser geolocation API (an external system),
    // so the synchronous fallback here is intentional.
    if (!navigator.geolocation) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setLocationError("Geolocation not supported — using Singapore centre.");
      setLocation(SG_CENTER);
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (pos) => setLocation({ lat: pos.coords.latitude, lng: pos.coords.longitude }),
      () => {
        setLocationError("Location denied — using Singapore centre.");
        setLocation(SG_CENTER);
      },
      { timeout: 8000 }
    );
  }, []);

  const search = useCallback(async () => {
    const loc = location ?? SG_CENTER;
    setLoading(true);
    setError(null);
    setPickedId(null);
    setFiltersOpen(false);

    try {
      const res = await fetch("/api/places", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...filters, lat: loc.lat, lng: loc.lng }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error ?? "Failed to fetch restaurants");
      }

      const data = await res.json();
      setRestaurants(data.restaurants ?? []);
      setSearched(true);
      setTab("list");
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setLoading(false);
    }
  }, [filters, location]);

  const lucky = () => {
    if (restaurants.length === 0) return;
    const pick = restaurants[Math.floor(Math.random() * restaurants.length)];
    setPickedId(pick.id);
    setTab("list");
    setTimeout(() => {
      document.getElementById(`restaurant-${pick.id}`)?.scrollIntoView({ behavior: "smooth", block: "center" });
    }, 100);
  };

  return (
    <main className="flex-1">
      {/* Top bar */}
      <div className="max-w-2xl mx-auto px-4 pt-5 flex justify-end">
        <GithubStarButton />
      </div>

      {/* Hero */}
      <header className="px-4 pt-8 pb-8">
        <div className="max-w-2xl mx-auto flex flex-col items-center text-center gap-4">
          <Badge color="teal">🇸🇬 Singapore food decider</Badge>
          <Text
            size="display"
            weight="semibold"
            style={{ fontSize: "clamp(36px, 9vw, 56px)", lineHeight: 1.05 }}
          >
            Jiak Simi Ah? 🍜
          </Text>
          <Text size="lead" tone="muted" className="max-w-md">
            Cannot decide what to eat? Let us settle for you lah!
          </Text>
          {(location && !locationError) || locationError ? (
            <Text as="span" size="small" tone="muted">
              {locationError ? `⚠️ ${locationError}` : "📍 Using your location in Singapore"}
            </Text>
          ) : null}
        </div>
      </header>

      <div className="max-w-2xl mx-auto px-4 pb-10 flex flex-col gap-5">
        {/* Filter Panel */}
        <Card tone="paper" radius="lg" elevation="soft" bordered className="overflow-hidden">
          <button
            onClick={() => setFiltersOpen((v) => !v)}
            className="w-full flex items-center justify-between px-5 py-4 text-left cursor-pointer"
          >
            <Text as="span" weight="semibold">🔍 Filters</Text>
            <Text as="span" size="small" weight="medium" tone="accent">
              {filtersOpen ? "Hide ▲" : "Show ▼"}
            </Text>
          </button>
          {filtersOpen && (
            <div className="px-5 pb-5 pt-4" style={{ borderTop: "1px solid var(--pz-line)" }}>
              <FilterPanel filters={filters} onChange={setFilters} disabled={loading} />
            </div>
          )}
        </Card>

        {/* Search Button */}
        <Button
          type="button"
          variant="accent"
          onClick={search}
          disabled={loading || !location}
          className="w-full justify-center !py-4 !text-lg !font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading
            ? "Searching... 🔍"
            : !location
            ? "Getting location..."
            : "Find Food! 🍽️"}
        </Button>

        {error && (
          <Card
            tone="paper"
            radius="md"
            bordered
            style={{ borderColor: "color-mix(in srgb, var(--pz-orange) 45%, transparent)" }}
          >
            <div className="px-4 py-3">
              <Text size="small" style={{ color: "var(--pz-orange)" }}>⚠️ {error}</Text>
            </div>
          </Card>
        )}

        {/* Results */}
        {searched && !loading && (
          <div className="flex flex-col gap-4">
            {restaurants.length === 0 ? (
              <Card tone="cream" radius="lg">
                <div className="text-center px-6 py-12">
                  <div className="text-4xl mb-3">😩</div>
                  <Text weight="semibold">Wah, nothing found lah!</Text>
                  <Text size="small" tone="muted" className="mt-1">
                    Try widening your filters or radius.
                  </Text>
                </div>
              </Card>
            ) : (
              <>
                {/* Results header + lucky */}
                <div className="flex items-center justify-between gap-3">
                  <Text weight="semibold">
                    {restaurants.length} place{restaurants.length !== 1 ? "s" : ""} found!
                  </Text>
                  <Button type="button" variant="ink" size="sm" onClick={lucky}>
                    🎲 Feeling Lucky?
                  </Button>
                </div>

                {/* Sort toggle */}
                <div className="flex items-center gap-2">
                  <Text as="span" size="small" tone="muted">Sort:</Text>
                  {(["rating", "distance"] as SortBy[]).map((opt) => (
                    <Button
                      key={opt}
                      type="button"
                      size="sm"
                      variant={sortBy === opt ? "accent" : "outline"}
                      onClick={() => setSortBy(opt)}
                    >
                      {opt === "rating" ? "⭐ Rating" : "📍 Distance"}
                    </Button>
                  ))}
                </div>

                {/* Tabs */}
                <div className="flex gap-2">
                  <Button
                    type="button"
                    size="sm"
                    variant={tab === "list" ? "accent" : "outline"}
                    onClick={() => setTab("list")}
                    className="flex-1 justify-center"
                  >
                    📋 List
                  </Button>
                  <Button
                    type="button"
                    size="sm"
                    variant={tab === "spin" ? "accent" : "outline"}
                    onClick={() => setTab("spin")}
                    className="flex-1 justify-center"
                  >
                    🎰 Spin the Wheel
                  </Button>
                </div>

                {tab === "list" && (
                  <div className="grid gap-4">
                    {[...restaurants]
                      .sort((a, b) =>
                        sortBy === "distance"
                          ? a.distanceKm - b.distanceKm
                          : b.rating - a.rating || b.reviewCount - a.reviewCount
                      )
                      .map((r) => (
                        <div key={r.id} id={`restaurant-${r.id}`}>
                          <RestaurantCard restaurant={r} highlight={r.id === pickedId} />
                        </div>
                      ))}
                  </div>
                )}

                {tab === "spin" && (
                  <SpinWheel
                    restaurants={restaurants}
                    onResult={(r) => setPickedId(r.id)}
                  />
                )}
              </>
            )}
          </div>
        )}
      </div>

      <footer className="text-center py-8">
        <Text size="small" tone="muted">Made with ❤️ for hungry Singaporeans 🇸🇬</Text>
      </footer>
    </main>
  );
}
