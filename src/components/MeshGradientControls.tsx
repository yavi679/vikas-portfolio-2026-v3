"use client";

/* Floating design tool for the wordmark's MeshGradient. The params live in a
   context so this panel and the shader (in ProjectNav) stay in sync. Draggable
   by its header, collapsible, with presets and a "copy code" button so tuned
   values can be pasted straight back into the component. */

import {
  createContext,
  useContext,
  useState,
  useEffect,
  useRef,
  type ReactNode,
  type Dispatch,
  type SetStateAction,
  type PointerEvent as RPointerEvent,
} from "react";

/* Where saved settings live. Bump the suffix if the param shape changes. */
const STORAGE_KEY = "wordmark-shader-params-v1";

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

const PRESETS: Record<string, MeshParams> = {
  Default: DEFAULT_PARAMS,
  Ink: { colors: ["#0a0a0a", "#4a4a4a", "#c8c8c8"], distortion: 0.85, swirl: 0.55, grainMixer: 0.5, grainOverlay: 0.45, speed: 0.4, scale: 0.9, rotation: 0, offsetX: 0, offsetY: 0 },
  Purple: { colors: ["#2b0a4a", "#7b2ff7", "#f107a3"], distortion: 0.9, swirl: 0.45, grainMixer: 0.3, grainOverlay: 0.25, speed: 0.5, scale: 0.8, rotation: 20, offsetX: 0, offsetY: 0 },
  Beach: { colors: ["#ffe29a", "#ffa99f", "#4bc0c8"], distortion: 0.7, swirl: 0.3, grainMixer: 0.2, grainOverlay: 0.2, speed: 0.6, scale: 0.7, rotation: 0, offsetX: 0, offsetY: 0 },
};

type Ctx = { params: MeshParams; setParams: Dispatch<SetStateAction<MeshParams>> };
const MeshCtx = createContext<Ctx | null>(null);

export function MeshParamsProvider({ children }: { children: ReactNode }) {
  const [params, setParams] = useState<MeshParams>(DEFAULT_PARAMS);
  // Hydrate saved settings after mount (keeps SSR markup matching the default).
  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) setParams({ ...DEFAULT_PARAMS, ...JSON.parse(raw) });
    } catch {}
  }, []);
  return <MeshCtx.Provider value={{ params, setParams }}>{children}</MeshCtx.Provider>;
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

const NEW_COLOR = "#3399cc";

function Row({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="grid grid-cols-[86px_1fr_52px] items-center gap-3">
      <span className="text-[13px] text-neutral-300 truncate">{label}</span>
      {children}
    </div>
  );
}

