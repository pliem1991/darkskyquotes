"""Nhạc nền + hiệu ứng tổng hợp bằng numpy, trộn với giọng, chuẩn -15 LUFS."""
import sys; sys.path.insert(0, "E:/Tiktok/darkskyquotes/tools")
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

# scene transitions whoosh
for i in range(1, 6):
    SFX.add(sfx_buf, SFX.whoosh(0.5, 0.3), lines[i][0] - 0.5, 0.35)

# scene 1 (c2): pop khi "100k / ngày" xuất hiện, pop khi "× 365"
SFX.add(sfx_buf, SFX.pop(0.3), syl[1][0], 0.25)
SFX.add(sfx_buf, SFX.pop(0.4), syl[1][14], 0.3)
SFX.add(sfx_buf, SFX.pop(0.5), syl[1][16], 0.4)

# scene 2 (c3): pop cho "× 10 năm", thump cho "365 triệu"
SFX.add(sfx_buf, SFX.pop(0.3), syl[2][0], 0.25)
SFX.add(sfx_buf, SFX.thump(0.5), syl[2][6], 0.4)

# scene 3 (c4): whoosh nhẹ khi lạm phát, pop khi số mới
SFX.add(sfx_buf, SFX.click(0.8, 0.3), syl[3][8], 0.2)
SFX.add(sfx_buf, SFX.pop(0.4), syl[3][18], 0.35)

# scene 4 (c5): pop khi "240 triệu", click khi gạch bỏ từng món
SFX.add(sfx_buf, SFX.pop(0.4), syl[4][0], 0.3)
SFX.add(sfx_buf, SFX.click(0.5, 0.2), syl[4][7], 0.2)
SFX.add(sfx_buf, SFX.click(0.5, 0.2), syl[4][10], 0.2)
SFX.add(sfx_buf, SFX.click(0.5, 0.2), syl[4][13], 0.2)

# scene 5 (c6): subtle rumble (mưa xa)
rain_start = lines[5][0]
SFX.add(sfx_buf, SFX.rumble(4.0, 0.3), rain_start, 0.2)

# endcard
SFX.add(sfx_buf, SFX.pop(0.5), meta["endT"], 0.5)

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
