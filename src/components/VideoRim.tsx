"use client";

import { useRef, useState, useEffect, type ReactNode } from "react";

/* A duration rim that traces the control's rounded outline (circle for a square
   child, stadium for a wide one) and fills with playback progress. One rounded
   <rect> with pathLength=1 works for both shapes. Measures the actual rendered
   child (Tailwind spacing renders at this project's 14px rem scale, so px can't
   be assumed) so the ring always hugs the button. */

export const GAP = 0; // rim sits flush on the control's edge
export const STROKE = 2;

export function Rim({ progress, children }: { progress: number; children: ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  const [dim, setDim] = useState({ w: 0, h: 0 });

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const measure = () => setDim({ w: el.offsetWidth, h: el.offsetHeight });
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const P = GAP + STROKE; // room for the outward stroke (+ optional gap)
  const rw = dim.w + 2 * GAP + STROKE;
  const rh = dim.h + 2 * GAP + STROKE;
  const rx = rh / 2;
  const W = dim.w + 2 * P;
  const H = dim.h + 2 * P;
  const rect = { x: (W - rw) / 2, y: (H - rh) / 2, width: rw, height: rh, rx, ry: rx, fill: "none" as const };

  return (
    <div className="relative inline-flex" style={{ padding: P }}>
      <div ref={ref} className="relative z-10 inline-flex">
        {children}
      </div>
      {dim.w > 0 && (
        <svg width={W} height={H} className="absolute inset-0 pointer-events-none">
          <rect {...rect} stroke="#ffffff26" strokeWidth={STROKE} />
          <rect
            {...rect}
            stroke="#e6e6e6"
            strokeWidth={STROKE}
            strokeLinecap="round"
            pathLength={1}
            strokeDasharray={`${Math.max(progress, 0.0001)} 1`}
            style={{ transition: "stroke-dasharray 0.25s linear" }}
          />
        </svg>
      )}
    </div>
  );
}
