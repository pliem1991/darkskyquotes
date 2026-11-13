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
rs = np.random.RandomState(4)


def add(buf, sig, t):
    i = int(t * SR)
    if i >= len(buf) or i < 0:
        return
    j = min(len(buf), i + len(sig))
    buf[i:j] += sig[: j - i]


def env_ad(n, a=0.005, d=0.2):
    t = np.arange(n) / SR
    return np.minimum(t / a, 1) * np.exp(-t / d)


def pluck(freq, dur=0.5, bright=1.0):
    n = int(dur * SR)
    t = np.arange(n) / SR
    s = np.sin(2 * np.pi * freq * t) + 0.5 * bright * np.sin(4 * np.pi * freq * t) + 0.25 * bright * np.sin(6 * np.pi * freq * t)
    return s * env_ad(n, 0.004, dur / 3.2)


def lowpass(x, fc):
    from scipy.signal import butter, sosfilt
    return sosfilt(butter(2, fc, btype="low", fs=SR, output="sos"), x)


def bandpass(x, lo, hi):
    from scipy.signal import butter, sosfilt
    return sosfilt(butter(2, [lo, hi], btype="band", fs=SR, output="sos"), x)


# ---------- nhạc nền ----------
bpm = 120
beat = 60 / bpm
chords = [
    ("C", [261.63, 329.63, 392.0], 130.81),
    ("G", [196.0, 246.94, 293.66], 98.0),
    ("Am", [220.0, 261.63, 329.63], 110.0),
    ("F", [174.61, 220.0, 261.63], 87.31),
]
music = np.zeros(N)
nb = int(DUR / beat) + 4
for b in range(nb):
    t = b * beat
    bar = (b // 4) % 4
    name, tri, bass = chords[bar]
    if b % 2 == 0:
        add(music, 0.9 * pluck(bass * 2, 0.45, 0.4), t)
    for k in range(2):
        idx = (b * 2 + k) % 4
        f = [tri[0] * 2, tri[1] * 2, tri[2] * 2, tri[1] * 4][idx]
        add(music, 0.55 * pluck(f, 0.35, 1.0), t + k * beat / 2)
    n = int(0.05 * SR)
    hat = rs.randn(n) * env_ad(n, 0.001, 0.015)
    add(music, 0.18 * bandpass(hat, 6000, 12000), t + beat / 2)
    if b % 2 == 1:
        n2 = int(0.12 * SR)
        clap = bandpass(rs.randn(n2), 1200, 3500) * env_ad(n2, 0.002, 0.04)
        add(music, 0.35 * clap, t)
    if b % 2 == 0:
        n3 = int(0.18 * SR)
        tt = np.arange(n3) / SR
        kick = np.sin(2 * np.pi * (50 + 90 * np.exp(-tt * 30)) * tt) * np.exp(-tt * 18)
        add(music, 0.5 * kick, t)
fi = int(0.8 * SR)
music[:fi] *= np.linspace(0, 1, fi)
fo = int(2.0 * SR)
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
    add(sfx, 0.5 * out * e / (np.abs(out).max() + 1e-9), t)


def ting(t, f=1318.5, gain=0.6):
    n = int(0.5 * SR)
    tt = np.arange(n) / SR
    s = (np.sin(2 * np.pi * f * tt) + 0.4 * np.sin(2 * np.pi * f * 2 * tt)) * np.exp(-tt / 0.12)
    s2 = np.zeros(n)
    d = int(0.09 * SR)
    s2[d:] = (np.sin(2 * np.pi * f * 1.5 * tt[: n - d]) * np.exp(-tt[: n - d] / 0.12))
    add(sfx, gain * (s + s2), t)


def pop(t, f=520, gain=0.5):
    n = int(0.12 * SR)
    tt = np.arange(n) / SR
    add(sfx, gain * np.sin(2 * np.pi * (f + 500 * np.exp(-tt * 40)) * tt) * np.exp(-tt / 0.04), t)


def elevator_ding(t, gain=0.45):
    n = int(0.8 * SR)
    tt = np.arange(n) / SR
    f1, f2 = 880, 1108.73
    s = 0.6 * np.sin(2 * np.pi * f1 * tt) * np.exp(-tt / 0.25)
    s += 0.6 * np.sin(2 * np.pi * f2 * (tt - 0.15)) * np.exp(-(tt - 0.15) / 0.25) * (tt > 0.15)
    add(sfx, gain * s, t)


def crowd_murmur(t, d=2.0, gain=0.2):
    n = int(d * SR)
    x = rs.randn(n)
    s = bandpass(x, 200, 2400)
    tt = np.arange(n) / SR
    e = np.minimum(tt / 0.3, 1) * np.minimum((d - tt) / 0.3, 1)
    add(sfx, gain * s * e / (np.abs(s).max() + 1e-9), t)


def crickets(t, d=3.0, gain=0.15):
    n = int(d * SR)
    tt = np.arange(n) / SR
    chirp_f = 4200 + rs.randn(n) * 200
    s = np.sin(2 * np.pi * chirp_f * tt / SR * np.cumsum(np.ones(n)))
    pulse = (np.sin(2 * np.pi * 8 * tt) > 0.3).astype(float)
    e = np.minimum(tt / 0.5, 1) * np.minimum((d - tt) / 0.5, 1)
    add(sfx, gain * s * pulse * e, t)


def glass_clink(t, gain=0.35):
    n = int(0.3 * SR)
    tt = np.arange(n) / SR
    s = np.sin(2 * np.pi * 2400 * tt) * np.exp(-tt / 0.05) + 0.3 * np.sin(2 * np.pi * 3800 * tt) * np.exp(-tt / 0.03)
    add(sfx, gain * s, t)


lines = meta["lines"]
syl = meta["syl"]

# chuyển cảnh whoosh
for i in range(1, 6):
    whoosh(lines[i][0] - 0.6)

# cảnh 1: pop khi khung số hiện
pop(lines[0][0] + 0.3, 600, 0.35)
pop(lines[0][0] + 0.6, 500, 0.35)
pop(lines[0][0] + 0.9, 700, 0.35)

# cảnh 2: thang máy ding + pop khung số sếp
elevator_ding(lines[1][0] + 0.1)
pop(lines[1][0] + 0.8, 650, 0.4)

# cảnh 3: rì rào quán, pop khung số
crowd_murmur(lines[2][0], 2.5, 0.15)
pop(syl[2][7] if len(syl[2]) > 7 else lines[2][0] + 1.0, 550, 0.4)

# cảnh 4: glass clink + pop
glass_clink(lines[3][0] + 0.3)
glass_clink(lines[3][0] + 0.6)

# cảnh 5: dế đồng quê, pop khung số má
crickets(lines[4][0], 4.0, 0.12)
pop(lines[4][0] + 0.4, 450, 0.4)

# cảnh 6: pop cho chữ "2 triệu × 10 tháng"
pop(syl[5][3] if len(syl[5]) > 3 else lines[5][0] + 0.5, 700, 0.45)

# thẻ giờ pop
for i in [1, 2, 3, 4]:
    pop(lines[i][0] + 0.05, 800, 0.3)

# chữ kết
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
    "[1:a]highpass=f=140,loudnorm=I=-26:TP=-3:LRA=7[m0];[2:a]loudnorm=I=-27:TP=-3:LRA=7[x];"
    "[0:a]asplit=2[v1][v2];[m0][v1]sidechaincompress=threshold=0.03:ratio=4:attack=20:release=300[mduck];"
    "[v2][mduck][x]amix=inputs=3:normalize=0:duration=longest,loudnorm=I=-15:TP=-1.5:LRA=9[o]",
    "-map", "[o]", "-ar", "48000", "-t", str(DUR), str(A / "mix.wav"),
]
subprocess.run(cmd, check=True)
print("mix ok", DUR)
