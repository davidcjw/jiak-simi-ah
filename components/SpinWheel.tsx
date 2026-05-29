"use client";

import { useEffect, useRef, useState } from "react";
import { Restaurant } from "@/lib/types";

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
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
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

  return (
    <div className="flex flex-col items-center gap-4">
      {/* Slot display */}
      <div
        className={`w-full max-w-sm bg-white border-4 rounded-2xl p-6 text-center transition-all duration-150 ${
          spinning
            ? "border-orange-400 shadow-lg shadow-orange-100"
            : done
            ? "border-orange-500 shadow-xl shadow-orange-200"
            : "border-orange-200"
        }`}
      >
        <div className={`text-5xl mb-3 transition-all ${spinning ? "animate-bounce" : ""}`}>
          🎰
        </div>
        {current ? (
          <>
            <p
              className={`font-bold text-xl text-gray-900 transition-all duration-100 ${
                spinning ? "blur-[1px]" : ""
              }`}
            >
              {current.name}
            </p>
            <p className="text-sm text-gray-500 mt-1">
              {"★".repeat(Math.round(current.rating))} {current.rating.toFixed(1)} ·{" "}
              {current.reviewCount.toLocaleString()} reviews
            </p>
            {done && (
              <p className="mt-2 text-orange-600 font-semibold text-sm animate-pulse">
                Jiak this lah! 🎉
              </p>
            )}
          </>
        ) : (
          <p className="text-gray-400">No restaurants yet</p>
        )}
      </div>

      <button
        onClick={spin}
        disabled={spinning || restaurants.length === 0}
        className="w-full max-w-sm bg-gradient-to-r from-orange-500 to-red-500 text-white font-bold py-4 px-8 rounded-2xl text-lg shadow-lg hover:shadow-xl hover:from-orange-600 hover:to-red-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed active:scale-95"
      >
        {spinning ? "Spinning... 🌀" : done ? "Spin Again! 🎰" : "🎰 Spin the Wheel!"}
      </button>

      <p className="text-xs text-orange-400">
        {restaurants.length} restaurant{restaurants.length !== 1 ? "s" : ""} in the pool
      </p>
    </div>
  );
}
