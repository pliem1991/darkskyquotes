/* scenes.js — clip 10: Nếu ngủ đủ tám tiếng
   7 cảnh: lướt điện thoại trên giường, đồng hồ quay ngược, kẹt xe trên cầu, việc nhà,
   thanh thời gian, đồng hồ chạy tới gần một giờ, tám tiếng còn năm tiếng rưỡi. */

const Ch = window.Char;
const D = window.DATA;
const clamp = (x,a,b) => Math.max(a,Math.min(b,x));
const lerp = (a,b,t) => a+(b-a)*clamp(t,0,1);
const easeOut = t => { t=clamp(t,0,1); return 1-(1-t)*(1-t); };
const easeInOut = t => { t=clamp(t,0,1); return t<.5 ? 2*t*t : 1-Math.pow(-2*t+2,2)/2; };
const backOut = t => { t=clamp(t,0,1); const c=1.7; return 1+(--t)*t*((c+1)*t+c); };

function M(li,si){
  const s=D.lines[li]; if(!s) return 0;
  const k=Math.min(si, s.syl.length-1);
  return s.syl[k].s - s.s;
}
function talkAt(gt){ const fi=Math.floor(gt*30); return (D.env[fi]||0)*3.5; }
function curExp(t,pairs){
  for(let i=pairs.length-2;i>=0;i-=2) if(t>=pairs[i]) return pairs[i+1];
  return pairs[1];
}
function popIn(t,t0,dur){ const p=clamp((t-t0)/dur,0,1); return p<=0?0.001:backOut(p); }
function pulse(t,t0,dur,amp){ const p=clamp((t-t0)/dur,0,1); return p<=0||p>=1?1:1+amp*Math.sin(Math.PI*p); }
const pad = n => (n<10?"0":"")+n;
function hhmm(min){ min=Math.round(min); min=((min%1440)+1440)%1440; return pad(Math.floor(min/60))+":"+pad(min%60); }
function show(el,t,t0,x,y,dur){
  if(t<t0){ el.setAttribute("opacity","0"); return 0; }
  const sc=popIn(t,t0,dur||0.35);
  el.setAttribute("opacity","1");
  el.setAttribute("transform",`translate(${x},${y}) scale(${sc.toFixed(3)})`);
  return t-t0;
}
const FONT = `font-family="Segoe UI,Arial,sans-serif"`;

/* Phòng ngủ ban đêm, dùng cho cảnh 0 và cảnh 5 */
function bedroom(p, clockTxt){
  let lights="";
  for(let i=0;i<18;i++){
    const x=135+(i*53)%230, y=640+((i*37)%170);
    lights+=`<rect x="${x}" y="${y}" width="8" height="10" fill="#ffd98a" opacity="${(0.35+0.4*((i*7)%5)/5).toFixed(2)}"/>`;
  }
  return `
  <defs>
    <linearGradient id="${p}bg" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#161c36"/><stop offset="1" stop-color="#0b0e1c"/></linearGradient>
    <radialGradient id="${p}glow" cx=".5" cy=".5" r=".5"><stop offset="0" stop-color="#8cc4ff" stop-opacity=".55"/><stop offset="1" stop-color="#8cc4ff" stop-opacity="0"/></radialGradient>
  </defs>
  <rect width="1080" height="1920" fill="url(#${p}bg)"/>
  <rect x="110" y="560" width="280" height="300" rx="10" fill="#0e1430" stroke="#2a3360" stroke-width="10"/>
  <circle cx="320" cy="620" r="26" fill="#e8ecff" opacity=".85"/>
  ${lights}
  <line x1="250" y1="560" x2="250" y2="860" stroke="#2a3360" stroke-width="8"/>
  <rect x="0" y="1300" width="1080" height="620" fill="#0a0c18"/>
  <rect x="250" y="960" width="560" height="230" rx="26" fill="#352c52"/>
  <rect x="230" y="1160" width="620" height="300" rx="30" fill="#463c6c"/>
  <rect x="690" y="1050" width="230" height="250" rx="12" fill="#262040"/>
  <rect x="705" y="955" width="200" height="95" rx="18" fill="#05060c" stroke="#3a3460" stroke-width="5"/>
  <text id="${p}clk" x="805" y="1020" font-size="56" font-weight="800" fill="#ff5c7a" text-anchor="middle" font-family="Consolas,monospace">${clockTxt}</text>
  <circle id="${p}glowEl" cx="445" cy="1085" r="250" fill="url(#${p}glow)"/>`;
}
function blanket(){
  return `<path d="M232 1200 Q540 1150 850 1205 L850 1470 L232 1470 Z" fill="#7a6ab0"/>
  <path d="M232 1200 Q540 1150 850 1205" stroke="#9a8ad0" stroke-width="8" fill="none"/>`;
}

