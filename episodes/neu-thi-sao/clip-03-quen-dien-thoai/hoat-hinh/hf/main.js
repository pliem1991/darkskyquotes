(function () {
  const D = window.DATA, L = D.lines, S = window.SCENES;
  const clamp = (x, a, b) => Math.max(a, Math.min(b, x));
  const backOut = (x) => { x = clamp(x, 0, 1); const c = 1.8; return 1 + (c + 1) * Math.pow(x - 1, 3) + c * Math.pow(x - 1, 2); };
  const CARDS = [null, "7:00", null, "8:30", "12:00", "15:00", "20:00"];
  const $ = (id) => document.getElementById(id);
  S.forEach((sc, i) => {
    const el = $("sc" + i);
    sc.build(el);
    if (CARDS[i]) { const d = document.createElement("div"); d.className = "tcard"; d.id = "tc" + i; d.textContent = CARDS[i]; el.appendChild(d); }
  });
  const subEl = $("sub"), hook = $("hook"), wash = $("endwash"), endc = $("endcard");
  let lastSub = null;
  function draw(t) {
    S.forEach((sc, i) => {
      const a = L[i].s - 0.6, b = (i < 6 ? L[i + 1].s + 0.1 : D.dur);
      if (t >= a && t <= b) sc.update(t);
      const tc = $("tc" + i);
      if (tc) { const k = backOut((t - (L[i].s - 0.1)) / 0.35); tc.style.transform = "scale(" + Math.max(0.001, k).toFixed(3) + ")"; }
    });
    const hk = t < L[0].e + 0.1 ? 1 : clamp(1 - (t - L[0].e - 0.1) / 0.25, 0, 1);
    hook.style.opacity = hk; hook.style.display = hk <= 0 ? "none" : "block";
    let txt = null, ts = 0;
    for (let i = 1; i < L.length; i++) L[i].parts.forEach((p, j) => {
      const nxt = L[i].parts[j + 1];
      const end = nxt ? nxt.s - 0.02 : p.e + 0.25;
      if (t >= p.s - 0.03 && t < end) { txt = p.t.replace(/[,.]/g, "").trim(); ts = p.s; }
    });
    if (txt !== lastSub) { subEl.textContent = txt || ""; lastSub = txt; }
    subEl.style.display = txt ? "block" : "none";
    if (txt) subEl.style.transform = "scale(" + (0.9 + 0.1 * clamp((t - ts + 0.03) / 0.15, 0, 1)).toFixed(3) + ")";
    const te = D.endT;
    const w = clamp((t - te) / 0.4, 0, 1);
    wash.style.opacity = (0.62 * w).toFixed(3);
    endc.style.display = t >= te ? "block" : "none";
    endc.style.transform = "translate(-50%,-50%) scale(" + Math.max(0.001, backOut((t - te) / 0.45)).toFixed(3) + ")";
    if (t >= te) subEl.style.display = "none";
  }
  window.__draw = draw;
  const tl = gsap.timeline({ paused: true });
  for (let i = 1; i < S.length; i++) {
    const t0 = L[i].s - 0.45;
    tl.fromTo("#sc" + i, { x: 1080 }, { x: 0, duration: 0.35, ease: "power3.out" }, t0);
    tl.fromTo("#sc" + (i - 1), { x: 0 }, { x: -200, duration: 0.35, ease: "power3.in", immediateRender: false }, t0);
  }
  const drv = { _t: 0, get t() { return this._t; }, set t(v) { this._t = v; draw(v); } };
  tl.fromTo(drv, { t: 0 }, { t: D.dur, duration: D.dur, ease: "none" }, 0);
  window.__timelines = window.__timelines || {};
  window.__timelines["main"] = tl;
  draw(0);
})();
