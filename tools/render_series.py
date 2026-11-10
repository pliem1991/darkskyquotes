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
import re
import json
import subprocess
import sys
import tempfile
import time
from pathlib import Path

import cv2
import numpy as np
import soundfile as sf
from PIL import Image, ImageDraw, ImageFont

from sky import H, W

parser = argparse.ArgumentParser()
parser.add_argument("episode", type=Path)
parser.add_argument("--preview", help="Các giây cần xem thử, ghép thành một ảnh")
parser.add_argument("--full", action="store_true", help="Với --preview: lưu từng khung độ phân giải đầy đủ ra preview-<giây>.jpg")
parser.add_argument("--workers", type=int, default=4)
parser.add_argument("--mix-video", type=Path, help="Chỉ dựng nhạc rồi trộn với video này (-c:v copy), không dựng lại hình")
parser.add_argument("--out", type=Path)
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

def phrase_span(li, phrase):
    syl = tl["lines"][li]["syl"]
    toks = [re.sub(r"[^\w]", "", t.lower()) for t in phrase.split()]
    words = [re.sub(r"[^\w]", "", x["w"].lower()) for x in syl]
    for i in range(len(words) - len(toks) + 1):
        if words[i : i + len(toks)] == toks:
            return syl[i]["s"], syl[i + len(toks) - 1]["e"]
    raise KeyError(f"không thấy cụm '{phrase}' trong câu {li}")


def at(line, frac):
    """Mốc thời gian theo câu, đọc lại giọng thì hiệu ứng vẫn khớp lời.
    ["w", [câu, "cụm từ"]] là lúc bắt đầu đọc cụm, ["we", [câu, "cụm từ"]] là lúc đọc xong cụm."""
    if line == "w":
        return phrase_span(*frac)[0]
    if line == "we":
        return phrase_span(*frac)[1]
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
    for pi, part in enumerate(line["parts"]):
        if [tl["lines"].index(line), pi] in FX.get("hide_subs", []):
            continue
        text = part["text"]
        for spoken, digits in FX.get("digits", {}).items():
            text = text.replace(spoken, digits)
        phrases.append({"text": text, "start": part["start"], "end": part["end"]})


class Caption:
    """Một cụm chữ hiện và tan nhẹ cả khối."""

    def __init__(self, text, size, font_path=FONT_BOLD, max_width=SAFE_RIGHT - SAFE_LEFT, color=CREAM, halo=False, outline=0):
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
            if max(width(r) for r in rows) > max_width:
                # Câu quá dài cho hai dòng: chia thêm dòng cho đến khi vừa khung an toàn.

                def fill(limit):
                    out, cur_row = [], []
                    for w in words:
                        if cur_row and width(cur_row + [w]) > limit:
                            out.append(cur_row)
                            cur_row = []
                        cur_row.append(w)
                    return out + [cur_row]

                rows = fill(max_width)
                # Cân bằng các dòng: hạ giới hạn đến khi số dòng tăng.
                limit = max_width
                while True:
                    limit -= 20
                    trial = fill(limit)
                    if len(trial) > len(rows):
                        break
                    rows = trial
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
        # Viền tối quanh chữ để đọc được cả trên nền sáng.
        self.rim = None
        if outline:
            k = cv2.getStructuringElement(cv2.MORPH_ELLIPSE, (2 * outline + 1, 2 * outline + 1))
            rim = cv2.GaussianBlur(cv2.dilate(alpha, k), (0, 0), 1.6)
            self.rim = np.clip(rim * 1.4, 0, 0.92)[..., None]
            self.shadow = np.clip(cv2.GaussianBlur(alpha, (0, 0), 14) * 2.4, 0, 0.88)[..., None]
        # Câu nhấn có quầng sáng ấm phía sau chữ.
        self.halo = cv2.GaussianBlur(alpha, (0, 0), 16)[..., None] * np.array([120, 84, 44], np.float32) if halo else None

    def draw(self, frame, y, opacity=1.0, reveal=1.0):
        if opacity <= 0:
            return
        region = frame[y : y + self.height]
        region *= 1 - self.shadow * opacity * min(reveal * 5, 1)
        shown = np.clip((reveal * 1.25 - self.order) / 0.25, 0, 1)[..., None]
        if self.rim is not None:
            region *= 1 - self.rim * shown * opacity
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


IMG, IMG_Y = 1260, 150  # ảnh vuông phủ gần hết vùng an toàn, chỉ tối dần ở đáy


