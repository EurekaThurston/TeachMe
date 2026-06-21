/* color-tools.js — interactive helpers for 美术基础-for-VFX 模块 C(色彩)课程。
 *
 * 零外部依赖。纯 DOM / SVG / canvas。
 * 归 0009–0011(HSV / 色相环配色 / 冷暖)所有,避免与 value-tools.js、
 * vx-tools.js 冲突。互补 value-tools.js 的 relativeLuminance()。
 *
 * 暴露的工具:
 *   hsvToRgb(h, s, v)  -> {r,g,b}   h:0..360  s,v:0..1   (整数 0..255)
 *   rgbToHex(r, g, b)  -> "#rrggbb"
 *   hsvToHex(h, s, v)  -> "#rrggbb"
 *
 *   wireHsvDials(opts)
 *       三个滑块 H/S/V 驱动一个色块 + 去色灰度预览 + value 数字读数。
 *       证明猛拉 S 而 value / 灰度几乎不变(0009)。
 *
 *   HARMONY  配色方案的 hue 偏移定义(度)。
 *   harmonyHues(baseHue, scheme) -> [hue, ...]  返回该方案下所有伙伴 hue。
 *   wireColorWheel(opts)
 *       可交互色相环(canvas):选方案 + 点 hue → 高亮伙伴 → 输出 2–3 色调色板(0010)。
 *
 *   warmth(hue) -> -1..1  (1 最暖 ≈ 橙红, -1 最冷 ≈ 青蓝)
 *   wireWarmthSort(opts)  "哪个更暖?"点击判断 + 即时反馈(0011)。
 *   wireDepthToggle(btnId, sceneId)  "暖前冷后 ↔ 全平"切换演示纵深(0011)。
 */

/* ===== 颜色换算 ===== */
function hsvToRgb(h, s, v) {
  h = ((h % 360) + 360) % 360;
  const c = v * s;
  const x = c * (1 - Math.abs(((h / 60) % 2) - 1));
  const m = v - c;
  let r = 0, g = 0, b = 0;
  if (h < 60) { r = c; g = x; b = 0; }
  else if (h < 120) { r = x; g = c; b = 0; }
  else if (h < 180) { r = 0; g = c; b = x; }
  else if (h < 240) { r = 0; g = x; b = c; }
  else if (h < 300) { r = x; g = 0; b = c; }
  else { r = c; g = 0; b = x; }
  return {
    r: Math.round((r + m) * 255),
    g: Math.round((g + m) * 255),
    b: Math.round((b + m) * 255)
  };
}

function rgbToHex(r, g, b) {
  const h = (n) => n.toString(16).padStart(2, "0");
  return "#" + h(r) + h(g) + h(b);
}

function hsvToHex(h, s, v) {
  const c = hsvToRgb(h, s, v);
  return rgbToHex(c.r, c.g, c.b);
}

/* ===== 0009: H/S/V 三旋钮 + 去色证明 ===== */
function wireHsvDials(opts) {
  const hEl = document.getElementById(opts.hId);
  const sEl = document.getElementById(opts.sId);
  const vEl = document.getElementById(opts.vId);
  const swatch = document.getElementById(opts.swatchId);
  const gray = document.getElementById(opts.grayId);
  if (!hEl || !sEl || !vEl || !swatch) return;

  const hOut = opts.hOutId ? document.getElementById(opts.hOutId) : null;
  const sOut = opts.sOutId ? document.getElementById(opts.sOutId) : null;
  const vOut = opts.vOutId ? document.getElementById(opts.vOutId) : null;
  const lumOut = opts.lumOutId ? document.getElementById(opts.lumOutId) : null;
  const hexOut = opts.hexOutId ? document.getElementById(opts.hexOutId) : null;

  function render() {
    const h = parseInt(hEl.value, 10);
    const s = parseInt(sEl.value, 10) / 100;
    const v = parseInt(vEl.value, 10) / 100;
    const hex = hsvToHex(h, s, v);
    swatch.style.background = hex;
    // 感知明度(Rec.709)0..1 -> 0..100,与去色灰度对应
    const lum = (typeof relativeLuminance === "function") ? relativeLuminance(hex) : v;
    const g255 = Math.round(lum * 255);
    if (gray) gray.style.background = rgbToHex(g255, g255, g255);
    if (hOut) hOut.textContent = h + "°";
    if (sOut) sOut.textContent = Math.round(s * 100) + "%";
    if (vOut) vOut.textContent = Math.round(v * 100) + "%";
    if (lumOut) lumOut.textContent = Math.round(lum * 100);
    if (hexOut) hexOut.textContent = hex;
  }

  [hEl, sEl, vEl].forEach((el) => el.addEventListener("input", render));
  render();
  return render;
}

/* ===== 0010: 色相环 + 配色方案 ===== */
var HARMONY = {
  complementary: { name: "互补 Complementary", offsets: [0, 180] },
  analogous: { name: "邻近 Analogous", offsets: [-30, 0, 30] },
  splitcomp: { name: "分裂互补 Split-Comp", offsets: [0, 150, 210] },
  triadic: { name: "三角 Triadic", offsets: [0, 120, 240] }
};

function harmonyHues(baseHue, scheme) {
  const def = HARMONY[scheme] || HARMONY.complementary;
  return def.offsets.map((o) => ((baseHue + o) % 360 + 360) % 360);
}

