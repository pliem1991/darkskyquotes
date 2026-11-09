import cv2, numpy as np
img = cv2.imread("goc.jpg"); a = cv2.imread("mask_final.png", 0)
a[:350, 740:782] = 0
def hole(pts):
    m = np.zeros_like(a); cv2.fillPoly(m, [np.array(pts, np.int32)], 255); a[m > 0] = 0
hole([[380 + x, 800 + y] for x, y in [(0, 0), (200, 0), (215, 95), (168, 160), (128, 215), (116, 262), (140, 290), (0, 325)]])
hole([(986, 790), (1020, 790), (1040, 800), (1046, 820), (1052, 835), (1070, 860), (1090, 930), (980, 930)])
a = cv2.GaussianBlur(a, (0, 0), 1.2)
cv2.imwrite("nguoi-tach-nen.png", np.dstack([img, a]))
