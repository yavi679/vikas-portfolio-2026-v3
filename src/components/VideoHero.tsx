"use client";

import { useRef, useState, useEffect, type ReactNode } from "react";
import { Play, Pause, Volume2, VolumeX } from "lucide-react";

/* A duration rim that traces the control's rounded outline (circle for a square
   child, stadium for a wide one) and fills with playback progress. One rounded
   <rect> with pathLength=1 works for both shapes. */
const GAP = 0; // rim sits flush on the control's edge
const STROKE = 2;

function Rim({ progress, children }: { progress: number; children: ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  const [dim, setDim] = useState({ w: 0, h: 0 });

  // Measure the actual rendered pill so the ring matches it (Tailwind spacing
  // renders at this project's 14px rem scale, so px can't be assumed).
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

/* Hero video with a duration-rim control (Figma 747:866). The rim shows playback
   progress; the center button plays/pauses. With `hasAudio`, a mute/unmute segment
   is added and the control becomes a pill (rim traces its stadium). */
export default function VideoHero({
  src,
  hasAudio = true,
}: {
  src: string;
  hasAudio?: boolean;
}) {
  const ref = useRef<HTMLVideoElement>(null);
  const [playing, setPlaying] = useState(true);
  const [muted, setMuted] = useState(true);
  const [progress, setProgress] = useState(0);

  const togglePlay = () => {
    const v = ref.current;
    if (!v) return;
    if (v.paused) v.play().catch(() => {});
    else v.pause();
  };

  const toggleMute = () => {
    const v = ref.current;
    if (!v) return;
    const next = !v.muted;
    v.muted = next;
    if (!next) v.volume = 1;
    setMuted(next);
  };

  // "M" hotkey toggles mute (only one hero is mounted at a time).
  useEffect(() => {
    if (!hasAudio) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.metaKey || e.ctrlKey || e.altKey || e.repeat) return;
      if (e.key.toLowerCase() !== "m") return;
      const el = document.activeElement as HTMLElement | null;
      if (el && (el.tagName === "INPUT" || el.tagName === "TEXTAREA" || el.isContentEditable)) return;
      toggleMute();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hasAudio]);

  const seg = "flex items-center justify-center rounded-full cursor-pointer";
  const playIcon = playing ? (
    <Pause size={16} color="#e6e6e6" fill="#e6e6e6" />
  ) : (
    <Play size={16} color="#e6e6e6" fill="#e6e6e6" />
  );

  return (
    <div className="relative w-full aspect-video rounded-2xl overflow-hidden border border-gray-900" style={{ background: "#1a1a1a" }}>
      <video
        ref={ref}
        className="w-full h-full object-cover"
        src={src}
        autoPlay
        muted
        loop
        playsInline
        onPlay={() => setPlaying(true)}
        onPause={() => setPlaying(false)}
        onTimeUpdate={(e) => {
          const v = e.currentTarget;
          setProgress(v.duration ? v.currentTime / v.duration : 0);
        }}
      />

      <div className="absolute bottom-[8px] left-[8px] z-10 opacity-80 transition-opacity hover:opacity-100">
        <Rim progress={progress}>
          {hasAudio ? (
            <div className="flex items-center gap-[2px] rounded-full bg-[#1a1a1a] p-[2px]">
              <button type="button" onClick={togglePlay} aria-label={playing ? "Pause" : "Play"} className={`${seg} h-8 w-9`}>
                {playIcon}
              </button>
              <button
                type="button"
                onClick={toggleMute}
                aria-label={muted ? "Unmute" : "Mute"}
                className={`${seg} h-8 w-9`}
                style={{ background: muted ? "#370000" : "transparent" }}
              >
                {muted ? <VolumeX size={20} color="#e6e6e6" /> : <Volume2 size={20} color="#e6e6e6" />}
              </button>
            </div>
          ) : (
            <div className="rounded-full bg-[#1a1a1a] p-[2px]">
              <button type="button" onClick={togglePlay} aria-label={playing ? "Pause" : "Play"} className={`${seg} size-8`}>
                {playIcon}
              </button>
            </div>
          )}
        </Rim>
      </div>
    </div>
  );
}
