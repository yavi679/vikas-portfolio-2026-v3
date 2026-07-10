"use client";

/* Floating design tool for the wordmark's MeshGradient. Params live in a context
   so this panel and the shader (in ProjectNav) stay in sync. Draggable by empty
   areas (no header). Styled to the Figma redesign (node 885:12421): pill chevron
   steppers, a 2D HSV color picker per color, capsule-thumb sliders, Copy/Reset. */

import {
  createContext,
  useContext,
  useState,
  type ReactNode,
  type Dispatch,
  type SetStateAction,
} from "react";
import { RotateCcw } from "lucide-react";
import { Slider } from "@/components/ui/slider";
import { Stepper } from "@/components/shader-panel/Stepper";
import { ColorPicker } from "@/components/shader-panel/ColorPicker";

/* Figma tokens: labels base/600, values base/200, pills base/bg, borders base/900. */
const LABEL = { color: "#808080", fontSize: "1rem", letterSpacing: "-0.16px", lineHeight: 1.35 } as const;
const VALUE = { color: "#e6e6e6", fontSize: "1rem", letterSpacing: "-0.16px", lineHeight: 1.35 } as const;

export type MeshParams = {
  colors: string[];
  distortion: number;
  swirl: number;
  grainMixer: number;
  grainOverlay: number;
  speed: number;
  scale: number;
  rotation: number;
  offsetX: number;
  offsetY: number;
};

export const DEFAULT_PARAMS: MeshParams = {
  colors: ["#dedede", "#a6c412", "#3399cc"],
  distortion: 1,
  swirl: 0.38,
  grainMixer: 0.36,
  grainOverlay: 0.32,
  speed: 0.6,
  scale: 0.68,
  rotation: 0,
  offsetX: 0,
  offsetY: 0,
};

type Ctx = {
  params: MeshParams;
  setParams: Dispatch<SetStateAction<MeshParams>>;
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
};
const MeshCtx = createContext<Ctx | null>(null);

export function MeshParamsProvider({ children }: { children: ReactNode }) {
  const [params, setParams] = useState<MeshParams>(DEFAULT_PARAMS);
  const [open, setOpen] = useState(false); // shown when the wordmark's Remix button is clicked
  return <MeshCtx.Provider value={{ params, setParams, open, setOpen }}>{children}</MeshCtx.Provider>;
}

export function useMeshParams() {
  const ctx = useContext(MeshCtx);
  if (!ctx) throw new Error("useMeshParams must be used within MeshParamsProvider");
  return ctx;
}

const SLIDERS: { key: keyof Omit<MeshParams, "colors">; min: number; max: number; step: number }[] = [
  { key: "distortion", min: 0, max: 1, step: 0.01 },
  { key: "swirl", min: 0, max: 1, step: 0.01 },
  { key: "grainMixer", min: 0, max: 1, step: 0.01 },
  { key: "grainOverlay", min: 0, max: 1, step: 0.01 },
  { key: "speed", min: 0, max: 2, step: 0.01 },
  { key: "scale", min: 0, max: 2, step: 0.01 },
  { key: "rotation", min: 0, max: 360, step: 1 },
  { key: "offsetX", min: -1, max: 1, step: 0.01 },
  { key: "offsetY", min: -1, max: 1, step: 0.01 },
];

const COLOR_MIN = 2;
const COLOR_MAX = 10;
const NEW_COLOR = "#3399cc";
const one = (v: number | readonly number[]) => (Array.isArray(v) ? v[0] : (v as number));

/* Capsule-thumb slider (Figma): #0d0d0d track, #b3b3b3 fill + wide #b3b3b3/#333 thumb. */
const SLIDER_CLS =
  "[&_[data-slot=slider-track]]:h-2.5 [&_[data-slot=slider-track]]:!bg-[#0d0d0d] " +
  "[&_[data-slot=slider-range]]:!bg-[#b3b3b3] " +
  "[&_[data-slot=slider-thumb]]:h-6 [&_[data-slot=slider-thumb]]:w-11 [&_[data-slot=slider-thumb]]:rounded-full " +
  "[&_[data-slot=slider-thumb]]:!border-2 [&_[data-slot=slider-thumb]]:!border-[#333] " +
  "[&_[data-slot=slider-thumb]]:!bg-[#b3b3b3] " +
  "[&_[data-slot=slider-thumb]:hover]:!bg-[#e6e6e6] [&_[data-slot=slider-thumb]:active]:!bg-[#e6e6e6]";

