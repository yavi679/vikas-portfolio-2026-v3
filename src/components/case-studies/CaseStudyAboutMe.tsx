"use client";

/* Based on Figma node 841:11279 — "About Vikas".
   Two big statements framing a grid: the design POV over an experience grid,
   the inspiration over a masonry of personal work. Copy in portfolio voice. */

import { useState, useEffect } from "react";
import LiquidSlideshow from "./LiquidSlideshow";

/* Light display statement (42px in Figma → 2.625rem at this project's 14px root). */
const STMT = { color: "#b3b3b3", fontSize: "2.625rem", fontWeight: 300, letterSpacing: "-1.26px", lineHeight: 1.1 } as const;
const META = { color: "#e6e6e6", fontSize: "1rem", letterSpacing: "-0.48px" } as const;
const BODY = { color: "#808080", fontSize: "1rem", letterSpacing: "-0.48px" } as const;

/* A display statement on its own filled panel, centered reading column. */
function Statement({ children }: { children: React.ReactNode }) {
  return (
    <div
      className="flex w-full justify-center rounded-2xl"
      style={{ background: "#1a1a1a", paddingLeft: 200, paddingRight: 200, paddingTop: 128, paddingBottom: 128 }}
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
    <div className="flex items-start h-full w-full rounded-2xl" style={{ background: "#1a1a1a", padding: 24 }}>
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

const SQ = ["sq1", "sq2", "sq3", "sq4", "sq5"].map(img); // 1:1 photos
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
function Tile({ area, asset }: { area: React.CSSProperties; asset: Asset }) {
  const [shown, setShown] = useState(asset);
  const [incoming, setIncoming] = useState<Asset | null>(null);
  useEffect(() => {
    if (asset.src === shown.src) return;
    setIncoming(asset);
    const t = setTimeout(() => {
      setShown(asset);
      setIncoming(null);
    }, 750);
    return () => clearTimeout(t);
  }, [asset, shown.src]);
  return (
    <div className="relative overflow-hidden border border-gray-900" style={{ background: "#1a1a1a", borderRadius: 16, ...area }}>
      <Media asset={shown} />
      {incoming && (
        <div className="absolute inset-0 animate-in fade-in duration-700 ease-out">
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
        <Tile key={i} area={t.area} asset={sel[i]} />
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
      {/* Top — "How I think" (left) beside the interests hero/slideshow (right) */}
      <div className="flex w-full gap-[4px] aspect-[1120/630]">
        <div
          className="flex items-center min-w-px rounded-2xl"
          style={{ width: "calc(50% - 2px)", background: "#1a1a1a", paddingLeft: 100, paddingRight: 100 }}
        >
          <p style={STMT}>
            I believe good design begins by listening to people, and speaks back in clarity.
          </p>
        </div>
        {/* Hero — liquid-distortion slideshow of personal interests */}
        <LiquidSlideshow images={HERO_IMAGES} dmap={`${MEDIA}/dmap-clouds.jpg`} interval={9600} />


      </div>

      {/* Experience */}
      <div className="grid grid-cols-2 items-stretch gap-[4px] w-full">
        <ExpCard logo={`${LOGOS}/adobe-firefly.webp`} company="Adobe Firefly" years="2023, 2026" role="Product designer, GenAI">
          At Adobe Firefly I lead interaction design across our flagship generative AI tools, spanning 3D,
          imaging, video, and audio. I take things like Generative Sound Effects and Generate Speech from concept
          to shipped product, mostly by holding the tension between creative control, trust, and ease of use
          while the AI keeps shifting under me. That balance is a big part of how we stay competitive in the
          creator space.
        </ExpCard>
        <ExpCard logo={`${LOGOS}/microsoft-outlook.webp`} company="Microsoft Outlook" years="2020, 2023" role="Product designer">
          On Microsoft Outlook I got to set direction, not just ship features. I authored the AI email
          intelligence framework that became our standard for bringing AI into the reading experience, later
          powering Bookmarks, Viva, and Teams. As visual lead, I also delivered 17 themes and rethought
          elevation, layering, and color tokens inside Fluent.
        </ExpCard>
        <ExpCard logo={`${LOGOS}/microsoft-excel.webp`} company="Microsoft Excel" years="2018, 2020" role="UX Designer">
          Microsoft Excel is where I cut my teeth on foundational UX at scale. I led the filtering and keyboard
          shortcut redesigns on Excel for the web, making interactions millions rely on more discoverable. I also
          shipped 10+ Smart Templates using Wolfram-powered Data Types to make them genuinely data-rich.
        </ExpCard>
        <ExpCard logo={`${LOGOS}/CMU.webp`} company="Carnegie Mellon University" years="2016, 2018" role="M Des, Interaction Design">
          I earned my M.Des in Interaction Design from Carnegie Mellon, where I worked with partners like Philips
          and Microsoft HoloLens on design that solves real everyday problems, and TA&apos;d the Interaction
          Design Studio for sophomores and juniors across three semesters. My internship at Microsoft had me
          building a management solution for the 130+ buildings on the Redmond campus.
        </ExpCard>
      </div>

      {/* What inspires me */}
      <Statement>
        I came to product design from architecture, still chasing the same things: texture, light, and the way
        nature holds them. These are my attempts to observe it closely, then bend it toward play.
      </Statement>

      {/* Masonry — personal work, reshuffling every 20s */}
      <Masonry />
    </div>
  );
}
