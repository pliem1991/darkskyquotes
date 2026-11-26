/* scenes.js — clip 11: Nếu con mèo viết nhật ký về bạn
   7 cảnh: mèo viết nhật ký, chờ ở cửa, kêu không ai nghe, hộp đồ ăn, ngồi lên ngực, chủ nhật ôm mèo, giọt nước mặn. */

const Ch = window.Char;
const D = window.DATA;
const clamp = (x,a,b) => Math.max(a,Math.min(b,x));
const lerp = (a,b,t) => a+(b-a)*clamp(t,0,1);
const easeOut = t => { t=clamp(t,0,1); return 1-(1-t)*(1-t); };
const easeInOut = t => { t=clamp(t,0,1); return t<.5 ? 2*t*t : 1-Math.pow(-2*t+2,2)/2; };
const backOut = t => { t=clamp(t,0,1); const c=1.7; return 1+(--t)*t*((c+1)*t+c); };
const TAU = Math.PI*2;

function M(li,si){ const s=D.lines[li]; if(!s) return 0; const k=Math.min(si,s.syl.length-1); return s.syl[k].s - s.s; }
function talkAt(gt){ const fi=Math.floor(gt*30); return (D.env[fi]||0)*3.5; }
function curExp(t,pairs){ for(let i=pairs.length-2;i>=0;i-=2) if(t>=pairs[i]) return pairs[i+1]; return pairs[1]; }
function popIn(t,t0,dur){ const p=clamp((t-t0)/dur,0,1); return p<=0?0.001:backOut(p); }
function pulse(t,t0,dur,amp){ const p=clamp((t-t0)/dur,0,1); return p<=0||p>=1?1:1+amp*Math.sin(Math.PI*p); }
const FONT = `font-family="Segoe UI,Arial,sans-serif"`;
const HAND = `font-family="Segoe Print,Comic Sans MS,cursive"`;

