/* scenes.js — clip 7: bao nhiêu năm mua nhà
   6 cảnh: thành phố hoàng hôn, phòng trọ tính toán, chung cư bảng giá,
   lịch lật năm, biểu đồ khoảng cách, đêm lướt tin bán nhà. */

const Ch = window.Char;
const D = window.DATA;
const clamp = (x,a,b) => Math.max(a,Math.min(b,x));
const lerp = (a,b,t) => a+(b-a)*clamp(t,0,1);
const easeOut = t => { t=clamp(t,0,1); return 1-(1-t)*(1-t); };
const easeIn = t => { t=clamp(t,0,1); return t*t; };
const backOut = t => { t=clamp(t,0,1); const c=1.7; return 1+(--t)*t*((c+1)*t+c); };

function M(lineIdx,sylIdx){
  const s=D.lines[lineIdx]; if(!s||!s.syl[sylIdx]) return 0;
  return s.syl[sylIdx].s - s.s;
}
function talkAt(gt){
  const fi=Math.floor(gt*30); return (D.env[fi]||0)*3.5;
}
function curExp(t,pairs){
  for(let i=pairs.length-2;i>=0;i-=2) if(t>=pairs[i]) return pairs[i+1];
  return pairs[1];
}

/* ── Cảnh 0: Thành phố hoàng hôn, lướt tin bán nhà ── */
const scene0 = {
  build(el){
    const s0 = D.lines[0].s;
    el.innerHTML = `<svg viewBox="0 0 1080 1920" width="1080" height="1920" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="c7s0sky" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stop-color="#0a1628"/>
        <stop offset=".45" stop-color="#2a3a6e"/>
        <stop offset=".75" stop-color="#c45a3c"/>
        <stop offset="1" stop-color="#e8a84c"/>
      </linearGradient>
    </defs>
    <rect width="1080" height="1920" fill="url(#c7s0sky)"/>
    <g id="s0city" opacity=".85">
      <rect x="40" y="1100" width="120" height="480" rx="4" fill="#0e1a30"/>
      <rect x="50" y="1120" width="16" height="20" rx="2" fill="#ffd27a" opacity=".6"/>
      <rect x="84" y="1120" width="16" height="20" rx="2" fill="#ffd27a" opacity=".4"/>
      <rect x="50" y="1160" width="16" height="20" rx="2" fill="#ffd27a" opacity=".5"/>
      <rect x="84" y="1160" width="16" height="20" rx="2" fill="#ffd27a" opacity=".7"/>
      <rect x="50" y="1200" width="16" height="20" rx="2" fill="#ffd27a" opacity=".3"/>
      <rect x="190" y="1000" width="160" height="580" rx="4" fill="#121e36"/>
      <rect x="210" y="1020" width="20" height="24" rx="2" fill="#ffd27a" opacity=".5"/>
      <rect x="250" y="1020" width="20" height="24" rx="2" fill="#ffd27a" opacity=".7"/>
      <rect x="290" y="1020" width="20" height="24" rx="2" fill="#ffd27a" opacity=".4"/>
      <rect x="210" y="1064" width="20" height="24" rx="2" fill="#ffd27a" opacity=".6"/>
      <rect x="250" y="1064" width="20" height="24" rx="2" fill="#ffd27a" opacity=".3"/>
      <rect x="290" y="1064" width="20" height="24" rx="2" fill="#ffd27a" opacity=".5"/>
      <rect x="210" y="1108" width="20" height="24" rx="2" fill="#ffd27a" opacity=".7"/>
      <rect x="250" y="1108" width="20" height="24" rx="2" fill="#ffd27a" opacity=".4"/>
      <rect x="390" y="1060" width="140" height="520" rx="4" fill="#0e1a30"/>
      <rect x="410" y="1080" width="18" height="22" rx="2" fill="#ffd27a" opacity=".5"/>
      <rect x="440" y="1080" width="18" height="22" rx="2" fill="#ffd27a" opacity=".6"/>
      <rect x="470" y="1080" width="18" height="22" rx="2" fill="#ffd27a" opacity=".3"/>
      <rect x="410" y="1120" width="18" height="22" rx="2" fill="#ffd27a" opacity=".4"/>
      <rect x="440" y="1120" width="18" height="22" rx="2" fill="#ffd27a" opacity=".7"/>
      <rect x="580" y="1140" width="100" height="440" rx="4" fill="#162444"/>
      <rect x="595" y="1160" width="14" height="18" rx="2" fill="#ffd27a" opacity=".5"/>
      <rect x="625" y="1160" width="14" height="18" rx="2" fill="#ffd27a" opacity=".6"/>
      <rect x="595" y="1200" width="14" height="18" rx="2" fill="#ffd27a" opacity=".4"/>
      <rect x="720" y="980" width="180" height="600" rx="4" fill="#0e1a30"/>
      <rect x="740" y="1000" width="22" height="26" rx="2" fill="#ffd27a" opacity=".6"/>
      <rect x="780" y="1000" width="22" height="26" rx="2" fill="#ffd27a" opacity=".4"/>
      <rect x="820" y="1000" width="22" height="26" rx="2" fill="#ffd27a" opacity=".7"/>
      <rect x="740" y="1046" width="22" height="26" rx="2" fill="#ffd27a" opacity=".5"/>
      <rect x="780" y="1046" width="22" height="26" rx="2" fill="#ffd27a" opacity=".3"/>
      <rect x="820" y="1046" width="22" height="26" rx="2" fill="#ffd27a" opacity=".6"/>
      <rect x="940" y="1180" width="100" height="400" rx="4" fill="#162444"/>
      <rect x="955" y="1200" width="14" height="18" rx="2" fill="#ffd27a" opacity=".5"/>
      <rect x="985" y="1200" width="14" height="18" rx="2" fill="#ffd27a" opacity=".4"/>
    </g>
    <rect x="0" y="1580" width="1080" height="340" fill="#0a0f1e"/>
    ${Ch.markup("s0_",{phoneScreen:"#b8e0ff"})}
    </svg>`;
    this.C = Ch.bind("s0_");
  },
  update(t){
    const s0=D.lines[0].s, gt=t+s0;
    Ch.place(this.C, 540, 1460, 1.35, 1);
    Ch.pose(this.C, {
      t, exp: curExp(t,[0,"binh-thuong",M(0,6),"que"]),
      holdPhone:true, talk:talkAt(gt), gaze:[2,3], headRot:-3
    });
  }
};

