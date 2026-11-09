"""Dựng tập video chỉ từ ảnh tĩnh (không có cảnh bầu trời bằng code): tập 002 trở đi.

Giống render_episode.py nhưng không dùng Sky, vega, streak, lamp. Hiệu ứng theo cảnh nằm trong fx.json, thêm các mục:
zoom0, drift, parallax (liền mạch giữa hai ảnh trùng bố cục), glows[].pulse, bulge (đồng tử), hook.sweep, title.

Cách dùng: python render_stills.py episodes/002-hai-muoi-phut [--preview 2,8,20 [--full]] [--workers 4]
"""
import os

os.environ.setdefault("OMP_NUM_THREADS", "1")
os.environ.setdefault("OPENBLAS_NUM_THREADS", "1")

import lowload  # noqa: F401

import argparse
import json
import subprocess
import sys
import tempfile
import time
from pathlib import Path

import cv2
import numpy as np
from PIL import Image, ImageDraw, ImageFont

from sky import H, W

parser = argparse.ArgumentParser()
parser.add_argument("episode", type=Path)
parser.add_argument("--preview", help="Các giây cần xem thử, ghép thành một ảnh")
parser.add_argument("--full", action="store_true", help="Với --preview: lưu từng khung độ phân giải đầy đủ ra preview-<giây>.jpg")
parser.add_argument("--workers", type=int, default=4)
parser.add_argument("--chunk", nargs=3, help=argparse.SUPPRESS)
args = parser.parse_args()
cv2.setNumThreads(1)

FPS = 30
DISSOLVE = 1.1
# Vùng an toàn: tránh nút bên phải, tên kênh và mô tả bên dưới, thanh trên cùng.
SAFE_LEFT, SAFE_RIGHT, SAFE_TOP, SAFE_BOTTOM = 60, 930, 220, 1440
SAFE_CX = (SAFE_LEFT + SAFE_RIGHT) // 2
SUB_Y = 1030
EP = args.episode.resolve()
tl = json.loads((EP / "audio" / "timeline.json").read_text(encoding="utf-8"))
source = json.loads((EP / "lines.json").read_text(encoding="utf-8"))["lines"]
DURATION = tl["duration"]
TOTAL_FRAMES = int(DURATION * FPS)
FONT_BOLD = r"C:\Windows\Fonts\seguisb.ttf"
FONT_REG = r"C:\Windows\Fonts\segoeui.ttf"
CREAM = np.array([246, 240, 228], np.float32)
SOFT = np.array([205, 212, 228], np.float32)
WARM = np.array([255, 240, 215], np.float32)
FX = json.loads((EP / "fx.json").read_text(encoding="utf-8"))
SCENE_FX = FX["scenes"]

def at(line, frac):
    """Mốc thời gian theo câu, đọc lại giọng thì hiệu ứng vẫn khớp lời."""
    item = tl["lines"][line] if isinstance(line, int) else tl["lines"][line[0]]["parts"][line[1]]
    return item["start"] + (item["end"] - item["start"]) * frac


class Keys:
    """Giá trị đổi theo các mốc [câu, tỉ lệ, giá trị]."""

    def __init__(self, keys):
        self.times = [at(k[0], k[1]) for k in keys]
        self.values = [k[2] for k in keys]

    def __call__(self, sec):
        return float(np.interp(sec, self.times, self.values))

# Gộp các câu liền nhau cùng cảnh thành một đoạn.
spans = []
for line in tl["lines"]:
    if spans and spans[-1]["scene"] == line["scene"]:
        spans[-1]["end"] = line["end"]
    else:
        spans.append({"scene": line["scene"], "start": line["start"], "end": line["end"]})
spans[0]["start"] = 0.0
for s in spans:
    s["start"] -= SCENE_FX.get(s["scene"], {}).get("lead", 0)
for a, b in zip(spans, spans[1:]):
    a["end"] = b["start"]
spans[-1]["end"] = DURATION

# Mỗi vế đọc là một cụm phụ đề, thời gian lấy đúng theo lời đọc.
phrases = []
for line, src in zip(tl["lines"], source):
    if src.get("subs") == []:
        continue
    for part in line["parts"]:
        text = part["text"].replace("Hai mươi lăm", "25").replace("hai mươi lăm", "25")
        phrases.append({"text": text, "start": part["start"], "end": part["end"]})


class Caption:
    """Một cụm chữ hiện và tan nhẹ cả khối."""

    def __init__(self, text, size, font_path=FONT_BOLD, max_width=SAFE_RIGHT - SAFE_LEFT, color=CREAM, halo=False):
        font = ImageFont.truetype(font_path, size)
        probe = ImageDraw.Draw(Image.new("L", (10, 10)))
        words = text.replace("|", " ").split()

        def width(part):
            return probe.textlength(" ".join(part), font=font)

        rows = [words]
        if "|" in text:
            # Xuống dòng tay để không tách các cụm như "cố gắng".
            rows = [part.split() for part in text.split("|")]
        elif width(words) > max_width and len(words) > 1:
            cut = min(range(1, len(words)), key=lambda i: max(width(words[:i]), width(words[i:])))
            rows = [words[:cut], words[cut:]]
        row_h = int(size * 1.34)
        self.height = row_h * len(rows) + 60
        mask = Image.new("L", (W, self.height), 0)
        draw = ImageDraw.Draw(mask)
        for r, row in enumerate(rows):
            draw.text((SAFE_CX - width(row) / 2, 30 + r * row_h), " ".join(row), font=font, fill=255)
        alpha = np.asarray(mask, np.float32) / 255
        # Thứ tự hiện chữ: dòng trên trước, từ trái qua phải theo nhịp đọc.
        order = np.zeros(alpha.shape, np.float32)
        for r, row in enumerate(rows):
            left = SAFE_CX - width(row) / 2
            ramp = np.clip((np.arange(W, dtype=np.float32) - left) / max(width(row), 1), 0, 1)
            order[30 + r * row_h : 30 + (r + 1) * row_h] = (r + ramp) / len(rows)
        self.order = order
        self.alpha = alpha[..., None]
        self.shadow = np.clip(cv2.GaussianBlur(alpha, (0, 0), 12) * 1.3, 0, 0.75)[..., None]
        self.color = color
        # Câu nhấn có quầng sáng ấm phía sau chữ.
        self.halo = cv2.GaussianBlur(alpha, (0, 0), 16)[..., None] * np.array([120, 84, 44], np.float32) if halo else None

    def draw(self, frame, y, opacity=1.0, reveal=1.0):
        if opacity <= 0:
            return
        region = frame[y : y + self.height]
        region *= 1 - self.shadow * opacity * min(reveal * 5, 1)
        shown = np.clip((reveal * 1.25 - self.order) / 0.25, 0, 1)[..., None]
        if self.halo is not None:
            region += self.halo * shown * opacity
        region += self.alpha * shown * opacity * (self.color - region)


