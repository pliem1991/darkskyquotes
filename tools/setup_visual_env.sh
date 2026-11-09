#!/usr/bin/env bash
# Cài công cụ tạo hình vào .tools/ của dự án, không đụng tới Python hệ thống.
# torch-directml không có bản cho Python 3.13 nên dùng Python 3.11 riêng.
set -euo pipefail
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
TOOLS="$ROOT/.tools"
mkdir -p "$TOOLS"

python -m venv "$TOOLS/bootstrap"
"$TOOLS/bootstrap/Scripts/python.exe" -m pip install --quiet uv

export UV_PYTHON_INSTALL_DIR="$TOOLS/python"
export UV_CACHE_DIR="$TOOLS/uv-cache"
UV="$TOOLS/bootstrap/Scripts/uv.exe"
"$UV" python install 3.11
"$UV" venv --python 3.11 --python-preference only-managed "$TOOLS/visual"

VPY="$TOOLS/visual/Scripts/python.exe"
"$UV" pip install --python "$VPY" torch-directml \
  "diffusers>=0.30,<0.36" "transformers>=4.44,<4.50" accelerate safetensors \
  "huggingface_hub<1" peft opencv-python-headless pillow "numpy<2" sentencepiece

export HF_HOME="$TOOLS/hf"
export PYTHONUTF8=1
"$VPY" - <<'EOF'
from huggingface_hub import snapshot_download
snapshot_download(
    "stabilityai/stable-diffusion-xl-base-1.0",
    allow_patterns=[
        "model_index.json", "scheduler/*", "tokenizer/*", "tokenizer_2/*",
        "text_encoder/config.json", "text_encoder/model.fp16.safetensors",
        "text_encoder_2/config.json", "text_encoder_2/model.fp16.safetensors",
        "unet/config.json", "unet/diffusion_pytorch_model.fp16.safetensors",
        "vae/config.json", "vae/diffusion_pytorch_model.fp16.safetensors",
    ],
)
snapshot_download("madebyollin/sdxl-vae-fp16-fix", allow_patterns=["config.json", "diffusion_pytorch_model.safetensors"])
snapshot_download("depth-anything/Depth-Anything-V2-Small-hf")
print("models ok")
EOF
du -sh "$TOOLS"
