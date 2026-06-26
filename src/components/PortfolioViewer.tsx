"use client";

import { useState, useRef, useEffect } from "react";
import { getAllProjects } from "@/lib/projects";
import ProjectNav from "@/components/ProjectNav";
import CaseStudy3DIllustrations from "@/components/case-studies/CaseStudy3DIllustrations";
import CaseStudyExpressiveTheming from "@/components/case-studies/CaseStudyExpressiveTheming";
import CaseStudySmartTemplates from "@/components/case-studies/CaseStudySmartTemplates";
import CaseStudyUXRedesigns from "@/components/case-studies/CaseStudyUXRedesigns";
import CaseStudyGenerativeSFX from "@/components/case-studies/CaseStudyGenerativeSFX";

const caseStudies: Record<string, React.ComponentType> = {
  "generative-sfx": CaseStudyGenerativeSFX,
  "3d-illustrations": CaseStudy3DIllustrations,
  "expressive-theming": CaseStudyExpressiveTheming,
  "smart-templates": CaseStudySmartTemplates,
  "ux-redesigns": CaseStudyUXRedesigns,
};

const allProjects = getAllProjects();

export default function PortfolioViewer() {
  // Default to 3D Illustrations — the one project with a built-out case study.
  const [selectedId, setSelectedId] = useState("3d-illustrations");
  const current = allProjects.find((p) => p.id === selectedId);
  const CaseStudy = caseStudies[selectedId];
  const scrollRef = useRef<HTMLDivElement>(null);

  // Always start a project at the top, even when returning to one viewed before.
  useEffect(() => {
    scrollRef.current?.scrollTo({ top: 0 });
  }, [selectedId]);

  return (
    <div className="h-screen w-screen overflow-hidden flex gap-2 p-2" style={{ background: "#0a0a0a" }}>
      {/* Column 1 — project nav */}
      <div className="h-full overflow-y-auto shrink-0">
        <ProjectNav selectedId={selectedId} onSelect={setSelectedId} />
      </div>

      {/* Columns 2–4 — scrolling case study */}
      <div ref={scrollRef} className="flex-1 h-full overflow-y-auto">
        {/* key re-mounts on switch → scroll resets cleanly and the enter anim replays */}
        <div key={selectedId} className="case-enter">
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
  );
}
