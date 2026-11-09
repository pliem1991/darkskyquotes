"""Dựng cảnh bầu trời sao bằng code (numpy + OpenCV + FFmpeg), không dùng AI.

Cách dùng: python sky_demo.py output.mp4 [--encoder h264_amf|libx264]
"""
import argparse
import subprocess
import time
from pathlib import Path

import cv2
import numpy as np
from PIL import Image, ImageDraw, ImageFilter

parser = argparse.ArgumentParser()
parser.add_argument("output", type=Path)
parser.add_argument("--encoder", default="libx264", choices=["libx264", "h264_amf"])
args = parser.parse_args()

W, H = 1080, 1920
FPS, SECONDS = 30, 6
FRAMES = FPS * SECONDS
OUT = args.output
OUT.parent.mkdir(parents=True, exist_ok=True)

started = time.time()
rng = np.random.default_rng(7)
PAD = 2600


def noise(size, octaves=6):
    total = np.zeros((size, size), dtype=np.float32)
    for o in range(octaves):
        n = 4 * 2**o
        layer = cv2.resize(rng.random((n, n)).astype(np.float32), (size, size), interpolation=cv2.INTER_CUBIC)
        total += layer / 2**o
    return (total - total.min()) / (total.max() - total.min())


# Dải Ngân Hà: một dải chéo mờ, bị nhiễu làm rách như mây bụi.
yy, xx = np.mgrid[0:PAD, 0:PAD].astype(np.float32)
dist = np.abs((xx - PAD / 2) * 0.72 + (yy - PAD / 2) * 0.69) / 420
band = np.clip(np.exp(-dist**2) * np.clip(noise(PAD) * 1.9 - 0.45, 0, 1), 0, 1).astype(np.float32)
del yy, xx, dist

# Nền trời: đáy hơi xanh, đỉnh gần đen.
t = np.linspace(0, 1, H, dtype=np.float32)[:, None, None]
sky = (1 - t) * np.array([3, 5, 14], np.float32) + t * np.array([20, 32, 58], np.float32)
sky = np.broadcast_to(sky, (H, W, 3)).copy()

# Sao: rất nhiều sao mờ, rất ít sao sáng. Tâm quay nằm ngoài khung hình.
N = 9000
pole = np.array([W * 0.7, -500.0], np.float32)
radius = (np.sqrt(rng.random(N)) * 3000).astype(np.float32)
theta = (rng.random(N) * 2 * np.pi).astype(np.float32)
mag = (rng.pareto(2.4, N) + 0.12).astype(np.float32)
color = rng.choice(
    np.array([[255, 244, 232], [214, 228, 255], [255, 222, 190], [255, 255, 255]], np.float32),
    N,
    p=[0.35, 0.4, 0.1, 0.15],
)
phase = (rng.random(N) * 2 * np.pi).astype(np.float32)
speed = rng.uniform(1.5, 5, N).astype(np.float32)

# Đồi và người gác đêm cầm đèn, chỉ là bóng đen.
mask = Image.new("L", (W, H), 0)
draw = ImageDraw.Draw(mask)
ridge = 1610 + 42 * np.sin(np.linspace(0, 4.2, 200)) + 18 * np.sin(np.linspace(0, 13, 200))
draw.polygon([(i * W / 199, float(y)) for i, y in enumerate(ridge)] + [(W, H), (0, H)], fill=255)
fx, fy = 330, int(ridge[61]) + 4
draw.polygon([(fx - 13, fy), (fx + 13, fy), (fx + 8, fy - 58), (fx - 8, fy - 58)], fill=255)
draw.ellipse([fx - 8, fy - 74, fx + 8, fy - 58], fill=255)
draw.line([(fx + 7, fy - 48), (fx + 28, fy - 34)], fill=255, width=4)
mask_arr = np.asarray(mask.filter(ImageFilter.GaussianBlur(0.7)), np.float32)[..., None] / 255
sky_mask = 1 - mask_arr
ground_layer = np.array([4, 5, 9], np.float32) * mask_arr

# Đèn chỉ ảnh hưởng một vùng nhỏ nên tính riêng vùng đó.
lx0, ly0 = max(fx + 28 - 140, 0), max(fy - 30 - 140, 0)
lx1, ly1 = min(fx + 28 + 140, W), min(fy - 30 + 140, H)
ly, lx = np.mgrid[ly0:ly1, lx0:lx1].astype(np.float32)
d2 = (lx - (fx + 28)) ** 2 + (ly - (fy - 30)) ** 2
lantern = np.exp(-d2 / (2 * 34**2))[..., None] * np.array([120, 72, 26], np.float32)
lantern += np.exp(-d2 / (2 * 5**2))[..., None] * np.array([255, 205, 130], np.float32)

mw_color = np.array([72, 74, 92], np.float32)
left, top = (PAD - W) / 2, (PAD - H) / 2

encoder = (
    ["-c:v", "h264_amf", "-quality", "quality", "-rc", "cqp", "-qp_i", "18", "-qp_p", "20"]
    if args.encoder == "h264_amf"
    else ["-c:v", "libx264", "-preset", "veryfast", "-crf", "18"]
)
ff = subprocess.Popen(
    ["ffmpeg", "-y", "-v", "error", "-f", "rawvideo", "-pix_fmt", "rgb24", "-s", f"{W}x{H}", "-r", str(FPS), "-i", "-",
     *encoder, "-pix_fmt", "yuv420p", str(OUT)],
    stdin=subprocess.PIPE,
)
setup_done = time.time()

stars = np.zeros((H, W, 3), np.float32)
for f in range(FRAMES):
    sec = f / FPS
    angle = sec * 0.0035
    x = (pole[0] + radius * np.cos(theta + angle)).astype(np.int32)
    y = (pole[1] + radius * np.sin(theta + angle)).astype(np.int32)
    keep = (x >= 0) & (x < W) & (y >= 0) & (y < H)
    bright = np.minimum((mag * (0.78 + 0.22 * np.sin(phase + speed * sec)))[keep], 1.5)

    stars.fill(0)
    np.add.at(stars, (y[keep], x[keep]), color[keep] * bright[:, None])
    star_img = np.clip(stars, 0, 255).astype(np.uint8)
    halo = cv2.GaussianBlur(star_img, (0, 0), 2.6)
    core = cv2.GaussianBlur(star_img, (0, 0), 0.8)

    # Xoay dải Ngân Hà quanh tâm ảnh gốc, chỉ lấy đúng vùng khung hình.
    rot = cv2.getRotationMatrix2D((PAD / 2, PAD / 2), np.degrees(angle), 1.0)
    rot[0, 2] -= left
    rot[1, 2] -= top
    mw = cv2.warpAffine(band, rot, (W, H), flags=cv2.INTER_LINEAR)

    frame = sky + mw[..., None] * mw_color
    frame += core.astype(np.float32) * 1.9
    frame += halo.astype(np.float32) * 2.6
    frame *= sky_mask
    frame += ground_layer

    flicker = 0.9 + 0.1 * np.sin(sec * 9) * np.sin(sec * 3.7)
    frame[ly0:ly1, lx0:lx1] += lantern * flicker
    ff.stdin.write(np.clip(frame, 0, 255).astype(np.uint8).tobytes())

ff.stdin.close()
ff.wait()
print(f"setup {setup_done - started:.1f}s, render {time.time() - setup_done:.1f}s, tổng {time.time() - started:.1f}s -> {OUT}")
