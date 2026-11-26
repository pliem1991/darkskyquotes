"""Nhạc nền + hiệu ứng tổng hợp bằng numpy, trộn với giọng, chuẩn -15 LUFS."""
import sys; from pathlib import Path as _P; sys.path.insert(0, str(_P(__file__).resolve().parents[4] / "tools"))
import lowload  # noqa: F401
import json
import subprocess
import numpy as np
import soundfile as sf
from pathlib import Path
import sfx as SFX

H = Path(__file__).parent
A = H / "audio"
SR = 48000
meta = json.loads((A / "meta.json").read_text())
DUR = meta["dur"]
N = int(DUR * SR)
rs = np.random.RandomState(9)


def add_mono(buf, sig, t):
    i = int(t * SR)
    if i >= len(buf) or i < 0:
        return
    j = min(len(buf), i + len(sig))
    buf[i:j] += sig[: j - i]


def env_ad(n, a=0.005, d=0.2):
    t = np.arange(n) / SR
    return np.minimum(t / a, 1) * np.exp(-t / d)


def pluck(freq, dur=0.5, bright=0.5):
    n = int(dur * SR)
    t = np.arange(n) / SR
    s = np.sin(2 * np.pi * freq * t) + 0.3 * bright * np.sin(4 * np.pi * freq * t) + 0.15 * bright * np.sin(6 * np.pi * freq * t)
    return s * env_ad(n, 0.004, dur / 3.0)


# ---------- nhạc nền (Dm - Bb - F - C, hơi buồn, nghĩ ngợi) ----------
bpm = 72
beat = 60 / bpm
chords = [
    ("Dm", [293.66, 349.23, 440.0], 146.83),
    ("Bb", [233.08, 293.66, 349.23], 116.54),
    ("F",  [174.61, 220.0, 261.63], 87.31),
    ("C",  [261.63, 329.63, 392.0], 130.81),
]
music = np.zeros(N)
nb = int(DUR / beat) + 4
for b in range(nb):
    t = b * beat
    bar = (b // 4) % 4
    name, tri, bass = chords[bar]
    if b % 4 == 0:
        add_mono(music, 0.35 * pluck(bass * 2, 1.0, 0.12), t)
    for k in range(2):
        idx = (b * 2 + k) % 4
        f = [tri[0] * 2, tri[1] * 2, tri[2] * 2, tri[1] * 4][idx]
        add_mono(music, 0.25 * pluck(f, 0.6, 0.35), t + k * beat / 2)
fi = int(1.0 * SR)
music[:fi] *= np.linspace(0, 1, fi)
fo = int(3.0 * SR)
music[-fo:] *= np.linspace(1, 0, fo)
music = music / (np.abs(music).max() + 1e-9)

# ---------- hiệu ứng (dùng tools/sfx.py) ----------
sfx_buf = np.zeros((N, 2))
lines = meta["lines"]
syl = meta["syl"]

def S(li, si):
    row = syl[li]
    return row[min(si, len(row) - 1)]

# chuyển cảnh
for i in range(1, len(lines)):
    SFX.add(sfx_buf, SFX.whoosh(0.5, 0.3), lines[i][0] - 0.5, 0.3)

# cảnh 1: thẻ 6:30, kim quay ngược (tích tắc), thẻ 22:30
SFX.add(sfx_buf, SFX.pop(0.4), S(1, 2), 0.3)
r0, r1 = S(1, 8), max(S(1, 13), S(1, 8) + 0.8)
k = 0
tt = r0
while tt < r1:
    SFX.add(sfx_buf, SFX.click(1.6 if k % 2 else 1.3, 0.25), tt, 0.18)
    tt += 0.11
    k += 1
SFX.add(sfx_buf, SFX.pop(0.5), S(1, 13), 0.35)

# cảnh 2: tiếng xe ù ù khi kẹt xe, thẻ 19:00
SFX.add(sfx_buf, SFX.rumble(max(1.0, lines[2][1] - lines[2][0]), 0.35), lines[2][0], 0.22)
SFX.add(sfx_buf, SFX.pop(0.4), S(2, 0), 0.25)
SFX.add(sfx_buf, SFX.pop(0.5), S(2, 9), 0.3)

# cảnh 3: mỗi việc nhà một tiếng pop, 21:00 một tiếng ding
for si in (0, 2, 4, 6, 7):
    SFX.add(sfx_buf, SFX.pop(0.35), S(3, si), 0.25)
SFX.add(sfx_buf, SFX.ding(0.5), S(3, 13), 0.3)

# cảnh 4: 1 tiếng 30, hai lần bị ăn bớt, còn ~1 tiếng
SFX.add(sfx_buf, SFX.pop(0.4), S(4, 3), 0.3)
SFX.add(sfx_buf, SFX.click(0.7, 0.4), S(4, 6), 0.25)
SFX.add(sfx_buf, SFX.click(0.7, 0.4), S(4, 10), 0.25)
SFX.add(sfx_buf, SFX.pop(0.5), S(4, 16), 0.35)

# cảnh 5: lướt điện thoại (gõ nhẹ thưa), bấm tắt máy, đồng hồ 00:52
tt = S(5, 7) + 0.2
while tt < S(5, 14) - 0.15:
    SFX.add(sfx_buf, SFX.click(2.0, 0.15), tt, 0.1)
    tt += 0.42
SFX.add(sfx_buf, SFX.click(0.9, 0.6), S(5, 14), 0.3)
SFX.add(sfx_buf, SFX.thump(0.5), S(5, 18), 0.35)

# cảnh 6: gạch 8 tiếng, hiện 5 tiếng 30
SFX.add(sfx_buf, SFX.click(0.6, 0.5), S(6, 3), 0.25)
SFX.add(sfx_buf, SFX.thump(0.5), S(6, 5), 0.4)

# thẻ kết
SFX.add(sfx_buf, SFX.pop(0.5), meta["endT"], 0.45)

sfx_mono = sfx_buf.mean(axis=1)
sfx_mono = sfx_mono / (np.abs(sfx_mono).max() + 1e-9)

# ---------- giọng ----------
v, sr = sf.read(A / "narration.wav", dtype="float64")
if v.ndim > 1:
    v = v.mean(1)
if sr != SR:
    v = np.interp(np.linspace(0, len(v) - 1, int(len(v) * SR / sr)), np.arange(len(v)), v)
voice = np.zeros(N)
voice[: min(N, len(v))] = v[:N]


def wavout(name, x):
    sf.write(A / name, np.stack([x, x], 1).astype("float32"), SR)


wavout("music_hh.wav", music)
wavout("sfx_hh.wav", sfx_mono)
wavout("voice_hh.wav", voice)

cmd = [
    "ffmpeg", "-y", "-v", "error",
    "-i", str(A / "voice_hh.wav"), "-i", str(A / "music_hh.wav"), "-i", str(A / "sfx_hh.wav"),
    "-filter_complex",
    "[1:a]highpass=f=140,loudnorm=I=-28:TP=-3:LRA=7[m0];[2:a]loudnorm=I=-27:TP=-3:LRA=7[x];"
    "[0:a]asplit=2[v1][v2];[m0][v1]sidechaincompress=threshold=0.03:ratio=4:attack=20:release=300[mduck];"
    "[v2][mduck][x]amix=inputs=3:normalize=0:duration=longest,loudnorm=I=-15:TP=-1.5:LRA=9[o]",
    "-map", "[o]", "-ar", "48000", "-t", str(DUR), str(A / "mix.wav"),
]
subprocess.run(cmd, check=True)
print("mix ok", DUR)
