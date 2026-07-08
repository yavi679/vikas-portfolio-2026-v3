"use client";

/* Based on Figma node 676:1331 — "UX Redesigns" case study (refined layout).
   Copy is written in portfolio voice (see VOICE.md). */

import { MarginRow, Feat, CreditsRow } from "./blocks";

const BASE = "/projects/ux-redesigns/case-study";

/* Full-bleed media on a white canvas, fully visible (object-contain) so panels
   aren't cropped. Renders <video> for .mp4 sources, <img> otherwise. */
function Media({ src, className = "" }: { src: string; className?: string }) {
  const cls = `rounded-2xl object-contain border border-gray-900 ${className}`;
  const style = { background: "#fff" } as const;
  return src.endsWith(".mp4") ? (
    <video className={cls} style={style} src={src} autoPlay muted loop playsInline />
  ) : (
    <img className={cls} style={style} src={src} alt="" />
  );
}

/* Two equal media panels side by side. */
function Pair({ a, b, height }: { a: string; b: string; height: number }) {
  return (
    <div className="flex gap-[4px] w-full" style={{ height }}>
      <Media src={a} className="flex-1 min-w-px h-full" />
      <Media src={b} className="flex-1 min-w-px h-full" />
    </div>
  );
}

export default function CaseStudyUXRedesigns() {
  return (
    <div className="flex flex-col gap-[4px] items-center w-full">
      {/* Hero */}
      <div className="w-full aspect-video rounded-2xl overflow-hidden border border-gray-900" style={{ background: "#1a1a1a" }}>
        <video
          className="w-full h-full object-cover"
          src="/projects/ux-redesigns/01-Core-feature-redesigns.mp4"
          autoPlay
          muted
          loop
          playsInline
        />
      </div>

      {/* Problem — margin label + right column */}
      <MarginRow label="Problem">
        <p className="leading-[1.35]">
          As Excel moved to the web, its interaction model needed to catch up. It had to feel modern
          and hold its own against tools like Google Sheets. The core moves, sorting, filtering, and
          shortcuts, were powerful but dense. They came straight over from desktop without adapting to
          the web, and all that complexity made Excel feel daunting, especially for newer users.
        </p>
      </MarginRow>

      {/* Full-width image — isometric */}
      <img className="w-full aspect-video rounded-2xl object-cover border border-gray-900" src={`${BASE}/wide-1.webp`} alt="" />

      {/* Quick commits — right column */}
      <MarginRow>
        <Feat name="Quick commits">
          You can commit a shortcut straight from the panel, not just look it up. Handy when reaching
          for a key combo isn&apos;t easy.
        </Feat>
      </MarginRow>

      {/* Pair — Quick commits + Browser overrides */}
      <Pair a={`${BASE}/pair1-a.mp4`} b={`${BASE}/pair1-b.mp4`} height={500} />

      {/* Browser overrides — right column */}
      <MarginRow>
        <Feat name="Browser overrides">
          Color flags when Excel overrides a browser shortcut, and hovering shows exactly which one it
          replaced.
        </Feat>
      </MarginRow>

      {/* Sort or filter by cell color — right column */}
      <MarginRow>
        <Feat name="Sort or filter by cell color">
          Each color you pick jumps to the front of the tray in the order you chose. Tooltips tie a
          color back to the values behind it.
        </Feat>
      </MarginRow>

      {/* Full-width video — sort/filter by color */}
      <video
        className="w-full aspect-video rounded-2xl object-cover border border-gray-900"
        src={`${BASE}/sort-by-color.mp4`}
        autoPlay
        muted
        loop
        playsInline
      />

      {/* Share shortcuts — right column */}
      <MarginRow>
        <Feat name="Share shortcuts">
          No more sticky notes. People can save, curate, and share their favorite shortcuts to speed up
          their own and their team&apos;s workflows.
        </Feat>
      </MarginRow>

      {/* Pair — Search + Share */}
      <Pair a={`${BASE}/pair2-a.webp`} b={`${BASE}/pair2-b.webp`} height={630} />

      {/* Search in natural language — right column */}
      <MarginRow>
        <Feat name="Search in natural language">
          Natural language is spreading across Excel, so I brought it in search too. You can find a
          shortcut just by describing what you want to do.
        </Feat>
      </MarginRow>

      {/* Sort/filter by number — right column */}
      <MarginRow>
        <Feat name="Sort/filter by number">
          Pick an operator and it drops straight into the input, or just type to edit it inline without
          moving your cursor. The field confirms whether each change took.
        </Feat>
      </MarginRow>

      {/* Full-width video — sort/filter by number */}
      <video
        className="w-full aspect-video rounded-2xl object-cover border border-gray-900"
        src={`${BASE}/sort-by-number.mp4`}
        autoPlay
        muted
        loop
        playsInline
      />

      {/* Max mode — right column */}
      <MarginRow>
        <Feat name="Max mode">
          A denser, power-user view that keeps every shortcut within reach for people who live in the
          keyboard.
        </Feat>
      </MarginRow>

      {/* Onboarding — right column */}
      <MarginRow>
        <Feat name="Onboarding">
          A light first run that introduces the new shortcut system without getting in the way.
        </Feat>
      </MarginRow>

      {/* Pair — Max mode + Onboarding */}
      <Pair a={`${BASE}/pair3-a.mp4`} b={`${BASE}/pair3-b.mp4`} height={630} />

      {/* Outcome — margin label + right column */}
      <MarginRow label="Outcome">
        <p className="leading-[1.35]">
          Shipped redesigned sorting, filtering, and shortcut systems on Excel for the web. They made
          everyday actions more approachable for new users while keeping the depth power users rely
          on.
        </p>
      </MarginRow>

      {/* Credits + My contributions */}
      <CreditsRow
        contributions="Web UX, Interaction design, Visual design"
        credits="Christian Canton, Alex Malkievicz, Jessie Xue"
      />
    </div>
  );
}
