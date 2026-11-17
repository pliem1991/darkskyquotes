/* scenes.js — clip 9: tiết kiệm 100k mỗi ngày
   6 cảnh: ống heo bàn, tính nhân 1 năm, tính nhân 10 năm, lạm phát, bỏ hết, phòng mưa. */

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

function piggyBank(id, x, y, sc, color) {
  const c = color || '#ffb0c0';
  const dark = color === '#a8b8c8' ? '#7888a0' : '#d8808a';
  return `<g id="${id}" transform="translate(${x},${y}) scale(${sc})">
    <ellipse cx="0" cy="0" rx="90" ry="70" fill="${c}"/>
    <ellipse cx="-75" cy="40" rx="18" ry="22" fill="${dark}"/>
    <ellipse cx="75" cy="40" rx="18" ry="22" fill="${dark}"/>
    <ellipse cx="80" cy="-20" rx="30" ry="40" fill="${c}"/>
    <circle cx="90" cy="-30" r="5" fill="#333"/>
    <ellipse cx="100" cy="-10" rx="10" ry="8" fill="${dark}"/>
    <rect x="-20" y="-78" width="40" height="12" rx="6" fill="#888"/>
  </g>`;
}

/* ── Cảnh 0: Bàn ấm, ống heo, tay bỏ tiền ── */
const scene0 = {
  build(el){
    el.innerHTML = `<svg viewBox="0 0 1080 1920" width="1080" height="1920" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="c9s0bg" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stop-color="#2a2218"/>
        <stop offset="1" stop-color="#1a1810"/>
      </linearGradient>
      <radialGradient id="c9s0warm" cx=".5" cy=".35" r=".5">
        <stop offset="0" stop-color="#ffd27a" stop-opacity=".2"/>
        <stop offset="1" stop-color="#ffd27a" stop-opacity="0"/>
      </radialGradient>
    </defs>
    <rect width="1080" height="1920" fill="url(#c9s0bg)"/>
    <circle cx="540" cy="650" r="400" fill="url(#c9s0warm)"/>
    <rect x="200" y="1050" width="680" height="16" rx="4" fill="#3a3020"/>
    <rect x="180" y="1060" width="720" height="400" rx="6" fill="#2a2218" opacity=".6"/>
    ${piggyBank('s0pig', 540, 920, 1.3)}
    <g id="s0coin" opacity="0">
      <rect x="510" y="600" width="60" height="40" rx="8" fill="#44aa66" stroke="#2a8844" stroke-width="3"/>
      <text x="540" y="628" font-size="20" fill="#fff" font-weight="700" text-anchor="middle" font-family="sans-serif">100k</text>
    </g>
    ${Ch.markup("s0_")}
    </svg>`;
    this.C = Ch.bind("s0_");
    this.coin = el.querySelector("#s0coin");
    this.pig = el.querySelector("#s0pig");
  },
  update(t){
    const s0=D.lines[0].s, gt=t+s0;
    Ch.place(this.C, 300, 1500, 1.2, 1);
    Ch.pose(this.C, { t, exp:"binh-thuong", hideLegs:true, talk:talkAt(gt), gaze:[3,-2], headRot:3 });
    const coinP = clamp(t/0.8, 0, 1);
    const coinY = lerp(600, 842, easeIn(coinP));
    this.coin.setAttribute("opacity", coinP < 0.05 ? "0" : (coinP < 0.9 ? "1" : lerp(1,0,clamp((coinP-0.9)/0.1,0,1)).toFixed(2)));
    this.coin.setAttribute("transform", `translate(0,${(coinY-600).toFixed(0)})`);
    if (coinP > 0.85) {
      const bounce = 4 * Math.max(0, 1-(coinP-0.85)/0.15) * Math.sin((coinP-0.85)*60);
      this.pig.setAttribute("transform", `translate(540,${(920+bounce).toFixed(1)}) scale(1.3)`);
    }
  }
};

