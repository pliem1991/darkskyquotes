/* scenes.js — clip 12: Nếu muỗi phải xin phép trước khi đốt bạn
   6 cảnh: muỗi cầm điện thoại, hộp thoại xin đốt, từ chối 30 lần hỏi lại 31,
   "hứa không sưng", điều khoản ba trang + đồng ý tất cả, chân đầy vết đốt + mời đánh giá. */

const Ch = window.Char;
const D = window.DATA;
const clamp = (x,a,b) => Math.max(a,Math.min(b,x));
const lerp = (a,b,t) => a+(b-a)*clamp(t,0,1);
const easeOut = t => { t=clamp(t,0,1); return 1-(1-t)*(1-t); };
const easeInOut = t => { t=clamp(t,0,1); return t<.5 ? 2*t*t : 1-Math.pow(-2*t+2,2)/2; };
const backOut = t => { t=clamp(t,0,1); const c=1.7; return 1+(--t)*t*((c+1)*t+c); };

function M(li,si){ const s=D.lines[li]; if(!s) return 0; const k=Math.min(si,s.syl.length-1); return s.syl[k].s - s.s; }
function P(li,pi){ const s=D.lines[li]; return s.parts[Math.min(pi,s.parts.length-1)].s - s.s; }
function talkAt(gt){ const fi=Math.floor(gt*30); return (D.env[fi]||0)*3.5; }
function popIn(t,t0,dur){ const p=clamp((t-t0)/dur,0,1); return p<=0?0.001:backOut(p); }
function pulse(t,t0,dur,amp){ const p=clamp((t-t0)/dur,0,1); return p<=0||p>=1?1:1+amp*Math.sin(Math.PI*p); }
function show(el,t,t0,x,y,dur,s){ if(t<t0){ el.setAttribute("opacity","0"); return; } el.setAttribute("opacity","1"); el.setAttribute("transform",`translate(${x},${y}) scale(${(popIn(t,t0,dur||0.35)*(s||1)).toFixed(3)})`); }
const FONT = `font-family="Segoe UI,Arial,sans-serif"`;

/* ── Con muỗi. Gốc ở thân. opts: glasses, big (mắt to), label, phone ── */
function mosq(id, o){
  o=o||{};
  const legs=[-14,-2,10].map((x,i)=>`<path d="M${x} 6 q${-8+i*3} 18 ${-14+i*6} 30" stroke="#2a2433" stroke-width="2.5" fill="none"/><path d="M${x+4} 6 q${8-i*3} 18 ${14-i*6} 30" stroke="#2a2433" stroke-width="2.5" fill="none"/>`).join("");
  const eyes = o.big
    ? `<circle cx="-38" cy="-8" r="9" fill="#fff" stroke="#2a2433" stroke-width="2"/><circle cx="-38" cy="-7" r="5.5" fill="#2a2433"/><circle cx="-36" cy="-10" r="2" fill="#fff"/>`
    : `<circle cx="-38" cy="-8" r="4" fill="#ff4d6d"/>`;
  return `<g id="${id}">
    <g id="${id}w"><ellipse cx="-2" cy="-22" rx="14" ry="26" fill="#cfe6ff" opacity=".7" stroke="#8aa8c8" stroke-width="1.5" transform="rotate(-25 -2 -10)"/><ellipse cx="10" cy="-22" rx="12" ry="24" fill="#cfe6ff" opacity=".6" stroke="#8aa8c8" stroke-width="1.5" transform="rotate(20 10 -10)"/></g>
    ${legs}
    <ellipse cx="18" cy="2" rx="26" ry="8" fill="#4a4458"/>
    <path d="M24 -2 l6 8 M34 -2 l5 8" stroke="#2a2433" stroke-width="2"/>
    <ellipse cx="-14" cy="0" rx="14" ry="11" fill="#3a3448"/>
    <circle cx="-34" cy="-6" r="13" fill="#3a3448"/>
    ${eyes}
    <path d="M-46 -2 L-74 8" stroke="#2a2433" stroke-width="3" stroke-linecap="round"/>
    ${o.glasses?`<g stroke="#ffd35c" stroke-width="2.5" fill="none"><circle cx="-38" cy="-8" r="8"/><circle cx="-24" cy="-10" r="7"/><path d="M-30 -9 L-31 -9"/></g>`:""}
    ${o.label?`<text x="18" y="7" font-size="13" font-weight="800" fill="#fff" text-anchor="middle" ${FONT}>${o.label}</text>`:""}
    ${o.phone?`<g transform="translate(-58,14) rotate(-12)"><rect x="-9" y="-15" width="18" height="30" rx="4" fill="#2a2433"/><rect x="-6.5" y="-11" width="13" height="20" rx="2" fill="#bfe4ff"/></g>`:""}
  </g>`;
}
function flyMosq(el,w,t,x,y,s,flip,bob){
  const hy=y+(bob===undefined?8:bob)*Math.sin(t*3.1)+3*Math.sin(t*7.3);
  el.setAttribute("transform",`translate(${x.toFixed(1)},${hy.toFixed(1)}) scale(${(s*(flip||1)).toFixed(3)},${s.toFixed(3)})`);
  if(w) w.setAttribute("transform",`translate(0 -10) scale(1 ${(0.45+0.55*Math.abs(Math.sin(t*55))).toFixed(2)}) translate(0 10)`);
}

