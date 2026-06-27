"use client";

/* Based on Figma node 676:1295 — "3D Illustrations" case study (refined layout).
   Half-width captions alternate left/right and bracket full-width media; headers
   only on Problem / Approach / Outcome / Credits / My contributions. Two grid
   bands show the illustration library in light and dark. Copy in portfolio
   voice (see VOICE.md). The Figma hero is an empty placeholder, so the existing
   hero reel is kept. */

import VideoHero from "@/components/VideoHero";

const BASE = "/projects/3d-illustrations/case-study";

const LABEL = { color: "#808080", fontSize: "1rem", letterSpacing: "-0.48px" } as const;
const BODY = { color: "#e6e6e6", fontSize: "1rem", letterSpacing: "-0.16px" } as const;

function TextBlock({
  label,
  children,
  align = "top",
  className = "",
  style,
}: {
  label?: string;
  children: React.ReactNode;
  align?: "top" | "bottom";
  className?: string;
  style?: React.CSSProperties;
}) {
  return (
    <div
      className={`flex flex-col gap-2 rounded-2xl ${align === "bottom" ? "justify-end" : "justify-start"} ${className}`}
      style={{ background: "#1a1a1a", padding: 16, ...style }}
    >
      {label && (
        <p className="leading-[1.35] whitespace-nowrap" style={LABEL}>
          {label}
        </p>
      )}
      <div className="flex flex-col gap-2 leading-[1.35]" style={BODY}>
        {children}
      </div>
    </div>
  );
}

/* A half-width caption pinned to one side; width matches a full-width media's
   half exactly: (100% - 8px gap) / 2. */
function Caption({
  side,
  label,
  children,
}: {
  side: "left" | "right";
  label?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex w-full" style={{ justifyContent: side === "left" ? "flex-start" : "flex-end" }}>
      <TextBlock label={label} style={{ width: "calc(50% - 4px)" }}>
        {children}
      </TextBlock>
    </div>
  );
}

export default function CaseStudy3DIllustrations() {
  return (
    <div className="flex flex-col gap-2 items-center w-full">
      {/* Hero */}
      <VideoHero src="/projects/3d-illustrations/01-3D-Illustrations.mp4" />

      {/* Problem — caption left */}
      <Caption side="left" label="Problem">
        <p className="leading-[1.35]">
          Outlook&apos;s illustrations were flat, literal, and inconsistent. They read as decoration
          disconnected from the interface around them, and the company-wide brand system had no
          product-specific nuance for Outlook.
        </p>
      </Caption>

      {/* Full-width media */}
      <img className="w-full aspect-video rounded-2xl object-cover border border-gray-900" src={`${BASE}/problem.webp`} alt="" />

      {/* Approach — caption right */}
      <Caption side="right" label="Approach">
        <p className="leading-[1.35]">
          I partnered closely with the Fluent design team to define a visual grammar built for
          Outlook. That meant dimensional forms with real depth and elevation, symbolic and inclusive
          metaphors instead of literal depictions, and color and material systems shared with Fluent.
        </p>
      </Caption>

      {/* Two-up media */}
      <div className="flex gap-2 w-full">
        <img className="flex-1 min-w-px aspect-[556/250] rounded-2xl object-cover border border-gray-900" src={`${BASE}/two-a.webp`} alt="" />
        <img className="flex-1 min-w-px aspect-[556/250] rounded-2xl object-cover border border-gray-900" src={`${BASE}/two-b.webp`} alt="" />
      </div>

      {/* Commentary — caption left */}
      <Caption side="left">
        <p className="leading-[1.35]">
          The goal was balance: stay consistent with the broader language while adapting it so it
          still felt relevant to Outlook&apos;s users.
        </p>
      </Caption>

      {/* Full-width media */}
      <img className="w-full aspect-[1120/580] rounded-2xl object-cover border border-gray-900" src={`${BASE}/wide-a.webp`} alt="" />

      {/* Commentary — caption right */}
      <Caption side="right">
        <p className="leading-[1.35]">
          Different surfaces have different limits, so each illustration shipped in scalable variants,
          full 3D, 2.5D, and vector, to fit the performance budget wherever it appeared.
        </p>
      </Caption>

      {/* Full-width media — variant comparison */}
      <img className="w-full aspect-[1120/620] rounded-2xl object-cover border border-gray-900" src={`${BASE}/variants.webp`} alt="" />

      {/* Commentary — caption left */}
      <Caption side="left">
        <p className="leading-[1.35]">
          Every illustration ran through the same pipeline: ideation, metaphor selection, CMF studies,
          final selection, then production.
        </p>
      </Caption>

      {/* Full-width media — process */}
      <img className="w-full aspect-[1120/620] rounded-2xl object-cover border border-gray-900" src={`${BASE}/process.webp`} alt="" />

      {/* Illustration library — light + dark grids */}
      <img className="w-full aspect-[1120/232] rounded-2xl object-cover border border-gray-900" src={`${BASE}/grid-light.webp`} alt="" />
      <img className="w-full aspect-[1120/232] rounded-2xl object-cover border border-gray-900" src={`${BASE}/grid-dark.webp`} alt="" />

      {/* Outcome (2 col) + Credits / My contributions stack (1 col) — 300px tall */}
      <div className="flex gap-2 w-full" style={{ height: 300 }}>
        <TextBlock label="Outcome" style={{ flex: "744 1 0" }}>
          <p className="leading-[1.35]">
            Produced and shipped 100+ illustrations across web, desktop, and mobile, in both light and
            dark.
          </p>
          <p className="leading-[1.35]">
            They replaced a patchwork of one-off visuals with a single system, a shared library and
            guidelines now used across Outlook.
          </p>
        </TextBlock>
        <div className="flex flex-col gap-2 h-full" style={{ flex: "368 1 0" }}>
          <TextBlock label="Credits" className="flex-1">
            <p className="leading-[1.35]">
              Alexis Copeland, Tati Astua, Yulia M, Horacio G, Pedro Leitin, BUCK Design, Christina
              Ergonis, Coin Moll
            </p>
          </TextBlock>
          <TextBlock label="My contributions">
            <p className="leading-[1.35]">
              Product evangelism &amp; integration, Art &amp; creative direction, Visual production
            </p>
          </TextBlock>
        </div>
      </div>
    </div>
  );
}
