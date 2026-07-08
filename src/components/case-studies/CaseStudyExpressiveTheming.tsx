"use client";

/* Pixel-match of Figma node 676:1304 — "Expressive Theming" case study.
   Revised layout: all text boxes are 1 column wide and hug content. */

import { useState, useEffect } from "react";
import { Sun, Moon } from "lucide-react";
import { Tooltip, TooltipTrigger, TooltipContent, TooltipProvider } from "@/components/ui/tooltip";
import { MarginRow, Feat, CreditsRow } from "./blocks";

const BASE = "/projects/expressive-theming/case-study";
const THEMES_BASE = "/projects/expressive-theming/themes";

const T = THEMES_BASE;

type Option = {
  value: string;
  label: string; // tooltip label
  preview: string; // dark / base preview
  previewLight?: string; // light-mode preview (falls back to preview)
  swatch?: string; // Color picker — solid pill
  thumb?: string; // Image picker — thumbnail
  gradient?: string; // Pride picker — gradient pill
};

type Tab = {
  value: string;
  label: string;
  picker?: "swatch" | "thumb" | "gradient";
  radius?: number; // picker pill corner radius
  options: Option[];
};

const PRIDE_GRADIENTS: Record<string, string> = {
  classic:
    "linear-gradient(90deg, #4eb493 7.56%, #eec55e 20.81%, #e08144 34.95%, #d85238 48.44%, #714fbc 61.81%, #4074ea 76.9%, #76c4f4 93.77%)",
  trans: "linear-gradient(90deg, #e77ebe 0%, rgba(255,255,255,0.17) 45.1%, #76c4f4 93.77%)",
  lesbian:
    "linear-gradient(270deg, #e08144 16.5%, rgba(255,255,255,0.32) 30.98%, #e77ebe 57.17%, #952060 79.85%, #d85238 100.48%)",
  "bi-sexual": "linear-gradient(270deg, #7044d1 16.27%, #e77ebe 52.32%, #4074ea 87.26%)",
  "non-binary": "linear-gradient(270deg, #714fbc 32.38%, #eec55e 62.65%, #292929 98.41%)",
};

const TABS: Tab[] = [
  {
    value: "neutral",
    label: "Neutral",
    options: [{ value: "neutral", label: "Neutral", preview: `${T}/neutral.webp`, previewLight: `${T}/neutral-light.webp` }],
  },
  {
    value: "color",
    label: "Color",
    picker: "swatch",
    radius: 10,
    // order + colors per Figma node 690:838
    options: [
      { value: "purple", label: "Purple", swatch: "#8b2df7" },
      { value: "pink", label: "Pink", swatch: "#d92786" },
      { value: "orange", label: "Orange", swatch: "#d93a00" },
      { value: "red", label: "Red", swatch: "#de264b" },
      { value: "green", label: "Green", swatch: "#1c9e6f" },
    ].map((o) => ({ ...o, preview: `${T}/color-${o.value}.avif`, previewLight: `${T}/color-${o.value}-light.avif` })),
  },
  {
    value: "image",
    label: "Image",
    picker: "thumb",
    radius: 10,
    // chip = wallpaper thumbnail; preview = full Outlook composite (light/dark),
    // falling back to the wallpaper thumb where a composite isn't supplied yet
    options: [1, 2, 3, 4, 5, 6].map((n) => ({
      value: String(n),
      label: `Image ${n}`,
      thumb: `${T}/thumbs/image-${n}.webp`,
      preview: `${T}/image-${n}.webp`,
      previewLight: `${T}/image-${n}-light.webp`,
    })),
  },
  {
    value: "pride",
    label: "Pride",
    picker: "gradient",
    radius: 10,
    options: (
      [
        ["classic", "Classic"],
        ["trans", "Trans"],
        ["lesbian", "Lesbian"],
        ["bi-sexual", "Bisexual"],
        ["non-binary", "Non-binary"],
      ] as const
    ).map(([v, label]) => ({
      value: v,
      label,
      gradient: PRIDE_GRADIENTS[v],
      preview: `${T}/pride-${v}.avif`,
      previewLight: `${T}/pride-${v}-light.avif`,
    })),
  },
];