def to_screen(ix, iy):
    return ix * IMG / 896 - (IMG // 2 - 515), iy * IMG / 896 + IMG_Y


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
        side = IMG
        fg = cv2.resize(image, (side, side), interpolation=cv2.INTER_CUBIC) * 0.92
        dp = cv2.resize(depth, (side, side))
        cover = cv2.resize(image, (H + 100, H + 100), interpolation=cv2.INTER_LINEAR)
        cover = cover[:, (H + 100 - (W + 100)) // 2 :][:, : W + 100]
        # Nền tối dần về phía dưới, chỗ mô tả của TikTok hiện lên.
        fall = np.clip(1 - (np.arange(H + 100, dtype=np.float32) - 1380) / 420, 0.12, 1)[:, None, None]
        bg = cv2.GaussianBlur(cover, (0, 0), 70) * 0.3 * fall
        edge = np.minimum(np.arange(side, dtype=np.float32) / 110, 1)
        ramp = edge * edge[::-1]
        feather = (ramp[:, None] * ramp[None, :])[..., None]
        # Khung nền rộng hơn màn hình 50px mỗi bên để còn chỗ cho hiệu ứng chiều sâu.
        x0, y0 = 515 + 50 - side // 2, IMG_Y + 50
        canvas = bg.copy()
        # Ảnh rộng hơn khung nên cắt hai mép ngang trước khi đặt vào nền.
        cut = max(-x0, 0)
        x0 = max(x0, 0)
        fg, feather, dp = fg[:, cut : side - cut], feather[:, cut : side - cut], dp[:, cut : side - cut]
        cw = fg.shape[1]
        canvas[y0 : y0 + side, x0 : x0 + cw] = fg * feather + canvas[y0 : y0 + side, x0 : x0 + cw] * (1 - feather)
        dmap = np.zeros(canvas.shape[:2], np.float32)
        dmap[y0 : y0 + side, x0 : x0 + cw] = dp * feather[..., 0]
        self.image, self.depth = canvas, cv2.GaussianBlur(dmap, (0, 0), 6)
        self.yy, self.xx = np.mgrid[0:H, 0:W].astype(np.float32)
        self.drift = fx.get("drift", drift)
        self.zoom0 = fx.get("zoom0", 0.0)
        self.parallax = fx.get("parallax", 0.06)
        self.fx = fx
        self.push = fx.get("push", 0.045)
        self.focus = to_screen(*fx["focus"]) if "focus" in fx else (515.0, IMG_Y + IMG / 2)
        self.dim = Keys(fx["dim"]) if "dim" in fx else None
        self.glows = [(g, Keys(g["keys"]) if "keys" in g else None, np.array(g["tint"], np.float32)) for g in fx.get("glows", [])]
        self.dust = [Dust(seed=seed + i, drift=True, **{"sigma": 2.6, **m}) for i, m in enumerate(fx.get("motes", []))]
        self.dust += [Dust(seed=seed + 50 + i, drift=False, sigma=1.7, **m) for i, m in enumerate(fx.get("twinkles", []))]
        self.travelers = [(t, at(*t["time"][0]), at(*t["time"][1])) for t in fx.get("travelers", [])]
        self.pan = fx.get("pan", [0, 0, 0, 0])
        # Mỗi vế đọc mới, máy nhích thêm một nhịp, nhờ vậy hình chuyển động theo lời.
        self.beats = [part["start"] for line in tl["lines"] if line["scene"] == name for part in line["parts"]][1:] if fx.get("beats", False) else []
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
            self.bulge = (bx, by, b["R"] * IMG / 896, Keys(b["keys"]))
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
            ramp = np.exp(-(((np.arange(H, dtype=np.float32) - y) / (d["sigma"] * IMG / 896)) ** 2))[:, None, None]
            self.dawn = ramp * np.array(d["color"], np.float32)
            self.dawn_keys = Keys(d["keys"])
        self.shut = None
        if "shut" in fx:
            d = fx["shut"]
            self.shut = (to_screen(*d["center"])[0], at(*d["from"]), at(*d["to"]), d["residual"])

    def place(self, ix, iy):
        zoom, pan_x, pan_y = self.last
        fx_, fy_ = self.focus
        sx, sy = to_screen(ix, iy)
        return fx_ + (sx - fx_ + pan_x) * zoom, fy_ + (sy - fy_ + pan_y) * zoom

    def backdrop(self, base):
        """Mặt nạ vùng sáng của ảnh gốc, để tia sáng chỉ cộng lên nền và không đè lên bóng người."""
        lo, hi = self.mask_dark
        lum = base.mean(axis=2)
        return np.clip((cv2.GaussianBlur(lum, (0, 0), 3) - lo) / (hi - lo), 0, 1)[..., None]

    def frame(self, p, sec):
        # Máy trôi chậm về phía chủ thể, mỗi cảnh một mức theo nội dung.
        pe = smooth(p) if self.fx.get("ease") else p
        zoom = 1.0 + self.zoom0 + self.push * pe
        fx_, fy_ = self.focus
        ease = smooth(p)
        pan_x = self.pan[0] + (self.pan[2] - self.pan[0]) * ease
        pan_y = self.pan[1] + (self.pan[3] - self.pan[1]) * ease
        if "intro_push" in self.fx:
            # Cú đẩy vào ở đầu cảnh 1: nhanh rồi chậm dần (fast + settle giây), giữ nguyên mức đã đẩy.
            d = self.fx["intro_push"]
            q = float(np.clip(sec / (d.get("fast", 0.3) + d.get("settle", 0.3)), 0, 1))
            zoom += d.get("amount", 0.06) * (1 - (1 - q) ** 3)
        for j, beat in enumerate(self.beats):
            step = smooth(float(np.clip((sec - beat) / 0.9, 0, 1)))
            zoom += 0.035 * step
            pan_x += (16 if j % 2 else -16) * step
        self.last = (zoom, pan_x, pan_y)
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
            return fx_ + (sx - fx_ + pan_x) * zoom, fy_ + (sy - fy_ + pan_y) * zoom

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



_fonts = {}


def font_of(size, bold):
    key = (size, bold)
    if key not in _fonts:
        _fonts[key] = ImageFont.truetype(FONT_BOLD if bold else FONT_REG, size)
    return _fonts[key]


def text_box(lines, size, fg, bg=None, pad=(34, 22), radius=30, bold=False, align="left", min_w=0):
    """Khung chữ RGBA dựng bằng PIL: trả về (rgb, alpha) dạng float."""
    font = font_of(size, bold)
    probe = ImageDraw.Draw(Image.new("L", (10, 10)))
    row = int(size * 1.34)
    w = int(max(max(probe.textlength(t, font=font) for t in lines) + 2 * pad[0], min_w))
    h = row * len(lines) + 2 * pad[1]
    img = Image.new("RGBA", (w, h), (0, 0, 0, 0))
    d = ImageDraw.Draw(img)
    if bg is not None:
        d.rounded_rectangle((0, 0, w - 1, h - 1), radius, fill=bg)
    for i, t in enumerate(lines):
        tw = probe.textlength(t, font=font)
        x = pad[0] if align == "left" else (w - tw) / 2
        d.text((x, pad[1] + i * row - size * 0.05), t, font=font, fill=fg)
    arr = np.asarray(img, np.float32)
    return arr[..., :3], arr[..., 3:] / 255


def blit(frame, box, x, y, opacity=1.0, shadow=0.0):
    rgb, a = box
    h, w = a.shape[:2]
    x0, y0 = int(x), int(y)
    cx0, cy0, cx1, cy1 = max(x0, 0), max(y0, 0), min(x0 + w, W), min(y0 + h, H)
    if cx0 >= cx1 or cy0 >= cy1 or opacity <= 0:
        return
    sl = (slice(cy0 - y0, cy1 - y0), slice(cx0 - x0, cx1 - x0))
    region = frame[cy0:cy1, cx0:cx1]
    if shadow > 0:
        sh = cv2.GaussianBlur(a[..., 0], (0, 0), 14)[sl][..., None]
        region *= 1 - np.clip(sh * shadow, 0, 0.8) * opacity
    region += (rgb[sl] - region) * a[sl] * opacity


def fade(sec, t0, t1, fin=0.3, fout=0.4):
    return float(np.clip(min((sec - t0) / fin, (t1 - sec) / fout), 0, 1))


_box_cache = {}


def cached_box(key, build):
    if key not in _box_cache:
        _box_cache[key] = build()
    return _box_cache[key]


def fmt_vnd(v):
    return f"{int(v):,}".replace(",", ".") + "đ"


def draw_overlays(scene, still, frame, sec):
    for ov in FX.get("overlays", []):
        if ov["scene"] != scene:
            continue
        kind = ov["type"]
        if kind in ("message", "notice", "call"):
            t0, t1 = at(*ov["show"]), at(*ov["hide"]) + ov.get("hold", 0)
            op = fade(sec, t0, t1)
            if op <= 0:
                continue
            if kind == "message":
                box = cached_box(ov["text"], lambda: text_box([ov["text"]], ov.get("size", 34), (28, 32, 38, 255), (236, 238, 241, 242), radius=34))
            elif kind == "notice":
                box = cached_box(ov["text"], lambda: text_box([ov["text"]], ov.get("size", 32), (240, 242, 245, 255), (14, 16, 22, 248), radius=30))
            else:
                box = cached_box(ov["text"], lambda: text_box(ov["text"].split("|"), ov.get("size", 36), (246, 240, 228, 255), (8, 10, 14, 190), pad=(30, 18), radius=28, align="center"))
            x, y = ov["at"]
            if x == "center":
                x = SAFE_CX - box[1].shape[1] / 2
            rise = 18 * (1 - smooth(float(np.clip((sec - t0) / 0.45, 0, 1)))) * (-1 if kind == "notice" else 1)
            blit(frame, box, x, y + rise, op, shadow=0.5)
        elif kind == "counter":
            t0 = at(*ov["start"])
            t1 = at(*ov["end"]) if "end" in ov else t0 + 1.0
            if sec < t0:
                continue
            q = 1.0 if ov.get("instant") else smooth(float(np.clip((sec - t0) / (t1 - t0), 0, 1)))
            value = round(ov["value"] * (1 - (1 - q) ** 3) / 1000) * 1000
            op = float(np.clip((sec - t0) / (0.25 if ov.get("instant") else 0.5), 0, 1))
            label = cached_box(("l", ov["label"]), lambda: text_box([ov["label"]], 36, (200, 206, 216, 255), None, pad=(10, 6), align="center", min_w=W))
            number = text_box([fmt_vnd(value)], ov.get("size", 96), (246, 240, 228, 255), None, pad=(10, 6), bold=True, align="center", min_w=W)
            blit(frame, label, 0, ov["y"], op * 0.9, shadow=0.7)
            blit(frame, number, 0, ov["y"] + 56, op, shadow=0.7)
        elif kind == "phone":
            tex = cached_box("phone", lambda: [text_box([ln["text"]], ov.get("size", 30), tuple(ov.get("color", (22, 40, 46))) + (255,), None, pad=(0, 0), bold=True) for ln in ov["lines"]])
            TW, TH = ov["tex"]
            layer = np.zeros((TH, TW, 4), np.float32)
            for i, (ln, (rgb, a)) in enumerate(zip(ov["lines"], tex)):
                op = float(np.clip((sec - at(*ln["at"])) / 0.35, 0, 1))
                if op <= 0:
                    continue
                h, w = a.shape[:2]
                y = int(ov.get("top", 10) + i * ov.get("row", 40))
                layer[y : y + h, 8 : 8 + w, :3] = rgb
                layer[y : y + h, 8 : 8 + w, 3:] = np.maximum(layer[y : y + h, 8 : 8 + w, 3:], a * op)
            if layer[..., 3].max() <= 0:
                continue
            src_pts = np.float32([[0, 0], [TW, 0], [TW, TH], [0, TH]])
            dst_pts = np.float32([still.place(p[0] * 0.875, p[1] * 0.875) for p in ov["quad"]])
            m = cv2.getPerspectiveTransform(src_pts, dst_pts)
            warped = cv2.warpPerspective(layer, m, (W, H), flags=cv2.INTER_LINEAR)
            frame += (warped[..., :3] - frame) * warped[..., 3:]
        elif kind == "end":
            t0 = at(*ov["start"]) + ov.get("delay", 0)
            op = smooth(float(np.clip((sec - t0) / ov.get("fade", 1.2), 0, 1)))
            if op > 0:
                cap = cached_box("end", lambda: Caption(ov["text"], ov.get("size", 54), halo=True))
                cap.draw(frame, ov["y"], op)


sub_layers = {p["text"]: Caption(p["text"].replace(",", ""), FX["emphasis"].get(p["text"], 56), halo=p["text"] in FX["emphasis"], outline=3) for p in phrases}
mark = Caption("@dark.sky.quotes", 28, FONT_REG, color=SOFT)

WM = None
if "watermark" in FX:
    # Tên kênh nhỏ và mờ ở góc trái dưới, chỉ vẽ khi fx.json có khóa "watermark".
    _wm = FX["watermark"]
    _font = ImageFont.truetype(FONT_REG, _wm.get("size", 30))
    _probe = ImageDraw.Draw(Image.new("L", (10, 10)))
    _tw = int(_probe.textlength(_wm["text"], font=_font)) + 8
    _m = Image.new("L", (_tw, int(_wm.get("size", 30) * 1.5)), 0)
    ImageDraw.Draw(_m).text((4, 2), _wm["text"], font=_font, fill=255)
    _a = np.asarray(_m, np.float32)[..., None] / 255
    WM = (_a, np.clip(cv2.GaussianBlur(_a[..., 0], (0, 0), 3) * 1.2, 0, 0.6)[..., None], _wm)
title = Caption("DarkSky Quotes", 92, halo=True)
if "card" in FX and "show" in FX["card"]:
    # Thẻ nhỏ một dòng đặt theo mốc (từ tập 6): "show" là mốc bắt đầu, "dur" là thời gian hiện.
    card_main = Caption(" · ".join(x for x in (FX["card"]["main"], FX["card"].get("sub")) if x), FX["card"].get("size", 34), halo=False)
    card_sub = None
elif "card" in FX:
    card_main = Caption(FX["card"]["main"], FX["card"].get("size", 66), halo=True)
    card_sub = Caption(FX["card"]["sub"], FX["card"].get("sub_size", 46), color=CREAM, halo=True) if FX["card"].get("sub") else None
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


def smooth_arr(x):
    return x * x * (3 - 2 * x)


def zoomed(frame, z, cx, cy):
    matrix = np.array([[z, 0, cx - z * cx], [0, z, cy - z * cy]], np.float32)
    return cv2.warpAffine(frame, matrix, (W, H), flags=cv2.INTER_LINEAR, borderMode=cv2.BORDER_REPLICATE)


def shifted(frame, dy):
    matrix = np.array([[1, 0, 0], [0, 1, dy]], np.float32)
    return cv2.warpAffine(frame, matrix, (W, H), flags=cv2.INTER_LINEAR, borderMode=cv2.BORDER_REPLICATE)


class HookRow:
    """Một dòng chữ hook: hiện dần từ mờ sang nét, sáng theo đốm sáng đi qua, cuối cùng tan như khói."""

    def __init__(self, text, size, y, weak=False, at=None, instant=False, leave=None):
        font = ImageFont.truetype(FONT_BOLD, size)
        probe = ImageDraw.Draw(Image.new("L", (10, 10)))
        self.height = int(size * 1.7)
        mask = Image.new("L", (W, self.height), 0)
        ImageDraw.Draw(mask).text((SAFE_CX - probe.textlength(text, font=font) / 2, int(size * 0.2)), text, font=font, fill=255)
        self.alpha = np.asarray(mask, np.float32) / 255
        self.y, self.weak = y, weak
        self.start = globals()["at"](*at) if at else -0.45
        # instant: chữ nét đủ ngay từ khung 0 (hook từ tập 6), không hiện dần.
        self.instant = instant
        if isinstance(leave, (int, float)):
            self.leave = float(leave)  # giây tuyệt đối (từ tập 7)
        else:
            self.leave = globals()["at"](*leave) if leave else tl["lines"][0]["end"] + 0.1

    def draw(self, frame, sec, light_x):
        t = sec - self.start
        if t < 0:
            return
        come = 1.0 if self.instant else smooth(min(t / 0.75, 1))
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


def defocus(img, sigma):
    """Làm nhòe nhanh: thu nhỏ, làm mờ rồi phóng lại, đủ cho chuyển cảnh mất nét."""
    if sigma < 0.6:
        return img
    small = cv2.resize(img, (W // 4, H // 4), interpolation=cv2.INTER_AREA)
    small = cv2.GaussianBlur(small, (0, 0), sigma / 4)
    return cv2.resize(small, (W, H), interpolation=cv2.INTER_LINEAR)


_gx, _gy = np.meshgrid(np.linspace(0, 1, W, dtype=np.float32), np.linspace(0, 1, H, dtype=np.float32))
WIPE_EDGE = 0.55 * _gx + 0.45 * (1 - _gy)  # quét chéo từ góc dưới trái lên


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
    still = stills[span["scene"]]
    frame = still.frame(p, sec)
    draw_overlays(span["scene"], still, frame, sec)
    return frame



_brush_cache = {}


def brush_mask(w, seed=7, angle=-7.0, direction=1):
    """Chuyển cảnh vệt cọ sơn dầu: cảnh mới hiện theo một vệt cọ dày quét ngang, mép là sợi lông cọ (nhiễu cố định theo seed).
    w từ 0 đến 1 (đã ease). direction 1 là trái sang phải, -1 là phải sang trái. angle là độ nghiêng của vệt (độ).
    Tính ở độ phân giải thấp (270x480) rồi phóng lên."""
    key = (seed, angle, direction)
    if key not in _brush_cache:
        LW, LH = 270, 480
        g = np.random.default_rng(seed)
        yy, xx = np.mgrid[0:LH, 0:LW].astype(np.float32)
        xx, yy = xx / LW - 0.5, (yy / LH - 0.5) * (LH / LW)
        a = np.deg2rad(angle)
        u = xx * np.cos(a) + yy * np.sin(a)
        v = -xx * np.sin(a) + yy * np.cos(a)
        u = (u - u.min()) / (u.max() - u.min())
        if direction < 0:
            u = 1 - u
        vn = (v - v.min()) / (v.max() - v.min())

        def line_noise(knots, amp):
            vals = g.normal(0, 1, knots + 3).astype(np.float32)
            xk = np.linspace(0, 1, knots + 3)
            return np.interp(vn, xk, vals) * amp

        # Sợi lông cọ chạy dọc hướng quét: mỗi sợi đi trước hoặc sau một đoạn khác nhau.
        off = line_noise(7, 0.07) + line_noise(36, 0.05) + line_noise(150, 0.035)
        blob = cv2.GaussianBlur(g.normal(0, 1, (LH, LW)).astype(np.float32), (0, 0), 9)
        off += blob / (blob.std() + 1e-6) * 0.03
        off -= off.mean()
        _brush_cache[key] = (u, off.astype(np.float32), float(np.abs(off).max()))
    u, off, mx = _brush_cache[key]
    edge = 0.035
    margin = mx + edge
    s = w * (1 + 2 * margin) - margin
    m = np.clip((s - u + off) / edge + 0.5, 0, 1)
    m = cv2.resize(m, (W, H), interpolation=cv2.INTER_CUBIC)
    return np.clip(cv2.GaussianBlur(m, (0, 0), 1.5), 0, 1)[..., None]


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
        if mode == "blur":
            # Mất nét rồi lấy nét lại, như đang nhớ lại.
            sig = fx.get("blur", 26)
            frame, before = defocus(frame, sig * (1 - w)), defocus(before, sig * w)
        elif mode == "brush":
            m = brush_mask(w, fx.get("seed", 7), fx.get("angle", -7.0), fx.get("dir", 1))
            frame = frame * m + before * (1 - m)
        elif mode == "wipe":
            m = smooth_arr(np.clip((w * 1.7 - WIPE_EDGE) / 0.6, 0, 1))[..., None]
            frame = frame * m + before * (1 - m)
        elif mode == "dip":
            # Tối hẳn một nhịp rồi sáng lên, để cảnh trước kịp lắng.
            a, b = smooth(min(w * 2, 1)), smooth(max(w * 2 - 1, 0))
            frame = before * (1 - a) + frame * b
        if mode not in ("wipe", "dip", "brush"):
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
    if "card" in FX and "show" in FX["card"]:
        c = FX["card"]
        t0 = at(*c["show"]) if isinstance(c["show"], list) else float(c["show"])
        t1 = t0 + c.get("dur", 1.5)
        op = min(max((sec - t0) / 0.3, 0.0), max((t1 - sec) / 0.4, 0.0), 1.0)
        if op > 0:
            card_main.draw(frame, c.get("y", 230), smooth(op))
    elif "card" in FX:
        # Thẻ tên series hiện ngay từ khung đầu, mờ đi sau câu đọc đầu tiên.
        c = FX["card"]
        away = smooth(float(np.clip((sec - (tl["lines"][0]["end"] + c.get("hold", 0.3))) / 0.9, 0, 1)))
        card_main.draw(frame, c["y"], 1 - away)
        if card_sub:
            card_sub.draw(frame, c["y"] + c["gap"], 1 - away)
        # Vệt sáng vàng lướt qua tên series một lần rồi quầng sáng thở chậm.
        glint = float(np.clip((sec - 0.15) / 1.7, 0, 1))
        centre = -260 + (W + 520) * smooth(glint)
        band = np.exp(-(((np.arange(W, dtype=np.float32) - centre) / 150) ** 2))[None, :, None] * float(np.sin(np.pi * glint))
        pulse = 0.55 + 0.45 * np.sin(sec * 2.2)
        for cap, y in ((card_main, c["y"]), (card_sub, c["y"] + c["gap"])):
            if cap is None:
                continue
            region = frame[y : y + cap.height]
            region += cap.alpha * band * np.array([150, 120, 70], np.float32) * (1 - away)
            if cap.halo is not None:
                region += cap.halo * band * 4.0 * (1 - away)
            region += cap.halo * pulse * 0.5 * (1 - away) if cap.halo is not None else 0
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
            sub_layers[ph["text"]].draw(frame, SCENE_FX.get(cur["scene"], {}).get("sub_y", SUB_Y) + rise, opacity, reveal)
            break
    if WM is not None:
        _a, _sh, _w = WM
        x0, y0 = _w.get("x", SAFE_LEFT), _w.get("y", 1395)
        reg = frame[y0 : y0 + _a.shape[0], x0 : x0 + _a.shape[1]]
        reg *= 1 - _sh * _w.get("opacity", 0.45)
        reg += (np.array([235, 232, 225], np.float32) - reg) * _a * _w.get("opacity", 0.45)
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

if FX.get("no_music") and not args.mix_video:
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
             "-i", str(EP / "audio" / "narration.wav"),
             "-filter_complex", "[1:a]aformat=channel_layouts=stereo,afade=t=out:st=%.2f:d=1.0[a]" % (DURATION - 1.0),
             "-map", "0:v", "-map", "[a]", "-c:v", "copy", "-c:a", "aac", "-b:a", "192k", "-shortest", str(EP / "output.mp4")],
            check=True,
        )
    print(f"done in {time.time() - started:.0f}s")
    raise SystemExit

# Nhạc nền dựng bằng code: piano thưa trên nền dây rất nhẹ, có vang như phòng rộng.
SR = 48000
n = int(DURATION * SR)
BAR = 8.0
# Hợp âm Am, F, C, G: nốt trầm và các nốt phía trên, tính theo số MIDI.
CHORD_BOOK = {
    "Am": (45, [57, 60, 64, 69, 72]),
    "F": (41, [53, 57, 60, 65, 69]),
    "Dm": (38, [50, 57, 62, 65, 69]),
    "C": (48, [55, 60, 64, 67, 72]),
    "G": (43, [55, 59, 62, 67, 71]),
}
CHORDS = [CHORD_BOOK[c] for c in FX.get("chords", ["Am", "F", "C", "G"])]
# Khoảng không đánh nốt rải, chỉ để dây ngân (rút nhạc ở câu nặng).
QUIET = [(at(*a), at(*b)) for a, b in FX.get("quiet", [])]
rng = np.random.default_rng(5)
piano = np.zeros(n + SR * 8, np.float32)
strings = np.zeros(n + SR * 8, np.float32)


def hz(m):
    return 440 * 2 ** ((m - 69) / 12)


def play(start, m, vel, force=False):
    """Nốt piano mềm: nhiều họa âm hơi lệch, họa âm cao tắt nhanh, đánh càng nhẹ càng ấm."""
    if not force and any(a <= start < b for a, b in QUIET):
        return
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


SPARSE = FX.get("music_sparse", 1.0)  # nhân xác suất đánh nốt rải, nhỏ hơn 1 là thưa hơn
LOWSHIFT = 12 if FX.get("music_low") else 0  # hạ nốt rải xuống một quãng tám
last_at = at(*FX["music_end"])
busy_at = at(*FX["music_busy"])
for c in range(0 if FX.get("music_v2") else int(last_at / BAR) + 1):
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
        if start + beat < last_at - 0.5 and rng.random() < chance * SPARSE:
            play(start + beat + rng.uniform(-0.05, 0.05), int(rng.choice(tones)) - LOWSHIFT, rng.uniform(0.28, 0.46))
    if busy and c % 2 == 0:
        # Một câu nhạc ngắn ở quãng cao, chỉ vài nốt.
        for j, step in enumerate(rng.choice(tones[2:], 3)):
            when = start + 4.0 + j * 1.5 + rng.uniform(-0.06, 0.06)
            if when < last_at - 0.5:
                play(when, int(step) + 12, rng.uniform(0.3, 0.42))
if FX.get("music_v2"):
    # Nhạc v2: piano rải đều như nhịp thở, nền dây ấm kiểu cello, thêm giai điệu ngắn ở đoạn dày.
    STEP = FX.get("music_step", 0.8)
    PATTERN = FX.get("music_pattern", [0, 2, 3, 2, 4, 3, 2, 3, 1, 2])
    pad_rng = np.random.default_rng(17)

    def warm(freq, tt, hmax=2800.0):
        """Âm ấm: họa âm cao tắt dần theo tần số, ba bản lệch nhẹ như dàn dây."""
        out = np.zeros(len(tt), np.float32)
        for d in (0.9975, 1.0, 1.0028):
            for k in range(1, 12):
                if freq * k > hmax:
                    break
                out += np.sin(2 * np.pi * freq * d * k * tt + k * 1.7 + d * 30) / k**1.25
        return out

    def hammer(start, m, vel):
        """Tiếng búa chạm dây rất nhẹ ở đầu nốt piano để nghe như piano thật."""
        i0 = max(int(start * SR), 0)
        L = int(0.05 * SR)
        x = pad_rng.normal(0, 1, L).astype(np.float32)
        x = np.convolve(x, np.ones(6, np.float32) / 6, "same") * np.exp(-np.arange(L) / SR * 90)
        piano[i0 : i0 + L] += x * vel * 0.06

    for c in range(int(last_at / BAR) + 1):
        start = c * BAR
        if start >= last_at:
            break
        bass, tones = CHORDS[c % len(CHORDS)]
        tt = np.arange(int((BAR + 5) * SR), dtype=np.float32) / SR
        # Nền dây ấm: ba nốt hợp âm, vào chậm ra chậm, nối liền sang hợp âm sau.
        env = np.clip(tt / 2.2, 0, 1) ** 1.6 * np.clip((BAR + 5 - tt) / 3.5, 0, 1) ** 1.4
        pad = sum(warm(hz(m), tt) for m in (tones[0], tones[2], tones[3])) * env
        # Cello trầm có rung nhẹ.
        vib = 1 + 0.004 * np.sin(2 * np.pi * 5.2 * tt) * np.clip(tt / 1.5, 0, 1)
        cello = warm(hz(bass) * 1.0, tt * vib, 900.0) * 1.8 * env
        i0 = int(start * SR)
        strings[i0 : i0 + len(tt)] += (pad + cello).astype(np.float32)
        play(start, bass, 0.5)
        play(start + 0.02, bass + 12, 0.34)
        busy = start >= busy_at
        chance = float(np.clip(SPARSE * 1.25, 0.3, 1.0)) if not busy else 0.95
        steps = int((BAR - 0.4) / STEP)
        for j in range(steps):
            when = start + 0.4 + j * STEP
            if when >= last_at - 0.5 or rng.random() > chance:
                continue
            idx = PATTERN[j % len(PATTERN)]
            soft = 0.34 if j % 5 else 0.44  # nhấn nhẹ nốt đầu mỗi nhóm năm
            note = int(tones[idx]) - LOWSHIFT
            when += rng.uniform(-0.012, 0.012)
            play(when, note, soft * rng.uniform(0.85, 1.1))
            if not any(a <= when < b for a, b in QUIET):
                hammer(when, note, soft)
        if busy and c % 2 == 0:
            for j, step in enumerate((tones[4], tones[3], tones[4])):
                when = start + 1.6 + j * 1.9
                if when < last_at - 0.5:
                    play(when, int(step) + 12, 0.34)

# Kết bằng một hợp âm trưởng rải chậm đúng câu cuối (bản thiết kế mới bỏ).
if FX.get("final_arpeggio", True):
    for j, m in enumerate((48, 60, 64, 67, 72, 76)):
        play(last_at + j * 0.16, m, 0.5)
# Nốt lẻ đặt tay, ví dụ một nốt trầm trong khoảng nghỉ.
for nt in FX.get("notes", []):
    play(at(*nt["at"]) + nt.get("delay", 0.0), nt["m"], nt["vel"], force=True)
# Nhạc đề: mỗi nốt một chữ của câu "Con không sao đâu má", nốt cuối ngân tới hết video.
if "theme" in FX:
    th = FX["theme"]
    for j, m in enumerate(th["notes"][: th.get("count", len(th["notes"]))]):
        play(last_at + th.get("delay", 0.0) + j * th.get("gap", 1.0), m, th.get("vel", 0.55), force=True)

dry = piano[: n + SR * 4] + strings[: n + SR * 4] * (FX.get("strings_gain", 1.0) * 0.05 * np.abs(piano).max() / max(np.abs(strings).max() / 9, 1e-6) / 9)
# Vang dựng từ nhiễu tắt dần, hai kênh khác nhau cho rộng.
verb_rng = np.random.default_rng(11)
length = int((4.8 if FX.get("music_v2") else 3.6) * SR)
decay = np.exp(-np.arange(length, dtype=np.float32) / SR * (1.5 if FX.get("music_v2") else 2.0))
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
     "-af", f"highpass=f={FX.get("music_highpass", 70)},lowpass=f={9000 if FX.get("music_v2") else 6500},afade=t=in:d=0.6,afade=t=out:st={DURATION - FX.get("music_fade", 3.0):.2f}:d={FX.get("music_fade", 3.0)}", str(music_path)],
    input=stereo.astype(np.float32).tobytes(),
    check=True,
)
# Đo độ to thật của nhạc rồi chỉnh về mức đặt trong fx.json.
report = subprocess.run(["ffmpeg", "-hide_banner", "-i", str(music_path), "-af", "ebur128", "-f", "null", "-"], capture_output=True, text=True).stderr
music_lufs = float(report.rsplit("I:", 1)[1].split("LUFS")[0])
music_gain = 10 ** ((FX["music_lufs"] - music_lufs) / 20)
print(f"music {music_lufs:.1f} LUFS, gain {music_gain:.2f}")

