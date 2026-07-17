"use client";

/* Landing "cover" — a full-bleed crossfade slideshow of the intro slides
   (public/cover/slide-01..18.webp, exported from Figma node 945:14954).
   All frames are mounted (opacity-cross-faded) so they preload and the
   transition never flashes. Fill/cover, may crop. Advance interval is short on
   purpose (montage feel); TRANSITION is up for later iteration. */

import { useState, useEffect } from "react";

const COUNT = 23;
const SLIDES = Array.from({ length: COUNT }, (_, i) => `/cover/slide-${String(i + 1).padStart(2, "0")}.webp`);
const INTERVAL = 1500; // ms between slides
const FADE = 200; // ms crossfade

export default function CoverSlideshow() {
  const [idx, setIdx] = useState(0);

  useEffect(() => {
    const t = setInterval(() => setIdx((i) => (i + 1) % SLIDES.length), INTERVAL);
    return () => clearInterval(t);
  }, []);

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