/* ── Cảnh 1: Phòng trọ, bấm máy tính, 15tr − 12tr = 3tr ── */
const scene1 = {
  build(el){
    el.innerHTML = `<svg viewBox="0 0 1080 1920" width="1080" height="1920" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="c7s1bg" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stop-color="#2a2a3e"/>
        <stop offset="1" stop-color="#1a1a2e"/>
      </linearGradient>
      <radialGradient id="c7s1lamp" cx=".3" cy=".3" r=".7">
        <stop offset="0" stop-color="#fff4d6" stop-opacity=".25"/>
        <stop offset="1" stop-color="#fff4d6" stop-opacity="0"/>
      </radialGradient>
    </defs>
    <rect width="1080" height="1920" fill="url(#c7s1bg)"/>
    <rect x="0" y="1580" width="1080" height="340" fill="#1a1526" rx="0"/>
    <rect x="80" y="1200" width="500" height="380" rx="10" fill="#2e2844" stroke="#3a3458" stroke-width="3"/>
    <rect x="100" y="1220" width="100" height="80" rx="6" fill="#222040"/>
    <rect x="108" y="1228" width="84" height="50" rx="3" fill="#3a5"/>
    <text x="150" y="1262" font-size="28" fill="#aeffae" font-family="monospace" text-anchor="middle">0</text>
    <circle cx="200" cy="420" r="300" fill="url(#c7s1lamp)"/>
    <g id="s1nums" opacity="0">
      <text id="s1n1" x="700" y="700" font-size="96" font-weight="800" fill="#ffd35c" font-family="monospace" text-anchor="middle" opacity="0">15tr</text>
      <text id="s1n2" x="700" y="830" font-size="80" font-weight="800" fill="#ff8888" font-family="monospace" text-anchor="middle" opacity="0">− 12tr</text>
      <text id="s1n3" x="700" y="980" font-size="110" font-weight="800" fill="#6fef6f" font-family="monospace" text-anchor="middle" opacity="0">= 3tr</text>
      <text x="700" y="1050" font-size="44" font-weight="600" fill="#6fef6f" font-family="monospace" text-anchor="middle" opacity="0" id="s1n3b">/ tháng</text>
    </g>
    ${Ch.markup("s1_")}
    </svg>`;
    this.C = Ch.bind("s1_");
    this.nums = el.querySelector("#s1nums");
    this.n1 = el.querySelector("#s1n1");
    this.n2 = el.querySelector("#s1n2");
    this.n3 = el.querySelector("#s1n3");
    this.n3b = el.querySelector("#s1n3b");
  },
  update(t){
    const s1=D.lines[1].s, gt=t+s1;
    Ch.place(this.C, 300, 1460, 1.3, 1);
    Ch.pose(this.C, {
      t, exp:"binh-thuong", hideLegs:true,
      talk:talkAt(gt), gaze:[3,1], headRot:2
    });
    this.nums.setAttribute("opacity","1");
    const m1=M(1,0), m2=M(1,5), m3=M(1,10);
    this.n1.setAttribute("opacity", easeOut((t-m1)/0.4).toFixed(3));
    this.n2.setAttribute("opacity", easeOut((t-m2)/0.4).toFixed(3));
    const o3 = easeOut((t-m3)/0.4);
    this.n3.setAttribute("opacity", o3.toFixed(3));
    this.n3b.setAttribute("opacity", o3.toFixed(3));
  }
};

