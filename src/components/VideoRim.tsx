"use client";

import { useRef, useState, useEffect, type ReactNode } from "react";
import { Play } from "@/components/animate-ui/icons/play";
import { Pause } from "@/components/animate-ui/icons/pause";
import { Volume2 } from "@/components/animate-ui/icons/volume-2";
import { VolumeOff } from "@/components/animate-ui/icons/volume-off";
import { AnimateIcon } from "@/components/animate-ui/icons/icon";
import { Tooltip, TooltipTrigger, TooltipContent, TooltipProvider } from "@/components/ui/tooltip";

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

  // Progress path starts at the top-center of the pill and traces
  // counter-clockwise (left first). Works for the stadium and the circle (where
  // the top straight has zero length).
  const cx = rect.x + rw / 2;
  const lx = rect.x + rx;
  const rxEnd = rect.x + rw - rx;
  const top = rect.y;
  const bot = rect.y + rh;
  const centerPath = `M ${cx} ${top} L ${lx} ${top} A ${rx} ${rx} 0 0 0 ${lx} ${bot} L ${rxEnd} ${bot} A ${rx} ${rx} 0 0 0 ${rxEnd} ${top} Z`;

  const progressProps = {
    stroke: "#e6e6e6",
    strokeWidth: STROKE,
    strokeLinecap: "round" as const,
    pathLength: 1,
    strokeDasharray: `${Math.max(progress, 0.0001)} 1`,
    style: { transition: "stroke-dasharray 0.25s linear" },
  };

  return (
    <div className="relative inline-flex" style={{ padding: P }}>
      <div ref={ref} className="relative z-10 inline-flex">
        {children}
      </div>
      {dim.w > 0 && (
        <svg width={W} height={H} className="absolute inset-0 pointer-events-none">
          <rect {...rect} stroke="#ffffff26" strokeWidth={STROKE} />
          <path d={centerPath} fill="none" {...progressProps} />
        </svg>
      )}
    </div>
  );
}

/* The project's standard video control: a circular play/pause wrapped in the
   duration Rim (consistent everywhere), plus an optional mute/unmute button 4px
   to its right — pass `onToggleMute` to include it. */
export function VideoControl({
  playing,
  onTogglePlay,
  progress,
  muted,
  onToggleMute,
}: {
  playing: boolean;
  onTogglePlay: () => void;
  progress: number;
  muted?: boolean;
  onToggleMute?: () => void;
}) {
  const seg = "flex size-8 cursor-pointer items-center justify-center rounded-full";
  return (
    <TooltipProvider delay={500}>
      <div className="flex flex-col items-center gap-[4px]">
        {onToggleMute && (
          <Tooltip>
            <TooltipTrigger
              render={
                <div className="rounded-full bg-[#1a1a1a] p-[2px] opacity-60 transition-opacity hover:opacity-100">
                  <AnimateIcon animateOnHover asChild>
                    <button
                      type="button"
                      onClick={onToggleMute}
                      aria-label={muted ? "Unmute" : "Mute"}
                      className={seg}
                      style={{ background: muted ? "transparent" : "#370000" }}
                    >
                      {muted ? <Volume2 size={20} color="#e6e6e6" /> : <VolumeOff size={20} color="#e6e6e6" />}
                    </button>
                  </AnimateIcon>
                </div>
              }
            />
            <TooltipContent>{muted ? "Unmute" : "Mute"}</TooltipContent>
          </Tooltip>
        )}
        <div className="inline-flex opacity-60 transition-opacity hover:opacity-100">
          <Rim progress={progress}>
            <Tooltip>
              <TooltipTrigger
                render={
                  <div className="rounded-full bg-[#1a1a1a] p-[2px]">
                    <AnimateIcon animateOnHover asChild>
                      <button type="button" onClick={onTogglePlay} aria-label={playing ? "Pause" : "Play"} className={seg}>
                        {playing ? <Pause size={16} color="#e6e6e6" /> : <Play size={16} color="#e6e6e6" />}
                      </button>
                    </AnimateIcon>
                  </div>
                }
              />
              <TooltipContent>{playing ? "Pause" : "Play"}</TooltipContent>
            </Tooltip>
          </Rim>
        </div>
      </div>
    </TooltipProvider>
  );
}
