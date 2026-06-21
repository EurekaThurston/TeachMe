/* vx-tools.js — interactive helpers for 美术基础-for-VFX lessons 0002–0004.
 *
 * Zero external dependencies. Pure DOM / SVG / canvas.
 * Owned by the silhouette/value-grouping/value-over-time lessons so it does not
 * collide with other agents' files. Complements value-tools.js (去色切换/明度计算).
 *
 * Exposed helpers:
 *   wireSilhouetteToggle(btnId, ...targetIds)
 *       Toggle the `.is-silhouette` class on targets — flips a colored FX preview
 *       to a pure-black silhouette so the learner reads SHAPE only.
 *
 *   wirePosterize(opts)
 *       Drive an HTML element's value structure into N flat bands (notan thinking).
 *       opts = { sliderId, srcCanvasId|srcImageId, outCanvasId, labelId }
 *       Re-quantizes luminance of a source canvas into `slider` levels.
 *
 *   makeValueCurve(t, attack, decay)
 *       The "快起慢落 / snap" value-over-life curve. Returns 0..1 for life t in 0..1.
 *
 *   wireValueTimeline(opts)
 *       A life-scrubber: slider (or play button) drives an FX orb's brightness/scale
 *       by makeValueCurve, and paints the curve + a playhead onto an SVG.
 */

/* ---- 0002: silhouette flip ---- */
function wireSilhouetteToggle(btnId, ...targetIds) {
  const btn = document.getElementById(btnId);
  if (!btn) return;
  const targets = targetIds.map((id) => document.getElementById(id)).filter(Boolean);
  let on = false;
  const labelOn = btn.dataset.on || "回到彩色";
  const labelOff = btn.dataset.off || btn.textContent;
  btn.addEventListener("click", () => {
    on = !on;
    targets.forEach((t) => t.classList.toggle("is-silhouette", on));
    btn.classList.toggle("active", on);
    btn.textContent = on ? labelOn : labelOff;
  });
}

/* ---- 0003: posterize / value quantize ---- */
function wirePosterize(opts) {
  const slider = document.getElementById(opts.sliderId);
  const src = document.getElementById(opts.srcCanvasId);
  const out = document.getElementById(opts.outCanvasId);
  const label = opts.labelId ? document.getElementById(opts.labelId) : null;
  if (!slider || !src || !out) return;

  function render() {
    const levels = parseInt(slider.value, 10);
    if (label) label.textContent = levels;
    const w = src.width, h = src.height;
    out.width = w; out.height = h;
    const sctx = src.getContext("2d");
    const octx = out.getContext("2d");
    const img = sctx.getImageData(0, 0, w, h);
    const d = img.data;
    const step = 255 / (levels - 1);
    for (let i = 0; i < d.length; i += 4) {
      // perceptual luminance, then snap to nearest band, output as gray
      const lum = 0.2126 * d[i] + 0.7152 * d[i + 1] + 0.0722 * d[i + 2];
      const q = Math.round(Math.round(lum / step) * step);
      d[i] = d[i + 1] = d[i + 2] = q;
    }
    octx.putImageData(img, 0, 0);
  }

  slider.addEventListener("input", render);
  // expose so the page can re-render once the source canvas is painted
  return render;
}

/* ---- 0004: value-over-life curve + timeline ---- */
/* 快起慢落: a fast attack to a sharp peak at t=attack, then a slow ease-out decay.
   attack defaults ~0.12 (peak early), decay shapes the tail length. */
function makeValueCurve(t, attack, decay) {
  attack = (attack == null) ? 0.12 : attack;
  decay = (decay == null) ? 2.2 : decay;
  if (t <= 0) return 0;
  if (t < attack) {
    // fast rise, slight ease so it "snaps" up
    const x = t / attack;
    return Math.pow(x, 0.55);
  }
  // slow ease-out decay from 1 back toward 0
  const x = (t - attack) / (1 - attack);
  return Math.pow(1 - x, decay);
}

function wireValueTimeline(opts) {
  const slider = document.getElementById(opts.sliderId);
  const orb = document.getElementById(opts.orbId);
  const svg = document.getElementById(opts.svgId);
  const playBtn = opts.playBtnId ? document.getElementById(opts.playBtnId) : null;
  const readout = opts.readoutId ? document.getElementById(opts.readoutId) : null;
  if (!slider || !orb || !svg) return;

  const attack = opts.attack, decay = opts.decay;
  const W = 320, H = 120, pad = 8;
  const ns = "http://www.w3.org/2000/svg";

  // build static curve path once
  function curveX(t) { return pad + t * (W - 2 * pad); }
  function curveY(v) { return (H - pad) - v * (H - 2 * pad); }

  let dPath = "";
  for (let i = 0; i <= 100; i++) {
    const t = i / 100;
    const v = makeValueCurve(t, attack, decay);
    dPath += (i === 0 ? "M" : "L") + curveX(t).toFixed(1) + " " + curveY(v).toFixed(1) + " ";
  }
  const path = document.createElementNS(ns, "path");
  path.setAttribute("d", dPath);
  path.setAttribute("fill", "none");
  path.setAttribute("stroke", "#b4632a");
  path.setAttribute("stroke-width", "2");
  svg.appendChild(path);

  const playhead = document.createElementNS(ns, "line");
  playhead.setAttribute("stroke", "#2b6d8a");
  playhead.setAttribute("stroke-width", "1.5");
  playhead.setAttribute("y1", pad);
  playhead.setAttribute("y2", H - pad);
  svg.appendChild(playhead);

  const dot = document.createElementNS(ns, "circle");
  dot.setAttribute("r", "3.5");
  dot.setAttribute("fill", "#2b6d8a");
  svg.appendChild(dot);

  function apply(t) {
    const v = makeValueCurve(t, attack, decay);
    // brightness: dim floor so a near-zero life is dark, peak is white-hot
    const bright = 0.12 + 0.88 * v;
    const scale = 0.45 + 0.75 * v;
    orb.style.opacity = (0.25 + 0.75 * v).toFixed(3);
    orb.style.transform = "translate(-50%,-50%) scale(" + scale.toFixed(3) + ")";
    orb.style.filter = "brightness(" + bright.toFixed(3) + ") blur(0.5px)";
    const x = curveX(t), y = curveY(v);
    playhead.setAttribute("x1", x); playhead.setAttribute("x2", x);
    dot.setAttribute("cx", x); dot.setAttribute("cy", y);
    if (readout) readout.textContent = Math.round(v * 100);
  }

  slider.addEventListener("input", () => apply(parseInt(slider.value, 10) / 100));
  apply(parseInt(slider.value, 10) / 100);

  if (playBtn) {
    let raf = null, start = null;
    const dur = opts.durationMs || 2600;
    playBtn.addEventListener("click", () => {
      if (raf) { cancelAnimationFrame(raf); raf = null; }
      start = null;
      function frame(ts) {
        if (start == null) start = ts;
        const t = Math.min(1, (ts - start) / dur);
        slider.value = Math.round(t * 100);
        apply(t);
        if (t < 1) raf = requestAnimationFrame(frame);
        else raf = null;
      }
      raf = requestAnimationFrame(frame);
    });
  }
}
