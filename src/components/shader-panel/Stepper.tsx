"use client";

/* Pill number stepper: ‹ value › in a #0d0d0d pill (Figma "number stepper"). */

import { ChevronLeft, ChevronRight } from "lucide-react";

const TEXT = { fontSize: "1rem", letterSpacing: "-0.16px", lineHeight: 1.35 } as const;

export function Stepper({
  value,
  min,
  max,
  step = 1,
  format,
  onChange,
}: {
  value: number;
  min: number;
  max: number;
  step?: number;
  format?: (v: number) => string;
  onChange: (v: number) => void;
}) {
  const btn =
    "flex items-center justify-center size-8 rounded-full text-[#b3b3b3] transition-colors hover:bg-[#1a1a1a] disabled:opacity-40 disabled:hover:bg-transparent";
  return (
    <div className="flex items-center gap-3 rounded-full bg-[#0d0d0d] p-0.5">
      <button
        type="button"
        aria-label="decrease"
        onClick={() => onChange(Math.max(min, value - step))}
        disabled={value <= min}
        className={btn}
      >
        <ChevronLeft className="size-4" />
      </button>
      <span className="w-10 text-center tabular-nums text-[#e6e6e6]" style={TEXT}>
        {format ? format(value) : value}
      </span>
      <button
        type="button"
        aria-label="increase"
        onClick={() => onChange(Math.min(max, value + step))}
        disabled={value >= max}
        className={btn}
      >
        <ChevronRight className="size-4" />
      </button>
    </div>
  );
}
