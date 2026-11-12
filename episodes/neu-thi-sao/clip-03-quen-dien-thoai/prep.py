import cv2, numpy as np, sys
from pathlib import Path
img=Path("images")
# vá: (ảnh, x0,y0,x1,y1) vùng chữ nhỏ -> làm mờ mạnh
PATCH={"c1-dien-thoai-tren-giuong":[(6,226,136,424)],"c7-ba-chuc-tin":[(6,226,136,424)],
 "c2-nua-duong":[(0,180,105,300),(930,215,1024,300)],
 "c3-banh-mi":[]}
# tâm chủ thể (x,y) theo ảnh 1024
CEN={"c1-dien-thoai-tren-giuong":(500,800),"c2-nua-duong":(520,480),"c3-banh-mi":(470,520),"c4-phong-hop":(780,520),"c5-muon-may":(500,520),"c6-so-tui-quan":(650,560),"c7-ba-chuc-tin":(500,620)}
names=sys.argv[1:] or list(CEN)
for n in names:
    a=cv2.imread(str(img/f"{n}.jpg"))
    for (x0,y0,x1,y1) in PATCH.get(n,[]):
        if n in ("c1-dien-thoai-tren-giuong","c7-ba-chuc-tin"):
            m=np.zeros(a.shape[:2],np.uint8); m[y0:y1,x0:x1]=255
            a=cv2.inpaint(a,m,6,cv2.INPAINT_TELEA)
        else:
            roi=a[y0:y1,x0:x1]
            a[y0:y1,x0:x1]=cv2.GaussianBlur(roi,(0,0),14)
    # làm sáng tươi hơn một chút để bù độ tối của vignette
    hsv=cv2.cvtColor(a,cv2.COLOR_BGR2HSV).astype(np.float32)
    hsv[...,1]=np.clip(hsv[...,1]*1.08,0,255); hsv[...,2]=np.clip(hsv[...,2]*1.12+6,0,255)
    a=cv2.cvtColor(hsv.astype(np.uint8),cv2.COLOR_HSV2BGR)
    if n=="c1-dien-thoai-tren-giuong":
        g=np.clip(0.42+0.58*(np.arange(1024,dtype=np.float32)-40)/320,0.42,1)[:,None,None]
        a=(a.astype(np.float32)*g).astype(np.uint8)
    cv2.imwrite(str(img/f"{n}.png"),a)
    yy,xx=np.mgrid[0:1024,0:1024].astype(np.float32)
    cx,cy=CEN[n]
    d=np.exp(-(((xx-cx)/380)**2+((yy-cy)/420)**2))*0.7+0.3*(yy/1024)
    d=(d-d.min())/(d.max()-d.min())
    cv2.imwrite(str(img/f"{n}.depth.png"),(d*255).astype(np.uint8))
    print(n)
