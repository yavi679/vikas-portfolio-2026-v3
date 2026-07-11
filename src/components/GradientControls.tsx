"use client";

/* Design tool for the About Me gradient backdrops. Each backdrop is a named
   region with its own blob array (`gradients[id]`), so every gray box is edited
   independently. Opening a region's editor docks a panel in the nav (like Remix).
   Mirrors MeshGradientControls' tokens (labels base/600, values base/200, pills
   base/bg, borders base/900). */

import {
  createContext,
  useContext,
  useState,
  type ReactNode,
  type Dispatch,
  type SetStateAction,
} from "react";
import { RotateCcw, X } from "lucide-react";
import { Slider } from "@/components/ui/slider";
import { type GBlob, DEFAULT_BLOBS } from "@/components/GradientBackdrop";

const LABEL = { color: "#808080", fontSize: "1rem", letterSpacing: "-0.16px", lineHeight: 1.35 } as const;
const VALUE = { color: "#e6e6e6", fontSize: "1rem", letterSpacing: "-0.16px", lineHeight: 1.35 } as const;

type Ctx = {
  gradients: Record<string, GBlob[]>;
  setGradient: (id: string, updater: (b: GBlob[]) => GBlob[]) => void;
  editing: string | null; // region id whose editor is open, or null
  openEditor: (id: string) => void;
  close: () => void;
  selected: number;
  setSelected: Dispatch<SetStateAction<number>>;
};
const GradientCtx = createContext<Ctx | null>(null);

/* Per-region starting values; regions not listed fall back to the shared default. */
const REGION_DEFAULTS: Record<string, GBlob[]> = {
  inspiration: [
    { color: "#000000", x: -7.1, y: -7.1,  w: 114.4, h: 114.3, blur: 0,   round: 16, glowColor: "#ed66cb", glowSize: 297 },
    { color: "#ff9a44", x: -41,  y: -67.5, w: 258,   h: 260,   blur: 320, round: 16, glowColor: "#ff8c79", glowSize: 43  },
    { color: "#f62b0a", x: 21.5, y: -9.5,  w: 161,   h: 125.5, blur: 254, round: 16, glowColor: "#ff8c79", glowSize: 127 },
    { color: "#000000", x: -5.5, y: 2.5,   w: 110,   h: 96,    blur: 97,  round: 0,  glowColor: "#000000", glowSize: 320 },
  ],
  experience: [
    { color: "#c7c7c7", x: -60,   y: -20,   w: 153,   h: 140,   blur: 0,   round: 16, glowColor: "#ed66cb", glowSize: 240 },
    { color: "#ff9a44", x: -18.2, y: -18.3, w: 197.5, h: 188.5, blur: 237, round: 16, glowColor: "#ff8c79", glowSize: 101 },
    { color: "#f62b0a", x: 40,    y: -13,   w: 62,    h: 169.5, blur: 73,  round: 16,  glowColor: "#ff8c79", glowSize: 127 },
    { color: "#000000", x: -0.5,  y: 3,     w: 97.5,  h: 100.5, blur: 98,  round: 200, glowColor: "#000000", glowSize: 320 },
  ],
  inspires: [
    { color: "#000000", x: -7.1,  y: -7.1,  w: 114.4, h: 114.3, blur: 0,   round: 16, glowColor: "#ed66cb", glowSize: 193 },
    { color: "#ff9a44", x: -18.2, y: -18.3, w: 136.4, h: 136.5, blur: 237, round: 16, glowColor: "#ff8c79", glowSize: 50  },
    { color: "#f62b0a", x: 40,    y: -13,   w: 102,   h: 125.5, blur: 73,  round: 16,  glowColor: "#ff8c79", glowSize: 127 },
    { color: "#000000", x: 7,     y: 5.5,   w: 97,    h: 102,   blur: 81,  round: 161, glowColor: "#000000", glowSize: 320 },
  ],
};

export const defaultFor = (id: string): GBlob[] => REGION_DEFAULTS[id] ?? DEFAULT_BLOBS;

/* Blobs for a region: its edited state, else its per-region default. */
export function blobsFor(gradients: Record<string, GBlob[]>, id: string): GBlob[] {
  return gradients[id] ?? defaultFor(id);
}

