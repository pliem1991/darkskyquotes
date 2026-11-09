"""Ghép các file đọc từng câu (audio/lines/*.wav) thành narration.wav, timeline.json và lines.json.

Mốc từng chữ lấy bằng Whisper (word timestamps) rồi gióng với chữ trong lời kể, chữ nào Whisper nghe sai thì nội suy
giữa hai mốc đã gióng. Từ đó ra mốc từng vế (tách theo dấu phẩy, chấm, hoặc theo "parts" ghi tay) và mốc cụm từ.
Khoảng lặng chèn thêm: "pause" sau câu, "inner_pauses" [{"after_part": i, "sec": s}] giữa hai vế. Không có nhạc nền.
Chạy: python tools/make_timeline_lines.py <voices.json>
"""
import difflib
import json
import re
import sys
import unicodedata
from pathlib import Path

import numpy as np
import soundfile as sf
from faster_whisper import WhisperModel

cfg_path = Path(sys.argv[1]).resolve()
EP = cfg_path.parent
cfg = json.loads(cfg_path.read_text(encoding="utf-8"))
SR = 48000
LEAD = float(cfg.get("lead_in", 0.12))
HOLD = 0.12
whisper = WhisperModel("small", device="cpu", compute_type="int8", cpu_threads=4)


def resample(x, sr):
    if sr == SR:
        return x
    n = int(len(x) * SR / sr)
    return np.interp(np.linspace(0, len(x) - 1, n), np.arange(len(x)), x).astype(np.float32)


def key(s):
    s = unicodedata.normalize("NFD", s.lower().replace("đ", "d"))
    return re.sub(r"[^a-z0-9]", "", "".join(c for c in s if unicodedata.category(c) != "Mn"))


def syllables(text):
    return [w for w in re.sub(r"[,.?!]", " ", text).split() if key(w)]


def split_parts(text):
    return [p.strip() for p in re.findall(r"[^,.]+[,.]?", text) if p.strip(" ,.")]


def speech_span(wav):
    env = np.convolve(np.abs(wav), np.ones(int(0.02 * SR)) / int(0.02 * SR), "same")
    idx = np.where(env > max(env.max() * 0.04, 1e-4))[0]
    return idx[0] / SR, idx[-1] / SR


def word_times(path, wav, text):
    """Thời gian bắt đầu, kết thúc của từng âm tiết trong lời kể (giây, tính trong file)."""
    segments, _ = whisper.transcribe(str(path), language="vi", beam_size=5, word_timestamps=True, condition_on_previous_text=False)
    heard = []
    for seg in segments:
        for w in seg.words:
            toks = [t for t in re.sub(r"[,.?!]", " ", w.word).split() if t]
            for j, t in enumerate(toks):
                a = w.start + (w.end - w.start) * j / len(toks)
                b = w.start + (w.end - w.start) * (j + 1) / len(toks)
                heard.append((key(t), a, b))
    syl = syllables(text)
    sk = [key(s) for s in syl]
    first, last = speech_span(wav)
    times = [None] * len(syl)
    matcher = difflib.SequenceMatcher(None, sk, [h[0] for h in heard], autojunk=False)
    for blk in matcher.get_matching_blocks():
        for k in range(blk.size):
            times[blk.a + k] = (heard[blk.b + k][1], heard[blk.b + k][2])
    # Nội suy các âm tiết chưa gióng được giữa hai mốc đã có.
    known = [i for i, t in enumerate(times) if t]
    if not known:
        step = (last - first) / len(syl)
        return syl, [(first + i * step, first + (i + 1) * step) for i in range(len(syl))]
    anchors = [(-1, (first, first))] + [(i, times[i]) for i in known] + [(len(syl), (last, last))]
    out = list(times)
    for (i0, t0), (i1, t1) in zip(anchors, anchors[1:]):
        gap = i1 - i0 - 1
        if gap <= 0:
            continue
        a, b = t0[1], t1[0]
        for g in range(gap):
            out[i0 + 1 + g] = (a + (b - a) * g / gap, a + (b - a) * (g + 1) / gap)
    return syl, out


timeline, lines_json, chunks = [], [], []
t = LEAD
chunks.append(np.zeros(int(LEAD * SR), np.float32))
for line in cfg["lines"]:
    path = EP / "audio" / "lines" / f"{line['file']}.wav"
    data, sr = sf.read(path, dtype="float32")
    if data.ndim > 1:
        data = data.mean(axis=1)
    wav = resample(data, sr)
    syl, st = word_times(path, wav, line["text"])
    parts = line.get("parts") or split_parts(line["text"])
    # Gán âm tiết cho từng vế theo số âm tiết.
    counts = [len(syllables(p)) for p in parts]
    if sum(counts) != len(syl):
        raise SystemExit(f"{line['file']}: số âm tiết của các vế ({sum(counts)}) khác lời ({len(syl)})")
    bounds, i = [], 0
    for c in counts:
        bounds.append((i, i + c - 1))
        i += c
    pauses = {p["after_part"]: p["sec"] for p in line.get("inner_pauses", [])}
    # Cắt file tại giữa khoảng lặng giữa hai vế, chèn lặng nếu có.
    cut = [0]
    for k in range(len(parts) - 1):
        gap_a, gap_b = st[bounds[k][1]][1], st[bounds[k + 1][0]][0]
        cut.append(int(max((gap_a + gap_b) / 2, gap_a) * SR))
    cut.append(len(wav))
    shift = 0.0
    entry = {"text": line["text"], "scene": line["scene"], "start": 0.0, "end": 0.0, "parts": [], "syl": []}
    for k, p in enumerate(parts):
        seg = wav[cut[k] : cut[k + 1]]
        offset = t + shift  # giây trên timeline ứng với mốc 0 của file, sau khi đã dời theo lặng chèn
        s0, e0 = st[bounds[k][0]][0], st[bounds[k][1]][1]
        entry["parts"].append({"text": p, "start": round(offset + s0, 3), "end": round(offset + min(e0 + HOLD, cut[k + 1] / SR), 3)})
        for j in range(bounds[k][0], bounds[k][1] + 1):
            entry["syl"].append({"w": syl[j], "s": round(offset + st[j][0], 3), "e": round(offset + st[j][1], 3)})
        chunks.append(seg)
        if k in pauses:
            chunks.append(np.zeros(int(pauses[k] * SR), np.float32))
            shift += pauses[k]
    entry["start"] = round(t + speech_span(wav)[0], 3)
    entry["end"] = round(t + shift + len(wav) / SR, 3)
    entry["parts"][0]["start"] = max(entry["parts"][0]["start"], entry["start"])
    timeline.append(entry)
    lines_json.append({"text": "|".join(parts), "scene": line["scene"]})
    gap = np.zeros(int(line.get("pause", 0.45) * SR), np.float32)
    chunks.append(gap)
    t += shift + len(wav) / SR + line.get("pause", 0.45)
audio = np.concatenate(chunks)
sf.write(EP / "audio" / "narration.wav", audio, SR)
(EP / "audio" / "timeline.json").write_text(json.dumps({"duration": round(len(audio) / SR, 3), "lines": timeline}, ensure_ascii=False, indent=1), encoding="utf-8")
(EP / "lines.json").write_text(json.dumps({"lines": lines_json}, ensure_ascii=False, indent=1), encoding="utf-8")
print("duration", len(audio) / SR)
for e in timeline:
    print(e["scene"], e["start"], e["end"])
    for p in e["parts"]:
        print("   ", p["start"], p["end"], p["text"])