/* ── Con mèo mướp vàng. Gốc tọa độ ở giữa đáy. ── */
function catMarkup(p){
  return `<g id="${p}cat">
  <ellipse cx="0" cy="2" rx="80" ry="10" fill="#000" opacity=".15"/>
  <g id="${p}sit">
    <path id="${p}tailS" d="M50 -20 C112 -22 124 -92 96 -132" stroke="#e08a2e" stroke-width="22" stroke-linecap="round" fill="none"/>
    <ellipse cx="0" cy="-75" rx="68" ry="78" fill="#f2a64a"/>
    <path d="M-62 -100 q14 6 26 -2 M-66 -70 q14 6 26 -2 M62 -100 q-14 6 -26 -2 M66 -70 q-14 6 -26 -2" stroke="#d9822b" stroke-width="7" fill="none" stroke-linecap="round"/>
    <ellipse cx="0" cy="-62" rx="36" ry="52" fill="#fde3bf"/>
    <ellipse cx="-24" cy="-7" rx="20" ry="11" fill="#fde3bf"/>
    <g id="${p}pawR"><ellipse cx="24" cy="-7" rx="20" ry="11" fill="#fde3bf"/></g>
  </g>
  <g id="${p}loaf" style="display:none">
    <path id="${p}tailL" d="M82 -22 C132 -14 142 -46 122 -66" stroke="#e08a2e" stroke-width="20" stroke-linecap="round" fill="none"/>
    <ellipse cx="14" cy="-48" rx="96" ry="50" fill="#f2a64a"/>
    <path d="M10 -92 q6 14 0 26 M40 -90 q6 14 0 26 M70 -82 q6 12 0 22" stroke="#d9822b" stroke-width="7" fill="none" stroke-linecap="round"/>
    <ellipse cx="-62" cy="-8" rx="22" ry="11" fill="#fde3bf"/><ellipse cx="-28" cy="-6" rx="22" ry="11" fill="#fde3bf"/>
  </g>
  <g id="${p}head">
    <g id="${p}earL"><path d="M-48 -18 L-42 -74 L-8 -46 Z" fill="#f2a64a"/><path d="M-40 -30 L-37 -62 L-18 -44 Z" fill="#ffb3c1"/></g>
    <g id="${p}earR"><path d="M48 -18 L42 -74 L8 -46 Z" fill="#f2a64a"/><path d="M40 -30 L37 -62 L18 -44 Z" fill="#ffb3c1"/></g>
    <circle cx="0" cy="0" r="52" fill="#f2a64a"/>
    <path d="M-13 -48 l4 15 M0 -51 l0 17 M13 -48 l-4 15" stroke="#d9822b" stroke-width="5" stroke-linecap="round"/>
    <ellipse cx="0" cy="20" rx="32" ry="20" fill="#fde3bf"/>
    <g id="${p}eyes">
      <ellipse cx="-20" cy="-4" rx="8" ry="11" fill="#2a1e1a"/><ellipse cx="20" cy="-4" rx="8" ry="11" fill="#2a1e1a"/>
      <circle cx="-17" cy="-8" r="3" fill="#fff"/><circle cx="23" cy="-8" r="3" fill="#fff"/>
    </g>
    <path d="M-6 9 L6 9 L0 16 Z" fill="#ff8fa3"/>
    <path id="${p}mc" d="M-9 20 q4.5 6 9 0 q4.5 6 9 0" stroke="#2a1e1a" stroke-width="3" fill="none" stroke-linecap="round"/>
    <ellipse id="${p}mo" cx="0" cy="25" rx="8" ry="0.1" fill="#7a2a3a"/>
    <ellipse id="${p}tg" cx="0" cy="30" rx="7" ry="0.1" fill="#ff7a96"/>
    <path d="M-30 14 L-62 8 M-30 20 L-62 22 M30 14 L62 8 M30 20 L62 22" stroke="#7a5a40" stroke-width="2" opacity=".7"/>
  </g>
</g>`;
}
function catBind(el,p){ const q=s=>el.querySelector("#"+p+s); return {g:q("cat"),sit:q("sit"),loaf:q("loaf"),tailS:q("tailS"),tailL:q("tailL"),head:q("head"),earL:q("earL"),earR:q("earR"),eyes:q("eyes"),mo:q("mo"),tg:q("tg"),mc:q("mc"),pawR:q("pawR")}; }
/* o: t, x, y, s, flip, pose ('sit'|'loaf'), meow 0..1, earsDown 0..1, eyesBig, tongue 0..1, tilt, look [dx,dy], paw 0..1, closed */
function catPose(c,o){
  const t=o.t, loaf=o.pose==="loaf", f=o.flip||1;
  c.g.setAttribute("transform",`translate(${o.x.toFixed(1)},${o.y.toFixed(1)}) scale(${(o.s*f).toFixed(3)},${o.s.toFixed(3)})`);
  c.sit.style.display=loaf?"none":""; c.loaf.style.display=loaf?"":"none";
  const sw=Math.sin(TAU*t/(o.tailHz?1/o.tailHz:1.6));
  c.tailS.setAttribute("transform",`rotate(${(10*sw).toFixed(1)} 50 -20)`);
  c.tailL.setAttribute("transform",`rotate(${(8*sw).toFixed(1)} 82 -22)`);
  const breathe=1+0.015*Math.sin(TAU*t/2.2);
  const hx=loaf?-70:0, hy=loaf?-86:-165;
  const tilt=(o.tilt||0)+3*Math.sin(TAU*t/3.4);
  const lk=o.look||[0,0];
  c.head.setAttribute("transform",`translate(${hx+lk[0]},${(hy+lk[1])*breathe}) rotate(${tilt.toFixed(1)})`);
  const ed=o.earsDown||0, tw=(t%3.7)<0.12?8:0;
  c.earL.setAttribute("transform",`rotate(${(-38*ed - tw).toFixed(1)} -30 -30)`);
  c.earR.setAttribute("transform",`rotate(${(38*ed).toFixed(1)} 30 -30)`);
  const u=(t+(o.blinkOff||0))%3.3; let bs=(u>2.1&&u<2.24)?0.15:1;
  if(o.closed) bs=0.12;
  const big=o.eyesBig?1.3:1;
  c.eyes.setAttribute("transform",`translate(0 -4) scale(${big} ${(bs*big).toFixed(2)}) translate(0 4)`);
  const m=clamp(o.meow||0,0,1);
  c.mo.setAttribute("ry",(0.1+11*m).toFixed(1)); c.mc.style.display=m>0.1?"none":"";
  const tg=clamp(o.tongue||0,0,1);
  c.tg.setAttribute("ry",(0.1+9*tg).toFixed(1)); c.tg.setAttribute("cy",(28+6*tg).toFixed(1));
  if(tg>0.1){ c.mo.setAttribute("ry","7"); c.mc.style.display="none"; }
  c.pawR.setAttribute("transform",`translate(0 ${(-30*(o.paw||0)).toFixed(1)})`);
}
function meowAt(t,times){ let m=0; times.forEach(a=>{ const d=t-a; if(d>=0&&d<0.45) m=Math.max(m,Math.sin(Math.PI*d/0.45)); }); return m; }

