"use client";

import { useEffect, useRef, useState } from "react";
import { Restaurant } from "@/lib/types";
import { Card, Text, Button } from "@/lib/pulze-ds";

interface SpinWheelProps {
  restaurants: (Restaurant & { distanceKm: number })[];
  onResult: (restaurant: Restaurant & { distanceKm: number }) => void;
}

export default function SpinWheel({ restaurants, onResult }: SpinWheelProps) {
  const [spinning, setSpinning] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [done, setDone] = useState(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const interval = intervalRef;
    const timeout = timeoutRef;
    return () => {
      if (interval.current) clearInterval(interval.current);
      if (timeout.current) clearTimeout(timeout.current);
    };
  }, []);

  const spin = () => {
    if (spinning || restaurants.length === 0) return;
    setSpinning(true);
    setDone(false);

    const targetIndex = Math.floor(Math.random() * restaurants.length);
    const totalDuration = 3000 + Math.random() * 1500;
    let elapsed = 0;
    let delay = 60;

    const tick = () => {
      setCurrentIndex((prev) => (prev + 1) % restaurants.length);
      elapsed += delay;

      const progress = elapsed / totalDuration;
      if (progress > 0.6) {
        delay = 60 + (progress - 0.6) / 0.4 * 340;
      }

      if (elapsed >= totalDuration) {
        if (intervalRef.current) clearInterval(intervalRef.current);
        setCurrentIndex(targetIndex);
        setDone(true);
        setSpinning(false);
        onResult(restaurants[targetIndex]);
        return;
      }

      if (intervalRef.current) clearInterval(intervalRef.current);
      intervalRef.current = setTimeout(tick, delay);
    };

    if (intervalRef.current) clearInterval(intervalRef.current);
    intervalRef.current = setTimeout(tick, delay);
  };

  const current = restaurants[currentIndex];
  const accent = done ? "var(--pz-purple)" : spinning ? "var(--pz-teal)" : "var(--pz-line)";

  return (
    <div className="flex flex-col items-center gap-4">
      {/* Slot display — padding lives on the inner wrapper, since pulze's
          unlayered `.pz-card { padding }` overrides Tailwind utilities placed
          directly on the Card. */}
      <Card
        tone="paper"
        radius="lg"
        elevation={spinning || done ? "lg" : "soft"}
        bordered
        className="w-full max-w-sm overflow-hidden transition-all"
        style={{ borderColor: accent, borderWidth: 2 }}
      >
        <div className="flex flex-col items-center justify-center text-center px-6 py-6">
          <div className={`text-4xl mb-3 ${spinning ? "animate-bounce" : ""}`}>🎰</div>
          {current ? (
            <>
              {/* Reserve ~2 lines so the box height stays steady as names cycle */}
              <div className="flex w-full items-center justify-center" style={{ minHeight: "2.5em" }}>
                <span
                  className={`block w-full text-balance break-words line-clamp-3 font-semibold transition-all duration-100 ${
                    spinning ? "blur-[1px]" : ""
                  }`}
                  style={{
                    fontSize: "clamp(19px, 5vw, 24px)",
                    lineHeight: 1.25,
                    letterSpacing: "var(--pz-track-tight)",
                  }}
                >
                  {current.name}
                </span>
              </div>
              <Text size="small" tone="muted" className="mt-2.5">
                <span style={{ color: "var(--pz-orange)" }}>
                  {"★".repeat(Math.round(current.rating))}
                </span>{" "}
                {current.rating.toFixed(1)} · {current.reviewCount.toLocaleString()} reviews
              </Text>
              {done && (
                <Text
                  size="small"
                  weight="semibold"
                  className="mt-2 animate-pulse"
                  style={{ color: "var(--pz-purple)" }}
                >
                  Jiak this lah! 🎉
                </Text>
              )}
            </>
          ) : (
            <Text tone="muted">No restaurants yet</Text>
          )}
        </div>
      </Card>

      <Button
        type="button"
        variant="accent"
        onClick={spin}
        disabled={spinning || restaurants.length === 0}
        className="w-full max-w-sm justify-center !py-4 !text-lg !font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {spinning ? "Spinning... 🌀" : done ? "Spin Again! 🎰" : "🎰 Spin the Wheel!"}
      </Button>

      <Text size="small" tone="muted">
        {restaurants.length} restaurant{restaurants.length !== 1 ? "s" : ""} in the pool
      </Text>
    </div>
  );
}