const IMAGE_PLACEHOLDER = `${T}/image-placeholder.webp`;
const PRIDE_PLACEHOLDER = `${T}/pride-placeholder.avif`;

/* Tab controller — pixel-match of Figma nodes 690:929 (controller) + 690:838 /
   690:906 / 690:907 (per-tab pickers). Active option = white border + full
   opacity; rest = 30% opacity. */
/* Showcase image with a load-aware crossfade: the current image stays until the
   next one finishes loading, then the new one fades in over it (no blank flash). */
function ShowcaseImage({
  src,
  alt,
  baseSrc,
  placeholder,
}: {
  src: string;
  alt: string;
  baseSrc: string;
  placeholder?: string;
}) {
  const [cur, setCur] = useState(src);
  const [next, setNext] = useState<string | null>(null);

  useEffect(() => {
    setNext(src === cur ? null : src);
  }, [src, cur]);

  const onError = (e: React.SyntheticEvent<HTMLImageElement>) => {
    const t = e.currentTarget;
    if (!t.src.endsWith(baseSrc)) t.src = baseSrc;
    else if (placeholder && !t.src.endsWith(placeholder)) t.src = placeholder;
  };

  const cls = "absolute inset-0 w-full h-full object-cover";
  return (
    <>
      <img src={cur} alt={alt} className={cls} onError={onError} />
      {next && (
        <img
          key={next}
          src={next}
          alt={alt}
          className={cls}
          style={{ opacity: 0, transition: "opacity 0.35s ease" }}
          onError={onError}
          onLoad={(e) => {
            const el = e.currentTarget;
            requestAnimationFrame(() => {
              el.style.opacity = "1";
            });
          }}
          onTransitionEnd={() => {
            setCur(next);
            setNext(null);
          }}
        />
      )}
    </>
  );
}

