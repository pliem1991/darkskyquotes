"""Đọc từng dòng lời thành một file âm thanh riêng, mỗi nhân vật một giọng VieNeu. Dùng cho phim ngắn nhiều giọng.

Cách dùng:
  python make_voice_lines.py episodes/.../tap-01/voices.json [--only c7_ma,c7_minh] [--takes 5] [--alt B]
voices.json: {"voices": {"minh": {"preset": "Thái Sơn", "pitch": 1.0, "tempo": 1.0}, ...},
              "alt": {"B": {"minh": {...}}},
              "lines": [{"file": "c7_ma", "voice": "ma", "text": "...", "tempo": 0.95}]}
Mỗi dòng chọn bản đọc có điểm Whisper cao nhất, lưu ở audio/lines/<file>.wav (hoặc <file>_<alt>.wav khi có --alt).
"""
import sys; sys.path.insert(0, "E:/Tiktok/darkskyquotes/tools")
import lowload  # noqa: F401

import argparse
import difflib
import json
import re
import shutil
import subprocess
import tempfile
from pathlib import Path

import numpy as np
import soundfile as sf

parser = argparse.ArgumentParser()
parser.add_argument("config", type=Path)
parser.add_argument("--only")
parser.add_argument("--takes", type=int, default=5)
parser.add_argument("--alt")
args = parser.parse_args()

ROOT = Path("E:/Tiktok/darkskyquotes")
infer = json.loads((ROOT / "voices" / "voice_config.json").read_text(encoding="utf-8"))["infer"]
cfg = json.loads(args.config.read_text(encoding="utf-8"))
voices = dict(cfg["voices"])
if args.alt:
    voices.update(cfg["alt"][args.alt])
out_dir = args.config.parent / "audio" / "lines"
out_dir.mkdir(parents=True, exist_ok=True)
SR = 48000


def norm(text):
    return re.sub(r"[^\w ]", "", text.lower()).split()


def trimmed(audio):
    loud = np.flatnonzero(np.abs(audio) > np.abs(audio).max() * 0.02)
    return audio[max(loud[0] - int(0.03 * SR), 0) : loud[-1] + int(0.12 * SR)]


import vieneu
from faster_whisper import WhisperModel

tts = vieneu.Vieneu()
whisper = WhisperModel("medium", device="cpu", compute_type="int8", cpu_threads=4)
wanted = set(args.only.split(",")) if args.only else None
report = []
for line in cfg["lines"]:
    if wanted and line["file"] not in wanted:
        continue
    v = voices[line["voice"]]
    voice = tts.get_preset_voice(v["preset"])
    best = None
    with tempfile.TemporaryDirectory() as tmp:
        for take in range(args.takes):
            path = Path(tmp) / f"t{take}.wav"
            tts.save(tts.infer(line["text"], voice=voice, **infer), path)
            segments, _ = whisper.transcribe(str(path), language="vi", beam_size=5, condition_on_previous_text=False, initial_prompt="Ghé tiệm bánh mì, túi xách, trong ví, Zalo, chịu thua")
            heard = " ".join(s.text for s in segments).strip()
            ratio = difflib.SequenceMatcher(None, norm(line["text"]), norm(heard)).ratio()
            KEY = {"c6_duyen": "sờ vô túi xách", "c3_duyen": "ghé tiệm"}.get(line["file"], "")
            if KEY and KEY in heard.lower():
                ratio += 1.0
            print(f"{line['file']} take{take} {ratio:.2f} {heard}", flush=True)
            if best is None or ratio > best[0]:
                best = (ratio, heard)
                shutil.copy(path, Path(tmp) / "best.wav")
            if ratio >= 1.8:
                break
        tempo, pitch = v.get("tempo", 1.0) * line.get("tempo", 1.0), v.get("pitch", 1.0)
        raw = Path(tmp) / "raw.wav"
        af = f"rubberband=tempo={tempo}:pitch={pitch}:formant=preserved," + v.get("af", "highpass=f=60,acompressor=threshold=-22dB:ratio=2:attack=15:release=200:makeup=2,loudnorm=I=-15:TP=-1.5:LRA=9")
        subprocess.run(["ffmpeg", "-y", "-v", "error", "-i", str(Path(tmp) / "best.wav"), "-af", af, "-ar", str(SR), str(raw)], check=True)
        audio, _ = sf.read(raw, dtype="float32")
        name = line["file"] + (f"_{args.alt}" if args.alt else "")
        sf.write(out_dir / f"{name}.wav", trimmed(audio), SR)
    report.append({"file": name, "voice": v["preset"], "score": round(best[0], 3), "heard": best[1], "seconds": round(len(trimmed(audio)) / SR, 2)})
(out_dir / ("report" + (f"_{args.alt}" if args.alt else "") + ".json")).write_text(json.dumps(report, ensure_ascii=False, indent=1), encoding="utf-8")
print(json.dumps(report, ensure_ascii=False, indent=1))
