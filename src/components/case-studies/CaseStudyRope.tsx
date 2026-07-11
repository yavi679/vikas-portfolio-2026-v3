"use client";

/* Based on Figma node 911:13080 — "ROPE" case study (SCAFFOLD; copy TBD).
   Design/brand work for friends' businesses: Watto.ai, CoCreate Salon,
   Vessels by Vivian, IAG Media. Real images exported where they exist; empty
   `Media` slots render a gray placeholder for the ones still to come. */

import { MarginRow } from "./blocks";

const BASE = "/projects/rope/case-study";
const CARD = "rounded-2xl overflow-hidden border border-gray-900";

/* A media card — the image when `src` is set, else a gray placeholder block. */
function Media({ src, aspect, className = "" }: { src?: string; aspect: string; className?: string }) {
  return (
    <div className={`${CARD} ${className}`} style={{ background: "#1a1a1a", aspectRatio: aspect }}>
      {src && <img className="w-full h-full object-cover" src={`${BASE}/${src}.webp`} alt="" />}
    </div>
  );
}

/* Full-width media (1120x620). */
function FullWidth({ src }: { src?: string }) {
  return <Media src={src} aspect="1120/620" className="w-full" />;
}

/* Two square media side by side. */
function Pair({ a, b }: { a?: string; b?: string }) {
  return (
    <div className="flex gap-[4px] w-full">
      <Media src={a} aspect="1/1" className="flex-1 min-w-px" />
      <Media src={b} aspect="1/1" className="flex-1 min-w-px" />
    </div>
  );
}

export default function CaseStudyRope() {
  return (
    <div className="flex flex-col gap-[4px] items-center w-full">
      {/* Hero — transparent ROPE logo on a dark block */}
      <div className={`${CARD} w-full flex items-center justify-center`} style={{ background: "#1a1a1a", aspectRatio: "1120/400" }}>
        <img src={`${BASE}/hero.webp`} alt="ROPE" className="object-contain" style={{ maxWidth: "50%", maxHeight: "50%" }} />
      </div>

      {/* Watto.ai */}
      <MarginRow label="Watto.ai">
        <p className="leading-[1.35]">Placeholder text</p>
      </MarginRow>
      <FullWidth src="watto-ui" />
      <Pair a="watto-phone" b="watto-icons" />
      <Pair b="watto-watts" />

      {/* CoCreate Salon */}
      <MarginRow label="CoCreate Salon">
        <p className="leading-[1.35]">Placeholder text</p>
      </MarginRow>
      <FullWidth />

      {/* Vessels by Vivian */}
      <MarginRow label="Vessels by Vivian">
        <p className="leading-[1.35]">Placeholder text</p>
      </MarginRow>
      <FullWidth src="vessels" />

      {/* IAG Media */}
      <MarginRow label="IAG Media">
        <p className="leading-[1.35]">Placeholder text</p>
      </MarginRow>
      <Pair a="iag-1" b="iag-2" />
      <FullWidth src="iag-ad" />
      <Pair a="iag-3" b="iag-logo" />
    </div>
  );
}
