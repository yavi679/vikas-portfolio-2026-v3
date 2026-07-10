"use client";

import { useEffect, useRef } from "react";

/* Liquid-distortion slideshow — a port of Codrops "LiquidDistortion" (demo #2)
   onto current PixiJS + GSAP. A clouds displacement map drifts gently over the
   images and its intensity blooms during each crossfade, warping the pixels
   like liquid, then settles. Contained to its panel, retina-aware, autoplaying.
   pixi/gsap are dynamically imported so they stay out of SSR/first bundle. */
export default function LiquidSlideshow({
  images,
  dmap,
  interval = 4000,
}: {
  images: string[];
  dmap: string;
  interval?: number;
}) {
  const hostRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const host = hostRef.current;
    if (!host) return;
    let destroyed = false;
    let cleanup = () => {};

    (async () => {
      const PIXI = await import("pixi.js");
      const { gsap } = await import("gsap");
      if (destroyed || !host) return;

      const W = host.clientWidth || 558;
      const H = host.clientHeight || 630;

      const app = new PIXI.Application({
        width: W,
        height: H,
        backgroundAlpha: 0,
        antialias: true,
        resolution: Math.min(window.devicePixelRatio || 1, 2),
        autoDensity: true,
      });
      const canvas = app.view as unknown as HTMLCanvasElement;
      canvas.style.width = "100%";
      canvas.style.height = "100%";
      host.appendChild(canvas);

      // Displacement map — centered, tiling, slowly drifting (demo #2)
      const dispTex = await PIXI.Assets.load(dmap);
      if (destroyed) return app.destroy(true);
      dispTex.baseTexture.wrapMode = PIXI.WRAP_MODES.REPEAT;
      const disp = new PIXI.Sprite(dispTex);
      disp.anchor.set(0.5);
      disp.position.set(W / 2, H / 2);
      disp.scale.set(2);
      const filter = new PIXI.DisplacementFilter(disp);
      filter.scale.x = 0; // no displacement at rest
      filter.scale.y = 0;

      const container = new PIXI.Container();
      app.stage.addChild(container);
      app.stage.addChild(disp);
      app.stage.filters = [filter];

      // Image sprites, object-cover, stacked (only the first visible)
      const texes = await Promise.all(images.map((src) => PIXI.Assets.load(src)));
      if (destroyed) return app.destroy(true);
      const sprites = texes.map((tex, i) => {
        const s = new PIXI.Sprite(tex);
        s.anchor.set(0.5);
        s.position.set(W / 2, H / 2);
        s.scale.set(Math.max(W / tex.width, H / tex.height)); // cover
        s.alpha = i === 0 ? 1 : 0;
        container.addChild(s);
        return s;
      });

      // Gentle idle drift of the displacement map
      app.ticker.add(() => {
        disp.x += 0.1;
        disp.y += 0.1;
      });

      // Autoplay transitions (demo #2 timeline: bloom → crossfade → settle)
      let cur = 0;
      let playing = false;
      const move = (next: number) => {
        if (playing || next === cur) return;
        playing = true;
        gsap
          .timeline({ onComplete: () => { cur = next; playing = false; } })
          .to(filter.scale, { x: 800, y: 500, duration: 3, ease: "power2.out" }, 0)
          // quick, overlapping crossfade under the peak distortion (not the pacing)
          .to(sprites[cur], { alpha: 0, duration: 1.2, ease: "power2.out" }, 1.4)
          .to(sprites[next], { alpha: 1, duration: 1.2, ease: "power2.out" }, 1.4)
          .to(filter.scale, { x: 0, y: 0, duration: 3, ease: "expo.out" }, 1.6);
      };
      const timer = setInterval(() => move((cur + 1) % sprites.length), interval);

      cleanup = () => {
        clearInterval(timer);
        gsap.killTweensOf(filter.scale);
        sprites.forEach((s) => gsap.killTweensOf(s));
        app.destroy(true, { children: true });
      };
    })();

    return () => {
      destroyed = true;
      cleanup();
    };
  }, [images, dmap, interval]);

  return (
    <div
      ref={hostRef}
      className="relative min-w-px rounded-2xl border border-gray-900 overflow-hidden"
      style={{ width: "calc(50% - 2px)", background: "#1a1a1a" }}
    />
  );
}
