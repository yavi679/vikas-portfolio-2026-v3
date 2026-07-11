"use client";

/* A looping, muted video that only plays while it's actually on screen
   (IntersectionObserver), with a play/pause + duration-rim control bottom-right. */

import { useEffect, useRef, useState } from "react";
import { Play } from "@/components/animate-ui/icons/play";
import { Pause } from "@/components/animate-ui/icons/pause";
import { AnimateIcon } from "@/components/animate-ui/icons/icon";
import { Rim } from "@/components/VideoRim";

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

      <div className="absolute bottom-[4px] right-[4px] z-10 opacity-80 transition-opacity hover:opacity-100">
        <Rim progress={progress}>
          <div className="rounded-full bg-[#1a1a1a] p-[2px]">
            <AnimateIcon animateOnHover asChild>
              <button
                type="button"
                onClick={togglePlay}
                aria-label={playing ? "Pause" : "Play"}
                className="flex size-8 cursor-pointer items-center justify-center rounded-full"
              >
                {playing ? <Pause size={16} color="#e6e6e6" /> : <Play size={16} color="#e6e6e6" />}
              </button>
            </AnimateIcon>
          </div>
        </Rim>
      </div>
    </div>
  );
}