/* ── Cảnh 0: hook, nằm trên giường lướt điện thoại lúc khuya ── */
const scene0 = {
  build(el){
    el.innerHTML = `<svg viewBox="0 0 1080 1920" width="1080" height="1920" xmlns="http://www.w3.org/2000/svg">
    ${bedroom("c10s0","23:47")}
    ${Ch.markup("s0_",{phoneScreen:"#cfe6ff"})}
    ${blanket()}
    </svg>`;
    this.C = Ch.bind("s0_");
    this.glow = el.querySelector("#c10s0glowEl");
  },
  update(t){
    const gt=t+D.lines[0].s;
    Ch.place(this.C, 480, 1330, 1.35, 1);
    Ch.pose(this.C, { t, exp:"binh-thuong", hideLegs:true, holdPhone:true, aR:60, gaze:[-3,5], headRot:-4, talk:talkAt(gt) });
    this.glow.setAttribute("opacity", (0.85+0.15*Math.sin(t*5.3)*Math.sin(t*2.1)).toFixed(2));
  }
};

/* ── Cảnh 1: đồng hồ quay ngược 6:30 sáng → 22:30 tối ── */
const scene1 = {
  build(el){
    let ticks="";
    for(let i=0;i<12;i++){
      const a=i*Math.PI/6, r1=i%3===0?190:205, r2=225;
      ticks+=`<line x1="${(540+r1*Math.sin(a)).toFixed(1)}" y1="${(760-r1*Math.cos(a)).toFixed(1)}" x2="${(540+r2*Math.sin(a)).toFixed(1)}" y2="${(760-r2*Math.cos(a)).toFixed(1)}" stroke="#1a2844" stroke-width="${i%3===0?12:6}" stroke-linecap="round"/>`;
    }
    el.innerHTML = `<svg viewBox="0 0 1080 1920" width="1080" height="1920" xmlns="http://www.w3.org/2000/svg">
    <rect width="1080" height="1920" fill="#f2c890" id="c10s1day"/>
    <rect width="1080" height="1920" fill="#121830" id="c10s1night" opacity="0"/>
    <circle cx="540" cy="760" r="250" fill="#1a2844"/>
    <circle cx="540" cy="760" r="238" fill="#fffaf0"/>
    ${ticks}
    <line id="c10s1hr" x1="540" y1="760" x2="540" y2="640" stroke="#1a2844" stroke-width="18" stroke-linecap="round"/>
    <line id="c10s1mn" x1="540" y1="760" x2="540" y2="580" stroke="#ff5c8a" stroke-width="10" stroke-linecap="round"/>
    <circle cx="540" cy="760" r="16" fill="#1a2844"/>
    <g id="c10s1a" opacity="0"><rect x="-190" y="-62" width="380" height="110" rx="30" fill="#fff" stroke="#1a2844" stroke-width="6"/>
      <text x="0" y="22" font-size="64" font-weight="800" fill="#1a2844" text-anchor="middle" ${FONT}>6:30 sáng</text></g>
    <g id="c10s1b" opacity="0"><text x="0" y="20" font-size="58" font-weight="800" fill="#ff5c8a" text-anchor="middle" ${FONT}>⟲ lùi 8 tiếng</text></g>
    <g id="c10s1c" opacity="0"><rect x="-200" y="-62" width="400" height="110" rx="30" fill="#ff5c8a"/>
      <text x="0" y="22" font-size="64" font-weight="800" fill="#fff" text-anchor="middle" ${FONT}>22:30 tối</text></g>
    ${Ch.markup("s1_")}
    </svg>`;
    this.C = Ch.bind("s1_");
    this.night = el.querySelector("#c10s1night");
    this.hr = el.querySelector("#c10s1hr"); this.mn = el.querySelector("#c10s1mn");
    this.a = el.querySelector("#c10s1a"); this.b = el.querySelector("#c10s1b"); this.c = el.querySelector("#c10s1c");
  },
  update(t){
    const gt=t+D.lines[1].s;
    const r0=M(1,8), r1=Math.max(M(1,13), r0+0.8);
    const p=easeInOut((t-r0)/(r1-r0));
    const hours=6.5-8*p;
    const ha=((hours%12)+12)%12*30, ma=(((hours*60)%60)+60)%60*6;
    this.hr.setAttribute("transform",`rotate(${ha.toFixed(2)} 540 760)`);
    this.mn.setAttribute("transform",`rotate(${ma.toFixed(2)} 540 760)`);
    this.night.setAttribute("opacity",p.toFixed(3));
    show(this.a,t,M(1,2),540,1110);
    if(t>=r0) this.a.setAttribute("opacity",(1-easeOut((t-r0)/0.3)).toFixed(3));
    show(this.b,t,M(1,10)-0.15,540,450);
    show(this.c,t,M(1,13),540,1110,0.4);
    Ch.place(this.C, 230, 1500, 1.05, 1);
    Ch.pose(this.C, { t, exp: curExp(t,[0,"binh-thuong",M(1,13),"ngac-nhien"]), hideLegs:true, talk:talkAt(gt), gaze:[5,-4], headRot:4 });
  }
};

