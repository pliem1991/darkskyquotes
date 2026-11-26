/* scenes.js — clip 8: tiêu vặt một năm (v2: hiệu ứng số tiền động)
   6 cảnh: đường đi làm, quán cà phê, trà sữa, xe giao hàng, tổng cộng, phòng trọ mưa. */

const Ch = window.Char;
const D = window.DATA;
const clamp = (x,a,b) => Math.max(a,Math.min(b,x));
const lerp = (a,b,t) => a+(b-a)*clamp(t,0,1);
const easeOut = t => { t=clamp(t,0,1); return 1-(1-t)*(1-t); };
const easeIn = t => { t=clamp(t,0,1); return t*t; };
const backOut = t => { t=clamp(t,0,1); const c=1.7; return 1+(--t)*t*((c+1)*t+c); };
const easeOutCubic = t => { t=clamp(t,0,1); return 1-Math.pow(1-t,3); };

function M(lineIdx,sylIdx){
  const s=D.lines[lineIdx]; if(!s||!s.syl[sylIdx]) return 0;
  return s.syl[sylIdx].s - s.s;
}
function talkAt(gt){ const fi=Math.floor(gt*30); return (D.env[fi]||0)*3.5; }
function curExp(t,pairs){
  for(let i=pairs.length-2;i>=0;i-=2) if(t>=pairs[i]) return pairs[i+1];
  return pairs[1];
}

function fmtNum(n) {
  n = Math.round(n); if (n <= 0) return '0đ';
  const s = n.toString(); let r = '';
  for (let i = 0; i < s.length; i++) {
    if (i > 0 && (s.length - i) % 3 === 0) r += '.';
    r += s[i];
  }
  return r + 'đ';
}
function countVal(t, t0, dur, target) {
  return Math.round(easeOutCubic(clamp((t - t0) / dur, 0, 1)) * target);
}
function popIn(t, t0, dur) {
  const p = clamp((t - t0) / dur, 0, 1);
  return p <= 0 ? 0.001 : backOut(p);
}
function impactPulse(t, t0, dur, amp) {
  const p = clamp((t - t0) / dur, 0, 1);
  return p <= 0 ? 1 : 1 + amp * Math.sin(Math.PI * p) * (1 - p * 0.5);
}

/* ── Cảnh 0: Đường sáng sớm, cầm ly cà phê đi làm ── */
const scene0 = {
  build(el){
    el.innerHTML = `<svg viewBox="0 0 1080 1920" width="1080" height="1920" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="c8s0sky" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stop-color="#4a6a9a"/>
        <stop offset=".6" stop-color="#8aaac8"/>
        <stop offset="1" stop-color="#c8d8e8"/>
      </linearGradient>
    </defs>
    <rect width="1080" height="1920" fill="url(#c8s0sky)"/>
    <rect x="0" y="1480" width="1080" height="440" fill="#444"/>
    <rect x="0" y="1460" width="1080" height="40" rx="4" fill="#666"/>
    <g opacity=".6">
      <rect x="60" y="800" width="140" height="680" rx="6" fill="#6a7a8a"/>
      <rect x="250" y="900" width="120" height="580" rx="6" fill="#5a6a7a"/>
      <rect x="750" y="850" width="160" height="630" rx="6" fill="#6a7a8a"/>
      <rect x="940" y="950" width="100" height="530" rx="6" fill="#5a6a7a"/>
    </g>
    <g id="s0coffee" opacity="0">
      <rect x="550" y="770" width="140" height="180" rx="20" fill="#6b3e1f" opacity=".9"/>
      <rect x="560" y="760" width="120" height="30" rx="8" fill="#fff" opacity=".6"/>
      <text x="620" y="880" font-size="36" fill="#ffd35c" font-weight="700" text-anchor="middle" font-family="sans-serif">30k</text>
    </g>
    ${Ch.markup("s0_")}
    </svg>`;
    this.C = Ch.bind("s0_");
    this.coffee = el.querySelector("#s0coffee");
  },
  update(t){
    const s0=D.lines[0].s, gt=t+s0;
    Ch.place(this.C, 450, 1360, 1.4, 1);
    Ch.pose(this.C, { t, exp:"binh-thuong", holdPhone:false, talk:talkAt(gt), gaze:[2,0], headRot:-2, pose:"walk" });
    this.coffee.setAttribute("opacity", easeOut(t/0.5).toFixed(3));
  }
};

