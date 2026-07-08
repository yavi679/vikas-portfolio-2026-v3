import type { ReactNode } from "react";

/* Shared text blocks for the case studies — editorial "margin label + right
   reading column" layout on transparent backgrounds. */

export const LABEL = { color: "#808080", fontSize: "1rem", letterSpacing: "-0.48px" } as const;
export const BODY = { color: "#e6e6e6", fontSize: "1rem", letterSpacing: "-0.16px" } as const;

/* A row of text: section label in the left margin, body in the right reading
   column. Feature notes pass no label (the left margin stays empty). */
export function MarginRow({ label, children }: { label?: string; children: ReactNode }) {
  return (
    <div className="flex w-full gap-[4px]" style={{ paddingTop: 40, paddingBottom: 40 }}>
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

/* One label + value pair with a fixed-width label sub-column. */
export function CreditItem({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="flex flex-1 min-w-px">
      <p className="leading-[1.35] shrink-0" style={{ ...LABEL, width: 180 }}>
        {label}
      </p>
      <p className="leading-[1.35] flex-1 min-w-px" style={BODY}>
        {children}
      </p>
    </div>
  );
}

/* Footer row: My contributions (left column) + Credits (right column). */
export function CreditsRow({ contributions, credits }: { contributions: ReactNode; credits: ReactNode }) {
  return (
    <div className="flex w-full gap-[4px]" style={{ paddingLeft: 16, paddingRight: 16, paddingTop: 40, paddingBottom: 40 }}>
      <CreditItem label="My contributions">{contributions}</CreditItem>
      <CreditItem label="Credits">{credits}</CreditItem>
    </div>
  );
}
