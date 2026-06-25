"use client";

/* Pixel-match of Figma node 676:1322 — "Smart Templates" case study. */

const BASE = "/projects/smart-templates/case-study";

const LABEL = { color: "#808080", fontSize: "1rem", letterSpacing: "-0.48px" } as const;
const BODY = { color: "#e6e6e6", fontSize: "1rem", letterSpacing: "-0.16px" } as const;

function TextBlock({
  label,
  children,
  align = "bottom",
  className = "",
  style,
}: {
  label?: string;
  children: React.ReactNode;
  align?: "top" | "bottom";
  className?: string;
  style?: React.CSSProperties;
}) {
  return (
    <div
      className={`flex flex-col gap-2 rounded-2xl ${align === "bottom" ? "justify-end" : "justify-start"} ${className}`}
      style={{ background: "#1a1a1a", padding: 16, ...style }}
    >
      {label && (
        <p className="leading-[1.35] whitespace-nowrap" style={LABEL}>
          {label}
        </p>
      )}
      <div className="flex flex-col gap-2 leading-[1.35]" style={BODY}>
        {children}
      </div>
    </div>
  );
}

/* 744-wide device showcase block on a black canvas. Renders video for .mp4 sources. */
function Device({ src }: { src: string }) {
  return (
    <div
      className="h-full rounded-2xl overflow-hidden flex items-center justify-center"
      style={{ flex: "744 1 0", background: "#000" }}
    >
      {src.endsWith(".mp4") ? (
        <video className="w-full h-full object-cover" src={src} autoPlay muted loop playsInline />
      ) : (
        <img className="w-full h-full object-cover" src={src} alt="" />
      )}
    </div>
  );
}

export default function CaseStudySmartTemplates() {
  return (
    <div className="flex flex-col gap-2 items-center w-full">
      {/* Hero */}
      <div className="w-full aspect-video rounded-2xl overflow-hidden" style={{ background: "#1a1a1a" }}>
        <video
          className="w-full h-full object-cover"
          src="/projects/smart-templates/01-Excel-x-Wolfram-templates.mp4"
          autoPlay
          muted
          loop
          playsInline
        />
      </div>

      {/* Problem — text left (2 col) */}
      <div className="flex gap-2 w-full items-start">
        <TextBlock label="Problem" align="top" style={{ flex: "744 1 0" }}>
          <p className="leading-[1.35]">
            Excel just got a superpower. Through Wolfram Alpha, it could pull live, real-world data
            straight into a spreadsheet. But the templates around it were still static, rigid blank
            pages. They never showed what that data could actually do, and the empty grid kept
            scaring people off.
          </p>
        </TextBlock>
        <div style={{ flex: "368 1 0" }} />
      </div>

      {/* Full-width banner */}
      <img className="w-full aspect-[1270/317] rounded-2xl object-cover" src={`${BASE}/banner-1.webp`} alt="" />

      {/* Approach — text right (2 col) */}
      <div className="flex gap-2 w-full items-start">
        <div style={{ flex: "368 1 0" }} />
        <TextBlock label="Approach" align="top" style={{ flex: "744 1 0" }}>
          <p className="leading-[1.35]">
            So I reframed templates as lightweight apps instead of empty grids. Each one ties data,
            structure, and interaction together: live dashboards powered by real datasets, smart
            defaults that set themselves up, and app-like interactions right in the spreadsheet. I
            designed them as a connected ecosystem and built a reusable toolkit so content teams
            could ship new ones fast.
          </p>
        </TextBlock>
      </div>

      {/* Full-width panel */}
      <img className="w-full aspect-[1120/575] rounded-2xl object-cover" src={`${BASE}/panel-1.webp`} alt="" />

      {/* Commentary — text left (1 col) */}
      <div className="flex gap-2 w-full items-start">
        <TextBlock align="top" style={{ flex: "368 1 0" }}>
          <p className="leading-[1.35]">
            People like to track health and fitness on the go, so templates had to feel just as good
            on mobile as on desktop. We&apos;d always focused on web and desktop, but going
            cross-platform was a clear way to reach a wider audience and lift NPS.
          </p>
        </TextBlock>
        <div style={{ flex: "752 1 0" }} />
      </div>

      {/* Full-width banner */}
      <img className="w-full aspect-[2000/877] rounded-2xl object-cover" src={`${BASE}/banner-2.webp`} alt="" />

      {/* Row — device left + text right (modular) */}
      <div className="flex gap-2 w-full items-start" style={{ height: 630 }}>
        <Device src={`${BASE}/device-1.webp`} />
        <TextBlock align="top" className="self-start" style={{ flex: "368 1 0" }}>
          <p className="leading-[1.35]">
            A modular component system unlocks truly customizable templates. People can mix and
            match components, or even combine whole templates into a master template that acts as a
            frontend for everything connected underneath.
          </p>
        </TextBlock>
      </div>

      {/* Row — text left + device right (calculators) */}
      <div className="flex gap-2 w-full items-end" style={{ height: 630 }}>
        <TextBlock align="bottom" className="self-end" style={{ flex: "368 1 0" }}>
          <p className="leading-[1.35]">
            Some templates use Excel formulas as built-in calculators, helping people personalize
            and set their goals.
          </p>
        </TextBlock>
        <Device src={`${BASE}/device-2.mp4`} />
      </div>

      {/* Row — device left + text right (calendars) */}
      <div className="flex gap-2 w-full items-start" style={{ height: 630 }}>
        <Device src={`${BASE}/device-3.mp4`} />
        <TextBlock align="top" className="self-start" style={{ flex: "368 1 0" }}>
          <p className="leading-[1.35]">
            Calendar pickers and auto-suggestions show the template actually understands what
            you&apos;re trying to do.
          </p>
        </TextBlock>
      </div>

      {/* Row — text left + device right (store) */}
      <div className="flex gap-2 w-full items-start" style={{ height: 630 }}>
        <TextBlock align="top" className="self-start" style={{ flex: "368 1 0" }}>
          <p className="leading-[1.35]">
            Picture a store sharing its weekly price list through a food data type. Templates showed
            us data types could be an open platform that any data provider can plug into.
          </p>
        </TextBlock>
        <Device src={`${BASE}/device-4.mp4`} />
      </div>

      {/* Full-width image */}
      <img className="w-full aspect-video rounded-2xl object-cover" src={`${BASE}/wide-3.webp`} alt="" />

      {/* Outcome (2 col) + Credits / My contributions stack (1 col) — 300px tall */}
      <div className="flex gap-2 w-full" style={{ height: 300 }}>
        <TextBlock label="Outcome" align="top" style={{ flex: "744 1 0" }}>
          <p className="leading-[1.35]">
            Shipped 10+ smart templates to Microsoft 365, across health, education, planning, and
            lifestyle. They turned the blank page into a running start for people, and gave partner
            teams a system they could keep building on.
          </p>
        </TextBlock>
        <div className="flex flex-col gap-2 h-full" style={{ flex: "368 1 0" }}>
          <TextBlock label="Credits" align="top" className="flex-1">
            <p className="leading-[1.35]">Christian Canton, Sam Radkovitz, Alex Malkievicz</p>
          </TextBlock>
          <TextBlock label="My contributions" align="top">
            <p className="leading-[1.35]">Web &amp; mobile UX, Interaction design, Visual design</p>
          </TextBlock>
        </div>
      </div>
    </div>
  );
}
