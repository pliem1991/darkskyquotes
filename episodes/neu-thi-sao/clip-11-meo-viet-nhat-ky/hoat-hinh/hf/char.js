/* Nhân vật cô gái văn phòng: nét vẽ lấy nguyên từ nhan-vat/co-gai-van-phong.html, chuyển động tính theo thời gian (không dùng CSS animation). */
(function () {
  const EXPS = ["binh-thuong", "ngac-nhien", "que", "met", "cuoi"];
  const clamp = (x, a, b) => Math.max(a, Math.min(b, x));
  const TAU = Math.PI * 2;

  function markup(p, o) {
    o = o || {};
    const pb = o.phoneBody || "#2a2433", ps = o.phoneScreen || "#ffd9ec";
    return `<g id="${p}ch">
<ellipse id="${p}shadow" cx="150" cy="420" rx="66" ry="9" fill="#000" opacity=".12"/>
<g id="${p}body">
<g id="${p}hairBack"><path d="M86 104 C78 150 82 196 92 226 C110 236 190 236 208 226 C218 196 222 150 214 104 Z" fill="#5a3427"/></g>
<g id="${p}legL"><rect x="125" y="318" width="17" height="84" rx="8" fill="#f6cfb0"/><ellipse cx="131" cy="406" rx="15" ry="8" fill="#fff" stroke="#e3d6e8" stroke-width="2"/></g>
<g id="${p}legR"><rect x="158" y="318" width="17" height="84" rx="8" fill="#f6cfb0"/><ellipse cx="169" cy="406" rx="15" ry="8" fill="#fff" stroke="#e3d6e8" stroke-width="2"/></g>
<g id="${p}armL"><rect x="96" y="196" width="22" height="46" rx="11" fill="#ffc2d4"/><rect x="99" y="236" width="16" height="40" rx="8" fill="#f6cfb0"/><circle cx="107" cy="280" r="10" fill="#f6cfb0"/></g>
<path d="M112 280 L188 280 L204 336 Q150 346 96 336 Z" fill="#3e4f86"/>
<path d="M120 300 L116 334 M150 300 L150 340 M180 300 L184 334" stroke="#34436f" stroke-width="2"/>
<rect x="108" y="188" width="84" height="100" rx="24" fill="#ffd6e2"/>
<path d="M150 192 Q134 188 128 196 Q136 212 150 206 Q164 212 172 196 Q166 188 150 192 Z" fill="#fff"/>
<circle cx="150" cy="222" r="2.2" fill="#f2a6bd"/><circle cx="150" cy="244" r="2.2" fill="#f2a6bd"/><circle cx="150" cy="266" r="2.2" fill="#f2a6bd"/>
<path d="M184 196 L122 286" stroke="#a8743f" stroke-width="5" stroke-linecap="round"/>
<rect x="108" y="278" width="30" height="24" rx="7" fill="#c98b4e"/><circle cx="123" cy="290" r="3" fill="#f3d27a"/>
<circle id="${p}hb" cx="120" cy="290" r="10" fill="#f6cfb0" style="display:none"/>
<g id="${p}armR"><rect x="182" y="196" width="22" height="46" rx="11" fill="#ffc2d4"/><rect x="185" y="236" width="16" height="40" rx="8" fill="#f6cfb0"/>
<g id="${p}phone" style="display:none"><rect x="198" y="266" width="16" height="28" rx="3" fill="${pb}"/><rect x="200" y="269" width="12" height="20" rx="2" fill="${ps}"/></g>
<circle cx="193" cy="280" r="10" fill="#f6cfb0"/></g>
<rect x="142" y="168" width="16" height="24" rx="7" fill="#eebc98"/>
<g id="${p}head">
<ellipse cx="90" cy="120" rx="9" ry="12" fill="#f6cfb0"/><ellipse cx="210" cy="120" rx="9" ry="12" fill="#f6cfb0"/>
<ellipse cx="150" cy="114" rx="62" ry="64" fill="#fbdcc2"/>
<path d="M88 112 C84 62 116 44 150 44 C184 44 216 62 212 112 C206 94 196 82 182 78 C184 90 180 98 172 102 C168 88 160 80 148 78 C148 90 140 100 128 104 C128 92 120 84 110 86 C102 94 94 102 88 112 Z" fill="#5a3427"/>
<path id="${p}ahoge" d="M150 46 C144 30 152 18 166 20 C156 24 154 34 156 46 Z" fill="#5a3427"/>
<g transform="translate(194 74)"><circle r="7" fill="#ffd35c"/><circle r="3" fill="#ff9fb6"/></g>
<ellipse cx="116" cy="140" rx="12" ry="7" fill="#ff8fab" opacity=".5"/><ellipse cx="184" cy="140" rx="12" ry="7" fill="#ff8fab" opacity=".5"/>
<path id="${p}sweat" d="M208 96 q6 10 0 14 q-6 -4 0 -14 Z" fill="#7cc8ff" style="display:none"/>
<g id="${p}e_binh-thuong">
<path d="M112 100 q10 -6 22 -2 M166 98 q12 -4 22 2" stroke="#5a3427" stroke-width="3.5" fill="none" stroke-linecap="round"/>
<g id="${p}y_binh-thuong"><ellipse cx="124" cy="122" rx="9" ry="12" fill="#3a2430"/><ellipse cx="176" cy="122" rx="9" ry="12" fill="#3a2430"/><circle cx="127" cy="117" r="3.5" fill="#fff"/><circle cx="179" cy="117" r="3.5" fill="#fff"/><circle cx="121" cy="127" r="1.6" fill="#fff"/><circle cx="173" cy="127" r="1.6" fill="#fff"/><path d="M112 114 q12 -10 24 -2 l4 -4 M164 112 q12 -8 24 2 l-4 -4" stroke="#3a2430" stroke-width="3" fill="none" stroke-linecap="round"/></g>
<path id="${p}m_binh-thuong" d="M143 150 q7 7 14 0" stroke="#b5485f" stroke-width="3.5" fill="none" stroke-linecap="round"/>
</g>
<g id="${p}e_ngac-nhien">
<path d="M112 92 q10 -8 22 -4 M166 88 q12 -4 22 4" stroke="#5a3427" stroke-width="3.5" fill="none" stroke-linecap="round"/>
<g id="${p}y_ngac-nhien"><circle cx="124" cy="121" r="12" fill="#fff" stroke="#3a2430" stroke-width="3"/><circle cx="176" cy="121" r="12" fill="#fff" stroke="#3a2430" stroke-width="3"/><circle cx="124" cy="122" r="5" fill="#3a2430"/><circle cx="176" cy="122" r="5" fill="#3a2430"/></g>
<ellipse id="${p}m_ngac-nhien" cx="150" cy="154" rx="7" ry="9" fill="#b5485f"/>
</g>
<g id="${p}e_que">
<path d="M112 98 q10 4 22 -2 M166 96 q12 6 22 2" stroke="#5a3427" stroke-width="3.5" fill="none" stroke-linecap="round"/>
<g id="${p}y_que"><path d="M116 122 l8 -5 l8 5 M168 122 l8 -5 l8 5" stroke="#3a2430" stroke-width="3.5" fill="none" stroke-linecap="round" stroke-linejoin="round"/></g>
<path id="${p}m_que" d="M138 152 q6 -5 12 0 t12 0" stroke="#b5485f" stroke-width="3.5" fill="none" stroke-linecap="round"/>
<ellipse cx="116" cy="140" rx="14" ry="8" fill="#ff6f8f" opacity=".55"/><ellipse cx="184" cy="140" rx="14" ry="8" fill="#ff6f8f" opacity=".55"/>
</g>
<g id="${p}e_met">
<path d="M112 106 q10 -2 22 4 M166 110 q12 -6 22 -4" stroke="#5a3427" stroke-width="3.5" fill="none" stroke-linecap="round"/>
<g id="${p}y_met"><path d="M115 124 q9 5 18 0 M167 124 q9 5 18 0" stroke="#3a2430" stroke-width="3.5" fill="none" stroke-linecap="round"/></g>
<path id="${p}m_met" d="M142 154 q8 -3 16 0" stroke="#b5485f" stroke-width="3.5" fill="none" stroke-linecap="round"/>
</g>
<g id="${p}e_cuoi">
<path d="M112 96 q10 -8 22 -4 M166 92 q12 -4 22 4" stroke="#5a3427" stroke-width="3.5" fill="none" stroke-linecap="round"/>
<g id="${p}y_cuoi"><path d="M115 124 q9 -11 18 0 M167 124 q9 -11 18 0" stroke="#3a2430" stroke-width="3.5" fill="none" stroke-linecap="round"/></g>
<g id="${p}m_cuoi"><path d="M138 146 Q150 148 162 146 Q160 164 150 164 Q140 164 138 146 Z" fill="#b5485f"/><ellipse cx="150" cy="158" rx="6" ry="3.5" fill="#ff9fb6"/></g>
</g>
<ellipse id="${p}talk" cx="150" cy="154" rx="6" ry="2" fill="#b5485f" style="display:none"/>
</g>
</g>
</g>`;
  }

  function bind(p) {
    const g = (s) => document.getElementById(p + s);
    const C = { ch: g("ch"), body: g("body"), hairBack: g("hairBack"), head: g("head"), ahoge: g("ahoge"), legL: g("legL"), legR: g("legR"),
      armL: g("armL"), armR: g("armR"), phone: g("phone"), hb: g("hb"), sweat: g("sweat"), talk: g("talk"), shadow: g("shadow"), e: {}, y: {}, m: {} };
    EXPS.forEach((n) => { C.e[n] = g("e_" + n); C.y[n] = g("y_" + n); C.m[n] = g("m_" + n); });
    return C;
  }

  const rot = (a, cx, cy) => `rotate(${a.toFixed(2)} ${cx} ${cy})`;

  /* st: t (giây trong cảnh), exp, pose, talk (0..1, <0 = không nói), holdPhone, sweat, gaze [x,y], aR, aL (ép góc tay), headRot, blinkOff */
  function pose(C, st) {
    const t = st.t, ps = st.pose || "";
    let ty = 0, sy = 1, lL = 0, lR = 0, aL = 0, aR = 0, aLy = 0, aRy = 0, ahP = 2.2, hb = false;
    if (ps === "run") {
      const ph = TAU * t / 0.7; lL = 14 * Math.sin(ph); lR = -lL; aL = -30 * Math.sin(ph); aR = -aL;
      const k = 0.5 - 0.5 * Math.cos(TAU * t / 0.35); ty = -3 * k; sy = 1 + 0.01 * k; ahP = 0.4;
    } else if (ps === "walk") {
      const ph = TAU * t / 0.8; lL = 11 * Math.sin(ph); lR = -lL; aL = -16 * Math.sin(ph); aR = -aL;
      const k = 0.5 - 0.5 * Math.cos(TAU * t / 0.4); ty = -2 * k;
    } else {
      const k = 0.5 - 0.5 * Math.cos(TAU * t / 2.4); ty = -3 * k; sy = 1 + 0.01 * k;
    }
    if (ps === "wave") aR = -161 + 11 * Math.sin(TAU * t / 1.2);
    if (ps === "pocket") { const k = 0.5 - 0.5 * Math.cos(TAU * t / 0.9); aR = 2 + 14 * k; aRy = 6 * k; }
    if (ps === "bag") {
      const f = st.bagHz || 2.2, s = Math.sin(TAU * f * t);
      aL = -8 + 8 * s; hb = true;
      C.hb.setAttribute("cx", (119 + 2 * s).toFixed(1)); C.hb.setAttribute("cy", (289 + 3 * s).toFixed(1));
    }
    if (!ps && st.aR === undefined) aR += 3 * Math.sin(TAU * t / 3.1);
    if (!ps && st.aL === undefined) aL -= 3 * Math.sin(TAU * t / 2.7 + 1);
    C.legL.style.display = st.hideLegs ? "none" : "";
    C.legR.style.display = st.hideLegs ? "none" : "";
    if (st.aR !== undefined) aR = st.aR;
    if (st.aL !== undefined) aL = st.aL;
    C.hb.style.display = hb ? "" : "none";
    C.phone.style.display = st.holdPhone ? "" : "none";
    C.body.setAttribute("transform", `translate(0 ${ty.toFixed(2)}) translate(150 410) scale(1 ${sy.toFixed(4)}) translate(-150 -410)`);
    C.legL.setAttribute("transform", rot(lL, 133, 320));
    C.legR.setAttribute("transform", rot(lR, 167, 320));
    C.armL.setAttribute("transform", `translate(0 ${aLy}) ` + rot(aL, 108, 202));
    C.armR.setAttribute("transform", `translate(0 ${aRy.toFixed(2)}) ` + rot(aR, 192, 202));
    const k2 = 0.5 - 0.5 * Math.cos(TAU * t / 3.2);
    const tilt = -2.5 + 5.5 * k2 + (st.headRot || 0);
    C.head.setAttribute("transform", rot(tilt, 150, 175));
    C.hairBack.setAttribute("transform", rot(tilt, 150, 175));
    C.ahoge.setAttribute("transform", rot(1 + 15 * Math.sin(TAU * t / ahP), 153, 46));
    // biểu cảm
    const exp = st.exp || "binh-thuong";
    EXPS.forEach((n) => { C.e[n].style.display = n === exp ? "" : "none"; });
    // chớp mắt
    const u = (t + (st.blinkOff || 0)) % 4;
    let bs = 1; if (u > 1.84 && u < 2.0) bs = 1 - 0.9 * (1 - Math.abs(u - 1.92) / 0.08);
    const gz = st.gaze || [0, 0];
    const ey = C.y[exp];
    if (exp !== "cuoi") ey.setAttribute("transform", `translate(${gz[0]} ${gz[1]}) translate(0 122) scale(1 ${bs.toFixed(3)}) translate(0 -122)`);
    // miệng nói theo giọng
    const tk = st.talk === undefined ? -1 : st.talk;
    const open = tk > 0.1;
    const mo = C.m[exp];
    if (mo) mo.style.display = open ? "none" : "";
    C.talk.style.display = open ? "" : "none";
    if (open) { C.talk.setAttribute("ry", (1.5 + tk * 9).toFixed(1)); C.talk.setAttribute("rx", (5 + tk * 3).toFixed(1)); }
    // mồ hôi
    const sw = st.sweat !== undefined ? st.sweat : exp === "que";
    C.sweat.style.display = sw ? "" : "none";
    if (sw) { const q = (t % 1.2) / 1.2; C.sweat.setAttribute("transform", `translate(0 ${(14 * q).toFixed(1)})`); C.sweat.setAttribute("opacity", (1 - q).toFixed(2)); }
  }

  function place(C, x, y, s, flip, rotDeg, rcx, rcy) {
    let r = "";
    if (rotDeg) r = ` rotate(${rotDeg} ${rcx || 150} ${rcy || 330})`;
    C.ch.setAttribute("transform", `translate(${x.toFixed(1)} ${y.toFixed(1)}) scale(${(s * (flip || 1)).toFixed(3)} ${s}) translate(-150 -410)` + r);
  }

  window.Char = { markup, bind, pose, place };
})();
