# Xóa dấu sao Gemini ở góc phải dưới ảnh Flow bằng cách trừ ngược lớp trắng bán trong suốt.
# Bản gốc chép vào images-goc/ cạnh ảnh trước khi sửa. Chỉ dùng cho ảnh 1024x1024.
# Dùng: python tools/xoa_dau_gemini.py anh1.jpg anh2.jpg ...
import shutil
import sys
from pathlib import Path

import cv2
import numpy as np

ALPHA = cv2.imread(str(Path(__file__).with_name("gemini_alpha_1024.png")), cv2.IMREAD_GRAYSCALE) / 255.0

for ten in sys.argv[1:]:
    anh_path = Path(ten)
    goc = anh_path.parent / "images-goc" / anh_path.name
    goc.parent.mkdir(exist_ok=True)
    if not goc.exists():
        shutil.copy2(anh_path, goc)
    anh = cv2.imread(str(goc)).astype(np.float32)
    if anh.shape[:2] != ALPHA.shape:
        sys.exit(f"Sai co anh: {anh_path.name} {anh.shape[:2]}")
    a = ALPHA[..., None]
    sach = np.clip((anh - a * 255) / (1 - a), 0, 255).astype(np.uint8)
    cv2.imwrite(str(anh_path), sach, [cv2.IMWRITE_JPEG_QUALITY, 95])
    print("Da xoa dau:", anh_path.name)
