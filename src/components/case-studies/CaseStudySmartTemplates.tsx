"use client";

/* Based on Figma node 676:1322 — "Smart Templates" case study (refined layout).
   Half-width captions alternate left/right and bracket full-width media. Headers
   only on Problem / Approach / Outcome / Credits / My contributions. Commentary
   captions run as plain body text. Copy in portfolio voice (see VOICE.md). */

import AutoplayVideo from "@/components/AutoplayVideo";
import { MarginRow, OutcomeCredits } from "./blocks";

const BASE = "/projects/smart-templates/case-study";

/* Full-width media on a black canvas. Renders video for .mp4, else image.
   `fit` controls cropping (cover by default, contain to show the whole frame).
   `aspect` is a CSS aspect-ratio string, e.g. "16/9" or "1270/317". */
function FullWidth({
  src,
  aspect = "16/9",
  fit = "cover",
}: {
  src: string;
  aspect?: string;
  fit?: "cover" | "contain";
}) {
  const cls = "w-full rounded-2xl border border-gray-900";
  const style = { background: "#000", aspectRatio: aspect, objectFit: fit } as const;
  return src.endsWith(".mp4") ? (
    <div className={`${cls} relative overflow-hidden`} style={{ background: "#000", aspectRatio: aspect }}>
      <AutoplayVideo className={`h-full w-full ${fit === "contain" ? "object-contain" : "object-cover"}`} src={src} />
    </div>
  ) : (
    <img className={cls} style={style} src={src} alt="" />
  );
}

/* The "templates as apps" panel — three rows of template cards on a 30°-rotated
   stage, scrolling horizontally as opposing lanes (row1/row3 one way, row2 the
   other) for an angled "traffic" flow. Recreated from the Webflow Lottie:
   each row is two copies of its strip, so a translate of one strip-width loops
   seamlessly. */
function AnimatedPanel() {
  // top → bottom, with direction + speed mirroring the original (row3 fastest)
  const rows = [
    { src: `${BASE}/panel-row-3.webp`, dir: "R", dur: 39, top: "15%", h: "24%" },
    { src: `${BASE}/panel-row-2.webp`, dir: "L", dur: 60, top: "39.5%", h: "21%" },
    { src: `${BASE}/panel-row-1.webp`, dir: "R", dur: 48, top: "61%", h: "24%" },
  ];
  return (
    <div
      className="relative w-full aspect-video rounded-2xl overflow-hidden border border-gray-900"
      style={{ background: "#1a1a1a" }}
    >
      <div className="absolute" style={{ inset: "-50%", transform: "rotate(30deg)", transformOrigin: "center" }}>
        {rows.map((r) => (
          <div
            key={r.src}
            className="st-row absolute left-0 flex"
            style={{ top: r.top, height: r.h, animation: `stTraffic${r.dir} ${r.dur}s linear infinite`, willChange: "transform" }}
          >
            <img src={r.src} alt="" aria-hidden className="h-full w-auto max-w-none shrink-0" />
            <img src={r.src} alt="" aria-hidden className="h-full w-auto max-w-none shrink-0" />
          </div>
        ))}
      </div>
    </div>
  );
}

export default function CaseStudySmartTemplates() {
  return (
    <div className="flex flex-col gap-[4px] items-center w-full">
      {/* Hero */}
      <div className="w-full aspect-video rounded-2xl overflow-hidden border border-gray-900" style={{ background: "#1a1a1a" }}>
        <AutoplayVideo className="w-full h-full object-cover" src="/projects/smart-templates/01-Excel-x-Wolfram-templates.mp4" />
      </div>

      {/* Problem — margin label + right column */}
      <MarginRow label="Problem">
        <p className="leading-[1.35]">
          Excel just got a superpower. Through Wolfram Alpha, it could pull live, real-world data
          straight into a spreadsheet. But the templates around it were still static, rigid blank
          pages. They never showed what that data could actually do, and the empty grid kept scaring
          people off.
        </p>
      </MarginRow>

      {/* Full-width banner */}
      <FullWidth src={`${BASE}/banner-1.webp`} aspect="1270/317" />

      {/* Approach — margin label + right column */}
      <MarginRow label="Approach">
        <p className="leading-[1.35]">
          So I reframed templates as lightweight apps instead of empty grids. Each one ties data,
          structure, and interaction together: live dashboards powered by real datasets, smart
          defaults that set themselves up, and app-like interactions right in the spreadsheet. I
          designed them as a connected ecosystem and built a reusable toolkit so content teams could
          ship new ones fast.
        </p>
      </MarginRow>

      {/* Templates-as-apps — animated floating panels */}
      <AnimatedPanel />

      {/* Commentary — cross-platform */}
      <MarginRow>
        <p className="leading-[1.35]">
          People like to track health and fitness on the go, so templates had to feel just as good on
          mobile as on desktop. We&apos;d always focused on web and desktop, but going cross-platform
          was a clear way to reach a wider audience and lift NPS.
        </p>
      </MarginRow>

      {/* Full-width banner */}
      <FullWidth src={`${BASE}/banner-2.webp`} aspect="2000/877" />

      {/* Commentary — modular components */}
      <MarginRow>
        <p className="leading-[1.35]">
          A modular component system unlocks truly customizable templates. People can mix and match
          components, or even combine whole templates into a master template that acts as a frontend
          for everything connected underneath.
        </p>
      </MarginRow>

      {/* Device row 1 — modular component system (contain, full frame) */}
      <FullWidth src={`${BASE}/device-row-1.webp`} fit="contain" />

      {/* Commentary — calculators */}
      <MarginRow>
        <p className="leading-[1.35]">
          Some templates use Excel formulas as built-in calculators, helping people personalize and
          set their goals.
        </p>
      </MarginRow>

      {/* Device row 2 — calculators */}
      <FullWidth src={`${BASE}/device-row-2.mp4`} />

      {/* Commentary — calendars */}
      <MarginRow>
        <p className="leading-[1.35]">
          Calendar pickers and auto-suggestions show the template actually understands what
          you&apos;re trying to do.
        </p>
      </MarginRow>

      {/* Device row 3 — calendars */}
      <FullWidth src={`${BASE}/device-row-3.mp4`} />

      {/* Commentary — data types as platform */}
      <MarginRow>
        <p className="leading-[1.35]">
          Picture a store sharing its weekly price list through a food data type. Templates showed us
          data types could be an open platform that any data provider can plug into.
        </p>
      </MarginRow>

      {/* Device row 4 — store / data types */}
      <FullWidth src={`${BASE}/device-row-4.mp4`} />

      {/* Full-width image */}
      <FullWidth src={`${BASE}/wide-3.webp`} />

      {/* Outcome + credits — one container */}
      <OutcomeCredits
        outcome={
          <p className="leading-[1.35]">
            Shipped 10+ smart templates to Microsoft 365, across health, education, planning, and
            lifestyle. They turned the blank page into a running start for people, and gave partner
            teams a system they could keep building on.
          </p>
        }
        contributions={"Web & mobile UX, Interaction design, Visual design"}
        credits="Christian Canton, Sam Radkovitz, Alex Malkievicz"
      />
    </div>
  );
}
