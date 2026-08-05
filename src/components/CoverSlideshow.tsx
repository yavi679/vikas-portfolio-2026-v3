"use client";

/* Landing "cover" — a full-bleed crossfade slideshow of the intro slides
   (public/cover/slide-01..23.webp, exported from Figma node 945:14954).
   All frames are mounted (opacity-cross-faded) so they preload and the
   transition never flashes. Fill/cover, may crop. Each slide holds INTERVAL then
   cross-dissolves over FADE; advancing starts only once the landing's blur
   reveal has finished (see the `start` prop / PortfolioViewer). */

import { useState, useEffect } from "react";

const COUNT = 23;
const SLIDES = Array.from({ length: COUNT }, (_, i) => `/cover/slide-${String(i + 1).padStart(2, "0")}.webp`);
const INTERVAL = 3000; // ms each slide holds before advancing
const FADE = 800; // ms crossfade dissolve

export default function CoverSlideshow({ start = true }: { start?: boolean }) {
  const [idx, setIdx] = useState(0);

  // Only begin advancing once the landing's blur reveal has finished.
  useEffect(() => {
    if (!start) return;
    const t = setInterval(() => setIdx((i) => (i + 1) % SLIDES.length), INTERVAL);
    return () => clearInterval(t);
  }, [start]);

  return (
    <div className="relative h-full w-full overflow-hidden rounded-2xl" style={{ background: "#1a1a1a" }}>
      {SLIDES.map((src, i) => (
        <img
          key={src}
          src={src}
          alt=""
          aria-hidden
          className="absolute inset-0 h-full w-full object-cover"
          style={{ opacity: i === idx ? 1 : 0, transition: `opacity ${FADE}ms linear` }}
        />
      ))}
    </div>
  );
}
