/* Reusable interactive math widgets for the 3D-数学 course.
 * Pure canvas, no deps. Math convention: y points UP (like textbooks/shaders),
 * origin at canvas center. Drag a vector's tip to change it.
 *
 * --- VecPlayground(canvasId, opts) ---
 *   opts.vectors: [{name, x, y, color, draggable}]   // first two are a,b for readouts
 *   opts.unit:    px per unit (default 38)
 *   opts.snap:    snap dragged tips to integers (default true)
 *   opts.show:    array of readouts: "len","sum","dot","cross","angle","proj","unit"
 *   opts.readoutId: id of a .readout div to fill
 *   opts.onUpdate(vectors): optional callback
 * Returns an object with .vectors and .redraw().
 *
 * --- UnitCircle(canvasId, opts) ---
 *   opts.angleId / opts.readoutId: slider + readout. Shows sin/cos as coords.
 *
 * --- wireLerp(opts) ---  t-slider that lerps a number/point and reports it.
 */

function _fmt(n) { return (Math.round(n * 100) / 100).toFixed(2); }

function VecPlayground(canvasId, opts) {
  const cv = document.getElementById(canvasId);
  if (!cv) return;
  const o = opts || {};
  const unit = o.unit || 38;
  const snap = o.snap !== false;
  const show = o.show || ["len", "dot", "cross", "angle"];
  const readout = o.readoutId ? document.getElementById(o.readoutId) : null;
  const vectors = (o.vectors || []).map(v => Object.assign({ color: "#3a55b4", draggable: false }, v));

  const DPR = window.devicePixelRatio || 1;
  const W = o.width || 460, H = o.height || 340;
  cv.style.maxWidth = W + "px";
  cv.width = W * DPR; cv.height = H * DPR;
  cv.style.aspectRatio = W + " / " + H;
  const g = cv.getContext("2d");
  g.scale(DPR, DPR);
  const cx = W / 2, cy = H / 2;

  function toPx(v) { return { x: cx + v.x * unit, y: cy - v.y * unit }; }
  function toMath(px, py) { return { x: (px - cx) / unit, y: (cy - py) / unit }; }

  function arrow(from, to, color, width) {
    g.strokeStyle = color; g.fillStyle = color; g.lineWidth = width || 2.5;
    g.beginPath(); g.moveTo(from.x, from.y); g.lineTo(to.x, to.y); g.stroke();
    const a = Math.atan2(to.y - from.y, to.x - from.x), h = 9;
    g.beginPath();
    g.moveTo(to.x, to.y);
    g.lineTo(to.x - h * Math.cos(a - 0.4), to.y - h * Math.sin(a - 0.4));
    g.lineTo(to.x - h * Math.cos(a + 0.4), to.y - h * Math.sin(a + 0.4));
    g.closePath(); g.fill();
  }

  function redraw() {
    g.clearRect(0, 0, W, H);
    // grid
    g.strokeStyle = "#e7e6df"; g.lineWidth = 1;
    for (let x = cx % unit; x < W; x += unit) { g.beginPath(); g.moveTo(x, 0); g.lineTo(x, H); g.stroke(); }
    for (let y = cy % unit; y < H; y += unit) { g.beginPath(); g.moveTo(0, y); g.lineTo(W, y); g.stroke(); }
    // axes
    g.strokeStyle = "#b9b8b0"; g.lineWidth = 1.5;
    g.beginPath(); g.moveTo(0, cy); g.lineTo(W, cy); g.stroke();
    g.beginPath(); g.moveTo(cx, 0); g.lineTo(cx, H); g.stroke();

    const a = vectors[0], b = vectors[1];
    // optional sum parallelogram
    if (show.includes("sum") && a && b) {
      const sum = { x: a.x + b.x, y: a.y + b.y };
      g.setLineDash([4, 4]); g.lineWidth = 1.5;
      arrow(toPx(a), toPx(sum), b.color + "88", 1.5);
      arrow(toPx(b), toPx(sum), a.color + "88", 1.5);
      g.setLineDash([]);
      arrow({ x: cx, y: cy }, toPx(sum), "#16181d", 3);
      g.fillStyle = "#16181d"; g.font = "13px monospace";
      const sp = toPx(sum); g.fillText("a+b (" + _fmt(sum.x) + "," + _fmt(sum.y) + ")", sp.x + 6, sp.y - 6);
    }
    // optional projection of a onto b
    if (show.includes("proj") && a && b) {
      const bb = b.x * b.x + b.y * b.y;
      if (bb > 0.0001) {
        const k = (a.x * b.x + a.y * b.y) / bb;
        const p = { x: b.x * k, y: b.y * k };
        g.setLineDash([3, 3]);
        arrow({ x: cx, y: cy }, toPx(p), "#c0712a", 2);
        g.strokeStyle = "#999"; g.beginPath();
        g.moveTo(toPx(a).x, toPx(a).y); g.lineTo(toPx(p).x, toPx(p).y); g.stroke();
        g.setLineDash([]);
      }
    }
    // vectors
    vectors.forEach(v => {
      arrow({ x: cx, y: cy }, toPx(v), v.color, 3);
      const tp = toPx(v);
      g.fillStyle = v.color;
      if (v.draggable) { g.beginPath(); g.arc(tp.x, tp.y, 6, 0, 7); g.fill(); g.fillStyle = "#fff"; g.beginPath(); g.arc(tp.x, tp.y, 2.5, 0, 7); g.fill(); g.fillStyle = v.color; }
      g.font = "bold 14px monospace";
      g.fillText(v.name + " (" + _fmt(v.x) + "," + _fmt(v.y) + ")", tp.x + 9, tp.y - 8);
    });

    if (readout) {
      const lines = [];
      if (a) { if (show.includes("len")) lines.push("|" + a.name + "| = √(" + _fmt(a.x) + "² + " + _fmt(a.y) + "²) = <b>" + _fmt(Math.hypot(a.x, a.y)) + "</b>"); }
      if (a && b) {
        if (show.includes("dot")) { const d = a.x * b.x + a.y * b.y; lines.push(a.name + " · " + b.name + " = " + _fmt(a.x) + "×" + _fmt(b.x) + " + " + _fmt(a.y) + "×" + _fmt(b.y) + " = <b>" + _fmt(d) + "</b>"); }
        if (show.includes("cross")) { const c = a.x * b.y - a.y * b.x; lines.push(a.name + " × " + b.name + " (z) = " + _fmt(a.x) + "×" + _fmt(b.y) + " − " + _fmt(a.y) + "×" + _fmt(b.x) + " = <b>" + _fmt(c) + "</b>"); }
        if (show.includes("angle")) {
          const la = Math.hypot(a.x, a.y), lb = Math.hypot(b.x, b.y);
          if (la > 0.001 && lb > 0.001) { let cs = (a.x * b.x + a.y * b.y) / (la * lb); cs = Math.max(-1, Math.min(1, cs)); lines.push("夹角 θ = acos(a·b / (|a||b|)) = <b>" + _fmt(Math.acos(cs) * 180 / Math.PI) + "°</b>"); }
        }
      }
      if (a && show.includes("unit")) { const l = Math.hypot(a.x, a.y) || 1; lines.push("normalize(" + a.name + ") = (" + _fmt(a.x / l) + ", " + _fmt(a.y / l) + ")  长度=<b>1</b>"); }
      readout.innerHTML = lines.join("<br>");
    }
    if (o.onUpdate) o.onUpdate(vectors);
  }

  // dragging
  let drag = null;
  function pick(mx, my) {
    for (let i = 0; i < vectors.length; i++) {
      if (!vectors[i].draggable) continue;
      const p = toPx(vectors[i]);
      if (Math.hypot(mx - p.x, my - p.y) < 16) return i;
    }
    return null;
  }
  function evtPos(e) {
    const r = cv.getBoundingClientRect();
    const t = e.touches ? e.touches[0] : e;
    return { x: (t.clientX - r.left) * (W / r.width), y: (t.clientY - r.top) * (H / r.height) };
  }
  function down(e) { const p = evtPos(e); drag = pick(p.x, p.y); if (drag !== null) e.preventDefault(); }
  function move(e) {
    if (drag === null) return;
    e.preventDefault();
    const p = evtPos(e); let m = toMath(p.x, p.y);
    if (snap) { m.x = Math.round(m.x); m.y = Math.round(m.y); }
    vectors[drag].x = m.x; vectors[drag].y = m.y; redraw();
  }
  function up() { drag = null; }
  cv.addEventListener("mousedown", down); window.addEventListener("mousemove", move); window.addEventListener("mouseup", up);
  cv.addEventListener("touchstart", down, { passive: false }); cv.addEventListener("touchmove", move, { passive: false }); cv.addEventListener("touchend", up);

  redraw();
  return { vectors, redraw };
}

