/* Sáu cảnh clip 5: "Nếu hôm nay là ngày cuối ở công ty mà không ai biết". SVG + chuyển động tính theo t (giây). */
(function () {
  const D = window.DATA, L = D.lines, Ch = window.Char;
  const clamp = (x, a, b) => Math.max(a, Math.min(b, x));
  const lerp = (a, b, k) => a + (b - a) * k;
  const easeOut = (x) => 1 - Math.pow(1 - clamp(x, 0, 1), 3);
  const easeIn = (x) => Math.pow(clamp(x, 0, 1), 2);
  const backOut = (x) => { x = clamp(x, 0, 1); const c = 1.8; return 1 + (c + 1) * Math.pow(x - 1, 3) + c * Math.pow(x - 1, 2); };
  const M = (i, k) => { const sy = L[i].syl; const a = Math.min(Math.floor(k), sy.length - 1); const b = Math.min(a + 1, sy.length - 1); return sy[a].s + (sy[b].s - sy[a].s) * (k - Math.floor(k)); };
  const $ = (id) => document.getElementById(id);
  const tf = (id, s) => { const e = $(id); if (e) e.setAttribute("transform", s); };
  const op = (id, v) => { const e = $(id); if (e) e.setAttribute("opacity", v.toFixed(3)); };
  const show = (id, v) => { const e = $(id); if (e) e.style.display = v ? "" : "none"; };
  const SVG0 = '<svg width="1080" height="1920" viewBox="0 0 1080 1920" xmlns="http://www.w3.org/2000/svg" style="position:absolute;left:0;top:0">';
  const talkAt = (t) => { const f = t * 30; const i = Math.floor(f); const k = f - i; const a = D.env[i] || 0; const b = D.env[i + 1] || 0; const e = a + (b - a) * k; return clamp((e - 0.1) / 0.5, 0, 1); };
  function curExp(t, list) { let e = list[0][1]; for (const [tt, n] of list) if (t >= tt) e = n; return e; }
  function popScale(t, t0, d) { return t < t0 ? 0.001 : Math.max(0.001, backOut((t - t0) / (d || 0.35))); }

  function miniPerson(id, x, y, s, shirt, hair, skirt) {
    const sk = skirt || "";
    return `<g id="${id}" transform="translate(${x} ${y}) scale(${s})">
<ellipse cx="0" cy="60" rx="36" ry="6" fill="#000" opacity=".1"/>
<rect x="-13" y="-42" width="26" height="50" rx="12" fill="${shirt}"/>
${sk ? `<path d="M-18 8 L18 8 L22 54 L-22 54 Z" fill="${sk}"/>` : `<rect x="-11" y="8" width="22" height="50" rx="6" fill="#3e4f86"/>`}
<circle cx="0" cy="-60" r="22" fill="#fbdcc2"/>
<path d="M-22 -65 C-22 -82 22 -82 22 -65 C14 -74 -14 -74 -22 -65 Z" fill="${hair}"/>
<circle cx="-7" cy="-62" r="2.5" fill="#3a2430"/>
<circle cx="7" cy="-62" r="2.5" fill="#3a2430"/>
<path d="M-5 -54 q5 4 10 0" stroke="#b5485f" stroke-width="2.5" fill="none" stroke-linecap="round"/></g>`;
  }

  const scenes = [];

  /* ========== Cảnh 1: trước tòa nhà, sáng sớm ========== */
  scenes.push({
    build(el) {
      el.innerHTML = SVG0 + `<defs><linearGradient id="s1g" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#ffe8c0"/><stop offset=".5" stop-color="#ffd6a0"/><stop offset="1" stop-color="#e8d0b8"/></linearGradient></defs>
<rect width="1080" height="1920" fill="url(#s1g)"/>
<circle cx="860" cy="520" r="80" fill="#ffe28a"/><circle cx="860" cy="520" r="120" fill="#ffe28a" opacity=".3"/>
<rect y="1200" width="1080" height="720" fill="#d0c8d8"/><rect y="1180" width="1080" height="28" fill="#e8dcd0"/>
<path d="M0 1320 H1080 M0 1480 H1080 M0 1660 H1080" stroke="#bab2c4" stroke-width="5"/>
<g id="s1bld">
<rect x="200" y="340" width="480" height="860" rx="8" fill="#e0dae8"/>
<rect x="200" y="340" width="480" height="40" fill="#b8b0c8"/>
<g fill="#bfe3ff" stroke="#a8a0b8" stroke-width="3">
<rect x="230" y="420" width="80" height="100" rx="4"/><rect x="340" y="420" width="80" height="100" rx="4"/><rect x="450" y="420" width="80" height="100" rx="4"/><rect x="560" y="420" width="80" height="100" rx="4"/>
<rect x="230" y="560" width="80" height="100" rx="4"/><rect x="340" y="560" width="80" height="100" rx="4"/><rect x="450" y="560" width="80" height="100" rx="4"/><rect x="560" y="560" width="80" height="100" rx="4"/>
<rect x="230" y="700" width="80" height="100" rx="4"/><rect x="340" y="700" width="80" height="100" rx="4"/><rect x="450" y="700" width="80" height="100" rx="4"/><rect x="560" y="700" width="80" height="100" rx="4"/>
<rect x="230" y="840" width="80" height="100" rx="4"/><rect x="340" y="840" width="80" height="100" rx="4"/><rect x="450" y="840" width="80" height="100" rx="4"/><rect x="560" y="840" width="80" height="100" rx="4"/>
<rect x="230" y="980" width="80" height="100" rx="4"/><rect x="340" y="980" width="80" height="100" rx="4"/><rect x="450" y="980" width="80" height="100" rx="4"/><rect x="560" y="980" width="80" height="100" rx="4"/>
</g>
<rect x="380" y="1070" width="120" height="130" rx="4" fill="#c8b89e"/>
</g>
<g id="s1tree"><circle cx="800" cy="980" r="80" fill="#7bc88a"/><circle cx="760" cy="1010" r="60" fill="#8fd694"/><circle cx="840" cy="1020" r="55" fill="#6db87a"/><rect x="790" y="1050" width="20" height="120" fill="#a8845a"/></g>
<g id="s1ch">${Ch.markup("c1_")}</g>
</svg>`;
      this.C = Ch.bind("c1_");
    },
    update(t) {
      const t0 = t - L[0].s;
      const lookUp = clamp(t0 / 2.0, 0, 1);
      Ch.place(this.C, 440, 1440, 2.6, 1, Math.sin(t0 * 0.8) * 1.5, 150, 340);
      Ch.pose(this.C, { t: t0, exp: "binh-thuong", pose: "", talk: talkAt(t), gaze: [0, lerp(0, -15, lookUp)], headRot: lerp(0, -8, lookUp) });
    },
  });

  /* ========== Cảnh 2: sảnh, quẹt thẻ ========== */
  scenes.push({
    build(el) {
      el.innerHTML = SVG0 + `<defs><linearGradient id="s2g" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#f0ece0"/><stop offset="1" stop-color="#e0d8cc"/></linearGradient></defs>
<rect width="1080" height="1920" fill="url(#s2g)"/>
<rect x="0" y="1560" width="1080" height="360" fill="#d8d0c0"/><rect x="0" y="1540" width="1080" height="24" fill="#c8c0b0"/>
<g id="s2lobby">
<rect x="60" y="300" width="960" height="1260" rx="8" fill="#e8e0d4"/>
<rect x="80" y="320" width="920" height="1220" fill="#f5f0e6"/>
<rect x="80" y="320" width="920" height="60" fill="#d4ccc0"/>
<g fill="#bfe3ff" opacity=".6"><rect x="100" y="400" width="200" height="800" rx="4"/><rect x="780" y="400" width="200" height="800" rx="4"/></g>
<g fill="#ffe8a0" opacity=".25"><rect x="100" y="400" width="100" height="500"/><rect x="880" y="500" width="100" height="400"/></g>
</g>
<g id="s2elev">
<rect x="370" y="400" width="340" height="700" rx="10" fill="#c0b8cc"/>
<rect x="390" y="420" width="140" height="660" fill="#a8a0b8"/><rect x="550" y="420" width="140" height="660" fill="#a8a0b8"/>
<rect x="530" y="420" width="20" height="660" fill="#908898"/>
<rect x="470" y="440" width="140" height="50" rx="8" fill="#2a2033"/>
<text id="s2fl" x="540" y="478" text-anchor="middle" font-size="36" font-weight="700" fill="#ffd35c" font-family="Segoe UI,Arial">4</text>
</g>
<g id="s2card" transform="translate(780 900)">
<rect x="-40" y="-60" width="80" height="120" rx="12" fill="#2a2033"/>
<rect x="-28" y="-44" width="56" height="28" rx="6" fill="#4a8a4a"/>
<circle cx="0" cy="16" r="10" fill="#ffd35c" opacity=".7"/>
</g>
<g id="s2cardbeep" opacity="0"><circle cx="780" cy="840" r="16" fill="#4aff6a"/></g>
<g id="s2ch">${Ch.markup("c2_")}</g>
</svg>`;
      this.C = Ch.bind("c2_");
    },
    update(t) {
      const s0 = L[1].s, t0 = t - s0;
      const enterK = easeOut(clamp(t0 / 0.8, 0, 1));
      const swipeT = M(1, 3);
      const lookK = clamp((t - swipeT) / 1.5, 0, 1);
      Ch.place(this.C, lerp(-100, 500, enterK), 1420, 2.5, 1, Math.sin(t0 * 1.0) * 2, 150, 340);
      Ch.pose(this.C, { t: t0, exp: "binh-thuong", pose: t0 < 0.8 ? "walk" : "", talk: talkAt(t), gaze: [lerp(0, -6, lookK), lerp(0, -8, lookK)], headRot: lerp(0, -5, lookK) * (1 + 0.3 * Math.sin(t0 * 0.8)) });
      const beepK = clamp((t - swipeT) / 0.15, 0, 1) * clamp(1 - (t - swipeT - 0.15) / 0.3, 0, 1);
      op("s2cardbeep", beepK);
    },
  });

  /* ========== Cảnh 3: bàn ăn trưa ========== */
  scenes.push({
    build(el) {
      el.innerHTML = SVG0 + `<defs><linearGradient id="s3g" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#fff0d6"/><stop offset="1" stop-color="#ffdcae"/></linearGradient></defs>
<rect width="1080" height="1920" fill="url(#s3g)"/>
<rect y="1200" width="1080" height="720" fill="#e8dcc8"/><rect y="1180" width="1080" height="24" fill="#f0e4d0"/>
<g>
<rect x="120" y="800" width="840" height="260" rx="50" fill="#c98b4e"/><rect x="120" y="800" width="840" height="16" rx="8" fill="#d9a066"/>
<rect x="340" y="1060" width="60" height="200" fill="#a8702f"/><rect x="660" y="1060" width="60" height="200" fill="#a8702f"/>
</g>
<g id="s3bowls">
<g transform="translate(300 760)"><circle r="36" fill="#fff"/><ellipse rx="28" ry="16" fill="#f3d27a"/><circle cx="8" cy="-6" r="8" fill="#e88a5a" opacity=".7"/></g>
<g transform="translate(500 750)"><circle r="36" fill="#fff"/><ellipse rx="28" ry="16" fill="#f3d27a"/><circle cx="-6" cy="-5" r="8" fill="#e88a5a" opacity=".7"/></g>
<g transform="translate(700 760)"><circle r="36" fill="#fff"/><ellipse rx="28" ry="16" fill="#f3d27a"/><circle cx="5" cy="-7" r="8" fill="#7bc88a" opacity=".7"/></g>
<g transform="translate(880 755)"><circle r="36" fill="#fff"/><ellipse rx="28" ry="16" fill="#f3d27a"/></g>
</g>
${miniPerson("s3p1", 200, 1200, 2.3, "#7aa0ff", "#3a2430")}
${miniPerson("s3p2", 800, 1210, 2.2, "#ffd35c", "#5a3427")}
${miniPerson("s3p3", 920, 1200, 2.1, "#b79cff", "#8a5a3c")}
<g id="s3ch">${Ch.markup("c3_")}</g>
</svg>`;
      this.C = Ch.bind("c3_");
    },
    update(t) {
      const s0 = L[2].s, t0 = t - s0;
      const rememberT = M(2, 11);
      const sad = clamp((t - rememberT) / 0.4, 0, 1);
      const exp = curExp(t, [[0, "cuoi"], [rememberT, "met"]]);
      Ch.place(this.C, 500, 1430, 2.4, 1, Math.sin(t0 * 1.1) * 1.5, 150, 340);
      Ch.pose(this.C, { t: t0, exp, pose: "", talk: talkAt(t), gaze: [0, lerp(0, 8, sad)], headRot: lerp(2, -4, sad) });
      [["s3p1", 200, 1200, 2.3], ["s3p2", 800, 1210, 2.2], ["s3p3", 920, 1200, 2.1]].forEach(([id, bx, by, sc]) => {
        const nod = Math.sin(t0 * 2 + bx) * 2;
        tf(id, `translate(${bx} ${(by + nod).toFixed(0)}) scale(${sc})`);
      });
    },
  });

  /* ========== Cảnh 4: bàn làm việc, chụp ảnh, lau bàn, bỏ cốc ========== */
  scenes.push({
    build(el) {
      el.innerHTML = SVG0 + `<defs><linearGradient id="s4g" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#e8e4f0"/><stop offset="1" stop-color="#d8d0e0"/></linearGradient></defs>
<rect width="1080" height="1920" fill="url(#s4g)"/>
<rect y="1300" width="1080" height="620" fill="#d0c8d8"/><rect y="1280" width="1080" height="24" fill="#e0d8e8"/>
<g id="s4desk">
<rect x="100" y="780" width="680" height="340" rx="8" fill="#c98b4e"/><rect x="100" y="780" width="680" height="16" rx="8" fill="#d9a066"/>
<rect x="260" y="1120" width="60" height="280" fill="#a8702f"/><rect x="560" y="1120" width="60" height="280" fill="#a8702f"/>
</g>
<g id="s4screen" transform="translate(320 680)">
<rect x="-120" y="-180" width="240" height="160" rx="8" fill="#2a2033"/>
<rect x="-100" y="-164" width="200" height="128" rx="4" fill="#3a5070"/>
<rect x="-20" y="-20" width="40" height="40" rx="4" fill="#a8a0b8"/>
</g>
<g id="s4items">
<g id="s4mug" transform="translate(600 740)">
<rect x="-22" y="-40" width="44" height="48" rx="6" fill="#fff" stroke="#e0588a" stroke-width="4"/>
<rect x="18" y="-28" width="16" height="24" rx="8" fill="none" stroke="#e0588a" stroke-width="3"/>
<ellipse cx="0" cy="-40" rx="20" ry="4" fill="#c98b4e" opacity=".5"/>
</g>
<g id="s4pen" transform="translate(480 760)"><rect x="-4" y="-30" width="8" height="40" rx="3" fill="#4a70b8"/><path d="M-4 10 L0 18 L4 10" fill="#3a5070"/></g>
<g id="s4plant" transform="translate(180 720)"><rect x="-14" y="-10" width="28" height="30" rx="6" fill="#c98b4e"/><circle cx="0" cy="-18" r="16" fill="#7bc88a"/><circle cx="-10" cy="-12" r="10" fill="#8fd694"/><circle cx="10" cy="-14" r="12" fill="#6db87a"/></g>
</g>
<g id="s4phone" opacity="0" transform="translate(440 600)">
<rect x="-50" y="-80" width="100" height="160" rx="14" fill="#2a2033"/>
<rect x="-40" y="-68" width="80" height="128" rx="8" fill="#5a7a96"/>
<circle cx="0" cy="72" r="8" fill="#444"/>
</g>
<g id="s4bag" opacity="0" transform="translate(800 1100)">
<path d="M-60 -40 L60 -40 L50 80 L-50 80 Z" fill="#8a6a4e" rx="8"/>
<path d="M-30 -40 Q-30 -70 0 -70 Q30 -70 30 -40" stroke="#6a4a2e" stroke-width="6" fill="none"/>
</g>
<g id="s4ch">${Ch.markup("c4_")}</g>
</svg>`;
      this.C = Ch.bind("c4_");
    },
    update(t) {
      const s0 = L[3].s, t0 = t - s0;
      const photoT = M(3, 2);
      const wipeT = M(3, 8);
      const mugT = M(3, 14);
      const exp = curExp(t, [[0, "binh-thuong"], [wipeT, "met"]]);
      Ch.place(this.C, 540, 1460, 2.4, -1, Math.sin(t0 * 0.9) * 1.5, 150, 340);
      Ch.pose(this.C, { t: t0, exp, pose: "", talk: talkAt(t), gaze: [-4, -6], headRot: -3 + Math.sin(t0 * 1.2) * 2 });
      const phoneK = clamp((t - photoT) / 0.3, 0, 1) * clamp(1 - (t - photoT - 1.5) / 0.3, 0, 1);
      op("s4phone", phoneK);
      const mugGone = clamp((t - mugT) / 0.4, 0, 1);
      op("s4mug", 1 - mugGone);
      op("s4bag", mugGone > 0.01 ? easeOut(mugGone) : 0);
      tf("s4bag", `translate(800 ${(1100 - 20 * mugGone).toFixed(0)})`);
    },
  });

  /* ========== Cảnh 5: cổng ra, bảo vệ ========== */
  scenes.push({
    build(el) {
      el.innerHTML = SVG0 + `<defs><linearGradient id="s5g" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#ffd8a0"/><stop offset=".6" stop-color="#e8c090"/><stop offset="1" stop-color="#c8b0a0"/></linearGradient></defs>
<rect width="1080" height="1920" fill="url(#s5g)"/>
<circle cx="200" cy="600" r="100" fill="#ff9f5e" opacity=".4"/><circle cx="200" cy="600" r="60" fill="#ffb870" opacity=".5"/>
<rect y="1240" width="1080" height="680" fill="#c8beb0"/><rect y="1220" width="1080" height="26" fill="#d8d0c0"/>
<g id="s5gate">
<rect x="0" y="400" width="120" height="840" fill="#a8a0b8"/><rect x="960" y="400" width="120" height="840" fill="#a8a0b8"/>
<rect x="100" y="400" width="30" height="840" fill="#908898"/><rect x="950" y="400" width="30" height="840" fill="#908898"/>
<rect x="0" y="380" width="1080" height="40" fill="#b8b0c8"/>
</g>
<g id="s5booth" transform="translate(120 900)">
<rect x="-60" y="-200" width="160" height="340" rx="8" fill="#e0d8c8"/>
<rect x="-40" y="-170" width="120" height="80" rx="4" fill="#bfe3ff" stroke="#a8a0b8" stroke-width="3"/>
</g>
<g id="s5guard" transform="translate(180 1200)">
<ellipse cx="0" cy="100" rx="50" ry="8" fill="#000" opacity=".1"/>
<rect x="-28" y="-24" width="56" height="90" rx="16" fill="#4a6a8a"/>
<rect x="-24" y="66" width="22" height="70" rx="8" fill="#3e4f6a"/><rect x="2" y="66" width="22" height="70" rx="8" fill="#3e4f6a"/>
<circle cx="0" cy="-54" r="28" fill="#d4a87a"/>
<path d="M-28 -60 C-28 -84 28 -84 28 -60 C18 -72 -18 -72 -28 -60 Z" fill="#3a2430"/>
<path d="M-30 -80 L-34 -100 L34 -100 L30 -80" fill="#4a6a8a"/>
<ellipse cx="-9" cy="-56" rx="2.5" ry="3" fill="#3a2430"/><ellipse cx="9" cy="-56" rx="2.5" ry="3" fill="#3a2430"/>
<path id="s5gm" d="M-6 -42 q6 5 12 0" stroke="#b5485f" stroke-width="2.5" fill="none" stroke-linecap="round"/>
<g id="s5gwave"><rect x="26" y="-6" width="18" height="44" rx="9" fill="#4a6a8a"/><circle cx="40" cy="42" r="10" fill="#d4a87a"/></g>
</g>
<g id="s5ch">${Ch.markup("c5_")}</g>
</svg>`;
      this.C = Ch.bind("c5_");
    },
    update(t) {
      const s0 = L[4].s, t0 = t - s0;
      const waveT = M(4, 2);
      const walkK = clamp(t0 / 3.5, 0, 1);
      Ch.place(this.C, lerp(600, 820, walkK), 1400, 2.4, 1, Math.sin(t0 * 1.0) * 2, 150, 340);
      const byeT = M(4, 9);
      const exp = curExp(t, [[0, "binh-thuong"], [byeT, "met"]]);
      Ch.pose(this.C, { t: t0, exp, pose: walkK < 0.9 ? "walk" : "", talk: talkAt(t), gaze: [-8, 0], headRot: -4 + Math.sin(t0 * 1.2) * 2 });
      const wave = t >= waveT ? Math.sin((t - waveT) * 5) * 15 : 0;
      tf("s5gwave", `rotate(${wave.toFixed(1)} 30 -6)`);
    },
  });

  /* ========== Cảnh 6: phòng trọ, nhìn ảnh bàn trống ========== */
  scenes.push({
    build(el) {
      el.innerHTML = SVG0 + `<defs><linearGradient id="s6g" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#2a2040"/><stop offset="1" stop-color="#1a1228"/></linearGradient></defs>
<rect width="1080" height="1920" fill="url(#s6g)"/>
<rect y="1300" width="1080" height="620" fill="#252038"/>
<g id="s6room">
<rect x="60" y="400" width="960" height="920" rx="8" fill="#302848"/>
<rect x="80" y="420" width="920" height="880" fill="#3a3050"/>
<rect x="700" y="440" width="260" height="360" rx="6" fill="#bfe3ff" opacity=".15"/>
<g opacity=".15"><circle cx="830" cy="580" r="8" fill="#ffe28a"/><circle cx="830" cy="580" r="40" fill="#ffe28a" opacity=".2"/></g>
</g>
<g id="s6bed" transform="translate(300 1100)">
<rect x="-200" y="-30" width="400" height="180" rx="12" fill="#5a4878"/>
<rect x="-180" y="-40" width="140" height="60" rx="8" fill="#7a6898"/>
<rect x="-200" y="-30" width="400" height="30" rx="8" fill="#6a5888"/>
</g>
<g id="s6phone" transform="translate(580 900)">
<rect x="-60" y="-100" width="120" height="200" rx="16" fill="#2a2033"/>
<rect x="-48" y="-86" width="96" height="164" rx="10" fill="#e8e0d4"/>
<g id="s6deskphoto">
<rect x="-36" y="-74" width="72" height="44" rx="4" fill="#c98b4e"/>
<rect x="-28" y="-66" width="56" height="28" rx="2" fill="#f5f0e6"/>
<rect x="-20" y="-54" width="16" height="10" rx="2" fill="#d0c8d8" opacity=".4"/>
</g>
<text x="0" y="50" text-anchor="middle" font-size="14" font-weight="600" fill="#a8a0b8" font-family="Segoe UI,Arial">15:00</text>
</g>
<g id="s6ch">${Ch.markup("c6_")}</g>
</svg>`;
      this.C = Ch.bind("c6_");
    },
    update(t) {
      const s0 = L[5].s, t0 = t - s0;
      const lineEndT = M(5, 8);
      const lastT = M(5, 14);
      const exp = curExp(t, [[0, "binh-thuong"], [lineEndT, "met"]]);
      Ch.place(this.C, 340, 1380, 2.3, 1, 0, 150, 340);
      Ch.pose(this.C, { t: t0, exp, pose: "sit", talk: talkAt(t), gaze: [6, -8], headRot: -3 });
      const phoneGlow = 0.6 + 0.15 * Math.sin(t0 * 2);
      op("s6phone", phoneGlow);
    },
  });

  window.SCENES = scenes;
})();