/* Trang nhật ký có tên ngày và dấu chân mèo */
function pageMarkup(id,label){
  return `<g id="${id}" opacity="0"><g transform="rotate(-2)">
    <rect x="-250" y="-62" width="500" height="124" rx="14" fill="#fff6dc" stroke="#e8d8b0" stroke-width="3"/>
    <line x1="-205" y1="-62" x2="-205" y2="62" stroke="#ff9a9a" stroke-width="3"/>
    <text x="-20" y="22" font-size="62" font-weight="700" fill="#5a3427" text-anchor="middle" ${HAND}>${label}</text>
    <g transform="translate(190,4)" fill="#d9822b"><ellipse cx="0" cy="10" rx="16" ry="13"/><circle cx="-16" cy="-10" r="6"/><circle cx="-5" cy="-18" r="6"/><circle cx="7" cy="-18" r="6"/><circle cx="17" cy="-9" r="6"/></g>
  </g></g>`;
}
function showPage(el,t){ const sc=popIn(t,-0.2,0.4); el.setAttribute("opacity","1"); el.setAttribute("transform",`translate(540,330) scale(${sc.toFixed(3)})`); }

/* Phòng trọ: tường, sàn, cửa sổ */
function room(p,night){
  const wall = night?["#2a2440","#1c1830"]:["#f3dcc0","#e6c9a6"];
  const floor = night?"#151224":"#b98a5e";
  return `<defs><linearGradient id="${p}w" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${wall[0]}"/><stop offset="1" stop-color="${wall[1]}"/></linearGradient>
  <radialGradient id="${p}glow" cx=".5" cy=".5" r=".5"><stop offset="0" stop-color="#8cc4ff" stop-opacity=".55"/><stop offset="1" stop-color="#8cc4ff" stop-opacity="0"/></radialGradient></defs>
  <rect width="1080" height="1920" fill="url(#${p}w)"/>
  <rect x="0" y="1320" width="1080" height="600" fill="${floor}"/>
  <rect x="0" y="1312" width="1080" height="12" fill="${night?"#0c0a18":"#8a6040"}"/>`;
}
function door(p,x,y){
  return `<rect x="${x-10}" y="${y-10}" width="300" height="${1330-y+10}" fill="#6a4a32"/>
  <rect x="${x}" y="${y}" width="280" height="${1330-y}" fill="#2a2030"/>
  <rect id="${p}door" x="${x}" y="${y}" width="280" height="${1330-y}" fill="#c08a5a"/>
  <circle id="${p}knob" cx="${x+245}" cy="${(y+1330)/2+30}" r="11" fill="#f3d27a"/>`;
}
function bed(){
  return `<rect x="200" y="980" width="680" height="220" rx="26" fill="#352c52"/>
  <rect x="180" y="1160" width="720" height="290" rx="30" fill="#463c6c"/>`;
}

