import sys; sys.path.insert(0, r"D:\AI\Tiktok\darkskyquotes\tools")
import lowload  # noqa
import numpy as np, cv2
img = cv2.imread("goc.jpg")
p = cv2.imread("mask_person_raw.png", 0).astype(np.float32) / 255
sure_fg = cv2.erode((p > 0.9).astype(np.uint8), np.ones((9, 9), np.uint8))
maybe = (p > 0.15).astype(np.uint8)
maybe = cv2.dilate(maybe, np.ones((9, 9), np.uint8))
gc = np.full(p.shape, cv2.GC_BGD, np.uint8)
gc[maybe > 0] = cv2.GC_PR_BGD
gc[p > 0.5] = cv2.GC_PR_FGD
gc[sure_fg > 0] = cv2.GC_FGD
# policing the foreground toy at bottom right and the floor are background; keep deeplab decision
bg = np.zeros((1, 65), np.float64); fg = np.zeros((1, 65), np.float64)
cv2.grabCut(img, gc, None, bg, fg, 4, cv2.GC_INIT_WITH_MASK)
m = np.where((gc == cv2.GC_FGD) | (gc == cv2.GC_PR_FGD), 255, 0).astype(np.uint8)
# keep only large components
m = cv2.morphologyEx(m, cv2.MORPH_OPEN, np.ones((5, 5), np.uint8))
n, lab, st, _ = cv2.connectedComponentsWithStats(m)
m = m & cv2.dilate((p > 0.4).astype(np.uint8) * 255, np.ones((7, 7), np.uint8))
keep = np.zeros_like(m)
for i in range(1, n):
    if st[i, cv2.CC_STAT_AREA] > 4000: keep[lab == i] = 255
keep = cv2.morphologyEx(keep, cv2.MORPH_CLOSE, np.ones((7, 7), np.uint8))
# fill holes
ff = keep.copy(); h, w = ff.shape; cv2.floodFill(ff, np.zeros((h + 2, w + 2), np.uint8), (0, 0), 255)
keep = keep | cv2.bitwise_not(ff)
soft = cv2.GaussianBlur(keep, (0, 0), 1.6)
cv2.imwrite("mask_final.png", soft)
a = img.astype(np.float32); k = soft[..., None] / 255
o = a * k + np.array([60, 200, 60]) * (1 - k)
cv2.imwrite("chk_mask2.jpg", cv2.resize(o.astype(np.uint8), (1000, 562)))
cv2.imwrite("chk_mask2_zoom.jpg", o[250:1000, 500:1500].astype(np.uint8))
