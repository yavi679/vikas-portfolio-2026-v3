"use client";

/* Based on Figma node 677:1676 — "Generative Speech" case study.
   Copy written in portfolio voice (see VOICE.md). */

import VideoHero from "@/components/VideoHero";
import AutoplayVideo from "@/components/AutoplayVideo";
import { MarginRow, Feat, OutcomeCredits } from "./blocks";

const BASE = "/projects/generative-speech/case-study";

export default function CaseStudyGenerativeSpeech() {
  return (
    <div className="flex flex-col gap-[4px] items-center w-full">
      {/* Hero */}
      <VideoHero src="/projects/generative-speech/01-Generative-speech.mp4" />

      {/* Problem — margin label + right column */}
      <MarginRow label="Problem">
        <p className="leading-[1.35]">
          Adobe&apos;s bet in generative audio was to be a platform: its own models alongside
          third-party ones, not a single locked-in engine. But there was no speech product to prove it
          out, nothing to answer what competitors were shipping or to show that creators would actually
          work across multiple models in one place.
        </p>
      </MarginRow>

      {/* Full-width editor overview */}
      <img className="w-full aspect-[1120/620] rounded-2xl object-cover border border-gray-900" src={`${BASE}/shot-1.webp`} alt="" />

      {/* Approach — margin label + right column */}
      <MarginRow label="Approach">
        <p className="leading-[1.35]">
          The hard part was making models from different vendors feel like one coherent tool. I
          designed a single set of interactions that held up no matter which voice or engine sat behind
          them: pick a voice and hear it before committing, keep a versioned history to compare takes,
          and audition speech segment by segment with emotion-aware playback.
        </p>
        <p className="leading-[1.35]">
          I deliberately left out timeline editing and heavy text tooling. For a first release, clarity
          and speed mattered more than packing in features.
        </p>
      </MarginRow>

      {/* Full-width — workspace */}
      <img className="w-full aspect-[1120/620] rounded-2xl object-cover border border-gray-900" src={`${BASE}/shot-2.webp`} alt="" />

      {/* Full-width — detail */}
      <img className="w-full aspect-[1120/620] rounded-2xl object-cover border border-gray-900" src={`${BASE}/shot-3.webp`} alt="" />

      {/* Feature — auto-structuring a finished script */}
      <MarginRow>
        <Feat name="Structure from a finished script">
          People arrive with complete scripts for podcasts, vlogs, and training videos, with one voice or
          many. The tool reads the document, splits it into speaker sections, and adds emotion tags where it
          detects them, so you start from a structured draft instead of a blank page.
        </Feat>
      </MarginRow>
      <div className="w-full aspect-[1120/620] rounded-2xl overflow-hidden border border-gray-900" style={{ background: "#1a1a1a" }}>
        <AutoplayVideo className="w-full h-full object-cover" src={`${BASE}/auto-detect.mp4`} />
      </div>

      {/* Feature — adding and editing emotion tags */}
      <MarginRow>
        <Feat name="Emotion tags that feel like writing">
          Tags can be auto-detected, or you add your own: type [ to drop one inline, or select a range of
          text and choose from the context menu.
        </Feat>
      </MarginRow>
      <div className="w-full aspect-[1120/620] rounded-2xl overflow-hidden border border-gray-900" style={{ background: "#1a1a1a" }}>
        <AutoplayVideo className="w-full h-full object-cover" src={`${BASE}/emotion-tags.mp4`} />
      </div>

      {/* Feature — the media player mirrors the script */}
      <MarginRow>
        <Feat name="A player that mirrors the script">
          Speakers show up as flags and each emotion tag colors its range right in the waveform, so what you
          hear maps straight back to what you wrote, one mental model across input and output.
        </Feat>
      </MarginRow>
      <img
        className="w-full rounded-2xl"
        src={`${BASE}/media-player.webp`}
        alt="Media player: speakers shown as flags and emotion tags colored across the waveform"
      />

      {/* Outcome + credits — one container, 64px between them */}
      <OutcomeCredits
        outcome={
          <>
            <p className="leading-[1.35]">
              Adobe&apos;s first generative speech product, and the first to deliver on its strategy of
              bringing multiple third-party models together with Adobe&apos;s own inside a single
              workflow canvas.
            </p>
            <p className="leading-[1.35]">
              It reached 60,000 weekly users, averaging 7.5 generations a session.
            </p>
          </>
        }
        contributions={"Web UX, Visual & Interaction design, Creative production"}
        credits="Smit Shah, Ashish Sharma, Jay LeBoeuf, Harmony Jiroudek, Tarun Sharma, Zeyu Jin, Adolfo Hernandez, Kevin Towes, Sarah Shen"
      />
    </div>
  );
}