export function GradientParamsProvider({ children }: { children: ReactNode }) {
  const [gradients, setGradients] = useState<Record<string, GBlob[]>>({});
  const [editing, setEditing] = useState<string | null>(null);
  const [selected, setSelected] = useState(0);
  const setGradient = (id: string, updater: (b: GBlob[]) => GBlob[]) =>
    setGradients((g) => ({ ...g, [id]: updater(g[id] ?? defaultFor(id)) }));
  const openEditor = (id: string) => {
    setSelected(0);
    setEditing(id);
  };
  const close = () => setEditing(null);
  return (
    <GradientCtx.Provider value={{ gradients, setGradient, editing, openEditor, close, selected, setSelected }}>
      {children}
    </GradientCtx.Provider>
  );
}

export function useGradientParams() {
  const ctx = useContext(GradientCtx);
  if (!ctx) throw new Error("useGradientParams must be used within GradientParamsProvider");
  return ctx;
}

const SLIDERS: { key: keyof Omit<GBlob, "color" | "glowColor" | "round">; min: number; max: number; step: number }[] = [
  { key: "x", min: -60, max: 60, step: 0.5 },
  { key: "y", min: -100, max: 60, step: 0.5 },
  { key: "w", min: 40, max: 260, step: 0.5 },
  { key: "h", min: 40, max: 260, step: 0.5 },
  { key: "blur", min: 0, max: 320, step: 1 },
  { key: "glowSize", min: 0, max: 320, step: 1 },
];

const one = (v: number | readonly number[]) => (Array.isArray(v) ? v[0] : (v as number));

/* Capsule-thumb slider (Figma): #0d0d0d track, #b3b3b3 fill + wide #b3b3b3/#333 thumb. */
const SLIDER_CLS =
  "[&_[data-slot=slider-track]]:h-2.5 [&_[data-slot=slider-track]]:!bg-[#0d0d0d] " +
  "[&_[data-slot=slider-range]]:!bg-[#b3b3b3] " +
  "[&_[data-slot=slider-thumb]]:h-6 [&_[data-slot=slider-thumb]]:w-11 [&_[data-slot=slider-thumb]]:rounded-full " +
  "[&_[data-slot=slider-thumb]]:!border-2 [&_[data-slot=slider-thumb]]:!border-[#333] " +
  "[&_[data-slot=slider-thumb]]:!bg-[#b3b3b3] " +
  "[&_[data-slot=slider-thumb]:hover]:!bg-[#e6e6e6] [&_[data-slot=slider-thumb]:active]:!bg-[#e6e6e6]";

const HEX_PILL =
  "h-9 min-w-px flex-1 rounded-full border border-transparent bg-[#0d0d0d] px-4 tabular-nums outline-none " +
  "transition-colors hover:border-[#333] focus:border-[#333]";

const SWATCH =
  "h-9 w-9 shrink-0 cursor-pointer rounded-full border border-[#333] bg-transparent p-0 " +
  "[&::-webkit-color-swatch-wrapper]:p-[3px] [&::-webkit-color-swatch]:rounded-full [&::-webkit-color-swatch]:border-none";