/* ── Cảnh 1: Quán cà phê, con số nhảy ── */
const scene1 = {
  build(el){
    el.innerHTML = `<svg viewBox="0 0 1080 1920" width="1080" height="1920" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="c8s1bg" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stop-color="#2a2218"/>
        <stop offset="1" stop-color="#1a1810"/>
      </linearGradient>
      <radialGradient id="c8s1warm" cx=".5" cy=".4" r=".6">
        <stop offset="0" stop-color="#ffd27a" stop-opacity=".15"/>
        <stop offset="1" stop-color="#ffd27a" stop-opacity="0"/>
      </radialGradient>
      <radialGradient id="c8s1glow" cx=".5" cy=".5" r=".5">
        <stop offset="0" stop-color="#ff6b6b" stop-opacity=".5"/>
        <stop offset="1" stop-color="#ff6b6b" stop-opacity="0"/>
      </radialGradient>
    </defs>
    <rect width="1080" height="1920" fill="url(#c8s1bg)"/>
    <circle cx="540" cy="700" r="500" fill="url(#c8s1warm)"/>
    <rect x="200" y="1100" width="680" height="10" rx="3" fill="#3a3020"/>
    <g id="s1cup">
      <ellipse cx="540" cy="980" rx="90" ry="30" fill="#3a2a1a"/>
      <rect x="460" y="830" width="160" height="150" rx="12" fill="#f5e6d0" stroke="#d4c4a0" stroke-width="3"/>
      <ellipse cx="540" cy="830" rx="80" ry="22" fill="#6b3e1f"/>
      <path d="M620 870 Q660 870 660 910 Q660 950 620 950" fill="none" stroke="#d4c4a0" stroke-width="6"/>
    </g>
    <g id="s1priceG" opacity="0">
      <text x="0" y="10" font-size="80" font-weight="800" fill="#ffd35c" font-family="monospace" text-anchor="middle">30k / ngày</text>
    </g>
    <g id="s1daysG" opacity="0">
      <text x="0" y="10" font-size="64" font-weight="700" fill="#8ab4ff" font-family="monospace" text-anchor="middle">× 365 ngày</text>
    </g>
    <g id="s1totalG" opacity="0">
      <ellipse cx="0" cy="0" rx="280" ry="60" fill="url(#c8s1glow)" opacity="0" id="s1glowEl"/>
      <text id="s1totalTxt" x="0" y="16" font-size="96" font-weight="900" fill="#ff6b6b" font-family="monospace" text-anchor="middle">0đ</text>
    </g>
    ${Ch.markup("s1_")}
    </svg>`;
    this.C = Ch.bind("s1_");
    this.cup = el.querySelector("#s1cup");
    this.priceG = el.querySelector("#s1priceG");
    this.daysG = el.querySelector("#s1daysG");
    this.totalG = el.querySelector("#s1totalG");
    this.totalTxt = el.querySelector("#s1totalTxt");
    this.glowEl = el.querySelector("#s1glowEl");
  },
  update(t){
    const s1=D.lines[1].s, gt=t+s1;
    Ch.place(this.C, 260, 1500, 1.15, 1);
    Ch.pose(this.C, {
      t, exp: curExp(t,[0,"binh-thuong",M(1,8),"ngac-nhien"]),
      hideLegs:true, talk:talkAt(gt), gaze:[3,0], headRot:3
    });
    const prT = t - M(1,0);
    if (prT < 0) { this.priceG.setAttribute("opacity","0"); }
    else {
      this.priceG.setAttribute("opacity","1");
      const sc = popIn(t, M(1,0), 0.35);
      this.priceG.setAttribute("transform", `translate(540,560) scale(${sc.toFixed(3)})`);
      const cb = 6 * Math.max(0, 1-prT/0.3) * Math.sin(prT*18);
      this.cup.setAttribute("transform", `translate(0,${cb.toFixed(1)})`);
    }
    const dayT = t - M(1,8);
    if (dayT < 0) { this.daysG.setAttribute("opacity","0"); }
    else {
      const sx = lerp(300, 0, easeOut(dayT/0.45));
      this.daysG.setAttribute("opacity", easeOut(dayT/0.35).toFixed(3));
      this.daysG.setAttribute("transform", `translate(${(540+sx).toFixed(0)},660)`);
    }
    const totT = t - M(1,13);
    const cDur = 0.7;
    if (totT < 0) { this.totalG.setAttribute("opacity","0"); }
    else {
      this.totalG.setAttribute("opacity","1");
      const val = countVal(t, M(1,13), cDur, 10950000);
      this.totalTxt.textContent = val >= 10950000 ? '≈ 11 triệu' : fmtNum(val);
      const landT = totT - cDur;
      const shake = totT < cDur ? Math.sin(totT*50)*3*(1-totT/cDur) : 0;
      let sc = totT < 0.15 ? popIn(totT, 0, 0.15) : landT > 0 ? impactPulse(t, M(1,13)+cDur, 0.35, 0.25) : 1;
      this.totalG.setAttribute("transform", `translate(${(540+shake).toFixed(1)},720) scale(${sc.toFixed(3)})`);
      this.glowEl.setAttribute("opacity", (landT > 0 ? 0.6*Math.max(0,1-landT/0.6) : 0).toFixed(3));
    }
  }
};

