"use client";

/* Mounts once, renders nothing. One delegated click listener plays a tap on any
   button, an "open" for [data-sound="open"] (project cards), nothing for
   [data-sound="skip"]. Each sound resumes the audio context itself. */

import { useEffect } from "react";
import { playTap, playOpen } from "@/lib/sound";

export default function SoundController() {
  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      const el = (e.target as HTMLElement | null)?.closest?.('button, [role="button"]');
      if (!el) return;
      const kind = el.getAttribute("data-sound") ?? "tap";
      if (kind === "skip") return;
      if (kind === "open") playOpen();
      else playTap();
    };
    window.addEventListener("click", onClick);
    return () => window.removeEventListener("click", onClick);
  }, []);

  return null;
}
