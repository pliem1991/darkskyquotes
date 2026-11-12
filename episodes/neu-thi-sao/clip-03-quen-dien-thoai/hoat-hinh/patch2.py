import re
H = r"E:/Tiktok/darkskyquotes/episodes/neu-thi-sao/clip-03-quen-dien-thoai/hoat-hinh/"
# ---- char.js
p = H + 'hf/char.js'; s = open(p, encoding='utf-8').read()
a = '    if (st.aR !== undefined) aR = st.aR;'
assert a in s
s = s.replace(a, '''    if (!ps && st.aR === undefined) aR += 3 * Math.sin(TAU * t / 3.1);
    if (!ps && st.aL === undefined) aL -= 3 * Math.sin(TAU * t / 2.7 + 1);
    C.legL.style.display = st.hideLegs ? "none" : "";
    C.legR.style.display = st.hideLegs ? "none" : "";
''' + a)
open(p, 'w', encoding='utf-8').write(s)

# ---- build.py css
p = H + 'build.py'; s = open(p, encoding='utf-8').read()
i0 = s.index('#sub{{'); i1 = s.index('#endwash')
s = s[:i0] + '#sub{{position:absolute;left:50%;margin-left:-430px;bottom:524px;width:860px;text-align:center;font-weight:700;font-size:48px;line-height:1.15;color:#fff;background:rgba(42,32,51,.88);border-radius:28px;padding:12px 24px;display:none;transform-origin:50% 100%}}\n' + s[i1:]
s = s.replace('#wm{{position:absolute;left:60px;top:1395px;font-size:30px', '#wm{{position:absolute;left:60px;top:1404px;font-size:28px')
s = s.replace('.tcard{{', '.shade{{position:absolute;left:0;top:1300px;width:1080px;height:620px;background:linear-gradient(rgba(42,32,51,0),rgba(42,32,51,.16))}}\n.tcard{{', 1)
open(p, 'w', encoding='utf-8').write(s)

# ---- main.js: shade
p = H + 'hf/main.js'; s = open(p, encoding='utf-8').read()
a = '    sc.build(el);\n'
s = s.replace(a, a + '    { const sh = document.createElement("div"); sh.className = "shade"; el.appendChild(sh); }\n')
open(p, 'w', encoding='utf-8').write(s)

# ---- scenes.js
p = H + 'hf/scenes.js'; s = open(p, encoding='utf-8').read()


def rep(a, b):
    global s
    assert a in s, a[:70]
    s = s.replace(a, b, 1)


rep('const bed = (id, blanket) => `<g id="${id}">', 'const bed = (id, blanket, dy) => `<g id="${id}" transform="translate(0 ${dy || 0})">')
rep('<rect y="1290" width="1080" height="630" fill="#e8d6bd"/>', '<rect y="1130" width="1080" height="790" fill="#e8d6bd"/>')
rep('<rect y="1270" width="1080" height="26" fill="#fff8ea"/>`;', '<rect y="1110" width="1080" height="26" fill="#fff8ea"/>`;')
rep('<path d="M0 1380 H1080 M0 1480 H1080 M0 1600 H1080 M0 1740 H1080" stroke="#dcc7a7" stroke-width="4"/>', '<path d="M0 1260 H1080 M0 1400 H1080 M0 1560 H1080 M0 1740 H1080" stroke="#dcc7a7" stroke-width="4"/>')
i0 = s.index('const deskFront'); i1 = s.index('const scenes = [];')
s = s[:i0] + '''const deskFront = (id) => `<g id="${id}"><rect x="-10" y="1090" width="1100" height="40" rx="10" fill="#d9a066"/>
<rect x="-10" y="1130" width="1100" height="112" fill="#b9803f"/><rect x="-10" y="1242" width="1100" height="10" fill="#8f5f2c"/>
<rect x="40" y="1142" width="470" height="84" rx="12" fill="#a8702f"/><rect x="570" y="1142" width="470" height="84" rx="12" fill="#a8702f"/>
<rect x="250" y="1176" width="60" height="14" rx="7" fill="#f3d27a"/><rect x="780" y="1176" width="60" height="14" rx="7" fill="#f3d27a"/></g>`;

''' + s[i1:]

