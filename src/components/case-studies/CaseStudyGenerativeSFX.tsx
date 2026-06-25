"use client";

/* Based on Figma node 676:1126 — "Generative SFX" case study.
   Copy written in portfolio voice (see VOICE.md). */

const BASE = "/projects/generative-sfx/case-study";

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
      className={`relative flex h-full items-center justify-center rounded-2xl overflow-hidden border border-gray-900 ${className}`}
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
          className="absolute leading-[1.35] whitespace-nowrap"
          style={{ bottom: 44, color: "#808080", fontSize: "0.71rem", letterSpacing: "-0.2px" }}
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
      <img className="w-full aspect-video rounded-2xl object-cover border border-gray-900" src={`${BASE}/hero.webp`} alt="" />

      {/* Problem — text left (2 col) */}
      <div className="flex gap-2 w-full items-start">
        <TextBlock label="Problem" style={{ flex: "744 1 0" }}>
          <p className="leading-[1.35]">
            Sound generation stopped at prompt in, audio out. It ignored the things that make sound
            land on video: timing, motion, and intent. And there was no obvious home for it, no form
            factor for where generative audio should live next to a video.
          </p>
        </TextBlock>
        <div style={{ flex: "368 1 0" }} />
      </div>

      {/* Full-width editor */}
      <img className="w-full aspect-[1120/620] rounded-2xl object-cover border border-gray-900" src={`${BASE}/editor-full.webp`} alt="" />

      {/* Approach — text right (2 col) */}
      <div className="flex gap-2 w-full items-start">
        <div style={{ flex: "368 1 0" }} />
        <TextBlock label="Approach" style={{ flex: "744 1 0" }}>
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
        </TextBlock>
      </div>

      {/* Row — caption left + showcase right */}
      <div className="flex gap-2 w-full" style={{ height: 630 }}>
        <TextBlock label="Automatic video analysis" className="self-start" style={{ flex: "368 1 0" }}>
          <p className="leading-[1.35]">
            The tool reads your footage and builds a starting comp plus a matched library of effects,
            so you open onto cues already on the timeline, not a blank one.
          </p>
        </TextBlock>
        <div style={{ flex: "744 1 0" }} className="h-full">
          <Showcase src={`${BASE}/analysis.webp`} maxH={450} className="w-full" />
        </div>
      </div>

      {/* Row — showcase left + caption right (bottom) */}
      <div className="flex gap-2 w-full" style={{ height: 630 }}>
        <div style={{ flex: "744 1 0" }} className="h-full">
          <Showcase src={`${BASE}/timeline.webp`} maxH={404} className="w-full" />
        </div>
        <TextBlock label="Lightweight generative timeline" align="bottom" className="self-end" style={{ flex: "368 1 0" }}>
          <p className="leading-[1.35]">
            A familiar, linear workspace. The opinionated layout makes generative results feel arranged
            and intentional, not like a pile of clips.
          </p>
        </TextBlock>
      </div>

      {/* Row — three social posts with reach */}
      <div className="flex gap-2 w-full" style={{ height: 620 }}>
        <Showcase src={`${BASE}/post-1.webp`} maxH={400} maxW="62%" caption="9.1M Views" className="flex-1 min-w-px" />
        <Showcase src={`${BASE}/post-2.webp`} maxH={400} maxW="62%" caption="3.5M Views" className="flex-1 min-w-px" />
        <Showcase src={`${BASE}/post-3.webp`} maxH={400} maxW="62%" caption="1.4M Views" className="flex-1 min-w-px" />
      </div>

      {/* Outcome (2 col) + Credits / My contributions stack (1 col) — 300px tall */}
      <div className="flex gap-2 w-full" style={{ height: 300 }}>
        <TextBlock label="Outcome" style={{ flex: "744 1 0" }}>
          <p className="leading-[1.35]">
            Shipped a generative SFX editor on desktop and mobile web, letting creators score sound
            directly onto video.
          </p>
          <p className="leading-[1.35]">
            The interaction patterns now feed Firefly&apos;s video work and are shaping roadmap
            priorities across Express and Premiere.
          </p>
        </TextBlock>
        <div className="flex flex-col gap-2 h-full" style={{ flex: "368 1 0" }}>
          <TextBlock label="Credits" className="flex-1">
            <p className="leading-[1.35]">
              Justin Salomon, Prannoy Mittal, Rahul Gupta, Eshani Pendsey, Sarah Shen, Oriol Nieto
            </p>
          </TextBlock>
          <TextBlock label="My contributions">
            <p className="leading-[1.35]">Web &amp; mobile web UX, Interaction design, Creative direction</p>
          </TextBlock>
        </div>
      </div>
    </div>
  );
}