# Âm thanh hiện trường dựng bằng code: mưa, xe, bút, chuông thang máy, điện thoại... đặt theo mốc lời đọc.
def build_sfx():
    n = int(DURATION * SR)
    out = np.zeros((n, 2), np.float32)
    g = np.random.default_rng(23)

    def band(x, lo, hi):
        spec = np.fft.rfft(x)
        f = np.fft.rfftfreq(len(x), 1 / SR)
        spec *= ((f >= lo) & (f <= hi)).astype(np.float32)
        y = np.fft.irfft(spec, len(x)).astype(np.float32)
        return y / (np.sqrt(np.mean(y**2)) + 1e-9)

    def put(x, t0, gain=1.0, pan=0.0):
        i0 = int(t0 * SR)
        if i0 < 0:
            x, i0 = x[-i0:], 0
        x = x[: max(0, n - i0)]
        out[i0 : i0 + len(x), 0] += x * gain * (1 - max(pan, 0))
        out[i0 : i0 + len(x), 1] += x * gain * (1 + min(pan, 0))

    def env_fade(m, fin, fout):
        e = np.ones(m, np.float32)
        a, b = int(fin * SR), int(fout * SR)
        if a:
            e[:a] = np.linspace(0, 1, a) ** 1.5
        if b:
            e[-b:] *= np.linspace(1, 0, b) ** 1.5
        return e

    def bed(t0, t1, kind, gain):
        m = int((t1 - t0) * SR)
        if m <= 0:
            return
        t = np.arange(m) / SR
        if kind == "rain":
            x = band(g.normal(0, 1, m).astype(np.float32), 1800, 9000) * 0.8 + band(g.normal(0, 1, m).astype(np.float32), 80, 500) * 0.5
        elif kind == "traffic":
            sw = band(g.normal(0, 1, m).astype(np.float32), 0.05, 0.6)
            x = band(g.normal(0, 1, m).astype(np.float32), 60, 280) * (0.7 + 0.3 * sw)
            x += 0.25 * band(g.normal(0, 1, m).astype(np.float32), 300, 1200) * np.clip(sw, 0, 1)
        elif kind == "wind":
            sw = band(g.normal(0, 1, m).astype(np.float32), 0.04, 0.4)
            x = band(g.normal(0, 1, m).astype(np.float32), 180, 900) * (0.65 + 0.35 * sw) + 0.5 * band(g.normal(0, 1, m).astype(np.float32), 50, 200)
        elif kind == "hum":
            x = np.sin(2 * np.pi * 100 * t) * 0.6 + np.sin(2 * np.pi * 200 * t) * 0.25 + 0.2 * band(g.normal(0, 1, m).astype(np.float32), 100, 400)
        else:
            return
        put(x.astype(np.float32) * env_fade(m, 1.4, 1.6), t0, gain, 0.0)

    def tone(freq, dur, decay):
        t = np.arange(int(dur * SR)) / SR
        return np.sin(2 * np.pi * freq * t) * np.exp(-t * decay)

    for e in FX.get("sfx", []):
        kind, gain = e["type"], e.get("gain", 1.0)
        t0 = at(*e["at"]) + e.get("delay", 0.0)
        if kind in ("rain", "traffic", "wind", "hum"):
            t1 = at(*e["end"]) + e.get("end_delay", 0.0) if "end" in e else DURATION
            bed(t0, t1, kind, gain)
        elif kind == "pen":
            t1 = at(*e["end"]) + e.get("end_delay", 0.0)
            tt = t0
            while tt < t1 - 0.1:
                seg = float(g.uniform(0.12, 0.3))
                m = int(seg * SR)
                x = band(g.normal(0, 1, m).astype(np.float32), 2500, 7500) * np.sin(np.pi * np.arange(m) / m) ** 2
                put(x, tt, gain)
                tt += seg + float(g.uniform(0.02, 0.09))
        elif kind == "typing":
            t1 = at(*e["end"])
            tt = t0
            while tt < t1:
                m = int(0.03 * SR)
                x = band(g.normal(0, 1, m).astype(np.float32), 1500, 6000) * np.exp(-np.arange(m) / SR * 160)
                put(x, tt, gain * float(g.uniform(0.5, 1.0)), float(g.uniform(-0.2, 0.2)))
                tt += float(g.uniform(0.06, 0.26))
        elif kind == "chime":
            put(tone(1318.5, 1.6, 3.2) * 0.6 + tone(1760, 1.6, 3.6) * 0.4, t0, gain)
        elif kind == "buzz":
            for k in range(2):
                m = int(0.22 * SR)
                t = np.arange(m) / SR
                x = np.sign(np.sin(2 * np.pi * 160 * t)) * 0.4 * (0.6 + 0.4 * np.sin(2 * np.pi * 28 * t)) * np.sin(np.pi * t / 0.22) ** 0.5
                put(x.astype(np.float32), t0 + k * 0.3, gain)
        elif kind == "pop":
            put(tone(880, 0.45, 11) * 0.7 + tone(1320, 0.45, 9) * 0.5, t0, gain)
            put(tone(1320, 0.4, 10) * 0.6, t0 + 0.14, gain)
        elif kind == "ring":
            for k in range(e.get("count", 2)):
                m = int(0.9 * SR)
                t = np.arange(m) / SR
                x = (np.sin(2 * np.pi * 440 * t) + np.sin(2 * np.pi * 480 * t)) * (0.5 + 0.5 * np.sin(2 * np.pi * 18 * t)) * env_fade(m, 0.02, 0.06)
                put(x.astype(np.float32) * 0.5, t0 + k * 1.5, gain)
        elif kind == "click":
            m = int(0.04 * SR)
            put(band(g.normal(0, 1, m).astype(np.float32), 800, 5000) * np.exp(-np.arange(m) / SR * 120), t0, gain)
        elif kind == "whoosh":
            d = e.get("dur", 0.9)
            m = int(d * SR)
            x = band(g.normal(0, 1, m).astype(np.float32), e.get("lo", 400), e.get("hi", 3500)) * np.sin(np.pi * np.arange(m) / m) ** 2
            put(x, t0, gain, e.get("pan", 0.0))
        elif kind == "thud":
            m = int(1.4 * SR)
            t = np.arange(m) / SR
            put(np.sin(2 * np.pi * (52 - 14 * t) * t) * np.exp(-t * 3.2), t0, gain)
        elif kind == "knock":
            for k, dt in enumerate(e.get("times", [0.0, 0.42, 0.84])):
                m = int(0.35 * SR)
                t = np.arange(m) / SR
                x = np.sin(2 * np.pi * 170 * t) * np.exp(-t * 24) + 0.5 * np.sin(2 * np.pi * 340 * t) * np.exp(-t * 34)
                x += 0.6 * band(g.normal(0, 1, m).astype(np.float32), 500, 3000) * np.exp(-t * 90)
                put(x.astype(np.float32), t0 + dt, gain * (1.0 - 0.1 * k))
        elif kind == "keys":
            tt = t0
            for k in range(e.get("count", 7)):
                m = int(0.5 * SR)
                f0 = float(g.uniform(2400, 4200))
                x = (tone(f0, 0.5, 14) + 0.5 * tone(f0 * 1.51, 0.5, 18))[:m]
                put(x.astype(np.float32), tt, gain * float(g.uniform(0.4, 0.8)), float(g.uniform(-0.3, 0.3)))
                tt += float(g.uniform(0.05, 0.16))
        elif kind == "moto":
            d = e.get("dur", 4.0)
            m = int(d * SR)
            t = np.arange(m) / SR
            env = np.sin(np.pi * t / d) ** 2
            f = 70 + 35 * env
            x = (np.sign(np.sin(2 * np.pi * np.cumsum(f) / SR)) * 0.5 + np.sin(2 * np.pi * np.cumsum(f * 2) / SR) * 0.3) * (0.7 + 0.3 * np.sin(2 * np.pi * 14 * t))
            x = band(x.astype(np.float32), 60, 700) * env
            put(x.astype(np.float32), t0, gain, e.get("pan", 0.0))
    out *= np.clip((DURATION - np.arange(n) / SR) / 1.2, 0, 1)[:, None].astype(np.float32)
    return out


