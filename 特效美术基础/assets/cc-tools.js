/* cc-tools.js — interactive helpers for 美术基础-for-VFX 模块 C 色彩下半
 * 课程 0012(饱和度)/ 0013(色彩构成)/ 0014(gameplay 色彩语言).
 *
 * 零外部依赖,纯 DOM / CSS / SVG / canvas。
 * 本文件归色彩下半三课所有,避免与 value-tools.js / vx-tools.js / light-tools.js 冲突。
 *
 * 暴露的 helper:
 *   0012 — 饱和度
 *     wireGlobalSaturation(opts)   全局饱和度滑块作用在场景上(拉满=焦点反而不跳)
 *     wireFoilToggle(opts)         「降低周围饱和」开关:灰衬纯,焦点瞬间唱起来
 *
 *   0013 — 色彩构成
 *     wireAlbersDemo(opts)         Albers 相对性:同一色块放在两种底色上读感不同
 *     wireDominanceAccent(opts)    主色↔点缀面积比滑块:accent 面积越小越跳
 *
 *   0014 — gameplay 色彩语言
 *     wireColorBlindSim(opts)      色盲模拟切换 + 「补上 value/形状」开关
 */

/* ============================================================
 * 0012 — 全局饱和度
 * 滑块 0..200 = 全场景 saturate() 百分比。
 * 关键教学点:饱和度是「对比工具」。把全场拉满,焦点和环境一样饱和,
 * 相对最饱和处消失 → 焦点反而不跳。
 * opts = { sliderId, sceneId, labelId }
 * ============================================================ */
function wireGlobalSaturation(opts) {
  const slider = document.getElementById(opts.sliderId);
  const scene = document.getElementById(opts.sceneId);
  const label = opts.labelId ? document.getElementById(opts.labelId) : null;
  if (!slider || !scene) return;

  function apply() {
    const pct = parseInt(slider.value, 10);
    scene.style.filter = "saturate(" + (pct / 100).toFixed(2) + ")";
    if (label) {
      label.textContent = pct + "%" +
        (pct >= 170 ? "(满屏高饱和:焦点淹没在噪声里)" :
         pct <= 50 ? "(整体偏灰:有空间衬出焦点)" : "");
    }
  }
  slider.addEventListener("input", apply);
  apply();
}

/* ============================================================
 * 0012 — 「灰衬纯」foil 开关
 * on 时:给环境元素降饱和(.cc-env 加 .cc-desat-env),焦点(.cc-focus)不变。
 * 焦点是全场唯一的高饱和处 → 立刻「唱」起来。
 * opts = { btnId, sceneId }
 *   场景内:环境块 class="cc-env",焦点块 class="cc-focus"。
 * ============================================================ */
function wireFoilToggle(opts) {
  const btn = document.getElementById(opts.btnId);
  const scene = document.getElementById(opts.sceneId);
  if (!btn || !scene) return;
  const envs = scene.querySelectorAll(".cc-env");
  let on = false;
  const labelOn = btn.dataset.on || "↩ 还原:周围也饱和";
  const labelOff = btn.dataset.off || btn.textContent;
  btn.addEventListener("click", () => {
    on = !on;
    envs.forEach((e) => e.classList.toggle("cc-desat-env", on));
    btn.classList.toggle("active", on);
    btn.textContent = on ? labelOn : labelOff;
  });
}

/* ============================================================
 * 0013 — Albers 相对性
 * 同一个 hex 色块放在两块不同底色上,看上去像两种颜色。
 * 提供一个「揭示」按钮:把两块中心色拉到一起并排,证明其实同色。
 * opts = { revealBtnId, chipAId, chipBId, bridgeId }
 *   chipAId / chipBId: 两个中心色块(已用同一颜色)。
 *   bridgeId: 隐藏的桥接条,reveal 时显示,把两块中心色连起来。
 * ============================================================ */
function wireAlbersDemo(opts) {
  const btn = document.getElementById(opts.revealBtnId);
  const bridge = opts.bridgeId ? document.getElementById(opts.bridgeId) : null;
  if (!btn || !bridge) return;
  let on = false;
  const labelOn = btn.dataset.on || "↩ 收起:再看相对性";
  const labelOff = btn.dataset.off || btn.textContent;
  btn.addEventListener("click", () => {
    on = !on;
    bridge.style.opacity = on ? "1" : "0";
    btn.classList.toggle("active", on);
    btn.textContent = on ? labelOn : labelOff;
  });
}

