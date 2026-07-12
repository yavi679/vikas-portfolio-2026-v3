"use client";

import { useRef, useState, useEffect } from "react";
import { VideoControl } from "@/components/VideoRim";

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

      <div className="absolute bottom-[4px] right-[4px] z-10">
        <VideoControl
          playing={playing}
          progress={progress}
          onTogglePlay={togglePlay}
          muted={hasAudio ? muted : undefined}
          onToggleMute={hasAudio ? toggleMute : undefined}
        />
      </div>
    </div>
  );
}