/* ── Hộp thoại kiểu điện thoại ── */
function dialog(id, title, body, small, btnL, btnR, w){
  w=w||760;
  const h = small?420:380, x0=-w/2;
  return `<g id="${id}" opacity="0">
    <rect x="${x0+8}" y="-${h/2-12}" width="${w}" height="${h}" rx="40" fill="#000" opacity=".25"/>
    <rect x="${x0}" y="-${h/2}" width="${w}" height="${h}" rx="40" fill="#fff"/>
    <text x="0" y="-${h/2-78}" font-size="44" font-weight="800" fill="#1a2844" text-anchor="middle" ${FONT}>${title}</text>
    <text x="0" y="-${h/2-148}" font-size="54" font-weight="900" fill="#ff4f86" text-anchor="middle" ${FONT}>${body}</text>
    ${small?`<text x="0" y="-${h/2-200}" font-size="28" font-weight="600" fill="#8a8aa0" text-anchor="middle" ${FONT}>${small}</text>`:""}
    <rect id="${id}bl" x="${x0+40}" y="${h/2-130}" width="${w/2-60}" height="96" rx="48" fill="#e6e6ee"/>
    <text x="${x0+40+(w/2-60)/2}" y="${h/2-68}" font-size="42" font-weight="800" fill="#4a4a60" text-anchor="middle" ${FONT}>${btnL}</text>
    <rect id="${id}br" x="${20}" y="${h/2-130}" width="${w/2-60}" height="96" rx="48" fill="#ff4f86"/>
    <text x="${20+(w/2-60)/2}" y="${h/2-68}" font-size="42" font-weight="800" fill="#fff" text-anchor="middle" ${FONT}>${btnR}</text>
  </g>`;
}
function tag(id,txt,fill,col){ return `<g id="${id}" opacity="0"><rect x="-150" y="-60" width="300" height="104" rx="30" fill="${fill||"#fff"}" stroke="#1a2844" stroke-width="6"/><text x="0" y="20" font-size="64" font-weight="800" fill="${col||"#1a2844"}" text-anchor="middle" font-family="Consolas,monospace">${txt}</text></g>`; }

/* Phòng ngủ ban đêm (như clip 10) */
function bedroom(p){
  let lights="";
  for(let i=0;i<18;i++){ const x=135+(i*53)%230, y=640+((i*37)%170); lights+=`<rect x="${x}" y="${y}" width="8" height="10" fill="#ffd98a" opacity="${(0.35+0.4*((i*7)%5)/5).toFixed(2)}"/>`; }
  return `<defs><linearGradient id="${p}bg" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#161c36"/><stop offset="1" stop-color="#0b0e1c"/></linearGradient>
    <radialGradient id="${p}glow" cx=".5" cy=".5" r=".5"><stop offset="0" stop-color="#8cc4ff" stop-opacity=".55"/><stop offset="1" stop-color="#8cc4ff" stop-opacity="0"/></radialGradient></defs>
  <rect width="1080" height="1920" fill="url(#${p}bg)"/>
  <rect x="110" y="560" width="280" height="300" rx="10" fill="#0e1430" stroke="#2a3360" stroke-width="10"/>
  <circle cx="320" cy="620" r="26" fill="#e8ecff" opacity=".85"/>${lights}
  <line x1="250" y1="560" x2="250" y2="860" stroke="#2a3360" stroke-width="8"/>
  <rect x="0" y="1300" width="1080" height="620" fill="#0a0c18"/>
  <rect x="250" y="960" width="560" height="230" rx="26" fill="#352c52"/>
  <rect x="230" y="1160" width="620" height="300" rx="30" fill="#463c6c"/>`;
}
const BLANKET = `<path d="M232 1200 Q540 1150 850 1205 L850 1470 L232 1470 Z" fill="#7a6ab0"/><path d="M232 1200 Q540 1150 850 1205" stroke="#9a8ad0" stroke-width="8" fill="none"/>`;