sfx_path = None
if FX.get("sfx"):
    sfx = build_sfx()
    sfx_path = EP / "audio" / "sfx.wav"
    sf.write(sfx_path, sfx * 0.1, SR, subtype="FLOAT")
    sfx_report = subprocess.run(["ffmpeg", "-hide_banner", "-i", str(sfx_path), "-af", "ebur128", "-f", "null", "-"], capture_output=True, text=True).stderr
    sfx_lufs = float(sfx_report.rsplit("I:", 1)[1].split("LUFS")[0])
    sfx_gain = 10 ** ((FX.get("sfx_lufs", -30) - sfx_lufs) / 20)  # file đã nhân 0.1 để khỏi vỡ tiếng
    print(f"sfx {sfx_lufs:.1f} LUFS, gain {sfx_gain:.2f}")

MIX = f"[2:a]volume={music_gain:.3f}[m];[1:a]asplit=2[v][key];[m][key]sidechaincompress=threshold=0.04:ratio=2.5:attack=60:release=700[duck];[v][duck]amix=inputs=2:duration=first:normalize=0[vm]"
if sfx_path:
    # Âm hiện trường hạ theo giọng như nhạc, cắt dải cao để không rít, chỉ nổi lên trong khoảng nghỉ.
    MIX = MIX.replace("asplit=2[v][key]", "asplit=3[v][key][key2]")
    MIX = MIX + f";[3:a]lowpass=f=5000,volume={sfx_gain:.3f}[fx0];[fx0][key2]sidechaincompress=threshold=0.01:ratio=20:attack=20:release=500[fx];[vm][fx]amix=inputs=2:duration=first:normalize=0,alimiter=limit=0.84:level=disabled[a]"
