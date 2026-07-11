"use client";

/* Color picker (Figma): a top row (label + pipette + hex + expand/shrink toggle)
   that's always shown, and — when expanded — a 2D saturation/value area and a hue
   spectrum below it. HSV internally, hex out. Starts condensed. */

import { useRef, useState, type PointerEvent as RPointerEvent } from "react";
import { Pipette } from "lucide-react";
import { Shrink } from "@/components/animate-ui/icons/shrink";
import { AnimateIcon } from "@/components/animate-ui/icons/icon";
import { hexToHsv, hsvToHex, SPECTRUM } from "./color";

const LABEL = { color: "#808080", fontSize: "1rem", letterSpacing: "-0.16px", lineHeight: 1.35 } as const;
const VALUE = { color: "#e6e6e6", fontSize: "1rem", letterSpacing: "-0.16px", lineHeight: 1.35 } as const;

type Target = "area" | "hue" | null;

export function ColorPicker({
  index,
  hex,
  onChange,
}: {
  index: number;
  hex: string;
  onChange: (hex: string) => void;
}) {
  const [expanded, setExpanded] = useState(false);
  const [h, s, v] = hexToHsv(hex);
  const areaRef = useRef<HTMLDivElement>(null);
  const specRef = useRef<HTMLDivElement>(null);
  const target = useRef<Target>(null);

  const pickArea = (e: RPointerEvent | PointerEvent) => {
    const el = areaRef.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    const x = Math.min(Math.max(e.clientX - r.left, 0), r.width);
    const y = Math.min(Math.max(e.clientY - r.top, 0), r.height);
    onChange(hsvToHex(h, r.width ? x / r.width : 0, r.height ? 1 - y / r.height : 0));
  };
  const pickHue = (e: RPointerEvent | PointerEvent) => {
    const el = specRef.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    const x = Math.min(Math.max(e.clientX - r.left, 0), r.width);
    onChange(hsvToHex(r.width ? (x / r.width) * 360 : 0, s, v));
  };

  const down = (which: Exclude<Target, null>) => (e: RPointerEvent) => {
    target.current = which;
    (e.currentTarget as Element).setPointerCapture(e.pointerId);
    (which === "area" ? pickArea : pickHue)(e);
  };
  const move = (e: RPointerEvent) => {
    if (target.current === "area") pickArea(e);
    else if (target.current === "hue") pickHue(e);
  };
  const up = () => {
    target.current = null;
  };

  const eyedrop = async () => {
    const AnyWin = window as unknown as { EyeDropper?: new () => { open: () => Promise<{ sRGBHex: string }> } };
    if (!AnyWin.EyeDropper) return;
    try {
      const res = await new AnyWin.EyeDropper().open();
      onChange(res.sRGBHex);
    } catch {
      /* user cancelled */
    }
  };

  const iconBtn = "flex size-9 items-center justify-center rounded-xl transition-colors";
  const handle = "absolute size-4 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-[#e6e6e6] pointer-events-none";

  return (
    <div className="flex w-full flex-col gap-2">
      {/* label + pipette + hex + expand/shrink toggle */}
      <div className="flex w-full items-center justify-between">
        <span style={LABEL}>{`Color ${index + 1}`}</span>
        <div className="flex items-center gap-2">
          <button
            type="button"
            aria-label="pick color from screen"
            onClick={eyedrop}
            className={`${iconBtn} text-[#b3b3b3] hover:bg-[#0d0d0d]`}
          >
            <Pipette className="size-4" />
          </button>
          <div className="flex h-9 items-center rounded-full border border-transparent bg-[#0d0d0d] px-4 transition-colors hover:border-[#333] focus-within:border-[#333]">
            <input
              value={hex.toUpperCase()}
              onChange={(e) => onChange(e.target.value)}
              spellCheck={false}
              className="w-[72px] bg-transparent text-center outline-none"
              style={VALUE}
            />
          </div>
          {expanded ? (
            <AnimateIcon animateOnHover asChild>
              <button
                type="button"
                aria-label="collapse color picker"
                onClick={() => setExpanded(false)}
                className={`${iconBtn} bg-[#333] text-[#b3b3b3] hover:bg-[#4d4d4d]`}
              >
                <Shrink className="size-4" />
              </button>
            </AnimateIcon>
          ) : (
            <button
              type="button"
              aria-label="expand color picker"
              onClick={() => setExpanded(true)}
              className={`${iconBtn} border border-[#333]`}
              style={{ backgroundColor: hex }}
            />
          )}
        </div>
      </div>

      {expanded && (
        <>
          {/* 2D saturation/value area */}
          <div
            ref={areaRef}
            data-nodrag
            onPointerDown={down("area")}
            onPointerMove={move}
            onPointerUp={up}
            className="relative h-[64px] w-full cursor-crosshair touch-none overflow-hidden rounded-2xl"
            style={{
              background: `linear-gradient(to top, #000, rgba(0,0,0,0)), linear-gradient(to right, #fff, rgba(255,255,255,0)), hsl(${h}, 100%, 50%)`,
            }}
          >
            <span className={handle} style={{ left: `${s * 100}%`, top: `${(1 - v) * 100}%` }} />
          </div>

          {/* hue spectrum */}
          <div
            ref={specRef}
            data-nodrag
            onPointerDown={down("hue")}
            onPointerMove={move}
            onPointerUp={up}
            className="relative h-4 w-full cursor-pointer touch-none overflow-hidden rounded-2xl"
            style={{ backgroundImage: SPECTRUM }}
          >
            <span className={handle} style={{ left: `${(h / 360) * 100}%`, top: "50%" }} />
          </div>
        </>
      )}
    </div>
  );
}