/* ── Cảnh 0: hook, muỗi đeo kính cầm điện thoại tí hon ── */
const scene0 = {
  build(el){
    el.innerHTML = `<svg viewBox="0 0 1080 1920" width="1080" height="1920" xmlns="http://www.w3.org/2000/svg">
    ${bedroom("c12s0")}
    <circle id="c12s0glowEl" cx="445" cy="1085" r="230" fill="url(#c12s0glow)"/>
    ${Ch.markup("s0_",{phoneScreen:"#cfe6ff"})}
    ${BLANKET}
    ${mosq("c12s0m",{glasses:true,phone:true})}
    </svg>`;
    this.C=Ch.bind("s0_"); this.m=el.querySelector("#c12s0m"); this.w=el.querySelector("#c12s0mw");
  },
  update(t){
    const gt=t+D.lines[0].s;
    Ch.place(this.C,480,1330,1.35,1);
    Ch.pose(this.C,{t,exp: t>0.6?"ngac-nhien":"binh-thuong",hideLegs:true,holdPhone:true,aR:60,gaze:[8,-4],headRot:3,talk:talkAt(gt)});
    const x=lerp(1000,700,easeOut(t/0.7));
    flyMosq(this.m,this.w,t,x,980,2.2,1);
  }
};

/* ── Cảnh 1: 23:00, hộp thoại muỗi #14 xin đốt bắp chân trái ── */
const scene1 = {
  build(el){
    el.innerHTML = `<svg viewBox="0 0 1080 1920" width="1080" height="1920" xmlns="http://www.w3.org/2000/svg">
    ${bedroom("c12s1")}
    <rect width="1080" height="1920" fill="#000" opacity=".35"/>
    ${tag("c12s1tag","23:00")}
    ${dialog("c12s1d","Muỗi #14 muốn đốt:","bắp chân trái",null,"Từ chối","Đồng ý")}
    ${mosq("c12s1m",{label:"#14"})}
    ${Ch.markup("s1_",{phoneScreen:"#cfe6ff"})}
    </svg>`;
    this.C=Ch.bind("s1_"); const q=id=>el.querySelector("#"+id);
    this.tag=q("c12s1tag"); this.d=q("c12s1d"); this.m=q("c12s1m"); this.w=q("c12s1mw");
  },
  update(t){
    const gt=t+D.lines[1].s;
    show(this.tag,t,-0.1,540,360);
    show(this.d,t,M(1,4)-0.1,540,820,0.4);
    flyMosq(this.m,this.w,t,lerp(980,820,easeOut((t-M(1,4))/0.6)),560,1.6,1);
    Ch.place(this.C,230,1500,1.05,1);
    Ch.pose(this.C,{t,exp: t>=M(1,10)?"ngac-nhien":"binh-thuong",hideLegs:true,holdPhone:true,aR:60,gaze:[6,-6],headRot:4,talk:talkAt(gt)});
  }
};

