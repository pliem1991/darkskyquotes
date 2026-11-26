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


def line_part_start(li, pi):
    tl = json.loads((A / "timeline.json").read_text(encoding="utf-8"))
    return tl["lines"][li]["parts"][pi]["start"]


def meow(d=0.5, f0=620):
    """Tiếng mèo kêu tổng hợp: cao độ lên rồi xuống, vài họa âm, rung nhẹ."""
    n = int(d * SR)
    tt = np.arange(n) / SR
    x = tt / d
    f = f0 * (0.8 + 0.55 * np.sin(np.pi * np.minimum(x * 1.15, 1.0))) * (1 + 0.015 * np.sin(2 * np.pi * 7 * tt))
    ph = 2 * np.pi * np.cumsum(f) / SR
    s = np.sin(ph) + 0.5 * np.sin(2 * ph) + 0.25 * np.sin(3 * ph) + 0.12 * np.sin(4 * ph)
    env = np.minimum(x / 0.08, 1) * np.minimum((1 - x) / 0.25, 1)
    return (s * np.clip(env, 0, 1)) / 1.9


def purr(d=2.0):
    n = int(d * SR)
    tt = np.arange(n) / SR
    am = 0.5 + 0.5 * np.sin(2 * np.pi * 24 * tt)
    s = (np.sin(2 * np.pi * 52 * tt) + 0.6 * np.sin(2 * np.pi * 104 * tt)) * am
    env = np.minimum(tt / 0.3, 1) * np.minimum((d - tt) / 0.5, 1)
    return s * env / 1.6


# chuyển cảnh
for i in range(1, len(lines)):
    SFX.add(sfx_buf, SFX.whoosh(0.5, 0.25), lines[i][0] - 0.5, 0.22)

# cảnh 0: ngòi bút sột soạt
tt = 0.15
while tt < lines[0][1]:
    SFX.add(sfx_buf, SFX.click(2.2, 0.12), tt, 0.06)
    tt += 0.14

# cảnh 1: cửa mở lúc tám giờ, tiếng mèo mừng, trái tim
SFX.add(sfx_buf, SFX.creak(0.6), S(1, 9), 0.25)
SFX.add(sfx_buf, meow(0.45, 700), S(1, 12), 0.22)
SFX.add(sfx_buf, SFX.pop(0.4), S(1, 18), 0.25)

# cảnh 2: ba tiếng meo nhỏ dần
k = S(2, 10)
for i, g in enumerate((0.32, 0.24, 0.17)):
    SFX.add(sfx_buf, meow(0.42, 640 - 30 * i), k + 0.5 * i, g)

# cảnh 3: cửa, mở nắp hộp, mèo kêu khẽ khi hết
SFX.add(sfx_buf, SFX.creak(0.5), lines[3][0] - 0.2, 0.2)
SFX.add(sfx_buf, SFX.pop(0.4), S(3, 8), 0.22)
SFX.add(sfx_buf, SFX.click(0.8, 0.5), S(3, 12), 0.22)
SFX.add(sfx_buf, meow(0.35, 520), S(3, 16), 0.16)

# cảnh 4: mèo nhảy lên ngực, gừ gừ
SFX.add(sfx_buf, SFX.thump(0.4, 90), S(4, 6) + 0.45, 0.25)
SFX.add(sfx_buf, purr(max(1.0, lines[4][1] - S(4, 6))), S(4, 6) + 0.5, 0.35)

# cảnh 5: tắt điện thoại, gừ gừ khi ôm
off = line_part_start(5, 1) - 0.1
SFX.add(sfx_buf, SFX.click(0.9, 0.5), off, 0.25)
SFX.add(sfx_buf, purr(max(1.5, lines[6][0] - off - 0.8)), off + 0.8, 0.3)

# cảnh 6: giọt nước rơi
SFX.add(sfx_buf, SFX.ding(0.3), S(6, 3) + 0.15, 0.1)

# thẻ kết
SFX.add(sfx_buf, SFX.pop(0.5), meta["endT"], 0.4)

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
