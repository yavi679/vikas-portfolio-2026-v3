"use client";

/* Based on Figma node 676:1331 — "UX Redesigns" case study (refined layout).
   Captions are half-width (556) blocks that alternate left/right and bracket
   full-width image pairs. Copy is written in portfolio voice (see VOICE.md). */

const BASE = "/projects/ux-redesigns/case-study";

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

/* A single half-width caption pinned to one side, the other half left open.
   Feature captions omit the label and inline the feature name in the body. */
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
      {/* width matches a media pair card exactly: (100% - 8px gap) / 2 */}
      <TextBlock label={label} style={{ width: "calc(50% - 4px)" }}>
        {children}
      </TextBlock>
    </div>
  );
}

/* A feature note: muted gray name + bullet, then the description in body color. */
function Feat({ name, children }: { name: string; children: React.ReactNode }) {
  return (
    <p className="leading-[1.35]">
      <span style={{ color: "#808080" }}>{name} • </span>
      {children}
    </p>
  );
}

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
    <div className="flex gap-2 w-full" style={{ height }}>
      <Media src={a} className="flex-1 min-w-px h-full" />
      <Media src={b} className="flex-1 min-w-px h-full" />
    </div>
  );
}

export default function CaseStudyUXRedesigns() {
  return (
    <div className="flex flex-col gap-2 items-center w-full">
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

      {/* Problem — caption left (half) */}
      <Caption side="left" label="Problem">
        <p className="leading-[1.35]">
          As Excel moved to the web, its interaction model needed to catch up. It had to feel modern
          and hold its own against tools like Google Sheets. The core moves, sorting, filtering, and
          shortcuts, were powerful but dense. They came straight over from desktop without adapting to
          the web, and all that complexity made Excel feel daunting, especially for newer users.
        </p>
      </Caption>

      {/* Full-width image — isometric */}
      <img className="w-full aspect-video rounded-2xl object-cover border border-gray-900" src={`${BASE}/wide-1.webp`} alt="" />

      {/* Quick commits — caption left */}
      <Caption side="left">
        <Feat name="Quick commits">
          You can commit a shortcut straight from the panel, not just look it up. Handy when reaching
          for a key combo isn&apos;t easy.
        </Feat>
      </Caption>

      {/* Pair — Quick commits + Browser overrides */}
      <Pair a={`${BASE}/pair1-a.mp4`} b={`${BASE}/pair1-b.mp4`} height={500} />

      {/* Browser overrides — caption right */}
      <Caption side="right">
        <Feat name="Browser overrides">
          Color flags when Excel overrides a browser shortcut, and hovering shows exactly which one it
          replaced.
        </Feat>
      </Caption>

      {/* Sort or filter by cell color — caption left */}
      <Caption side="left">
        <Feat name="Sort or filter by cell color">
          Each color you pick jumps to the front of the tray in the order you chose. Tooltips tie a
          color back to the values behind it.
        </Feat>
      </Caption>

      {/* Full-width video — sort/filter by color */}
      <video
        className="w-full aspect-video rounded-2xl object-cover border border-gray-900"
        src={`${BASE}/sort-by-color.mp4`}
        autoPlay
        muted
        loop
        playsInline
      />

      {/* Share shortcuts — caption right */}
      <Caption side="right">
        <Feat name="Share shortcuts">
          No more sticky notes. People can save, curate, and share their favorite shortcuts to speed up
          their own and their team&apos;s workflows.
        </Feat>
      </Caption>

      {/* Pair — Search + Share */}
      <Pair a={`${BASE}/pair2-a.webp`} b={`${BASE}/pair2-b.webp`} height={630} />

      {/* Search in natural language — caption left */}
      <Caption side="left">
        <Feat name="Search in natural language">
          Natural language is spreading across Excel, so I brought it in search too. You can find a
          shortcut just by describing what you want to do.
        </Feat>
      </Caption>

      {/* Sort/filter by number — caption left */}
      <Caption side="left">
        <Feat name="Sort/filter by number">
          Pick an operator and it drops straight into the input, or just type to edit it inline without
          moving your cursor. The field confirms whether each change took.
        </Feat>
      </Caption>

      {/* Full-width video — sort/filter by number */}
      <video
        className="w-full aspect-video rounded-2xl object-cover border border-gray-900"
        src={`${BASE}/sort-by-number.mp4`}
        autoPlay
        muted
        loop
        playsInline
      />

      {/* Max mode + Onboarding — two captions side by side */}
      <div className="flex gap-2 w-full items-start">
        <TextBlock className="min-w-px" style={{ flex: "556 1 0" }}>
          <Feat name="Max mode">
            A denser, power-user view that keeps every shortcut within reach for people who live in the
            keyboard.
          </Feat>
        </TextBlock>
        <TextBlock className="min-w-px" style={{ flex: "556 1 0" }}>
          <Feat name="Onboarding">
            A light first run that introduces the new shortcut system without getting in the way.
          </Feat>
        </TextBlock>
      </div>

      {/* Pair — Max mode + Onboarding */}
      <Pair a={`${BASE}/pair3-a.mp4`} b={`${BASE}/pair3-b.mp4`} height={630} />

      {/* Outcome (2 col) + Credits / My contributions stack (1 col) — 300px tall */}
      <div className="flex gap-2 w-full" style={{ height: 300 }}>
        <TextBlock label="Outcome" style={{ flex: "744 1 0" }}>
          <p className="leading-[1.35]">
            Shipped redesigned sorting, filtering, and shortcut systems on Excel for the web. They made
            everyday actions more approachable for new users while keeping the depth power users rely
            on.
          </p>
        </TextBlock>
        <div className="flex flex-col gap-2 h-full" style={{ flex: "368 1 0" }}>
          <TextBlock label="Credits" className="flex-1">
            <p className="leading-[1.35]">Christian Canton, Alex Malkievicz, Jessie Xue</p>
          </TextBlock>
          <TextBlock label="My contributions">
            <p className="leading-[1.35]">Web UX, Interaction design, Visual design</p>
          </TextBlock>
        </div>
      </div>
    </div>
  );
}
