/* Bảy cảnh nền vẽ bằng SVG + chuyển động tính theo thời gian. Mọi thứ là hàm của t (giây), không dùng Math.random không hạt giống. */
(function () {
  const D = window.DATA, L = D.lines, Ch = window.Char;
  const clamp = (x, a, b) => Math.max(a, Math.min(b, x));
  const lerp = (a, b, k) => a + (b - a) * k;
  const easeOut = (x) => 1 - Math.pow(1 - clamp(x, 0, 1), 3);
  const easeIn = (x) => Math.pow(clamp(x, 0, 1), 2);
  const backOut = (x) => { x = clamp(x, 0, 1); const c = 1.8; return 1 + (c + 1) * Math.pow(x - 1, 3) + c * Math.pow(x - 1, 2); };
  const M = (i, k) => { const sy = L[i].syl, a = Math.min(Math.floor(k), sy.length - 1), b = Math.min(a + 1, sy.length - 1); return sy[a].s + (sy[b].s - sy[a].s) * (k - Math.floor(k)); };
  const E = (i) => L[i].e;
  const $ = (id) => document.getElementById(id);
  const tf = (id, s) => { const e = $(id); if (e) e.setAttribute("transform", s); };
  const op = (id, v) => { const e = $(id); if (e) e.setAttribute("opacity", v.toFixed(3)); };
  const show = (id, v) => { const e = $(id); if (e) e.style.display = v ? "" : "none"; };
  const rng = (seed) => { let s = seed >>> 0; return () => { s = (Math.imul(s, 1664525) + 1013904223) >>> 0; return s / 4294967296; }; };
  const SVG0 = '<svg width="1080" height="1920" viewBox="0 0 1080 1920" xmlns="http://www.w3.org/2000/svg" style="position:absolute;left:0;top:0">';
  const talkAt = (t) => { const f = t * 30, i = Math.floor(f), k = f - i; const a = D.env[i] || 0, b = D.env[i + 1] || 0; const e = a + (b - a) * k; return clamp((e - 0.1) / 0.5, 0, 1); };

  function curExp(t, list) { let e = list[0][1]; for (const [tt, n] of list) if (t >= tt) e = n; return e; }
  function popScale(t, t0, d) { return t < t0 ? 0.001 : Math.max(0.001, backOut((t - t0) / (d || 0.35))); }

  const bed = (id, blanket) => `<g id="${id}">
<rect x="40" y="1040" width="640" height="270" rx="30" fill="#c98b4e"/>
<rect x="60" y="985" width="600" height="200" rx="40" fill="#ffffff"/>
<ellipse cx="140" cy="1030" rx="90" ry="40" fill="#ffd6e2"/>
<rect x="210" y="1010" width="450" height="190" rx="38" fill="${blanket}"/>
<path d="M260 1010 V1200 M340 1010 V1200 M420 1010 V1200 M500 1010 V1200 M580 1010 V1200" stroke="#ffffff" stroke-opacity=".35" stroke-width="10"/>
<rect x="70" y="1290" width="40" height="40" rx="8" fill="#a8743f"/><rect x="610" y="1290" width="40" height="40" rx="8" fill="#a8743f"/></g>`;

  const officeBack = (id) => `<defs><linearGradient id="${id}g" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#eaf4ff"/><stop offset="1" stop-color="#d4e6f7"/></linearGradient></defs>
<rect width="1080" height="1920" fill="url(#${id}g)"/>
<rect y="1290" width="1080" height="630" fill="#e8d6bd"/>
<path d="M0 1380 H1080 M0 1480 H1080 M0 1600 H1080 M0 1740 H1080" stroke="#dcc7a7" stroke-width="4"/>
<rect y="1270" width="1080" height="26" fill="#fff8ea"/>`;

  const deskFront = (id) => `<g id="${id}"><rect x="-10" y="1150" width="1100" height="40" rx="10" fill="#d9a066"/>
<rect x="-10" y="1190" width="1100" height="300" fill="#b9803f"/><rect x="-10" y="1490" width="1100" height="14" fill="#8f5f2c"/>
<rect x="40" y="1220" width="470" height="240" rx="14" fill="#a8702f"/><rect x="570" y="1220" width="470" height="240" rx="14" fill="#a8702f"/>
<rect x="250" y="1300" width="60" height="14" rx="7" fill="#f3d27a"/><rect x="780" y="1300" width="60" height="14" rx="7" fill="#f3d27a"/></g>`;

  const scenes = [];

  /* ---------- Cảnh 1: phòng trọ ---------- */
  scenes.push({
    build(el) {
      el.innerHTML = SVG0 + `<defs><linearGradient id="s1g" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#fff0d6"/><stop offset="1" stop-color="#ffdcae"/></linearGradient>
<radialGradient id="s1glow"><stop offset="0" stop-color="#ff8fc0" stop-opacity=".55"/><stop offset="1" stop-color="#ff8fc0" stop-opacity="0"/></radialGradient></defs>
<rect width="1080" height="1920" fill="url(#s1g)"/>
<rect y="1260" width="1080" height="660" fill="#efc08a"/><rect y="1240" width="1080" height="30" fill="#fff6e6"/>
<path d="M0 1340 H1080 M0 1430 H1080 M0 1540 H1080 M0 1670 H1080 M0 1820 H1080" stroke="#e3ae75" stroke-width="5"/>
<g><rect x="80" y="640" width="270" height="330" rx="8" fill="#ffffff"/><rect x="96" y="656" width="238" height="298" fill="#bfe3ff"/><circle cx="270" cy="730" r="30" fill="#ffe28a"/>
<ellipse cx="170" cy="800" rx="55" ry="22" fill="#fff"/><ellipse cx="205" cy="790" rx="40" ry="20" fill="#fff"/><path d="M96 805 H334 M215 656 V954" stroke="#fff" stroke-width="10"/>
<path d="M70 630 C110 700 100 860 66 980 L40 980 L40 630 Z" fill="#ff9fb6"/><path d="M360 630 C320 700 330 860 364 980 L390 980 L390 630 Z" fill="#ff9fb6"/></g>
<g><rect x="420" y="700" width="230" height="170" rx="10" fill="#fff"/><rect x="434" y="714" width="202" height="142" fill="#bfe9d6"/><circle cx="560" cy="765" r="26" fill="#ffd35c"/><path d="M434 856 L500 780 L550 830 L590 790 L636 856 Z" fill="#7cc8a0"/></g>
<g id="s1door"><rect x="800" y="560" width="210" height="710" fill="#fffbe2"/><rect x="800" y="560" width="210" height="710" fill="#ffe9a8" opacity=".5"/>
<g id="s1leaf"><rect x="800" y="560" width="200" height="710" rx="6" fill="#c98b4e"/><rect x="824" y="590" width="152" height="270" rx="8" fill="#b57a3f"/><rect x="824" y="890" width="152" height="340" rx="8" fill="#b57a3f"/><circle cx="946" cy="930" r="12" fill="#f3d27a"/></g></g>
` + bed("s1bed", "#9ad0f5") + `
<g id="s1ph"><ellipse cx="0" cy="40" rx="240" ry="190" fill="url(#s1glow)" id="s1pg"/>
<g id="s1arcs" fill="none" stroke="#ff6f9c" stroke-width="10" stroke-linecap="round"><path d="M-95 -40 q-26 40 0 80"/><path d="M-125 -60 q-40 60 0 120"/><path d="M95 -40 q26 40 0 80"/><path d="M125 -60 q40 60 0 120"/></g>
<g id="s1pb"><rect x="-52" y="-92" width="104" height="184" rx="18" fill="#2a2433"/><rect x="-43" y="-82" width="86" height="164" rx="10" fill="#ffd9ec"/>
<rect x="-34" y="-66" width="68" height="28" rx="8" fill="#fff"/><circle cx="-22" cy="-52" r="7" fill="#ff8fab"/><rect x="-10" y="-58" width="38" height="6" rx="3" fill="#c9b6d4"/><rect x="-10" y="-48" width="26" height="6" rx="3" fill="#e0d4e8"/>
<rect x="-34" y="-28" width="68" height="28" rx="8" fill="#fff"/><circle cx="-22" cy="-14" r="7" fill="#7cc8ff"/><rect x="-10" y="-20" width="38" height="6" rx="3" fill="#c9b6d4"/><rect x="-10" y="-10" width="26" height="6" rx="3" fill="#e0d4e8"/></g></g>
<g id="s1c">` + Ch.markup("c1_") + `</g></svg>`;
      this.C = Ch.bind("c1_");
    },
    update(t) {
      const lt = t - L[0].s, ph = 0.35;
      // cửa mở lúc cô chạy tới
      const dk = 1 - 0.78 * easeOut((lt - 0.9) / 0.5);
      tf("s1leaf", `translate(1000 0) scale(${dk.toFixed(3)} 1) translate(-1000 0)`);
      // chạy ra cửa
      const run = clamp((lt - ph) / 1.45, 0, 1);
      const x = lerp(640, 930, easeIn(run) * 0.55 + run * 0.45);
      const out = clamp((lt - 1.55) / 0.4, 0, 1);
      const sc = 1.75 * (1 - 0.25 * out);
      Ch.place(this.C, x, 1300 - 20 * out, sc, 1);
      show("c1_ch", lt < 2.1);
      op("c1_ch", 1 - out);
      Ch.pose(this.C, { t: lt, exp: "binh-thuong", pose: lt > ph && lt < 2.0 ? "run" : "", talk: -1 });
      // điện thoại rung
      const buzz = [0.2, 0.9, 1.6, 2.3, 3.0, 3.7].some((b) => lt >= b && lt < b + 0.45);
      const j = buzz ? Math.sin(lt * 70) * 5 : 0;
      tf("s1ph", `translate(${(400 + j).toFixed(1)} 1015) rotate(${-9 + (buzz ? Math.sin(lt * 55) * 2 : 0)})`);
      op("s1arcs", buzz ? 1 : 0.0);
      op("s1pg", buzz ? 0.95 : 0.35);
    },
  });

  /* ---------- Cảnh 2: đường phố, xe tay ga trắng ---------- */
  const wheel = (id) => `<circle r="55" fill="#3a3347"/><circle r="34" fill="#e6e0f0"/><g id="${id}" stroke="#bdb4d0" stroke-width="6"><path d="M-34 0 H34 M0 -34 V34 M-24 -24 L24 24 M24 -24 L-24 24"/></g><circle r="10" fill="#8f86a8"/>`;
  const farBand = () => { const c = ["#ffd6e2", "#cfeec9", "#fff0b5", "#d7d0ff", "#ffe3c4", "#c9ecf5"]; let s = ""; for (let i = 0; i < 9; i++) { const x = i * 120, h = 260 + ((i * 97) % 180), col = c[i % 6]; s += `<rect x="${x}" y="${1160 - h}" width="114" height="${h}" rx="6" fill="${col}"/>`; for (let r = 0; r < Math.floor(h / 70); r++) for (let q = 0; q < 2; q++) s += `<rect x="${x + 14 + q * 52}" y="${1160 - h + 22 + r * 66}" width="34" height="38" rx="4" fill="#ffffff" opacity=".75"/>`; } return s; };
  const nearBand = () => { let s = ""; [100, 400, 690, 940].forEach((x, i) => { s += `<rect x="${x - 9}" y="1000" width="18" height="170" fill="#a8743f"/><circle cx="${x}" cy="960" r="${74 + (i % 2) * 10}" fill="${i % 2 ? '#8fd694' : '#7bc88a'}"/><circle cx="${x - 30}" cy="990" r="46" fill="#9be0a0"/>`; }); return s; };
  scenes.push({
    build(el) {
      el.innerHTML = SVG0 + `<defs><linearGradient id="s2g" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#a6dcff"/><stop offset="1" stop-color="#e8f8ff"/></linearGradient></defs>
<rect width="1080" height="1920" fill="url(#s2g)"/>
<circle cx="860" cy="520" r="96" fill="#ffe28a"/><circle cx="860" cy="520" r="130" fill="#ffe28a" opacity=".3"/>
<g id="s2cl"><g fill="#fff"><ellipse cx="200" cy="470" rx="110" ry="42"/><ellipse cx="270" cy="445" rx="70" ry="40"/><ellipse cx="640" cy="640" rx="100" ry="36"/><ellipse cx="700" cy="618" rx="60" ry="34"/></g></g>
<g id="s2far"><g id="s2fa">${farBand()}</g><g id="s2fb" transform="translate(1080 0)">${farBand()}</g></g>
<rect y="1160" width="1080" height="70" fill="#e8d7c3"/>
<g id="s2near"><g id="s2na">${nearBand()}</g><g id="s2nb" transform="translate(1080 0)">${nearBand()}</g></g>
<rect y="1230" width="1080" height="700" fill="#8f94ad"/><rect y="1230" width="1080" height="12" fill="#767b96"/>
<g id="s2dash" fill="#fff"></g>
<g id="s2sp" stroke="#ffffff" stroke-width="10" stroke-linecap="round" opacity=".0"><path d="M60 1020 H300 M20 1120 H380 M80 1230 H340 M30 1300 H260"/></g>
<g id="s2rig"><g id="s2back"><g transform="translate(-170 -55)">${wheel("s2rw")}</g><g transform="translate(170 -55)">${wheel("s2fw")}</g>
<path d="M150 -325 L170 -55" stroke="#c9c2d9" stroke-width="14" stroke-linecap="round"/></g>
<g id="s2cc">${Ch.markup("c2_")}</g>
<g id="s2front"><path d="M-265 -150 C-265 -230 -150 -242 -60 -224 C-20 -212 -10 -150 -5 -95 L-5 -78 L-215 -78 C-262 -78 -265 -120 -265 -150 Z" fill="#ffffff" stroke="#d9d3e6" stroke-width="5"/>
<path d="M-250 -232 C-250 -256 -60 -258 -40 -232 L-40 -214 L-250 -214 Z" fill="#4a3b57"/>
<rect x="-20" y="-100" width="135" height="26" rx="12" fill="#f3f1f8" stroke="#d9d3e6" stroke-width="4"/>
<path d="M100 -100 C105 -200 125 -290 140 -332 L180 -326 C172 -270 168 -180 166 -95 Z" fill="#ffffff" stroke="#d9d3e6" stroke-width="5"/>
<rect x="116" y="-362" width="92" height="22" rx="11" fill="#3a3347"/><circle cx="200" cy="-318" r="20" fill="#fff3b0" stroke="#d9d3e6" stroke-width="4"/>
<path d="M112 -72 A62 62 0 0 1 232 -72 L222 -72 A52 52 0 0 0 122 -72 Z" fill="#ffffff" stroke="#d9d3e6" stroke-width="4"/>
<rect x="-272" y="-182" width="14" height="30" rx="6" fill="#ff6f6f"/></g></g>
<div></div></svg>`.replace("<div></div>", "");
      this.C = Ch.bind("c2_");
      const d = $("s2dash"); let s = ""; for (let i = 0; i < 9; i++) s += `<rect x="${i * 160}" y="1560" width="90" height="16" rx="8"/>`; d.innerHTML = s;
      this.dash = s;
    },
    update(t) {
      const v0 = 1000, s0 = L[1].s, tS = M(1, 4), tE = M(1, 6.4), td = M(1, 14.5), Ta = 1.0;
      let S = 0, v = v0;
      const t0 = t - s0;
      if (t < tS) { S = v0 * t0; }
      else if (t < tE) { const dt = t - tS, T = tE - tS; S = v0 * (tS - s0) + v0 * (dt - dt * dt / (2 * T)); v = v0 * (1 - dt / T); }
      else { const T = tE - tS; S = v0 * (tS - s0) + v0 * T / 2; v = 0; }
      let dep = 0;
      if (t > td) { const dt = t - td; dep = v0 * (dt < Ta ? dt * dt * dt / (3 * Ta * Ta) : Ta / 3 + (dt - Ta)); v = v0 * Math.min(1, dt / Ta) * Math.min(1, dt / Ta); S += dep; }
      const wrap = (k, id1, id2) => { const o = (S * k) % 1080; tf(id1, `translate(${(-o).toFixed(1)} 0)`); tf(id2, `translate(${(1080 - o).toFixed(1)} 0)`); };
      wrap(0.3, "s2fa", "s2fb"); wrap(0.7, "s2na", "s2nb");
      tf("s2dash", `translate(${(-(S % 160)).toFixed(1)} 0)`);
      tf("s2cl", `translate(${(-(S * 0.08) % 1080).toFixed(1)} 0)`);
      op("s2sp", clamp(v / v0, 0, 1) * 0.8);
      tf("s2sp", `translate(${(-(S * 2) % 90).toFixed(1)} 0)`);
      const rotw = (S / 55) * 57.3;
      tf("s2rw", `rotate(${rotw.toFixed(1)})`); tf("s2fw", `rotate(${rotw.toFixed(1)})`);
      // xe: nhún khi phanh, chồm lên khi rồ ga
      const brake = t >= tE ? Math.exp(-(t - tE) * 6) * Math.sin((t - tE) * 16) : 0;
      const pitch = (t >= tS && t < tE ? 1.6 : 0) + brake * 3 - (t > td ? Math.min(1, (t - td) / Ta) * 3 : 0);
      const bob = v > 0 ? Math.sin(t0 * 30) * 1.6 : 0;
      const X = 540 + dep * 0.9;
      tf("s2rig", `translate(${X.toFixed(1)} ${(1368 + bob).toFixed(1)}) rotate(${pitch.toFixed(2)} -170 -55) scale(1.5)`);
      Ch.place(this.C, -130, -158, 1.2, 1);
      const exp = curExp(t, [[0, "binh-thuong"], [M(1, 7), "ngac-nhien"], [M(1, 10), "que"], [M(1, 14), "met"]]);
      const ps = t >= tE + 0.05 && t < M(1, 10) ? "bag" : "";
      Ch.pose(this.C, { t: t0, exp, pose: ps, talk: talkAt(t), bagHz: 3, sweat: exp === "que" || exp === "met" });
    },
  });

  /* ---------- Cảnh 3: xe bánh mì ---------- */
  const qr = () => { const r = rng(7); let s = '<rect x="0" y="0" width="150" height="150" rx="12" fill="#fff"/>'; for (let y = 0; y < 9; y++) for (let x = 0; x < 9; x++) { const fin = (x < 3 && y < 3) || (x > 5 && y < 3) || (x < 3 && y > 5); if (!fin && r() > 0.5) s += `<rect x="${14 + x * 14.7}" y="${14 + y * 14.7}" width="13" height="13" fill="#2a2033"/>`; }
    [[14, 14], [105, 14], [14, 105]].forEach(([x, y]) => { s += `<rect x="${x}" y="${y}" width="31" height="31" fill="#2a2033"/><rect x="${x + 6}" y="${y + 6}" width="19" height="19" fill="#fff"/><rect x="${x + 10}" y="${y + 10}" width="11" height="11" fill="#2a2033"/>`; }); return s; };
  scenes.push({
    build(el) {
      let loaves = ""; for (let i = 0; i < 6; i++) { const x = 170 + i * 68, y = 850 + (i % 2) * 120; loaves += `<g transform="translate(${x} ${y}) rotate(${-25 + (i % 3) * 8})"><rect x="-22" y="-100" width="44" height="200" rx="22" fill="#e8b46a"/><path d="M-12 -60 l24 16 M-12 -10 l24 16 M-12 40 l24 16" stroke="#c98b4e" stroke-width="6" stroke-linecap="round"/></g>`; }
      let stripes = ""; for (let i = 0; i < 8; i++) stripes += `<path d="M${60 + i * 80} 560 L${60 + (i + 1) * 80} 560 L${80 + (i + 1) * 70} 760 L${80 + i * 70} 760 Z" fill="${i % 2 ? '#ffffff' : '#ff7a7a'}"/>`;
      el.innerHTML = SVG0 + `<defs><linearGradient id="s3g" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#ffe9c9"/><stop offset="1" stop-color="#ffd6b0"/></linearGradient></defs>
<rect width="1080" height="1920" fill="url(#s3g)"/>
<g fill="#fff6e8"><rect x="660" y="300" width="160" height="200" rx="8"/><rect x="860" y="300" width="160" height="200" rx="8"/><rect x="660" y="600" width="160" height="200" rx="8"/><rect x="860" y="600" width="160" height="200" rx="8"/></g>
<g fill="#bfe3ff"><rect x="672" y="312" width="136" height="176" rx="4"/><rect x="872" y="312" width="136" height="176" rx="4"/><rect x="672" y="612" width="136" height="176" rx="4"/><rect x="872" y="612" width="136" height="176" rx="4"/></g>
<rect y="1330" width="1080" height="590" fill="#cfc7d6"/><rect y="1330" width="1080" height="24" fill="#e8d7c3"/>
<path d="M0 1500 H1080 M0 1650 H1080 M0 1800 H1080" stroke="#b9b0c4" stroke-width="5"/>
<g id="s3cart"><path d="M80 560 H660 V770 H80 Z" fill="none"/>${stripes}<rect x="60" y="745" width="620" height="22" rx="11" fill="#ff7a7a"/>
<rect x="70" y="760" width="14" height="570" fill="#a8743f"/><rect x="650" y="760" width="14" height="570" fill="#a8743f"/>
<rect x="100" y="780" width="540" height="380" rx="14" fill="#e8f6ff" fill-opacity=".85" stroke="#8fb8d6" stroke-width="8"/>
<path d="M104 970 H636" stroke="#8fb8d6" stroke-width="8"/>${loaves}
<rect x="80" y="1150" width="580" height="200" rx="18" fill="#4aa8a0"/><rect x="80" y="1150" width="580" height="22" rx="10" fill="#6cc5bd"/>
<g transform="translate(230 1182)">${qr()}</g>
<circle cx="190" cy="1350" r="46" fill="#3a3347"/><circle cx="190" cy="1350" r="22" fill="#e6e0f0"/><circle cx="550" cy="1350" r="46" fill="#3a3347"/><circle cx="550" cy="1350" r="22" fill="#e6e0f0"/></g>
<g id="s3co"><circle cx="0" cy="0" r="210" fill="#ffffff" fill-opacity=".96" stroke="#2a2033" stroke-width="8"/>
<g id="s3w"><g transform="translate(0 40)"><rect x="-130" y="-80" width="260" height="170" rx="22" fill="#b0703a"/><rect x="-116" y="-66" width="232" height="142" rx="14" fill="#fff0d6"/><path d="M-116 -20 H116" stroke="#e8c9a0" stroke-width="5"/><rect x="-130" y="-100" width="260" height="46" rx="22" fill="#c98b4e" transform="rotate(-8 -130 -80)"/><circle cx="0" cy="30" r="9" fill="#e8c9a0"/></g>
<g id="s3n"><g transform="translate(0 20) rotate(-6)"><rect x="-95" y="-48" width="190" height="96" rx="12" fill="#b8e6c1" stroke="#6fbf8a" stroke-width="5"/><circle cx="-62" cy="0" r="22" fill="#8fd1a0"/><text x="22" y="14" text-anchor="middle" font-size="40" font-weight="800" fill="#1f6b3d" font-family="Segoe UI,Arial">10.000đ</text></g></g></g>
<g id="s3t"><g transform="rotate(-5)"><rect x="-150" y="-70" width="300" height="140" rx="26" fill="#ff6f8f"/><circle cx="-122" cy="-44" r="10" fill="#fff"/><text x="0" y="22" text-anchor="middle" font-size="62" font-weight="800" fill="#fff" font-family="Segoe UI,Arial">25.000đ</text></g></g></g>
<g id="s3c">${Ch.markup("c3_")}</g></svg>`;
      this.C = Ch.bind("c3_");
    },
    update(t) {
      const s0 = L[2].s, t0 = t - s0, tArr = M(2, 2), tW = M(2, 4), tN = M(2, 8), tP = M(2, 13.6);
      const x = lerp(1250, 800, easeOut((t - s0 + 0.2) / (tArr - s0 + 0.2)));
      const walking = t < tArr;
      const wiggle = t > tN ? 0 : 0;
      const exp = curExp(t, [[0, "binh-thuong"], [M(2, 6), "que"]]);
      const reach = clamp((t - tW) / 0.3, 0, 1);
      Ch.place(this.C, x, 1352, 2.0, 1);
      Ch.pose(this.C, { t: t0, exp, pose: walking ? "walk" : "", talk: talkAt(t), aR: 44 * easeOut(reach), aL: -22 * easeOut(reach), sweat: t >= tP, headRot: 0 });
      // khung gợi ý ví và tiền
      const co = popScale(t, tW, 0.4) * (t < tP + 0.05 ? 1 : 1);
      tf("s3co", `translate(360 930) scale(${co.toFixed(3)})`);
      const swap = clamp((t - tP) / 0.18, 0, 1);
      show("s3w", t < tP + 0.1); show("s3n", t >= tN && t < tP + 0.1);
      const ns = popScale(t, tN, 0.35);
      tf("s3n", `scale(${ns.toFixed(3)})`);
      show("s3t", t >= tP);
      const sh = t >= tP && t < tP + 0.9 ? Math.sin((t - tP) * 38) * 4 * (1 - (t - tP) / 0.9) : 0;
      tf("s3t", `rotate(${sh.toFixed(2)}) scale(${popScale(t, tP, 0.35).toFixed(3)})`);
    },
  });

  /* ---------- Cảnh 4: văn phòng, phòng họp ---------- */
  const person = (id, x, shirt, hair) => `<g id="${id}" transform="translate(${x} 0)"><rect x="-34" y="960" width="68" height="100" rx="26" fill="${shirt}"/><circle cx="0" cy="925" r="32" fill="#f6cfb0"/><path d="M-32 922 C-32 888 32 888 32 922 C20 906 -16 906 -32 922 Z" fill="${hair}"/><circle cx="-11" cy="928" r="3" fill="#3a2430"/><circle cx="11" cy="928" r="3" fill="#3a2430"/><path d="M-7 940 q7 5 14 0" stroke="#b5485f" stroke-width="3" fill="none" stroke-linecap="round"/></g>`;
  const room = (x, id, who) => `<g><rect x="${x}" y="480" width="470" height="770" rx="14" fill="#f6fbff"/><rect x="${x + 40}" y="540" width="390" height="190" rx="10" fill="#fff" stroke="#c9d6e3" stroke-width="6"/>${who ? '<path d="M' + (x + 80) + ' 610 q40 -30 80 0 t80 0 M' + (x + 80) + ' 670 h200" stroke="#7aa0ff" stroke-width="8" fill="none" stroke-linecap="round"/>' : ""}
<ellipse cx="${x + 235}" cy="1040" rx="180" ry="52" fill="#c98b4e"/><rect x="${x + 55}" y="1040" width="360" height="190" fill="#f6fbff" opacity="0"/>
<g fill="#6cc5b0"><rect x="${x + 40}" y="1060" width="56" height="90" rx="22"/><rect x="${x + 374}" y="1060" width="56" height="90" rx="22"/><rect x="${x + 100}" y="1120" width="56" height="90" rx="22"/><rect x="${x + 314}" y="1120" width="56" height="90" rx="22"/></g>${who || ""}
<rect x="${x}" y="480" width="470" height="770" rx="14" fill="#bfe3ff" fill-opacity=".28" stroke="#9fb6cc" stroke-width="12"/><path d="M${x + 60} 520 L${x + 150} 520 L${x + 60} 640 Z" fill="#fff" opacity=".4"/></g>`;
  scenes.push({
    build(el) {
      const who = person("s4p1", 90, "#ff9f6e", "#2a2033") + person("s4p2", 190, "#7aa0ff", "#8a5a3c") + person("s4p3", 290, "#ffd35c", "#3a2430") + person("s4p4", 380, "#b79cff", "#5a3427");
      el.innerHTML = SVG0 + officeBack("s4") + room(50, "s4r1", "") + `<g transform="translate(560 0)">${room(0, "s4r2", who)}</g>
<g id="s4z"><g transform="translate(0 0)"><path d="M-130 -70 h260 a30 30 0 0 1 30 30 v70 a30 30 0 0 1 -30 30 h-120 l-30 36 l-10 -36 h-100 a30 30 0 0 1 -30 -30 v-70 a30 30 0 0 1 30 -30 z" fill="#4f9dff"/><circle cx="-60" cy="-5" r="18" fill="#fff"/><circle cx="0" cy="-5" r="18" fill="#fff"/><circle cx="60" cy="-5" r="18" fill="#fff"/><path d="M-80 28 q20 -20 40 0 M-20 28 q20 -20 40 0 M40 28 q20 -20 40 0" stroke="#fff" stroke-width="6" fill="none"/></g></g>
<g id="s4c">${Ch.markup("c4_")}</g></svg>`;
      this.C = Ch.bind("c4_");
    },
    update(t) {
      const s0 = L[3].s, t0 = t - s0;
      const x = lerp(-200, 300, easeOut(t0 / 0.8));
      const exp = curExp(t, [[0, "binh-thuong"], [M(3, 5), "ngac-nhien"], [M(3, 9), "que"]]);
      const gz = t >= M(3, 6) ? [10, 0] : [0, 0];
      Ch.place(this.C, x, 1352, 2.0, 1);
      Ch.pose(this.C, { t: t0, exp, pose: t0 < 0.8 ? "walk" : "", talk: talkAt(t), gaze: exp === "ngac-nhien" ? gz : [0, 0], blinkOff: 0.5 });
      for (let i = 1; i <= 4; i++) { const n = Math.sin(t * 2.5 + i * 1.3) * 3; tf("s4p" + i, `translate(${[90, 190, 290, 380][i - 1]} ${n.toFixed(1)})`); }
      const pz = popScale(t, M(3, 12), 0.4);
      tf("s4z", `translate(770 330) rotate(${(-4 + Math.sin(t * 6) * 2).toFixed(1)}) scale(${pz.toFixed(3)})`);
    },
  });

  /* ---------- Cảnh 5: bàn làm việc, mượn máy ---------- */
  scenes.push({
    build(el) {
      el.innerHTML = SVG0 + officeBack("s5") + `<g><rect x="90" y="470" width="430" height="360" rx="10" fill="#fff"/><rect x="106" y="486" width="398" height="328" fill="#bfe3ff"/><path d="M106 650 L170 590 L220 640 L290 560 L360 650 L420 600 L504 680 V814 H106 Z" fill="#9fd1ee"/><path d="M305 486 V814 M106 650 H504" stroke="#fff" stroke-width="10"/></g>
<g id="s5pl"><rect x="880" y="1090" width="54" height="60" rx="8" fill="#ff9f6e"/><path d="M907 1090 C860 1030 870 990 907 960 C945 990 955 1030 907 1090 Z" fill="#7bc88a"/></g>
<g id="s5ch">${Ch.markup("c5_", { phoneBody: "#2f6fe0", phoneScreen: "#cfe6ff" })}</g>
<g id="s5th"><circle cx="520" cy="660" r="14" fill="#fff" stroke="#2a2033" stroke-width="4"/><circle cx="560" cy="610" r="22" fill="#fff" stroke="#2a2033" stroke-width="4"/>
<g id="s5cloud"><path d="M600 560 C590 480 700 450 740 500 C780 440 890 470 880 550 C940 580 920 680 850 680 H650 C580 690 560 600 600 560 Z" fill="#fff" stroke="#2a2033" stroke-width="6"/>
<text id="s5q" x="740" y="620" text-anchor="middle" font-size="96" font-weight="800" fill="#e0588a" font-family="Segoe UI,Arial">? ? ?</text></g></g>
${deskFront("s5d")}
<g><rect x="720" y="960" width="260" height="160" rx="12" fill="#2a2033"/><rect x="734" y="974" width="232" height="132" rx="6" fill="#7aa0ff"/><rect x="835" y="1120" width="30" height="30" fill="#2a2033"/></g>
<rect x="530" y="1128" width="90" height="26" rx="8" fill="#e8e0f0"/></svg>`;
      this.C = Ch.bind("c5_");
    },
    update(t) {
      const s0 = L[4].s, t0 = t - s0;
      const exp = curExp(t, [[0, "binh-thuong"], [M(4, 8), "que"], [M(4, 16), "met"]]);
      const up = clamp((t - M(4, 8)) / 0.4, 0, 1) * (t < M(4, 16) ? 1 : 0.3);
      const hold = clamp((t - M(4, 1)) / 0.4, 0, 1);
      Ch.place(this.C, 400, 1320, 2.0, 1);
      Ch.pose(this.C, { t: t0, exp, pose: "", holdPhone: true, aR: 44 * easeOut(hold), aL: -30 * easeOut(hold), talk: talkAt(t), gaze: [-4 * up, -7 * up], headRot: -5 * up, sweat: exp === "que" });
      const pc = popScale(t, M(4, 9), 0.45);
      tf("s5th", `translate(0 ${(Math.sin(t * 2) * 4).toFixed(1)})`);
      show("s5th", t >= M(4, 9) - 0.05);
      tf("s5cloud", `translate(740 620) scale(${pc.toFixed(3)}) translate(-740 -620)`);
      const q = 1 + (t >= M(4, 16) ? 0.12 * Math.sin((t - M(4, 16)) * 8) : 0);
      tf("s5q", `translate(740 620) scale(${q.toFixed(3)}) translate(-740 -620)`);
    },
  });

  /* ---------- Cảnh 6: ngả ghế, sờ túi xách ---------- */
  scenes.push({
    build(el) {
      let tick = ""; for (let i = 0; i < 12; i++) tick += `<ellipse cx="0" cy="0" rx="0" ry="0" opacity="0"/>`;
      let ticks = ""; for (let i = 0; i < 12; i++) { const x = 30 + (i % 6) * 38, y = 50 + Math.floor(i / 6) * 90; ticks += `<path id="s6t${i}" d="M${x} ${y} v66" stroke="#e0588a" stroke-width="9" stroke-linecap="round" opacity="0"/>`; }
      el.innerHTML = SVG0 + officeBack("s6") + `<g><circle cx="800" cy="600" r="118" fill="#fff" stroke="#2a2033" stroke-width="10"/>
<g stroke="#2a2033" stroke-width="6" stroke-linecap="round"><path d="M800 500 v18 M900 600 h-18 M800 700 v-18 M700 600 h18"/></g>
<path d="M800 600 V520" stroke="#2a2033" stroke-width="9" stroke-linecap="round"/><path id="s6h" d="M800 600 H870" stroke="#e0588a" stroke-width="12" stroke-linecap="round"/><circle cx="800" cy="600" r="10" fill="#2a2033"/></g>
<g transform="translate(130 480) rotate(-4)"><rect width="300" height="230" rx="10" fill="#ffe28a"/>${ticks}</g>
<g id="s6chair"><rect x="330" y="760" width="300" height="470" rx="60" fill="#6cc5b0"/><rect x="480" y="1180" width="22" height="200" fill="#8c8aa0"/><path d="M360 1380 H620" stroke="#8c8aa0" stroke-width="14" stroke-linecap="round"/></g>
<g id="s6ch">${Ch.markup("c6_")}</g>
${deskFront("s6d")}
<g><rect x="720" y="960" width="260" height="160" rx="12" fill="#2a2033"/><rect x="734" y="974" width="232" height="132" rx="6" fill="#5a4a7a"/><rect x="835" y="1120" width="30" height="30" fill="#2a2033"/></g></svg>`;
      this.C = Ch.bind("c6_");
    },
    update(t) {
      const s0 = L[5].s, t0 = t - s0, tb = M(5, 6);
      const exp = curExp(t, [[0, "binh-thuong"], [M(5, 3), "met"]]);
      const lean = clamp((t - M(5, 3)) / 0.6, 0, 1);
      Ch.place(this.C, 540, 1320, 2.0, 1, -7 * easeOut(lean), 150, 340);
      const tapping = t >= tb;
      Ch.pose(this.C, { t: t0, exp, pose: tapping ? "bag" : "", talk: talkAt(t), headRot: 5 * lean, bagHz: 2.4, sweat: false });
      const n = tapping ? clamp(Math.floor((t - tb) / (E(5) + 0.4 - tb) * 12) + 1, 0, 12) : 0;
      for (let i = 0; i < 12; i++) op("s6t" + i, i < n ? 1 : 0);
    },
  });

  /* ---------- Cảnh 7: phòng trọ buổi tối, tin nhắn dồn dập ---------- */
  const NB = 30;
  scenes.push({
    build(el) {
      let sx = ""; const r = rng(11); for (let i = 0; i < 14; i++) sx += `<circle cx="${120 + r() * 190}" cy="${670 + r() * 130}" r="${2 + r() * 3}" fill="#fff"/>`;
      let bub = ""; const cols = ["#ff8fab", "#7cc8ff", "#ffd35c", "#9be0a0", "#b79cff", "#ff9f6e"];
      for (let i = 0; i < NB; i++) bub += `<g id="s7b${i}" opacity="0"><rect x="-130" y="-42" width="260" height="84" rx="26" fill="#ffffff" stroke="#2a2033" stroke-width="5"/><circle cx="-88" cy="0" r="26" fill="${cols[i % 6]}"/><rect x="-52" y="-18" width="${100 + (i % 3) * 20}" height="12" rx="6" fill="#c9b6d4"/><rect x="-52" y="4" width="${70 + (i % 4) * 14}" height="12" rx="6" fill="#e0d4e8"/><circle cx="100" cy="0" r="14" fill="#e0588a"/><circle cx="100" cy="0" r="5" fill="#fff"/></g>`;
      el.innerHTML = SVG0 + `<defs><linearGradient id="s7g" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#ffe0ec"/><stop offset="1" stop-color="#ffcfa8"/></linearGradient><linearGradient id="s7s" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#7a6fd6"/><stop offset="1" stop-color="#ffb08a"/></linearGradient></defs>
<rect width="1080" height="1920" fill="url(#s7g)"/><rect y="1260" width="1080" height="660" fill="#e8b27a"/><rect y="1240" width="1080" height="30" fill="#fff0e0"/>
<path d="M0 1340 H1080 M0 1430 H1080 M0 1540 H1080 M0 1670 H1080 M0 1820 H1080" stroke="#d99f62" stroke-width="5"/>
<g><rect x="80" y="640" width="270" height="330" rx="8" fill="#fff"/><rect x="96" y="656" width="238" height="298" fill="url(#s7s)"/><circle cx="270" cy="740" r="26" fill="#fff6c8"/>${sx}<path d="M215 656 V954 M96 805 H334" stroke="#fff" stroke-width="10"/></g>
<path d="M20 240 Q540 340 1060 240" stroke="#a8743f" stroke-width="4" fill="none"/>
<g fill="#ffe28a"><circle cx="120" cy="268" r="14"/><circle cx="330" cy="297" r="14"/><circle cx="540" cy="305" r="14"/><circle cx="750" cy="297" r="14"/><circle cx="960" cy="268" r="14"/></g>
` + bed("s7bed", "#b79cff") + `<g><rect x="860" y="1060" width="160" height="200" rx="14" fill="#c98b4e"/><path d="M940 1060 L900 880 H980 Z" fill="#fff6c8"/><rect x="936" y="880" width="8" height="190" fill="#8c8aa0"/></g>
<g id="s7c">${Ch.markup("c7_")}</g>${bub}</svg>`;
      this.C = Ch.bind("c7_");
    },
    update(t) {
      const s0 = L[6].s, t0 = t - s0;
      const x = lerp(1250, 560, easeOut(t0 / 0.8));
      const exp = curExp(t, [[0, "binh-thuong"], [M(6, 4), "ngac-nhien"], [M(6, 8), "cuoi"]]);
      const hold = clamp((t - M(6, 2) + 0.2) / 0.4, 0, 1);
      Ch.place(this.C, x, 1300, 2.0, 1);
      Ch.pose(this.C, { t: t0, exp, pose: t0 < 0.8 ? "walk" : "", holdPhone: true, aR: t0 < 0.8 ? undefined : 44 * easeOut(hold), aL: t0 < 0.8 ? undefined : -30 * easeOut(hold), talk: talkAt(t), sweat: exp === "cuoi" });
      const px = x + (147.9 - 150) * 2, py = 1300 + (267.8 - 410) * 2;
      const r = rng(23);
      for (let i = 0; i < NB; i++) {
        const side = r(), ax = side < 0.38 ? 190 + r() * 90 : side < 0.76 ? 760 + r() * 40 : 330 + r() * 360, ay = side < 0.38 || side >= 0.76 ? 330 + r() * 780 : 300 + r() * 120;
        const tx = clamp(ax, 190, 800), ty = clamp(ay, 360, 1180);
        const ts = D.pings[i], a = t - ts, life = 1.9;
        if (a < 0 || a > life) { op("s7b" + i, 0); continue; }
        const k = easeOut(a / 0.35), out = clamp((a - (life - 0.4)) / 0.4, 0, 1);
        const bx = lerp(px, tx, k), by = lerp(py, ty, k) - Math.sin(k * Math.PI) * 60;
        const sc = 0.85 * (0.3 + 0.7 * backOut(a / 0.4)) * (1 - 0.4 * out);
        tf("s7b" + i, `translate(${bx.toFixed(1)} ${by.toFixed(1)}) rotate(${((i % 5) - 2) * 2.5}) scale(${sc.toFixed(3)})`);
        op("s7b" + i, 1 - out);
      }
    },
  });

  window.SCENES = scenes;
})();