/* ── Cảnh 2: Tòa chung cư ngoại thành, bảng giá 2 tỷ ── */
const scene2 = {
  build(el){
    el.innerHTML = `<svg viewBox="0 0 1080 1920" width="1080" height="1920" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="c7s2sky" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stop-color="#4a5a8a"/>
        <stop offset="1" stop-color="#8a9ab8"/>
      </linearGradient>
    </defs>
    <rect width="1080" height="1920" fill="url(#c7s2sky)"/>
    <rect x="0" y="1580" width="1080" height="340" fill="#3a4a3a"/>
    <g id="s2bldg">
      <rect x="300" y="400" width="480" height="1180" rx="6" fill="#7a8a9a" stroke="#6a7a8a" stroke-width="4"/>
      <rect x="310" y="390" width="460" height="30" rx="3" fill="#8a9aaa"/>
      ${Array.from({length:12},(_,r)=>Array.from({length:5},(_,c)=>`<rect x="${330+c*88}" y="${440+r*90}" width="60" height="64" rx="4" fill="${Math.random()>.4?'#e8d8a0':'#5a6a7a'}" opacity="${(.4+Math.random()*.5).toFixed(2)}"/>`).join("")).join("")}
    </g>
    <g id="s2price" opacity="0">
      <rect x="180" y="720" width="720" height="160" rx="30" fill="#c42020" opacity=".92"/>
      <text x="540" y="825" font-size="88" font-weight="800" fill="#fff" font-family="monospace" text-anchor="middle">2.000.000.000đ</text>
    </g>
    ${Ch.markup("s2_")}
    </svg>`;
    this.C = Ch.bind("s2_");
    this.price = el.querySelector("#s2price");
  },
  update(t){
    const s2=D.lines[2].s, gt=t+s2;
    Ch.place(this.C, 540, 1460, 1.2, 1);
    Ch.pose(this.C, {
      t, exp: curExp(t,[0,"binh-thuong",M(2,5),"ngac-nhien"]),
      talk:talkAt(gt), gaze:[0,-4], headRot:-5
    });
    const priceT = M(2,8);
    this.price.setAttribute("opacity", easeOut((t-priceT)/0.5).toFixed(3));
  }
};

