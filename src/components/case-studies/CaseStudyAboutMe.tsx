"use client";

/* Based on Figma node 841:11279 — "About Vikas".
   Two big statements framing a grid: the design POV over an experience grid,
   the inspiration over a masonry of personal work. Copy in portfolio voice. */

import { useState, useEffect } from "react";
import LiquidSlideshow from "./LiquidSlideshow";

/* Light display statement (42px in Figma → 2.625rem at this project's 14px root). */
const STMT = { color: "#e6e6e6", fontSize: "2.625rem", fontWeight: 300, letterSpacing: "-0.84px", lineHeight: 1.1 } as const;
const META = { color: "#e6e6e6", fontSize: "1rem", letterSpacing: "-0.48px" } as const;
const BODY = { color: "#808080", fontSize: "1rem", letterSpacing: "-0.48px" } as const;

/* A display statement on its own filled panel, centered reading column. */
function Statement({ children }: { children: React.ReactNode }) {
  return (
    <div
      className="flex w-full justify-center rounded-2xl"
      style={{ background: "#1a1a1a", padding: 200 }}
    >
      <p className="w-full" style={{ ...STMT, maxWidth: 700 }}>
        {children}
      </p>
    </div>
  );
}

/* One role in the experience grid: logo + years on the left, title on the
   right, then a paragraph. Transparent card, matches the site's text blocks. */
function ExpCard({
  logo,
  company,
  years,
  role,
  children,
}: {
  logo: string;
  company: string;
  years: string;
  role: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex items-start h-full w-full rounded-2xl" style={{ padding: 24 }}>
      <div className="flex flex-1 min-w-px flex-col items-start" style={{ gap: 24 }}>
        <div className="flex items-start justify-between w-full">
          <div className="flex gap-2 items-center shrink-0">
            <span className="flex items-center justify-center shrink-0" style={{ width: 24, height: 22 }}>
              <img src={logo} alt={company} className="object-contain" style={{ maxWidth: 20, maxHeight: 18 }} />
            </span>
            <p className="leading-[1.35] whitespace-nowrap" style={META}>
              {years}
            </p>
          </div>
          <p className="leading-[1.35] whitespace-nowrap" style={META}>
            {role}
          </p>
        </div>
        <p className="leading-[1.35] w-full" style={BODY}>
          {children}
        </p>
      </div>
    </div>
  );
}

/* --- Masonry of personal work -------------------------------------------- */

const MEDIA = "/projects/about-me";

type Asset = { src: string; kind: "img" | "video" };
const img = (n: string): Asset => ({ src: `${MEDIA}/${n}.webp`, kind: "img" });
const vid = (n: string): Asset => ({ src: `${MEDIA}/${n}.mp4`, kind: "video" });

const SQ = ["sq2", "sq3", "sq4", "sq5"].map(img); // 1:1 photos
const PH = ["ph2", "ph3", "ph4"].map(img); // 4:5 photos
const PV = ["pv1", "pv2", "pv3", "pv5", "pv6", "pv7", "pv8"].map(vid); // 9:16 reels (pv4 was letterboxed 16:9, dropped)
const SV = ["sv1", "sv2", "sv3", "sv4", "sv5", "sv6"].map(vid); // 1:1 reels

type Shape = "portrait" | "square";
const POOL: Record<Shape, Asset[]> = {
  portrait: [...PV, ...PH], // 9:16 reels + 4:5 photos fill the tall tiles
  square: [...SQ, ...SV], // 1:1 photos + 1:1 reels fill the square tiles
};

/* The 11 tiles from Figma (846:11479) — 3 cols x 5 rows, portraits span 2 rows. */
const TILES: { shape: Shape; area: React.CSSProperties }[] = [
  { shape: "square", area: { gridColumn: "1", gridRow: "1" } },
  { shape: "square", area: { gridColumn: "2", gridRow: "1" } },
  { shape: "portrait", area: { gridColumn: "3", gridRow: "1 / span 2" } },
  { shape: "square", area: { gridColumn: "1", gridRow: "2" } },
  { shape: "portrait", area: { gridColumn: "2", gridRow: "2 / span 2" } },
  { shape: "portrait", area: { gridColumn: "1", gridRow: "3 / span 2" } },
  { shape: "square", area: { gridColumn: "3", gridRow: "3" } },
  { shape: "square", area: { gridColumn: "2", gridRow: "4" } },
  { shape: "portrait", area: { gridColumn: "3", gridRow: "4 / span 2" } },
  { shape: "square", area: { gridColumn: "1", gridRow: "5" } },
  { shape: "square", area: { gridColumn: "2", gridRow: "5" } },
];

/* One asset per tile, matched to shape, unique within a cycle. `rand` false →
   deterministic first-fit, so server and first client paint agree. */
function select(rand: boolean): Asset[] {
  const used = new Set<string>();
  return TILES.map(({ shape }) => {
    const free = POOL[shape].filter((a) => !used.has(a.src));
    const list = free.length ? free : POOL[shape];
    const a = rand ? list[Math.floor(Math.random() * list.length)] : list[0];
    used.add(a.src);
    return a;
  });
}

function Media({ asset }: { asset: Asset }) {
  const cls = "absolute inset-0 w-full h-full object-cover";
  return asset.kind === "video" ? (
    <video className={cls} src={asset.src} autoPlay muted loop playsInline />
  ) : (
    <img className={cls} src={asset.src} alt="" />
  );
}