/* ── Cảnh 2: sáu giờ chiều, kẹt xe trên cầu ── */
const scene2 = {
  build(el){
    let bikes="";
    const rows=[[880,0.7],[960,0.85],[1050,1.0]];
    let k=0;
    rows.forEach(([y,s],ri)=>{
      for(let i=0;i<7;i++){
        const x=60+i*160+(ri%2)*80;
        bikes+=`<g id="c10s2b${k}" data-x="${x}" data-y="${y}" data-s="${s}">
          <ellipse cx="0" cy="0" rx="${(44*s).toFixed(0)}" ry="${(30*s).toFixed(0)}" fill="#20182e"/>
          <circle cx="${(-18*s).toFixed(0)}" cy="${(6*s).toFixed(0)}" r="${(9*s).toFixed(0)}" fill="#ff3b3b"/>
          <circle cx="${(18*s).toFixed(0)}" cy="${(6*s).toFixed(0)}" r="${(9*s).toFixed(0)}" fill="#ff3b3b"/>
          <circle cx="0" cy="${(6*s).toFixed(0)}" r="${(34*s).toFixed(0)}" fill="#ff3b3b" opacity=".18"/>
        </g>`;
        k++;
      }
    });
    this.nb=k;
    el.innerHTML = `<svg viewBox="0 0 1080 1920" width="1080" height="1920" xmlns="http://www.w3.org/2000/svg">
    <defs><linearGradient id="c10s2bg" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="#ff9a6a"/><stop offset=".45" stop-color="#8a4a8a"/><stop offset="1" stop-color="#241a3a"/></linearGradient></defs>
    <rect width="1080" height="1920" fill="url(#c10s2bg)"/>
    <rect id="c10s2dark" width="1080" height="1920" fill="#0c0e1e" opacity="0"/>
    <circle cx="820" cy="560" r="70" fill="#ffd27a" opacity=".8" id="c10s2sun"/>
    <path d="M0 820 Q540 700 1080 820" stroke="#3a2a50" stroke-width="16" fill="none"/>
    <path d="M0 860 Q540 740 1080 860" stroke="#3a2a50" stroke-width="10" fill="none"/>
    ${Array.from({length:12},(_,i)=>`<line x1="${45+i*90}" y1="${(840-120*Math.sin(Math.PI*(45+i*90)/1080)).toFixed(0)}" x2="${45+i*90}" y2="1500" stroke="#3a2a50" stroke-width="6" opacity=".5"/>`).join("")}
    <rect x="0" y="1120" width="1080" height="800" fill="#1a1428"/>
    ${bikes}
    ${Ch.markup("s2_")}
    <path d="M455 1265 L625 1265 L655 1470 L425 1470 Z" fill="#e8e0f0"/>
    <rect x="505" y="1440" width="70" height="60" rx="18" fill="#111"/>
    <path d="M440 1250 L640 1250" stroke="#2a2433" stroke-width="12" stroke-linecap="round"/>
    <path d="M448 1250 L425 1185 M632 1250 L655 1185" stroke="#2a2433" stroke-width="7" stroke-linecap="round"/>
    <ellipse cx="420" cy="1172" rx="22" ry="15" fill="#c8d4e8" stroke="#2a2433" stroke-width="5"/>
    <ellipse cx="660" cy="1172" rx="22" ry="15" fill="#c8d4e8" stroke="#2a2433" stroke-width="5"/>
    <circle cx="540" cy="1320" r="26" fill="#fff4b0"/>
    <g id="c10s2tag" opacity="0"><rect x="-150" y="-60" width="300" height="104" rx="30" fill="#fff" stroke="#1a2844" stroke-width="6"/>
      <text id="c10s2tt" x="0" y="20" font-size="66" font-weight="800" fill="#1a2844" text-anchor="middle" ${FONT}>18:00</text></g>
    </svg>`;
    this.C = Ch.bind("s2_");
    this.bikes=Array.from({length:k},(_,i)=>el.querySelector("#c10s2b"+i));
    this.tag=el.querySelector("#c10s2tag"); this.tt=el.querySelector("#c10s2tt");
    this.dark=el.querySelector("#c10s2dark"); this.sun=el.querySelector("#c10s2sun");
  },
  update(t){
    const gt=t+D.lines[2].s;
    const late=M(2,9);
    this.bikes.forEach((b,i)=>{
      const x=+b.dataset.x, y=+b.dataset.y;
      const jx=4*Math.sin(t*1.3+i*1.7), jy=2*Math.sin(t*2.1+i);
      b.setAttribute("transform",`translate(${(x+jx).toFixed(1)},${(y+jy).toFixed(1)})`);
    });
    const dk=easeOut((t-late)/0.6);
    this.dark.setAttribute("opacity",(0.55*dk).toFixed(3));
    this.sun.setAttribute("cy",(560+160*clamp(t/3,0,1)).toFixed(0));
    show(this.tag,t,M(2,0),540,360);
    if(t>=late){
      this.tt.textContent="19:00";
      this.tag.setAttribute("transform",`translate(540,360) scale(${pulse(t,late,0.35,0.18).toFixed(3)})`);
    } else this.tt.textContent="18:00";
    Ch.place(this.C, 540, 1420, 1.15, 1);
    Ch.pose(this.C, { t, exp: curExp(t,[0,"binh-thuong",M(2,5),"que",late,"met"]), hideLegs:true, aL:-25, aR:25, talk:talkAt(gt), gaze:[0,1] });
  }
};