export function MeshGradientControlPanel() {
  const { params, setParams } = useMeshParams();
  const [collapsed, setCollapsed] = useState(false);
  const [copied, setCopied] = useState(false);
  const [saved, setSaved] = useState(false);
  const [pos, setPos] = useState(() => ({
    x: typeof window !== "undefined" ? window.innerWidth - 336 : 1000,
    y: 16,
  }));
  const drag = useRef<{ dx: number; dy: number } | null>(null);

  const onDown = (e: RPointerEvent) => {
    drag.current = { dx: e.clientX - pos.x, dy: e.clientY - pos.y };
    (e.target as Element).setPointerCapture(e.pointerId);
  };
  const onMove = (e: RPointerEvent) => {
    if (!drag.current) return;
    setPos({ x: e.clientX - drag.current.dx, y: e.clientY - drag.current.dy });
  };
  const onUp = () => {
    drag.current = null;
  };

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

  const save = () => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(params));
    } catch {}
    setSaved(true);
    setTimeout(() => setSaved(false), 1200);
  };

  const reset = () => {
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch {}
    setParams(DEFAULT_PARAMS);
  };

  const copyCode = () => {
    const props = [
      `colors={${JSON.stringify(params.colors)}}`,
      ...SLIDERS.map((s) => `${s.key}={${params[s.key]}}`),
    ].join("\n  ");
    navigator.clipboard.writeText(`<MeshGradient\n  ${props}\n/>`);
    setCopied(true);
    setTimeout(() => setCopied(false), 1200);
  };

  const num = "w-full rounded-md bg-neutral-800 px-2 py-1 text-[13px] text-neutral-200 text-right tabular-nums outline-none focus:ring-1 focus:ring-white/30";
  const range = "w-full accent-neutral-300 cursor-pointer";

  return (
    <div
      className="fixed z-[2000] w-[320px] rounded-2xl border border-white/10 bg-neutral-900/95 backdrop-blur shadow-2xl select-none"
      style={{ left: pos.x, top: pos.y }}
    >
      {/* Draggable header */}
      <div
        onPointerDown={onDown}
        onPointerMove={onMove}
        onPointerUp={onUp}
        className="flex items-center justify-between px-4 py-3 cursor-grab active:cursor-grabbing"
      >
        <span className="text-[13px] font-medium text-neutral-200">Shader</span>
        <button
          onClick={() => setCollapsed((c) => !c)}
          className="text-neutral-400 hover:text-neutral-100 text-sm leading-none px-1"
        >
          {collapsed ? "+" : "–"}
        </button>
      </div>

      {!collapsed && (
        <div className="px-4 pb-4 flex flex-col gap-3">
          {/* Presets */}
          <div className="grid grid-cols-2 gap-2">
            {Object.keys(PRESETS).map((name) => (
              <button
                key={name}
                onClick={() => setParams(PRESETS[name])}
                className="rounded-md bg-neutral-700 hover:bg-neutral-600 px-3 py-2 text-[13px] text-neutral-200 transition-colors"
              >
                {name}
              </button>
            ))}
          </div>

          <div className="h-px bg-white/10" />

          {/* colorCount */}
          <Row label="colorCount">
            <input
              type="range"
              min={2}
              max={5}
              step={1}
              value={params.colors.length}
              onChange={(e) => setColorCount(+e.target.value)}
              className={range}
            />
            <input
              type="number"
              min={2}
              max={5}
              value={params.colors.length}
              onChange={(e) => setColorCount(+e.target.value)}
              className={num}
            />
          </Row>

          {/* colors */}
          {params.colors.map((c, i) => (
            <Row key={i} label={`color${i + 1}`}>
              <input
                type="color"
                value={c}
                onChange={(e) => setColor(i, e.target.value)}
                className="h-7 w-full cursor-pointer rounded-md bg-transparent"
              />
              <input
                type="text"
                value={c}
                onChange={(e) => setColor(i, e.target.value)}
                className="w-full rounded-md bg-neutral-800 px-2 py-1 text-[12px] text-neutral-200 outline-none focus:ring-1 focus:ring-white/30"
              />
            </Row>
          ))}

          {/* numeric sliders */}
          {SLIDERS.map((s) => (
            <Row key={s.key} label={s.key}>
              <input
                type="range"
                min={s.min}
                max={s.max}
                step={s.step}
                value={params[s.key]}
                onChange={(e) => set(s.key, +e.target.value)}
                className={range}
              />
              <input
                type="number"
                min={s.min}
                max={s.max}
                step={s.step}
                value={params[s.key]}
                onChange={(e) => set(s.key, +e.target.value)}
                className={num}
              />
            </Row>
          ))}

          <div className="h-px bg-white/10" />

          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={save}
              className="rounded-md bg-neutral-100 hover:bg-white px-3 py-2 text-[13px] font-medium text-neutral-900 transition-colors"
            >
              {saved ? "Saved!" : "Save"}
            </button>
            <button
              onClick={reset}
              className="rounded-md bg-neutral-700 hover:bg-neutral-600 px-3 py-2 text-[13px] text-neutral-200 transition-colors"
            >
              Reset
            </button>
          </div>

          <button
            onClick={copyCode}
            className="rounded-md border border-white/15 hover:bg-white/5 px-3 py-2 text-[13px] text-neutral-300 transition-colors"
          >
            {copied ? "Copied!" : "Copy code"}
          </button>
        </div>
      )}
    </div>
  );
}
