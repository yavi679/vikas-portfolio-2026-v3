"use client";

/* A looping, muted video that only plays while it's actually on screen
   (IntersectionObserver), with a play/pause + duration-rim control bottom-right. */

import { useEffect, useRef, useState } from "react";
import { VideoControl } from "@/components/VideoRim";

export default function AutoplayVideo({
  src,
  className,
  threshold = 0.25,
}: {
  src: string;
  className?: string;
  threshold?: number;
}) {
  const ref = useRef<HTMLVideoElement>(null);
  const [playing, setPlaying] = useState(false);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) el.play().catch(() => {});
        else el.pause();
      },
      { threshold }
    );
    io.observe(el);
    return () => io.disconnect();
  }, [threshold]);

  const togglePlay = () => {
    const v = ref.current;
    if (!v) return;
    if (v.paused) v.play().catch(() => {});
    else v.pause();
  };

  return (
    <div className="relative h-full w-full">
      <video
        ref={ref}
        className={className}
        src={src}
        muted
        loop
        playsInline
        preload="metadata"
        onPlay={() => setPlaying(true)}
        onPause={() => setPlaying(false)}
        onTimeUpdate={(e) => {
          const v = e.currentTarget;
          setProgress(v.duration ? v.currentTime / v.duration : 0);
        }}
      />

      <div className="absolute bottom-[4px] right-[4px] z-10">
        <VideoControl playing={playing} progress={progress} onTogglePlay={togglePlay} />
      </div>
    </div>
  );
}