export function GradientControlPanel() {
  const { gradients, setGradient, editing, close, selected, setSelected } = useGradientParams();
  const [copied, setCopied] = useState(false);

  if (!editing) return null;
  const blobs = gradients[editing] ?? defaultFor(editing);
  const b = blobs[selected];

  const set = <K extends keyof GBlob>(key: K, value: GBlob[K]) =>
    setGradient(editing, (arr) => arr.map((bl, i) => (i === selected ? { ...bl, [key]: value } : bl)));

  const copyCode = () => {
    const rows = blobs
      .map(
        (bl) =>
          `  { color: ${JSON.stringify(bl.color)}, x: ${bl.x}, y: ${bl.y}, w: ${bl.w}, h: ${bl.h}, ` +
          `blur: ${bl.blur}, round: ${bl.round}, glowColor: ${JSON.stringify(bl.glowColor)}, glowSize: ${bl.glowSize} },`
      )
      .join("\n");
    navigator.clipboard.writeText(`const DEFAULT_BLOBS: GBlob[] = [\n${rows}\n];`);
    setCopied(true);
    setTimeout(() => setCopied(false), 1200);
  };

  return (
    <div
      className="relative min-h-0 w-full flex-1 overflow-y-auto rounded-2xl duration-300 ease-out animate-in fade-in slide-in-from-top-[40px]"
      style={{ background: "#1a1a1a" }}
    >
      <div className="flex flex-col items-start gap-6 px-4 py-6">
        {/* Sticky top row — region name + close */}
        <div
          className="sticky top-0 z-10 -mx-4 -mt-6 flex w-[calc(100%+32px)] items-center justify-between px-4 pb-3 pt-6"
          style={{ background: "#1a1a1a" }}
        >
          <span style={VALUE} className="capitalize">
            {editing}
          </span>
          <button
            type="button"
            aria-label="close"
            onClick={close}
            className="flex size-9 items-center justify-center rounded-full border border-[#333] text-[#b3b3b3] transition-colors hover:bg-[#0d0d0d] hover:text-[#e6e6e6]"
          >
            <X className="size-4" />
          </button>
        </div>

        {/* Blob selector + per-element reset */}
        <div className="flex w-full items-center gap-2">
          {blobs.map((_, i) => (
            <button
              key={i}
              type="button"
              onClick={() => setSelected(i)}
              className={`flex size-9 items-center justify-center rounded-full border border-[#333] transition-colors ${
                i === selected ? "bg-[#333] text-[#e6e6e6]" : "bg-transparent text-[#b3b3b3] hover:bg-[#0d0d0d]"
              }`}
              style={{ fontSize: "1rem", letterSpacing: "-0.16px" }}
            >
              {i + 1}
            </button>
          ))}
          <button
            type="button"
            aria-label="reset element"
            onClick={() => setGradient(editing, (arr) => arr.map((bl, i) => (i === selected ? defaultFor(editing)[selected] : bl)))}
            className="ml-auto flex size-9 items-center justify-center rounded-full border border-[#333] text-[#b3b3b3] transition-colors hover:bg-[#0d0d0d] hover:text-[#e6e6e6]"
          >
            <RotateCcw className="size-4" />
          </button>
        </div>

        {/* Color */}
        <div className="flex w-full flex-col gap-[4px]">
          <span style={LABEL}>color</span>
          <div className="flex w-full items-center gap-2">
            <input type="text" className={HEX_PILL} style={VALUE} value={b.color} onChange={(e) => set("color", e.target.value)} />
            <input type="color" className={SWATCH} value={b.color} onChange={(e) => set("color", e.target.value)} />
          </div>
        </div>

        {/* Numeric sliders */}
        {SLIDERS.map((s) => (
          <div key={s.key} className="flex w-full flex-col gap-[4px]">
            <div className="flex w-full items-center justify-between">
              <span style={LABEL}>{s.key}</span>
              <span style={VALUE} className="tabular-nums">
                {b[s.key]}
              </span>
            </div>
            <Slider className={SLIDER_CLS} min={s.min} max={s.max} step={s.step} value={b[s.key]} onValueChange={(v) => set(s.key, one(v))} />
          </div>
        ))}

        {/* Roundness — only the 4th blob (the pill) */}
        {selected === 3 && (
          <div className="flex w-full flex-col gap-[4px]">
            <div className="flex w-full items-center justify-between">
              <span style={LABEL}>round</span>
              <span style={VALUE} className="tabular-nums">
                {b.round}
              </span>
            </div>
            <Slider className={SLIDER_CLS} min={0} max={600} step={1} value={b.round} onValueChange={(v) => set("round", one(v))} />
          </div>
        )}

        {/* Glow color */}
        <div className="flex w-full flex-col gap-[4px]">
          <span style={LABEL}>glowColor</span>
          <div className="flex w-full items-center gap-2">
            <input type="text" className={HEX_PILL} style={VALUE} value={b.glowColor} onChange={(e) => set("glowColor", e.target.value)} />
            <input type="color" className={SWATCH} value={b.glowColor} onChange={(e) => set("glowColor", e.target.value)} />
          </div>
        </div>

        {/* Copy code */}
        <button
          type="button"
          onClick={copyCode}
          className="flex h-12 w-full items-center justify-center rounded-full bg-[#333] px-6 transition-colors hover:bg-[#404040]"
          style={{ color: "#b3b3b3", fontSize: "1rem", letterSpacing: "-0.16px" }}
        >
          {copied ? "Copied!" : "Copy code"}
        </button>
      </div>
    </div>
  );
}