/* ── Cảnh 3: Phép chia, 56 năm, 84 tuổi ── */
const scene3 = {
  build(el){
    el.innerHTML = `<svg viewBox="0 0 1080 1920" width="1080" height="1920" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="c7s3bg" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stop-color="#0e162e"/>
        <stop offset="1" stop-color="#1a2240"/>
      </linearGradient>
    </defs>
    <rect width="1080" height="1920" fill="url(#c7s3bg)"/>
    <g id="s3math">
      <text id="s3div" x="540" y="560" font-size="72" font-weight="700" fill="#8ab4ff" font-family="monospace" text-anchor="middle" opacity="0">2.000.000.000 ÷ 3.000.000</text>
      <text id="s3eq" x="540" y="660" font-size="48" font-weight="600" fill="#8ab4ff" font-family="monospace" text-anchor="middle" opacity="0">= 666 tháng</text>
    </g>
    <g id="s3years" opacity="0">
      <text x="540" y="860" font-size="160" font-weight="900" fill="#ffd35c" font-family="sans-serif" text-anchor="middle">56 năm</text>
    </g>
    <g id="s3age" opacity="0">
      <text x="540" y="1060" font-size="120" font-weight="800" fill="#ff6b6b" font-family="sans-serif" text-anchor="middle">84 tuổi</text>
    </g>
    <g id="s3cal">
      ${Array.from({length:8},(_,i)=>`<rect id="s3cal${i}" x="${240+i*30}" y="${1160+i*15}" width="200" height="260" rx="12" fill="#1e2a50" stroke="#2a3a66" stroke-width="2" opacity=".6" transform="rotate(${-5+i*2} ${340+i*30} ${1290+i*15})"/>`).join("")}
    </g>
    ${Ch.markup("s3_")}
    </svg>`;
    this.C = Ch.bind("s3_");
    this.div = el.querySelector("#s3div");
    this.eq = el.querySelector("#s3eq");
    this.years = el.querySelector("#s3years");
    this.age = el.querySelector("#s3age");
    this.cals = Array.from({length:8},(_,i)=>el.querySelector("#s3cal"+i));
  },
  update(t){
    const s3=D.lines[3].s, gt=t+s3;
    Ch.place(this.C, 540, 1460, 1.15, 1);
    const ageM = M(3,8);
    Ch.pose(this.C, {
      t, exp: curExp(t,[0,"binh-thuong",M(3,4),"ngac-nhien",ageM,"met"]),
      talk:talkAt(gt), gaze:[0,-2], headRot:0
    });
    this.div.setAttribute("opacity", easeOut(t/0.5).toFixed(3));
    this.eq.setAttribute("opacity", easeOut((t-M(3,2))/0.4).toFixed(3));
    this.years.setAttribute("opacity", easeOut((t-M(3,4))/0.5).toFixed(3));
    this.age.setAttribute("opacity", easeOut((t-ageM)/0.6).toFixed(3));
    const calP = clamp((t-M(3,4))/2, 0, 1);
    this.cals.forEach((c,i)=>{
      const off = calP * (i+1) * 80;
      const rot = -5 + i*2 + calP * (i+1) * 15;
      c.setAttribute("transform", `translate(0 ${(-off).toFixed(0)}) rotate(${rot.toFixed(1)} 370 1290)`);
      c.setAttribute("opacity", (0.6 - calP*0.5).toFixed(2));
    });
  }
};

/* ── Cảnh 4: Biểu đồ giá nhà vs tiết kiệm ── */
const scene4 = {
  build(el){
    el.innerHTML = `<svg viewBox="0 0 1080 1920" width="1080" height="1920" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="c7s4bg" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stop-color="#0e0e1e"/>
        <stop offset="1" stop-color="#16162e"/>
      </linearGradient>
    </defs>
    <rect width="1080" height="1920" fill="url(#c7s4bg)"/>
    <g id="s4chart" transform="translate(100 400)">
      <line x1="60" y1="20" x2="60" y2="660" stroke="#334" stroke-width="3"/>
      <line x1="60" y1="660" x2="900" y2="660" stroke="#334" stroke-width="3"/>
      <text x="40" y="660" font-size="28" fill="#668" text-anchor="end" font-family="monospace">0</text>
      <text x="40" y="460" font-size="28" fill="#668" text-anchor="end" font-family="monospace">2tỷ</text>
      <text x="40" y="260" font-size="28" fill="#668" text-anchor="end" font-family="monospace">4tỷ</text>
      <text x="40" y="60" font-size="28" fill="#668" text-anchor="end" font-family="monospace">6tỷ</text>
      <text x="900" y="700" font-size="28" fill="#668" text-anchor="end" font-family="monospace">10 năm</text>
      <polyline id="s4price" points="" stroke="#ff4444" stroke-width="6" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
      <polyline id="s4save" points="" stroke="#44cc66" stroke-width="6" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
      <g id="s4label1" opacity="0">
        <rect x="620" y="100" width="260" height="56" rx="10" fill="#ff4444" opacity=".85"/>
        <text x="750" y="138" font-size="34" font-weight="700" fill="#fff" text-anchor="middle" font-family="sans-serif">+200tr/năm</text>
      </g>
      <g id="s4label2" opacity="0">
        <rect x="620" y="560" width="260" height="56" rx="10" fill="#44cc66" opacity=".85"/>
        <text x="750" y="598" font-size="34" font-weight="700" fill="#fff" text-anchor="middle" font-family="sans-serif">+36tr/năm</text>
      </g>
    </g>
    ${Ch.markup("s4_")}
    </svg>`;
    this.C = Ch.bind("s4_");
    this.priceLine = el.querySelector("#s4price");
    this.saveLine = el.querySelector("#s4save");
    this.label1 = el.querySelector("#s4label1");
    this.label2 = el.querySelector("#s4label2");
  },
  update(t){
    const s4=D.lines[4].s, gt=t+s4;
    Ch.place(this.C, 540, 1550, 1.1, 1);
    const twistM = M(4,6);
    Ch.pose(this.C, {
      t, exp: curExp(t,[0,"binh-thuong",twistM,"que"]),
      talk:talkAt(gt), gaze:[0,-3], headRot:0, sweat: t > twistM
    });
    const chartP = clamp(t / 3.5, 0, 1);
    const n = Math.floor(chartP * 10) + 1;
    let pp = "", sp = "";
    for(let i=0;i<=n;i++){
      const x = 60 + i * 84;
      const priceY = 460 - i * 20 * 2;
      const saveY = 660 - i * 3.6 * 2;
      pp += `${x},${Math.max(priceY,60)} `;
      sp += `${x},${Math.max(saveY,400)} `;
    }
    this.priceLine.setAttribute("points", pp.trim());
    this.saveLine.setAttribute("points", sp.trim());
    this.label1.setAttribute("opacity", easeOut((t-twistM)/0.5).toFixed(3));
    this.label2.setAttribute("opacity", easeOut((t-(twistM+0.3))/0.5).toFixed(3));
  }
};