function ThemeShowcase() {
  const [theme, setTheme] = useState(TABS[0].value);
  const [sel, setSel] = useState<Record<string, string>>({
    color: "purple",
    image: "1",
    pride: "classic",
  });
  const [mode, setMode] = useState<"dark" | "light">("dark");
  // Last tab that had a picker — kept rendered so the picker can animate OUT
  // (slide back behind the tabs) when switching to a picker-less tab (Neutral).
  const [pickerTab, setPickerTab] = useState<Tab>(() => TABS.find((t) => t.picker)!);

  const tab = TABS.find((t) => t.value === theme)!;
  const selValue = sel[theme] ?? tab.options[0].value;
  const option = tab.options.find((o) => o.value === selValue) ?? tab.options[0];

  const baseSrc = option.preview;
  const src = mode === "light" ? option.previewLight ?? option.preview : option.preview;
  const placeholder = theme === "image" ? option.thumb : theme === "pride" ? PRIDE_PLACEHOLDER : undefined;

  // Controller palette per mode (Figma 706:891 dark / 706:892 light)
  const ui =
    mode === "dark"
      ? { pill: "#1a1a1a", activeBg: "#0d0d0d", activeText: "#e6e6e6", toggleBg: "#b3b3b3", toggleIcon: "#1a1a1a", border: "#e6e6e6" }
      : { pill: "#e6e6e6", activeBg: "#b3b3b3", activeText: "#1a1a1a", toggleBg: "#1a1a1a", toggleIcon: "#e6e6e6", border: "#1a1a1a" };
  const hoverText = mode === "dark" ? "hover:text-[#b3b3b3]" : "hover:text-[#4d4d4d]";
  const restOpacity = mode === "dark" ? "opacity-30 hover:opacity-70" : "opacity-50 hover:opacity-70";

  const pick = (v: string) => setSel((s) => ({ ...s, [theme]: v }));

  // Keep the picker showing the active tab's chips; when leaving for a
  // picker-less tab, the last picker stays mounted to animate out.
  useEffect(() => {
    if (tab.picker) setPickerTab(tab);
  }, [tab]);

  const showPicker = !!tab.picker;
  const pickerVal = sel[pickerTab.value] ?? pickerTab.options[0].value;

  return (
    <div className="w-full relative aspect-video rounded-2xl overflow-hidden border border-gray-900" style={{ background: "#1a1a1a" }}>
      {/* showcase image — crossfades between options/modes */}
      <ShowcaseImage src={src} alt={`${tab.label} theme`} baseSrc={baseSrc} placeholder={placeholder} />

      {/* tab controller — bottom-left overlay, 10px inset */}
      <div className="absolute z-10" style={{ left: 8, bottom: 8 }}>
        {/* anchor is the tabs pill only; the picker is positioned off its right edge */}
        <div className="relative inline-flex items-center">
          {/* per-tab picker — sits BEHIND the tabs (lower z) and slides out from
              behind them; stays mounted so it can animate back in/out */}
          <TooltipProvider>
            <div
              className="absolute left-full top-0 z-0 flex gap-1 items-center"
              style={{
                marginLeft: 8,
                background: ui.pill,
                padding: 4,
                borderRadius: pickerTab.radius,
                transform: showPicker ? "translateX(0)" : "translateX(calc(-100% - 12px))",
                opacity: showPicker ? 1 : 0,
                pointerEvents: showPicker ? "auto" : "none",
                transition: showPicker
                  ? "transform 0.34s cubic-bezier(0.22, 1, 0.36, 1), opacity 0.22s ease-out"
                  : "transform 0.26s cubic-bezier(0.4, 0, 0.6, 1), opacity 0.16s ease-in",
                willChange: "transform",
              }}
              aria-hidden={!showPicker}
            >
              {pickerTab.options.map((o) => {
                const active = o.value === pickerVal;
                return (
                  <Tooltip key={o.value}>
                    <TooltipTrigger
                      render={
                        <button
                          onClick={() => setSel((s) => ({ ...s, [pickerTab.value]: o.value }))}
                          className={`cursor-pointer overflow-hidden bg-cover bg-center transition-opacity ${
                            active ? "opacity-100" : restOpacity
                          }`}
                          aria-label={o.label}
                          style={{
                            width: 52,
                            height: 29,
                            borderRadius: 7,
                            background: o.swatch ?? o.gradient ?? undefined,
                            backgroundImage: o.thumb ? `url(${o.thumb})` : o.gradient,
                            border: active ? `2px solid ${ui.border}` : "2px solid transparent",
                          }}
                        />
                      }
                    />
                    <TooltipContent>{o.label}</TooltipContent>
                  </Tooltip>
                );
              })}
            </div>
          </TooltipProvider>

          {/* theme tabs — on top, opaque, so the picker reads as emerging from behind */}
          <div className="relative z-10 flex gap-1 items-center rounded-full" style={{ background: ui.pill, padding: 4 }}>
            {TABS.map((t) => {
              const active = t.value === theme;
              return (
                <button
                  key={t.value}
                  onClick={() => setTheme(t.value)}
                  className={`rounded-full transition-colors cursor-pointer leading-[1.35] whitespace-nowrap ${
                    active ? "" : `text-[#808080] ${hoverText}`
                  }`}
                  style={{
                    paddingTop: 4,
                    paddingBottom: 6,
                    paddingLeft: 16,
                    paddingRight: 16,
                    fontSize: "1rem",
                    letterSpacing: "-0.16px",
                    background: active ? ui.activeBg : "transparent",
                    color: active ? ui.activeText : undefined,
                  }}
                >
                  {t.label}
                </button>
              );
            })}
            {/* mode toggle — inside the tabs pill */}
            <button
              onClick={() => setMode((m) => (m === "dark" ? "light" : "dark"))}
              className="flex items-center justify-center rounded-full cursor-pointer transition shrink-0 opacity-80 hover:opacity-100"
              style={{
                background: ui.toggleBg,
                width: 36,
                height: 29,
                color: ui.toggleIcon,
              }}
              aria-label={mode === "dark" ? "Switch to light mode" : "Switch to dark mode"}
            >
              {mode === "dark" ? <Sun size={18} /> : <Moon size={18} />}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function CaseStudyExpressiveTheming() {
  return (
    <div className="flex flex-col gap-[4px] items-center w-full">
      {/* Hero — interactive theming showcase */}
      <ThemeShowcase />

      {/* Problem — margin label + right column */}
      <MarginRow label="Problem">
        <p className="leading-[1.35]">
          Existing themes functioned as surface-level decoration (banners, colors) without
          integrating into the product&apos;s structure. There was no cohesive system to balance
          personalization with usability and brand consistency.
        </p>
      </MarginRow>

      {/* Full-width Outlook showcase */}
      <img className="w-full aspect-video rounded-2xl object-cover border border-gray-900" src={`${BASE}/hero.webp`} alt="" />

      {/* Approach — margin label + right column */}
      <MarginRow label="Approach">
        <p className="leading-[1.35]">
          Redefined the surface architecture across Outlook, including base layers, containers, and
          elevation systems. This lets visual layers like colors and images blend with the overall
          app chrome while offering a personal productivity environment.
        </p>
      </MarginRow>

      {/* Approach — full-width image (surface architecture) */}
      <img className="w-full aspect-video rounded-2xl object-cover border border-gray-900" src={`${BASE}/approach.webp`} alt="" />

      {/* Color themes — right column */}
      <MarginRow>
        <Feat name="Color themes">
          Palettes tuned for accessibility, balancing hue, saturation, and perceived brightness so
          every theme stays legible.
        </Feat>
      </MarginRow>

      {/* Two-up — color palette + spectrum (16:9 each) */}
      <div className="flex gap-[4px] w-full">
        <div className="flex-1 min-w-px aspect-video rounded-2xl overflow-hidden border border-gray-900" style={{ background: "#1a1a1a" }}>
          <img className="w-full h-full object-cover" src={`${BASE}/color-a.webp`} alt="" />
        </div>
        <div className="flex-1 min-w-px aspect-video rounded-2xl overflow-hidden border border-gray-900" style={{ background: "#ffffff" }}>
          <img className="w-full h-full object-cover" src={`${BASE}/color-b.webp`} alt="" />
        </div>
      </div>

      {/* Pride themes — right column */}
      <MarginRow>
        <Feat name="Pride themes">
          Classic, trans, lesbian, bisexual, and non-binary, each built to blend with the new surface
          architecture. Dynamic gradients stay calm behind your reading and turn expressive in the
          non-reading state.
        </Feat>
      </MarginRow>

      {/* Pride themes — full-width image */}
      <img className="w-full aspect-video rounded-2xl object-cover border border-gray-900" src={`${BASE}/pride.webp`} alt="" />

      {/* Image themes — right column */}
      <MarginRow>
        <Feat name="Image themes">
          The image sits behind the acrylic layer, keeping legibility and focus for the UI, then opens
          like a window through when the inbox is in its non-reading state.
        </Feat>
      </MarginRow>

      {/* Image themes — full-width image */}
      <img className="w-full aspect-video rounded-2xl object-cover border border-gray-900" src={`${BASE}/image-themes.webp`} alt="" />

      {/* Outcome — margin label + right column */}
      <MarginRow label="Outcome">
        <p className="leading-[1.35]">
          Shipped a unified theming system across Outlook, replacing fragmented banner-based
          customization with one architecture. It let people make the product their own while
          keeping the clarity and focus they rely on, and gave partner teams a system they could
          extend.
        </p>
      </MarginRow>

      {/* Credits + My contributions */}
      <CreditsRow
        contributions="Cross-platform UX lead, cross-product alignment, visual system components and libraries"
        credits="Alexis Copeland, Tati Astua, Yulia M, Horacio G, Pedro Leitin, BUCK Design, Christina Ergonis, Coin Moll"
      />
    </div>
  );
}