/* ── Cảnh 0: mèo ngồi trên bàn viết nhật ký ── */
const scene0 = {
  build(el){
    el.innerHTML = `<svg viewBox="0 0 1080 1920" width="1080" height="1920" xmlns="http://www.w3.org/2000/svg">
    ${room("c11s0",true)}
    <defs><radialGradient id="c11s0lamp" cx=".5" cy=".5" r=".5"><stop offset="0" stop-color="#ffd27a" stop-opacity=".35"/><stop offset="1" stop-color="#ffd27a" stop-opacity="0"/></radialGradient></defs><circle cx="830" cy="700" r="320" fill="url(#c11s0lamp)"/>
    <path d="M790 600 L870 600 L900 700 L760 700 Z" fill="#ffd27a"/><rect x="826" y="700" width="8" height="250" fill="#5a4a3a"/>
    <rect x="120" y="1180" width="840" height="34" rx="8" fill="#8a5a3a"/>
    <rect x="160" y="1214" width="30" height="300" fill="#6a4228"/><rect x="890" y="1214" width="30" height="300" fill="#6a4228"/>
    ${catMarkup("c0")}
    <g transform="translate(540,1168)">
      <path d="M-170 0 L-10 -18 L-10 10 L-170 22 Z" fill="#fff6dc" stroke="#d8c8a0" stroke-width="3"/>
      <path d="M170 0 L10 -18 L10 10 L170 22 Z" fill="#fff6dc" stroke="#d8c8a0" stroke-width="3"/>
      <path d="M-150 4 L-30 -8 M-150 12 L-50 2 M30 -8 L150 4" stroke="#b8a888" stroke-width="2"/>
    </g>
    <g id="c11s0pen"><rect x="-6" y="-80" width="12" height="90" rx="5" fill="#3a7bd5"/><path d="M-6 10 L6 10 L0 24 Z" fill="#2a2433"/></g>
    </svg>`;
    this.cat=catBind(el,"c0"); this.pen=el.querySelector("#c11s0pen");
  },
  update(t){
    catPose(this.cat,{t,x:540,y:1180,s:1.5,pose:"sit",tilt:-6,look:[0,6],paw:0.55+0.08*Math.sin(t*9)});
    const px=575+22*Math.sin(t*7), py=1105+6*Math.sin(t*14);
    this.pen.setAttribute("transform",`translate(${px.toFixed(1)},${py.toFixed(1)}) rotate(${(20+6*Math.sin(t*7)).toFixed(1)})`);
  }
};

/* ── Cảnh 1: chờ ở cửa từ 17:00, 20:00 chủ về, "đói chưa cưng" ── */
const scene1 = {
  build(el){
    el.innerHTML = `<svg viewBox="0 0 1080 1920" width="1080" height="1920" xmlns="http://www.w3.org/2000/svg">
    ${room("c11s1",false)}
    <rect id="c11s1dusk" width="1080" height="1920" fill="#1c1830" opacity="0"/>
    ${door("c11s1",590,720)}
    <circle cx="330" cy="620" r="78" fill="#fff" stroke="#5a3427" stroke-width="8"/>
    <text id="c11s1clk" x="330" y="638" font-size="46" font-weight="800" fill="#5a3427" text-anchor="middle" font-family="Consolas,monospace">17:00</text>
    ${Ch.markup("s1_")}
    <rect id="c11s1mask" x="0" y="0" width="0" height="0" fill="none"/>
    ${catMarkup("c1")}
    <g id="c11s1heart" opacity="0"><path d="M0 12 C-30 -10 -18 -36 0 -20 C18 -36 30 -10 0 12 Z" fill="#ff5c8a"/></g>
    ${pageMarkup("c11s1page","Thứ hai")}
    </svg>`;
    this.cat=catBind(el,"c1"); this.C=Ch.bind("s1_");
    const q=id=>el.querySelector("#c11s1"+id);
    this.door=q("door"); this.knob=q("knob"); this.clk=q("clk"); this.dusk=q("dusk"); this.heart=q("heart"); this.page=q("page");
  },
  update(t){
    const gt=t+D.lines[1].s;
    showPage(this.page,t);
    const eight=M(1,9), hungry=M(1,18);
    const hrs = t<eight ? lerp(17,19.9,easeInOut(t/eight)) : 20;
    const hh=Math.floor(hrs), mm=Math.floor((hrs-hh)*60);
    this.clk.textContent=(hh<10?"0":"")+hh+":"+(mm<10?"0":"")+mm;
    this.dusk.setAttribute("opacity",(0.45*clamp(t/eight,0,1)).toFixed(3));
    const op=easeOut((t-eight)/0.5);
    this.door.setAttribute("width",(280*(1-0.85*op)).toFixed(1));
    this.knob.setAttribute("opacity",op>0.3?"0":"1");
    const inside=t>=eight;
    this.C.ch.style.display=inside?"":"none";
    if(inside){
      Ch.place(this.C, lerp(770,700,easeOut((t-eight)/0.8)), 1340, 1.25, -1);
      Ch.pose(this.C,{t, exp: t>=hungry?"cuoi":"met", hideLegs:true, talk:talkAt(gt), gaze:[-6,6], headRot:-6});
    }
    catPose(this.cat,{t,x:400,y:1360,s:1.15,flip:1,pose:"sit",look:[10,0],tilt:inside?-8:4,tailHz:inside?1.6:0.5,earsDown:0,eyesBig:t>=hungry});
    if(t>=hungry){ const p=popIn(t,hungry,0.35), fl=(t-hungry)*40; this.heart.setAttribute("opacity",clamp(1.6-(t-hungry)/1.2,0,1).toFixed(2)); this.heart.setAttribute("transform",`translate(400,${(1080-fl).toFixed(0)}) scale(${(1.6*p).toFixed(2)})`); }
    else this.heart.setAttribute("opacity","0");
  }
};

