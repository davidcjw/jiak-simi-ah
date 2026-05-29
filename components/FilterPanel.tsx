"use client";

import { FilterState } from "@/lib/types";
import { CUISINES, RADIUS_OPTIONS } from "@/lib/cuisines";

interface FilterPanelProps {
  filters: FilterState;
  onChange: (filters: FilterState) => void;
  disabled?: boolean;
}

const PRICE_OPTIONS = [
  { value: 1 as const, label: "$", desc: "Budget" },
  { value: 2 as const, label: "$$", desc: "Mid-range" },
  { value: 3 as const, label: "$$$", desc: "Upscale" },
];

export default function FilterPanel({ filters, onChange, disabled }: FilterPanelProps) {
  const togglePrice = (level: 1 | 2 | 3) => {
    const has = filters.priceLevels.includes(level);
    onChange({
      ...filters,
      priceLevels: has
        ? filters.priceLevels.filter((p) => p !== level)
        : [...filters.priceLevels, level],
    });
  };

  const toggleCuisine = (id: string) => {
    const has = filters.cuisines.includes(id);
    onChange({
      ...filters,
      cuisines: has
        ? filters.cuisines.filter((c) => c !== id)
        : [...filters.cuisines, id],
    });
  };

  return (
    <div className="space-y-6">
      {/* Radius */}
      <div>
        <label className="block text-sm font-semibold text-green-900 mb-2">
          Search Radius
        </label>
        <div className="flex gap-2 flex-wrap">
          {RADIUS_OPTIONS.map((opt) => (
            <button
              key={opt.value}
              onClick={() => onChange({ ...filters, radius: opt.value })}
              disabled={disabled}
              className={`px-3 py-1.5 rounded-full text-sm font-medium transition-all ${
                filters.radius === opt.value
                  ? "bg-green-800 text-white shadow-md"
                  : "bg-stone-100 text-green-800 hover:bg-stone-200"
              } disabled:opacity-50`}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      {/* Price */}
      <div>
        <label className="block text-sm font-semibold text-green-900 mb-2">
          Budget <span className="font-normal text-green-700">(select multiple)</span>
        </label>
        <div className="flex gap-3">
          {PRICE_OPTIONS.map((opt) => (
            <button
              key={opt.value}
              onClick={() => togglePrice(opt.value)}
              disabled={disabled}
              title={opt.desc}
              className={`px-4 py-2 rounded-xl text-sm font-bold transition-all border-2 ${
                filters.priceLevels.includes(opt.value)
                  ? "bg-green-800 text-white border-green-800 shadow-md"
                  : "bg-white text-green-700 border-green-200 hover:border-green-500"
              } disabled:opacity-50`}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      {/* Min Rating */}
      <div>
        <label className="block text-sm font-semibold text-green-900 mb-2">
          Min Rating:{" "}
          <span className="text-amber-600">
            {"★".repeat(Math.round(filters.minRating))} {filters.minRating.toFixed(1)}+
          </span>
        </label>
        <input
          type="range"
          min={1}
          max={5}
          step={0.5}
          value={filters.minRating}
          disabled={disabled}
          onChange={(e) => onChange({ ...filters, minRating: parseFloat(e.target.value) })}
          className="w-full accent-green-800 disabled:opacity-50"
        />
        <div className="flex justify-between text-xs text-green-500 mt-1">
          <span>1.0</span><span>2.0</span><span>3.0</span><span>4.0</span><span>5.0</span>
        </div>
      </div>

      {/* Min Reviews */}
      <div>
        <label className="block text-sm font-semibold text-green-900 mb-2">
          Min Reviews:{" "}
          <span className="text-amber-600">{filters.minReviews}+</span>
        </label>
        <input
          type="range"
          min={0}
          max={500}
          step={25}
          value={filters.minReviews}
          disabled={disabled}
          onChange={(e) => onChange({ ...filters, minReviews: parseInt(e.target.value) })}
          className="w-full accent-green-800 disabled:opacity-50"
        />
        <div className="flex justify-between text-xs text-green-500 mt-1">
          <span>0</span><span>125</span><span>250</span><span>375</span><span>500+</span>
        </div>
      </div>

      {/* Cuisines */}
      <div>
        <label className="block text-sm font-semibold text-green-900 mb-2">
          Cuisine Type{" "}
          <span className="font-normal text-green-700">
            {filters.cuisines.length === 0 ? "(all)" : `(${filters.cuisines.length} selected)`}
          </span>
        </label>
        <div className="flex flex-wrap gap-2">
          {CUISINES.map((c) => (
            <button
              key={c.id}
              onClick={() => toggleCuisine(c.id)}
              disabled={disabled}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm transition-all border ${
                filters.cuisines.includes(c.id)
                  ? "bg-green-800 text-white border-green-800 shadow-sm"
                  : "bg-white text-green-700 border-green-200 hover:border-green-500"
              } disabled:opacity-50`}
            >
              <span>{c.emoji}</span>
              <span>{c.label}</span>
            </button>
          ))}
        </div>
        {filters.cuisines.length > 0 && (
          <button
            onClick={() => onChange({ ...filters, cuisines: [] })}
            className="mt-2 text-xs text-green-500 hover:text-green-700 underline"
          >
            Clear all cuisines
          </button>
        )}
      </div>
    </div>
  );
}
