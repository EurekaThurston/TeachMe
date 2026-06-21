/* Matrix / transform visualizers for the 3D-数学 course.
 * Convention: y UP, origin at canvas center. A 2x2 matrix is given by its two
 * columns = the images of the basis vectors î (red) and ĵ (green).
 *
 * --- MatrixGrid(canvasId, opts) ---
 *   opts.i: {x,y}  image of basis î   (default {x:1,y:0})
 *   opts.j: {x,y}  image of basis ĵ   (default {x:0,y:1})
 *   opts.point: {x,y} a sample point drawn before(faint) & after(solid)
 *   opts.draggable: true → drag the tips of î and ĵ
 *   opts.unit: px per unit (default 34)
 *   opts.readoutId: fills a .readout with the matrix + where the point lands
 *   opts.onUpdate(i,j): callback
 * Returns { i, j, redraw, set(i,j) }.
 */
function _f2(n){ return (Math.round(n*100)/100).toFixed(2); }

function MatrixGrid(canvasId, opts){
  const cv = document.getElementById(canvasId);
  if(!cv) return;
  const o = opts || {};
  const unit = o.unit || 34;
  const i = Object.assign({x:1,y:0}, o.i);
  const j = Object.assign({x:0,y:1}, o.j);
  const pt = o.point ? Object.assign({}, o.point) : null;
  const readout = o.readoutId ? document.getElementById(o.readoutId) : null;
  const DPR = window.devicePixelRatio || 1;
  const W = o.width || 460, H = o.height || 360;
  cv.style.maxWidth = W + "px"; cv.width = W*DPR; cv.height = H*DPR; cv.style.aspectRatio = W+" / "+H;
  const g = cv.getContext("2d"); g.scale(DPR,DPR);
  const cx = W/2, cy = H/2;
  const N = 6; // lattice range

  function px(v){ return { x: cx + v.x*unit, y: cy - v.y*unit }; }
  function lin(a,b,s,t){ return { x: a.x*s + b.x*t, y: a.y*s + b.y*t }; } // s*a + t*b

  function arrow(from,to,color,w){
    g.strokeStyle=color; g.fillStyle=color; g.lineWidth=w||3;
    g.beginPath(); g.moveTo(from.x,from.y); g.lineTo(to.x,to.y); g.stroke();
    const a=Math.atan2(to.y-from.y,to.x-from.x), h=9;
    g.beginPath(); g.moveTo(to.x,to.y);
    g.lineTo(to.x-h*Math.cos(a-0.4), to.y-h*Math.sin(a-0.4));
    g.lineTo(to.x-h*Math.cos(a+0.4), to.y-h*Math.sin(a+0.4));
    g.closePath(); g.fill();
  }

  function redraw(){
    g.clearRect(0,0,W,H);
    // faint original grid
    g.strokeStyle="#ece9df"; g.lineWidth=1;
    for(let x=cx%unit;x<W;x+=unit){ g.beginPath(); g.moveTo(x,0); g.lineTo(x,H); g.stroke(); }
    for(let y=cy%unit;y<H;y+=unit){ g.beginPath(); g.moveTo(0,y); g.lineTo(W,y); g.stroke(); }
    // transformed grid (image of integer lattice under [i j])
    g.strokeStyle="#c9d2ef"; g.lineWidth=1.2;
    for(let n=-N;n<=N;n++){
      let p1=px(lin(i,j,n,-N)), p2=px(lin(i,j,n,N));
      g.beginPath(); g.moveTo(p1.x,p1.y); g.lineTo(p2.x,p2.y); g.stroke();
      p1=px(lin(i,j,-N,n)); p2=px(lin(i,j,N,n));
      g.beginPath(); g.moveTo(p1.x,p1.y); g.lineTo(p2.x,p2.y); g.stroke();
    }
    // origin axes
    g.strokeStyle="#b9b8b0"; g.lineWidth=1.5;
    g.beginPath(); g.moveTo(0,cy); g.lineTo(W,cy); g.stroke();
    g.beginPath(); g.moveTo(cx,0); g.lineTo(cx,H); g.stroke();
    // sample point before/after
    if(pt){
      const before = px(pt);
      g.fillStyle="#bbb"; g.beginPath(); g.arc(before.x,before.y,4,0,7); g.fill();
      const after = px(lin(i,j,pt.x,pt.y));
      g.setLineDash([3,3]); g.strokeStyle="#c0712a"; g.lineWidth=1.5;
      g.beginPath(); g.moveTo(before.x,before.y); g.lineTo(after.x,after.y); g.stroke(); g.setLineDash([]);
      g.fillStyle="#c0712a"; g.beginPath(); g.arc(after.x,after.y,5,0,7); g.fill();
    }
    // basis vectors
    const O={x:cx,y:cy};
    arrow(O, px(i), "#c0392b", 3);
    arrow(O, px(j), "#2e7d32", 3);
    if(o.draggable){
      [["#c0392b",i],["#2e7d32",j]].forEach(function(d){ const p=px(d[1]); g.fillStyle=d[0]; g.beginPath(); g.arc(p.x,p.y,6,0,7); g.fill(); g.fillStyle="#fff"; g.beginPath(); g.arc(p.x,p.y,2.5,0,7); g.fill(); });
    }
    g.font="bold 13px monospace";
    g.fillStyle="#c0392b"; g.fillText("î ("+_f2(i.x)+","+_f2(i.y)+")", px(i).x+8, px(i).y-6);
    g.fillStyle="#2e7d32"; g.fillText("ĵ ("+_f2(j.x)+","+_f2(j.y)+")", px(j).x+8, px(j).y-6);

    if(readout){
      let s = "矩阵 M = [ <b style='color:#c0392b'>"+_f2(i.x)+"</b> &nbsp;<b style='color:#2e7d32'>"+_f2(j.x)+"</b> ;&nbsp; <b style='color:#c0392b'>"+_f2(i.y)+"</b> &nbsp;<b style='color:#2e7d32'>"+_f2(j.y)+"</b> ]　(列=基向量的像)";
      const det = i.x*j.y - i.y*j.x;
      s += "<br>行列式 det = "+_f2(i.x)+"×"+_f2(j.y)+" − "+_f2(j.x)+"×"+_f2(i.y)+" = <b>"+_f2(det)+"</b>　(面积缩放"+(det<0?"，且翻面":"")+")";
      if(pt){ const ap=lin(i,j,pt.x,pt.y); s += "<br>点 ("+_f2(pt.x)+","+_f2(pt.y)+") → "+_f2(pt.x)+"·î + "+_f2(pt.y)+"·ĵ = (<b>"+_f2(ap.x)+"</b>, <b>"+_f2(ap.y)+"</b>)"; }
      readout.innerHTML = s;
    }
    if(o.onUpdate) o.onUpdate(i,j);
  }

  // dragging basis tips
  let drag=null;
  function evt(e){ const r=cv.getBoundingClientRect(); const t=e.touches?e.touches[0]:e; return { x:(t.clientX-r.left)*(W/r.width), y:(t.clientY-r.top)*(H/r.height) }; }
  function pick(m){ if(!o.draggable) return null; const pi=px(i),pj=px(j); if(Math.hypot(m.x-pi.x,m.y-pi.y)<16) return i; if(Math.hypot(m.x-pj.x,m.y-pj.y)<16) return j; return null; }
  function down(e){ drag=pick(evt(e)); if(drag) e.preventDefault(); }
  function move(e){ if(!drag) return; e.preventDefault(); const m=evt(e); let mx=(m.x-cx)/unit, my=(cy-m.y)/unit; if(o.snap!==false){ mx=Math.round(mx*2)/2; my=Math.round(my*2)/2; } drag.x=mx; drag.y=my; redraw(); }
  function up(){ drag=null; }
  cv.addEventListener("mousedown",down); window.addEventListener("mousemove",move); window.addEventListener("mouseup",up);
  cv.addEventListener("touchstart",down,{passive:false}); cv.addEventListener("touchmove",move,{passive:false}); cv.addEventListener("touchend",up);

  redraw();
  return { i, j, redraw, set:function(ni,nj){ Object.assign(i,ni); Object.assign(j,nj); redraw(); } };
}

/* --- Rotation2D(canvasId, opts) ---  a grid rotated by a slider angle (degrees).
 *   opts.angleId: range slider id (degrees); opts.readoutId; opts.point optional. */
function Rotation2D(canvasId, opts){
  const o = opts || {};
  const slider = document.getElementById(o.angleId);
  const grid = MatrixGrid(canvasId, { draggable:false, point:o.point, readoutId:o.readoutId, width:o.width, height:o.height });
  function apply(){
    const a = (slider? +slider.value : 30) * Math.PI/180;
    grid.set({ x:Math.cos(a), y:Math.sin(a) }, { x:-Math.sin(a), y:Math.cos(a) });
    if(o.degOutId) document.getElementById(o.degOutId).textContent = (slider?slider.value:30) + "°";
  }
  if(slider) slider.addEventListener("input", apply);
  apply();
}
