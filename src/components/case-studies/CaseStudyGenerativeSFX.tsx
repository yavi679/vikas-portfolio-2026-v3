"use client";

/* Based on Figma node 676:1126 — "Generative SFX" case study.
   Copy written in portfolio voice (see VOICE.md). */

import VideoHero from "@/components/VideoHero";
import { MarginRow, Feat, CreditsRow } from "./blocks";

const BASE = "/projects/generative-sfx/case-study";

/* A showcase card: dark canvas with a centered screenshot floated on it. */
function Showcase({
  src,
  maxH,
  maxW = "88%",
  caption,
  style,
  className = "",
}: {
  src: string;
  maxH: number;
  maxW?: string;
  caption?: string;
  style?: React.CSSProperties;
  className?: string;
}) {
  return (
    <div
      className={`flex h-full flex-col items-center justify-center gap-3 rounded-2xl overflow-hidden border border-gray-900 ${className}`}
      style={{ background: "#1a1a1a", ...style }}
    >
      <img
        className="object-contain"
        style={{ maxHeight: maxH, maxWidth: maxW }}
        src={src}
        alt=""
      />
      {caption && (
        <p
          className="leading-[1.35] whitespace-nowrap"
          style={{ color: "#808080", fontSize: "0.71rem", letterSpacing: "-0.2px" }}
        >
          {caption}
        </p>
      )}
    </div>
  );
}

export default function CaseStudyGenerativeSFX() {
  return (
    <div className="flex flex-col gap-2 items-center w-full">
      {/* Hero */}
      <VideoHero src="/projects/generative-sfx/01-Generative-sound-effects.mp4" />

      {/* Problem — margin label + right column */}
      <MarginRow label="Problem">
        <p className="leading-[1.35]">
          Sound generation stopped at prompt in, audio out. It ignored the things that make sound land
          on video: timing, motion, and intent. And there was no obvious home for it, no form factor
          for where generative audio should live next to a video.
        </p>
      </MarginRow>

      {/* Full-width editor overview */}
      <img className="w-full aspect-[1120/620] rounded-2xl object-cover border border-gray-900" src={`${BASE}/shot-1.webp`} alt="" />

      {/* Approach — margin label + right column */}
      <MarginRow label="Approach">
        <p className="leading-[1.35]">
          I started from the creator, not the model. Sound isn&apos;t something you describe once,
          it&apos;s something you perform against picture. So I built the tool around placing and
          timing sound in context, with a lightweight timeline for dropping, snapping, and reworking
          cues.
        </p>
        <p className="leading-[1.35]">
          That meant drawing hard lines. No full DAW, capped tracks, capped duration. Every cut kept
          the tool fast and easy to pick up, which matters more than power for a first release.
        </p>
      </MarginRow>

      {/* Lightweight generative timeline — right column */}
      <MarginRow>
        <Feat name="Lightweight generative timeline">
          A familiar, linear workspace. The opinionated layout makes generative results feel arranged
          and intentional, not like a pile of clips.
        </Feat>
      </MarginRow>

      {/* Timeline — full-width */}
      <img className="w-full aspect-[1120/620] rounded-2xl object-cover border border-gray-900" src={`${BASE}/shot-2.webp`} alt="" />

      {/* Automatic video analysis — right column */}
      <MarginRow>
        <Feat name="Automatic video analysis">
          The tool reads your footage and builds a starting comp plus a matched library of effects, so
          you open onto cues already on the timeline, not a blank one.
        </Feat>
      </MarginRow>

      {/* Analysis — full-width */}
      <img className="w-full aspect-[1120/620] rounded-2xl object-cover border border-gray-900" src={`${BASE}/shot-3.webp`} alt="" />

      {/* Row — three social posts with reach */}
      <div className="flex gap-2 w-full" style={{ height: 480 }}>
        <Showcase src={`${BASE}/post-1.webp`} maxH={400} maxW="62%" caption="9.1M Views" className="flex-1 min-w-px" />
        <Showcase src={`${BASE}/post-2.webp`} maxH={400} maxW="62%" caption="3.5M Views" className="flex-1 min-w-px" />
        <Showcase src={`${BASE}/post-3.webp`} maxH={400} maxW="62%" caption="1.4M Views" className="flex-1 min-w-px" />
      </div>

      {/* Full-width — editor across surfaces */}
      <img className="w-full aspect-[1120/620] rounded-2xl object-cover border border-gray-900" src={`${BASE}/shot-4.webp`} alt="" />

      {/* Outcome — margin label + right column */}
      <MarginRow label="Outcome">
        <p className="leading-[1.35]">
          Shipped a generative SFX editor on desktop and mobile web, letting creators score sound
          directly onto video.
        </p>
        <p className="leading-[1.35]">
          The interaction patterns now feed Firefly&apos;s video work and are shaping roadmap
          priorities across Express and Premiere.
        </p>
      </MarginRow>

      {/* Credits + My contributions */}
      <CreditsRow
        contributions="Web & mobile web UX, Interaction design, Creative production"
        credits="Justin Salomon, Prannoy Mittal, Rahul Gupta, Eshani Pendsey, Sarah Shen, Oriol Nieto"
      />
    </div>
  );
}
