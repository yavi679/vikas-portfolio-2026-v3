"use client";

/* Based on Figma node 911:13080 — "ROPE" case study. Vikas's 5-to-9 design work
   for friends' businesses: Watto.ai, CoCreate Salon, Vessels by Vivian, IAG Media.
   Each section = client label (MarginRow) + eyebrow tags + body + optional link,
   then client videos/images. */

import AutoplayVideo from "@/components/AutoplayVideo";
import { ArrowUpRight } from "lucide-react";
import { MarginRow } from "./blocks";

const BASE = "/projects/rope/case-study";
const CARD = "rounded-2xl overflow-hidden border border-gray-900";
/* Section copy: the body paragraph and an optional website link. */
function Copy({ href, children }: { href?: string; children: React.ReactNode }) {
  return (
    <>
      <p className="leading-[1.35]">{children}</p>
      {href && (
        <a
          href={href}
          target="_blank"
          rel="noreferrer"
          className="mt-2 inline-flex w-fit items-center gap-1.5 rounded-full border border-[#333] px-4 py-2 text-[#b3b3b3] transition-colors hover:bg-[#1a1a1a] hover:text-[#e6e6e6]"
          style={{ fontSize: "0.85rem", letterSpacing: "1.5px", textTransform: "uppercase" }}
        >
          View website <ArrowUpRight className="size-4" />
        </a>
      )}
    </>
  );
}

/* A media card — an autoplay video (`.mp4`, with control) when `video`, else an
   image (`.webp`) when `src` is set, else a gray placeholder block. */
function Media({ src, aspect, className = "", video = false, videoClassName = "" }: { src?: string; aspect: string; className?: string; video?: boolean; videoClassName?: string }) {
  return (
    <div className={`${CARD} ${className}`} style={{ background: "#1a1a1a", aspectRatio: aspect }}>
      {video && src ? (
        <AutoplayVideo className={`w-full h-full object-cover ${videoClassName}`} src={`${BASE}/${src}.mp4`} />
      ) : src ? (
        <img className="w-full h-full object-cover" src={`${BASE}/${src}.webp`} alt="" />
      ) : null}
    </div>
  );
}

/* Full-width media (1120x620). */
function FullWidth({ src, video, videoClassName }: { src?: string; video?: boolean; videoClassName?: string }) {
  return <Media src={src} video={video} videoClassName={videoClassName} aspect="1120/620" className="w-full" />;
}

/* Two square media side by side. */
function Pair({ a, aVideo, b, bVideo }: { a?: string; aVideo?: boolean; b?: string; bVideo?: boolean }) {
  return (
    <div className="flex gap-[4px] w-full">
      <Media src={a} video={aVideo} aspect="1/1" className="flex-1 min-w-px" />
      <Media src={b} video={bVideo} aspect="1/1" className="flex-1 min-w-px" />
    </div>
  );
}

export default function CaseStudyRope() {
  return (
    <div className="flex flex-col gap-[4px] items-center w-full">
      {/* Hero — transparent ROPE logo on a dark block */}
      <div className={`${CARD} w-full flex items-center justify-center`} style={{ background: "#1a1a1a", aspectRatio: "1120/400" }}>
        <img src={`${BASE}/hero.webp`} alt="ROPE" className="object-contain" style={{ maxWidth: "50%", maxHeight: "50%" }} />
      </div>

      {/* Watto.ai */}
      <MarginRow label="Watto.ai">
        <Copy>
          {"Watto is a Y Combinator startup building an AI tool for specialized documents. I helped stand up their first release from zero to one: the AI chat interface, a copilot for in-context help, and the design kit that keeps it all consistent."}
        </Copy>
      </MarginRow>
      <FullWidth src="watto-header" video />
      <Pair a="watto-phone" b="watto-icons" />
      <Pair a="watto-palette" aVideo b="watto-logo" bVideo />

      {/* CoCreate Salon */}
      <MarginRow label="CoCreate Studio">
        <Copy href="#">
          {"My friend Yoshi is a seriously talented hairstylist. I designed the website for his studio, CoCreate, splitting it in two so people can book a cut on one side and sign up for his lessons and workshops on the other."}
        </Copy>
      </MarginRow>
      <FullWidth />

      {/* Vessels by Vivian */}
      <MarginRow label="Vessels by Vivian">
        <Copy href="#">
          {"Vivian makes beautiful ceramics. I designed her store around the Summer '23 collection, keeping it simple and easy to reskin each season, so she can launch a new drop without a redesign and keep orders flowing in."}
        </Copy>
      </MarginRow>
      <FullWidth src="vessels-header" video />

      {/* IAG Media */}
      <MarginRow label="IAG Media">
        <Copy>
          {"IAG Media runs social media marketing for e-commerce brands. I pitched a refresh of their brand identity and brought the website and social presence up to date."}
        </Copy>
      </MarginRow>
      <FullWidth src="iag-header" video videoClassName="scale-110" />
      <Pair a="iag-1" b="iag-2" />
      <FullWidth src="iag-ad" />
      <Pair a="iag-3" b="iag-logo" />
    </div>
  );
}
