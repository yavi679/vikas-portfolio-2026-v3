"use client";

/* Based on Figma node 676:1295 — "3D Illustrations" case study (refined layout).
   Half-width captions alternate left/right and bracket full-width media; headers
   only on Problem / Approach / Outcome / Credits / My contributions. Two grid
   bands show the illustration library in light and dark. Copy in portfolio
   voice (see VOICE.md). The Figma hero is an empty placeholder, so the existing
   hero reel is kept. */

import VideoHero from "@/components/VideoHero";
import { MarginRow, OutcomeCredits } from "./blocks";

const BASE = "/projects/3d-illustrations/case-study";

export default function CaseStudy3DIllustrations() {
  return (
    <div className="flex flex-col gap-[4px] items-center w-full">
      {/* Hero */}
      <VideoHero src="/projects/3d-illustrations/01-3D-Illustrations.mp4" />

      {/* Problem — margin label + right column */}
      <MarginRow label="Problem">
        <p className="leading-[1.35]">
          Outlook&apos;s illustrations were flat, literal, and inconsistent. They read as decoration
          disconnected from the interface around them, and the company-wide brand system had no
          product-specific nuance for Outlook.
        </p>
      </MarginRow>

      {/* Full-width media */}
      <img className="w-full aspect-video rounded-2xl object-cover border border-gray-900" src={`${BASE}/problem.webp`} alt="" />

      {/* Approach — margin label + right column */}
      <MarginRow label="Approach">
        <p className="leading-[1.35]">
          I partnered closely with the Fluent design team to define a visual grammar built for
          Outlook. That meant dimensional forms with real depth and elevation, symbolic and inclusive
          metaphors instead of literal depictions, and color and material systems shared with Fluent.
        </p>
      </MarginRow>

      {/* Two-up media */}
      <div className="flex gap-[4px] w-full">
        <img className="flex-1 min-w-px aspect-[556/250] rounded-2xl object-cover border border-gray-900" src={`${BASE}/two-a.webp`} alt="" />
        <img className="flex-1 min-w-px aspect-[556/250] rounded-2xl object-cover border border-gray-900" src={`${BASE}/two-b.webp`} alt="" />
      </div>

      {/* Commentary — right column */}
      <MarginRow>
        <p className="leading-[1.35]">
          The goal was balance: stay consistent with the broader language while adapting it so it
          still felt relevant to Outlook&apos;s users.
        </p>
      </MarginRow>

      {/* Full-width media */}
      <img className="w-full aspect-[1120/580] rounded-2xl object-cover border border-gray-900" src={`${BASE}/wide-a.webp`} alt="" />

      {/* Commentary — right column */}
      <MarginRow>
        <p className="leading-[1.35]">
          Different surfaces have different limits, so each illustration shipped in scalable variants,
          full 3D, 2.5D, and vector, to fit the performance budget wherever it appeared.
        </p>
      </MarginRow>

      {/* Full-width media — variant comparison */}
      <img className="w-full aspect-[1120/620] rounded-2xl object-cover border border-gray-900" src={`${BASE}/variants.webp`} alt="" />

      {/* Commentary — right column */}
      <MarginRow>
        <p className="leading-[1.35]">
          Every illustration ran through the same pipeline: ideation, metaphor selection, CMF studies,
          final selection, then production.
        </p>
      </MarginRow>

      {/* Full-width media — process */}
      <img className="w-full aspect-[1120/620] rounded-2xl object-cover border border-gray-900" src={`${BASE}/process.webp`} alt="" />

      {/* Illustration library — light + dark grids */}
      <img className="w-full aspect-[1120/232] rounded-2xl object-cover border border-gray-900" src={`${BASE}/grid-light.webp`} alt="" />
      <img className="w-full aspect-[1120/232] rounded-2xl object-cover border border-gray-900" src={`${BASE}/grid-dark.webp`} alt="" />

      {/* Outcome + credits — one container */}
      <OutcomeCredits
        outcome={
          <>
            <p className="leading-[1.35]">
              Produced and shipped 100+ illustrations across web, desktop, and mobile, in both light and
              dark.
            </p>
            <p className="leading-[1.35]">
              They replaced a patchwork of one-off visuals with a single system, a shared library and
              guidelines now used across Outlook.
            </p>
          </>
        }
        contributions={"Product evangelism & integration, Art & creative direction, Visual production"}
        credits="Alexis Copeland, Tati Astua, Yulia M, Horacio G, Pedro Leitin, BUCK Design, Christina Ergonis, Coin Moll"
      />
    </div>
  );
}