/* ── Cảnh 2: chủ nằm cười với cục sáng, mèo kêu ba lần ── */
const scene2 = {
  build(el){
    el.innerHTML = `<svg viewBox="0 0 1080 1920" width="1080" height="1920" xmlns="http://www.w3.org/2000/svg">
    ${room("c11s2",true)}
    ${bed()}
    <circle id="c11s2glowEl" cx="445" cy="1085" r="240" fill="url(#c11s2glow)"/>
    ${Ch.markup("s2_",{phoneScreen:"#cfe6ff"})}
    <path d="M182 1200 Q540 1150 898 1205 L898 1470 L182 1470 Z" fill="#7a6ab0"/>
    ${catMarkup("c2")}
    ${[0,1,2].map(i=>`<g id="c11s2b${i}" opacity="0"><ellipse cx="0" cy="0" rx="70" ry="44" fill="#fff"/><path d="M-10 40 L-30 70 L12 42 Z" fill="#fff"/><text x="0" y="14" font-size="40" font-weight="800" fill="#5a3427" text-anchor="middle" ${HAND}>meo</text></g>`).join("")}
    ${pageMarkup("c11s2page","Thứ ba")}
    </svg>`;
    this.cat=catBind(el,"c2"); this.C=Ch.bind("s2_");
    this.glow=el.querySelector("#c11s2glowEl"); this.page=el.querySelector("#c11s2page");
    this.b=[0,1,2].map(i=>el.querySelector("#c11s2b"+i));
  },
  update(t){
    const gt=t+D.lines[2].s;
    showPage(this.page,t);
    Ch.place(this.C, 430, 1330, 1.35, 1);
    Ch.pose(this.C,{t, exp:"cuoi", hideLegs:true, holdPhone:true, aR:60, gaze:[-3,5], headRot:-4, talk:-1});
    this.glow.setAttribute("opacity",(0.85+0.15*Math.sin(t*5.3)).toFixed(2));
    const k=M(2,10), ts=[k,k+0.5,k+1.0];
    const pos=[[820,820,1],[880,700,0.8],[930,600,0.6]];
    ts.forEach((a,i)=>{
      const b=this.b[i];
      if(t<a){ b.setAttribute("opacity","0"); return; }
      const p=popIn(t,a,0.3), fade=clamp(1-(t-a-1.4)/0.5,0,1);
      b.setAttribute("opacity",fade.toFixed(2));
      b.setAttribute("transform",`translate(${pos[i][0]-90},${pos[i][1]}) scale(${(p*pos[i][2]).toFixed(3)})`);
    });
    const sad=easeOut((t-M(2,13))/0.5);
    catPose(this.cat,{t,x:760,y:1290,s:1.0,flip:-1,pose:"sit",meow:meowAt(t,ts),earsDown:sad,look:[-6,-4],tilt:-6});
  }
};

