import type { ReactNode } from "react";

/* Shared text blocks for the case studies — editorial "margin label + right
   reading column" layout on transparent backgrounds. */

export const LABEL = { color: "#808080", fontSize: "1rem", letterSpacing: "-0.48px" } as const;
export const BODY = { color: "#e6e6e6", fontSize: "1rem", letterSpacing: "-0.16px" } as const;

/* A row of text: section label in the left margin, body in the right reading
   column. Feature notes pass no label (the left margin stays empty). */
export function MarginRow({ label, children }: { label?: string; children: ReactNode }) {
  return (
    <div className="flex w-full gap-[4px]" style={{ paddingTop: 64, paddingBottom: 64 }}>
      <div className="min-w-px" style={{ width: "calc(50% - 2px)", paddingLeft: 16 }}>
        {label && (
          <p className="leading-[1.35] whitespace-nowrap" style={LABEL}>
            {label}
          </p>
        )}
      </div>
      <div
        className="min-w-px flex flex-col gap-2 leading-[1.35]"
        style={{ width: "calc(50% - 2px)", paddingRight: 16, ...BODY }}
      >
        {children}
      </div>
    </div>
  );
}

/* A feature note: muted gray name + bullet, then the description in body color. */
export function Feat({ name, children }: { name: string; children: ReactNode }) {
  return (
    <p className="leading-[1.35]">
      <span style={{ color: "#808080" }}>{name} • </span>
      {children}
    </p>
  );
}

/* Combined footer: Outcome (label + body) and the credits row in one container,
   so the gap between them is a single 64px instead of two stacked 64px paddings. */
export function OutcomeCredits({
  outcome,
  contributions,
  credits,
}: {
  outcome: ReactNode;
  contributions: ReactNode;
  credits: ReactNode;
}) {
  return (
    <div className="flex w-full flex-col gap-[64px]" style={{ paddingTop: 64, paddingBottom: 64 }}>
      {/* Outcome — label left, body right */}
      <div className="flex w-full gap-[4px]">
        <div className="min-w-px" style={{ width: "calc(50% - 2px)", paddingLeft: 16 }}>
          <p className="leading-[1.35] whitespace-nowrap" style={LABEL}>
            Outcome
          </p>
        </div>
        <div className="min-w-px flex flex-col gap-2 leading-[1.35]" style={{ width: "calc(50% - 2px)", paddingRight: 16, ...BODY }}>
          {outcome}
        </div>
      </div>
      {/* My contributions + Credits — right half, two columns */}
      <div className="flex w-full gap-[4px]">
        <div className="min-w-px" style={{ width: "calc(50% - 2px)" }} />
        <div className="flex min-w-px gap-[4px]" style={{ width: "calc(50% - 2px)", paddingRight: 16 }}>
          <p className="flex-1 min-w-px leading-[1.35]" style={BODY}>
            <span style={{ color: "#808080" }}>My contributions • </span>
            {contributions}
          </p>
          <p className="flex-1 min-w-px leading-[1.35]" style={BODY}>
            <span style={{ color: "#808080" }}>Credits • </span>
            {credits}
          </p>
        </div>
      </div>
    </div>
  );
}