# Scene 1
rep('<rect y="1260" width="1080" height="660" fill="#efc08a"/><rect y="1240" width="1080" height="30" fill="#fff6e6"/>\n<path d="M0 1340 H1080 M0 1430 H1080 M0 1540 H1080 M0 1670 H1080 M0 1820 H1080" stroke="#e3ae75" stroke-width="5"/>',
    '<rect y="1160" width="1080" height="760" fill="#efc08a"/><rect y="1140" width="1080" height="30" fill="#fff6e6"/>\n<path d="M0 1260 H1080 M0 1370 H1080 M0 1500 H1080 M0 1650 H1080 M0 1820 H1080" stroke="#e3ae75" stroke-width="5"/>')
rep('<rect x="800" y="560" width="210" height="710" fill="#fffbe2"/><rect x="800" y="560" width="210" height="710" fill="#ffe9a8" opacity=".5"/>', '<rect x="800" y="540" width="210" height="640" fill="#fffbe2"/><rect x="800" y="540" width="210" height="640" fill="#ffe9a8" opacity=".5"/>')
rep('<rect x="800" y="560" width="200" height="710" rx="6" fill="#c98b4e"/><rect x="824" y="590" width="152" height="270" rx="8" fill="#b57a3f"/><rect x="824" y="890" width="152" height="340" rx="8" fill="#b57a3f"/><circle cx="946" cy="930" r="12" fill="#f3d27a"/>',
    '<rect x="800" y="540" width="200" height="640" rx="6" fill="#c98b4e"/><rect x="824" y="570" width="152" height="250" rx="8" fill="#b57a3f"/><rect x="824" y="850" width="152" height="300" rx="8" fill="#b57a3f"/><circle cx="946" cy="880" r="12" fill="#f3d27a"/>')
rep('+ bed("s1bed", "#9ad0f5") +', '+ bed("s1bed", "#9ad0f5", -105) +')
i0 = s.index('      const lt = t - L[0].s, ph = 0.35;'); i1 = s.index('      // điện thoại rung')
s = s[:i0] + '''      const lt = t - L[0].s, ph = 0.3;
      const dk = 1 - 0.78 * easeOut((lt - 0.7) / 0.5);
      tf("s1leaf", `translate(1000 0) scale(${dk.toFixed(3)} 1) translate(-1000 0)`);
      const run = clamp((lt - ph) / 1.7, 0, 1);
      const x = lerp(520, 1420, run * run * 0.6 + run * 0.4);
      const running = lt > ph && x < 1400;
      const pre = lt <= ph ? Math.sin(lt * 9) * 2 : 0;
      Ch.place(this.C, x, 1285, 1.85, 1, running ? 6 : pre, 150, 340);
      show("c1_ch", x < 1420);
      Ch.pose(this.C, { t: lt, exp: lt > 0.5 ? "ngac-nhien" : "binh-thuong", pose: running ? "run" : "", talk: -1, gaze: lt < ph ? [-6, 4] : [4, 0] });
''' + s[i1:]
rep('tf("s1ph", `translate(${(400 + j).toFixed(1)} 1015) rotate', 'tf("s1ph", `translate(${(400 + j).toFixed(1)} 905) rotate')

# Scene 2
rep('<rect y="1160" width="1080" height="70" fill="#e8d7c3"/>', '<rect y="1070" width="1080" height="70" fill="#e8d7c3"/>')
rep('<rect y="1230" width="1080" height="700" fill="#8f94ad"/><rect y="1230" width="1080" height="12" fill="#767b96"/>', '<rect y="1140" width="1080" height="780" fill="#8f94ad"/><rect y="1140" width="1080" height="12" fill="#767b96"/>')
rep('<rect x="${i * 160}" y="1560" width="90" height="16" rx="8"/>', '<rect x="${i * 160}" y="1480" width="90" height="16" rx="8"/>')
rep('<rect x="-272" y="-182" width="14" height="30" rx="6" fill="#ff6f6f"/></g></g>',
    '<rect x="-272" y="-182" width="14" height="30" rx="6" fill="#ff6f6f"/>\n<path d="M-115 -232 L-52 -196 L-30 -114" stroke="#f6cfb0" stroke-width="22" stroke-linecap="round" stroke-linejoin="round" fill="none"/><ellipse cx="-22" cy="-100" rx="22" ry="11" fill="#fff" stroke="#e3d6e8" stroke-width="3"/>\n<path d="M-140 -232 L-86 -190 L-72 -112" stroke="#eebc98" stroke-width="22" stroke-linecap="round" stroke-linejoin="round" fill="none"/><ellipse cx="-64" cy="-98" rx="22" ry="11" fill="#fff" stroke="#e3d6e8" stroke-width="3"/></g></g>\n<g id="s2ex" opacity="0"><g fill="#ff4f6f"><rect x="-6" y="-60" width="12" height="38" rx="6"/><circle cx="0" cy="-8" r="7"/><rect x="54" y="-80" width="12" height="38" rx="6" transform="rotate(14 60 -60)"/><circle cx="68" cy="-28" r="7"/><rect x="-66" y="-76" width="12" height="38" rx="6" transform="rotate(-14 -60 -56)"/><circle cx="-62" cy="-24" r="7"/></g></g>')