/* ── Cảnh 2: Trà sữa, con số chồng lên ── */
const scene2 = {
  build(el){
    el.innerHTML = `<svg viewBox="0 0 1080 1920" width="1080" height="1920" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="c8s2bg" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stop-color="#1e1428"/>
        <stop offset="1" stop-color="#2a1e38"/>
      </linearGradient>
      <radialGradient id="c8s2glow" cx=".5" cy=".5" r=".5">
        <stop offset="0" stop-color="#ff8888" stop-opacity=".5"/>
        <stop offset="1" stop-color="#ff8888" stop-opacity="0"/>
      </radialGradient>
    </defs>
    <rect width="1080" height="1920" fill="url(#c8s2bg)"/>
    <g id="s2boba">
      <rect x="440" y="700" width="200" height="320" rx="20" fill="#f8e8d8" stroke="#d4b898" stroke-width="4" opacity=".9"/>
      <circle cx="480" cy="960" r="14" fill="#3a2a1a" opacity=".6"/>
      <circle cx="520" cy="980" r="12" fill="#3a2a1a" opacity=".5"/>
      <circle cx="560" cy="960" r="14" fill="#3a2a1a" opacity=".7"/>
      <circle cx="500" cy="940" r="10" fill="#3a2a1a" opacity=".4"/>
      <circle cx="540" cy="940" r="12" fill="#3a2a1a" opacity=".6"/>
      <rect x="510" y="660" width="20" height="120" rx="4" fill="#888" transform="rotate(15 520 720)"/>
      <ellipse cx="540" cy="700" rx="100" ry="22" fill="#c8a888"/>
      <text x="540" y="1080" font-size="40" fill="#c8a0d8" font-weight="700" text-anchor="middle" font-family="sans-serif">45k / ly</text>
    </g>
    <g id="s2calcG" opacity="0">
      <text x="0" y="10" font-size="60" font-weight="700" fill="#c8a0d8" font-family="monospace" text-anchor="middle">45k × 2 × 52</text>
    </g>
    <g id="s2totalG" opacity="0">
      <ellipse cx="0" cy="0" rx="260" ry="55" fill="url(#c8s2glow)" opacity="0" id="s2glowEl"/>
      <text id="s2totalTxt" x="0" y="16" font-size="88" font-weight="900" fill="#ff8888" font-family="monospace" text-anchor="middle">0đ</text>
    </g>
    ${Ch.markup("s2_")}
    </svg>`;
    this.C = Ch.bind("s2_");
    this.boba = el.querySelector("#s2boba");
    this.calcG = el.querySelector("#s2calcG");
    this.totalG = el.querySelector("#s2totalG");
    this.totalTxt = el.querySelector("#s2totalTxt");
    this.glowEl = el.querySelector("#s2glowEl");
  },
  update(t){
    const s2=D.lines[2].s, gt=t+s2;
    Ch.place(this.C, 260, 1500, 1.15, 1);
    Ch.pose(this.C, { t, exp:"binh-thuong", hideLegs:true, talk:talkAt(gt), gaze:[3,-1], headRot:2 });
    const calcT = t - M(2,3);
    if (calcT < 0) { this.calcG.setAttribute("opacity","0"); }
    else {
      this.calcG.setAttribute("opacity","1");
      const sc = popIn(t, M(2,3), 0.35);
      this.calcG.setAttribute("transform", `translate(540,480) scale(${sc.toFixed(3)})`);
      const bb = 5 * Math.max(0,1-calcT/0.3) * Math.sin(calcT*18);
      this.boba.setAttribute("transform", `translate(0,${bb.toFixed(1)})`);
    }
    const totT = t - M(2,8);
    const cDur = 0.6;
    if (totT < 0) { this.totalG.setAttribute("opacity","0"); }
    else {
      this.totalG.setAttribute("opacity","1");
      const val = countVal(t, M(2,8), cDur, 4680000);
      this.totalTxt.textContent = val >= 4680000 ? '≈ 4,7 triệu' : fmtNum(val);
      const landT = totT - cDur;
      const shake = totT < cDur ? Math.sin(totT*50)*2.5*(1-totT/cDur) : 0;
      let sc = totT < 0.15 ? popIn(totT, 0, 0.15) : landT > 0 ? impactPulse(t, M(2,8)+cDur, 0.3, 0.25) : 1;
      this.totalG.setAttribute("transform", `translate(${(540+shake).toFixed(1)},600) scale(${sc.toFixed(3)})`);
      this.glowEl.setAttribute("opacity", (landT > 0 ? 0.5*Math.max(0,1-landT/0.5) : 0).toFixed(3));
    }
  }
};