/* ── Cảnh 5: Đêm, phòng trọ, lướt tin bán nhà ── */
const scene5 = {
  build(el){
    el.innerHTML = `<svg viewBox="0 0 1080 1920" width="1080" height="1920" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="c7s5bg" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stop-color="#08091a"/>
        <stop offset="1" stop-color="#0e1228"/>
      </linearGradient>
      <radialGradient id="c7s5glow" cx=".55" cy=".65" r=".35">
        <stop offset="0" stop-color="#a0c4ff" stop-opacity=".12"/>
        <stop offset="1" stop-color="#a0c4ff" stop-opacity="0"/>
      </radialGradient>
    </defs>
    <rect width="1080" height="1920" fill="url(#c7s5bg)"/>
    <rect x="60" y="1350" width="960" height="180" rx="18" fill="#151828"/>
    <rect x="70" y="1330" width="300" height="40" rx="6" fill="#1a1e36"/>
    <rect x="80" y="1340" width="120" height="20" rx="4" fill="#222844"/>
    <circle id="s5glow" cx="580" cy="1180" r="500" fill="url(#c7s5glow)"/>
    <g id="s5phone" opacity="1">
      <rect x="520" y="1040" width="120" height="200" rx="14" fill="#1a1a2e" stroke="#2a2a44" stroke-width="3"/>
      <rect id="s5screen" x="528" y="1052" width="104" height="172" rx="8" fill="#b8d8ff" opacity=".8"/>
      <g id="s5listing" opacity=".7">
        <rect x="536" y="1060" width="88" height="44" rx="4" fill="#2a4a6a"/>
        <text x="580" y="1088" font-size="16" fill="#fff" text-anchor="middle" font-family="monospace">2.1 tỷ</text>
        <rect x="536" y="1112" width="88" height="44" rx="4" fill="#2a4a6a"/>
        <text x="580" y="1140" font-size="16" fill="#fff" text-anchor="middle" font-family="monospace">2.3 tỷ</text>
        <rect x="536" y="1164" width="88" height="44" rx="4" fill="#2a4a6a"/>
        <text x="580" y="1192" font-size="16" fill="#fff" text-anchor="middle" font-family="monospace">2.0 tỷ</text>
      </g>
    </g>
    ${Ch.markup("s5_",{phoneBody:"#1a1a2e",phoneScreen:"#b8d8ff"})}
    </svg>`;
    this.C = Ch.bind("s5_");
    this.screen = el.querySelector("#s5screen");
    this.glow = el.querySelector("#s5glow");
    this.phone = el.querySelector("#s5phone");
  },
  update(t){
    const s5=D.lines[5].s, gt=t+s5;
    Ch.place(this.C, 380, 1400, 1.2, 1);
    const offM = M(5,8);
    const onM = M(5,11);
    let phoneOn = true;
    if(t > offM && t < onM) phoneOn = false;
    Ch.pose(this.C, {
      t, exp: curExp(t,[0,"met",onM-0.2,"met"]),
      holdPhone:true, talk:talkAt(gt), gaze:[4,5], headRot:8,
      hideLegs:true
    });
    const scr = phoneOn ? .8 : .05;
    this.screen.setAttribute("opacity", scr.toFixed(2));
    this.glow.setAttribute("opacity", phoneOn ? "1" : "0.15");
    this.phone.setAttribute("opacity", phoneOn ? "1" : "0.4");
  }
};

window.SCENES = [scene0, scene1, scene2, scene3, scene4, scene5];