_sprites = {}


def sprite(sigma):
    if sigma not in _sprites:
        r = int(sigma * 2.6) + 1
        g = np.exp(-(np.arange(-r, r + 1, dtype=np.float32) ** 2) / (2 * sigma**2))
        _sprites[sigma] = g[:, None] * g[None, :]
    return _sprites[sigma]


def _slices(mask, x, y):
    x, y, r = int(x), int(y), mask.shape[0] // 2
    x0, x1, y0, y1 = max(x - r, 0), min(x + r + 1, W), max(y - r, 0), min(y + r + 1, H)
    if x0 >= x1 or y0 >= y1:
        return None
    return (y0, y1, x0, x1), mask[y0 - y + r : y1 - y + r, x0 - x + r : x1 - x + r, None]


def stamp(frame, x, y, sigma, color):
    """Cộng một đốm sáng nhỏ, nhanh hơn làm mờ cả khung."""
    hit = _slices(sprite(sigma), x, y)
    if hit:
        (y0, y1, x0, x1), m = hit
        frame[y0:y1, x0:x1] += m * color


def lit(frame, x, y, sigma, gain, tint):
    """Đèn thật sự chiếu sáng vùng quanh nó, thay vì chỉ phủ một quầng lên ảnh."""
    hit = _slices(sprite(sigma), x, y)
    if hit:
        (y0, y1, x0, x1), m = hit
        region = frame[y0:y1, x0:x1]
        region *= 1 + m * gain
        region += m * tint * gain


def traveler(frame, a, b, via, q, glow=1.0, tail=0.05):
    """Đốm sáng đi theo đường cong, để lại vệt mờ dần phía sau."""
    a, b, via = (np.array(v, np.float32) for v in (a, b, via))
    for i in range(24, -1, -1):
        t = max(q - tail * i / 24, 0)
        pos = (1 - t) ** 2 * a + 2 * t * (1 - t) * via + t**2 * b
        stamp(frame, pos[0], pos[1], 2.2, WARM * (0.35 * (1 - i / 25) ** 2) * glow)
    stamp(frame, pos[0], pos[1], 3.0, WARM * 0.9 * glow)
    stamp(frame, pos[0], pos[1], 26.0, np.array([120, 104, 78], np.float32) * 0.4 * glow)
    return pos


def to_screen(ix, iy):
    return ix * 1100 / 896 - 35, iy * 1100 / 896 + 110


class Dust:
    """Bụi bay trong vùng sáng, hoặc sao và đèn xa lấp lánh tại chỗ."""

    def __init__(self, box, n, gain, color, seed, drift, sigma=2.0):
        rng = np.random.default_rng(seed)
        self.box, self.gain, self.drift, self.sigma = box, gain, drift, sigma
        self.color = np.array(color, np.float32) / 255
        self.u, self.v = rng.random(n), rng.random(n)
        self.phase = rng.random(n) * 6.28
        self.rate = rng.uniform(0.6, 2.6, n)

    def draw(self, frame, sec, place):
        x0, y0, x1, y1 = self.box
        for u, v, ph, rate in zip(self.u, self.v, self.phase, self.rate):
            if self.drift:
                y = (v - sec * rate * 0.012) % 1
                x = u + 0.02 * np.sin(ph + sec * rate * 0.5)
                level = (0.55 + 0.45 * np.sin(ph + sec * rate)) * min(y * 6, (1 - y) * 6, 1)
            else:
                x, y = u, v
                level = max(np.sin(ph + sec * rate), 0) ** 2
            if level > 0.02:
                sx, sy = place(x0 + (x1 - x0) * x, y0 + (y1 - y0) * y)
                stamp(frame, sx, sy, self.sigma, self.color * (self.gain * level))


