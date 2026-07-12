/* Recreates the Figma "Gradient 1" bloom (node 899:12874): a stack of oversized
   rounded shapes, clipped by the parent, each with a soft white rim + one colored
   inset glow. Param-driven so a control panel can edit every blob live.
   Fills its parent; the parent must be `relative` + rounded + `overflow-hidden`.
   Positions/sizes are % of the container so it scales to any size.

   Note: this intentionally simplifies the original multi-glow layers to one
   editable colored inset glow + a soft white rim per blob — the tradeoff for
   editability. Render order = array order. */

export type GBlob = {
  color: string;
  x: number; y: number; // top-left position, % of container
  w: number; h: number; // size, % of container
  blur: number; // px (0 = none)
  round: number; // border radius px (16 = rounded, 9999 = pill)
  glowColor: string;
  glowSize: number; // px, the colored inset bloom radius
};

export const DEFAULT_BLOBS: GBlob[] = [
  { color: "#000000", x: -7.1,  y: -7.1,  w: 114.4, h: 114.3, blur: 0,   round: 16, glowColor: "#ed66cb", glowSize: 193 },
  { color: "#ff9a44", x: -18.2, y: -18.3, w: 136.4, h: 136.5, blur: 237, round: 16, glowColor: "#ff8c79", glowSize: 50  },
  { color: "#f62b0a", x: 40,    y: -13,   w: 62,    h: 125.5, blur: 73,  round: 16, glowColor: "#ff8c79", glowSize: 127 },
  { color: "#000000", x: -4.5,  y: -7,    w: 87.5,  h: 122.5, blur: 101, round: 0,  glowColor: "#000000", glowSize: 320 },
];

/* Blobs render into a layer sized 1/SCALE and then blown back up with a
   transform. The heavy `blur()`/glow work happens on ~1/SCALE² the pixels
   (~16× cheaper at SCALE 4) and the upscale is invisible because the result is
   blurry anyway. Blob %s are relative to the small layer, so positions map back
   1:1 after scaling; px values (blur/glow/rim/radius) are divided by SCALE so
   the transform multiplies them back to their intended size. */
const SCALE = 4;

export default function GradientBackdrop({
  blobs = DEFAULT_BLOBS,
  className = "",
}: {
  blobs?: GBlob[];
  className?: string;
}) {
  return (
    <div
      className={`pointer-events-none absolute inset-0 overflow-hidden ${className}`}
      style={{ contain: "paint" }}
      aria-hidden
    >
      <div
        className="absolute left-0 top-0"
        style={{
          width: `${100 / SCALE}%`,
          height: `${100 / SCALE}%`,
          transform: `scale(${SCALE})`,
          transformOrigin: "top left",
        }}
      >
        {blobs.map((b, i) => (
          <div
            key={i}
            className="absolute"
            style={{
              left: `${b.x}%`,
              top: `${b.y}%`,
              width: `${b.w}%`,
              height: `${b.h}%`,
              background: b.color,
              borderRadius: b.round / SCALE,
              filter: b.blur > 0 ? `blur(${b.blur / SCALE}px)` : undefined,
              boxShadow: `inset 0 0 ${16 / SCALE}px 0 #ffffff40, inset 0 0 ${b.glowSize / SCALE}px 0 ${b.glowColor}`,
            }}
          />
        ))}
      </div>
    </div>
  );
}