/* ── Cảnh 3: Xe giao hàng, phí ship ── */
const scene3 = {
  build(el){
    el.innerHTML = `<svg viewBox="0 0 1080 1920" width="1080" height="1920" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="c8s3bg" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stop-color="#1a2030"/>
        <stop offset="1" stop-color="#141824"/>
      </linearGradient>
      <radialGradient id="c8s3glow" cx=".5" cy=".5" r=".5">
        <stop offset="0" stop-color="#ff8888" stop-opacity=".5"/>
        <stop offset="1" stop-color="#ff8888" stop-opacity="0"/>
      </radialGradient>
    </defs>
    <rect width="1080" height="1920" fill="url(#c8s3bg)"/>
    <rect x="0" y="1480" width="1080" height="440" fill="#2a2a3a"/>
    <rect x="0" y="1460" width="1080" height="30" rx="4" fill="#3a3a4a"/>
    <g id="s3bike" transform="translate(540 950)">
      <circle cx="-60" cy="80" r="50" fill="none" stroke="#555" stroke-width="8"/>
      <circle cx="60" cy="80" r="50" fill="none" stroke="#555" stroke-width="8"/>
      <path d="M-60 80 L-20 10 L30 10 L60 80" fill="none" stroke="#666" stroke-width="6"/>
      <rect x="-40" y="-60" width="80" height="70" rx="8" fill="#44aa66" opacity=".85"/>
      <text x="0" y="-15" font-size="32" fill="#fff" font-weight="700" text-anchor="middle" font-family="sans-serif">SHIP</text>
    </g>
    <g id="s3feeG" opacity="0">
      <rect x="-280" y="-50" width="560" height="100" rx="20" fill="#44aa66" opacity=".9"/>
      <text x="0" y="18" font-size="52" font-weight="800" fill="#fff" text-anchor="middle" font-family="monospace">15k × 3 × 52</text>
    </g>
    <g id="s3totalG" opacity="0">
      <ellipse cx="0" cy="0" rx="260" ry="55" fill="url(#c8s3glow)" opacity="0" id="s3glowEl"/>
      <text id="s3totalTxt" x="0" y="16" font-size="88" font-weight="900" fill="#ff8888" font-family="monospace" text-anchor="middle">0đ</text>
    </g>
    ${Ch.markup("s3_")}
    </svg>`;
    this.C = Ch.bind("s3_");
    this.feeG = el.querySelector("#s3feeG");
    this.totalG = el.querySelector("#s3totalG");
    this.totalTxt = el.querySelector("#s3totalTxt");
    this.glowEl = el.querySelector("#s3glowEl");
    this.bike = el.querySelector("#s3bike");
  },
  update(t){
    const s3=D.lines[3].s, gt=t+s3;
    Ch.place(this.C, 260, 1360, 1.2, 1);
    Ch.pose(this.C, { t, exp:"binh-thuong", holdPhone:true, talk:talkAt(gt), gaze:[3,2], headRot:0 });
    const bikeX = -200 + clamp(t/2, 0, 1) * 200;
    this.bike.setAttribute("transform", `translate(${(540+bikeX).toFixed(0)} 950)`);
    const feeT = t - M(3,3);
    if (feeT < 0) { this.feeG.setAttribute("opacity","0"); }
    else {
      this.feeG.setAttribute("opacity","1");
      const sx = lerp(350, 0, easeOut(feeT/0.4));
      const sc = popIn(t, M(3,3), 0.4);
      this.feeG.setAttribute("transform", `translate(${(540+sx).toFixed(0)},450) scale(${sc.toFixed(3)})`);
    }
    const totT = t - M(3,10);
    const cDur = 0.6;
    if (totT < 0) { this.totalG.setAttribute("opacity","0"); }
    else {
      this.totalG.setAttribute("opacity","1");
      const val = countVal(t, M(3,10), cDur, 2340000);
      this.totalTxt.textContent = val >= 2340000 ? '≈ 2,3 triệu' : fmtNum(val);
      const landT = totT - cDur;
      const shake = totT < cDur ? Math.sin(totT*50)*2*(1-totT/cDur) : 0;
      let sc = totT < 0.15 ? popIn(totT, 0, 0.15) : landT > 0 ? impactPulse(t, M(3,10)+cDur, 0.3, 0.2) : 1;
      this.totalG.setAttribute("transform", `translate(${(540+shake).toFixed(1)},600) scale(${sc.toFixed(3)})`);
      this.glowEl.setAttribute("opacity", (landT > 0 ? 0.5*Math.max(0,1-landT/0.5) : 0).toFixed(3));
    }
  }
};

