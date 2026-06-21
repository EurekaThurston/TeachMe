/* light-tools.js — interactive helpers for 美术基础-for-VFX 模块 B(光与影)
 * 课程 0005–0008。零外部依赖,纯 DOM / SVG / canvas。
 *
 * 本文件归「光影」四课所有,避免与 value-tools.js / vx-tools.js 冲突。
 *
 * 暴露的 helper:
 *   wireInverseSquare(opts)     0005 — 平方反比衰减:距离滑块 → 亮度 1/d²
 *   wireLightDirection(opts)    0005/0006 — 光方向滑块 → 球体明暗分布(CSS 径向光)
 *   wireFormHotspots(opts)      0006 — hover SVG 球体受光分区,高亮 + 显示名称/作用
 *   wireEdgeHardness(opts)      0006 — 硬边↔软边滑块作用在 blob 上(模糊 + 对比)
 *   wireHdrGlow(opts)           0007 — HDR 强度滑块 → 火球去饱和趋白 + bloom 变大
 *   wireBlendBackground(opts)   0007 — additive↔alpha 切换 + 亮/暗背景切换
 *   wireColorTemp(opts)         0008 — 暖光↔冷光滑块 → 亮面变光色、暗面取互补色
 */

/* ============================================================
 * 0005 — 平方反比衰减 inverse-square
 * 距离 d(以参考距离为 1)时,相对亮度 = 1 / d²。
 * opts = { sliderId, orbId, distLabelId, brightLabelId, fxId }
 * ============================================================ */
function wireInverseSquare(opts) {
  const slider = document.getElementById(opts.sliderId);
  const orb = document.getElementById(opts.orbId);
  const distLabel = opts.distLabelId ? document.getElementById(opts.distLabelId) : null;
  const brightLabel = opts.brightLabelId ? document.getElementById(opts.brightLabelId) : null;
  if (!slider || !orb) return;

  function apply() {
    // 滑块 100..400 代表距离百分比 → d = 1.0 .. 4.0
    const d = parseInt(slider.value, 10) / 100;
    const bright = 1 / (d * d);                 // 1/d²
    // 视觉:亮度映射到 opacity + scale + 实际发光半径
    const vis = Math.max(0.02, Math.min(1, bright));
    orb.style.opacity = (0.08 + 0.92 * vis).toFixed(3);
    const glow = (8 + 60 * vis).toFixed(1);
    const core = (4 + 26 * vis).toFixed(1);
    orb.style.boxShadow =
      "0 0 " + glow + "px " + core + "px rgba(255,210,120," + (0.25 + 0.7 * vis).toFixed(3) + ")";
    orb.style.background =
      "radial-gradient(circle, #fff6c0 0%, rgba(255,178,58," + (0.4 + 0.6 * vis).toFixed(3) +
      ") 45%, rgba(255,138,42,0) 72%)";
    if (distLabel) distLabel.textContent = d.toFixed(2);
    if (brightLabel) {
      // 显示成易读的分数感:1.00、0.25、0.11…
      brightLabel.textContent = (bright >= 1 ? bright.toFixed(2) : bright.toFixed(3));
    }
  }
  slider.addEventListener("input", apply);
  apply();
}

/* ============================================================
 * 0005 / 0006 — 光方向 → 球体明暗
 * 用 CSS radial-gradient 把高光点放到方向角,模拟一个受光球。
 * opts = { sliderId, sphereId, angleLabelId }
 * 滑块 0..360 = 光来自的方位角(0=右,90=上 …)。
 * ============================================================ */
function wireLightDirection(opts) {
  const slider = document.getElementById(opts.sliderId);
  const sphere = document.getElementById(opts.sphereId);
  const angleLabel = opts.angleLabelId ? document.getElementById(opts.angleLabelId) : null;
  if (!slider || !sphere) return;

  function apply() {
    const deg = parseInt(slider.value, 10);
    const rad = (deg * Math.PI) / 180;
    // 高光位置:把光向投到球面上(屏幕坐标,y 向下)
    const hx = 50 + 34 * Math.cos(rad);
    const hy = 50 - 34 * Math.sin(rad);
    sphere.style.background =
      "radial-gradient(circle at " + hx.toFixed(1) + "% " + hy.toFixed(1) + "%, " +
      "#ffffff 0%, #d8d2c4 14%, #9a948a 36%, #4c4843 64%, #211f1d 88%)";
    if (angleLabel) angleLabel.textContent = deg + "°";
  }
  slider.addEventListener("input", apply);
  apply();
}

/* ============================================================
 * 0006 — 受光分区 hotspots
 * SVG 上若干 <g data-zone="…"> 区域;hover 高亮 + 在面板里显示名称/作用。
 * opts = { svgId, infoTitleId, infoBodyId, zones }
 *   zones = { key: { name, body } }
 * SVG 里每个可交互元素带 class="zone" data-zone="key"。
 * ============================================================ */