function UnitCircle(canvasId, opts) {
  const cv = document.getElementById(canvasId);
  if (!cv) return;
  const o = opts || {};
  const slider = document.getElementById(o.angleId);
  const readout = o.readoutId ? document.getElementById(o.readoutId) : null;
  const DPR = window.devicePixelRatio || 1;
  const W = o.width || 340, H = o.height || 340;
  cv.style.maxWidth = W + "px";
  cv.width = W * DPR; cv.height = H * DPR; cv.style.aspectRatio = W + " / " + H;
  const g = cv.getContext("2d"); g.scale(DPR, DPR);
  const cx = W / 2, cy = H / 2, R = Math.min(W, H) * 0.38;

  function draw() {
    const deg = slider ? +slider.value : 45;
    const a = deg * Math.PI / 180;
    g.clearRect(0, 0, W, H);
    g.strokeStyle = "#b9b8b0"; g.lineWidth = 1.5;
    g.beginPath(); g.moveTo(0, cy); g.lineTo(W, cy); g.stroke();
    g.beginPath(); g.moveTo(cx, 0); g.lineTo(cx, H); g.stroke();
    g.strokeStyle = "#3a55b4"; g.lineWidth = 2; g.beginPath(); g.arc(cx, cy, R, 0, 7); g.stroke();
    const px = cx + Math.cos(a) * R, py = cy - Math.sin(a) * R;
    // cos (horizontal) and sin (vertical) legs
    g.strokeStyle = "#c0392b"; g.lineWidth = 3; g.beginPath(); g.moveTo(cx, cy); g.lineTo(px, cy); g.stroke();
    g.strokeStyle = "#2e7d32"; g.beginPath(); g.moveTo(px, cy); g.lineTo(px, py); g.stroke();
    g.strokeStyle = "#16181d"; g.lineWidth = 2.5; g.beginPath(); g.moveTo(cx, cy); g.lineTo(px, py); g.stroke();
    g.fillStyle = "#16181d"; g.beginPath(); g.arc(px, py, 5, 0, 7); g.fill();
    g.font = "12px monospace";
    g.fillStyle = "#c0392b"; g.fillText("cos", (cx + px) / 2 - 10, cy + 16);
    g.fillStyle = "#2e7d32"; g.fillText("sin", px + 6, (cy + py) / 2);
    if (readout) readout.innerHTML = "角 = <b>" + deg + "°</b> = " + _fmt(a) + " rad &nbsp; | &nbsp; cos = <b style='color:#c0392b'>" + _fmt(Math.cos(a)) + "</b> (x) &nbsp; sin = <b style='color:#2e7d32'>" + _fmt(Math.sin(a)) + "</b> (y)";
  }
  if (slider) slider.addEventListener("input", draw);
  draw();
}

function wireLerp(opts) {
  const o = opts;
  const slider = document.getElementById(o.tId);
  const readout = document.getElementById(o.readoutId);
  function f() {
    const t = +slider.value / 100;
    const v = o.a + (o.b - o.a) * t;
    if (o.outId) document.getElementById(o.outId).textContent = _fmt(t);
    if (readout) readout.innerHTML = "lerp(" + o.a + ", " + o.b + ", <b>" + _fmt(t) + "</b>) = " + o.a + " + (" + o.b + "−" + o.a + ")×" + _fmt(t) + " = <b>" + _fmt(v) + "</b>";
    if (o.onUpdate) o.onUpdate(t, v);
  }
  slider.addEventListener("input", f); f();
}
