"""Nhạc nền + hiệu ứng tổng hợp bằng numpy, trộn với giọng, chuẩn -15 LUFS."""
import json
import subprocess
import numpy as np
import soundfile as sf
from pathlib import Path

H = Path(__file__).parent
A = H / "audio"
SR = 48000
meta = json.loads((A / "meta.json").read_text())
DUR = meta["dur"]
N = int(DUR * SR)
rs = np.random.RandomState(7)


def add(buf, sig, t):
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


def bandpass(x, lo, hi):
    from scipy.signal import butter, sosfilt
    return sosfilt(butter(2, [lo, hi], btype="band", fs=SR, output="sos"), x)


# ---------- nhạc nền (Em - Am - Dm - G, chậm, nặng nề) ----------
bpm = 72
beat = 60 / bpm
chords = [
    ("Em", [164.81, 196.0, 246.94], 82.41),
    ("Am", [220.0, 261.63, 329.63], 110.0),
    ("Dm", [146.83, 174.61, 220.0], 73.42),
    ("G", [196.0, 246.94, 293.66], 98.0),
]
music = np.zeros(N)
nb = int(DUR / beat) + 4
for b in range(nb):
    t = b * beat
    bar = (b // 4) % 4
    name, tri, bass = chords[bar]
    if b % 4 == 0:
        add(music, 0.45 * pluck(bass * 2, 0.9, 0.15), t)
    for k in range(2):
        idx = (b * 2 + k) % 4
        f = [tri[0] * 2, tri[1] * 2, tri[2] * 2, tri[1] * 4][idx]
        add(music, 0.3 * pluck(f, 0.6, 0.4), t + k * beat / 2)
fi = int(1.0 * SR)
music[:fi] *= np.linspace(0, 1, fi)
fo = int(3.0 * SR)
music[-fo:] *= np.linspace(1, 0, fo)
music = music / (np.abs(music).max() + 1e-9)

# ---------- hiệu ứng ----------
sfx = np.zeros(N)


def whoosh(t, d=0.7):
    n = int(d * SR)
    x = rs.randn(n)
    tt = np.linspace(0, 1, n)
    from scipy.signal import butter, sosfilt
    out = np.zeros(n)
    parts = 12
    seg = n // parts
    for p in range(parts):
        fc = 400 + 3200 * np.sin(np.pi * (p + 0.5) / parts)
        sos = butter(2, [fc * 0.6, fc * 1.4], btype="band", fs=SR, output="sos")
        out[p * seg:(p + 1) * seg] = sosfilt(sos, x[p * seg:(p + 1) * seg])
    e = np.sin(np.pi * tt) ** 1.5
    add(sfx, 0.35 * out * e / (np.abs(out).max() + 1e-9), t)


def pop(t, f=520, gain=0.5):
    n = int(0.12 * SR)
    tt = np.arange(n) / SR
    add(sfx, gain * np.sin(2 * np.pi * (f + 500 * np.exp(-tt * 40)) * tt) * np.exp(-tt / 0.04), t)


def thud(t, gain=0.5):
    n = int(0.3 * SR)
    tt = np.arange(n) / SR
    s = np.sin(2 * np.pi * (60 + 20 * np.exp(-tt * 8)) * tt) * np.exp(-tt / 0.08)
    add(sfx, gain * s, t)


def calc_click(t, gain=0.15):
    n = int(0.04 * SR)
    x = rs.randn(n)
    s = bandpass(x, 2000, 6000) * env_ad(n, 0.001, 0.012)
    add(sfx, gain * s / (np.abs(s).max() + 1e-9), t)


def page_flip(t, gain=0.2):
    n = int(0.15 * SR)
    x = rs.randn(n)
    s = bandpass(x, 800, 4000) * env_ad(n, 0.005, 0.06)
    add(sfx, gain * s / (np.abs(s).max() + 1e-9), t)


def phone_off(t, gain=0.3):
    n = int(0.1 * SR)
    tt = np.arange(n) / SR
    s = np.sin(2 * np.pi * (80 + 40 * np.exp(-tt * 20)) * tt) * np.exp(-tt / 0.03)
    add(sfx, gain * s, t)


def phone_tap(t, gain=0.12):
    n = int(0.03 * SR)
    x = rs.randn(n)
    s = bandpass(x, 3000, 8000) * env_ad(n, 0.001, 0.008)
    add(sfx, gain * s / (np.abs(s).max() + 1e-9), t)


lines = meta["lines"]
syl = meta["syl"]

# scene transitions whoosh
for i in range(1, 6):
    whoosh(lines[i][0] - 0.6)

# scene 1 (c2): calculator clicks when numbers appear
calc_click(syl[1][0] + 0.1)
calc_click(syl[1][5] + 0.1)
calc_click(syl[1][10] + 0.1)

# scene 2 (c3): thud when price appears
thud(syl[2][8] if len(syl[2]) > 8 else lines[2][0] + 2.5, 0.45)

# scene 3 (c4): page flips during calendar, pop for "56 năm" and "84 tuổi"
for i in range(4):
    page_flip(syl[3][4] + i * 0.15 if len(syl[3]) > 4 else lines[3][0] + 1.5 + i * 0.15, 0.15)
pop(syl[3][4] if len(syl[3]) > 4 else lines[3][0] + 1.5, 600, 0.3)
thud(syl[3][8] if len(syl[3]) > 8 else lines[3][0] + 3.0, 0.4)

# scene 4 (c5): subtle reveal for chart labels
pop(syl[4][6] if len(syl[4]) > 6 else lines[4][0] + 2.0, 500, 0.25)
pop(syl[4][13] if len(syl[4]) > 13 else lines[4][0] + 4.0, 400, 0.2)

# scene 5 (c6): phone taps, off, on
for i in range(3):
    phone_tap(lines[5][0] + 0.3 + i * 0.4)
phone_off(syl[5][8] if len(syl[5]) > 8 else lines[5][0] + 2.5)
phone_tap(syl[5][11] if len(syl[5]) > 11 else lines[5][0] + 3.5)

# endcard
pop(meta["endT"], 700, 0.5)

sfx = sfx / (np.abs(sfx).max() + 1e-9)

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
wavout("sfx_hh.wav", sfx)
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
