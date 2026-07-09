"use client";

import { useState, useRef, useEffect } from "react";
import { getNavProjects } from "@/lib/projects";
import ProjectNav from "@/components/ProjectNav";
import { MeshParamsProvider } from "@/components/MeshGradientControls";
import CaseStudyAboutMe from "@/components/case-studies/CaseStudyAboutMe";
import CaseStudy3DIllustrations from "@/components/case-studies/CaseStudy3DIllustrations";
import CaseStudyExpressiveTheming from "@/components/case-studies/CaseStudyExpressiveTheming";
import CaseStudySmartTemplates from "@/components/case-studies/CaseStudySmartTemplates";
import CaseStudyUXRedesigns from "@/components/case-studies/CaseStudyUXRedesigns";
import CaseStudyGenerativeSFX from "@/components/case-studies/CaseStudyGenerativeSFX";
import CaseStudyGenerativeSpeech from "@/components/case-studies/CaseStudyGenerativeSpeech";

const caseStudies: Record<string, React.ComponentType> = {
  "about-me": CaseStudyAboutMe,
  "generative-sfx": CaseStudyGenerativeSFX,
  "generative-speech": CaseStudyGenerativeSpeech,
  "3d-illustrations": CaseStudy3DIllustrations,
  "expressive-theming": CaseStudyExpressiveTheming,
  "smart-templates": CaseStudySmartTemplates,
  "ux-redesigns": CaseStudyUXRedesigns,
};

const allProjects = getNavProjects();

export default function PortfolioViewer() {
  // Start on About Vikas — the intro/landing view.
  const [selectedId, setSelectedId] = useState("about-me");
  const current = allProjects.find((p) => p.id === selectedId);
  const CaseStudy = caseStudies[selectedId];
  const scrollRef = useRef<HTMLDivElement>(null);
  const targetY = useRef(0);
  const rafId = useRef<number | null>(null);

  // Always start a project at the top, even when returning to one viewed before.
  useEffect(() => {
    scrollRef.current?.scrollTo({ top: 0 });
    targetY.current = 0;
    if (rafId.current != null) {
      cancelAnimationFrame(rafId.current);
      rafId.current = null;
    }
  }, [selectedId]);

  // Up/Down arrows scroll the detail column. Driven by key down/up state (not OS
  // key-repeat, which is uneven): constant velocity while held, eased glide to a
  // stop on release — smooth for both taps and holds.
  useEffect(() => {
    let heldDir = 0; // -1 up, +1 down, 0 none
    const VELOCITY = 12; // px/frame while held
    const EASE = 0.15; // lerp toward target
    const TAP = 48; // one-tap impulse

    const maxY = () => {
      const el = scrollRef.current;
      return el ? el.scrollHeight - el.clientHeight : 0;
    };
    const tick = () => {
      const el = scrollRef.current;
      if (!el) {
        rafId.current = null;
        return;
      }
      if (heldDir !== 0) {
        targetY.current = Math.max(0, Math.min(maxY(), targetY.current + heldDir * VELOCITY));
      }
      const diff = targetY.current - el.scrollTop;
      if (heldDir === 0 && Math.abs(diff) < 0.5) {
        el.scrollTop = targetY.current;
        rafId.current = null;
        return;
      }
      el.scrollTop += diff * EASE;
      rafId.current = requestAnimationFrame(tick);
    };
    const isTyping = () => {
      const tag = (document.activeElement as HTMLElement | null)?.tagName;
      return tag === "INPUT" || tag === "TEXTAREA";
    };
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key !== "ArrowDown" && e.key !== "ArrowUp") return;
      if (e.metaKey || e.ctrlKey || e.altKey || isTyping()) return;
      const el = scrollRef.current;
      if (!el) return;
      e.preventDefault();
      if (e.repeat) return; // we drive continuous scroll ourselves
      const dir = e.key === "ArrowDown" ? 1 : -1;
      if (rafId.current == null) targetY.current = el.scrollTop; // resync after wheel/trackpad
      heldDir = dir;
      targetY.current = Math.max(0, Math.min(maxY(), targetY.current + dir * TAP));
      if (rafId.current == null) rafId.current = requestAnimationFrame(tick);
    };
    const onKeyUp = (e: KeyboardEvent) => {
      if (e.key === "ArrowDown" || e.key === "ArrowUp") heldDir = 0;
    };
    const stopHold = () => {
      heldDir = 0;
    };
    window.addEventListener("keydown", onKeyDown);
    window.addEventListener("keyup", onKeyUp);
    window.addEventListener("blur", stopHold);
    return () => {
      window.removeEventListener("keydown", onKeyDown);
      window.removeEventListener("keyup", onKeyUp);
      window.removeEventListener("blur", stopHold);
      if (rafId.current != null) cancelAnimationFrame(rafId.current);
    };
  }, []);

  return (
    <MeshParamsProvider>
    <div className="h-screen w-screen overflow-hidden flex gap-[4px] p-2" style={{ background: "#0a0a0a" }}>
      {/* Column 1 — project nav (owns its own scroll for the stacking effect) */}
      <div className="h-full shrink-0">
        <ProjectNav selectedId={selectedId} onSelect={setSelectedId} />
      </div>

      {/* Columns 2–4 — scrolling case study */}
      <div ref={scrollRef} className="flex-1 h-full overflow-y-auto overscroll-none">
        {/* key re-mounts on switch → scroll resets and the enter animation replays.
            tw-animate-css utilities (shadcn convention); disabled for reduced motion. */}
        <div
          key={selectedId}
          className="animate-in fade-in-0 slide-in-from-bottom-[40px] duration-500 ease-out motion-reduce:animate-none"
        >
          {CaseStudy ? (
            <CaseStudy />
          ) : (
            <div
              className="w-full flex items-center justify-center rounded-2xl"
              style={{ background: "#1a1a1a", minHeight: "100%" }}
            >
              <p className="leading-[1.35]" style={{ color: "#808080", fontSize: "1rem", letterSpacing: "-0.48px" }}>
                {current?.title} — case study coming soon.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
    </MeshParamsProvider>
  );
}