/* ── Cảnh 2: từ chối 30 lần, nó hỏi lại lần 31 ── */
const scene2 = {
  build(el){
    el.innerHTML = `<svg viewBox="0 0 1080 1920" width="1080" height="1920" xmlns="http://www.w3.org/2000/svg">
    ${bedroom("c12s2")}
    <rect width="1080" height="1920" fill="#000" opacity=".4"/>
    ${tag("c12s2clk","02:00","#1a2844","#ff6b8a")}
    <g id="c12s2stack"></g>
    ${dialog("c12s2d","Muỗi #14 muốn đốt:","bắp chân trái",null,"Từ chối","Đồng ý")}
    <g id="c12s2cnt" opacity="0"><rect x="-190" y="-56" width="380" height="96" rx="30" fill="#e6e6ee"/><text id="c12s2ct" x="0" y="16" font-size="54" font-weight="900" fill="#4a4a60" text-anchor="middle" ${FONT}>Từ chối ×0</text></g>
    <g id="c12s2again" opacity="0"><rect x="-210" y="-56" width="420" height="96" rx="30" fill="#ff4f86"/><text x="0" y="16" font-size="54" font-weight="900" fill="#fff" text-anchor="middle" ${FONT}>Lần hỏi thứ 31</text></g>
    ${Ch.markup("s2_",{phoneScreen:"#cfe6ff"})}
    </svg>`;
    this.C=Ch.bind("s2_"); const q=id=>el.querySelector("#"+id);
    this.clk=q("c12s2clk"); this.d=q("c12s2d"); this.bl=q("c12s2dbl"); this.cnt=q("c12s2cnt"); this.ct=q("c12s2ct"); this.again=q("c12s2again");
  },
  update(t){
    const gt=t+D.lines[2].s;
    const a=M(2,3), b=Math.max(M(2,8), a+1.2), re=P(2,1);
    const n = t<a?0: t<b? Math.floor(1+29*(t-a)/(b-a)) : 30;
    const ph = t>=a && t<b ? ((t-a)*(29/(b-a)))%1 : 1;
    this.d.setAttribute("opacity","1");
    const sc = t<re ? (ph<0.25? 0.96 : 1) : pulse(t,re,0.35,0.12);
    this.d.setAttribute("transform",`translate(540,${(t>=re?760:820)}) scale(${sc.toFixed(3)})`);
    this.bl.setAttribute("fill", ph<0.25 ? "#b8b8c8" : "#e6e6ee");
    show(this.cnt,t,a,540,1100,0.25);
    this.ct.textContent="Từ chối ×"+n;
    show(this.again,t,re+0.1,540,480,0.4);
    show(this.clk,t,-0.1,830,300);
    Ch.place(this.C,230,1500,1.05,1);
    Ch.pose(this.C,{t,exp: t>=re?"met":"que",hideLegs:true,holdPhone:true,aR:60,gaze:[6,-6],headRot:4,talk:talkAt(gt),sweat:t<re});
  }
};

/* ── Cảnh 3: "Chỉ 1 chút thôi, cam kết không sưng*", vẫn từ chối ── */
const scene3 = {
  build(el){
    el.innerHTML = `<svg viewBox="0 0 1080 1920" width="1080" height="1920" xmlns="http://www.w3.org/2000/svg">
    ${bedroom("c12s3")}
    <rect width="1080" height="1920" fill="#000" opacity=".35"/>
    ${dialog("c12s3d","Chỉ 1 chút thôi","Cam kết không sưng*","*có thể sưng, xem điều khoản","Từ chối","Đồng ý",820)}
    ${mosq("c12s3m",{big:true,label:"#14"})}
    ${Ch.markup("s3_",{phoneScreen:"#cfe6ff"})}
    </svg>`;
    this.C=Ch.bind("s3_"); const q=id=>el.querySelector("#"+id);
    this.d=q("c12s3d"); this.bl=q("c12s3dbl"); this.m=q("c12s3m"); this.w=q("c12s3mw");
  },
  update(t){
    const gt=t+D.lines[3].s;
    const ask=P(3,1), no=P(3,2);
    show(this.d,t,ask-0.15,540,820,0.4);
    if(t>=no+0.3){ const sh=Math.sin((t-no-0.3)*60)*14*Math.max(0,1-(t-no-0.3)/0.4); this.d.setAttribute("transform",`translate(${(540+sh).toFixed(1)},820)`); }
    this.bl.setAttribute("fill", (t>=no+0.2&&t<no+0.45)?"#b8b8c8":"#e6e6ee");
    flyMosq(this.m,this.w,t,lerp(980,800,easeOut(t/0.6)),540,2.4,1,4);
    Ch.place(this.C,230,1500,1.05,1);
    Ch.pose(this.C,{t,exp: t>=no?"met":"binh-thuong",hideLegs:true,holdPhone:true,aR:60,gaze:[6,-6],headRot:t>=no?-6:4,talk:talkAt(gt)});
  }
};