/* ── Cảnh 4: Tổng cộng = 18 triệu = hơn 1 tháng lương ── */
const scene4 = {
  build(el){
    el.innerHTML = `<svg viewBox="0 0 1080 1920" width="1080" height="1920" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="c8s4bg" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stop-color="#0e0e1e"/>
        <stop offset="1" stop-color="#141828"/>
      </linearGradient>
      <radialGradient id="c8s4glow" cx=".5" cy=".5" r=".5">
        <stop offset="0" stop-color="#ff2020" stop-opacity=".6"/>
        <stop offset="1" stop-color="#ff2020" stop-opacity="0"/>
      </radialGradient>
      <radialGradient id="c8s4goldglow" cx=".5" cy=".5" r=".5">
        <stop offset="0" stop-color="#ffd35c" stop-opacity=".5"/>
        <stop offset="1" stop-color="#ffd35c" stop-opacity="0"/>
      </radialGradient>
    </defs>
    <rect width="1080" height="1920" fill="url(#c8s4bg)"/>
    <g id="s4item1" opacity="0">
      <rect x="180" y="420" width="720" height="80" rx="16" fill="#6b3e1f" opacity=".7"/>
      <text x="540" y="472" font-size="40" fill="#ffd35c" font-weight="700" text-anchor="middle" font-family="monospace">Cà phê: 10,95 tr</text>
    </g>
    <g id="s4item2" opacity="0">
      <rect x="180" y="520" width="720" height="80" rx="16" fill="#8a4a8a" opacity=".7"/>
      <text x="540" y="572" font-size="40" fill="#e0a0e0" font-weight="700" text-anchor="middle" font-family="monospace">Trà sữa: 4,68 tr</text>
    </g>
    <g id="s4item3" opacity="0">
      <rect x="180" y="620" width="720" height="80" rx="16" fill="#2a6a4a" opacity=".7"/>
      <text x="540" y="672" font-size="40" fill="#88ddaa" font-weight="700" text-anchor="middle" font-family="monospace">Ship: 2,34 tr</text>
    </g>
    <line id="s4line" x1="540" y1="730" x2="540" y2="730" stroke="#666" stroke-width="3" opacity="0"/>
    <g id="s4totalG" opacity="0">
      <ellipse cx="0" cy="0" rx="350" ry="80" fill="url(#c8s4glow)" opacity="0" id="s4glowEl"/>
      <rect x="-400" y="-70" width="800" height="140" rx="30" fill="#c42020" opacity=".9"/>
      <text id="s4totalTxt" x="0" y="22" font-size="80" font-weight="900" fill="#fff" text-anchor="middle" font-family="sans-serif">0đ</text>
    </g>
    <g id="s4salaryG" opacity="0">
      <ellipse cx="0" cy="0" rx="300" ry="50" fill="url(#c8s4goldglow)" opacity="0" id="s4salaryGlow"/>
      <text x="0" y="12" font-size="56" font-weight="700" fill="#ffd35c" text-anchor="middle" font-family="sans-serif">= hơn 1 tháng lương</text>
    </g>
    ${Ch.markup("s4_")}
    </svg>`;
    this.C = Ch.bind("s4_");
    this.item1 = el.querySelector("#s4item1");
    this.item2 = el.querySelector("#s4item2");
    this.item3 = el.querySelector("#s4item3");
    this.line = el.querySelector("#s4line");
    this.totalG = el.querySelector("#s4totalG");
    this.totalTxt = el.querySelector("#s4totalTxt");
    this.glowEl = el.querySelector("#s4glowEl");
    this.salaryG = el.querySelector("#s4salaryG");
    this.salaryGlow = el.querySelector("#s4salaryGlow");
  },
  update(t){
    const s4=D.lines[4].s, gt=t+s4;
    Ch.place(this.C, 540, 1500, 1.15, 1);
    Ch.pose(this.C, {
      t, exp: curExp(t,[0,"binh-thuong",M(4,3),"ngac-nhien"]),
      talk:talkAt(gt), gaze:[0,-3], headRot:0
    });
    const slideIn = (el, delay) => {
      const p = clamp((t - delay) / 0.4, 0, 1);
      el.setAttribute("opacity", easeOut(p).toFixed(3));
      el.setAttribute("transform", `translate(${lerp(-400,0,easeOut(p)).toFixed(0)},0)`);
    };
    slideIn(this.item1, 0);
    slideIn(this.item2, 0.2);
    slideIn(this.item3, 0.4);
    const lineT = t - 0.6;
    if (lineT > 0) {
      const lp = easeOut(clamp(lineT/0.3, 0, 1));
      this.line.setAttribute("opacity", lp.toFixed(3));
      this.line.setAttribute("x1", lerp(540, 250, lp).toFixed(0));
      this.line.setAttribute("x2", lerp(540, 830, lp).toFixed(0));
    }
    const totT = t - M(4,1);
    const cDur = 0.9;
    if (totT < 0) { this.totalG.setAttribute("opacity","0"); }
    else {
      this.totalG.setAttribute("opacity","1");
      const val = countVal(t, M(4,1), cDur, 17970000);
      this.totalTxt.textContent = val >= 17970000 ? '≈ 18 triệu' : fmtNum(val);
      const landT = totT - cDur;
      const shake = totT < cDur ? Math.sin(totT*55)*4*(1-totT/cDur) : 0;
      let sc = totT < 0.2 ? popIn(totT, 0, 0.2) : landT > 0 ? impactPulse(t, M(4,1)+cDur, 0.4, 0.35) : 1;
      this.totalG.setAttribute("transform", `translate(${(540+shake).toFixed(1)},850) scale(${sc.toFixed(3)})`);
      this.glowEl.setAttribute("opacity", (landT > 0 ? 0.7*Math.max(0,1-landT/0.7) : 0).toFixed(3));
    }
    const salT = t - M(4,3);
    if (salT < 0) { this.salaryG.setAttribute("opacity","0"); }
    else {
      this.salaryG.setAttribute("opacity","1");
      const sc = popIn(t, M(4,3), 0.4);
      this.salaryG.setAttribute("transform", `translate(540,1080) scale(${sc.toFixed(3)})`);
      const gp = salT > 0.4 ? 0.4*(0.5+0.5*Math.sin(salT*4)) : 0;
      this.salaryGlow.setAttribute("opacity", gp.toFixed(3));
    }
  }
};

