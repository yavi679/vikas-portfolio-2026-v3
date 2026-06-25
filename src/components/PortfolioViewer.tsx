"use client";

import { useState } from "react";
import { getAllProjects } from "@/lib/projects";
import ProjectNav from "@/components/ProjectNav";
import CaseStudy3DIllustrations from "@/components/case-studies/CaseStudy3DIllustrations";
import CaseStudyExpressiveTheming from "@/components/case-studies/CaseStudyExpressiveTheming";
import CaseStudySmartTemplates from "@/components/case-studies/CaseStudySmartTemplates";

const caseStudies: Record<string, React.ComponentType> = {
  "3d-illustrations": CaseStudy3DIllustrations,
  "expressive-theming": CaseStudyExpressiveTheming,
  "smart-templates": CaseStudySmartTemplates,
};

const allProjects = getAllProjects();

export default function PortfolioViewer() {
  // Default to 3D Illustrations — the one project with a built-out case study.
  const [selectedId, setSelectedId] = useState("3d-illustrations");
  const current = allProjects.find((p) => p.id === selectedId);
  const CaseStudy = caseStudies[selectedId];

  return (
    <div className="h-screen w-screen overflow-hidden flex gap-2 p-2" style={{ background: "#0a0a0a" }}>
      {/* Column 1 — project nav */}
      <div className="h-full overflow-y-auto shrink-0">
        <ProjectNav selectedId={selectedId} onSelect={setSelectedId} />
      </div>

      {/* Columns 2–4 — scrolling case study */}
      <div className="flex-1 h-full overflow-y-auto">
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
  );
}