/* ── Cảnh 4: điều khoản dài ba trang, "Đồng ý tất cả", đàn muỗi chờ ở cửa ── */
const scene4 = {
  build(el){
    let lines="";
    for(let i=0;i<46;i++){ const w=380+((i*97)%260); lines+=`<rect x="-${w/2}" y="${40+i*34}" width="${w}" height="12" rx="6" fill="#c8c8d8"/>`; }
    let crowd="";
    for(let i=0;i<9;i++) crowd+=mosq("c12s4c"+i,{label:"#"+(15+i)});
    el.innerHTML = `<svg viewBox="0 0 1080 1920" width="1080" height="1920" xmlns="http://www.w3.org/2000/svg">
    ${bedroom("c12s4")}
    <rect width="1080" height="1920" fill="#000" opacity=".35"/>
    <rect x="880" y="700" width="200" height="620" fill="#2a2030"/><rect x="872" y="690" width="12" height="630" fill="#6a4a32"/>
    <defs><clipPath id="c12s4clip"><rect x="160" y="250" width="760" height="1200"/></clipPath></defs>
    <g clip-path="url(#c12s4clip)"><g id="c12s4scroll" opacity="0">
      <rect x="-380" y="0" width="760" height="1700" rx="30" fill="#fff"/>
      <text x="0" y="-10" font-size="0">.</text>
      <g transform="translate(0,90)">${lines}</g>
      <text x="0" y="0" font-size="40" font-weight="800" fill="#1a2844" text-anchor="middle" ${FONT} transform="translate(0,70)">ĐIỀU KHOẢN ĐỐT</text>
    </g></g>
    <g id="c12s4btn" opacity="0"><rect x="-300" y="-66" width="600" height="132" rx="66" fill="#ff4f86"/><text x="0" y="20" font-size="62" font-weight="900" fill="#fff" text-anchor="middle" ${FONT}>Đồng ý tất cả</text></g>
    <g id="c12s4hand" opacity="0"><circle cx="0" cy="0" r="34" fill="#f6cfb0"/><rect x="-18" y="0" width="36" height="120" rx="18" fill="#f6cfb0"/></g>
    ${crowd}
    </svg>`;
    const q=id=>el.querySelector("#"+id);
    this.scroll=q("c12s4scroll"); this.btn=q("c12s4btn"); this.hand=q("c12s4hand");
    this.crowd=[...Array(9)].map((_,i)=>[q("c12s4c"+i),q("c12s4c"+i+"w")]);
  },
  update(t){
    const send=M(4,5), push=M(4,15), crowd=M(4,17);
    const gone = clamp(1-(t-crowd)/0.3,0,1);
    if(t>=send-0.1){ this.scroll.setAttribute("opacity",gone.toFixed(2)); const y=lerp(-1500,300,easeOut((t-send+0.1)/1.6)); this.scroll.setAttribute("transform",`translate(540,${y.toFixed(0)})`); } else this.scroll.setAttribute("opacity","0");
    show(this.btn,t,push-0.5,540,1180,0.35);
    if(t>=crowd) this.btn.setAttribute("opacity",gone.toFixed(2));
    if(t>=push-0.4 && t<crowd+0.3){ this.hand.setAttribute("opacity",gone.toFixed(2)); const k=clamp((t-push+0.4)/0.4,0,1); const yy=lerp(1500,1210,easeOut(k)); this.hand.setAttribute("transform",`translate(600,${yy.toFixed(0)})`); } else this.hand.setAttribute("opacity","0");
    if(t>=push) this.btn.setAttribute("transform",`translate(540,1180) scale(${(t<push+0.15?0.93:1).toFixed(2)})`);
    this.crowd.forEach(([m,w],i)=>{
      const k=easeOut((t-crowd-i*0.08)/0.6);
      m.setAttribute("opacity",k>0?"1":"0");
      const col=i%3, row=Math.floor(i/3);
      flyMosq(m,w,t+i,lerp(1200,330+col*210,k),lerp(500,620+row*200,k),1.6,1,6);
    });
  }
};

