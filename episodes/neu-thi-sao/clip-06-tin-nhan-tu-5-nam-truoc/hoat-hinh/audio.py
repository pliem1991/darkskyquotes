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
rs = np.random.RandomState(6)


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


# ---------- nhạc nền (Am - Em - F - C, chậm, thân mật) ----------
bpm = 80
beat = 60 / bpm
chords = [
    ("Am", [220.0, 261.63, 329.63], 110.0),
    ("Em", [164.81, 196.0, 246.94], 82.41),
    ("F", [174.61, 220.0, 261.63], 87.31),
    ("C", [261.63, 329.63, 392.0], 130.81),
]
music = np.zeros(N)
nb = int(DUR / beat) + 4
for b in range(nb):
    t = b * beat
    bar = (b // 4) % 4
    name, tri, bass = chords[bar]
    if b % 4 == 0:
        add(music, 0.5 * pluck(bass * 2, 0.7, 0.2), t)
    for k in range(2):
        idx = (b * 2 + k) % 4
        f = [tri[0] * 2, tri[1] * 2, tri[2] * 2, tri[1] * 4][idx]
        add(music, 0.35 * pluck(f, 0.5, 0.5), t + k * beat / 2)
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
    add(sfx, 0.4 * out * e / (np.abs(out).max() + 1e-9), t)


def pop(t, f=520, gain=0.5):
    n = int(0.12 * SR)
    tt = np.arange(n) / SR
    add(sfx, gain * np.sin(2 * np.pi * (f + 500 * np.exp(-tt * 40)) * tt) * np.exp(-tt / 0.04), t)


def phone_notif(t, gain=0.4):
    n1 = int(0.08 * SR)
    n2 = int(0.08 * SR)
    gap = int(0.04 * SR)
    total = n1 + gap + n2
    s = np.zeros(total)
    tt1 = np.arange(n1) / SR
    s[:n1] = np.sin(2 * np.pi * 880 * tt1) * env_ad(n1, 0.002, 0.05)
    tt2 = np.arange(n2) / SR
    s[n1 + gap:] = np.sin(2 * np.pi * 1100 * tt2) * env_ad(n2, 0.002, 0.05)
    add(sfx, gain * s, t)


def typing_clicks(t, d=1.5, gain=0.12, rate=10):
    step = 1.0 / rate
    n_clicks = int(d / step)
    for i in range(n_clicks):
        n = int(0.025 * SR)
        x = rs.randn(n)
        s = bandpass(x, 3000, 8000) * env_ad(n, 0.001, 0.008)
        add(sfx, gain * s / (np.abs(s).max() + 1e-9), t + i * step + rs.uniform(-0.01, 0.01))


def msg_delete(t, gain=0.25):
    n = int(0.2 * SR)
    x = rs.randn(n)
    tt = np.linspace(1, 0, n)
    from scipy.signal import butter, sosfilt
    out = np.zeros(n)
    parts = 8
    seg = n // parts
    for p in range(parts):
        fc = 600 + 2400 * tt[p * seg]
        sos = butter(2, [max(fc * 0.6, 200), min(fc * 1.4, 10000)], btype="band", fs=SR, output="sos")
        out[p * seg:(p + 1) * seg] = sosfilt(sos, x[p * seg:(p + 1) * seg])
    e = np.linspace(0.8, 0, n)
    add(sfx, gain * out * e / (np.abs(out).max() + 1e-9), t)


def phone_off(t, gain=0.3):
    n = int(0.1 * SR)
    tt = np.arange(n) / SR
    s = np.sin(2 * np.pi * (80 + 40 * np.exp(-tt * 20)) * tt) * np.exp(-tt / 0.03)
    add(sfx, gain * s, t)


lines = meta["lines"]
syl = meta["syl"]

# scene 1: phone notification
phone_notif(lines[0][0] + 0.2)

# scene transitions whoosh
for i in range(1, 6):
    whoosh(lines[i][0] - 0.6)

# scene 2: message bubble pop
pop(syl[1][3] if len(syl[1]) > 3 else lines[1][0] + 0.5, 800, 0.25)

# scene 3: message bubble pop
pop(lines[2][0] + 0.3, 800, 0.25)

# scene 4: message bubble pop + call history reveal
pop(lines[3][0] + 0.3, 800, 0.25)
pop(syl[3][8] if len(syl[3]) > 8 else lines[3][0] + 2.0, 600, 0.2)

# scene 5: typing + delete
type5_start = syl[4][4] if len(syl[4]) > 4 else lines[4][0] + 1.0
del5_start = syl[4][14] if len(syl[4]) > 14 else lines[4][1] - 0.5
typing_clicks(type5_start, del5_start - type5_start - 0.3, 0.1, 8)
msg_delete(del5_start)

# scene 6: typing + delete + phone off
type6_start = syl[5][2] if len(syl[5]) > 2 else lines[5][0] + 0.5
del6_start = syl[5][5] if len(syl[5]) > 5 else lines[5][0] + 1.5
off6_start = syl[5][7] if len(syl[5]) > 7 else lines[5][0] + 2.5
typing_clicks(type6_start, del6_start - type6_start - 0.2, 0.1, 8)
msg_delete(del6_start)
phone_off(off6_start)

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