else:
    MIX = MIX + ";[vm]alimiter=limit=0.84:level=disabled[a]"
if "master_lufs" in FX:
    # Chỉnh tổng âm lượng về đích trong fx.json (từ tập 6: -14), đỉnh dưới -1 dBTP.
    MIX = MIX[: MIX.rindex("[a]")] + f"[a0];[a0]loudnorm=I={FX['master_lufs']}:TP={FX.get('master_tp', -1.5)}:LRA={FX.get('master_lra', 9)},aresample=48000,alimiter=limit=0.89:level=disabled[a]"
SFX_IN = ["-i", str(sfx_path)] if sfx_path else []
if args.mix_video:
    subprocess.run(
        ["ffmpeg", "-y", "-v", "error", "-i", str(args.mix_video), "-i", str(EP / "audio" / "narration.wav"), "-i", str(music_path), *SFX_IN,
         "-filter_complex", MIX, "-map", "0:v", "-map", "[a]", "-c:v", "copy", "-c:a", "aac", "-b:a", "192k", "-shortest", str(args.out)],
        check=True,
    )
    print("mixed", args.out)
    raise SystemExit

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
         "-i", str(EP / "audio" / "narration.wav"), "-i", str(music_path), *SFX_IN,
         "-filter_complex", MIX,
         "-map", "0:v", "-map", "[a]", "-c:v", "copy", "-c:a", "aac", "-b:a", "192k", "-shortest", str(EP / "output.mp4")],
        check=True,
    )
print(f"done in {time.time() - started:.0f}s")
