"use client";

import { getNavProjects, getProjectGroup } from "@/lib/projects";

const allProjects = getNavProjects();

interface ProjectNavProps {
  selectedId: string;
  onSelect: (id: string) => void;
}

export default function ProjectNav({ selectedId, onSelect }: ProjectNavProps) {
  return (
    <nav className="flex flex-col gap-[4px] shrink-0" style={{ width: 368 }}>
      {/* Wordmark header — equal padding on all sides (fits the logo), pinned to top */}
      <div
        className="sticky top-0 z-10 w-full flex items-center justify-center shrink-0"
        style={{ background: "#0a0a0a", padding: "20%" }}
      >
        <img src="/projects/wordmark.svg" alt="Vikas Yadav" className="w-full h-auto" />
      </div>
      {allProjects.map((p) => {
        const group = getProjectGroup(p.id);
        const active = p.id === selectedId;
        return (
          <button
            key={p.id}
            onClick={() => onSelect(p.id)}
            className={`flex items-center text-left rounded-2xl transition-colors duration-150 cursor-pointer outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-white/60 ${
              active ? "bg-[#262626]" : "bg-[#1a1a1a] hover:bg-[#262626]"
            }`}
            style={{ padding: 16 }}
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
    </nav>
  );
}