/* ── Cảnh 1: 100k × 365 = 36.5 triệu ── */
const scene1 = {
  build(el){
    el.innerHTML = `<svg viewBox="0 0 1080 1920" width="1080" height="1920" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="c9s1bg" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stop-color="#1a2a1a"/>
        <stop offset="1" stop-color="#0e1a0e"/>
      </linearGradient>
      <radialGradient id="c9s1glow" cx=".5" cy=".5" r=".5">
        <stop offset="0" stop-color="#44cc66" stop-opacity=".5"/>
        <stop offset="1" stop-color="#44cc66" stop-opacity="0"/>
      </radialGradient>
    </defs>
    <rect width="1080" height="1920" fill="url(#c9s1bg)"/>
    ${piggyBank('s1pig', 540, 900, 1.1)}
    <g id="s1priceG" opacity="0">
      <text x="0" y="10" font-size="72" font-weight="800" fill="#88ddaa" font-family="monospace" text-anchor="middle">100k / ngày</text>
    </g>
    <g id="s1mulG" opacity="0">
      <text x="0" y="10" font-size="60" font-weight="700" fill="#8ab4ff" font-family="monospace" text-anchor="middle">× 365 ngày</text>
    </g>
    <g id="s1totalG" opacity="0">
      <ellipse cx="0" cy="0" rx="320" ry="60" fill="url(#c9s1glow)" opacity="0" id="s1glowEl"/>
      <text id="s1totalTxt" x="0" y="16" font-size="88" font-weight="900" fill="#44cc66" font-family="monospace" text-anchor="middle">0đ</text>
    </g>
    ${Ch.markup("s1_")}
    </svg>`;
    this.C = Ch.bind("s1_");
    this.priceG = el.querySelector("#s1priceG");
    this.mulG = el.querySelector("#s1mulG");
    this.totalG = el.querySelector("#s1totalG");
    this.totalTxt = el.querySelector("#s1totalTxt");
    this.glowEl = el.querySelector("#s1glowEl");
  },
  update(t){
    const s1=D.lines[1].s, gt=t+s1;
    Ch.place(this.C, 260, 1500, 1.15, 1);
    Ch.pose(this.C, {
      t, exp: curExp(t,[0,"binh-thuong", M(1,14),"ngac-nhien"]),
      hideLegs:true, talk:talkAt(gt), gaze:[3,0], headRot:3
    });
    const prT = t - M(1,0);
    if (prT < 0) { this.priceG.setAttribute("opacity","0"); }
    else {
      this.priceG.setAttribute("opacity","1");
      const sc = popIn(t, M(1,0), 0.35);
      this.priceG.setAttribute("transform", `translate(540,520) scale(${sc.toFixed(3)})`);
    }
    const mulT = t - M(1,14);
    if (mulT < 0) { this.mulG.setAttribute("opacity","0"); }
    else {
      const sx = lerp(300, 0, easeOut(mulT/0.45));
      this.mulG.setAttribute("opacity", easeOut(mulT/0.35).toFixed(3));
      this.mulG.setAttribute("transform", `translate(${(540+sx).toFixed(0)},640)`);
    }
    const totT = t - M(1,16);
    const cDur = 0.7;
    if (totT < 0) { this.totalG.setAttribute("opacity","0"); }
    else {
      this.totalG.setAttribute("opacity","1");
      const val = countVal(t, M(1,16), cDur, 36500000);
      this.totalTxt.textContent = val >= 36500000 ? '36.500.000đ' : fmtNum(val);
      const landT = totT - cDur;
      const shake = totT < cDur ? Math.sin(totT*50)*3*(1-totT/cDur) : 0;
      let sc = totT < 0.15 ? popIn(totT, 0, 0.15) : landT > 0 ? impactPulse(t, M(1,16)+cDur, 0.35, 0.25) : 1;
      this.totalG.setAttribute("transform", `translate(${(540+shake).toFixed(1)},720) scale(${sc.toFixed(3)})`);
      this.glowEl.setAttribute("opacity", (landT > 0 ? 0.6*Math.max(0,1-landT/0.6) : 0).toFixed(3));
    }
  }
};