function wireFormHotspots(opts) {
  const svg = document.getElementById(opts.svgId);
  const title = document.getElementById(opts.infoTitleId);
  const body = document.getElementById(opts.infoBodyId);
  if (!svg || !title || !body) return;
  const zones = opts.zones || {};
  const nodes = svg.querySelectorAll(".zone");

  function show(key) {
    const z = zones[key];
    if (!z) return;
    title.textContent = z.name;
    body.innerHTML = z.body;
    nodes.forEach((n) => n.classList.toggle("zone-active", n.dataset.zone === key));
  }
  nodes.forEach((n) => {
    n.addEventListener("mouseenter", () => show(n.dataset.zone));
    n.addEventListener("click", () => show(n.dataset.zone));
    // 可达性:键盘聚焦也触发
    n.addEventListener("focus", () => show(n.dataset.zone));
    n.setAttribute("tabindex", "0");
  });
}

/* ============================================================
 * 0006 — 硬边↔软边 edge hardness
 * 滑块 0(硬)..100(软)作用在一个 blob:0=锐利转折,100=柔和渐变。
 * opts = { sliderId, blobId, labelId }
 * ============================================================ */
function wireEdgeHardness(opts) {
  const slider = document.getElementById(opts.sliderId);
  const blob = document.getElementById(opts.blobId);
  const label = opts.labelId ? document.getElementById(opts.labelId) : null;
  if (!slider || !blob) return;

  function apply() {
    const soft = parseInt(slider.value, 10) / 100; // 0 硬 .. 1 软
    // 硬边:渐变收口靠近边缘 + 几乎无模糊;软边:渐变铺满 + 模糊
    const inner = (78 - 56 * soft).toFixed(0);     // 实心核心半径百分比
    const blur = (0.3 + 9 * soft).toFixed(2);
    blob.style.background =
      "radial-gradient(circle at 42% 38%, #fff3cf 0%, #ffb83a " + inner + "%, rgba(255,150,40,0) 100%)";
    blob.style.filter = "blur(" + blur + "px)";
    if (label) {
      label.textContent = soft < 0.34 ? "硬边(锐利 / 能量)" :
                          soft > 0.66 ? "软边(柔和 / 烟雾)" : "软硬混合";
    }
  }
  slider.addEventListener("input", apply);
  apply();
}

/* ============================================================
 * 0007 — HDR 强度 → 火球去饱和趋白 + bloom
 * 滑块 100..600 = emissive 强度 ×1.0 .. ×6.0(>100 即 HDR > 1)。
 * 强度越高:核心越白(去饱和)、bloom 光晕越大。
 * opts = { sliderId, orbId, intLabelId, satLabelId }
 * ============================================================ */
function wireHdrGlow(opts) {
  const slider = document.getElementById(opts.sliderId);
  const orb = document.getElementById(opts.orbId);
  const intLabel = opts.intLabelId ? document.getElementById(opts.intLabelId) : null;
  const satLabel = opts.satLabelId ? document.getElementById(opts.satLabelId) : null;
  if (!slider || !orb) return;

  function apply() {
    const x = parseInt(slider.value, 10) / 100;        // 1.0 .. 6.0
    const k = (x - 1) / 5;                              // 0 .. 1 归一
    // 核心色:低强度=橙红(饱和),高强度→白(去饱和、value clipping)
    const coreR = 255;
    const coreG = Math.round(150 + 105 * k);            // 150 → 255
    const coreB = Math.round(40 + 215 * k);             // 40  → 255
    const core = "rgb(" + coreR + "," + coreG + "," + coreB + ")";
    const mid = "rgba(255," + Math.round(120 + 70 * k) + ",40," + (0.85).toFixed(2) + ")";
    orb.style.background =
      "radial-gradient(circle, " + core + " 0%, " + core + " " + (10 + 22 * k).toFixed(0) + "%, " +
      mid + " " + (40 + 18 * k).toFixed(0) + "%, rgba(200,70,20,0) 74%)";
    // bloom:随强度变大变亮的外发光
    const glow = (6 + 70 * k).toFixed(0);
    const spread = (2 + 30 * k).toFixed(0);
    orb.style.boxShadow =
      "0 0 " + glow + "px " + spread + "px rgba(255," + Math.round(170 + 80 * k) + ",90," +
      (0.35 + 0.5 * k).toFixed(2) + ")";
    if (intLabel) intLabel.textContent = "×" + x.toFixed(1);
    if (satLabel) {
      satLabel.textContent = k < 0.25 ? "核心饱和橙红(无热度)" :
                             k > 0.7 ? "核心白热 white-hot(高温感)" : "核心向白去饱和中";
    }
  }
  slider.addEventListener("input", apply);
  apply();
}

/* ============================================================
 * 0007 — additive↔alpha + 亮/暗背景
 * 用 mix-blend-mode 模拟叠加(screen)对比 普通(normal)。
 * 演示 additive 在亮背景前消失。
 * opts = { blendBtnId, bgBtnId, sceneId, fxId, blendLabelId, bgLabelId }
 * ============================================================ */