/* ── Cảnh 3: nấu cơm, ăn cơm, rửa chén, tắm, giặt đồ → 21:00 ── */
const scene3 = {
  build(el){
    const items=[["Nấu cơm","#ffb36b",210,560],["Ăn cơm","#ffd35c",500,560],["Rửa chén","#7cc8ff",790,560],["Tắm","#8ad8c8",355,700],["Giặt đồ","#c8a8ff",645,700]];
    this.items=items.map((it,i)=>`<g id="c10s3i${i}" opacity="0"><rect x="-118" y="-50" width="236" height="96" rx="28" fill="${it[1]}"/>
      <text x="0" y="16" font-size="44" font-weight="800" fill="#1a2844" text-anchor="middle" ${FONT}>${it[0]}</text>
      <path id="c10s3k${i}" d="M78 -44 l14 14 l26 -30" stroke="#1a8a4a" stroke-width="9" fill="none" stroke-linecap="round" opacity="0"/></g>`).join("");
    this.pos=items.map(it=>[it[2],it[3]]);
    el.innerHTML = `<svg viewBox="0 0 1080 1920" width="1080" height="1920" xmlns="http://www.w3.org/2000/svg">
    <defs><linearGradient id="c10s3bg" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#3a2c48"/><stop offset="1" stop-color="#1a1424"/></linearGradient></defs>
    <rect width="1080" height="1920" fill="url(#c10s3bg)"/>
    <rect x="0" y="1300" width="1080" height="620" fill="#141020"/>
    <g id="c10s3tag"><rect x="-160" y="-60" width="320" height="104" rx="30" fill="#fff" stroke="#1a2844" stroke-width="6" id="c10s3tagbg"/>
      <text id="c10s3tt" x="0" y="20" font-size="66" font-weight="800" fill="#1a2844" text-anchor="middle" font-family="Consolas,monospace">19:00</text></g>
    ${this.items}
    ${Ch.markup("s3_")}
    </svg>`;
    this.C = Ch.bind("s3_");
    this.els=items.map((_,i)=>el.querySelector("#c10s3i"+i));
    this.ks=items.map((_,i)=>el.querySelector("#c10s3k"+i));
    this.tag=el.querySelector("#c10s3tag"); this.tt=el.querySelector("#c10s3tt"); this.tagbg=el.querySelector("#c10s3tagbg");
  },
  update(t){
    const gt=t+D.lines[3].s;
    const at=[M(3,0),M(3,2),M(3,4),M(3,6),M(3,7)];
    at.forEach((a,i)=>{
      show(this.els[i],t,a-0.05,this.pos[i][0],this.pos[i][1],0.3);
      const nx=i<4?at[i+1]:M(3,9);
      this.ks[i].setAttribute("opacity",t>=nx-0.05?"1":"0");
    });
    const look=M(3,9), nine=M(3,13);
    const mins = t<look ? lerp(19*60, 20*60+40, t/look) : lerp(20*60+40, 21*60, (t-look)/Math.max(0.2,nine-look));
    this.tt.textContent = hhmm(Math.min(mins, 21*60));
    const big = t>=nine;
    this.tagbg.setAttribute("fill", big?"#ff5c8a":"#fff");
    this.tt.setAttribute("fill", big?"#fff":"#1a2844");
    const sc = big ? pulse(t,nine,0.4,0.3) : 1;
    this.tag.setAttribute("transform",`translate(540,380) scale(${sc.toFixed(3)})`);
    const busy = t<look;
    Ch.place(this.C, 540 + (busy?40*Math.sin(t*4.2):0), 1500, 1.15, busy && Math.sin(t*2.1)<0 ? -1 : 1);
    Ch.pose(this.C, { t, exp: curExp(t,[0,"que",look,"ngac-nhien"]), hideLegs:true, sweat: busy, talk:talkAt(gt), gaze: busy?[0,2]:[0,-6], headRot: busy?0:-3 });
  }
};

