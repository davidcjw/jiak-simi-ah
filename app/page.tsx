"use client";

import { useState, useEffect, useCallback } from "react";
import FilterPanel from "@/components/FilterPanel";
import RestaurantCard from "@/components/RestaurantCard";
import SpinWheel from "@/components/SpinWheel";
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
    if (!navigator.geolocation) {
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
    <main className="min-h-screen bg-stone-100">
      {/* Header */}
      <header className="bg-gradient-to-r from-green-900 to-green-800 text-white py-6 px-4 shadow-lg">
        <div className="max-w-2xl mx-auto text-center">
          <h1 className="text-3xl font-black tracking-tight">
            🍜 Jiak Simi Ah?
          </h1>
          <p className="text-green-200 text-sm mt-1">
            Cannot decide what to eat? Let us settle for you lah!
          </p>
          {location && !locationError && (
            <p className="text-green-300 text-xs mt-1">📍 Using your location in Singapore</p>
          )}
          {locationError && (
            <p className="text-green-300 text-xs mt-1">⚠️ {locationError}</p>
          )}
        </div>
      </header>

      <div className="max-w-2xl mx-auto px-4 py-6 space-y-6">
        {/* Filter Panel */}
        <div className="bg-white rounded-2xl shadow-sm border border-green-100 overflow-hidden">
          <button
            onClick={() => setFiltersOpen((v) => !v)}
            className="w-full flex items-center justify-between px-5 py-4 text-left cursor-pointer"
          >
            <span className="font-bold text-green-900">🔍 Filters</span>
            <span className="text-green-600 text-sm">{filtersOpen ? "▲ Hide" : "▼ Show"}</span>
          </button>
          {filtersOpen && (
            <div className="px-5 pb-5 border-t border-green-50">
              <div className="pt-4">
                <FilterPanel filters={filters} onChange={setFilters} disabled={loading} />
              </div>
            </div>
          )}
        </div>

        {/* Search Button */}
        <button
          onClick={search}
          disabled={loading || !location}
          className="w-full bg-amber-400 text-green-900 font-black text-xl py-5 rounded-2xl shadow-lg hover:shadow-xl hover:bg-amber-500 transition-all disabled:opacity-50 disabled:cursor-not-allowed active:scale-[0.98] cursor-pointer"
        >
          {loading
            ? "Searching... 🔍"
            : !location
            ? "Getting location..."
            : "Find Food! 🍽️"}
        </button>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 rounded-xl px-4 py-3 text-sm">
            ⚠️ {error}
          </div>
        )}

        {/* Results */}
        {searched && !loading && (
          <div className="space-y-4">
            {restaurants.length === 0 ? (
              <div className="text-center py-12 text-green-600">
                <p className="text-4xl mb-3">😩</p>
                <p className="font-semibold">Wah, nothing found lah!</p>
                <p className="text-sm mt-1">Try widening your filters or radius.</p>
              </div>
            ) : (
              <>
                {/* Results header + quick actions */}
                <div className="flex items-center justify-between">
                  <p className="text-green-800 font-semibold">
                    {restaurants.length} place{restaurants.length !== 1 ? "s" : ""} found!
                  </p>
                  <button
                    onClick={lucky}
                    className="text-sm bg-red-600 text-white font-bold px-3 py-1.5 rounded-full hover:bg-red-700 transition-colors cursor-pointer"
                  >
                    🎲 Feeling Lucky?
                  </button>
                </div>

                {/* Sort toggle */}
                <div className="flex items-center gap-2">
                  <span className="text-xs text-green-700 font-medium">Sort:</span>
                  {(["rating", "distance"] as SortBy[]).map((opt) => (
                    <button
                      key={opt}
                      onClick={() => setSortBy(opt)}
                      className={`px-3 py-1 rounded-full text-xs font-semibold transition-all cursor-pointer ${
                        sortBy === opt
                          ? "bg-green-800 text-white"
                          : "bg-stone-200 text-green-700 hover:bg-stone-300"
                      }`}
                    >
                      {opt === "rating" ? "⭐ Rating" : "📍 Distance"}
                    </button>
                  ))}
                </div>

                {/* Tabs */}
                <div className="flex gap-2 bg-green-100 p-1 rounded-xl">
                  <button
                    onClick={() => setTab("list")}
                    className={`flex-1 py-2 rounded-lg text-sm font-semibold transition-all cursor-pointer ${
                      tab === "list"
                        ? "bg-white text-green-800 shadow-sm"
                        : "text-green-600 hover:text-green-800"
                    }`}
                  >
                    📋 List
                  </button>
                  <button
                    onClick={() => setTab("spin")}
                    className={`flex-1 py-2 rounded-lg text-sm font-semibold transition-all cursor-pointer ${
                      tab === "spin"
                        ? "bg-white text-green-800 shadow-sm"
                        : "text-green-600 hover:text-green-800"
                    }`}
                  >
                    🎰 Spin the Wheel
                  </button>
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

      <footer className="text-center py-8 text-xs text-stone-400">
        Made with ❤️ for hungry Singaporeans 🇸🇬
      </footer>
    </main>
  );
}
