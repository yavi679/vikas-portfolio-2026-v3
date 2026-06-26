"use client";

import { useRef, useState } from "react";
import { VolumeX, Volume2 } from "lucide-react";

function fmt(t: number) {
  const m = Math.floor(t / 60);
  const s = Math.floor(t % 60);
  return `${m}:${s.toString().padStart(2, "0")}`;
}

/* Hero video with an optional mute/unmute control (Figma 747:866).
   Starts muted (required for autoplay); the pill turns red when sound is on,
   and reveals the current time on hover. `hasAudio={false}` hides the control
   for silent reels. */
export default function VideoHero({
  src,
  hasAudio = true,
}: {
  src: string;
  hasAudio?: boolean;
}) {
  const ref = useRef<HTMLVideoElement>(null);
  const [muted, setMuted] = useState(true);
  const [time, setTime] = useState(0);
  const [dur, setDur] = useState(0);

  const toggle = () => {
    const v = ref.current;
    if (!v) return;
    const next = !v.muted;
    v.muted = next;
    if (!next) v.volume = 1;
    setMuted(next);
  };

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
        onLoadedMetadata={(e) => setDur(e.currentTarget.duration)}
        onTimeUpdate={(e) => setTime(e.currentTarget.currentTime)}
      />

      {hasAudio && (
        <button
          onClick={toggle}
          aria-label={muted ? "Unmute video" : "Mute video"}
          className="absolute bottom-[8px] left-[8px] z-10 flex items-center cursor-pointer opacity-80 hover:opacity-100"
          style={{
            background: muted ? "#370000" : "#1a1a1a",
            // 18px = half the 36px height = full pill; animating to/from 18 (not
            // 9999) makes the radius morph interpolate smoothly instead of snapping
            borderRadius: muted ? 8 : 18,
            paddingLeft: 4,
            paddingRight: 4,
            paddingTop: 4,
            paddingBottom: 4,
            transition: "background-color 0.18s ease-out, border-radius 0.18s ease-out, opacity 0.18s ease-out",
          }}
        >
          {/* current time — always visible, fixed 48px slot */}
          <span
            className="text-center whitespace-nowrap leading-[1.35] tabular-nums"
            style={{ width: 48, color: muted ? "#fecaca" : "#b3b3b3", fontSize: "1rem", letterSpacing: "-0.14px" }}
          >
            {fmt(Math.max(0, dur - time))}
          </span>
          {/* icon — shows the action: Volume2 to turn sound on, VolumeX to mute.
              Inner radius tracks the outer: 6px in the boxy red state, capsule in the pill state */}
          <span
            className="flex items-center justify-center shrink-0"
            style={{
              background: "#0d0d0d",
              width: 36,
              height: 28,
              borderRadius: muted ? 6 : 14,
              transition: "border-radius 0.18s ease-out",
            }}
          >
            {muted ? <Volume2 size={20} color="#e6e6e6" /> : <VolumeX size={20} color="#e6e6e6" />}
          </span>
        </button>
      )}
    </div>
  );
}
