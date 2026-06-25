"use client";

/* Pixel-match of Figma node 676:1304 — "Expressive Theming" case study.
   Revised layout: all text boxes are 1 column wide and hug content. */

import { useState } from "react";
import { Sun, Moon } from "lucide-react";
import { Tooltip, TooltipTrigger, TooltipContent, TooltipProvider } from "@/components/ui/tooltip";

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
function ThemeShowcase() {
  const [theme, setTheme] = useState(TABS[0].value);
  const [sel, setSel] = useState<Record<string, string>>({
    color: "purple",
    image: "1",
    pride: "classic",
  });
  const [mode, setMode] = useState<"dark" | "light">("dark");

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

  return (
    <div className="w-full relative aspect-video rounded-2xl overflow-hidden border border-gray-900" style={{ background: "#1a1a1a" }}>
      {/* showcase image */}
      <img
        key={src}
        className="w-full h-full object-cover"
        src={src}
        alt={`${tab.label} theme`}
        onError={(e) => {
          const t = e.currentTarget;
          if (!t.src.endsWith(baseSrc)) t.src = baseSrc;
          else if (placeholder && !t.src.endsWith(placeholder)) t.src = placeholder;
        }}
      />

      {/* tab controller — bottom-left overlay, 10px inset */}
      <div className="absolute flex gap-2 items-center z-10" style={{ left: 10, bottom: 10 }}>
        {/* theme tabs */}
        <div className="flex gap-1 items-center rounded-full" style={{ background: ui.pill, padding: 4 }}>
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
            className="flex items-center justify-center rounded-full cursor-pointer transition-colors shrink-0"
            style={{
              background: ui.toggleBg,
              width: 29,
              height: 29,
              color: ui.toggleIcon,
            }}
            aria-label={mode === "dark" ? "Switch to light mode" : "Switch to dark mode"}
          >
            {mode === "dark" ? <Sun size={18} /> : <Moon size={18} />}
          </button>
        </div>

        {/* per-tab picker */}
        {tab.picker && (
          <TooltipProvider>
            <div
              className="flex gap-1 items-center"
              style={{ background: ui.pill, padding: 4, borderRadius: tab.radius }}
            >
              {tab.options.map((o) => {
                const active = o.value === selValue;
                return (
                  <Tooltip key={o.value}>
                    <TooltipTrigger
                      render={
                        <button
                          onClick={() => pick(o.value)}
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
        )}

      </div>
    </div>
  );
}

const LABEL = { color: "#808080", fontSize: "1rem", letterSpacing: "-0.48px" } as const;
const BODY = { color: "#e6e6e6", fontSize: "1rem", letterSpacing: "-0.16px" } as const;

function TextBlock({
  label,
  children,
  align = "top",
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

/* A half-width caption pinned to one side; width matches a full-width media's
   half exactly: (100% - 8px gap) / 2. */
function Caption({
  side,
  label,
  children,
}: {
  side: "left" | "right";
  label?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex w-full" style={{ justifyContent: side === "left" ? "flex-start" : "flex-end" }}>
      <TextBlock label={label} style={{ width: "calc(50% - 4px)" }}>
        {children}
      </TextBlock>
    </div>
  );
}

/* A feature note: muted gray name + bullet, then the description in body color. */
function Feat({ name, children }: { name: string; children: React.ReactNode }) {
  return (
    <p className="leading-[1.35]">
      <span style={{ color: "#808080" }}>{name} • </span>
      {children}
    </p>
  );
}

export default function CaseStudyExpressiveTheming() {
  return (
    <div className="flex flex-col gap-2 items-center w-full">
      {/* Hero — interactive theming showcase */}
      <ThemeShowcase />

      {/* Problem — caption left */}
      <Caption side="left" label="Problem">
        <p className="leading-[1.35]">
          Existing themes functioned as surface-level decoration (banners, colors) without
          integrating into the product&apos;s structure. There was no cohesive system to balance
          personalization with usability and brand consistency.
        </p>
      </Caption>

      {/* Full-width Outlook showcase */}
      <img className="w-full aspect-video rounded-2xl object-cover border border-gray-900" src={`${BASE}/hero.webp`} alt="" />

      {/* Approach — caption right */}
      <Caption side="right" label="Approach">
        <p className="leading-[1.35]">
          Redefined the surface architecture across Outlook, including base layers, containers, and
          elevation systems. This lets visual layers like colors and images blend with the overall
          app chrome while offering a personal productivity environment.
        </p>
      </Caption>

      {/* Approach — full-width image (surface architecture) */}
      <img className="w-full aspect-video rounded-2xl object-cover border border-gray-900" src={`${BASE}/approach.webp`} alt="" />

      {/* Color themes — caption left */}
      <Caption side="left">
        <Feat name="Color themes">
          Palettes tuned for accessibility, balancing hue, saturation, and perceived brightness so
          every theme stays legible.
        </Feat>
      </Caption>

      {/* Two-up — color palette + spectrum (16:9 each) */}
      <div className="flex gap-2 w-full">
        <div className="flex-1 min-w-px aspect-video rounded-2xl overflow-hidden border border-gray-900" style={{ background: "#1a1a1a" }}>
          <img className="w-full h-full object-cover" src={`${BASE}/color-a.webp`} alt="" />
        </div>
        <div className="flex-1 min-w-px aspect-video rounded-2xl overflow-hidden border border-gray-900" style={{ background: "#ffffff" }}>
          <img className="w-full h-full object-cover" src={`${BASE}/color-b.webp`} alt="" />
        </div>
      </div>

      {/* Pride themes — caption right */}
      <Caption side="right">
        <Feat name="Pride themes">
          Classic, trans, lesbian, bisexual, and non-binary, each built to blend with the new surface
          architecture. Dynamic gradients stay calm behind your reading and turn expressive in the
          non-reading state.
        </Feat>
      </Caption>

      {/* Pride themes — full-width image */}
      <img className="w-full aspect-video rounded-2xl object-cover border border-gray-900" src={`${BASE}/pride.webp`} alt="" />

      {/* Image themes — caption left */}
      <Caption side="left">
        <Feat name="Image themes">
          The image sits behind the acrylic layer, keeping legibility and focus for the UI, then opens
          like a window through when the inbox is in its non-reading state.
        </Feat>
      </Caption>

      {/* Image themes — full-width image */}
      <img className="w-full aspect-video rounded-2xl object-cover border border-gray-900" src={`${BASE}/image-themes.webp`} alt="" />

      {/* Outcome (2 col) + Credits / My contributions stack (1 col) — 300px tall */}
      <div className="flex gap-2 w-full" style={{ height: 300 }}>
        <TextBlock label="Outcome" style={{ flex: "744 1 0" }}>
          <p className="leading-[1.35]">
            Shipped a unified theming system across Outlook, replacing fragmented banner-based
            customization with one architecture. It let people make the product their own while
            keeping the clarity and focus they rely on, and gave partner teams a system they could
            extend.
          </p>
        </TextBlock>
        <div className="flex flex-col gap-2 h-full" style={{ flex: "368 1 0" }}>
          <TextBlock label="Credits" className="flex-1">
            <p className="leading-[1.35]">
              Alexis Copeland, Tati Astua, Yulia M, Horacio G, Pedro Leitin, BUCK Design, Christina
              Ergonis, Coin Moll
            </p>
          </TextBlock>
          <TextBlock label="My contributions">
            <p className="leading-[1.35]">
              Cross-platform UX lead, cross-product alignment, visual system components and libraries
            </p>
          </TextBlock>
        </div>
      </div>
    </div>
  );
}