/* ── Cảnh 4: 21:00 → 22:30, thanh thời gian bị ăn dần còn ~1 tiếng ── */
const scene4 = {
  build(el){
    el.innerHTML = `<svg viewBox="0 0 1080 1920" width="1080" height="1920" xmlns="http://www.w3.org/2000/svg">
    <defs><linearGradient id="c10s4bg" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#1e1a36"/><stop offset="1" stop-color="#100e1e"/></linearGradient></defs>
    <rect width="1080" height="1920" fill="url(#c10s4bg)"/>
    <g id="c10s4big" opacity="0"><text x="0" y="24" font-size="96" font-weight="900" fill="#fff" text-anchor="middle" ${FONT}>1 tiếng 30</text></g>
    <text x="120" y="640" font-size="44" font-weight="700" fill="#b8b4d8" ${FONT}>21:00</text>
    <text x="900" y="640" font-size="44" font-weight="700" fill="#b8b4d8" text-anchor="end" ${FONT}>22:30</text>
    <rect x="120" y="670" width="780" height="90" rx="45" fill="#2a2648"/>
    <rect id="c10s4bar" x="120" y="670" width="0" height="90" rx="45" fill="#ff5c8a"/>
    <rect id="c10s4e1" x="120" y="670" width="0" height="90" fill="#5a5678"/>
    <rect id="c10s4e2" x="293" y="670" width="0" height="90" fill="#6e6a8c"/>
    <g id="c10s4l1" opacity="0"><text x="0" y="0" font-size="40" font-weight="700" fill="#d8d4f0" text-anchor="middle" ${FONT}>Soạn đồ</text></g>
    <g id="c10s4l2" opacity="0"><text x="0" y="0" font-size="40" font-weight="700" fill="#d8d4f0" text-anchor="middle" ${FONT}>Tin nhắn</text></g>
    <g id="c10s4left" opacity="0"><rect x="-210" y="-68" width="420" height="118" rx="34" fill="#ffd35c"/>
      <text x="0" y="22" font-size="70" font-weight="900" fill="#1a2844" text-anchor="middle" ${FONT}>~1 tiếng</text></g>
    ${Ch.markup("s4_",{phoneScreen:"#cfe6ff"})}
    </svg>`;
    this.C = Ch.bind("s4_");
    const q=id=>el.querySelector("#c10s4"+id);
    this.big=q("big"); this.bar=q("bar"); this.e1=q("e1"); this.e2=q("e2"); this.l1=q("l1"); this.l2=q("l2"); this.left=q("left");
  },
  update(t){
    const gt=t+D.lines[4].s;
    const W=780;
    this.bar.setAttribute("width",(W*easeOut((t+0.2)/0.9)).toFixed(1));
    show(this.big,t,M(4,3),540,470);
    const w1=173, w2=87; // 20 phút, 10 phút trên 90 phút
    const a1=M(4,6), a2=M(4,10);
    this.e1.setAttribute("width",(w1*easeOut((t-a1)/0.5)).toFixed(1));
    this.e2.setAttribute("width",(w2*easeOut((t-a2)/0.5)).toFixed(1));
    show(this.l1,t,a1,206,830,0.3);
    show(this.l2,t,a2,336,890,0.3);
    show(this.left,t,M(4,16),640,1000,0.45);
    Ch.place(this.C, 230, 1500, 1.05, 1);
    Ch.pose(this.C, { t, exp: curExp(t,[0,"binh-thuong",a1,"que",M(4,16),"met"]), hideLegs:true, holdPhone: t>=a2, talk:talkAt(gt), gaze:[5,-3], headRot:3 });
  }
};

