import sys; sys.path.insert(0, r"D:\AI\Tiktok\darkskyquotes\tools")
import lowload  # noqa
import numpy as np, cv2
nen = sys.argv[1] if len(sys.argv) > 1 else "nen1.png"
out = sys.argv[2] if len(sys.argv) > 2 else "ket-qua.jpg"
img = cv2.imread("goc.jpg"); H, W = img.shape[:2]
a = cv2.imread("mask_final.png", 0)
# dọn vài mảng nền dính vào: hộp vàng sau đầu bố, tấm thảm hoa cạnh bàn chân
a[:350, 740:782] = 0
poly = np.array([[380 + x, 800 + y] for x, y in [(0, 0), (200, 0), (205, 95), (130, 160), (85, 215), (80, 262), (120, 290), (0, 325)]], np.int32)
cut = np.zeros_like(a); cv2.fillPoly(cut, [poly], 255)
a[cut > 0] = 0
a = cv2.GaussianBlur(a, (0, 0), 1.2)
bg = cv2.imread(nen); bh, bw = bg.shape[:2]
th = int(bw * 9 / 16); y0 = (bh - th) // 2
bg = cv2.resize(bg[y0:y0 + th], (W, H), interpolation=cv2.INTER_CUBIC)
bg = cv2.GaussianBlur(bg, (0, 0), 2.2)
# bóng đổ dưới nhóm người
sh = (a.astype(np.float32) / 255)
sh = cv2.resize(sh, (W // 4, H // 4)); sh = cv2.GaussianBlur(sh, (0, 0), 9); sh = cv2.resize(sh, (W, H))
M = np.float32([[1, 0, 18], [0, 1, 26]]); sh = cv2.warpAffine(sh, M, (W, H))
res = bg.astype(np.float32) * (1 - 0.35 * sh[..., None])
k = (a.astype(np.float32) / 255)[..., None]
res = img.astype(np.float32) * k + res * (1 - k)
# lớp cỏ mờ phía trước che mép cắt dưới
fg = cv2.GaussianBlur(cv2.flip(bg, 0), (0, 0), 14).astype(np.float32) * 0.8
yy = np.linspace(0, 1, H)[:, None]; xx = np.linspace(0, 1, W)[None, :]
ramp = np.clip((yy - 0.80) / 0.13, 0, 1) * np.clip((xx - 0.38) / 0.10, 0, 1)
res = res * (1 - ramp[..., None]) + fg * ramp[..., None]
cv2.imwrite(out, np.clip(res, 0, 255).astype(np.uint8), [cv2.IMWRITE_JPEG_QUALITY, 95])