rep('translate(${X.toFixed(1)} ${(1368 + bob).toFixed(1)}) rotate(${pitch.toFixed(2)} -170 -55) scale(1.5)', 'translate(${X.toFixed(1)} ${(1235 + bob).toFixed(1)}) rotate(${pitch.toFixed(2)} -170 -55) scale(1.45)')
rep('const X = 540 + dep * 0.9;', 'const X = 520 + dep * 0.9;')
rep('      Ch.place(this.C, -130, -158, 1.2, 1);\n', '')
rep('      Ch.pose(this.C, { t: t0, exp, pose: ps, talk: talkAt(t), bagHz: 3, sweat: exp === "que" || exp === "met" });',
    '''      const sway = t >= tE ? Math.sin(t0 * 7) * 2.5 : 0;
      Ch.place(this.C, -130, -158, 1.2, 1, sway, 150, 340);
      Ch.pose(this.C, { t: t0, exp, pose: ps, talk: talkAt(t), bagHz: 3.5, sweat: exp === "ngac-nhien" || exp === "que" || exp === "met", hideLegs: true, headRot: t >= tE && t < M(1, 10) ? Math.sin(t0 * 5) * 4 : 0 });
      const exk = t >= tE + 0.1 && t < M(1, 10) ? popScale(t, tE + 0.1, 0.3) : 0;
      op("s2ex", exk > 0.05 ? 1 : 0);
      tf("s2ex", `translate(520 440) scale(${(exk * 1.1).toFixed(3)})`);''')

# Scene 3
rep('<g id="s3cart"><path', '<g id="s3cart" transform="translate(0 -160)"><path')
rep('<rect y="1330" width="1080" height="590" fill="#cfc7d6"/><rect y="1330" width="1080" height="24" fill="#e8d7c3"/>\n<path d="M0 1500 H1080 M0 1650 H1080 M0 1800 H1080" stroke="#b9b0c4" stroke-width="5"/>', '<rect y="1130" width="1080" height="790" fill="#cfc7d6"/><rect y="1130" width="1080" height="24" fill="#e8d7c3"/>\n<path d="M0 1330 H1080 M0 1500 H1080 M0 1650 H1080 M0 1800 H1080" stroke="#b9b0c4" stroke-width="5"/>')
rep('const x = lerp(1250, 800, easeOut((t - s0 + 0.2) / (tArr - s0 + 0.2)));', 'const x = lerp(1280, 815, easeOut((t - s0 + 0.2) / (tArr - s0 + 0.2)));')
rep('''      Ch.place(this.C, x, 1352, 2.0, 1);
      Ch.pose(this.C, { t: t0, exp, pose: walking ? "walk" : "", talk: talkAt(t), aR: 44 * easeOut(reach), aL: -22 * easeOut(reach), sweat: t >= tP, headRot: 0 });''',
    '''      Ch.place(this.C, x, 1250, 2.2, 1, walking ? 0 : -3 * easeOut(reach) + Math.sin(t0 * 1.4) * 1.5, 150, 340);
      Ch.pose(this.C, { t: t0, exp, pose: walking ? "walk" : "", talk: talkAt(t), aR: 44 * easeOut(reach) + (reach >= 1 ? Math.sin(t0 * 2) * 2 : 0), aL: -22 * easeOut(reach), sweat: t >= tP, headRot: walking ? 0 : -5 * easeOut(reach) + Math.sin(t0 * 1.2) * 2, gaze: [walking ? -3 : -8, 0] });''')