def rain_tile(seed):
    """Vệt mưa dựng một lần, mỗi khung chỉ cuộn xuống."""
    rng = np.random.default_rng(seed)
    tile = np.zeros((H, W), np.uint8)
    for _ in range(420):
        x, y, length = int(rng.integers(0, W)), int(rng.integers(0, H)), int(rng.integers(26, 90))
        cv2.line(tile, (x, y), (x - length // 9, y + length), int(rng.integers(60, 200)), 1, cv2.LINE_AA)
    return cv2.GaussianBlur(tile, (0, 0), 0.7).astype(np.float32) / 255


def rays_mask(x, y, reach, seed):
    """Các tia sáng tỏa từ một điểm, mờ dần theo khoảng cách."""
    rng = np.random.default_rng(seed)
    yy, xx = np.mgrid[0:H, 0:W].astype(np.float32)
    angle = (np.arctan2(yy - y, xx - x) + np.pi) / (2 * np.pi)
    spokes = cv2.resize(rng.random((1, 48)).astype(np.float32), (720, 1), interpolation=cv2.INTER_CUBIC)[0]
    spokes = np.clip(spokes * 1.8 - 0.6, 0, 1)
    fall = np.exp(-np.hypot(xx - x, yy - y) / (reach * 0.55))
    return (spokes[(angle * 719).astype(np.int32)] * fall)[..., None]


# Vệt ngang của ống kính khi nhìn vào đèn sáng.
_fw = np.exp(-(np.arange(-240, 241, dtype=np.float32) ** 2) / (2 * 110.0**2))
_ft = np.exp(-(np.arange(-240, 241, dtype=np.float32) ** 2) / (2 * 2.2**2))
FLARE = _ft[:, None] * _fw[None, :]


class Still:
    """Ảnh vuông đặt trong vùng an toàn, phần trên dưới phủ bằng chính ảnh đã làm mờ."""

    def __init__(self, name, drift, fx, seed):
        image = cv2.cvtColor(cv2.imread(str(EP / "images" / f"{name}.png")), cv2.COLOR_BGR2RGB).astype(np.float32)
        depth = cv2.imread(str(EP / "images" / f"{name}.depth.png"), cv2.IMREAD_GRAYSCALE).astype(np.float32) / 255
        side = 1100
        fg = cv2.resize(image, (side, side), interpolation=cv2.INTER_CUBIC) * 0.92
        dp = cv2.resize(depth, (side, side))
        cover = cv2.resize(image, (H + 100, H + 100), interpolation=cv2.INTER_LINEAR)
        cover = cover[:, (H + 100 - (W + 100)) // 2 :][:, : W + 100]
        # Nền tối dần về phía dưới, chỗ mô tả của TikTok hiện lên.
        fall = np.clip(1 - (np.arange(H + 100, dtype=np.float32) - 1150) / 420, 0.12, 1)[:, None, None]
        bg = cv2.GaussianBlur(cover, (0, 0), 70) * 0.3 * fall
        edge = np.minimum(np.arange(side, dtype=np.float32) / 110, 1)
        ramp = edge * edge[::-1]
        feather = (ramp[:, None] * ramp[None, :])[..., None]
        # Khung nền rộng hơn màn hình 50px mỗi bên để còn chỗ cho hiệu ứng chiều sâu.
        x0, y0 = 515 + 50 - side // 2, 110 + 50
        canvas = bg.copy()
        canvas[y0 : y0 + side, x0 : x0 + side] = fg * feather + canvas[y0 : y0 + side, x0 : x0 + side] * (1 - feather)
        dmap = np.zeros(canvas.shape[:2], np.float32)
        dmap[y0 : y0 + side, x0 : x0 + side] = dp * feather[..., 0]
        self.image, self.depth = canvas, cv2.GaussianBlur(dmap, (0, 0), 6)
        self.yy, self.xx = np.mgrid[0:H, 0:W].astype(np.float32)
        self.drift = fx.get("drift", drift)
        self.zoom0 = fx.get("zoom0", 0.0)
        self.parallax = fx.get("parallax", 0.06)
        self.fx = fx
        self.push = fx.get("push", 0.045)
        self.focus = to_screen(*fx["focus"]) if "focus" in fx else (515.0, 660.0)
        self.dim = Keys(fx["dim"]) if "dim" in fx else None
        self.glows = [(g, Keys(g["keys"]) if "keys" in g else None, np.array(g["tint"], np.float32)) for g in fx.get("glows", [])]
        self.dust = [Dust(seed=seed + i, drift=True, **{"sigma": 2.6, **m}) for i, m in enumerate(fx.get("motes", []))]
        self.dust += [Dust(seed=seed + 50 + i, drift=False, sigma=1.7, **m) for i, m in enumerate(fx.get("twinkles", []))]
        self.travelers = [(t, at(*t["time"][0]), at(*t["time"][1])) for t in fx.get("travelers", [])]
        self.pan = fx.get("pan", [0, 0, 0, 0])
        # Mỗi vế đọc mới, máy nhích thêm một nhịp, nhờ vậy hình chuyển động theo lời.
        self.beats = [part["start"] for line in tl["lines"] if line["scene"] == name for part in line["parts"]][1:]
        fx0, fy0 = self.focus
        self.bell = np.exp(-((self.xx - fx0) ** 2 + (self.yy - fy0) ** 2) / (2 * 280.0**2))
        self.moths = None
        if "moths" in fx:
            self.moths = np.random.default_rng(seed).random((fx["moths"]["n"], 3)) * 6.28
        self.sweep = (at(*fx["sweep"]["from"]), at(*fx["sweep"]["to"]), fx["sweep"]["gain"]) if "sweep" in fx else None
        self.rain = None
        if "rain" in fx:
            x0, y0 = to_screen(*fx["rain"]["box"][:2])
            x1, y1 = to_screen(*fx["rain"]["box"][2:])
            box = np.zeros((H, W), np.float32)
            cv2.rectangle(box, (int(x0), int(y0)), (int(x1), int(y1)), 1.0, -1)
            self.rain_mask = cv2.GaussianBlur(box, (0, 0), 30) * fx["rain"]["gain"]
            self.rain = rain_tile(seed)
        self.mask_dark = fx.get("mask_dark")
        self.fade_bottom = fx.get("fade_bottom")
        self.rays = None
        if "rays" in fx:
            d = fx["rays"]
            self.rays = rays_mask(*to_screen(*d["at"]), d["reach"], seed) * np.array(d["color"], np.float32) * d["gain"]
            self.rays_keys = Keys(d["keys"]) if "keys" in d else None
        self.jolt = (at(*fx["jolt"]["at"]), fx["jolt"]["amp"]) if "jolt" in fx else None
        self.bulge = None
        if "bulge" in fx:
            b = fx["bulge"]
            bx, by = to_screen(*b["at"])
            self.bulge = (bx, by, b["R"] * 1100 / 896, Keys(b["keys"]))
        self.shimmer = None
        if "shimmer" in fx:
            top = to_screen(0, fx["shimmer"]["from_y"])[1]
            self.shimmer = np.clip((self.yy - top) / 160, 0, 1) * fx["shimmer"]["amp"]
        self.mist = None
        if "mist" in fx:
            # Sương mỏng trôi ngang, sinh một lần rồi cuộn qua.
            rng = np.random.default_rng(seed)
            tile = cv2.resize(rng.random((12, 40)).astype(np.float32), (W * 2, H), interpolation=cv2.INTER_CUBIC)
            y0, y1 = to_screen(0, fx["mist"]["y"][0])[1], to_screen(0, fx["mist"]["y"][1])[1]
            band = np.exp(-(((np.arange(H, dtype=np.float32) - (y0 + y1) / 2) / ((y1 - y0) / 2)) ** 2))[:, None]
            self.mist = np.clip(tile, 0, 1) * band * fx["mist"]["gain"]
            self.mist_color = np.array(fx["mist"]["color"], np.float32)
        self.dawn = None
        if "dawn" in fx:
            d = fx["dawn"]
            y = to_screen(0, d["y"])[1]
            ramp = np.exp(-(((np.arange(H, dtype=np.float32) - y) / (d["sigma"] * 1100 / 896)) ** 2))[:, None, None]
            self.dawn = ramp * np.array(d["color"], np.float32)
            self.dawn_keys = Keys(d["keys"])
        self.shut = None
        if "shut" in fx:
            d = fx["shut"]
            self.shut = (to_screen(*d["center"])[0], at(*d["from"]), at(*d["to"]), d["residual"])

    def backdrop(self, base):
        """Mặt nạ vùng sáng của ảnh gốc, để tia sáng chỉ cộng lên nền và không đè lên bóng người."""
        lo, hi = self.mask_dark
        lum = base.mean(axis=2)
        return np.clip((cv2.GaussianBlur(lum, (0, 0), 3) - lo) / (hi - lo), 0, 1)[..., None]

    def frame(self, p, sec):
        # Máy trôi chậm về phía chủ thể, mỗi cảnh một mức theo nội dung.
        zoom = 1.0 + self.zoom0 + self.push * p
        fx_, fy_ = self.focus
        ease = smooth(p)
        pan_x = self.pan[0] + (self.pan[2] - self.pan[0]) * ease
        pan_y = self.pan[1] + (self.pan[3] - self.pan[1]) * ease
        for j, beat in enumerate(self.beats):
            step = smooth(float(np.clip((sec - beat) / 0.9, 0, 1)))
            zoom += 0.035 * step
            pan_x += (16 if j % 2 else -16) * step
        map_x = fx_ + 50 + (self.xx - fx_) / zoom - pan_x
        map_y = fy_ + 50 + (self.yy - fy_) / zoom - pan_y
        depth = cv2.remap(self.depth, map_x, map_y, cv2.INTER_LINEAR)
        # Chiều sâu rõ hơn và máy thở nhẹ như cầm tay.
        map_x = map_x + depth * self.drift * (p - 0.5) * 34 + 3.0 * np.sin(sec * 0.6)
        map_y = map_y + 2.5 * np.sin(sec * 0.43)
        # Vật ở gần lớn nhanh hơn vật ở xa, và người trong hình thở rất nhẹ.
        map_x = map_x - depth * (self.xx - fx_) * self.parallax * p
        map_y = map_y - depth * (self.yy - fy_) * self.parallax * p + depth * self.bell * 2.2 * np.sin(sec * 1.7)
        if self.bulge is not None:
            bx, by, radius, keys = self.bulge
            amount = keys(sec)
            r2 = ((self.xx - bx) ** 2 + (self.yy - by) ** 2) / radius**2
            k = 1 - amount * np.exp(-r2)
            map_x = bx + (map_x - bx) * k
            map_y = by + (map_y - by) * k
        if self.jolt and 0 <= sec - self.jolt[0] < 0.6:
            # Khung hình khẽ rung một nhịp khi cửa sập.
            map_y = map_y + self.jolt[1] * np.exp(-(sec - self.jolt[0]) * 7) * np.cos((sec - self.jolt[0]) * 40)
        if self.shimmer is not None:
            # Mặt đường ướt phản chiếu đèn, gợn nhẹ theo hàng ngang.
            map_x = map_x + self.shimmer * np.sin(self.yy * 0.11 + sec * 2.4)
        frame = cv2.remap(self.image, map_x.astype(np.float32), map_y.astype(np.float32), cv2.INTER_LINEAR, borderMode=cv2.BORDER_REPLICATE)

        base = frame.copy() if self.mask_dark else None
        def place(ix, iy):
            sx, sy = to_screen(ix, iy)
            return fx_ + (sx - fx_) * zoom + pan_x, fy_ + (sy - fy_) * zoom + pan_y

        for g, keys, tint in self.glows:
            x, y = place(*g["at"])
            # Bóng đèn đung đưa làm vùng sáng trong phòng đổi theo.
            x += g.get("swing", 0) * np.sin(sec * 0.9)
            # Ngọn đèn dao động không đều, không nhấp nháy theo nhịp.
            wobble = 0.55 * np.sin(sec * 7.3 + x) * np.sin(sec * 3.1) + 0.45 * np.sin(sec * 12.7 + y)
            gain = g["gain"] * (1 + g.get("flicker", 0) * wobble) * (keys(sec) if keys else 1)
            if g.get("pulse"):
                # Màn hình sáng nhấp theo nhịp chuông, lắng dần đến mốc "until".
                pl = g["pulse"]
                amp = pl["depth"] * float(np.clip((at(*pl["until"]) - sec) / 0.6, 0, 1))
                gain *= 1 + amp * (0.5 + 0.5 * np.sin(2 * np.pi * pl["hz"] * sec)) ** 2
            lit(frame, x, y, float(g["sigma"]), gain, tint / g["gain"])
            if g.get("flare"):
                hit = _slices(FLARE, x, y)
                if hit:
                    (y0, y1, x0, x1), m = hit
                    frame[y0:y1, x0:x1] += m * np.array([210, 150, 90], np.float32) * (gain / g["gain"]) * 0.6
        if self.sweep and self.sweep[0] <= sec <= self.sweep[1]:
            # Đèn xe bên ngoài lia qua phòng.
            t0, t1, gain = self.sweep
            q = (sec - t0) / (t1 - t0)
            band = np.exp(-(((self.xx + self.yy * 0.5 - (-300 + 2100 * q)) / 200) ** 2))[..., None] * float(np.sin(np.pi * q))
            frame *= 1 + band * gain
            frame += band * np.array([26, 22, 16], np.float32)
        if self.moths is not None:
            # Vài con thiêu thân lượn quanh đèn.
            mx, my = place(*self.fx["moths"]["at"])
            r = self.fx["moths"]["radius"]
            for a, b, c in self.moths:
                x = mx + r * np.cos(sec * (1.4 + a * 0.2) + b)
                y = my + r * 0.6 * np.sin(sec * (2.1 + c * 0.2) + c)
                stamp(frame, x, y, 2.6, np.array([-110, -110, -100], np.float32))
        if self.rays is not None:
            breath = 0.75 + 0.25 * np.sin(sec * 0.8)
            add = self.rays * (breath * (self.rays_keys(sec) if self.rays_keys else 1))
            frame += add * self.backdrop(base) if self.mask_dark else add
        if self.dawn is not None:
            add = self.dawn * self.dawn_keys(sec)
            frame += add * self.backdrop(base) if self.mask_dark else add
        if self.rain is not None:
            frame += (np.roll(self.rain, int(sec * 780), axis=0) * self.rain_mask)[..., None]
        if self.mist is not None:
            frame += self.mist[:, int(sec * self.fx["mist"]["speed"]) % W :][:, :W, None] * self.mist_color
        for d in self.dust:
            d.draw(frame, sec, place)
        for t, t0, t1 in self.travelers:
            if t0 <= sec:
                q = min((sec - t0) / (t1 - t0), 1)
                if t.get("fade"):
                    if q < 1:
                        traveler(frame, place(*t["from"]), place(*t["to"]), place(*t["via"]), q, float(np.sin(np.pi * q)) * 1.6, t.get("tail", 0.05))
                else:
                    traveler(frame, place(*t["from"]), place(*t["to"]), place(*t["via"]), q, glow=min(q * 6, 1))
        if self.shut:
            # Ánh sáng khép dần về một khe rồi tắt, đúng lúc lời đọc nói cửa đóng lại.
            cx, t0, t1, residual = self.shut
            q = smooth(float(np.clip((sec - t0) / (t1 - t0), 0, 1)))
            width_ = 760 * (1 - q)
            band = np.clip((width_ - np.abs(np.arange(W, dtype=np.float32) - cx)) / 120, 0, 1)
            frame *= (residual + (1 - residual) * band)[None, :, None]
        if self.fade_bottom:
            # Cảnh có phần chân ảnh sáng: tắt dần về nền tối trước mép ảnh để không hiện đường cắt khi máy tiến gần.
            y0, y1, floor = self.fade_bottom
            ramp = np.clip((self.yy[:, :1] - y0) / (y1 - y0), 0, 1)
            frame *= (1 - ramp * (1 - floor))[..., None]
        if self.dim:
            frame *= self.dim(sec)
        return frame


sub_layers = {p["text"]: Caption(p["text"].replace(",", ""), FX["emphasis"].get(p["text"], 56), halo=p["text"] in FX["emphasis"]) for p in phrases}
mark = Caption("@dark.sky.quotes", 28, FONT_REG, color=SOFT)
title = Caption("DarkSky Quotes", 92, halo=True)
TITLE_Y = 400

stills = {}
for i, s in enumerate(spans):
    if (EP / "images" / f"{s['scene']}.png").exists() and s["scene"] not in stills:
        stills[s["scene"]] = Still(s["scene"], 1 if i % 2 else -1, SCENE_FX.get(s["scene"], {}), 100 + i * 7)

_rng = np.random.default_rng(3)
vy, vx = np.mgrid[0:H, 0:W].astype(np.float32)
vignette = 1 - 0.38 * np.clip(((vx - W / 2) / (W * 0.74)) ** 2 + ((vy - H * 0.42) / (H * 0.7)) ** 2, 0, 1)
vignette = vignette[..., None]
del vx, vy
grain = [cv2.resize(_rng.normal(0, 1.4, (H // 2, W // 2)).astype(np.float32), (W, H), interpolation=cv2.INTER_NEAREST)[..., None] for _ in range(4)]


def smooth(p):
    return p * p * (3 - 2 * p)


def zoomed(frame, z, cx, cy):
    matrix = np.array([[z, 0, cx - z * cx], [0, z, cy - z * cy]], np.float32)
    return cv2.warpAffine(frame, matrix, (W, H), flags=cv2.INTER_LINEAR, borderMode=cv2.BORDER_REPLICATE)


def shifted(frame, dy):
    matrix = np.array([[1, 0, 0], [0, 1, dy]], np.float32)
    return cv2.warpAffine(frame, matrix, (W, H), flags=cv2.INTER_LINEAR, borderMode=cv2.BORDER_REPLICATE)


class HookRow:
    """Một dòng chữ hook: hiện dần từ mờ sang nét, sáng theo đốm sáng đi qua, cuối cùng tan như khói."""

    def __init__(self, text, size, y, weak=False, at=None):
        font = ImageFont.truetype(FONT_BOLD, size)
        probe = ImageDraw.Draw(Image.new("L", (10, 10)))
        self.height = int(size * 1.7)
        mask = Image.new("L", (W, self.height), 0)
        ImageDraw.Draw(mask).text((SAFE_CX - probe.textlength(text, font=font) / 2, int(size * 0.2)), text, font=font, fill=255)
        self.alpha = np.asarray(mask, np.float32) / 255
        self.y, self.weak = y, weak
        self.start = globals()["at"](*at) if at else -0.45
        self.leave = tl["lines"][0]["end"] + 0.1

    def draw(self, frame, sec, light_x):
        t = sec - self.start
        if t < 0:
            return
        come = smooth(min(t / 0.75, 1))
        away = smooth(float(np.clip((sec - self.leave) / 0.7, 0, 1)))
        opacity = come * (1 - away)
        if opacity <= 0:
            return
        if self.weak and sec < self.leave:
            # Chữ "vô dụng" chập chờn như bóng đèn sắp hỏng.
            opacity *= 0.62 if np.sin(sec * 11.3) * np.sin(sec * 4.7) > 0.62 else 1.0
        blur = 14 * (1 - come) + 22 * away
        alpha = cv2.GaussianBlur(self.alpha, (0, 0), blur) if blur > 0.4 else self.alpha
        y = self.y + int(16 * (1 - come)) - int(70 * away)
        shine = np.exp(-(((np.arange(W, dtype=np.float32) - light_x) / 170) ** 2))[None, :]
        halo = cv2.GaussianBlur(self.alpha, (0, 0), 20) * (0.3 + 1.25 * shine)
        shadow = np.clip(cv2.GaussianBlur(self.alpha, (0, 0), 14) * 1.4, 0, 0.8)
        base = np.array([246, 214, 170], np.float32) if self.weak else CREAM
        color = base[None, None] + (shine[..., None] * (WARM - base)) * 0.9
        region = frame[y : y + self.height]
        region *= 1 - shadow[..., None] * opacity
        region += halo[..., None] * np.array([150, 104, 54], np.float32) * opacity
        region += alpha[..., None] * opacity * (color - region)


hook_rows = [HookRow(**row) for row in FX["hook"]["rows"]]


# Vệt sáng tắt dần trước vùng tối phía dưới, không tạo cột sáng.
LEAK_FALL = np.clip((1250 - np.arange(H, dtype=np.float32)) / 350, 0, 1)[:, None, None]


def shifted_x(frame, dx):
    matrix = np.array([[1, 0, dx], [0, 1, 0]], np.float32)
    return cv2.warpAffine(frame, matrix, (W, H), flags=cv2.INTER_LINEAR, borderMode=cv2.BORDER_REPLICATE)


# Vệt sáng tắt dần trước vùng tối phía dưới, không tạo cột sáng.

def hook_light(sec):
    """Vệt sáng quét ngang qua chữ hook trong lúc đọc câu đầu."""
    d = FX["hook"]["sweep"]
    q = float(np.clip(sec / max(tl["lines"][0]["end"], 0.1), 0, 1))
    return [d[0] + (d[1] - d[0]) * q, 0], q


hook_rows = [HookRow(**row) for row in FX["hook"]["rows"]]


def scene_frame(span, sec):
    p = float(np.clip((sec - span["start"]) / max(span["end"] - span["start"], 0.01), 0, 1))
    return stills[span["scene"]].frame(p, sec)


def compose(sec, index=0):
    cur = next((s for s in spans if s["start"] <= sec < s["end"]), spans[-1])
    frame = scene_frame(cur, sec).copy()
    i = spans.index(cur)
    fx = SCENE_FX.get(cur["scene"], {})
    span_in = fx.get("in_dur", DISSOLVE)
    if i and sec < cur["start"] + span_in:
        w = smooth((sec - cur["start"]) / span_in)
        before = scene_frame(spans[i - 1], sec)
        mode = fx.get("in", "zoom")
        if mode == "tilt":
            # Ngước lên thật: cảnh cũ tụt xuống, bầu trời từ trên đi vào.
            before = shifted(before, H * 0.55 * w)
            frame = shifted(frame, -H * 0.3 * (1 - w))
        elif mode == "zoom":
            # Máy đi xuyên qua cảnh cũ để vào cảnh mới.
            before = zoomed(before, 1 + 0.2 * w, 540, 760)
            frame = zoomed(frame, 1.14 - 0.14 * w, 540, 760)
        elif mode == "slide":
            # Máy lia ngang sang cảnh tiếp theo.
            before = shifted_x(before, -W * 0.3 * w)
            frame = shifted_x(frame, W * 0.22 * (1 - w))
        frame = frame * w + before * (1 - w)
        if fx.get("leak"):
            # Vệt sáng ấm lướt ngang lúc đổi cảnh, như ánh đèn qua ống kính.
            center = -200 + 1480 * w
            band = np.exp(-(((np.arange(W, dtype=np.float32) - center) / 260) ** 2))[None, :, None]
            band = band * LEAK_FALL
            frame = frame + band * np.array([64, 38, 14], np.float32) * float(np.sin(np.pi * w))
    if sec < tl["lines"][0]["end"] + 0.9:
        light_x = hook_light(sec)[0][0]
        for row in hook_rows:
            row.draw(frame, sec, light_x)
    mark.draw(frame, 196, 0.55)
    if "title" in FX:
        # Tên kênh hiện lên sau lời đọc, giữ một lúc rồi mờ dần.
        t0, t1 = (DURATION - v for v in FX["title"]["show_fade"])
        show = smooth(float(np.clip((sec - t0) / 1.0, 0, 1)))
        fade = smooth(float(np.clip((sec - t1) / 1.6, 0, 1)))
        title.draw(frame, TITLE_Y, show * (1 - fade))
    for ph in phrases:
        if ph["start"] - 0.05 <= sec < ph["end"] + 0.25:
            opacity = min((sec - ph["start"] + 0.05) / 0.22, (ph["end"] + 0.25 - sec) / 0.25, 1)
            # Chữ hiện theo nhịp đọc rồi tan, nổi lên rất nhẹ.
            rise = int(10 * (1 - min((sec - ph["start"] + 0.05) / 0.5, 1))) - int(8 * min((sec - ph["start"]) / max(ph["end"] - ph["start"], 0.3), 1.2))
            reveal = min((sec - ph["start"] + 0.05) / max((ph["end"] - ph["start"]) * 0.8, 0.3), 1)
            sub_layers[ph["text"]].draw(frame, SUB_Y + rise, opacity, reveal)
            break
    # Hết clip mọi thứ tối dần về đen.
    frame *= float(np.clip((DURATION - sec) / 1.5, 0, 1))
    frame *= vignette
    frame += grain[index % len(grain)]
    return np.clip(frame, 0, 255).astype(np.uint8)



if args.chunk:
    first, last, path = int(args.chunk[0]), int(args.chunk[1]), args.chunk[2]
    ff = subprocess.Popen(
        ["ffmpeg", "-y", "-v", "error", "-threads", "2", "-f", "rawvideo", "-pix_fmt", "rgb24", "-s", f"{W}x{H}", "-r", str(FPS), "-i", "-",
         "-c:v", "libx264", "-preset", "veryfast", "-crf", "21", "-g", "60", "-pix_fmt", "yuv420p", path],
        stdin=subprocess.PIPE,
    )
    for f in range(first, last):
        ff.stdin.write(compose(f / FPS, f).tobytes())
    ff.stdin.close()
    raise SystemExit(ff.wait())

if args.preview:
    secs = [float(s) for s in args.preview.split(",")]
    if args.full:
        for s_ in secs:
            Image.fromarray(compose(s_, 0)).save(EP / f"preview-{s_:g}.jpg", quality=92)
        raise SystemExit
    thumbs = [cv2.resize(compose(s, 0), (270, 480), interpolation=cv2.INTER_AREA) for s in secs]
    # Vẽ khung vùng an toàn lên ảnh xem thử để kiểm tra bố cục, video thật không có khung này.
    sx = 270 / W
    for th in thumbs:
        cv2.rectangle(th, (int(SAFE_LEFT * sx), int(SAFE_TOP * sx)), (int(SAFE_RIGHT * sx), int(SAFE_BOTTOM * sx)), (255, 70, 70), 1)
    rows = [np.hstack(thumbs[i : i + 6]) for i in range(0, len(thumbs), 6)]
    width = rows[0].shape[1]
    rows = [np.pad(r, ((0, 0), (0, width - r.shape[1]), (0, 0))) for r in rows]
    Image.fromarray(np.vstack(rows)).save(EP / "preview.jpg", quality=88)
    print(EP / "preview.jpg")
    raise SystemExit

# Nhạc nền dựng bằng code: piano thưa trên nền dây rất nhẹ, có vang như phòng rộng.
SR = 48000
n = int(DURATION * SR)
BAR = 8.0
# Hợp âm Am, F, C, G: nốt trầm và các nốt phía trên, tính theo số MIDI.
CHORDS = [(45, [57, 60, 64, 69, 72]), (41, [53, 57, 60, 65, 69]), (48, [55, 60, 64, 67, 72]), (43, [55, 59, 62, 67, 71])]
rng = np.random.default_rng(5)
piano = np.zeros(n + SR * 8, np.float32)
strings = np.zeros(n + SR * 8, np.float32)


def hz(m):
    return 440 * 2 ** ((m - 69) / 12)


def play(start, m, vel):
    """Nốt piano mềm: nhiều họa âm hơi lệch, họa âm cao tắt nhanh, đánh càng nhẹ càng ấm."""
    i0 = max(int(start * SR), 0)
    t = np.arange(int(6.5 * SR), dtype=np.float32) / SR
    f = hz(m)
    note = np.zeros(len(t), np.float32)
    for k in range(1, 8):
        fk = f * k * np.sqrt(1 + 0.0004 * k * k)
        if fk > 7000:
            break
        decay = (0.5 + 0.34 * k) * (f / 440) ** 0.35
        level = vel ** (1 + 0.32 * k) / k**1.4
        note += level * np.exp(-t * decay) * (np.sin(2 * np.pi * fk * t) + 0.6 * np.sin(2 * np.pi * (fk + 0.5) * t))
    note *= np.minimum(t / 0.012, 1)
    piano[i0 : i0 + len(note)] += note


last_at = at(*FX["music_end"])
busy_at = at(*FX["music_busy"])
for c in range(int(last_at / BAR) + 1):
    start = c * BAR
    if start >= last_at:
        break
    bass, tones = CHORDS[c % len(CHORDS)]
    tt = np.arange(int((BAR + 6) * SR), dtype=np.float32) / SR
    env = np.sin(np.pi * np.clip(tt / (BAR + 6), 0, 1)) ** 1.5
    for m in (bass + 12, tones[0], tones[2]):
        for detune in (0.997, 1.0, 1.003):
            strings[int(start * SR) : int(start * SR) + len(tt)] += env * np.sin(2 * np.pi * hz(m) * detune * tt + detune * 40)
    play(start, bass, 0.55)
    play(start + 0.03, bass + 12, 0.4)
    busy = start >= busy_at
    for beat in np.arange(1.0, BAR - 0.5, 1.0):
        chance = (0.62 if beat % 2 == 0 else 0.16) if busy else (0.38 if beat % 2 == 0 else 0.05)
        if start + beat < last_at - 0.5 and rng.random() < chance:
            play(start + beat + rng.uniform(-0.05, 0.05), int(rng.choice(tones)), rng.uniform(0.28, 0.46))
    if busy and c % 2 == 0:
        # Một câu nhạc ngắn ở quãng cao, chỉ vài nốt.
        for j, step in enumerate(rng.choice(tones[2:], 3)):
            when = start + 4.0 + j * 1.5 + rng.uniform(-0.06, 0.06)
            if when < last_at - 0.5:
                play(when, int(step) + 12, rng.uniform(0.3, 0.42))
# Kết bằng một hợp âm trưởng rải chậm đúng câu cuối.
for j, m in enumerate((48, 60, 64, 67, 72, 76)):
    play(last_at + j * 0.16, m, 0.5)

dry = piano[: n + SR * 4] + strings[: n + SR * 4] * (0.05 * np.abs(piano).max() / max(np.abs(strings).max() / 9, 1e-6) / 9)
# Vang dựng từ nhiễu tắt dần, hai kênh khác nhau cho rộng.
verb_rng = np.random.default_rng(11)
length = int(3.6 * SR)
decay = np.exp(-np.arange(length, dtype=np.float32) / SR * 2.0)
smoother = np.ones(14, np.float32) / 14
channels = []
spec = np.fft.rfft(dry, len(dry) + length)
for _ in range(2):
    ir = np.convolve(verb_rng.normal(0, 1, length).astype(np.float32), smoother, "same") * decay
    wet = np.fft.irfft(spec * np.fft.rfft(ir, len(dry) + length))[: n].astype(np.float32)
    channels.append(dry[: n] + wet * (0.55 * np.abs(dry).max() / np.abs(wet).max()))
stereo = np.stack(channels, 1)
tt = np.arange(n) / SR
# Nhạc lắng khi cửa đóng và ở câu "vẫn đi", dâng lên khi sao hiện.
stereo *= np.interp(tt, [at(k[0], k[1]) for k in FX["music"]], [k[2] for k in FX["music"]]).astype(np.float32)[:, None]
stereo /= np.abs(stereo).max() / 0.6
# Tiếng cửa đóng khẽ: một nhịp trầm ngắn và tiếng chốt nhỏ.
if "door" in FX:
    door_at = int(at(*FX["door"]) * SR)
    t = np.arange(int(0.5 * SR)) / SR
    thud = np.exp(-t * 16) * np.sin(2 * np.pi * 62 * t) * 0.5
    click = np.exp(-t * 180) * np.random.default_rng(9).normal(0, 1, len(t)) * 0.1
    stereo[door_at : door_at + len(t)] += (thud + click).astype(np.float32)[:, None]
music_path = EP / "audio" / "music.wav"
subprocess.run(
    ["ffmpeg", "-y", "-v", "error", "-f", "f32le", "-ar", str(SR), "-ac", "2", "-i", "-",
     "-af", f"highpass=f={FX.get("music_highpass", 70)},lowpass=f=6500,afade=t=in:d=0.6,afade=t=out:st={DURATION - 3.0:.2f}:d=3.0", str(music_path)],
    input=stereo.astype(np.float32).tobytes(),
    check=True,
)
# Đo độ to thật của nhạc rồi chỉnh về mức đặt trong fx.json.
report = subprocess.run(["ffmpeg", "-hide_banner", "-i", str(music_path), "-af", "ebur128", "-f", "null", "-"], capture_output=True, text=True).stderr
music_lufs = float(report.rsplit("I:", 1)[1].split("LUFS")[0])
music_gain = 10 ** ((FX["music_lufs"] - music_lufs) / 20)
print(f"music {music_lufs:.1f} LUFS, gain {music_gain:.2f}")

started = time.time()
with tempfile.TemporaryDirectory() as tmp:
    tmp = Path(tmp)
    edges = np.linspace(0, TOTAL_FRAMES, args.workers + 1).astype(int)
    procs = [
        subprocess.Popen([sys.executable, __file__, str(EP), "--chunk", str(a), str(b), str(tmp / f"{i:02d}.mp4")])
        for i, (a, b) in enumerate(zip(edges, edges[1:]))
    ]
    if any(p.wait() for p in procs):
        raise SystemExit("Một tiến trình dựng bị lỗi")
    listing = tmp / "list.txt"
    listing.write_text("".join(f"file '{tmp / f'{i:02d}.mp4'}'\n".replace("\\", "/") for i in range(args.workers)), encoding="utf-8")
    subprocess.run(
        ["ffmpeg", "-y", "-v", "error", "-f", "concat", "-safe", "0", "-i", str(listing),
         "-i", str(EP / "audio" / "narration.wav"), "-i", str(music_path),
         "-filter_complex", f"[2:a]volume={music_gain:.3f}[m];[1:a]asplit=2[v][key];[m][key]sidechaincompress=threshold=0.04:ratio=2.5:attack=60:release=700[duck];[v][duck]amix=inputs=2:duration=first:normalize=0,alimiter=limit=0.84:level=disabled[a]",
         "-map", "0:v", "-map", "[a]", "-c:v", "copy", "-c:a", "aac", "-b:a", "192k", "-shortest", str(EP / "output.mp4")],
        check=True,
    )
print(f"done in {time.time() - started:.0f}s")
