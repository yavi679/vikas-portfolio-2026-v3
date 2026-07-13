"use client";

import { useRef, useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { getNavProjects, getProjectGroup } from "@/lib/projects";
import { useMeshParams, MeshGradientControlPanel } from "@/components/MeshGradientControls";
import { useGradientParams, GradientControlPanel } from "@/components/GradientControls";

/* Paper Shaders animated mesh gradient behind the wordmark. Canvas/WebGL,
   so load client-only (the #1a1a1a panel shows until it mounts). */
const MeshGradient = dynamic(
  () => import("@paper-design/shaders-react").then((m) => m.MeshGradient),
  { ssr: false }
);

const allProjects = getNavProjects();

interface ProjectNavProps {
  selectedId: string;
  onSelect: (id: string) => void;
}

/* EXPERIMENT (branch experiment/nav-stack): PORTO ROCHA-style stacking deck.
   The nav is its own scroller; as each card scrolls up past the wordmark it
   recedes in 3D (perspective + translateZ) and tucks BEHIND the next card
   (later cards paint in front via ascending z-index). Scrubbed per scroll frame. */

const PERSP = 1000; // per-card perspective (px); origin set per side so each end recedes toward its own edge
const RANGE = 200; // px of scroll over which a passed card fully recedes
const DEPTH = 600; // px pushed back in 3D at full recede (~0.55 apparent scale)
const PEEK = 6; // px each stacked card lifts above the one in front (fan)

export default function ProjectNav({ selectedId, onSelect }: ProjectNavProps) {
  const { params, open, setOpen } = useMeshParams();
  const { editing, close: closeGradient } = useGradientParams();
  const [everOpened, setEverOpened] = useState(false); // gate the cards' re-entry animation to closes only

  // Cards animate back in from the bottom after either panel has been opened.
  useEffect(() => {
    if (open || editing) setEverOpened(true);
  }, [open, editing]);
  const scrollerRef = useRef<HTMLElement>(null);
  const wordmarkRef = useRef<HTMLDivElement>(null);
  const cardRefs = useRef<(HTMLButtonElement | null)[]>([]);

  useEffect(() => {
    const scroller = scrollerRef.current;
    if (!scroller) return;
    let raf = 0;

    const update = () => {
      raf = 0;
      const sTop = scroller.scrollTop;
      const topFocal = wordmarkRef.current?.offsetHeight ?? 0; // top stack pins just under the wordmark
      let depthTop = 0;
      let depthBot = 0;
      for (const el of cardRefs.current) {
        if (!el) continue;
        const vp = el.offsetTop - sTop; // card top relative to nav top
        // per-card: a card is flush at the bottom edge when its own bottom hits it
        const bottomFocal = scroller.clientHeight - el.offsetHeight;
        if (vp < topFocal) {
          // above the top line → recede up into the stack
          const past = topFocal - vp;
          const t = Math.min(past / RANGE, 1);
          const fade = t < 0.85 ? 1 : 1 - (t - 0.85) / 0.15;
          el.style.transformOrigin = "50% 0%"; // recede toward its top edge → up, behind the wordmark
          el.style.transform = `perspective(${PERSP}px) translateY(${past - depthTop * PEEK}px) translateZ(${-t * DEPTH}px)`;
          el.style.opacity = String(Math.max(fade, 0));
          el.style.zIndex = String(Math.round((1 - t) * 999)); // more receded → further back
          depthTop++;
        } else if (vp > bottomFocal) {
          // below the bottom line → recede down into the stack (mirror of the top)
          const past = vp - bottomFocal;
          const t = Math.min(past / RANGE, 1);
          const fade = t < 0.85 ? 1 : 1 - (t - 0.85) / 0.15;
          el.style.transformOrigin = "50% 100%"; // recede toward its bottom edge → down (mirror of top)
          el.style.transform = `perspective(${PERSP}px) translateY(${-past + depthBot * PEEK}px) translateZ(${-t * DEPTH}px)`;
          el.style.opacity = String(Math.max(fade, 0));
          el.style.zIndex = String(Math.round((1 - t) * 999));
          depthBot++;
        } else {
          // in the flat middle band → resting, frontmost
          el.style.transform = "";
          el.style.opacity = "1";
          el.style.zIndex = "1000";
        }
      }
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };

    scroller.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    update();
    return () => {
      scroller.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <nav
      ref={scrollerRef}
      className="relative flex flex-col gap-[4px] shrink-0 h-full overflow-y-auto overscroll-none"
      style={{ width: 368 }}
    >
      {/* Wordmark header — equal padding on all sides (fits the logo), pinned to top.
          The wordmark SVG masks the animated mesh gradient, so the gradient shows
          through the letterforms and the panel shows everywhere else. */}
      <div
        ref={wordmarkRef}
        onClick={() => onSelect("cover")}
        role="button"
        aria-label="Home"
        className="group sticky top-0 z-[1100] w-full flex items-center justify-center shrink-0 relative overflow-hidden cursor-pointer"
        style={{ background: "#1a1a1a", borderRadius: 16, padding: "20%" }}
      >
        {/* Remix — reveals on wordmark hover; toggles the shader parameter pane */}
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            if (!open) closeGradient();
            setOpen((o) => !o);
          }}
          className={`absolute left-[4px] top-[4px] z-20 flex h-9 items-center rounded-full bg-[#333] px-4 text-[#b3b3b3] transition-all hover:bg-[#4d4d4d] hover:text-[#e6e6e6] ${
            open ? "opacity-100" : "opacity-0 group-hover:opacity-100"
          }`}
          style={{ fontSize: "1rem", letterSpacing: "-0.16px", lineHeight: 1.35 }}
        >
          {open ? "Close" : "Remix"}
        </button>
        <div
          className="relative w-full"
          style={{
            aspectRatio: "284.357 / 109.823",
            WebkitMaskImage: "url(/projects/wordmark.svg)",
            maskImage: "url(/projects/wordmark.svg)",
            WebkitMaskRepeat: "no-repeat",
            maskRepeat: "no-repeat",
            WebkitMaskSize: "contain",
            maskSize: "contain",
            WebkitMaskPosition: "center",
            maskPosition: "center",
          }}
        >
          <MeshGradient className="absolute inset-0" width="100%" height="100%" {...params} />
        </div>
      </div>
      {/* A panel (Remix shader, or the About header gradient) takes over the card
          space; otherwise the cards. */}
      {open && <MeshGradientControlPanel />}
      {!open && editing && <GradientControlPanel />}
      {!open && !editing && (
        <div
          className={`flex w-full flex-col gap-[4px] ${
            everOpened ? "duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] animate-in fade-in slide-in-from-bottom-[40px]" : ""
          }`}
        >
          {allProjects.map((p, i) => {
            const group = getProjectGroup(p.id);
            const active = p.id === selectedId;
            return (
              <button
            key={p.id}
            ref={(el) => {
              cardRefs.current[i] = el;
            }}
            onClick={() => onSelect(p.id)}
            className={`flex items-center text-left rounded-2xl transition-colors duration-150 cursor-pointer outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-white/60 shrink-0 ${
              active ? "bg-[#262626]" : "bg-[#1a1a1a] hover:bg-[#262626]"
            }`}
            style={{ padding: 16, willChange: "transform, opacity" }}
          >
            <div className="flex flex-1 flex-col gap-2 min-w-px">
              <div className="flex gap-2 items-start w-full">
                <p
                  className="flex-1 min-w-px font-medium leading-[1.35]"
                  style={{ color: "#e6e6e6", fontSize: "1rem", letterSpacing: "-0.48px" }}
                >
                  {p.title}
                </p>
                <div className="flex gap-[8px] items-center justify-end shrink-0">
                  <span
                    className="leading-[1.35] whitespace-nowrap"
                    style={{ color: "#808080", fontSize: "1rem", letterSpacing: "-0.48px" }}
                  >
                    {p.year}
                  </span>
                  {group ? (
                    <img
                      src={group.logoUrl}
                      alt={group.company}
                      className="object-contain shrink-0"
                      style={{ width: 16, height: 16 }}
                    />
                  ) : p.avatarUrl ? (
                    <img
                      src={p.avatarUrl}
                      alt={p.title}
                      className="object-cover shrink-0"
                      style={{ width: 16, height: 16, borderRadius: 4, background: "#9BC8F1" }}
                    />
                  ) : null}
                </div>
              </div>
              <p
                className="leading-[1.35] w-full"
                style={{ color: "#808080", fontSize: "1rem", letterSpacing: "-0.48px" }}
              >
                {p.hook}
              </p>
            </div>
              </button>
            );
          })}
        </div>
      )}
    </nav>
  );
}
