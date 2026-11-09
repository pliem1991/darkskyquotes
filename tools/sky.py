"""Bầu trời sao dựng bằng code: Ngân Hà, sao lấp lánh, đồi và người gác đêm cầm đèn."""
import cv2
import numpy as np
from PIL import Image, ImageDraw, ImageFilter

W, H = 1080, 1920
PAD = 2600
SPIN = 0.006  # rad/giây


def _noise(rng, size, octaves=7, base=6):
    total = np.zeros((size, size), dtype=np.float32)
    for o in range(octaves):
        n = base * 2**o
        layer = cv2.resize(rng.random((n, n)).astype(np.float32), (size, size), interpolation=cv2.INTER_CUBIC)
        total += layer / 1.7**o
    return (total - total.min()) / (total.max() - total.min())


class Sky:
    def __init__(self, seed=7, stars=22000):
        rng = np.random.default_rng(seed)
        yy, xx = np.mgrid[0:PAD, 0:PAD].astype(np.float32)
        across = ((xx - PAD / 2) * 0.72 + (yy - PAD / 2) * 0.69) / 380
        glow = np.exp(-(across**2))
        dust = np.clip(_noise(rng, PAD) * 2.3 - 0.75, 0, 1)
        self.band = (glow * dust).astype(np.float32)
        del yy, xx

        t = np.linspace(0, 1, H, dtype=np.float32)[:, None, None]
        grad = (1 - t) * np.array([2, 4, 12], np.float32) + t * np.array([14, 24, 46], np.float32)
        self.base = np.broadcast_to(grad, (H, W, 3)).copy()

        # Tâm quay ngoài khung. Gần một nửa số sao gom theo dải Ngân Hà cho có mật độ thật.
        self.pole = np.array([W * 0.7, -500.0], np.float32)
        px = rng.random(stars) * 3600 - 1800
        py = rng.random(stars) * 3600 - 1800
        along = rng.normal(0, 240, stars // 2)
        spread = rng.random(stars // 2) * 3600 - 1800
        px[: stars // 2] = W / 2 + along * 0.72 - spread * 0.69
        py[: stars // 2] = H / 2 + along * 0.69 + spread * 0.72
        dx, dy = px - self.pole[0], py - self.pole[1]
        self.radius = np.hypot(dx, dy).astype(np.float32)
        self.theta = np.arctan2(dy, dx).astype(np.float32)
        order = rng.permutation(stars)
        self.radius, self.theta = self.radius[order], self.theta[order]
        self.mag = (rng.pareto(2.1, stars) * 0.75 + 0.18).astype(np.float32)
        self.color = rng.choice(
            np.array([[255, 244, 232], [214, 228, 255], [255, 222, 190], [255, 255, 255]], np.float32),
            stars,
            p=[0.35, 0.4, 0.1, 0.15],
        )
        self.phase = (rng.random(stars) * 2 * np.pi).astype(np.float32)
        self.speed = rng.uniform(1.5, 5, stars).astype(np.float32)
        self.stars = np.zeros((H, W, 3), np.float32)

        # Chân trời đặt cao để người gác đêm nằm trên vùng mô tả của TikTok.
        mask = Image.new("L", (W, H), 0)
        draw = ImageDraw.Draw(mask)
        ridge = 1400 + 34 * np.sin(np.linspace(0, 4.2, 200)) + 14 * np.sin(np.linspace(0, 13, 200))
        draw.polygon([(i * W / 199, float(y)) for i, y in enumerate(ridge)] + [(W, H), (0, H)], fill=255)
        fx, fy = 300, int(ridge[55]) + 6
        draw.polygon([(fx - 30, fy), (fx + 30, fy), (fx + 19, fy - 132), (fx - 19, fy - 132)], fill=255)
        draw.ellipse([fx - 18, fy - 170, fx + 18, fy - 132], fill=255)
        draw.line([(fx + 16, fy - 108), (fx + 66, fy - 76)], fill=255, width=8)
        mask_arr = np.asarray(mask.filter(ImageFilter.GaussianBlur(0.8)), np.float32)[..., None] / 255
        self.sky_mask = 1 - mask_arr
        self.ground = np.array([4, 5, 9], np.float32) * mask_arr

        self.head = (fx, fy - 151)
        cx, cy = fx + 68, fy - 66
        self.lamp_center = (cx, cy)
        self.lamp_box = (max(cy - 600, 0), min(cy + 600, H), max(cx - 600, 0), min(cx + 600, W))
        y0, y1, x0, x1 = self.lamp_box
        ly, lx = np.mgrid[y0:y1, x0:x1].astype(np.float32)
        d2 = (lx - cx) ** 2 + (ly - cy) ** 2
        self.lamp = np.exp(-d2 / (2 * 54**2))[..., None] * np.array([130, 78, 28], np.float32)
        self.lamp += np.exp(-d2 / (2 * 9**2))[..., None] * np.array([255, 205, 130], np.float32)
        self.lamp_wide = np.exp(-d2 / (2 * 150**2))[..., None] * np.array([46, 26, 8], np.float32)

    def locate(self, x, y, sec):
        """Vị trí trên màn hình ở giây `sec` của điểm trời đang ở (x, y) lúc giây 0."""
        r = np.hypot(x - self.pole[0], y - self.pole[1])
        a = np.arctan2(y - self.pole[1], x - self.pole[0]) + sec * SPIN
        return float(self.pole[0] + r * np.cos(a)), float(self.pole[1] + r * np.sin(a))

    def frame(self, sec, density=0.7, boost=1.0, lamp=1.0, extra=None, reveal=None):
        angle = sec * SPIN
        n = int(len(self.mag) * density)
        x = (self.pole[0] + self.radius[:n] * np.cos(self.theta[:n] + angle)).astype(np.int32)
        y = (self.pole[1] + self.radius[:n] * np.sin(self.theta[:n] + angle)).astype(np.int32)
        keep = (x >= 0) & (x < W) & (y >= 0) & (y < H)
        twinkle = 0.75 + 0.25 * np.sin(self.phase[:n] + self.speed[:n] * sec)
        bright = np.minimum((self.mag[:n] * twinkle)[keep], 1.6) * boost

        self.stars.fill(0)
        np.add.at(self.stars, (y[keep], x[keep]), self.color[:n][keep] * bright[:, None])
        star_img = np.clip(self.stars, 0, 255).astype(np.uint8)
        halo = cv2.GaussianBlur(star_img, (0, 0), 2.6)
        core = cv2.GaussianBlur(star_img, (0, 0), 0.8)

        rot = cv2.getRotationMatrix2D((PAD / 2, PAD / 2), np.degrees(angle), 1.0)
        rot[0, 2] -= (PAD - W) / 2
        rot[1, 2] -= (PAD - H) / 2
        mw = cv2.warpAffine(self.band, rot, (W, H), flags=cv2.INTER_LINEAR)

        glow = mw[..., None] * (np.array([58, 60, 80], np.float32) * min(boost, 1.3))
        glow += core.astype(np.float32) * 1.9
        glow += halo.astype(np.float32) * 2.6
        # reveal là mặt nạ cho sao và Ngân Hà hiện dần theo từng vùng.
        frame = self.base + (glow if reveal is None else glow * reveal)
        if extra is not None:
            frame += extra
        frame *= self.sky_mask
        frame += self.ground
        if lamp > 0:
            y0, y1, x0, x1 = self.lamp_box
            flicker = 0.92 + 0.08 * np.sin(sec * 9) * np.sin(sec * 3.7)
            frame[y0:y1, x0:x1] += (self.lamp + self.lamp_wide * lamp) * (min(lamp, 1.0) * flicker)
        return frame