/* ── Cảnh 2: × 10 năm = 365 triệu, ống heo lớn ── */
const scene2 = {
  build(el){
    el.innerHTML = `<svg viewBox="0 0 1080 1920" width="1080" height="1920" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="c9s2bg" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stop-color="#1a1a2e"/>
        <stop offset="1" stop-color="#0e0e1e"/>
      </linearGradient>
      <radialGradient id="c9s2glow" cx=".5" cy=".5" r=".5">
        <stop offset="0" stop-color="#ffd35c" stop-opacity=".5"/>
        <stop offset="1" stop-color="#ffd35c" stop-opacity="0"/>
      </radialGradient>
    </defs>
    <rect width="1080" height="1920" fill="url(#c9s2bg)"/>
    ${piggyBank('s2pig', 540, 900, 1.2)}
    <g id="s2mulG" opacity="0">
      <text x="0" y="10" font-size="64" font-weight="800" fill="#8ab4ff" font-family="monospace" text-anchor="middle">× 10 năm</text>
    </g>
    <g id="s2totalG" opacity="0">
      <ellipse cx="0" cy="0" rx="350" ry="65" fill="url(#c9s2glow)" opacity="0" id="s2glowEl"/>
      <text id="s2totalTxt" x="0" y="18" font-size="96" font-weight="900" fill="#ffd35c" font-family="monospace" text-anchor="middle">0đ</text>
    </g>
    ${Ch.markup("s2_")}
    </svg>`;
    this.C = Ch.bind("s2_");
    this.pig = el.querySelector("#s2pig");
    this.mulG = el.querySelector("#s2mulG");
    this.totalG = el.querySelector("#s2totalG");
    this.totalTxt = el.querySelector("#s2totalTxt");
    this.glowEl = el.querySelector("#s2glowEl");
  },
  update(t){
    const s2=D.lines[2].s, gt=t+s2;
    Ch.place(this.C, 260, 1500, 1.15, 1);
    Ch.pose(this.C, {
      t, exp: curExp(t,[0,"binh-thuong",M(2,6),"ngac-nhien"]),
      hideLegs:true, talk:talkAt(gt), gaze:[3,-1], headRot:2
    });
    const pigGrow = clamp(t / (D.lines[2].e - D.lines[2].s), 0, 1);
    const pigSc = lerp(1.2, 1.6, easeOut(pigGrow));
    this.pig.setAttribute("transform", `translate(540,${lerp(900,870,easeOut(pigGrow)).toFixed(0)}) scale(${pigSc.toFixed(2)})`);

    const mulT = t - M(2,0);
    if (mulT < 0) { this.mulG.setAttribute("opacity","0"); }
    else {
      this.mulG.setAttribute("opacity","1");
      const sc = popIn(t, M(2,0), 0.4);
      this.mulG.setAttribute("transform", `translate(540,520) scale(${sc.toFixed(3)})`);
    }

    const totT = t - M(2,6);
    const cDur = 0.8;
    if (totT < 0) { this.totalG.setAttribute("opacity","0"); }
    else {
      this.totalG.setAttribute("opacity","1");
      const val = countVal(t, M(2,6), cDur, 365000000);
      this.totalTxt.textContent = val >= 365000000 ? '365.000.000đ' : fmtNum(val);
      const landT = totT - cDur;
      const shake = totT < cDur ? Math.sin(totT*45)*4*(1-totT/cDur) : 0;
      let sc = totT < 0.2 ? popIn(totT, 0, 0.2) : landT > 0 ? impactPulse(t, M(2,6)+cDur, 0.4, 0.3) : 1;
      this.totalG.setAttribute("transform", `translate(${(540+shake).toFixed(1)},680) scale(${sc.toFixed(3)})`);
      this.glowEl.setAttribute("opacity", (landT > 0 ? 0.7*Math.max(0,1-landT/0.7) : 0).toFixed(3));
    }
  }
};