/* ── Cảnh 3: người lạ đưa hộp thơm, chủ ăn hết ── */
const scene3 = {
  build(el){
    el.innerHTML = `<svg viewBox="0 0 1080 1920" width="1080" height="1920" xmlns="http://www.w3.org/2000/svg">
    ${room("c11s3",true)}
    ${door("c11s3",640,720)}
    <g id="c11s3hand"><rect x="0" y="-26" width="260" height="52" rx="24" fill="#2e9e5b"/><circle cx="0" cy="0" r="26" fill="#eebc98"/>
      <g transform="translate(-40,-30)"><rect x="-70" y="-50" width="140" height="90" rx="12" fill="#fff"/><rect x="-70" y="-50" width="140" height="22" rx="10" fill="#ff8a3d"/></g></g>
    ${Ch.markup("s3_")}
    <rect x="280" y="1180" width="520" height="30" rx="8" fill="#8a5a3a"/><rect x="320" y="1210" width="24" height="200" fill="#6a4228"/><rect x="736" y="1210" width="24" height="200" fill="#6a4228"/>
    <g id="c11s3box" opacity="0"><rect x="-70" y="-60" width="140" height="62" rx="12" fill="#fff"/><rect id="c11s3lid" x="-70" y="-80" width="140" height="22" rx="10" fill="#ff8a3d"/><ellipse id="c11s3food" cx="0" cy="-52" rx="56" ry="10" fill="#e0a050"/></g>
    <g id="c11s3steam" opacity="0" stroke="#ffe8c8" stroke-width="6" fill="none" stroke-linecap="round">
      <path d="M0 0 q-14 -30 0 -60 q14 -30 0 -60"/><path d="M30 6 q-14 -30 0 -60 q14 -30 0 -60"/><path d="M-30 6 q-14 -30 0 -60 q14 -30 0 -60"/></g>
    ${catMarkup("c3")}
    ${pageMarkup("c11s3page","Thứ năm")}
    </svg>`;
    this.cat=catBind(el,"c3"); this.C=Ch.bind("s3_");
    const q=id=>el.querySelector("#c11s3"+id);
    this.door=q("door"); this.knob=q("knob"); this.hand=q("hand"); this.box=q("box"); this.lid=q("lid"); this.food=q("food"); this.steam=q("steam"); this.page=q("page");
  },
  update(t){
    const gt=t+D.lines[3].s;
    showPage(this.page,t);
    const thank=M(3,10), eat=M(3,12), none=M(3,15), got=M(3,8);
    const op=easeOut((t+0.3)/0.4);
    this.door.setAttribute("width",(280*(1-0.85*op)).toFixed(1));
    this.knob.setAttribute("opacity","0");
    const hin=easeOut((t+0.1)/0.5) - easeInOut((t-got)/0.5);
    this.hand.setAttribute("transform",`translate(${lerp(1100,800,hin).toFixed(1)},1020)`);
    this.hand.style.display = t<got+0.5 ? "" : "none";
    const onTable=t>=got;
    this.box.setAttribute("opacity",onTable?"1":"0");
    this.box.setAttribute("transform","translate(560,1182)");
    this.lid.setAttribute("transform",`translate(${t>=eat?165:0} ${t>=eat?60:0})`);
    const left=1-clamp((t-eat)/Math.max(0.6,none-eat),0,1);
    this.food.setAttribute("rx",(56*left+0.1).toFixed(1));
    this.steam.setAttribute("opacity",(onTable&&left>0.2?0.55+0.2*Math.sin(t*4):0).toFixed(2));
    this.steam.setAttribute("transform",`translate(${560-40*clamp(t-got,0,2)},${1110-8*Math.sin(t*3)}) rotate(-18)`);
    const eating=t>=eat && t<none+0.3;
    Ch.place(this.C, 620, 1340, 1.25, onTable?1:-1);
    Ch.pose(this.C,{t, exp: t<thank?"binh-thuong": t<eat?"cuoi":"cuoi", hideLegs:true, talk: (t>=thank&&t<eat)?talkAt(gt):-1,
      aR: eating ? 70+25*Math.sin(t*12) : (t<got? -40: undefined), gaze: onTable?[-2,6]:[6,0]});
    const stare = t>=M(3,4);
    catPose(this.cat,{t,x:290,y:1370,s:1.05,flip:1,pose:"sit",eyesBig:stare && t<none, earsDown: t>=none?easeOut((t-none)/0.4):0,
      look:[12,-4], tilt: stare?10:0, tailHz: stare?2.4:1.6});
  }
};