const NUM_PILL =
  "h-9 w-[64px] rounded-full border border-transparent bg-[#0d0d0d] px-4 text-center tabular-nums outline-none " +
  "transition-colors hover:border-[#333] focus:border-[#333] " +
  "[appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none";

export function MeshGradientControlPanel() {
  const { params, setParams } = useMeshParams();
  const [copied, setCopied] = useState(false);

  const set = <K extends keyof MeshParams>(key: K, value: MeshParams[K]) =>
    setParams((p) => ({ ...p, [key]: value }));

  const setColor = (i: number, hex: string) =>
    setParams((p) => {
      const colors = [...p.colors];
      colors[i] = hex;
      return { ...p, colors };
    });

  const setColorCount = (n: number) =>
    setParams((p) => {
      const colors = [...p.colors];
      while (colors.length < n) colors.push(NEW_COLOR);
      colors.length = n;
      return { ...p, colors };
    });

  const reset = () => setParams(DEFAULT_PARAMS);

  const copyCode = () => {
    const props = [
      `colors={${JSON.stringify(params.colors)}}`,
      ...SLIDERS.map((s) => `${s.key}={${params[s.key]}}`),
    ].join("\n  ");
    navigator.clipboard.writeText(`<MeshGradient\n  ${props}\n/>`);
    setCopied(true);
    setTimeout(() => setCopied(false), 1200);
  };

  return (
    <div
      className="relative min-h-0 w-full flex-1 overflow-y-auto rounded-2xl duration-300 ease-out animate-in fade-in slide-in-from-top-[40px]"
      style={{ background: "#1a1a1a" }}
    >
      <div className="flex flex-col items-start gap-6 px-4 py-6">
      {/* Color Count — pill stepper */}
      <div className="flex w-full items-center justify-between">
        <span style={LABEL}>Color Count</span>
        <Stepper value={params.colors.length} min={COLOR_MIN} max={COLOR_MAX} onChange={setColorCount} />
      </div>

      {/* One color picker per color */}
      {params.colors.map((c, i) => (
        <ColorPicker key={i} index={i} hex={c} onChange={(hex) => setColor(i, hex)} />
      ))}

      {/* Param sliders — label + value pill on top, capsule slider below */}
      {SLIDERS.map((s) => (
        <div key={s.key} className="flex w-full flex-col gap-[4px]">
          <div className="flex w-full items-center justify-between">
            <span style={LABEL}>{s.key}</span>
            <input
              type="number"
              className={NUM_PILL}
              style={VALUE}
              min={s.min}
              max={s.max}
              step={s.step}
              value={params[s.key]}
              onChange={(e) => set(s.key, +e.target.value)}
            />
          </div>
          <Slider
            className={SLIDER_CLS}
            min={s.min}
            max={s.max}
            step={s.step}
            value={params[s.key]}
            onValueChange={(v) => set(s.key, one(v))}
          />
        </div>
      ))}

      {/* Actions — Copy code (wide) + reset icon */}
      <div className="flex w-full items-center gap-2">
        <button
          type="button"
          onClick={copyCode}
          className="flex h-12 min-w-px flex-1 items-center justify-center rounded-full bg-[#333] px-6 transition-colors hover:bg-[#404040]"
          style={{ color: "#b3b3b3", fontSize: "1rem", letterSpacing: "-0.16px" }}
        >
          {copied ? "Copied!" : "Copy code"}
        </button>
        <button
          type="button"
          aria-label="reset"
          onClick={reset}
          className="flex size-12 shrink-0 items-center justify-center rounded-xl border border-[#333] text-[#b3b3b3] transition-colors hover:bg-[#0d0d0d]"
        >
          <RotateCcw className="size-4" />
        </button>
      </div>
      </div>
    </div>
  );
}