/* ============================================================
 * 0013 — 主色↔点缀面积比
 * 滑块 4..40 = accent(点缀)占场景宽度的百分比。
 * accent 越小,越能承受高饱和而不乱,且越「跳」。
 * opts = { sliderId, accentId, labelId }
 *   accentId: 点缀色块(宽度随滑块变)。
 * ============================================================ */
function wireDominanceAccent(opts) {
  const slider = document.getElementById(opts.sliderId);
  const accent = document.getElementById(opts.accentId);
  const label = opts.labelId ? document.getElementById(opts.labelId) : null;
  if (!slider || !accent) return;

  function apply() {
    const pct = parseInt(slider.value, 10);
    accent.style.width = pct + "%";
    if (label) {
      label.textContent = "点缀 " + pct + "% · 主色 " + (100 - pct) + "%" +
        (pct <= 12 ? "(小面积 accent → 最跳、可高饱和)" :
         pct >= 34 ? "(面积过大 → 不再是点缀,开始打架)" : "");
    }
  }
  slider.addEventListener("input", apply);
  apply();
}

/* ============================================================
 * 0014 — 色盲模拟 + 形状/明度补强
 * 两个开关:
 *   simBtn: 给场景套 deuteranopia(红绿色盲)近似滤镜(SVG feColorMatrix)。
 *   fixBtn: 给元素加 .cc-coded(明度差 + 形状/图标),证明叠加编码后仍可读。
 * 需要页面里有一个 <svg> 滤镜 #cc-deuter(本函数会按需注入)。
 * opts = { simBtnId, fixBtnId, sceneId, simLabelId, fixLabelId }
 * ============================================================ */
function wireColorBlindSim(opts) {
  const simBtn = document.getElementById(opts.simBtnId);
  const fixBtn = opts.fixBtnId ? document.getElementById(opts.fixBtnId) : null;
  const scene = document.getElementById(opts.sceneId);
  const simLabel = opts.simLabelId ? document.getElementById(opts.simLabelId) : null;
  const fixLabel = opts.fixLabelId ? document.getElementById(opts.fixLabelId) : null;
  if (!simBtn || !scene) return;

  ensureDeuterFilter();

  let sim = false;
  let fix = false;

  function apply() {
    scene.style.filter = sim ? "url(#cc-deuter)" : "none";
    scene.classList.toggle("cc-coded", fix);
    simBtn.classList.toggle("active", sim);
    if (fixBtn) fixBtn.classList.toggle("active", fix);
    if (simLabel) simLabel.textContent = sim ? "红绿色盲模拟:开" : "正常色觉";
    if (fixLabel) fixLabel.textContent = fix ? "已叠加明度 + 形状" : "只靠 hue 编码";
  }
  simBtn.addEventListener("click", () => { sim = !sim; apply(); });
  if (fixBtn) fixBtn.addEventListener("click", () => { fix = !fix; apply(); });
  apply();
}

/* 注入一个 deuteranopia 近似的 SVG feColorMatrix 滤镜(若尚未存在)。
 * 矩阵为业界常用的 Machado/Vischeck 风格近似,仅作教学演示,非临床精确。 */
function ensureDeuterFilter() {
  if (document.getElementById("cc-deuter")) return;
  const ns = "http://www.w3.org/2000/svg";
  const svg = document.createElementNS(ns, "svg");
  svg.setAttribute("width", "0");
  svg.setAttribute("height", "0");
  svg.setAttribute("aria-hidden", "true");
  svg.style.position = "absolute";
  const filter = document.createElementNS(ns, "filter");
  filter.setAttribute("id", "cc-deuter");
  const cm = document.createElementNS(ns, "feColorMatrix");
  cm.setAttribute("type", "matrix");
  // deuteranopia 近似
  cm.setAttribute("values",
    "0.625 0.375 0 0 0 " +
    "0.70 0.30 0 0 0 " +
    "0 0.30 0.70 0 0 " +
    "0 0 0 1 0");
  filter.appendChild(cm);
  svg.appendChild(filter);
  document.body.appendChild(svg);
}
