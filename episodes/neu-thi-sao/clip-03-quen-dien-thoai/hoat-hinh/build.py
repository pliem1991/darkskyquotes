import json
import numpy as np
import soundfile as sf
from pathlib import Path

H = Path(__file__).parent
tl = json.loads((H / "audio/timeline.json").read_text(encoding="utf-8"))
FPS = 30
lines = []
for l in tl["lines"]:
    lines.append({"s": l["start"], "e": l["end"],
                  "parts": [{"t": p["text"], "s": p["start"], "e": p["end"]} for p in l["parts"]],
                  "syl": [{"w": s["w"], "s": s["s"], "e": s["e"]} for s in l["syl"]]})
endT = lines[-1]["e"] + 1.5
dur = round(endT + 2.7, 3)
y, sr = sf.read(H / "audio/narration.wav", dtype="float32")
if y.ndim > 1:
    y = y.mean(1)
n = int(dur * FPS) + 3
win = int(sr / FPS)
env = []
for i in range(n):
    c = int((i / FPS) * sr)
    seg = y[max(0, c - win // 2): c + win // 2]
    env.append(float(np.sqrt(np.mean(seg ** 2))) if len(seg) else 0.0)
env = np.array(env)
ref = np.percentile(env[env > 0.003], 90) if (env > 0.003).any() else 1
env = np.clip(env / ref, 0, 1.2)
env = np.convolve(env, [0.25, 0.5, 0.25], mode="same")
t0 = lines[6]["syl"][2]["s"]
t1 = lines[6]["e"] + 0.9
NB = 30
pings = [round(t0 + (t1 - t0) * ((k / (NB - 1)) ** 0.8), 3) for k in range(NB)]
data = {"dur": dur, "endT": round(endT, 3), "lines": lines, "env": [round(float(v), 3) for v in env], "pings": pings}
(H / "hf/data.js").write_text("window.DATA = " + json.dumps(data, ensure_ascii=False) + ";", encoding="utf-8")
json.dump({"dur": dur, "endT": endT, "pings": pings, "lines": [(l["s"], l["e"]) for l in lines],
           "syl": [[(s["s"]) for s in l["syl"]] for l in lines]}, open(H / "audio/meta.json", "w"))
B = [l["s"] for l in lines]
scenes = ""
for i in range(7):
    start = 0 if i == 0 else B[i] - 0.6
    end = dur if i == 6 else B[i + 1] + 0.2
    scenes += f'<div id="scene{i}" class="clip" data-start="{start:.3f}" data-duration="{end - start:.3f}" data-track-index="{i + 1}"><div class="sc" id="sc{i}"></div></div>\n'
html = f'''<!doctype html>
<html lang="vi" data-resolution="portrait">
<head>
<meta charset="UTF-8" />
<meta name="viewport" content="width=1080, height=1920" />
<title>Neu thi sao clip 3 hoat hinh</title>
<script src="gsap.min.js"></script>
<style>
*{{margin:0;padding:0;box-sizing:border-box}}
html,body{{margin:0;width:1080px;height:1920px;overflow:hidden;background:#fff0d6}}
body{{font-family:"Segoe UI",Arial,sans-serif}}
#root{{position:relative;width:1080px;height:1920px;overflow:hidden;background:#fff0d6}}
.clip{{position:absolute;left:0;top:0;width:1080px;height:1920px}}
.sc{{position:absolute;left:0;top:0;width:1080px;height:1920px;overflow:hidden}}
.shade{{position:absolute;left:0;top:1300px;width:1080px;height:620px;background:linear-gradient(rgba(42,32,51,0),rgba(42,32,51,.16))}}
.tcard{{position:absolute;left:60px;top:230px;background:#2a2033;color:#fff;font-weight:800;font-size:84px;line-height:1;padding:18px 40px;border-radius:30px;transform-origin:0 0;letter-spacing:2px;box-shadow:0 8px 0 rgba(42,32,51,.18)}}
#hook{{position:absolute;left:60px;top:215px;width:870px;padding:34px 40px 40px;background:#fff;border:8px solid #2a2033;border-radius:44px;box-shadow:0 12px 0 rgba(42,32,51,.2);color:#2a2033;font-weight:800;font-size:84px;line-height:1.14;text-align:center}}
#hook b{{color:#e0588a;font-weight:800}}
#sub{{position:absolute;left:50%;margin-left:-430px;bottom:524px;width:860px;text-align:center;font-weight:700;font-size:48px;line-height:1.15;color:#fff;background:rgba(42,32,51,.88);border-radius:28px;padding:12px 24px;display:none;transform-origin:50% 100%}}
#endwash{{position:absolute;left:0;top:0;width:1080px;height:1920px;background:#fff7ec;opacity:0}}
#endcard{{position:absolute;left:495px;top:760px;width:870px;padding:40px 44px;background:#2a2033;border-radius:48px;color:#fff;font-weight:800;font-size:76px;line-height:1.18;text-align:center;display:none;transform:translate(-50%,-50%) scale(.001)}}
#endcard b{{color:#ffd35c;font-weight:800}}
#wm{{position:absolute;left:60px;top:1404px;font-size:28px;font-weight:700;color:#2a2033;opacity:.5;text-shadow:0 0 6px rgba(255,255,255,.8)}}
</style>
</head>
<body>
<div id="root" data-composition-id="main" data-start="0" data-duration="{dur}" data-width="1080" data-height="1920">
{scenes}<div id="ov" class="clip" data-start="0" data-duration="{dur}" data-track-index="10">
<div id="hook">Quên điện thoại 1 ngày, <b>bạn trụ tới mấy giờ?</b></div>
<div id="sub"></div>
<div id="endwash"></div>
<div id="endcard">Bạn thuộc lòng số điện thoại của <b>mấy người?</b></div>
<div id="wm">@dark.sky.quotes</div>
</div>
</div>
<script src="data.js"></script>
<script src="char.js"></script>
<script src="scenes.js"></script>
<script src="main.js"></script>
</body>
</html>'''
(H / "hf/index.html").write_text(html, encoding="utf-8")
print("dur", dur, "endT", endT)
