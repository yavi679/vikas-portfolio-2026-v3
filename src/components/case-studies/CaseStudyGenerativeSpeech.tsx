"use client";

/* Based on Figma node 677:1676 — "Generative Speech" case study.
   Copy written in portfolio voice (see VOICE.md). */

import VideoHero from "@/components/VideoHero";

const BASE = "/projects/generative-speech/case-study";

const LABEL = { color: "#808080", fontSize: "1rem", letterSpacing: "-0.48px" } as const;
const BODY = { color: "#e6e6e6", fontSize: "1rem", letterSpacing: "-0.16px" } as const;

function TextBlock({
  label,
  children,
  className = "",
  style,
}: {
  label?: string;
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
}) {
  return (
    <div
      className={`flex flex-col gap-2 rounded-2xl justify-start ${className}`}
      style={{ background: "transparent", padding: 16, ...style }}
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

export default function CaseStudyGenerativeSpeech() {
  return (
    <div className="flex flex-col gap-2 items-center w-full">
      {/* Hero */}
      <VideoHero src="/projects/generative-speech/01-Generative-speech.mp4" />

      {/* Problem — caption left */}
      <Caption side="left" label="Problem">
        <p className="leading-[1.35]">
          Most speech tools chased output quality and stopped there. No real control, no iteration, no
          place in an actual creative workflow. Prompt in, audio out was too rigid for anything
          expressive.
        </p>
      </Caption>

      {/* Full-width editor overview */}
      <img className="w-full aspect-[1120/620] rounded-2xl object-cover border border-gray-900" src={`${BASE}/shot-1.webp`} alt="" />

      {/* Approach — caption right */}
      <Caption side="right" label="Approach">
        <p className="leading-[1.35]">
          I framed it as a platform, not a single model, so it could host both Adobe&apos;s own speech
          and outside voices behind one consistent set of interactions: pick a voice and hear it before
          committing, keep a versioned history to compare takes, and audition speech segment by segment
          with emotion-aware playback.
        </p>
        <p className="leading-[1.35]">
          I deliberately left out timeline editing and heavy text tooling. For a first release, clarity
          and speed mattered more than packing in features.
        </p>
      </Caption>

      {/* Full-width — workspace */}
      <img className="w-full aspect-[1120/620] rounded-2xl object-cover border border-gray-900" src={`${BASE}/shot-2.webp`} alt="" />

      {/* Full-width — detail */}
      <img className="w-full aspect-[1120/620] rounded-2xl object-cover border border-gray-900" src={`${BASE}/shot-3.webp`} alt="" />

      {/* Outcome (2 col) + Credits / My contributions stack (1 col) — 300px tall */}
      <div className="flex gap-2 w-full" style={{ height: 300 }}>
        <TextBlock label="Outcome" style={{ flex: "744 1 0" }}>
          <p className="leading-[1.35]">
            Shipped Adobe&apos;s first generative speech experience. The patterns it introduced are now
            referenced across products like Express and Premiere, and it set Adobe up as a platform for
            generative audio to keep building on.
          </p>
        </TextBlock>
        <div className="flex flex-col gap-2 h-full" style={{ flex: "368 1 0" }}>
          <TextBlock label="Credits" className="flex-1">
            <p className="leading-[1.35]">
              Smit Shah, Ashish Sharma, Jay LeBoeuf, Harmony Jiroudek, Tarun Sharma, Zeyu Jin, Adolfo
              Hernandez, Kevin Towes, Sarah Shen
            </p>
          </TextBlock>
          <TextBlock label="My contributions">
            <p className="leading-[1.35]">Web UX, Visual &amp; Interaction design, Creative production</p>
          </TextBlock>
        </div>
      </div>
    </div>
  );
}