function wireBlendBackground(opts) {
  const blendBtn = document.getElementById(opts.blendBtnId);
  const bgBtn = document.getElementById(opts.bgBtnId);
  const scene = document.getElementById(opts.sceneId);
  const fx = document.getElementById(opts.fxId);
  const blendLabel = opts.blendLabelId ? document.getElementById(opts.blendLabelId) : null;
  const bgLabel = opts.bgLabelId ? document.getElementById(opts.bgLabelId) : null;
  if (!blendBtn || !bgBtn || !scene || !fx) return;

  let additive = true;   // true = 叠加 screen, false = alpha normal
  let darkBg = true;      // true = 暗背景, false = 亮背景

  function apply() {
    // 叠加:screen 混合 + 纯发光色(无暗部);alpha:normal + 带暗部实体感
    if (additive) {
      fx.style.mixBlendMode = "screen";
      fx.style.background =
        "radial-gradient(circle, #fff7d0 0%, #ffd24a 40%, #ff7a1e 66%, rgba(255,122,30,0) 80%)";
    } else {
      fx.style.mixBlendMode = "normal";
      fx.style.background =
        "radial-gradient(circle, #fff7d0 0%, #ffb23a 34%, #b85a18 62%, #2a1206 82%, rgba(20,10,4,0) 92%)";
    }
    scene.style.background = darkBg
      ? "linear-gradient(160deg,#23262e 0%,#1a1c22 60%,#141519 100%)"
      : "linear-gradient(160deg,#e9e4d6 0%,#ddd6c4 60%,#cfc7b2 100%)";
    if (blendLabel) blendLabel.textContent = additive ? "Additive(叠加 / screen)" : "Alpha(普通 / 有暗部)";
    if (bgLabel) bgLabel.textContent = darkBg ? "暗背景" : "亮背景";
    blendBtn.classList.toggle("active", additive);
    bgBtn.classList.toggle("active", !darkBg);
  }
  blendBtn.addEventListener("click", () => { additive = !additive; apply(); });
  bgBtn.addEventListener("click", () => { darkBg = !darkBg; apply(); });
  apply();
}

/* ============================================================
 * 0008 — 色温:暖光↔冷光 → 亮面光色 / 暗面互补色
 * 滑块 0(冷蓝)..100(暖橙)。亮面取光色,暗面自动取互补色温。
 * opts = { sliderId, sphereId, groundId, lightLabelId, shadowLabelId }
 * ============================================================ */
function wireColorTemp(opts) {
  const slider = document.getElementById(opts.sliderId);
  const sphere = document.getElementById(opts.sphereId);
  const ground = opts.groundId ? document.getElementById(opts.groundId) : null;
  const lightLabel = opts.lightLabelId ? document.getElementById(opts.lightLabelId) : null;
  const shadowLabel = opts.shadowLabelId ? document.getElementById(opts.shadowLabelId) : null;
  if (!slider || !sphere) return;

  // 在冷蓝 → 中性 → 暖橙之间插值
  function lightColor(t) {
    // t: 0 冷 .. 1 暖
    const r = Math.round(150 + 105 * t);     // 150 → 255
    const g = Math.round(190 + 35 * t);      // 190 → 225
    const b = Math.round(255 - 145 * t);     // 255 → 110
    return [r, g, b];
  }
  function shadowColor(t) {
    // 暗面取互补色温:暖光(t→1)给冷影,冷光(t→0)给暖影
    const s = 1 - t;
    const r = Math.round(34 + 36 * (1 - s));  // 冷影更蓝 → 暖影偏红
    const g = Math.round(38 + 18 * (1 - s));
    const b = Math.round(40 + 60 * s);        // 冷影 b 高
    return [r, g, b];
  }
  function rgb(a) { return "rgb(" + a[0] + "," + a[1] + "," + a[2] + ")"; }

  function apply() {
    const t = parseInt(slider.value, 10) / 100;
    const lit = lightColor(t);
    const sh = shadowColor(t);
    // 球面:亮面=光色,过渡到暗面=互补色温(而非死黑)
    sphere.style.background =
      "radial-gradient(circle at 36% 32%, " +
      "rgb(" + Math.min(255, lit[0] + 40) + "," + Math.min(255, lit[1] + 30) + "," + Math.min(255, lit[2] + 30) + ") 0%, " +
      rgb(lit) + " 26%, " +
      "rgb(" + Math.round((lit[0] + sh[0]) / 2) + "," + Math.round((lit[1] + sh[1]) / 2) + "," + Math.round((lit[2] + sh[2]) / 2) + ") 58%, " +
      rgb(sh) + " 92%)";
    if (ground) {
      // 地面接收光色 + 投影偏互补
      ground.style.background =
        "linear-gradient(180deg, rgb(" + Math.round(lit[0] * 0.5) + "," + Math.round(lit[1] * 0.5) + "," + Math.round(lit[2] * 0.5) + ") 0%, " +
        rgb(sh) + " 100%)";
    }
    if (lightLabel) lightLabel.textContent = t > 0.6 ? "暖光(暖橙)" : t < 0.4 ? "冷光(冷蓝)" : "中性光";
    if (shadowLabel) shadowLabel.textContent = t > 0.6 ? "→ 冷影(偏蓝)" : t < 0.4 ? "→ 暖影(偏橙)" : "→ 中性影";
  }
  slider.addEventListener("input", apply);
  apply();
}