/* ── Cảnh 3: Lạm phát, ống heo xẹp, 365tr → 240tr ── */
const scene3 = {
  build(el){
    el.innerHTML = `<svg viewBox="0 0 1080 1920" width="1080" height="1920" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="c9s3bg" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stop-color="#2a1818"/>
        <stop offset="1" stop-color="#1a0e0e"/>
      </linearGradient>
      <radialGradient id="c9s3glow" cx=".5" cy=".5" r=".5">
        <stop offset="0" stop-color="#ff4444" stop-opacity=".5"/>
        <stop offset="1" stop-color="#ff4444" stop-opacity="0"/>
      </radialGradient>
    </defs>
    <rect width="1080" height="1920" fill="url(#c9s3bg)"/>
    ${piggyBank('s3pig', 540, 900, 1.5, '#a8b8c8')}
    <g id="s3oldG" opacity="0">
      <text x="0" y="10" font-size="56" font-weight="700" fill="#888" font-family="monospace" text-anchor="middle" text-decoration="line-through">365.000.000đ</text>
    </g>
    <g id="s3arrowG" opacity="0">
      <text x="0" y="10" font-size="80" font-weight="800" fill="#ff4444" font-family="sans-serif" text-anchor="middle">↓</text>
    </g>
    <g id="s3newG" opacity="0">
      <ellipse cx="0" cy="0" rx="350" ry="60" fill="url(#c9s3glow)" opacity="0" id="s3glowEl"/>
      <text id="s3newTxt" x="0" y="18" font-size="88" font-weight="900" fill="#ff6666" font-family="monospace" text-anchor="middle">0đ</text>
    </g>
    <g id="s3label" opacity="0">
      <text x="0" y="10" font-size="40" font-weight="600" fill="#aaa" font-family="sans-serif" text-anchor="middle">sức mua thực tế</text>
    </g>
    ${Ch.markup("s3_")}
    </svg>`;
    this.C = Ch.bind("s3_");
    this.pig = el.querySelector("#s3pig");
    this.oldG = el.querySelector("#s3oldG");
    this.arrowG = el.querySelector("#s3arrowG");
    this.newG = el.querySelector("#s3newG");
    this.newTxt = el.querySelector("#s3newTxt");
    this.glowEl = el.querySelector("#s3glowEl");
    this.label = el.querySelector("#s3label");
  },
  update(t){
    const s3=D.lines[3].s, gt=t+s3;
    Ch.place(this.C, 260, 1500, 1.15, 1);
    Ch.pose(this.C, {
      t, exp: curExp(t,[0,"binh-thuong",M(3,8),"que",M(3,15),"met"]),
      hideLegs:true, talk:talkAt(gt), gaze:[3,0], headRot:-2
    });
    const deflateP = clamp((t - M(3,8)) / 2.5, 0, 1);
    const pigSc = lerp(1.5, 0.9, easeOut(deflateP));
    const pigY = lerp(900, 950, easeOut(deflateP));
    this.pig.setAttribute("transform", `translate(540,${pigY.toFixed(0)}) scale(${pigSc.toFixed(2)})`);

    const oldT = t - M(3,8);
    if (oldT < 0) { this.oldG.setAttribute("opacity","0"); }
    else {
      const sc = popIn(t, M(3,8), 0.35);
      this.oldG.setAttribute("opacity","1");
      this.oldG.setAttribute("transform", `translate(540,460) scale(${sc.toFixed(3)})`);
    }

    const arrT = t - M(3,15);
    if (arrT < 0) { this.arrowG.setAttribute("opacity","0"); }
    else {
      this.arrowG.setAttribute("opacity", easeOut(clamp(arrT/0.3,0,1)).toFixed(3));
      const bounce = arrT < 0.5 ? 20*Math.sin(arrT*12)*(1-arrT/0.5) : 0;
      this.arrowG.setAttribute("transform", `translate(540,${(560+bounce).toFixed(0)})`);
    }

    const newT = t - M(3,18);
    const cDur = 0.8;
    if (newT < 0) { this.newG.setAttribute("opacity","0"); }
    else {
      this.newG.setAttribute("opacity","1");
      const val = 365000000 - countVal(t, M(3,18), cDur, 125000000);
      this.newTxt.textContent = val <= 240000000 ? '~240.000.000đ' : fmtNum(val);
      const landT = newT - cDur;
      const shake = newT < cDur ? Math.sin(newT*40)*3*(1-newT/cDur) : 0;
      let sc = newT < 0.15 ? popIn(newT, 0, 0.15) : landT > 0 ? impactPulse(t, M(3,18)+cDur, 0.35, 0.2) : 1;
      this.newG.setAttribute("transform", `translate(${(540+shake).toFixed(1)},660) scale(${sc.toFixed(3)})`);
      this.glowEl.setAttribute("opacity", (landT > 0 ? 0.5*Math.max(0,1-landT/0.5) : 0).toFixed(3));
    }

    const labT = t - M(3,18) - 0.5;
    if (labT < 0) { this.label.setAttribute("opacity","0"); }
    else {
      this.label.setAttribute("opacity", easeOut(clamp(labT/0.3,0,1)).toFixed(3));
      this.label.setAttribute("transform", `translate(540,730)`);
    }
  }
};

