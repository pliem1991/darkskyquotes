/* Sáu cảnh clip 4: "Nếu trên đầu mỗi người hiện số dư". SVG + chuyển động tính theo t (giây). */
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
  const rng = (seed) => { let s = seed >>> 0; return () => { s = (Math.imul(s, 1664525) + 1013904223) >>> 0; return s / 4294967296; }; };
  const SVG0 = '<svg width="1080" height="1920" viewBox="0 0 1080 1920" xmlns="http://www.w3.org/2000/svg" style="position:absolute;left:0;top:0">';
  const talkAt = (t) => { const f = t * 30; const i = Math.floor(f); const k = f - i; const a = D.env[i] || 0; const b = D.env[i + 1] || 0; const e = a + (b - a) * k; return clamp((e - 0.1) / 0.5, 0, 1); };
  function curExp(t, list) { let e = list[0][1]; for (const [tt, n] of list) if (t >= tt) e = n; return e; }
  function popScale(t, t0, d) { return t < t0 ? 0.001 : Math.max(0.001, backOut((t - t0) / (d || 0.35))); }

  /* --- Khung số dư lơ lửng trên đầu --- */
  function balanceSVG(id, txt, w) {
    w = w || 260;
    return `<g id="${id}"><rect x="${-w/2}" y="-48" width="${w}" height="60" rx="20" fill="#2a2033" opacity=".92"/>
<rect x="${-w/2+4}" y="-44" width="${w-8}" height="52" rx="16" fill="#1a1228"/>
<text x="0" y="-8" text-anchor="middle" font-size="36" font-weight="800" fill="#ffd35c" font-family="Segoe UI,Arial">${txt}</text></g>`;
  }
  function floatY(t, amp, spd) { return Math.sin(t * spd) * amp; }

  /* --- Nhân vật phụ đơn giản --- */
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

  /* ========== Cảnh 1: đường phố, hook ========== */
  scenes.push({
    build(el) {
      el.innerHTML = SVG0 + `<defs><linearGradient id="s1g" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#ffe0c8"/><stop offset="1" stop-color="#ffd0a0"/></linearGradient></defs>
<rect width="1080" height="1920" fill="url(#s1g)"/>
<circle cx="850" cy="460" r="90" fill="#ffe28a"/><circle cx="850" cy="460" r="130" fill="#ffe28a" opacity=".3"/>
<rect y="1160" width="1080" height="760" fill="#cfc7d6"/><rect y="1140" width="1080" height="28" fill="#e8d7c3"/>
<path d="M0 1280 H1080 M0 1430 H1080 M0 1600 H1080 M0 1780 H1080" stroke="#b9b0c4" stroke-width="5"/>
<g fill="#e8e0f0"><rect x="60" y="520" width="200" height="460" rx="8"/><rect x="60" y="580" width="200" height="60" fill="#bfe3ff"/><rect x="60" y="700" width="200" height="60" fill="#bfe3ff"/><rect x="60" y="820" width="200" height="60" fill="#bfe3ff"/></g>
<g fill="#fff6e8"><rect x="780" y="440" width="240" height="520" rx="8"/><rect x="800" y="500" width="200" height="80" fill="#bfe3ff"/><rect x="800" y="640" width="200" height="80" fill="#bfe3ff"/></g>
<g fill="#ffd6e2"><rect x="350" y="580" width="180" height="380" rx="8"/><rect x="370" y="640" width="140" height="60" fill="#bfe3ff"/><rect x="370" y="760" width="140" height="60" fill="#bfe3ff"/></g>
${miniPerson("s1p1", 200, 1180, 2.5, "#7aa0ff", "#3a2430")}
${miniPerson("s1p2", 500, 1200, 2.3, "#ff9f6e", "#5a3427")}
${miniPerson("s1p3", 780, 1190, 2.4, "#b79cff", "#2a2033")}
${balanceSVG("s1b1", "8.540.000đ", 260)}
${balanceSVG("s1b2", "1.230.000đ", 260)}
${balanceSVG("s1b3", "45.600.000đ", 280)}
<g id="s1blur1" opacity=".35"><ellipse cx="120" cy="1100" rx="40" ry="80" fill="#9fb6cc"/></g>
<g id="s1blur2" opacity=".3"><ellipse cx="950" cy="1120" rx="35" ry="70" fill="#9fb6cc"/></g>
</svg>`;
    },
    update(t) {
      const t0 = t - L[0].s;
      const walk = clamp(t0 / 3.5, 0, 1);
      [["s1p1", 200, -60], ["s1p2", 500, -30], ["s1p3", 780, -50]].forEach(([id, bx, dx]) => {
        const px = bx + dx * walk;
        tf(id, `translate(${px.toFixed(0)} ${id === "s1p2" ? 1200 : id === "s1p1" ? 1180 : 1190}) scale(${id === "s1p2" ? 2.3 : id === "s1p1" ? 2.5 : 2.4})`);
      });
      const bob = floatY(t, 6, 2.2);
      tf("s1b1", `translate(200 ${(895 + bob).toFixed(1)}) scale(${popScale(t, L[0].s + 0.3, 0.4).toFixed(3)})`);
      tf("s1b2", `translate(500 ${(935 + floatY(t, 5, 2.7)).toFixed(1)}) scale(${popScale(t, L[0].s + 0.6, 0.4).toFixed(3)})`);
      tf("s1b3", `translate(780 ${(915 + floatY(t, 7, 1.9)).toFixed(1)}) scale(${popScale(t, L[0].s + 0.9, 0.4).toFixed(3)})`);
    },
  });

  /* ========== Cảnh 2: thang máy, sếp 1 tỷ 2 ========== */
  scenes.push({
    build(el) {
      el.innerHTML = SVG0 + `<defs><linearGradient id="s2g" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#e8e4f0"/><stop offset="1" stop-color="#d4d0e0"/></linearGradient></defs>
<rect width="1080" height="1920" fill="url(#s2g)"/>
<rect x="80" y="200" width="920" height="1600" rx="20" fill="#c9c2d9"/>
<rect x="120" y="240" width="840" height="1520" rx="10" fill="#e8e0f0"/>
<rect x="160" y="1620" width="760" height="20" rx="4" fill="#d4cce4"/>
<g id="s2door"><rect x="120" y="240" width="410" height="1520" fill="#b9b0c4"/><rect x="550" y="240" width="410" height="1520" fill="#b9b0c4"/><rect x="530" y="240" width="20" height="1520" fill="#a8a0b8"/></g>
<rect x="470" y="280" width="140" height="60" rx="10" fill="#2a2033"/>
<text id="s2fl" x="540" y="325" text-anchor="middle" font-size="42" font-weight="700" fill="#ffd35c" font-family="Segoe UI,Arial">12</text>
<g id="s2boss" transform="translate(650 1100)">
<ellipse cx="0" cy="160" rx="80" ry="10" fill="#000" opacity=".1"/>
<rect x="-40" y="-20" width="80" height="140" rx="20" fill="#2a2033"/>
<path d="M-6 -20 L0 30 L6 -20" fill="#e0588a"/>
<rect x="-38" y="120" width="30" height="100" rx="8" fill="#2a2033"/><rect x="8" y="120" width="30" height="100" rx="8" fill="#2a2033"/>
<circle cx="0" cy="-56" r="36" fill="#fbdcc2"/>
<path d="M-36 -60 C-36 -90 36 -90 36 -60 C26 -78 -26 -78 -36 -60 Z" fill="#2a2033"/>
<ellipse cx="-12" cy="-58" rx="3" ry="3.5" fill="#3a2430"/><ellipse cx="12" cy="-58" rx="3" ry="3.5" fill="#3a2430"/>
<path id="s2bm" d="M-8 -42 q8 -4 16 0" stroke="#b5485f" stroke-width="3" fill="none" stroke-linecap="round"/>
<g id="s2bsigh" opacity="0"><path d="M26 -50 q14 -20 22 -6" stroke="#a8a0b8" stroke-width="5" fill="none" stroke-linecap="round"/><path d="M34 -54 q10 -16 18 -4" stroke="#a8a0b8" stroke-width="4" fill="none" stroke-linecap="round"/></g>
<rect x="-48" y="0" width="22" height="56" rx="11" fill="#2a2033"/><circle cx="-42" cy="60" r="12" fill="#fbdcc2"/>
<rect x="26" y="0" width="22" height="56" rx="11" fill="#2a2033"/><circle cx="42" cy="60" r="12" fill="#fbdcc2"/>
</g>
${balanceSVG("s2bb", "1.200.000.000đ", 340)}
<g id="s2ch">${Ch.markup("c2_")}</g>
</svg>`;
      this.C = Ch.bind("c2_");
    },
    update(t) {
      const s0 = L[1].s, t0 = t - s0;
      const doorK = easeOut(clamp(t0 / 0.6, 0, 1));
      tf("s2door", `translate(0 0)`);
      $("s2door").children[0].setAttribute("x", (120 - 410 * doorK).toFixed(0));
      $("s2door").children[1].setAttribute("x", (550 + 410 * doorK).toFixed(0));
      $("s2door").children[2].setAttribute("x", (530 + 410 * doorK).toFixed(0));
      const exp = curExp(t, [[0, "binh-thuong"], [M(1, 5), "ngac-nhien"]]);
      const enterK = easeOut(clamp((t0 - 0.3) / 0.8, 0, 1));
      Ch.place(this.C, lerp(-200, 300, enterK), 1460, 2.6, 1, Math.sin(t0 * 1.2) * 2, 150, 340);
      Ch.pose(this.C, { t: t0, exp, pose: t0 < 1.1 ? "walk" : "", talk: talkAt(t), gaze: t0 > 1.2 ? [8, -12] : [0, 0], headRot: t0 > 1.2 ? -6 + Math.sin(t0 * 1.5) * 2 : 0 });
      const bob = floatY(t, 5, 2.0);
      const bk = popScale(t, s0 + 0.8, 0.45);
      tf("s2bb", `translate(650 ${(960 + bob).toFixed(1)}) scale(${bk.toFixed(3)})`);
      const sighK = clamp((t - M(1, 9)) / 0.3, 0, 1);
      op("s2bsigh", sighK);
      tf("s2bsigh", `translate(0 ${(-4 * sighK).toFixed(1)})`);
      const bossNod = Math.sin(t0 * 1.8) * 2;
      tf("s2boss", `translate(650 ${(1100 + bossNod).toFixed(0)})`);
    },
  });

  /* ========== Cảnh 3: trưa, lẩu → cơm tấm ========== */
  scenes.push({
    build(el) {
      el.innerHTML = SVG0 + `<defs><linearGradient id="s3g" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#fff0d6"/><stop offset="1" stop-color="#ffdcae"/></linearGradient></defs>
<rect width="1080" height="1920" fill="url(#s3g)"/>
<rect y="1160" width="1080" height="760" fill="#cfc7d6"/><rect y="1140" width="1080" height="26" fill="#e8d7c3"/>
<path d="M0 1280 H1080 M0 1430 H1080 M0 1600 H1080" stroke="#b9b0c4" stroke-width="5"/>
<g id="s3lau"><rect x="60" y="480" width="500" height="360" rx="16" fill="#ff6f6f"/><rect x="80" y="500" width="460" height="320" rx="8" fill="#ffe0c8"/>
<text x="310" y="600" text-anchor="middle" font-size="64" font-weight="800" fill="#ff4040" font-family="Segoe UI,Arial">LẨU</text>
<path d="M130 640 Q200 580 270 640 Q340 580 410 640 Q480 580 490 620" stroke="#ff9f6e" stroke-width="8" fill="none" stroke-linecap="round"/>
<rect x="100" y="700" width="370" height="50" rx="12" fill="#fff"/><rect x="110" y="710" width="120" height="30" rx="8" fill="#ffd35c"/><rect x="250" y="710" width="90" height="30" rx="8" fill="#ff8fab"/><rect x="360" y="710" width="90" height="30" rx="8" fill="#7bc88a"/></g>
<g id="s3comtam" opacity="0"><rect x="60" y="480" width="500" height="360" rx="16" fill="#4aa8a0"/><rect x="80" y="500" width="460" height="320" rx="8" fill="#fff0d6"/>
<text x="310" y="590" text-anchor="middle" font-size="52" font-weight="800" fill="#2a6050" font-family="Segoe UI,Arial">CƠM TẤM</text>
<g transform="translate(180 660)"><circle r="44" fill="#fff"/><path d="M-30 -10 Q0 -30 30 -10 Q20 20 0 30 Q-20 20 -30 -10 Z" fill="#f3d27a"/><ellipse cx="14" cy="-6" rx="18" ry="12" fill="#e8906a"/><rect x="-20" y="10" width="14" height="6" rx="3" fill="#7bc88a"/></g>
<g transform="translate(360 660)"><circle r="44" fill="#fff"/><path d="M-30 -10 Q0 -30 30 -10 Q20 20 0 30 Q-20 20 -30 -10 Z" fill="#f3d27a"/><ellipse cx="14" cy="-6" rx="18" ry="12" fill="#e8906a"/><rect x="-20" y="10" width="14" height="6" rx="3" fill="#7bc88a"/></g></g>
${miniPerson("s3p1", 620, 1170, 2.4, "#7aa0ff", "#3a2430")}
${miniPerson("s3p2", 780, 1180, 2.3, "#ffd35c", "#5a3427")}
${miniPerson("s3p3", 940, 1170, 2.2, "#b79cff", "#8a5a3c")}
${balanceSVG("s3bh", "312.000đ", 230)}
<g id="s3ch">${Ch.markup("c3_")}</g>
</svg>`;
      this.C = Ch.bind("c3_");
    },
    update(t) {
      const s0 = L[2].s, t0 = t - s0;
      const switchT = M(2, 12);
      const switched = t >= switchT;
      show("s3lau", !switched);
      op("s3comtam", switched ? easeOut((t - switchT) / 0.4) : 0);
      const exp = curExp(t, [[0, "binh-thuong"], [M(2, 7), "ngac-nhien"], [switchT, "que"]]);
      Ch.place(this.C, 400, 1450, 2.5, 1, Math.sin(t0 * 1.1) * 2, 150, 340);
      Ch.pose(this.C, { t: t0, exp, pose: "", talk: talkAt(t), gaze: switched ? [-4, 0] : [0, 0], headRot: switched ? -4 : Math.sin(t0 * 1.3) * 2, sweat: switched });
      const bk = popScale(t, M(2, 7), 0.4);
      tf("s3bh", `translate(400 ${(1280 + floatY(t, 5, 2.3)).toFixed(1)}) scale(${bk.toFixed(3)})`);
      [["s3p1", 620], ["s3p2", 780], ["s3p3", 940]].forEach(([id, bx]) => {
        const look = t >= M(2, 7) ? Math.sin(t * 2 + bx) * 3 : 0;
        tf(id, `translate(${bx} ${(id === "s3p2" ? 1180 : 1170) + look}) scale(${id === "s3p2" ? 2.3 : id === "s3p1" ? 2.4 : 2.2})`);
      });
    },
  });

  /* ========== Cảnh 4: quán cà phê, hẹn hò, trà đá ========== */
  scenes.push({
    build(el) {
      el.innerHTML = SVG0 + `<defs><linearGradient id="s4g" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#fff8ec"/><stop offset="1" stop-color="#ffe8c8"/></linearGradient></defs>
<rect width="1080" height="1920" fill="url(#s4g)"/>
<rect y="1160" width="1080" height="760" fill="#e8d6bd"/><rect y="1140" width="1080" height="26" fill="#fff0e0"/>
<g><rect x="100" y="500" width="880" height="500" rx="20" fill="#c98b4e" opacity=".15"/></g>
<g><rect x="200" y="760" width="660" height="280" rx="60" fill="#c98b4e"/><rect x="200" y="760" width="660" height="20" rx="10" fill="#d9a066"/><rect x="380" y="1040" width="60" height="200" fill="#a8702f"/><rect x="600" y="1040" width="60" height="200" fill="#a8702f"/></g>
<g id="s4td1" transform="translate(400 700)"><rect x="-30" y="-70" width="60" height="80" rx="6" fill="#fff" fill-opacity=".85" stroke="#a8d4e8" stroke-width="4"/>
<rect x="-22" y="-60" width="44" height="55" fill="#e8c46a" opacity=".3"/>
<circle cx="0" cy="-30" r="6" fill="#fff" opacity=".7"/><circle cx="10" cy="-45" r="5" fill="#fff" opacity=".6"/><circle cx="-8" cy="-50" r="4" fill="#fff" opacity=".5"/>
<rect x="26" y="-56" width="28" height="8" rx="4" fill="#ff8fab"/></g>
<g id="s4td2" transform="translate(670 700)"><rect x="-30" y="-70" width="60" height="80" rx="6" fill="#fff" fill-opacity=".85" stroke="#a8d4e8" stroke-width="4"/>
<rect x="-22" y="-60" width="44" height="55" fill="#e8c46a" opacity=".3"/>
<circle cx="0" cy="-30" r="6" fill="#fff" opacity=".7"/><circle cx="-10" cy="-45" r="5" fill="#fff" opacity=".6"/><circle cx="8" cy="-50" r="4" fill="#fff" opacity=".5"/>
<rect x="26" y="-56" width="28" height="8" rx="4" fill="#7cc8ff"/></g>
<g id="s4date" transform="translate(700 1120)">
<ellipse cx="0" cy="160" rx="60" ry="8" fill="#000" opacity=".1"/>
<rect x="-34" y="-30" width="68" height="120" rx="20" fill="#5a7a96"/>
<rect x="-30" y="90" width="26" height="80" rx="8" fill="#3e4f6a"/><rect x="4" y="90" width="26" height="80" rx="8" fill="#3e4f6a"/>
<circle cx="0" cy="-66" r="30" fill="#fbdcc2"/>
<path d="M-30 -72 C-30 -96 30 -96 30 -72 C18 -84 -18 -84 -30 -72 Z" fill="#3a2430"/>
<ellipse cx="-10" cy="-68" rx="3" ry="3" fill="#3a2430"/><ellipse cx="10" cy="-68" rx="3" ry="3" fill="#3a2430"/>
<path d="M-6 -54 q6 4 12 0" stroke="#b5485f" stroke-width="2.5" fill="none" stroke-linecap="round"/>
<rect x="-42" y="-10" width="20" height="50" rx="10" fill="#5a7a96"/><circle cx="-36" cy="44" r="10" fill="#fbdcc2"/>
<rect x="22" y="-10" width="20" height="50" rx="10" fill="#5a7a96"/><circle cx="36" cy="44" r="10" fill="#fbdcc2"/>
</g>
${balanceSVG("s4bdate", "100.000đ", 220)}
${balanceSVG("s4bme", "312.000đ", 220)}
<g id="s4ch">${Ch.markup("c4_")}</g>
</svg>`;
      this.C = Ch.bind("c4_");
    },
    update(t) {
      const s0 = L[3].s, t0 = t - s0;
      const exp = curExp(t, [[0, "binh-thuong"], [M(3, 4), "que"], [M(3, 10), "cuoi"]]);
      Ch.place(this.C, 350, 1400, 2.4, 1, Math.sin(t0 * 1.0) * 2, 150, 340);
      Ch.pose(this.C, { t: t0, exp, pose: "", talk: talkAt(t), gaze: t0 > 1.5 ? [8, -10] : [0, 0], headRot: Math.sin(t0 * 1.3) * 3 });
      const dateNod = Math.sin(t0 * 1.5 + 1) * 3;
      tf("s4date", `translate(700 ${(1120 + dateNod).toFixed(0)})`);
      const glanceT = M(3, 4);
      const bk1 = popScale(t, glanceT, 0.4);
      const bk2 = popScale(t, glanceT + 0.3, 0.4);
      tf("s4bme", `translate(350 ${(1230 + floatY(t, 5, 2.1)).toFixed(1)}) scale(${bk1.toFixed(3)})`);
      tf("s4bdate", `translate(700 ${(1010 + floatY(t, 4, 2.5)).toFixed(1)}) scale(${bk2.toFixed(3)})`);
    },
  });

  /* ========== Cảnh 5: sân nhà quê, má lặt rau ========== */
  function momYard(id) {
    return `<defs><linearGradient id="${id}g" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#e8f4d6"/><stop offset="1" stop-color="#d4e8b8"/></linearGradient></defs>
<rect width="1080" height="1920" fill="url(#${id}g)"/>
<rect y="1100" width="1080" height="820" fill="#c9b890"/><rect y="1080" width="1080" height="30" fill="#e0d6b0"/>
<path d="M0 1220 H1080 M0 1380 H1080 M0 1560 H1080 M0 1760 H1080" stroke="#b8a870" stroke-width="5"/>
<g><rect x="40" y="320" width="500" height="780" rx="10" fill="#e8d6a8"/>
<path d="M40 320 L290 140 L540 320 Z" fill="#c98b4e"/><path d="M270 140 L310 140 L310 220 L290 220 Z" fill="#a8743f"/>
<rect x="120" y="500" width="160" height="200" rx="6" fill="#bfe3ff" stroke="#a8a0b8" stroke-width="6"/>
<rect x="350" y="500" width="120" height="200" rx="6" fill="#bfe3ff" stroke="#a8a0b8" stroke-width="6"/>
<rect x="350" y="780" width="140" height="260" rx="4" fill="#c98b4e"/><circle cx="370" cy="920" r="8" fill="#f3d27a"/></g>
<g fill="#7bc88a"><circle cx="700" cy="940" r="60"/><circle cx="660" cy="960" r="50"/><circle cx="740" cy="970" r="45"/><circle cx="800" cy="1000" r="40"/><circle cx="850" cy="960" r="55"/><circle cx="920" cy="990" r="50"/><circle cx="980" cy="960" r="45"/></g>
<g fill="#9be0a0"><circle cx="680" cy="1010" r="30"/><circle cx="760" cy="1020" r="35"/><circle cx="870" cy="1030" r="30"/><circle cx="940" cy="1020" r="25"/></g>`;
  }

  scenes.push({
    build(el) {
      el.innerHTML = SVG0 + momYard("s5") + `
<g id="s5mom" transform="translate(680 1250)">
<ellipse cx="0" cy="80" rx="70" ry="8" fill="#000" opacity=".1"/>
<rect x="-36" y="-30" width="72" height="90" rx="16" fill="#7bc88a"/>
<path d="M-22 60 L22 60 L28 140 L-28 140 Z" fill="#3e4f86"/>
<circle cx="0" cy="-64" r="32" fill="#fbdcc2"/>
<path d="M-32 -68 C-32 -94 32 -94 32 -68 C22 -80 -22 -80 -32 -68 Z" fill="#5a3427"/>
<ellipse cx="-10" cy="-66" rx="2.5" ry="3" fill="#3a2430"/><ellipse cx="10" cy="-66" rx="2.5" ry="3" fill="#3a2430"/>
<path d="M-6 -52 q6 5 12 0" stroke="#b5485f" stroke-width="2.5" fill="none" stroke-linecap="round"/>
<g id="s5marm"><rect x="-46" y="-8" width="18" height="50" rx="9" fill="#7bc88a"/><circle cx="-42" cy="46" r="9" fill="#fbdcc2"/>
<g id="s5veg" transform="translate(-48 36)"><ellipse rx="14" ry="6" fill="#4a8a4a"/><path d="M-8 -4 L-4 -14 L0 -4 L4 -14 L8 -4" stroke="#3a6a3a" stroke-width="2" fill="none"/></g></g>
<rect x="28" y="-8" width="18" height="50" rx="9" fill="#7bc88a"/><circle cx="42" cy="46" r="9" fill="#fbdcc2"/>
</g>
<g id="s5rau" transform="translate(540 1340)"><ellipse rx="80" ry="26" fill="#8fd694"/><g stroke="#5a8a5a" stroke-width="3" fill="none"><path d="M-40 -8 q10 -16 20 0"/><path d="M-10 -6 q8 -14 16 0"/><path d="M20 -10 q10 -18 20 0"/><path d="M-28 8 q10 -14 20 0"/><path d="M10 6 q8 -12 16 0"/></g></g>
${balanceSVG("s5bm", "20.300.000đ", 300)}
<g id="s5ch">${Ch.markup("c5_")}</g>
</svg>`;
      this.C = Ch.bind("c5_");
    },
    update(t) {
      const s0 = L[4].s, t0 = t - s0;
      Ch.place(this.C, 300, 1420, 2.5, 1, Math.sin(t0 * 0.8) * 1.5, 150, 340);
      Ch.pose(this.C, { t: t0, exp: "binh-thuong", pose: "", talk: talkAt(t), gaze: [6, -4], headRot: -3 + Math.sin(t0 * 1.0) * 2 });
      const armRot = Math.sin(t0 * 2.5) * 8;
      tf("s5marm", `rotate(${armRot.toFixed(1)} -37 -8)`);
      const bk = popScale(t, s0 + 0.4, 0.5);
      tf("s5bm", `translate(680 ${(1100 + floatY(t, 6, 1.8)).toFixed(1)}) scale(${bk.toFixed(3)})`);
    },
  });

  /* ========== Cảnh 6: tiết lộ 2 triệu × 10 tháng, má chưa xài ========== */
  scenes.push({
    build(el) {
      el.innerHTML = SVG0 + momYard("s6") + `
<g id="s6mom" transform="translate(680 1250)">
<ellipse cx="0" cy="80" rx="70" ry="8" fill="#000" opacity=".1"/>
<rect x="-36" y="-30" width="72" height="90" rx="16" fill="#7bc88a"/>
<path d="M-22 60 L22 60 L28 140 L-28 140 Z" fill="#3e4f86"/>
<circle cx="0" cy="-64" r="32" fill="#fbdcc2"/>
<path d="M-32 -68 C-32 -94 32 -94 32 -68 C22 -80 -22 -80 -32 -68 Z" fill="#5a3427"/>
<ellipse cx="-10" cy="-66" rx="2.5" ry="3" fill="#3a2430"/><ellipse cx="10" cy="-66" rx="2.5" ry="3" fill="#3a2430"/>
<path d="M-6 -52 q6 5 12 0" stroke="#b5485f" stroke-width="2.5" fill="none" stroke-linecap="round"/>
<g id="s6marm"><rect x="-46" y="-8" width="18" height="50" rx="9" fill="#7bc88a"/><circle cx="-42" cy="46" r="9" fill="#fbdcc2"/>
<g transform="translate(-48 36)"><ellipse rx="14" ry="6" fill="#4a8a4a"/><path d="M-8 -4 L-4 -14 L0 -4 L4 -14 L8 -4" stroke="#3a6a3a" stroke-width="2" fill="none"/></g></g>
<rect x="28" y="-8" width="18" height="50" rx="9" fill="#7bc88a"/><circle cx="42" cy="46" r="9" fill="#fbdcc2"/>
</g>
<g id="s6rau" transform="translate(540 1340)"><ellipse rx="80" ry="26" fill="#8fd694"/><g stroke="#5a8a5a" stroke-width="3" fill="none"><path d="M-40 -8 q10 -16 20 0"/><path d="M-10 -6 q8 -14 16 0"/><path d="M20 -10 q10 -18 20 0"/><path d="M-28 8 q10 -14 20 0"/><path d="M10 6 q8 -12 16 0"/></g></g>
${balanceSVG("s6bm", "20.300.000đ", 300)}
<g id="s6note" opacity="0"><rect x="-170" y="-30" width="340" height="52" rx="16" fill="#fff" stroke="#e0588a" stroke-width="4"/>
<text x="0" y="4" text-anchor="middle" font-size="32" font-weight="700" fill="#e0588a" font-family="Segoe UI,Arial">2 triệu × 10 tháng</text></g>
<g id="s6ch">${Ch.markup("c6_")}</g>
</svg>`;
      this.C = Ch.bind("c6_");
    },
    update(t) {
      const s0 = L[5].s, t0 = t - s0;
      const exp = curExp(t, [[0, "binh-thuong"], [M(5, 14), "met"]]);
      Ch.place(this.C, 300, 1420, 2.5, 1, 0, 150, 340);
      Ch.pose(this.C, { t: t0, exp, pose: "", talk: talkAt(t), gaze: [6, -4], headRot: -3 });
      const armRot = Math.sin(t0 * 2.5) * 8;
      tf("s6marm", `rotate(${armRot.toFixed(1)} -37 -8)`);
      tf("s6bm", `translate(680 ${(1100 + floatY(t, 6, 1.8)).toFixed(1)})`);
      const noteT = M(5, 3);
      const nk = popScale(t, noteT, 0.5);
      op("s6note", nk > 0.01 ? 1 : 0);
      tf("s6note", `translate(680 ${(1170 + floatY(t, 4, 1.5)).toFixed(1)}) scale(${nk.toFixed(3)})`);
    },
  });

  window.SCENES = scenes;
})();
