import sys; sys.path.insert(0, r"D:\AI\Tiktok\darkskyquotes\tools")
import lowload  # noqa
import numpy as np, cv2
S = float(sys.argv[1]); CX = float(sys.argv[2]); BY = float(sys.argv[3]); out = sys.argv[4]; CUT = float(sys.argv[5]) if len(sys.argv) > 5 else None; XS = float(sys.argv[6]) if len(sys.argv) > 6 else 0.40
W, H = 2000, 1125
subj = cv2.imread("nguoi-tach-nen.png", cv2.IMREAD_UNCHANGED)
bg = cv2.resize(cv2.imread("nen-so-thu.jpg"), (W, H), interpolation=cv2.INTER_CUBIC).astype(np.float32)
ys, xs = np.where(subj[..., 3] > 20)
x0, x1, y0, y1 = xs.min(), xs.max(), ys.min(), ys.max()
subj = subj[y0:y1 + 1, x0:x1 + 1]
if CUT is not None:
    c = int(CUT - y0); subj = subj[:c].copy()
subj = cv2.resize(subj, None, fx=S, fy=S, interpolation=cv2.INTER_AREA)
sh_, sw_ = subj.shape[:2]
px, py = int(CX - sw_ / 2), int(BY - sh_)
al0 = cv2.erode(subj[..., 3], np.ones((3, 3), np.uint8))
al = cv2.GaussianBlur(al0, (0, 0), 1.6).astype(np.float32) / 255
rgb = subj[..., :3].astype(np.float32)
# phủ màu viền: kéo màu bên trong ra để hết quầng nền cũ
inner = cv2.erode(subj[..., 3], np.ones((5, 5), np.uint8)) > 200
fill = cv2.inpaint(rgb.astype(np.uint8), (~inner).astype(np.uint8) * 255, 3, cv2.INPAINT_TELEA).astype(np.float32)
edgew = np.clip(1 - al * 1.0, 0, 1)[..., None] * 0 + (cv2.GaussianBlur((~inner).astype(np.float32), (0, 0), 0.8)[..., None])
rgb = rgb * (1 - edgew) + fill * edgew
# làm ấm và hạ nhẹ độ sáng cho khớp nắng ngoài trời
rgb = (rgb / 255) ** 1.12 * 255
rgb[..., 2] *= 0.93; rgb[..., 1] *= 0.98; rgb[..., 0] *= 1.0
# hòa màu rất nhẹ cho hợp nắng ngoài trời, không đụng tới nét mặt
rgb = np.clip(rgb, 0, 255)
# bóng đổ trên cỏ
full = np.zeros((H, W), np.float32)
ya, yb, xa, xb = max(py, 0), min(py + sh_, H), max(px, 0), min(px + sw_, W)
full[ya:yb, xa:xb] = al[ya - py:yb - py, xa - px:xb - px]
sh = cv2.GaussianBlur(cv2.resize(full, (W // 4, H // 4)), (0, 0), 10); sh = cv2.resize(sh, (W, H))
sh = cv2.warpAffine(sh, np.float32([[1, 0, -30], [0, 1, 22]]), (W, H))
yy = np.linspace(0, 1, H)[:, None]
sh *= np.clip((yy - 0.55) / 0.1, 0, 1)  # chỉ đổ bóng trên mặt cỏ
res = bg * (1 - 0.45 * sh[..., None])
layer = np.zeros((H, W, 3), np.float32); layer[ya:yb, xa:xb] = rgb[ya - py:yb - py, xa - px:xb - px]
k = full[..., None]
res = layer * k + res * (1 - k)
# cỏ phía trước che mép cắt cong bên dưới nhóm người (mũ đồ chơi che mất phần chân)
cols = np.arange(W)
edge = np.full(W, -1.0)
for x in range(max(int(px + sw_ * XS), 0), min(px + sw_, W)):
    r = np.flatnonzero(full[:, x] > 0.5)
    if len(r): edge[x] = r.max()
valid = edge > 0
edge[~valid] = np.interp(cols[~valid], cols[valid], edge[valid]) if valid.any() else 0
edge = cv2.GaussianBlur(edge.reshape(1, -1), (0, 0), 25).ravel()
xm = np.clip((cols - (px + sw_ * (XS - 0.02))) / 90, 0, 1) * np.clip((px + sw_ + 60 - cols) / 90, 0, 1)
Y = np.arange(H)[:, None].astype(np.float32)
ramp = np.clip((Y - (edge[None, :] - 9)) / 16, 0, 1) * xm[None, :]
shift = np.roll(cv2.GaussianBlur(bg, (0, 0), 1.2), 170, axis=1)
res = res * (1 - ramp[..., None]) + shift * ramp[..., None]
rng = np.random.default_rng(3); res += rng.normal(0, 3.0, (H, W, 1)).astype(np.float32)
cv2.imwrite(out, np.clip(res, 0, 255).astype(np.uint8), [cv2.IMWRITE_JPEG_QUALITY, 95])
print(px, py, sw_, sh_)