/* ── Cảnh 5: nằm xuống 22:30, lướt "một chút", tắt máy thì đã 00:52 ── */
const scene5 = {
  build(el){
    el.innerHTML = `<svg viewBox="0 0 1080 1920" width="1080" height="1920" xmlns="http://www.w3.org/2000/svg">
    ${bedroom("c10s5","22:30")}
    <rect id="c10s5dark" width="1080" height="1920" fill="#000" opacity="0"/>
    ${Ch.markup("s5_",{phoneScreen:"#cfe6ff"})}
    ${blanket()}
    <rect id="c10s5ring" x="695" y="945" width="220" height="115" rx="22" fill="none" stroke="#ff5c7a" stroke-width="8" opacity="0"/>
    </svg>`;
    this.C = Ch.bind("s5_");
    this.clk=el.querySelector("#c10s5clk"); this.glow=el.querySelector("#c10s5glowEl");
    this.dark=el.querySelector("#c10s5dark"); this.ring=el.querySelector("#c10s5ring");
  },
  update(t){
    const gt=t+D.lines[5].s;
    const open=M(5,7), off=M(5,14), late=M(5,18);
    const run=clamp((t-open)/Math.max(0.5,off-open),0,1);
    const mins=22*60+30 + 142*Math.pow(run,1.6);
    this.clk.textContent=hhmm(mins);
    const phoneOn = t>=open-0.2 && t<off;
    this.glow.setAttribute("opacity", phoneOn ? (0.85+0.15*Math.sin(t*6.1)).toFixed(2) : "0");
    this.dark.setAttribute("opacity", t>=off ? (0.35*easeOut((t-off)/0.3)).toFixed(3) : "0");
    const rp = t>=late ? pulse(t,late,0.5,1) : 1;
    this.ring.setAttribute("opacity", t>=late ? clamp(1.2-(t-late)/1.5,0,1).toFixed(2) : "0");
    this.clk.setAttribute("transform", `translate(805 1000) scale(${(t>=late?pulse(t,late,0.4,0.15):1).toFixed(3)}) translate(-805 -1000)`);
    void rp;
    Ch.place(this.C, 480, 1330, 1.35, 1);
    Ch.pose(this.C, { t, exp: curExp(t,[0,"binh-thuong",open,"cuoi",off,"ngac-nhien",late+0.6,"met"]), hideLegs:true,
      holdPhone: t>=open-0.2, aR: t>=open-0.2 ? 60 : undefined, gaze: t<off ? [-3,5] : [6,-2], headRot: t<off?-4:5, talk:talkAt(gt) });
  }
};

