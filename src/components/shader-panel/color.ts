/* HSV <-> hex helpers for the color picker (area = saturation x value, spectrum = hue). */

export function hexToHsv(hex: string): [number, number, number] {
  let h = hex.replace("#", "").trim();
  if (h.length === 3) h = h.split("").map((c) => c + c).join("");
  if (!/^[0-9a-f]{6}$/i.test(h)) return [0, 0, 1]; // tolerate mid-typing
  const r = parseInt(h.slice(0, 2), 16) / 255;
  const g = parseInt(h.slice(2, 4), 16) / 255;
  const b = parseInt(h.slice(4, 6), 16) / 255;
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  const d = max - min;
  let hue = 0;
  if (d !== 0) {
    if (max === r) hue = ((g - b) / d) % 6;
    else if (max === g) hue = (b - r) / d + 2;
    else hue = (r - g) / d + 4;
    hue = hue * 60;
    if (hue < 0) hue += 360;
  }
  const s = max === 0 ? 0 : d / max;
  return [hue, s, max];
}

export function hsvToHex(h: number, s: number, v: number): string {
  const c = v * s;
  const x = c * (1 - Math.abs(((h / 60) % 2) - 1));
  const m = v - c;
  let r = 0;
  let g = 0;
  let b = 0;
  if (h < 60) [r, g, b] = [c, x, 0];
  else if (h < 120) [r, g, b] = [x, c, 0];
  else if (h < 180) [r, g, b] = [0, c, x];
  else if (h < 240) [r, g, b] = [0, x, c];
  else if (h < 300) [r, g, b] = [x, 0, c];
  else [r, g, b] = [c, 0, x];
  const toHex = (n: number) => Math.round((n + m) * 255).toString(16).padStart(2, "0");
  return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
}

/* Hue spectrum gradient (from the Figma color spectrum). */
export const SPECTRUM =
  "linear-gradient(90deg, rgb(255,0,0) 0%, rgb(255,81,0) 10%, rgb(255,238,0) 20%, " +
  "rgb(106,255,0) 30%, rgb(0,255,72) 40%, rgb(0,246,255) 50%, rgb(0,89,255) 60%, " +
  "rgb(55,0,255) 70%, rgb(229,0,255) 80%, rgb(255,0,132) 90%, rgb(255,0,4) 100%)";
