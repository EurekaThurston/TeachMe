/* Reusable interactive helpers for 美术基础-for-VFX lessons.
 *
 * wireDesaturateToggle(btnId, ...targetIds)
 *   Wires a button to toggle the `.desat` class (CSS grayscale) on one or more
 *   targets. This is the "去色 / squint test" — strip hue so only VALUE remains,
 *   which is what actually drives readability. Used across value & color lessons.
 *
 *   <button id="t" class="btn">去色看明度</button>
 *   <div id="sceneA"> ... </div>
 *   <script src="../assets/value-tools.js"></script>
 *   <script>wireDesaturateToggle("t", "sceneA");</script>
 */
function wireDesaturateToggle(btnId, ...targetIds) {
  const btn = document.getElementById(btnId);
  if (!btn) return;
  const targets = targetIds.map((id) => document.getElementById(id)).filter(Boolean);
  let on = false;
  const labelOn = btn.dataset.on || "回到彩色";
  const labelOff = btn.dataset.off || btn.textContent;
  btn.addEventListener("click", () => {
    on = !on;
    targets.forEach((t) => t.classList.toggle("desat", on));
    btn.classList.toggle("active", on);
    btn.textContent = on ? labelOn : labelOff;
  });
}

/* relativeLuminance(hex) -> 0..1
 * Perceptual value of a color (Rec.709). Lets a lesson PROVE two different hues
 * share the same value, or rank swatches by lightness. */
function relativeLuminance(hex) {
  const m = hex.replace("#", "");
  const r = parseInt(m.substring(0, 2), 16) / 255;
  const g = parseInt(m.substring(2, 4), 16) / 255;
  const b = parseInt(m.substring(4, 6), 16) / 255;
  const lin = (c) => (c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4));
  return 0.2126 * lin(r) + 0.7152 * lin(g) + 0.0722 * lin(b);
}
