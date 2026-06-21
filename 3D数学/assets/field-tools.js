/* Scalar/color field renderer for the 3D-数学 module 4 (shader math).
 * Renders a per-pixel function to canvas, just like a fragment shader but in JS.
 *
 * --- renderField(canvasId, fn, opts) ---
 *   fn(u, v, U) → number in [0,1] (grayscale) OR [r,g,b] each in [0,1].
 *     u,v are coordinates; domain set by opts.domain:
 *       "unit"   → u,v ∈ [0,1]   (UV space, default)
 *       "center" → u,v ∈ [-1,1]  (centered, good for SDF/polar)
 *   U is a uniforms object you pass to draw() (e.g. {time, scale}).
 *   opts.res: pixel step (default 2 → render at half res for speed).
 *   opts.width/height (CSS px, default 300x300).
 * Returns { draw(U) }. Call draw({...}) to re-render (e.g. in a RAF loop).
 */
function renderField(canvasId, fn, opts){
  const cv = document.getElementById(canvasId);
  if(!cv) return { draw:function(){} };
  const o = opts || {};
  const W = o.width || 300, H = o.height || 300;
  const res = o.res || 2;
  const centered = o.domain === "center";
  const DPR = 1; // field is already pixel work; keep 1:1 for speed
  cv.style.maxWidth = W + "px"; cv.width = W; cv.height = H; cv.style.aspectRatio = W+" / "+H;
  const g = cv.getContext("2d");
  const img = g.createImageData(W, H);
  const data = img.data;

  function draw(U){
    U = U || {};
    for(let py=0; py<H; py+=res){
      for(let px=0; px<W; px+=res){
        let u = px / W, v = 1 - py / H;          // v up
        if(centered){ u = u*2-1; v = v*2-1; }
        let r,gr,b;
        const out = fn(u, v, U);
        if(Array.isArray(out)){ r=out[0]; gr=out[1]; b=out[2]; }
        else { r=gr=b=out; }
        r = Math.max(0,Math.min(1,r))*255; gr = Math.max(0,Math.min(1,gr))*255; b = Math.max(0,Math.min(1,b))*255;
        for(let dy=0; dy<res && py+dy<H; dy++){
          for(let dx=0; dx<res && px+dx<W; dx++){
            const idx = ((py+dy)*W + (px+dx))*4;
            data[idx]=r; data[idx+1]=gr; data[idx+2]=b; data[idx+3]=255;
          }
        }
      }
    }
    g.putImageData(img, 0, 0);
  }
  draw(o.uniforms || {});
  return { draw };
}

/* tiny helpers mirroring HLSL intrinsics, for use inside field functions */
const FX = {
  frac: function(x){ return x - Math.floor(x); },
  clamp: function(x,a,b){ return Math.max(a, Math.min(b, x)); },
  sat: function(x){ return Math.max(0, Math.min(1, x)); },
  lerp: function(a,b,t){ return a + (b-a)*t; },
  smoothstep: function(a,b,x){ let t = Math.max(0, Math.min(1, (x-a)/(b-a))); return t*t*(3-2*t); },
  length: function(x,y){ return Math.hypot(x,y); },
  // cheap deterministic hash → [0,1)
  hash: function(x,y){ let h = Math.sin(x*127.1 + y*311.7) * 43758.5453; return h - Math.floor(h); },
  // value noise on a grid with smooth interpolation
  vnoise: function(x,y){
    const xi=Math.floor(x), yi=Math.floor(y), xf=x-xi, yf=y-yi;
    const u=xf*xf*(3-2*xf), v=yf*yf*(3-2*yf);
    const a=FX.hash(xi,yi), b=FX.hash(xi+1,yi), c=FX.hash(xi,yi+1), d=FX.hash(xi+1,yi+1);
    return FX.lerp(FX.lerp(a,b,u), FX.lerp(c,d,u), v);
  }
};

/* wire a single range slider to re-render a field with a uniform */
function wireFieldSlider(field, opts){
  const slider = document.getElementById(opts.sliderId);
  const out = opts.outId ? document.getElementById(opts.outId) : null;
  function f(){
    const val = (+slider.value) * (opts.scale || 1) + (opts.offset || 0);
    const U = {}; U[opts.uniform] = val;
    if(opts.extra) Object.assign(U, opts.extra);
    field.draw(U);
    if(out) out.textContent = (Math.round(val*100)/100);
  }
  slider.addEventListener("input", f); f();
  return f;
}
