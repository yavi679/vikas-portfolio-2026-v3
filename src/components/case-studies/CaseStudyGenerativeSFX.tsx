"use client";

/* Based on Figma node 676:1126 — "Generative SFX" case study.
   Copy written in portfolio voice (see VOICE.md). */

import { useEffect, useRef, useState } from "react";
import VideoHero from "@/components/VideoHero";
import { MarginRow, Feat, OutcomeCredits, LABEL } from "./blocks";
import { Play } from "@/components/animate-ui/icons/play";
import { Pause } from "@/components/animate-ui/icons/pause";
import { Volume2 } from "@/components/animate-ui/icons/volume-2";
import { VolumeOff } from "@/components/animate-ui/icons/volume-off";
import { AnimateIcon } from "@/components/animate-ui/icons/icon";
import { Rim } from "@/components/VideoRim";

const BASE = "/projects/generative-sfx/case-study";

/* A showcase card: dark canvas with a centered screenshot or a 9:16 reel floated
   on it. Reels play while on screen and carry the hero's play + mute + rim
   control, anchored to the card's bottom-right (no M hotkey — several mount at
   once). */
function Showcase({
  src,
  maxH,
  maxW = "88%",
  caption,
  style,
  className = "",
  video = false,
}: {
  src: string;
  maxH: number;
  maxW?: string;
  caption?: string;
  style?: React.CSSProperties;
  className?: string;
  video?: boolean;
}) {
  const ref = useRef<HTMLVideoElement>(null);
  const [playing, setPlaying] = useState(false);
  const [muted, setMuted] = useState(true);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (!video) return;
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) el.play().catch(() => {});
        else el.pause();
      },
      { threshold: 0.25 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, [video]);

  const togglePlay = () => {
    const v = ref.current;
    if (!v) return;
    if (v.paused) v.play().catch(() => {});
    else v.pause();
  };
  const toggleMute = () => {
    const v = ref.current;
    if (!v) return;
    const next = !v.muted;
    v.muted = next;
    if (!next) v.volume = 1;
    setMuted(next);
  };

  const seg = "flex items-center justify-center rounded-full cursor-pointer";
  return (
    <div
      className={`relative flex h-full flex-col items-center justify-center gap-3 rounded-2xl overflow-hidden border border-gray-900 ${className}`}
      style={{ background: "#1a1a1a", ...style }}
    >
      {video ? (
        <div className="relative" style={{ width: "60%", aspectRatio: "9 / 16" }}>
          <video
            ref={ref}
            className="absolute inset-0 h-full w-full object-cover"
            src={src}
            poster={src.replace(/\.mp4$/, "-poster.webp")}
            muted
            loop
            playsInline
            preload="metadata"
            onPlay={() => setPlaying(true)}
            onPause={() => setPlaying(false)}
            onTimeUpdate={(e) => {
              const v = e.currentTarget;
              setProgress(v.duration ? v.currentTime / v.duration : 0);
            }}
          />
        </div>
      ) : (
        <img
          className="object-contain"
          style={{ maxHeight: maxH, maxWidth: maxW }}
          src={src}
          alt=""
        />
      )}
      {caption && !video && (
        <p
          className="leading-[1.35] whitespace-nowrap"
          style={{ color: "#808080", fontSize: "0.71rem", letterSpacing: "-0.2px" }}
        >
          {caption}
        </p>
      )}
      {video && (
        <div className="absolute bottom-[4px] right-[4px] z-10 flex items-center gap-[12px]">
          {caption && (
            <span className="leading-[1.35] whitespace-nowrap" style={LABEL}>
              {caption}
            </span>
          )}
          <div className="opacity-80 transition-opacity hover:opacity-100">
            <Rim progress={progress}>
              <div className="flex items-center gap-[2px] rounded-full bg-[#1a1a1a] p-[2px]">
                <AnimateIcon animateOnHover asChild>
                  <button type="button" onClick={togglePlay} aria-label={playing ? "Pause" : "Play"} className={`${seg} h-8 w-9`}>
                    {playing ? <Pause size={16} color="#e6e6e6" /> : <Play size={16} color="#e6e6e6" />}
                  </button>
                </AnimateIcon>
                <AnimateIcon animateOnHover asChild>
                  <button
                    type="button"
                    onClick={toggleMute}
                    aria-label={muted ? "Unmute" : "Mute"}
                    className={`${seg} h-8 w-9`}
                    style={{ background: muted ? "#370000" : "transparent" }}
                  >
                    {muted ? <VolumeOff size={20} color="#e6e6e6" /> : <Volume2 size={20} color="#e6e6e6" />}
                  </button>
                </AnimateIcon>
              </div>
            </Rim>
          </div>
        </div>
      )}
    </div>
  );
}

export default function CaseStudyGenerativeSFX() {
  return (
    <div className="flex flex-col gap-[4px] items-center w-full">
      {/* Hero */}
      <VideoHero src="/projects/generative-sfx/01-Generative-sound-effects.mp4" />

      {/* Problem — margin label + right column */}
      <MarginRow label="Problem">
        <p className="leading-[1.35]">
          Adobe had been investing heavily in generative audio and had the models to show for it, but
          nowhere to put them. Without a product surface, there was no way to get the work in front of
          real users, learn from how they used it, or answer what competitors were already shipping.
        </p>
      </MarginRow>

      {/* Full-width editor overview */}
      <img className="w-full aspect-[1120/620] rounded-2xl object-cover border border-gray-900" src={`${BASE}/shot-1.webp`} alt="" />

      {/* Approach — margin label + right column */}
      <MarginRow label="Approach">
        <p className="leading-[1.35]">
          I was the only designer on this, and there was no dedicated PM, so I drove the product
          definition too, deciding what we&apos;d build and keeping the team aligned on it.
        </p>
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

      {/* Reception — margin label + right column */}
      <MarginRow label="Reception">
        <p className="leading-[1.35]">
          The tool went out to the people I built it for, and they made it their own. Content creators
          worked it into their videos and shared the results, reaching millions of views across TikTok
          and Instagram.
        </p>
      </MarginRow>

      {/* Row — three social posts with reach */}
      <div className="flex gap-[4px] w-full" style={{ height: 630 }}>
        <Showcase src={`${BASE}/post-1.mp4`} video maxH={520} caption="9.1M Views" className="flex-1 min-w-px" />
        <Showcase src={`${BASE}/post-2.mp4`} video maxH={520} caption="3.5M Views" className="flex-1 min-w-px" />
        <Showcase src={`${BASE}/post-3.mp4`} video maxH={520} caption="1.4M Views" className="flex-1 min-w-px" />
      </div>

      {/* Full-width — editor across surfaces */}
      <img className="w-full aspect-[1120/620] rounded-2xl object-cover border border-gray-900" src={`${BASE}/shot-4.webp`} alt="" />

      {/* Outcome + credits — one container */}
      <OutcomeCredits
        outcome={
          <>
            <p className="leading-[1.35]">
              Firefly&apos;s first generative audio tool, shipped on desktop and mobile web.
            </p>
            <p className="leading-[1.35]">
              Across 40,000 daily users, people averaged around five generations a session, a strong
              enough signal of the need that Premiere Pro adopted the same generative sound model.
            </p>
          </>
        }
        contributions="Product definition, Web & mobile web UX, Interaction design, Creative production"
        credits="Justin Salomon, Prannoy Mittal, Rahul Gupta, Eshani Pendsey, Sarah Shen, Oriol Nieto"
      />
    </div>
  );
}
