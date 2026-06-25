"use client";

/* Pixel-match of Figma node 676:1295 — "3D Illustrations" case study.
   Content grid is 1120px wide, 8px gaps, 16px radius. Block widths are
   expressed as flex ratios (744 : 368 → 2/3 : 1/3) so the composition holds
   its proportions while filling the available column. */

const BASE = "/projects/3d-illustrations/case-study";

const LABEL = { color: "#808080", fontSize: "1rem", letterSpacing: "-0.48px" } as const;
const BODY = { color: "#e6e6e6", fontSize: "1rem", letterSpacing: "-0.16px" } as const;

function TextBlock({
  label,
  children,
  align = "bottom",
  className = "",
  style,
}: {
  label: string;
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

export default function CaseStudy3DIllustrations() {
  return (
    <div className="flex flex-col gap-2 items-center w-full">
      {/* Hero */}
      <div className="w-full aspect-video rounded-2xl overflow-hidden" style={{ background: "#1a1a1a" }}>
        <video
          className="w-full h-full object-cover"
          src="/projects/3d-illustrations/01-3D-Illustrations.mp4"
          autoPlay
          muted
          loop
          playsInline
        />
      </div>

      {/* Problem — text left (2 col) */}
      <div className="flex gap-2 w-full items-start">
        <TextBlock label="Problem" style={{ flex: "744 1 0" }}>
          <p className="leading-[1.35]">
            Existing illustrations were flat, literal, and inconsistent often functioning as
            decorative elements disconnected from the interface. Horizontal brand systems lacked
            product-specific nuance.
          </p>
        </TextBlock>
        <div style={{ flex: "368 1 0" }} />
      </div>

      {/* Problem — full-width image */}
      <img className="w-full aspect-video rounded-2xl object-cover" src={`${BASE}/problem.webp`} alt="" />

      {/* Approach — text right (2 col) */}
      <div className="flex gap-2 w-full items-start">
        <div style={{ flex: "368 1 0" }} />
        <TextBlock label="Approach" style={{ flex: "744 1 0" }}>
          <p className="leading-[1.35]">
            Partnered closely with the Fluent design team to define a product-specific visual
            grammar for Outlook, introducing dimensional forms with integrated depth and elevation,
            symbolic, inclusive metaphors over literal depictions, and shared color and material
            systems aligned with Fluent.
          </p>
        </TextBlock>
      </div>

      {/* Two-up images — 16:9 each */}
      <div className="flex gap-2 w-full">
        <img className="flex-1 min-w-px aspect-video rounded-2xl object-cover" src={`${BASE}/block-a.webp`} alt="" />
        <img className="flex-1 min-w-px aspect-video rounded-2xl object-cover" src={`${BASE}/block-b.webp`} alt="" />
      </div>

      {/* Approach text (1/3) + 3-image strip (2/3) */}
      <div className="flex gap-2 w-full" style={{ height: 620 }}>
        <TextBlock label="" align="top" className="self-start" style={{ flex: "368 1 0" }}>
          <p className="leading-[1.35]">
            Balanced system consistency with product identity adapting the broader language while
            ensuring relevance to Outlook users.
          </p>
        </TextBlock>
        <div
          className="flex h-full rounded-2xl overflow-hidden"
          style={{ flex: "744 1 0", background: "#1a1a1a" }}
        >
          <img className="flex-1 min-w-px h-full object-cover" src={`${BASE}/strip-1.webp`} alt="" />
          <img className="flex-1 min-w-px h-full object-cover" src={`${BASE}/strip-2.webp`} alt="" />
          <img className="flex-1 min-w-px h-full object-cover" src={`${BASE}/strip-3.webp`} alt="" />
        </div>
      </div>

      {/* Device on light bg (2/3) + Approach text (1/3) */}
      <div className="flex gap-2 w-full" style={{ height: 620 }}>
        <div
          className="flex items-center justify-center h-full rounded-2xl overflow-hidden"
          style={{ flex: "744 1 0", background: "#e6e6e6" }}
        >
          <img className="object-contain" style={{ height: 450 }} src={`${BASE}/device.webp`} alt="" />
        </div>
        <TextBlock label="" align="bottom" className="self-end" style={{ flex: "368 1 0" }}>
          <p className="leading-[1.35]">
            Navigated technical constraints by developing scalable variants (3D, 2.5D, vector)
            across surfaces and performance requirements.
          </p>
        </TextBlock>
      </div>

      {/* Full-width images */}
      <img className="w-full rounded-2xl" src={`${BASE}/wide-1.webp`} alt="" />
      <img className="w-full rounded-2xl" src={`${BASE}/wide-2.webp`} alt="" />

      {/* Outcome (2 col) + Credits (1 col) — fixed pair, 300px tall */}
      <div className="flex gap-2 w-full" style={{ height: 300 }}>
        <TextBlock label="Outcome" align="top" style={{ flex: "744 1 0" }}>
          <p className="leading-[1.35]">
            Produced and shipped 100+ illustrations across web, desktop, and mobile (light and dark
            modes), replacing fragmented visuals with a unified, scalable system and establishing a
            shared library and guidelines adopted across Outlook experiences.
          </p>
        </TextBlock>
        <TextBlock label="Credits" align="top" style={{ flex: "368 1 0" }}>
          <p className="leading-[1.35]">
            Alexis Copeland, Tati Astua, Yulia M, Horacio G, Pedro Leitin, BUCK Design, Christina
            Ergonis, Coin Moll
          </p>
        </TextBlock>
      </div>
    </div>
  );
}
