"""Tạo lời đọc theo từng câu: đọc nhiều lần, dùng Whisper chọn bản khớp chữ nhất, ghép và xuất timeline.

Câu đã có bản đọc được giữ trong audio/takes, nên sửa một câu chỉ phải tạo lại đúng câu đó.

Cách dùng: python make_voice.py episodes/001-anh-sao/lines.json [--takes 3]
lines.json: {"lines": [{"text": "vế một|vế hai", "gaps": [0.4], "scene": "...", "pause": 0.5}, ...]}
Dấu | tách câu thành các vế đọc riêng, gaps là khoảng dừng giữa các vế, pause là khoảng dừng sau cả câu.
"""
import lowload  # noqa: F401

import argparse
import difflib
import hashlib
import json
import re
import shutil
import subprocess
import tempfile
from pathlib import Path

import numpy as np
import soundfile as sf

parser = argparse.ArgumentParser()
parser.add_argument("lines", type=Path)
parser.add_argument("--takes", type=int, default=3)
args = parser.parse_args()

ROOT = Path(__file__).resolve().parent.parent
config = json.loads((ROOT / "voices" / "voice_config.json").read_text(encoding="utf-8"))
stretch, mastering = re.match(r"(rubberband=[^,]+),(.*)", config["ffmpeg_af"]).groups()

out_dir = args.lines.parent / "audio"
takes_dir = out_dir / "takes"
takes_dir.mkdir(parents=True, exist_ok=True)
lines = json.loads(args.lines.read_text(encoding="utf-8"))["lines"]
SR = 48000


def norm(text):
    return re.sub(r"[^\w ]", "", text.lower()).split()


def key_for(text):
    payload = json.dumps([config["voice"], config["infer"], text], ensure_ascii=False)
    return hashlib.sha1(payload.encode("utf-8")).hexdigest()[:16]


def trimmed(audio):
    """Cắt khoảng lặng thừa hai đầu để khoảng dừng đúng như đã đặt."""
    loud = np.flatnonzero(np.abs(audio) > np.abs(audio).max() * 0.02)
    return audio[max(loud[0] - int(0.03 * SR), 0) : loud[-1] + int(0.08 * SR)]


wanted = list(dict.fromkeys(part for line in lines for part in line["text"].split("|")))
missing = [text for text in wanted if not (takes_dir / f"{key_for(text)}.wav").exists()]
if missing:
    import vieneu
    from faster_whisper import WhisperModel

    tts = vieneu.Vieneu()
    voice = tts.get_preset_voice(config["voice"])
    whisper = WhisperModel("small", device="cpu", compute_type="int8", cpu_threads=4)

    def score(path, text):
        segments, _ = whisper.transcribe(str(path), language="vi", beam_size=5, condition_on_previous_text=False)
        heard = " ".join(s.text for s in segments)
        return difflib.SequenceMatcher(None, norm(text), norm(heard)).ratio(), heard.strip()

    with tempfile.TemporaryDirectory() as tmp:
        for text in missing:
            best = None
            for take in range(args.takes):
                path = Path(tmp) / f"t{take}.wav"
                tts.save(tts.infer(text, voice=voice, **config["infer"]), path)
                ratio, heard = score(path, text)
                print(f"take{take} {ratio:.2f} {heard}", flush=True)
                if best is None or ratio > best[0]:
                    best = (ratio, heard)
                    shutil.copy(path, Path(tmp) / "best.wav")
                if ratio >= 0.97:
                    break
            key = key_for(text)
            shutil.copy(Path(tmp) / "best.wav", takes_dir / f"{key}.wav")
            (takes_dir / f"{key}.json").write_text(
                json.dumps({"text": text, "score": round(best[0], 3), "heard": best[1]}, ensure_ascii=False),
                encoding="utf-8",
            )

timeline, parts = [], []
cursor = 0.0
with tempfile.TemporaryDirectory() as tmp:
    tmp = Path(tmp)
    for i, line in enumerate(lines):
        lead = line.get("lead", 0.0)
        parts.append(np.zeros(int(lead * SR), np.float32))
        cursor += lead
        said = []
        texts = line["text"].split("|")
        gaps = line.get("gaps", [])
        for j, text in enumerate(texts):
            key = key_for(text)
            info = json.loads((takes_dir / f"{key}.json").read_text(encoding="utf-8"))
            slow = tmp / f"{i}_{j}.wav"
            subprocess.run(
                ["ffmpeg", "-y", "-v", "error", "-i", str(takes_dir / f"{key}.wav"), "-af", stretch, "-ar", str(SR), str(slow)],
                check=True,
            )
            audio, _ = sf.read(slow, dtype="float32")
            audio = trimmed(audio)
            duration = len(audio) / SR
            said.append({"text": text, "start": round(cursor, 3), "end": round(cursor + duration, 3), "score": info["score"], "heard": info["heard"]})
            cursor += duration
            parts.append(audio)
            if j < len(texts) - 1:
                parts.append(np.zeros(int(gaps[j] * SR), np.float32))
                cursor += gaps[j]
        pause = line.get("pause", 0.5)
        parts.append(np.zeros(int(pause * SR), np.float32))
        timeline.append(
            {"text": line["text"], "scene": line["scene"], "start": said[0]["start"], "end": said[-1]["end"], "parts": said}
        )
        cursor += pause

    raw = tmp / "raw.wav"
    sf.write(raw, np.concatenate(parts), SR)
    subprocess.run(
        ["ffmpeg", "-y", "-v", "error", "-i", str(raw), "-af", mastering, "-ar", str(SR), str(out_dir / "narration.wav")],
        check=True,
    )

(out_dir / "timeline.json").write_text(
    json.dumps({"duration": round(cursor, 3), "lines": timeline}, ensure_ascii=False, indent=1), encoding="utf-8"
)
print(f"duration {cursor:.1f}s")