/* ── Cảnh 5: Phòng trọ tối, mưa, ly nước lọc ── */
const scene5 = {
  build(el){
    const rainDrops = Array.from({length:30},(_,i)=>{
      const x = 60+Math.random()*960, y = Math.random()*1920, h = 20+Math.random()*30;
      return `<line id="s5r${i}" x1="${x}" y1="${y}" x2="${x}" y2="${y+h}" stroke="#6a8aaa" stroke-width="2" opacity=".5"/>`;
    }).join("");
    el.innerHTML = `<svg viewBox="0 0 1080 1920" width="1080" height="1920" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="c8s5bg" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stop-color="#0a0e18"/>
        <stop offset="1" stop-color="#101420"/>
      </linearGradient>
    </defs>
    <rect width="1080" height="1920" fill="url(#c8s5bg)"/>
    <rect x="600" y="400" width="360" height="480" rx="10" fill="#141828" stroke="#1e2840" stroke-width="4"/>
    <g id="s5rain">${rainDrops}</g>
    <rect x="610" y="410" width="340" height="460" rx="6" fill="#1a2238"/>
    <g opacity=".25">
      <line x1="620" y1="500" x2="940" y2="500" stroke="#4a6a8a" stroke-width="1" opacity=".4"/>
      <line x1="620" y1="600" x2="940" y2="600" stroke="#4a6a8a" stroke-width="1" opacity=".3"/>
      <line x1="620" y1="700" x2="940" y2="700" stroke="#4a6a8a" stroke-width="1" opacity=".2"/>
    </g>
    <rect x="0" y="1300" width="1080" height="620" fill="#0e1220"/>
    <rect x="200" y="1200" width="500" height="20" rx="4" fill="#1a2030"/>
    <g id="s5glass">
      <rect x="750" y="1120" width="80" height="120" rx="8" fill="#c8d8e8" opacity=".55" stroke="#8a9ab8" stroke-width="2"/>
      <rect x="758" y="1130" width="64" height="100" rx="4" fill="#a8c8e8" opacity=".3"/>
    </g>
    ${Ch.markup("s5_")}
    </svg>`;
    this.C = Ch.bind("s5_");
    this.rainEls = Array.from({length:30},(_,i)=>el.querySelector("#s5r"+i));
  },
  update(t){
    const s5=D.lines[5].s, gt=t+s5;
    Ch.place(this.C, 400, 1400, 1.2, 1);
    Ch.pose(this.C, { t, exp:"met", hideLegs:true, talk:talkAt(gt), gaze:[5,4], headRot:6 });
    this.rainEls.forEach((r,i)=>{
      const speed = 300 + (i%5)*100;
      const dy = (t * speed + i * 73) % 2200 - 200;
      r.setAttribute("y1", dy.toFixed(0));
      r.setAttribute("y2", (dy + 25).toFixed(0));
      r.setAttribute("opacity", (0.3 + 0.25*Math.sin(t*2+i)).toFixed(2));
    });
  }
};

window.SCENES = [scene0, scene1, scene2, scene3, scene4, scene5];
