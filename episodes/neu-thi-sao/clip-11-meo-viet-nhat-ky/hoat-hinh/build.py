"""Build data.js + index.html cho clip 11 từ timeline.json."""
import json, math, struct, wave
from pathlib import Path
import numpy as np

ROOT = Path(__file__).resolve().parent
HF = ROOT / "hf"
TL = json.loads((ROOT / "audio" / "timeline.json").read_text(encoding="utf-8"))
lines_raw = json.loads((ROOT / "lines.json").read_text(encoding="utf-8"))

wav = ROOT / "audio" / "narration.wav"
with wave.open(str(wav), "rb") as w:
    n = w.getnframes()
    sr = w.getframerate()
    ch = w.getnchannels()
    raw = w.readframes(n)
samples = np.array(struct.unpack(f"<{n*ch}h", raw), dtype=np.float32) / 32768
if ch > 1:
    samples = samples.reshape(-1, ch).mean(axis=1)

fps = 30
hop = sr // fps
env = []
for i in range(0, len(samples), hop):
    chunk = samples[i : i + hop]
    env.append(round(float(np.sqrt(np.mean(chunk ** 2))), 4))

lines = []
for ln in TL["lines"]:
    parts = []
    for p in ln["parts"]:
        parts.append({"text": p["text"], "s": round(p["start"], 3), "e": round(p["end"], 3)})
    syls = []
    for w in ln["syl"]:
        syls.append({"s": round(w["s"], 3)})
    lines.append({
        "s": round(ln["start"], 3),
        "e": round(ln["end"], 3),
        "parts": parts,
        "syl": syls,
    })

dur = TL["duration"]
end_hold = 1.5
endT = round(dur - end_hold, 3)

data_js = f"window.DATA={json.dumps({'dur':round(dur,3),'endT':endT,'lines':lines,'env':env},ensure_ascii=False)};"
(HF / "data.js").write_text(data_js, encoding="utf-8")
print(f"data.js: {len(data_js)} bytes, dur={dur:.1f}s, {len(lines)} lines, {len(env)} env frames")

meta = {
    "dur": round(dur, 3),
    "endT": endT,
    "lines": [(l["s"], l["e"]) for l in lines],
    "syl": [[s["s"] for s in l["syl"]] for l in lines],
}
(ROOT / "audio" / "meta.json").write_text(json.dumps(meta), encoding="utf-8")
print(f"meta.json: {len(lines)} lines")

nscenes = len(lines)
B = [l["s"] for l in lines]
scene_divs = ""
for i in range(nscenes):
    start = 0 if i == 0 else B[i] - 0.6
    end = dur if i == nscenes - 1 else B[i + 1] + 0.2
    scene_divs += f'<div id="scene{i}" class="clip" data-start="{start:.3f}" data-duration="{end - start:.3f}" data-track-index="{i + 1}"><div class="sc" id="sc{i}"></div></div>\n'

hook_text = "Nếu con <b>mèo</b> viết<br>nhật ký, nó tố bạn<br>chuyện gì?"
end_text = "Thú cưng nhà bạn<br>sẽ viết gì về bạn?"

html = f"""<!doctype html>
<html lang="vi" data-resolution="portrait">
<head>
<meta charset="UTF-8"/>
<meta name="viewport" content="width=1080, height=1920"/>
<title>Neu thi sao clip 11</title>
<script src="gsap.min.js"></script>
<style>
*{{margin:0;padding:0;box-sizing:border-box}}
html,body{{margin:0;width:1080px;height:1920px;overflow:hidden;background:#f4efe3}}
body{{font-family:"Segoe UI",Arial,sans-serif}}
#root{{position:relative;width:1080px;height:1920px;overflow:hidden;background:#f4efe3}}
.sc{{filter:url(#boil)}}
.sc :is(path,rect,ellipse,circle):not([stroke]):not(.nl):not([opacity]):not([fill="#fff"]):not([fill^="url"]):not([fill="#000"]){{stroke:#3b2a55;stroke-width:3.5;stroke-linejoin:round}}
#tooth{{position:absolute;left:0;top:0;width:1080px;height:1920px;pointer-events:none}}
#vig{{position:absolute;left:0;top:0;width:1080px;height:1920px;background:radial-gradient(ellipse at 50% 45%,rgba(0,0,0,0) 55%,rgba(60,40,20,.28) 100%)}}
.clip{{position:absolute;left:0;top:0;width:1080px;height:1920px}}
.sc{{position:absolute;left:0;top:0;width:1080px;height:1920px;overflow:hidden}}
#hook{{position:absolute;left:70px;top:220px;width:900px;padding:30px 36px 36px;background:#f4efe3;border:7px solid #3b2a55;border-radius:38px 52px 34px 58px;transform:rotate(-1.2deg);color:#3b2a55;font-family:"Segoe Print","Comic Sans MS",cursive;font-weight:700;font-size:62px;line-height:1.25;text-align:center}}
#hook b{{color:#e08a2e;font-weight:800}}
#sub{{position:absolute;left:50%;margin-left:-450px;bottom:460px;width:900px;text-align:center;font-family:"Segoe Print","Comic Sans MS",cursive;font-weight:700;font-size:46px;line-height:1.3;color:#3b2a55;background:#f4efe3;border:4px solid #3b2a55;border-radius:30px 44px 26px 50px;padding:10px 24px;display:none;transform-origin:50% 100%}}
#endwash{{position:absolute;left:0;top:0;width:1080px;height:1920px;background:#f4efe3;opacity:0}}
#endcard{{position:absolute;left:510px;top:760px;width:840px;padding:36px 40px;background:#f4efe3;border:7px solid #3b2a55;border-radius:40px 56px 36px 60px;color:#3b2a55;font-family:"Segoe Print","Comic Sans MS",cursive;font-weight:700;font-size:56px;line-height:1.3;text-align:center;display:none;transform:translate(-50%,-50%) scale(.001)}}
#wm{{position:absolute;left:60px;bottom:80px;font-size:28px;font-weight:700;color:rgba(59,42,85,.45)}}
</style>
</head>
<body>
<div id="root" data-composition-id="main" data-start="0" data-duration="{dur}" data-width="1080" data-height="1920">
{scene_divs}<div id="ov" class="clip" data-start="0" data-duration="{dur}" data-track-index="10">
<img id="tooth" src="tooth.png"/>
<div id="vig"></div>
<div id="hook">{hook_text}</div>
<div id="sub"></div>
<div id="endwash"></div>
<div id="endcard">{end_text}</div>
<div id="wm">@dark.sky.quotes</div>
</div>
</div>
<svg width="0" height="0" style="position:absolute"><filter id="boil" x="-2%" y="-2%" width="104%" height="104%"><feTurbulence id="boilT" type="fractalNoise" baseFrequency="0.02" numOctaves="1" seed="1" result="n"/><feDisplacementMap in="SourceGraphic" in2="n" scale="7" xChannelSelector="R" yChannelSelector="G"/></filter></svg>
<script src="data.js"></script>
<script src="char.js"></script>
<script src="scenes.js"></script>
<script src="main.js"></script>
</body></html>"""
(HF / "index.html").write_text(html, encoding="utf-8")
print(f"index.html: {len(html)} bytes, {nscenes} scenes")