/* ── Cảnh 6: tám tiếng ngủ còn lại năm tiếng rưỡi ── */
const scene6 = {
  build(el){
    el.innerHTML = `<svg viewBox="0 0 1080 1920" width="1080" height="1920" xmlns="http://www.w3.org/2000/svg">
    <defs><linearGradient id="c10s6bg" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#121830"/><stop offset="1" stop-color="#080a16"/></linearGradient></defs>
    <rect width="1080" height="1920" fill="url(#c10s6bg)"/>
    <g id="c10s6old" opacity="0"><text x="0" y="28" font-size="110" font-weight="900" fill="#8a88a8" text-anchor="middle" ${FONT}>8 tiếng</text>
      <line id="c10s6x" x1="-230" y1="0" x2="-230" y2="0" stroke="#ff5c7a" stroke-width="14" stroke-linecap="round"/></g>
    <g id="c10s6new" opacity="0"><rect x="-290" y="-84" width="580" height="150" rx="44" fill="#ff5c8a"/>
      <text x="0" y="30" font-size="96" font-weight="900" fill="#fff" text-anchor="middle" ${FONT}>5 tiếng 30</text></g>
    <g id="c10s6rng" opacity="0"><text x="0" y="0" font-size="50" font-weight="700" fill="#c8c4e8" text-anchor="middle" ${FONT}>01:00 → 06:30</text></g>
    ${Ch.markup("s6_")}
    </svg>`;
    this.C = Ch.bind("s6_");
    const q=id=>el.querySelector("#c10s6"+id);
    this.old=q("old"); this.x=q("x"); this.nw=q("new"); this.rng=q("rng");
  },
  update(t){
    const gt=t+D.lines[6].s;
    show(this.old,t,-0.1,540,470);
    const xs=M(6,3);
    this.x.setAttribute("x2",lerp(-230,230,easeOut((t-xs)/0.35)).toFixed(0));
    this.x.setAttribute("opacity",t>=xs?"1":"0");
    show(this.nw,t,M(6,5),540,700,0.45);
    show(this.rng,t,M(6,5)+0.35,540,860);
    const fade=1-clamp((gt-D.endT)/0.3,0,1);
    if(fade<1) [this.old,this.nw,this.rng].forEach(g=>g.setAttribute("opacity",(+g.getAttribute("opacity")*fade).toFixed(3)));
    Ch.place(this.C, 540, 1500, 1.1, 1);
    Ch.pose(this.C, { t, exp: curExp(t,[0,"met",M(6,5),"ngac-nhien",M(6,5)+1.0,"met"]), hideLegs:true, talk:talkAt(gt), gaze:[0,-5] });
  }
};

window.SCENES = [scene0, scene1, scene2, scene3, scene4, scene5, scene6];