function wireColorWheel(opts) {
  const canvas = document.getElementById(opts.canvasId);
  const select = document.getElementById(opts.selectId);
  const palette = document.getElementById(opts.paletteId);
  const nameOut = opts.nameOutId ? document.getElementById(opts.nameOutId) : null;
  if (!canvas || !select || !palette) return;

  const ctx = canvas.getContext("2d");
  const size = canvas.width;
  const cx = size / 2, cy = size / 2;
  const rOuter = size / 2 - 4;
  const rInner = rOuter * 0.58;
  const sat = 0.92, val = 1.0;
  let baseHue = 0;

  function drawWheel() {
    ctx.clearRect(0, 0, size, size);
    // 用细扇形画出 hue 环
    for (let a = 0; a < 360; a++) {
      const start = (a - 0.6) * Math.PI / 180;
      const end = (a + 1.0) * Math.PI / 180;
      ctx.beginPath();
      ctx.moveTo(cx, cy);
      ctx.arc(cx, cy, rOuter, start, end);
      ctx.closePath();
      ctx.fillStyle = hsvToHex(a, sat, val);
      ctx.fill();
    }
    // 挖空中心
    ctx.globalCompositeOperation = "destination-out";
    ctx.beginPath();
    ctx.arc(cx, cy, rInner, 0, Math.PI * 2);
    ctx.fill();
    ctx.globalCompositeOperation = "source-over";
  }

  function hueToXY(hue, r) {
    // 与 drawWheel 一致:hue 0 在 3 点钟方向(canvas arc 从 +x 轴起算),顺时针递增
    const ang = hue * Math.PI / 180;
    return { x: cx + Math.cos(ang) * r, y: cy + Math.sin(ang) * r };
  }

  function drawMarkers() {
    const scheme = select.value;
    const hues = harmonyHues(baseHue, scheme);
    const rMid = (rOuter + rInner) / 2;
    hues.forEach((hue, i) => {
      const p = hueToXY(hue, rMid);
      ctx.beginPath();
      ctx.arc(p.x, p.y, i === 0 ? 11 : 8, 0, Math.PI * 2);
      ctx.fillStyle = hsvToHex(hue, sat, val);
      ctx.fill();
      ctx.lineWidth = i === 0 ? 3 : 2;
      ctx.strokeStyle = "#17181c";
      ctx.stroke();
      ctx.lineWidth = 1.5;
      ctx.strokeStyle = "#ffffff";
      ctx.stroke();
    });
  }

  function buildPalette() {
    const scheme = select.value;
    const def = HARMONY[scheme] || HARMONY.complementary;
    const hues = harmonyHues(baseHue, scheme);
    palette.innerHTML = "";
    hues.forEach((hue, i) => {
      const hex = hsvToHex(hue, sat, val);
      const cell = document.createElement("div");
      cell.className = "pal-cell";
      cell.style.background = hex;
      const tag = document.createElement("span");
      tag.textContent = (i === 0 ? "主 " : "") + Math.round(hue) + "°";
      cell.appendChild(tag);
      palette.appendChild(cell);
    });
    if (nameOut) nameOut.textContent = def.name;
  }

  function redraw() {
    drawWheel();
    drawMarkers();
    buildPalette();
  }

  canvas.addEventListener("click", (e) => {
    const rect = canvas.getBoundingClientRect();
    const x = (e.clientX - rect.left) * (size / rect.width) - cx;
    const y = (e.clientY - rect.top) * (size / rect.height) - cy;
    let ang = Math.atan2(y, x) * 180 / Math.PI;
    baseHue = ((ang % 360) + 360) % 360;
    redraw();
  });
  select.addEventListener("change", redraw);
  redraw();
  return redraw;
}

/* ===== 0011: 冷暖 ===== */
/* warmth(hue): 暖峰在 ~30°(橙红),冷峰在 ~210°(青蓝)。返回 -1..1。 */
function warmth(hue) {
  hue = ((hue % 360) + 360) % 360;
  // 以 30° 为最暖、210° 为最冷的余弦曲线
  return Math.cos((hue - 30) * Math.PI / 180);
}

function wireWarmthSort(opts) {
  // opts: { leftId, rightId, fbId, hexA, hexB, hueA, hueB, onNext? }
  const left = document.getElementById(opts.leftId);
  const right = document.getElementById(opts.rightId);
  const fb = document.getElementById(opts.fbId);
  if (!left || !right) return;

  const wA = warmth(opts.hueA);
  const wB = warmth(opts.hueB);
  const warmerIsLeft = wA >= wB;

  left.style.background = opts.hexA;
  right.style.background = opts.hexB;

  let done = false;
  function pick(isLeft) {
    if (done) return;
    done = true;
    const right_ = isLeft === warmerIsLeft;
    [left, right].forEach((el) => (el.style.cursor = "default"));
    const winner = warmerIsLeft ? left : right;
    winner.classList.add("warm-correct");
    if (fb) {
      fb.className = "warmth-fb " + (right_ ? "correct" : "wrong");
      fb.textContent = (right_ ? "✓ 对了。" : "✗ 不对。") +
        " 偏暖的是" + (warmerIsLeft ? "左" : "右") + "边——它的 hue 更靠橙红一侧。冷暖是相对的:两块都是同一大类,仍分得出谁更暖。";
    }
  }
  left.addEventListener("click", () => pick(true));
  right.addEventListener("click", () => pick(false));
}

function wireDepthToggle(btnId, sceneId) {
  const btn = document.getElementById(btnId);
  const scene = document.getElementById(sceneId);
  if (!btn || !scene) return;
  let flat = false;
  const labelOn = btn.dataset.on || "回到 暖前冷后";
  const labelOff = btn.dataset.off || btn.textContent;
  btn.addEventListener("click", () => {
    flat = !flat;
    scene.classList.toggle("is-flat", flat);
    btn.classList.toggle("active", flat);
    btn.textContent = flat ? labelOn : labelOff;
  });
}