/* Crossfades to a new asset: the incoming layer fades in over the current one,
   then becomes current. */
function Tile({ area, asset, delay }: { area: React.CSSProperties; asset: Asset; delay: number }) {
  const [shown, setShown] = useState(asset);
  const [incoming, setIncoming] = useState<Asset | null>(null);
  useEffect(() => {
    if (asset.src === shown.src) return;
    setIncoming(asset);
    const t = setTimeout(() => {
      setShown(asset);
      setIncoming(null);
    }, delay + 320);
    return () => clearTimeout(t);
  }, [asset, shown.src, delay]);
  return (
    <div className="relative overflow-hidden border border-gray-900" style={{ background: "#1a1a1a", borderRadius: 16, ...area }}>
      <Media asset={shown} />
      {incoming && (
        <div
          className="absolute inset-0 animate-in fade-in duration-300 ease-out"
          style={{ animationDelay: `${delay}ms` }}
        >
          <Media asset={incoming} />
        </div>
      )}
    </div>
  );
}

/* Reshuffles every 20s. */
function Masonry() {
  const [sel, setSel] = useState<Asset[]>(() => select(false));
  useEffect(() => {
    setSel(select(true)); // first randomization once mounted
    const id = setInterval(() => setSel(select(true)), 20000);
    return () => clearInterval(id);
  }, []);
  return (
    <div
      className="grid gap-[4px] w-full aspect-[280/439]"
      style={{ gridTemplateColumns: "repeat(3, 1fr)", gridTemplateRows: "repeat(5, 1fr)" }}
    >
      {TILES.map((t, i) => (
        <Tile key={i} area={t.area} asset={sel[i]} delay={i * 40} />
      ))}
    </div>
  );
}

/* Right-hand hero: cycles through the 10 interest images with a liquid transition. */
const HERO_IMAGES = Array.from({ length: 10 }, (_, i) => `${MEDIA}/interest-${i + 1}.webp`);

const LOGOS = "/projects/app-logos";

export default function CaseStudyAboutMe() {
  return (
    <div className="flex flex-col gap-[4px] items-center w-full">
      {/* Intro */}
      <Statement>
        <img
          src={`${MEDIA}/waving-hand.webp`}
          alt="waving hand"
          className="mr-2 inline-block"
          style={{ width: "1em", height: "1em", verticalAlign: "-0.12em" }}
        />
        I&apos;m Vikas. I believe good design listens to people and speaks back with clarity.
      </Statement>

      {/* Top — inspiration line (left) beside the interests hero/slideshow (right) */}
      <div className="flex w-full gap-[4px] aspect-[1120/630]">
        <div
          className="flex items-center min-w-px rounded-2xl"
          style={{ width: "calc(50% - 2px)", background: "#1a1a1a", paddingLeft: 90, paddingRight: 90 }}
        >
          <p style={STMT}>I look for things in the world that make my heart go 💗</p>
        </div>
        {/* Hero — liquid-distortion slideshow of personal interests */}
        <LiquidSlideshow images={HERO_IMAGES} dmap={`${MEDIA}/dmap-clouds.jpg`} interval={9600} />
      </div>

      {/* Experience — quote + 2x2 cards combined in one rounded panel */}
      <div className="flex w-full flex-col gap-[4px] rounded-[32px]" style={{ background: "#1a1a1a" }}>
        <div className="flex w-full items-center justify-center" style={{ padding: 200 }}>
          <p className="w-full" style={{ ...STMT, maxWidth: 700 }}>
            Something about 8yrs of experience, working with people, love making tools for people.
          </p>
        </div>
        <div
          className="grid grid-cols-2 items-stretch gap-[40px] w-full"
          style={{ paddingLeft: 40, paddingRight: 40, paddingBottom: 40 }}
        >
        <ExpCard logo={`${LOGOS}/adobe-firefly.webp`} company="Adobe Firefly" years="2023, 2026" role="Product designer, GenAI">
          I lead interaction design across Firefly&apos;s generative AI tools, shipping features like Generative
          Sound Effects and Generate Speech from idea to launch.
        </ExpCard>
        <ExpCard logo={`${LOGOS}/microsoft-outlook.webp`} company="Microsoft Outlook" years="2020, 2023" role="Product designer">
          I authored Outlook&apos;s AI email framework, later reused in Bookmarks, Viva, and Teams. As visual lead
          I shipped 17 themes into Fluent.
        </ExpCard>
        <ExpCard logo={`${LOGOS}/microsoft-excel.webp`} company="Microsoft Excel" years="2018, 2020" role="UX Designer">
          I redesigned filtering and keyboard shortcuts on Excel for the web, and shipped 10+ Smart Templates
          powered by Wolfram Data Types.
        </ExpCard>
        <ExpCard logo={`${LOGOS}/CMU.webp`} company="Carnegie Mellon University" years="2016, 2018" role="M Des, Interaction Design">
          M.Des in Interaction Design. I worked with Philips and Microsoft HoloLens, TA&apos;d the Interaction
          Design Studio for three semesters, and interned at Microsoft managing its 130+ Redmond buildings.
        </ExpCard>
        </div>
      </div>

      {/* What inspires me */}
      <Statement>
        I came to product design from architecture, chasing the same things: texture, light, and the way nature
        holds them. These are my attempts to observe those closely, then bend them towards play.
      </Statement>

      {/* Masonry — personal work, reshuffling every 20s */}
      <Masonry />
    </div>
  );
}