rep('tf("s3co", `translate(360 930) scale', 'tf("s3co", `translate(360 800) scale')

# Scene 4
rep('const x = lerp(-200, 300, easeOut(t0 / 0.8));', 'const x = lerp(-250, 310, easeOut(t0 / 0.9));')
rep('''      Ch.place(this.C, x, 1352, 2.0, 1);
      Ch.pose(this.C, { t: t0, exp, pose: t0 < 0.8 ? "walk" : "", talk: talkAt(t), gaze: exp === "ngac-nhien" ? gz : [0, 0], blinkOff: 0.5 });''',
    '''      Ch.place(this.C, x, 1250, 2.25, 1, t0 < 0.9 ? 0 : Math.sin(t0 * 1.1) * 2.5, 150, 340);
      Ch.pose(this.C, { t: t0, exp, pose: t0 < 0.9 ? "walk" : "", talk: talkAt(t), gaze: t0 < 0.9 ? [0, 0] : [Math.sin(t0 * 1.3) * 9, 0], headRot: Math.sin(t0 * 1.1 + 1) * 3, blinkOff: 0.5 });''')

# Scene 5
rep('<g id="s5pl"><rect x="880" y="1090" width="54" height="60" rx="8" fill="#ff9f6e"/><path d="M907 1090 C860 1030 870 990 907 960 C945 990 955 1030 907 1090 Z" fill="#7bc88a"/></g>',
    '<g id="s5pl" transform="translate(0 -60)"><rect x="880" y="1090" width="54" height="60" rx="8" fill="#ff9f6e"/><path d="M907 1090 C860 1030 870 990 907 960 C945 990 955 1030 907 1090 Z" fill="#7bc88a"/></g>\n<rect x="280" y="760" width="250" height="360" rx="60" fill="#6cc5b0"/>')
rep('<g><rect x="720" y="960" width="260" height="160" rx="12" fill="#2a2033"/><rect x="734" y="974" width="232" height="132" rx="6" fill="#7aa0ff"/><rect x="835" y="1120" width="30" height="30" fill="#2a2033"/></g>\n<rect x="530" y="1128" width="90" height="26" rx="8" fill="#e8e0f0"/></svg>',
    '<g transform="translate(0 -60)"><rect x="720" y="960" width="260" height="160" rx="12" fill="#2a2033"/><rect x="734" y="974" width="232" height="132" rx="6" fill="#7aa0ff"/><rect x="835" y="1120" width="30" height="30" fill="#2a2033"/></g>\n<rect x="560" y="1066" width="90" height="26" rx="8" fill="#e8e0f0"/></svg>')
rep('''      Ch.place(this.C, 400, 1320, 2.0, 1);
      Ch.pose(this.C, { t: t0, exp, pose: "", holdPhone: true, aR: 44 * easeOut(hold), aL: -30 * easeOut(hold), talk: talkAt(t), gaze: [-4 * up, -7 * up], headRot: -5 * up, sweat: exp === "que" });''',
    '''      Ch.place(this.C, 405 + Math.sin(t0 * 0.8) * 8, 1262, 2.3, 1, Math.sin(t0 * 0.9) * 2.5 - 2 * up, 150, 340);
      Ch.pose(this.C, { t: t0, exp, pose: "", holdPhone: true, aR: 44 * easeOut(hold) + Math.sin(t0 * 2.4) * 2, aL: -30 * easeOut(hold), talk: talkAt(t), gaze: [-4 * up + Math.sin(t0 * 1.5) * 3, -7 * up], headRot: -7 * up + Math.sin(t0 * 1.7) * 2, sweat: exp === "que" });''')

