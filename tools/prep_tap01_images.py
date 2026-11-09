"""Chuẩn bị ảnh tập 1 Thành Phố Không Sao: đổi sang png và ghép khung cuộc gọi cảnh 7."""
import sys
from pathlib import Path

import cv2
import numpy as np
from PIL import Image, ImageDraw, ImageFont

EP = Path(sys.argv[1])
img = EP / "images"
for jpg in img.glob("*.jpg"):
    if jpg.stem.startswith(("c3-ban-giao-ban-1", "_")) or jpg.stem.startswith("c7"):
        continue
    cv2.imwrite(str(img / f"{jpg.stem}.png"), cv2.imread(str(jpg)))

# Cảnh 7: hai khung gọi video xếp dọc trên nền tối, ảnh vuông 1024.
W = 830
Hh = 472
canvas = Image.new("RGB", (1024, 1024), (12, 15, 22))
draw = ImageDraw.Draw(canvas)
small = ImageFont.truetype(r"C:\Windows\Fonts\segoeui.ttf", 22)
bold = ImageFont.truetype(r"C:\Windows\Fonts\seguisb.ttf", 24)
draw.text((512 - draw.textlength("Đang gọi", font=small) / 2, 8), "Đang gọi", font=small, fill=(150, 158, 170))


def panel(path, y, label):
    pic = Image.open(path).convert("RGB").resize((W, Hh), Image.LANCZOS)
    mask = Image.new("L", (W, Hh), 0)
    ImageDraw.Draw(mask).rounded_rectangle((0, 0, W - 1, Hh - 1), 24, fill=255)
    x = (1024 - W) // 2
    canvas.paste(pic, (x, y), mask)
    chip = ImageDraw.Draw(canvas)
    tw = chip.textlength(label, font=bold)
    chip.rounded_rectangle((x + 16, y + Hh - 52, x + 40 + tw, y + Hh - 14), 14, fill=(8, 10, 14))
    chip.text((x + 28, y + Hh - 50), label, font=bold, fill=(235, 235, 235))


panel(img.parent / "tam" / "_c7a_crop.png", 44, "Má")
panel(img.parent / "tam" / "_c7b_crop.png", 44 + Hh + 10, "Minh")
canvas.save(img / "c7-cuoc-goi.png")