/* ── Cảnh 4: Items gạch bỏ, 240 triệu, nhìn xa ── */
const scene4 = {
  build(el){
    el.innerHTML = `<svg viewBox="0 0 1080 1920" width="1080" height="1920" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="c9s4bg" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stop-color="#141420"/>
        <stop offset="1" stop-color="#0e0e1a"/>
      </linearGradient>
    </defs>
    <rect width="1080" height="1920" fill="url(#c9s4bg)"/>
    <g id="s4numG" opacity="0">
      <text x="540" y="440" font-size="96" font-weight="900" fill="#ff8866" font-family="monospace" text-anchor="middle">~240 triệu</text>
    </g>
    <g id="s4coffee" opacity="0" transform="translate(220,620)">
      <rect x="-80" y="-45" width="160" height="90" rx="20" fill="#6b3e1f" opacity=".8"/>
      <text x="0" y="12" font-size="36" fill="#ffd35c" font-weight="700" text-anchor="middle" font-family="sans-serif">Cà phê</text>
      <line id="s4cx" x1="-80" y1="0" x2="-80" y2="0" stroke="#ff4444" stroke-width="6" opacity="0"/>
    </g>
    <g id="s4boba" opacity="0" transform="translate(540,620)">
      <rect x="-80" y="-45" width="160" height="90" rx="20" fill="#8a4a8a" opacity=".8"/>
      <text x="0" y="12" font-size="36" fill="#e0a0e0" font-weight="700" text-anchor="middle" font-family="sans-serif">Trà sữa</text>
      <line id="s4bx" x1="-80" y1="0" x2="-80" y2="0" stroke="#ff4444" stroke-width="6" opacity="0"/>
    </g>
    <g id="s4food" opacity="0" transform="translate(860,620)">
      <rect x="-80" y="-45" width="160" height="90" rx="20" fill="#2a6a4a" opacity=".8"/>
      <text x="0" y="12" font-size="36" fill="#88ddaa" font-weight="700" text-anchor="middle" font-family="sans-serif">Ăn ngoài</text>
      <line id="s4fx" x1="-80" y1="0" x2="-80" y2="0" stroke="#ff4444" stroke-width="6" opacity="0"/>
    </g>
    ${Ch.markup("s4_")}
    </svg>`;
    this.C = Ch.bind("s4_");
    this.numG = el.querySelector("#s4numG");
    this.coffee = el.querySelector("#s4coffee");
    this.boba = el.querySelector("#s4boba");
    this.food = el.querySelector("#s4food");
    this.cx = el.querySelector("#s4cx");
    this.bx = el.querySelector("#s4bx");
    this.fx = el.querySelector("#s4fx");
  },
  update(t){
    const s4=D.lines[4].s, gt=t+s4;
    Ch.place(this.C, 540, 1500, 1.15, 1);
    Ch.pose(this.C, {
      t, exp: curExp(t,[0,"que",M(4,5),"met"]),
      talk:talkAt(gt), gaze:[5,3], headRot:5
    });
    const numT = t - M(4,0);
    if (numT < 0) { this.numG.setAttribute("opacity","0"); }
    else {
      const sc = popIn(t, M(4,0), 0.3);
      this.numG.setAttribute("opacity","1");
      this.numG.setAttribute("transform", `scale(${sc.toFixed(3)})`);
      this.numG.style.transformOrigin = "540px 440px";
    }

    const showItem = (el, xLine, delay) => {
      const p = clamp((t - delay) / 0.35, 0, 1);
      el.setAttribute("opacity", easeOut(p).toFixed(3));
      const crossT = clamp((t - delay - 0.4) / 0.25, 0, 1);
      if (crossT > 0) {
        xLine.setAttribute("opacity","1");
        xLine.setAttribute("x2", lerp(-80, 80, easeOut(crossT)).toFixed(0));
      }
    };
    showItem(this.coffee, this.cx, M(4,7));
    showItem(this.boba, this.bx, M(4,10));
    showItem(this.food, this.fx, M(4,13));
  }
};

/* ── Cảnh 5: Phòng trọ tối, mưa, bàn trống ── */
const scene5 = {
  build(el){
    const rainDrops = Array.from({length:30},(_,i)=>{
      const x = 60+Math.random()*960, y = Math.random()*1920, h = 20+Math.random()*30;
      return `<line id="s5r${i}" x1="${x}" y1="${y}" x2="${x}" y2="${y+h}" stroke="#6a8aaa" stroke-width="2" opacity=".5"/>`;
    }).join("");
    el.innerHTML = `<svg viewBox="0 0 1080 1920" width="1080" height="1920" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="c9s5bg" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stop-color="#0a0e18"/>
        <stop offset="1" stop-color="#101420"/>
      </linearGradient>
    </defs>
    <rect width="1080" height="1920" fill="url(#c9s5bg)"/>
    <rect x="600" y="400" width="360" height="480" rx="10" fill="#141828" stroke="#1e2840" stroke-width="4"/>
    <g id="s5rain">${rainDrops}</g>
    <rect x="610" y="410" width="340" height="460" rx="6" fill="#1a2238"/>
    <g opacity=".25">
      <line x1="620" y1="500" x2="940" y2="500" stroke="#4a6a8a" stroke-width="1" opacity=".4"/>
      <line x1="620" y1="600" x2="940" y2="600" stroke="#4a6a8a" stroke-width="1" opacity=".3"/>
    </g>
    <rect x="0" y="1300" width="1080" height="620" fill="#0e1220"/>
    <rect x="200" y="1200" width="500" height="20" rx="4" fill="#1a2030"/>
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