/* ── Cảnh 4: thứ bảy ngủ tới trưa, mèo ngồi lên ngực ── */
const scene4 = {
  build(el){
    el.innerHTML = `<svg viewBox="0 0 1080 1920" width="1080" height="1920" xmlns="http://www.w3.org/2000/svg">
    ${room("c11s4",false)}
    <rect x="110" y="540" width="280" height="300" rx="10" fill="#bfe4ff" stroke="#8a6040" stroke-width="10"/>
    <circle cx="300" cy="620" r="40" fill="#fff3a0"/>
    <path d="M110 840 L360 1320 L700 1320 L390 840 Z" fill="#fff3c0" opacity=".25"/>
    <circle cx="820" cy="640" r="78" fill="#fff" stroke="#5a3427" stroke-width="8"/>
    <text x="820" y="658" font-size="46" font-weight="800" fill="#5a3427" text-anchor="middle" font-family="Consolas,monospace">12:00</text>
    <rect x="140" y="1000" width="110" height="330" rx="20" fill="#352c52"/>
    <rect x="140" y="1160" width="800" height="170" rx="26" fill="#463c6c"/>
    ${Ch.markup("s4_")}
    <path d="M330 1150 Q620 1110 930 1150 L930 1330 L330 1330 Z" fill="#7a6ab0"/>
    <path d="M330 1150 Q620 1110 930 1150" stroke="#9a8ad0" stroke-width="8" fill="none"/>
    ${catMarkup("c4")}
    <g id="c11s4z" ${HAND} font-weight="800" fill="#5a5a8a"><text id="c11s4z1" x="0" y="0" font-size="48">z</text><text id="c11s4z2" x="0" y="0" font-size="38">z</text></g>
    ${pageMarkup("c11s4page","Thứ bảy")}
    </svg>`;
    this.cat=catBind(el,"c4"); this.C=Ch.bind("s4_");
    this.page=el.querySelector("#c11s4page"); this.z1=el.querySelector("#c11s4z1"); this.z2=el.querySelector("#c11s4z2");
  },
  update(t){
    const gt=t+D.lines[4].s;
    showPage(this.page,t);
    Ch.place(this.C, 330, 1210, 1.15, 1, -90, 150, 300);
    Ch.pose(this.C,{t, exp:"met", hideLegs:true, talk:-1, headRot:0, gaze:[0,4]});
    const on=M(4,6);
    const jump=easeOut((t-on)/0.5);
    const x=lerp(860,560,jump), y=lerp(1330,1150,jump)-60*Math.sin(Math.PI*clamp((t-on)/0.5,0,1));
    catPose(this.cat,{t,x,y,s:1.0,flip:-1,pose: t>=on+0.5?"loaf":"sit",look:[0,4],tilt:-10,paw: t>=on+0.6?0.4+0.4*Math.max(0,Math.sin(t*5)):0});
    [this.z1,this.z2].forEach((z,i)=>{ const ph=((t*0.6+i*0.5)%1); z.setAttribute("x",(250+30*ph).toFixed(0)); z.setAttribute("y",(1080-90*ph).toFixed(0)); z.setAttribute("opacity",(1-ph).toFixed(2)); });
  }
};