# Scene 6
rep('<g id="s6chair"><rect x="330" y="760" width="300" height="470" rx="60" fill="#6cc5b0"/><rect x="480" y="1180" width="22" height="200" fill="#8c8aa0"/><path d="M360 1380 H620" stroke="#8c8aa0" stroke-width="14" stroke-linecap="round"/></g>', '<g id="s6chair"><rect x="400" y="700" width="290" height="440" rx="64" fill="#6cc5b0"/></g>')
rep('<g><rect x="720" y="960" width="260" height="160" rx="12" fill="#2a2033"/><rect x="734" y="974" width="232" height="132" rx="6" fill="#5a4a7a"/><rect x="835" y="1120" width="30" height="30" fill="#2a2033"/></g></svg>', '<g transform="translate(0 -60)"><rect x="720" y="960" width="260" height="160" rx="12" fill="#2a2033"/><rect x="734" y="974" width="232" height="132" rx="6" fill="#5a4a7a"/><rect x="835" y="1120" width="30" height="30" fill="#2a2033"/></g></svg>')
rep('''      Ch.place(this.C, 540, 1320, 2.0, 1, -7 * easeOut(lean), 150, 340);
      const tapping = t >= tb;
      Ch.pose(this.C, { t: t0, exp, pose: tapping ? "bag" : "", talk: talkAt(t), headRot: 5 * lean, bagHz: 2.4, sweat: false });''',
    '''      const rock = Math.sin(t0 * 1.6) * 1.5 * lean;
      Ch.place(this.C, 545, 1262 + 34 * easeOut(lean), 2.3, 1, -9 * easeOut(lean) + rock, 150, 340);
      const tapping = t >= tb;
      Ch.pose(this.C, { t: t0, exp, pose: tapping ? "bag" : "", talk: talkAt(t), headRot: -16 * easeOut(lean) + Math.sin(t0 * 1.1) * 2, gaze: [0, -6 * easeOut(lean)], bagHz: 2.4, sweat: false });''')

# Scene 7
rep('<rect y="1260" width="1080" height="660" fill="#e8b27a"/><rect y="1240" width="1080" height="30" fill="#fff0e0"/>\n<path d="M0 1340 H1080 M0 1430 H1080 M0 1540 H1080 M0 1670 H1080 M0 1820 H1080" stroke="#d99f62" stroke-width="5"/>',
    '<rect y="1160" width="1080" height="760" fill="#e8b27a"/><rect y="1140" width="1080" height="30" fill="#fff0e0"/>\n<path d="M0 1260 H1080 M0 1370 H1080 M0 1500 H1080 M0 1650 H1080 M0 1820 H1080" stroke="#d99f62" stroke-width="5"/>')
rep('+ bed("s7bed", "#b79cff") + `<g><rect x="860" y="1060"', '+ bed("s7bed", "#b79cff", -105) + `<g transform="translate(0 -70)"><rect x="860" y="1060"')
rep('const x = lerp(1250, 560, easeOut(t0 / 0.8));', 'const x = lerp(1280, 560, easeOut(t0 / 0.9));')
rep('''      Ch.place(this.C, x, 1300, 2.0, 1);
      Ch.pose(this.C, { t: t0, exp, pose: t0 < 0.8 ? "walk" : "",''', '''      Ch.place(this.C, x, 1250, 2.25, 1, t0 < 0.9 ? 0 : Math.sin(t0 * 1.3) * 2.5, 150, 340);
      Ch.pose(this.C, { t: t0, exp, headRot: Math.sin(t0 * 1.5) * 3, pose: t0 < 0.9 ? "walk" : "",''')
rep('aR: t0 < 0.8 ? undefined : 44 * easeOut(hold), aL: t0 < 0.8 ? undefined : -30 * easeOut(hold)', 'aR: t0 < 0.9 ? undefined : 44 * easeOut(hold), aL: t0 < 0.9 ? undefined : -30 * easeOut(hold)')
rep('const px = x + (147.9 - 150) * 2, py = 1300 + (267.8 - 410) * 2;', 'const px = x + (147.9 - 150) * 2.25, py = 1250 + (267.8 - 410) * 2.25;')
a = s.index('const side = r(), ax ='); b = s.index('const ts = D.pings[i]')
s = s[:a] + '''const side = r(), ax = side < 0.45 ? 160 + r() * 130 : side < 0.9 ? 790 + r() * 50 : 430 + r() * 220, ay = side < 0.9 ? 380 + r() * 820 : 262 + r() * 36;
        const tx = ax, ty = ay;
        ''' + s[b:]
s = s.replace('const sc = 0.85 * (0.3', 'const sc = 0.72 * (0.3')
open(p, 'w', encoding='utf-8').write(s)
print("ok")
