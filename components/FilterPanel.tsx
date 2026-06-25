"use client";

import { FilterState } from "@/lib/types";
import { CUISINES, RADIUS_OPTIONS } from "@/lib/cuisines";
import { Text, Button } from "@/lib/pulze-ds";
import type { ReactNode } from "react";

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

function FieldLabel({ children, hint }: { children: ReactNode; hint?: ReactNode }) {
  return (
    <Text as="label" size="small" weight="semibold" className="block mb-2.5">
      {children}
      {hint != null && (
        <Text as="span" size="small" weight="regular" tone="muted"> {hint}</Text>
      )}
    </Text>
  );
}

function Chip({
  active,
  disabled,
  onClick,
  title,
  children,
}: {
  active: boolean;
  disabled?: boolean;
  onClick: () => void;
  title?: string;
  children: ReactNode;
}) {
  return (
    <Button
      type="button"
      size="sm"
      variant={active ? "accent" : "outline"}
      onClick={onClick}
      disabled={disabled}
      title={title}
      className="disabled:opacity-50"
    >
      {children}
    </Button>
  );
}

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
    <div className="flex flex-col gap-6">
      {/* Radius */}
      <div>
        <FieldLabel>Search radius</FieldLabel>
        <div className="flex gap-2 flex-wrap">
          {RADIUS_OPTIONS.map((opt) => (
            <Chip
              key={opt.value}
              active={filters.radius === opt.value}
              disabled={disabled}
              onClick={() => onChange({ ...filters, radius: opt.value })}
            >
              {opt.label}
            </Chip>
          ))}
        </div>
      </div>

      {/* Price */}
      <div>
        <FieldLabel hint="(select multiple)">Budget</FieldLabel>
        <div className="flex gap-2">
          {PRICE_OPTIONS.map((opt) => (
            <Chip
              key={opt.value}
              active={filters.priceLevels.includes(opt.value)}
              disabled={disabled}
              onClick={() => togglePrice(opt.value)}
              title={opt.desc}
            >
              {opt.label}
            </Chip>
          ))}
        </div>
      </div>

      {/* Min Rating */}
      <div>
        <FieldLabel
          hint={
            <span style={{ color: "var(--pz-orange)" }}>
              {"★".repeat(Math.round(filters.minRating))} {filters.minRating.toFixed(1)}+
            </span>
          }
        >
          Min rating:
        </FieldLabel>
        <input
          type="range"
          min={1}
          max={5}
          step={0.5}
          value={filters.minRating}
          disabled={disabled}
          onChange={(e) => onChange({ ...filters, minRating: parseFloat(e.target.value) })}
          className="w-full accent-teal disabled:opacity-50"
        />
        <div className="flex justify-between mt-1">
          {["1.0", "2.0", "3.0", "4.0", "5.0"].map((n) => (
            <Text as="span" key={n} size="small" tone="muted" className="!text-xs">{n}</Text>
          ))}
        </div>
      </div>

      {/* Min Reviews */}
      <div>
        <FieldLabel
          hint={<span style={{ color: "var(--pz-orange)" }}>{filters.minReviews}+</span>}
        >
          Min reviews:
        </FieldLabel>
        <input
          type="range"
          min={0}
          max={500}
          step={25}
          value={filters.minReviews}
          disabled={disabled}
          onChange={(e) => onChange({ ...filters, minReviews: parseInt(e.target.value) })}
          className="w-full accent-teal disabled:opacity-50"
        />
        <div className="flex justify-between mt-1">
          {["0", "125", "250", "375", "500+"].map((n) => (
            <Text as="span" key={n} size="small" tone="muted" className="!text-xs">{n}</Text>
          ))}
        </div>
      </div>

      {/* Cuisines */}
      <div>
        <FieldLabel
          hint={`(${filters.cuisines.length === 0 ? "all" : `${filters.cuisines.length} selected`})`}
        >
          Cuisine type
        </FieldLabel>
        <div className="flex flex-wrap gap-2">
          {CUISINES.map((c) => (
            <Chip
              key={c.id}
              active={filters.cuisines.includes(c.id)}
              disabled={disabled}
              onClick={() => toggleCuisine(c.id)}
            >
              <span aria-hidden="true">{c.emoji}</span>
              {c.label}
            </Chip>
          ))}
        </div>
        {filters.cuisines.length > 0 && (
          <button
            onClick={() => onChange({ ...filters, cuisines: [] })}
            className="mt-2.5 cursor-pointer"
          >
            <Text as="span" size="small" tone="muted" className="underline hover:text-ink">
              Clear all cuisines
            </Text>
          </button>
        )}
      </div>
    </div>
  );
}
