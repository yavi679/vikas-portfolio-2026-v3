"use client";

import { getAllProjects, getProjectGroup } from "@/lib/projects";

const allProjects = getAllProjects();

interface ProjectNavProps {
  selectedId: string;
  onSelect: (id: string) => void;
}

export default function ProjectNav({ selectedId, onSelect }: ProjectNavProps) {
  return (
    <nav className="flex flex-col gap-2 shrink-0" style={{ width: 368 }}>
      {allProjects.map((p) => {
        const group = getProjectGroup(p.id);
        const active = p.id === selectedId;
        return (
          <button
            key={p.id}
            onClick={() => onSelect(p.id)}
            className="flex items-center text-left rounded-2xl transition-colors duration-150 cursor-pointer"
            style={{
              padding: 16,
              background: active ? "#262626" : "#1a1a1a",
            }}
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
                  {group && (
                    <img
                      src={group.logoUrl}
                      alt={group.company}
                      className="object-contain shrink-0"
                      style={{ width: 16, height: 16 }}
                    />
                  )}
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
