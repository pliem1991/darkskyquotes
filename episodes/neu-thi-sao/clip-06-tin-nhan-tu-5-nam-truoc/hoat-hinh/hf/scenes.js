/* Sáu cảnh clip 6: "Nếu bạn nhận được tin nhắn từ chính mình năm năm trước?"
   Toàn bộ trong phòng trọ khuya, điện thoại là nguồn sáng chính. */
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
  const SVG0 = '<svg width="1080" height="1920" viewBox="0 0 1080 1920" xmlns="http://www.w3.org/2000/svg" style="position:absolute;left:0;top:0">';
  const talkAt = (t) => { const f = t * 30; const i = Math.floor(f); const k = f - i; const a = D.env[i] || 0; const b = D.env[i + 1] || 0; const e = a + (b - a) * k; return clamp((e - 0.1) / 0.5, 0, 1); };
  function curExp(t, list) { let e = list[0][1]; for (const [tt, n] of list) if (t >= tt) e = n; return e; }

  const WIN = `<rect x="720" y="340" width="280" height="420" rx="8" fill="#0a1430" opacity=".7"/>
<rect x="720" y="340" width="280" height="420" rx="8" fill="none" stroke="#3a2858" stroke-width="5"/>
<line x1="860" y1="340" x2="860" y2="760" stroke="#3a2858" stroke-width="3"/>
<line x1="720" y1="550" x2="1000" y2="550" stroke="#3a2858" stroke-width="3"/>
<circle cx="780" cy="420" r="2" fill="#fff" opacity=".5"/><circle cx="840" cy="380" r="1.5" fill="#fff" opacity=".3"/>
<circle cx="920" cy="450" r="2" fill="#fff" opacity=".4"/><circle cx="960" cy="400" r="1.5" fill="#fff" opacity=".6"/>
<circle cx="750" cy="500" r="1" fill="#fff" opacity=".3"/>`;

  const BED = `<rect x="80" y="1100" width="620" height="220" rx="16" fill="#5a4878"/>
<rect x="80" y="1080" width="620" height="40" rx="10" fill="#6a5888"/>
<rect x="100" y="1050" width="160" height="60" rx="10" fill="#7a6898"/>`;

  function room(id) {
    return `<defs><linearGradient id="${id}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#2a2040"/><stop offset="1" stop-color="#1a1228"/></linearGradient></defs>
<rect width="1080" height="1920" fill="url(#${id})"/>
<rect y="1300" width="1080" height="620" fill="#252038"/>`;
  }

  const scenes = [];

  /* ========== Cảnh 1: Hook — điện thoại sáng, thông báo ========== */
  scenes.push({
    build(el) {
      el.innerHTML = SVG0 + room("g1") + WIN + BED + `
<rect x="720" y="1020" width="150" height="130" rx="8" fill="#4a3860"/>
<rect x="720" y="1000" width="150" height="28" rx="8" fill="#5a4878"/>
<g id="s1phone" transform="translate(795 960)">
<rect x="-36" y="-60" width="72" height="110" rx="10" fill="#2a2033"/>
<rect id="s1scr" x="-28" y="-48" width="56" height="86" rx="6" fill="#252040"/>
</g>
<g id="s1glow" opacity="0"><ellipse cx="795" cy="920" rx="140" ry="100" fill="#6688cc" opacity=".08"/>
<ellipse cx="795" cy="930" rx="70" ry="50" fill="#88aaee" opacity=".12"/></g>
<g id="s1notif" transform="translate(540 520) scale(0.001)">
<rect x="-240" y="-65" width="480" height="130" rx="28" fill="#fff" opacity=".95"/>
<circle cx="-186" cy="0" r="24" fill="#e0d0ff"/>
<rect x="-196" y="-10" width="20" height="18" rx="4" fill="#8a6ab8"/>
<text x="-148" y="-18" font-size="28" font-weight="700" fill="#2a2033" font-family="Segoe UI,Arial,sans-serif">Mình — 5 năm trước</text>
<text x="-148" y="18" font-size="22" fill="#8a7a9a" font-family="Segoe UI,Arial,sans-serif">Gửi cho bạn một tin nhắn</text>
</g>
<g id="s1ch">${Ch.markup("c1_")}</g>
</svg>`;
      this.C = Ch.bind("c1_");
    },
    update(t) {
      const t0 = t - L[0].s;
      op("s1glow", clamp(t0 / 0.4, 0, 1));
      const scr = $("s1scr"); if (scr) scr.setAttribute("fill", t0 > 0.15 ? "#4a6080" : "#252040");
      const nk = t < L[0].s + 0.25 ? 0.001 : Math.max(0.001, backOut((t - L[0].s - 0.25) / 0.4));
      tf("s1notif", `translate(540 520) scale(${nk.toFixed(3)})`);
      Ch.place(this.C, 360, 1380, 2.3, 1, 0, 150, 340);
      const exp = t0 < 0.4 ? "binh-thuong" : "ngac-nhien";
      Ch.pose(this.C, { t: t0, exp, hideLegs: true, talk: talkAt(t), gaze: [lerp(0, 8, clamp(t0 / 0.5, 0, 1)), -4], headRot: lerp(0, 4, clamp(t0 / 0.6, 0, 1)) });
    },
  });

  /* ========== Cảnh 2: tin nhắn 1 — "ba mươi tuổi sẽ dọn khỏi phòng trọ" ========== */
  scenes.push({
    build(el) {
      el.innerHTML = SVG0 + room("g2") + WIN + `
<g><rect x="700" y="860" width="320" height="200" rx="8" fill="#4a3860"/>
<rect x="700" y="840" width="320" height="28" rx="8" fill="#5a4878"/>
<g transform="translate(830 810)">
<rect x="-50" y="-70" width="100" height="130" rx="4" fill="#f0ece0" transform="rotate(-4)"/>
<rect x="-40" y="-56" width="70" height="5" rx="2" fill="#c8c0b0" transform="rotate(-4)"/>
<rect x="-40" y="-44" width="55" height="5" rx="2" fill="#c8c0b0" transform="rotate(-4)"/>
<rect x="-40" y="-32" width="65" height="5" rx="2" fill="#c8c0b0" transform="rotate(-4)"/>
<rect x="30" y="-20" width="5" height="36" rx="2" fill="#4a70b8" transform="rotate(12)"/>
</g></g>
` + BED + `
<g id="s2phone">
<rect x="200" y="160" width="500" height="700" rx="34" fill="#2a2033"/>
<rect x="220" y="210" width="460" height="600" rx="18" fill="#1a1a2a"/>
<rect x="220" y="210" width="460" height="64" fill="#302848"/>
<circle cx="268" cy="242" r="18" fill="#8a6ab8"/>
<text x="300" y="249" font-size="24" font-weight="700" fill="#e8e0f0" font-family="Segoe UI,Arial,sans-serif">Mình — 5 năm trước</text>
</g>
<g id="s2glow" opacity=".6"><ellipse cx="450" cy="500" rx="140" ry="100" fill="#6688cc" opacity=".06"/>
<ellipse cx="450" cy="510" rx="70" ry="50" fill="#88aaee" opacity=".1"/></g>
<g id="s2msg" opacity="0">
<rect x="248" y="310" width="380" height="90" rx="20" fill="#e8e4f0"/>
<path d="M258 355 l-14 8 l6 -18" fill="#e8e4f0"/>
<text x="278" y="348" font-size="26" fill="#2a2033" font-family="Segoe UI,Arial,sans-serif">ba mươi tuổi</text>
<text x="278" y="380" font-size="26" fill="#2a2033" font-family="Segoe UI,Arial,sans-serif">sẽ dọn khỏi phòng trọ</text>
</g>
<g id="s2ch">${Ch.markup("c2_")}</g>
</svg>`;
      this.C = Ch.bind("c2_");
    },
    update(t) {
      const s0 = L[1].s, t0 = t - s0;
      op("s2glow", 0.6 + 0.15 * Math.sin(t0 * 1.5));
      const msgT = M(1, 3);
      op("s2msg", easeOut(clamp((t - msgT) / 0.3, 0, 1)));
      Ch.place(this.C, 380, 1380, 2.3, 1, 0, 150, 340);
      const sadT = M(1, 11);
      const exp = curExp(t, [[0, "binh-thuong"], [sadT, "met"]]);
      Ch.pose(this.C, { t: t0, exp, hideLegs: true, holdPhone: true, talk: talkAt(t), gaze: [0, -8], headRot: -2 + Math.sin(t0 * 0.7) * 1.5 });
    },
  });

  /* ========== Cảnh 3: tin nhắn 2 — "sẽ bỏ việc nếu không còn vui" ========== */
  scenes.push({
    build(el) {
      el.innerHTML = SVG0 + room("g3") + WIN + `
<g id="s3alarm" transform="translate(790 990)">
<rect x="-50" y="-60" width="100" height="90" rx="14" fill="#4a3860"/>
<circle cx="0" cy="-28" r="30" fill="#2a2033" stroke="#5a4878" stroke-width="3"/>
<text id="s3time" x="0" y="-20" text-anchor="middle" font-size="22" font-weight="700" fill="#ffd35c" font-family="Segoe UI,Arial,sans-serif">6:30</text>
<circle cx="-28" cy="-68" r="10" fill="#5a4878"/><circle cx="28" cy="-68" r="10" fill="#5a4878"/>
<rect x="-2" y="-68" width="4" height="14" rx="2" fill="#5a4878"/>
</g>
<rect x="720" y="1020" width="150" height="130" rx="8" fill="#4a3860"/>
<rect x="720" y="1000" width="150" height="28" rx="8" fill="#5a4878"/>
` + BED + `
<g id="s3phone">
<rect x="200" y="160" width="500" height="700" rx="34" fill="#2a2033"/>
<rect x="220" y="210" width="460" height="600" rx="18" fill="#1a1a2a"/>
<rect x="220" y="210" width="460" height="64" fill="#302848"/>
<circle cx="268" cy="242" r="18" fill="#8a6ab8"/>
<text x="300" y="249" font-size="24" font-weight="700" fill="#e8e0f0" font-family="Segoe UI,Arial,sans-serif">Mình — 5 năm trước</text>
</g>
<g id="s3glow" opacity=".5"><ellipse cx="450" cy="500" rx="140" ry="100" fill="#6688cc" opacity=".06"/>
<ellipse cx="450" cy="510" rx="70" ry="50" fill="#88aaee" opacity=".1"/></g>
<g opacity=".35">
<rect x="248" y="310" width="380" height="80" rx="18" fill="#e8e4f0"/>
<text x="278" y="345" font-size="22" fill="#6a5a7a" font-family="Segoe UI,Arial,sans-serif">ba mươi tuổi</text>
<text x="278" y="372" font-size="22" fill="#6a5a7a" font-family="Segoe UI,Arial,sans-serif">sẽ dọn khỏi phòng trọ</text>
</g>
<g id="s3msg" opacity="0">
<rect x="248" y="410" width="360" height="80" rx="20" fill="#e8e4f0"/>
<path d="M258 450 l-14 8 l6 -18" fill="#e8e4f0"/>
<text x="278" y="443" font-size="26" fill="#2a2033" font-family="Segoe UI,Arial,sans-serif">sẽ bỏ việc</text>
<text x="278" y="475" font-size="26" fill="#2a2033" font-family="Segoe UI,Arial,sans-serif">nếu không còn vui</text>
</g>
<g id="s3ch">${Ch.markup("c3_")}</g>
</svg>`;
      this.C = Ch.bind("c3_");
    },
    update(t) {
      const s0 = L[2].s, t0 = t - s0;
      op("s3glow", 0.5 + 0.15 * Math.sin(t0 * 1.3));
      op("s3msg", easeOut(clamp((t - s0 - 0.2) / 0.3, 0, 1)));
      const blink = Math.sin(t0 * 4) > 0 ? 1 : 0.4;
      op("s3time", t0 > 1.5 ? blink : 1);
      Ch.place(this.C, 360, 1380, 2.3, 1, 0, 150, 340);
      Ch.pose(this.C, { t: t0, exp: "met", hideLegs: true, holdPhone: true, talk: talkAt(t), gaze: [0, -6], headRot: -3 + Math.sin(t0 * 0.6) * 2 });
    },
  });

  /* ========== Cảnh 4: tin nhắn 3 — "mỗi tuần sẽ gọi cho má một lần" ========== */
  scenes.push({
    build(el) {
      el.innerHTML = SVG0 + room("g4") + WIN + BED + `
<g id="s4phone">
<rect x="200" y="160" width="500" height="700" rx="34" fill="#2a2033"/>
<rect x="220" y="210" width="460" height="600" rx="18" fill="#1a1a2a"/>
<rect x="220" y="210" width="460" height="64" fill="#302848"/>
<circle cx="268" cy="242" r="18" fill="#8a6ab8"/>
<text x="300" y="249" font-size="24" font-weight="700" fill="#e8e0f0" font-family="Segoe UI,Arial,sans-serif">Mình — 5 năm trước</text>
</g>
<g id="s4glow" opacity=".5"><ellipse cx="450" cy="500" rx="140" ry="100" fill="#6688cc" opacity=".06"/>
<ellipse cx="450" cy="510" rx="70" ry="50" fill="#88aaee" opacity=".1"/></g>
<g opacity=".3">
<rect x="248" y="310" width="380" height="65" rx="16" fill="#e8e4f0"/>
<text x="274" y="350" font-size="20" fill="#6a5a7a" font-family="Segoe UI,Arial,sans-serif">ba mươi tuổi sẽ dọn khỏi phòng trọ</text>
</g>
<g opacity=".3">
<rect x="248" y="390" width="330" height="65" rx="16" fill="#e8e4f0"/>
<text x="274" y="430" font-size="20" fill="#6a5a7a" font-family="Segoe UI,Arial,sans-serif">sẽ bỏ việc nếu không còn vui</text>
</g>
<g id="s4msg" opacity="0">
<rect x="248" y="480" width="360" height="80" rx="20" fill="#e8e4f0"/>
<path d="M258 520 l-14 8 l6 -18" fill="#e8e4f0"/>
<text x="278" y="513" font-size="26" fill="#2a2033" font-family="Segoe UI,Arial,sans-serif">mỗi tuần sẽ gọi</text>
<text x="278" y="545" font-size="26" fill="#2a2033" font-family="Segoe UI,Arial,sans-serif">cho má một lần</text>
</g>
<g id="s4call" opacity="0">
<rect x="248" y="600" width="400" height="80" rx="16" fill="#302848" stroke="#5a4878" stroke-width="2"/>
<circle cx="290" cy="640" r="20" fill="#7a6898"/>
<text x="325" y="632" font-size="24" font-weight="700" fill="#e8e0f0" font-family="Segoe UI,Arial,sans-serif">Má</text>
<text x="325" y="660" font-size="18" fill="#8a7a9a" font-family="Segoe UI,Arial,sans-serif">2 tháng 10 ngày trước</text>
</g>
<g id="s4ch">${Ch.markup("c4_")}</g>
</svg>`;
      this.C = Ch.bind("c4_");
    },
    update(t) {
      const s0 = L[3].s, t0 = t - s0;
      op("s4glow", 0.5 + 0.12 * Math.sin(t0 * 1.2));
      op("s4msg", easeOut(clamp((t - s0 - 0.2) / 0.3, 0, 1)));
      const callT = M(3, 8);
      op("s4call", easeOut(clamp((t - callT) / 0.4, 0, 1)));
      Ch.place(this.C, 380, 1380, 2.3, 1, 0, 150, 340);
      const sadT = M(3, 14);
      const exp = curExp(t, [[0, "binh-thuong"], [sadT, "met"]]);
      Ch.pose(this.C, { t: t0, exp, hideLegs: true, holdPhone: true, talk: talkAt(t), gaze: [0, -8], headRot: lerp(-2, -6, clamp((t - callT) / 1, 0, 1)) });
    },
  });

  /* ========== Cảnh 5: gõ "xin lỗi, mình chưa làm được gì cả" rồi xóa ========== */
  scenes.push({
    build(el) {
      el.innerHTML = SVG0 + room("g5") + WIN + BED + `
<g id="s5phone">
<rect x="200" y="160" width="500" height="740" rx="34" fill="#2a2033"/>
<rect x="220" y="210" width="460" height="640" rx="18" fill="#1a1a2a"/>
<rect x="220" y="210" width="460" height="64" fill="#302848"/>
<circle cx="268" cy="242" r="18" fill="#8a6ab8"/>
<text x="300" y="249" font-size="24" font-weight="700" fill="#e8e0f0" font-family="Segoe UI,Arial,sans-serif">Mình — 5 năm trước</text>
</g>
<g id="s5glow" opacity=".5"><ellipse cx="450" cy="520" rx="140" ry="100" fill="#6688cc" opacity=".06"/>
<ellipse cx="450" cy="530" rx="70" ry="50" fill="#88aaee" opacity=".1"/></g>
<g opacity=".25">
<rect x="248" y="300" width="380" height="55" rx="14" fill="#e8e4f0"/>
<text x="274" y="336" font-size="18" fill="#6a5a7a" font-family="Segoe UI,Arial,sans-serif">ba mươi tuổi sẽ dọn khỏi phòng trọ</text>
<rect x="248" y="368" width="320" height="55" rx="14" fill="#e8e4f0"/>
<text x="274" y="404" font-size="18" fill="#6a5a7a" font-family="Segoe UI,Arial,sans-serif">sẽ bỏ việc nếu không còn vui</text>
<rect x="248" y="436" width="320" height="55" rx="14" fill="#e8e4f0"/>
<text x="274" y="472" font-size="18" fill="#6a5a7a" font-family="Segoe UI,Arial,sans-serif">mỗi tuần sẽ gọi cho má một lần</text>
</g>
<g id="s5input" opacity="0">
<rect x="234" y="720" width="432" height="90" rx="28" fill="#3a3050" stroke="#5a4878" stroke-width="2"/>
</g>
<g id="s5typed" opacity="0">
<text x="260" y="758" font-size="24" fill="#e8e0d4" font-family="Segoe UI,Arial,sans-serif">xin lỗi,</text>
<text x="260" y="788" font-size="24" fill="#e8e0d4" font-family="Segoe UI,Arial,sans-serif">mình chưa làm được gì cả</text>
</g>
<rect id="s5cur" x="260" y="746" width="2" height="26" fill="#ffd35c" opacity="0"/>
<g id="s5ch">${Ch.markup("c5_")}</g>
</svg>`;
      this.C = Ch.bind("c5_");
    },
    update(t) {
      const s0 = L[4].s, t0 = t - s0;
      op("s5glow", 0.5 + 0.1 * Math.sin(t0 * 1.4));
      const inputT = s0 + 0.1;
      op("s5input", easeOut(clamp((t - inputT) / 0.3, 0, 1)));
      const showCur = t > inputT + 0.3;
      op("s5cur", showCur ? (Math.sin(t0 * 5) > 0 ? 0.8 : 0) : 0);
      const typeT = M(4, 4);
      const delT = M(4, 14);
      let ty = 0;
      if (t >= typeT && t < delT) ty = easeOut(clamp((t - typeT) / 0.4, 0, 1));
      else if (t >= delT) ty = clamp(1 - (t - delT) / 0.4, 0, 1);
      op("s5typed", ty);
      Ch.place(this.C, 380, 1400, 2.2, 1, 0, 150, 340);
      const exp = curExp(t, [[0, "binh-thuong"], [delT, "met"]]);
      Ch.pose(this.C, { t: t0, exp, hideLegs: true, holdPhone: true, talk: talkAt(t), gaze: [0, -10], headRot: -2 });
    },
  });

  /* ========== Cảnh 6: gõ "mình đang cố", xóa, tắt điện thoại ========== */
  scenes.push({
    build(el) {
      el.innerHTML = SVG0 + room("g6") + WIN + BED + `
<g id="s6phone">
<rect x="200" y="160" width="500" height="740" rx="34" fill="#2a2033"/>
<rect id="s6scr" x="220" y="210" width="460" height="640" rx="18" fill="#1a1a2a"/>
<rect id="s6hdr" x="220" y="210" width="460" height="64" fill="#302848"/>
<circle id="s6ava" cx="268" cy="242" r="18" fill="#8a6ab8"/>
<text id="s6name" x="300" y="249" font-size="24" font-weight="700" fill="#e8e0f0" font-family="Segoe UI,Arial,sans-serif">Mình — 5 năm trước</text>
</g>
<g id="s6glow" opacity=".5"><ellipse cx="450" cy="520" rx="140" ry="100" fill="#6688cc" opacity=".06"/>
<ellipse cx="450" cy="530" rx="70" ry="50" fill="#88aaee" opacity=".1"/></g>
<g opacity=".25">
<rect x="248" y="300" width="380" height="55" rx="14" fill="#e8e4f0"/>
<text x="274" y="336" font-size="18" fill="#6a5a7a" font-family="Segoe UI,Arial,sans-serif">ba mươi tuổi sẽ dọn khỏi phòng trọ</text>
<rect x="248" y="368" width="320" height="55" rx="14" fill="#e8e4f0"/>
<text x="274" y="404" font-size="18" fill="#6a5a7a" font-family="Segoe UI,Arial,sans-serif">sẽ bỏ việc nếu không còn vui</text>
<rect x="248" y="436" width="320" height="55" rx="14" fill="#e8e4f0"/>
<text x="274" y="472" font-size="18" fill="#6a5a7a" font-family="Segoe UI,Arial,sans-serif">mỗi tuần sẽ gọi cho má một lần</text>
</g>
<g id="s6input">
<rect x="234" y="720" width="432" height="70" rx="28" fill="#3a3050" stroke="#5a4878" stroke-width="2"/>
</g>
<g id="s6typed" opacity="0">
<text x="260" y="763" font-size="24" fill="#e8e0d4" font-family="Segoe UI,Arial,sans-serif">mình đang cố</text>
</g>
<rect id="s6cur" x="260" y="746" width="2" height="26" fill="#ffd35c" opacity="0"/>
<g id="s6dark" opacity="0">
<rect x="200" y="160" width="500" height="740" rx="34" fill="#1a1228"/>
</g>
<g id="s6dot" opacity="0">
<circle cx="450" cy="530" r="8" fill="#ffd35c"/><circle cx="450" cy="530" r="18" fill="#ffd35c" opacity=".15"/>
</g>
<g id="s6ch">${Ch.markup("c6_")}</g>
</svg>`;
      this.C = Ch.bind("c6_");
    },
    update(t) {
      const s0 = L[5].s, t0 = t - s0;
      const typeT = M(5, 2);
      const delT = M(5, 5);
      const offT = M(5, 7);
      let ty = 0;
      if (t >= typeT && t < delT) ty = easeOut(clamp((t - typeT) / 0.3, 0, 1));
      else if (t >= delT) ty = clamp(1 - (t - delT) / 0.3, 0, 1);
      op("s6typed", ty);
      op("s6cur", t0 > 0.3 && t < offT ? (Math.sin(t0 * 5) > 0 ? 0.8 : 0) : 0);
      const darkK = easeIn(clamp((t - offT) / 0.5, 0, 1));
      op("s6dark", darkK);
      op("s6input", 1 - darkK);
      op("s6glow", (0.5 + 0.1 * Math.sin(t0 * 1.2)) * (1 - darkK));
      const dotT = offT + 0.8;
      const dk = t > dotT ? 0.4 + 0.6 * Math.abs(Math.sin((t - dotT) * 2)) : 0;
      op("s6dot", dk);
      Ch.place(this.C, 380, 1400, 2.2, 1, 0, 150, 340);
      const exp = curExp(t, [[0, "binh-thuong"], [delT, "met"]]);
      Ch.pose(this.C, { t: t0, exp, hideLegs: true, holdPhone: true, talk: talkAt(t), gaze: [0, lerp(-10, 0, darkK)], headRot: lerp(-2, -6, darkK) });
    },
  });

  window.SCENES = scenes;
})();