/* ── Cảnh 5: sáng ra, chân đầy vết đốt, tin nhắn mời đánh giá muỗi #14 ── */
const scene5 = {
  build(el){
    const bites=[[-14,-80],[-20,-50],[-10,-26],[8,-70],[18,-40],[-24,-100],[14,-96],[4,-12],[-6,-60],[22,-18],[-16,-6],[10,-54]];
    this.bitesPos=bites;
    el.innerHTML = `<svg viewBox="0 0 1080 1920" width="1080" height="1920" xmlns="http://www.w3.org/2000/svg">
    <defs><linearGradient id="c12s5bg" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#ffe7c2"/><stop offset="1" stop-color="#f6c98e"/></linearGradient></defs>
    <rect width="1080" height="1920" fill="url(#c12s5bg)"/>
    <rect x="110" y="560" width="280" height="300" rx="10" fill="#bfe4ff" stroke="#8a6040" stroke-width="10"/><circle cx="300" cy="640" r="40" fill="#fff3a0"/>
    <rect x="0" y="1320" width="1080" height="600" fill="#c99a6a"/>
    ${Ch.markup("s5_",{phoneScreen:"#cfe6ff"})}
    <g id="c12s5bites">${bites.map((b,i)=>`<circle id="c12s5b${i}" cx="0" cy="0" r="7" fill="#ff4d4d" stroke="#ffb3b3" stroke-width="3" opacity="0"/>`).join("")}</g>
    <g id="c12s5msg" opacity="0">
      <rect x="-380" y="-150" width="760" height="300" rx="40" fill="#fff"/>
      <circle cx="-300" cy="-70" r="40" fill="#3a3448"/><text x="-300" y="-58" font-size="30" font-weight="900" fill="#fff" text-anchor="middle" ${FONT}>#14</text>
      <text x="-230" y="-80" font-size="40" font-weight="800" fill="#1a2844" ${FONT}>Bạn thấy muỗi #14</text>
      <text x="-230" y="-30" font-size="40" font-weight="800" fill="#1a2844" ${FONT}>thế nào?</text>
      ${[0,1,2,3,4].map(i=>`<path id="c12s5s${i}" transform="translate(${-220+i*110},70)" d="M0 -40 L11 -12 L41 -12 L17 6 L26 36 L0 18 L-26 36 L-17 6 L-41 -12 L-11 -12 Z" fill="#e6e6ee"/>`).join("")}
    </g>
    ${mosq("c12s5m",{label:"#14"})}
    </svg>`;
    this.C=Ch.bind("s5_"); const q=id=>el.querySelector("#"+id);
    this.b=bites.map((_,i)=>q("c12s5b"+i)); this.msg=q("c12s5msg"); this.st=[0,1,2,3,4].map(i=>q("c12s5s"+i));
    this.m=q("c12s5m"); this.w=q("c12s5mw");
  },
  update(t){
    const gt=t+D.lines[5].s;
    const X=540, Y=1300, S=1.3;
    Ch.place(this.C,X,Y,S,1);
    Ch.pose(this.C,{t,exp: t>=M(5,12)?"que":"met",talk:talkAt(gt),gaze:[0,8],headRot:-4});
    this.b.forEach((c,i)=>{
      const leg = i%2===0 ? 133 : 167;
      const [dx,dy]=this.bitesPos[i];
      const k=t>=i*0.12-0.1;
      c.setAttribute("opacity",k?"1":"0");
      c.setAttribute("cx",(X+(leg-150)*S + dx*0.35).toFixed(1));
      c.setAttribute("cy",(Y+dy*1.0).toFixed(1));
      c.setAttribute("r",(k?6+1.5*pulse(t,i*0.12,0.3,0.6):0).toFixed(1));
    });
    const msgT=P(5,1);
    show(this.msg,t,msgT,540,560,0.4);
    const rate=M(5,10);
    this.st.forEach((s,i)=>s.setAttribute("fill", t>=rate+i*0.15 ? "#ffd35c" : "#e6e6ee"));
    const mT=M(5,12);
    if(t>=mT-0.4){ this.m.setAttribute("opacity","1"); flyMosq(this.m,this.w,t,lerp(1150,860,easeOut((t-mT+0.4)/0.6)),860,1.8,1); } else this.m.setAttribute("opacity","0");
  }
};

window.SCENES = [scene0, scene1, scene2, scene3, scene4, scene5];
