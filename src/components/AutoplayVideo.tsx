"use client";

/* A looping, muted video that only plays while it's actually on screen
   (IntersectionObserver), so it isn't decoding when scrolled away. */

import { useEffect, useRef } from "react";

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

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          el.play().catch(() => {}); // ignore autoplay-policy rejections
        } else {
          el.pause();
        }
      },
      { threshold }
    );
    io.observe(el);
    return () => io.disconnect();
  }, [threshold]);

  return <video ref={ref} className={className} src={src} muted loop playsInline preload="metadata" />;
}
