"""Ước lượng độ sâu cho ảnh tĩnh để tạo hiệu ứng có chiều sâu. Chạy bằng .tools/visual."""
import lowload  # noqa: F401

import os
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
os.environ.setdefault("HF_HOME", str(ROOT / ".tools" / "hf"))
os.environ.setdefault("HF_HUB_OFFLINE", "1")

import numpy as np
from PIL import Image
from transformers import pipeline

estimator = pipeline("depth-estimation", model="depth-anything/Depth-Anything-V2-Small-hf")
for path in sorted(Path(sys.argv[1]).glob("*.png")):
    if path.stem.endswith(".depth"):
        continue
    image = Image.open(path).convert("RGB")
    depth = np.asarray(estimator(image)["depth"].resize(image.size), dtype=np.float32)
    depth = (depth - depth.min()) / (depth.max() - depth.min() + 1e-6)
    Image.fromarray((depth * 255).astype(np.uint8)).save(path.with_name(f"{path.stem}.depth.png"))
    print(path.name, flush=True)
