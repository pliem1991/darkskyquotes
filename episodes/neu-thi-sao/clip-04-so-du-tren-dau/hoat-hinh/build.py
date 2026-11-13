"""Build data.js + index.html cho clip 4 từ timeline.json."""
import json, math, struct, wave
from pathlib import Path
import numpy as np

ROOT = Path(__file__).resolve().parent
HF = ROOT / "hf"
TL = json.loads((ROOT / "audio" / "timeline.json").read_text(encoding="utf-8"))
lines_raw = json.loads((ROOT / "lines.json").read_text(encoding="utf-8"))

# --- Audio envelope cho mouth sync ---
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

# --- Build lines data ---
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

pings = []
for i, ln in enumerate(TL["lines"]):
    for w in ln.get("syl", []):
        if any(k in w["w"].lower() for k in ["tỷ", "triệu", "ngàn", "trăm"]):
            pings.append(round(w["s"], 3))

data_js = f"window.DATA={json.dumps({'dur':round(dur,3),'endT':endT,'lines':lines,'env':env,'pings':pings},ensure_ascii=False)};"
(HF / "data.js").write_text(data_js, encoding="utf-8")
print(f"data.js: {len(data_js)} bytes, dur={dur:.1f}s, {len(lines)} lines, {len(env)} env frames")

# meta.json for audio.py
meta = {
    "dur": round(dur, 3),
    "endT": endT,
    "pings": pings,
    "lines": [(l["s"], l["e"]) for l in lines],
    "syl": [[s["s"] for s in l["syl"]] for l in lines],
}
(ROOT / "audio" / "meta.json").write_text(json.dumps(meta), encoding="utf-8")
print(f"meta.json: {len(lines)} lines")

# --- index.html ---
nscenes = len(lines)
B = [l["s"] for l in lines]
scene_divs = ""
for i in range(nscenes):
    start = 0 if i == 0 else B[i] - 0.6
    end = dur if i == nscenes - 1 else B[i + 1] + 0.2
    scene_divs += f'<div id="scene{i}" class="clip" data-start="{start:.3f}" data-duration="{end - start:.3f}" data-track-index="{i + 1}"><div class="sc" id="sc{i}"></div></div>\n'

hook_text = "Nếu trên đầu mỗi người hiện số dư, <b>bạn sẽ nhìn ai trước?</b>"
end_text = "Bạn muốn giấu số dư của mình khỏi ai nhất?"

html = f"""<!doctype html>
<html lang="vi" data-resolution="portrait">
<head>
<meta charset="UTF-8"/>
<meta name="viewport" content="width=1080, height=1920"/>
<title>Neu thi sao clip 4</title>
<script src="gsap.min.js"></script>
<style>
*{{margin:0;padding:0;box-sizing:border-box}}
html,body{{margin:0;width:1080px;height:1920px;overflow:hidden;background:#1a1228}}
body{{font-family:"Segoe UI",Arial,sans-serif}}
#root{{position:relative;width:1080px;height:1920px;overflow:hidden;background:#1a1228}}
.clip{{position:absolute;left:0;top:0;width:1080px;height:1920px}}
.sc{{position:absolute;left:0;top:0;width:1080px;height:1920px;overflow:hidden}}
.tcard{{position:absolute;left:60px;top:230px;background:#2a2033;color:#ffd35c;font-weight:800;font-size:72px;line-height:1;padding:18px 40px;border-radius:30px;transform-origin:0 0;letter-spacing:2px;box-shadow:0 8px 0 rgba(42,32,51,.18)}}
#hook{{position:absolute;left:60px;top:220px;width:960px;padding:34px 40px 40px;background:#fff;border:8px solid #2a2033;border-radius:44px;box-shadow:0 12px 0 rgba(42,32,51,.2);color:#2a2033;font-weight:800;font-size:72px;line-height:1.14;text-align:center}}
#hook b{{color:#e0588a;font-weight:800}}
#sub{{position:absolute;left:50%;margin-left:-460px;bottom:460px;width:920px;text-align:center;font-weight:700;font-size:48px;line-height:1.15;color:#fff;background:rgba(42,32,51,.88);border-radius:28px;padding:12px 24px;display:none;transform-origin:50% 100%}}
#endwash{{position:absolute;left:0;top:0;width:1080px;height:1920px;background:#1a1228;opacity:0}}
#endcard{{position:absolute;left:495px;top:760px;width:870px;padding:40px 44px;background:#2a2033;border-radius:48px;color:#ffd35c;font-weight:800;font-size:56px;line-height:1.18;text-align:center;display:none;transform:translate(-50%,-50%) scale(.001)}}
#wm{{position:absolute;left:60px;bottom:80px;font-size:28px;font-weight:700;color:rgba(255,255,255,.35)}}
</style>
</head>
<body>
<div id="root" data-composition-id="main" data-start="0" data-duration="{dur}" data-width="1080" data-height="1920">
{scene_divs}<div id="ov" class="clip" data-start="0" data-duration="{dur}" data-track-index="10">
<div id="hook">{hook_text}</div>
<div id="sub"></div>
<div id="endwash"></div>
<div id="endcard">{end_text}</div>
<div id="wm">@dark.sky.quotes</div>
</div>
</div>
<script src="data.js"></script>
<script src="char.js"></script>
<script src="scenes.js"></script>
<script src="main.js"></script>
</body></html>"""
(HF / "index.html").write_text(html, encoding="utf-8")
print(f"index.html: {len(html)} bytes, {nscenes} scenes")