/* ── Cảnh 5: chủ nhật cười nói với cục sáng, tắt đi, ôm mèo ngồi im ── */
const scene5 = {
  build(el){
    el.innerHTML = `<svg viewBox="0 0 1080 1920" width="1080" height="1920" xmlns="http://www.w3.org/2000/svg">
    ${room("c11s5",true)}
    ${bed()}
    <circle id="c11s5glowEl" cx="445" cy="1085" r="240" fill="url(#c11s5glow)"/>
    ${Ch.markup("s5_",{phoneScreen:"#cfe6ff"})}
    <path d="M182 1230 Q540 1190 898 1235 L898 1470 L182 1470 Z" fill="#7a6ab0"/>
    ${catMarkup("c5")}
    <rect id="c11s5dark" width="1080" height="1920" fill="#000" opacity="0"/>
    ${pageMarkup("c11s5page","Chủ nhật")}
    </svg>`;
    this.cat=catBind(el,"c5"); this.C=Ch.bind("s5_");
    const q=id=>el.querySelector("#c11s5"+id);
    this.glow=q("glowEl"); this.dark=q("dark"); this.page=q("page");
  },
  update(t){
    const gt=t+D.lines[5].s;
    if(t<D.lines[5].parts[1].s-D.lines[5].s) showPage(this.page,t);
    else this.page.setAttribute("opacity",clamp(1-(t-(D.lines[5].parts[1].s-D.lines[5].s))/0.4,0,1).toFixed(2));
    const off=D.lines[5].parts[1].s-D.lines[5].s - 0.1;
    const phoneOn=t<off;
    this.glow.setAttribute("opacity",phoneOn?(0.85+0.15*Math.sin(t*6)).toFixed(2):"0");
    this.dark.setAttribute("opacity",(0.3*easeOut((t-off)/0.6)).toFixed(3));
    const fake = phoneOn ? Math.max(0,Math.sin(t*9))*0.8 : -1;
    Ch.place(this.C, 480, 1340, 1.35, 1);
    Ch.pose(this.C,{t, exp: phoneOn?"cuoi":"met", hideLegs:true, holdPhone:phoneOn, aR: phoneOn?120:38, aL: phoneOn?undefined:-38,
      talk: fake, gaze: phoneOn?[-2,0]:[0,7], headRot: phoneOn?-2:6});
    const come=easeInOut((t-off-0.2)/0.8);
    catPose(this.cat,{t, x:lerp(780,500,come), y:lerp(1300,1250,come), s:0.95, flip: come>0.5?1:-1, pose: come>0.9?"loaf":"sit", closed: come>0.95 && (t-off)>1.6, look:[0,-6], tilt:-6, tailHz:0.5});
  }
};

/* ── Cảnh 6: giọt nước rơi xuống đầu, liếm thử thấy mặn ── */
const scene6 = {
  build(el){
    el.innerHTML = `<svg viewBox="0 0 1080 1920" width="1080" height="1920" xmlns="http://www.w3.org/2000/svg">
    <defs><radialGradient id="c11s6v" cx=".5" cy=".55" r=".6"><stop offset="0" stop-color="#3a3060"/><stop offset="1" stop-color="#0c0a18"/></radialGradient></defs>
    <rect width="1080" height="1920" fill="url(#c11s6v)"/>
    ${catMarkup("c6")}
    <path id="c11s6drop" d="M0 -22 C10 -6 14 4 0 12 C-14 4 -10 -6 0 -22 Z" fill="#bfe4ff" stroke="#ffffff" stroke-width="2" opacity="0"/>
    </svg>`;
    this.cat=catBind(el,"c6"); this.drop=el.querySelector("#c11s6drop");
  },
  update(t){
    const S=2.6, cx=540, by=1500;
    const land=M(6,3)+0.15, lick=M(6,8);
    const hit = t>=land ? pulse(t,land,0.25,0.06) : 1;
    catPose(this.cat,{t,x:cx,y:by,s:S*hit,pose:"sit",look:[0,0],tilt: t>=land? -4 : 0,closed: t>=land && t<land+0.25,
      tongue: t>=lick ? Math.max(0,Math.sin(Math.PI*clamp((t-lick)/1.1,0,1))) : 0, earsDown: t>=land?0.25:0});
    const headY = by + (-165-22)*S;
    let y, o;
    if(t<land){ y=lerp(-40, headY, clamp((t-(land-0.9))/0.9,0,1)*clamp((t-(land-0.9))/0.9,0,1)); o= t>=land-0.9 ? 1 : 0; }
    else { const s2=clamp((t-land)/Math.max(0.3,lick-land),0,1); y=lerp(headY, by+(-165+12)*S, s2); o= t<lick+0.3 ? 1 : clamp(1-(t-lick-0.3)/0.2,0,1); }
    this.drop.setAttribute("opacity",o.toFixed(2));
    this.drop.setAttribute("transform",`translate(${cx},${y.toFixed(1)}) scale(2.2)`);
  }
};

window.SCENES = [scene0, scene1, scene2, scene3, scene4, scene5, scene6];
