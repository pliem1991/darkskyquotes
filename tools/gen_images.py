"""Tạo ảnh tĩnh bằng SDXL trên card AMD qua DirectML.

Chạy bằng .tools/visual: python gen_images.py prompts.json out_dir [--only NAME] [--steps 22]
prompts.json: {"ten-anh": "prompt", ...}
"""
import lowload  # noqa: F401

import argparse
import json
import os
import time
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
os.environ.setdefault("HF_HOME", str(ROOT / ".tools" / "hf"))
os.environ.setdefault("HF_HUB_OFFLINE", "1")

import torch
from diffusers import AutoencoderKL, EulerDiscreteScheduler, StableDiffusionXLPipeline

STYLE = (
    ", cinematic digital painting, night scene, deep indigo and navy palette, one small warm amber light source, "
    "soft film grain, quiet contemplative mood, high detail"
)

parser = argparse.ArgumentParser()
parser.add_argument("prompts", type=Path)
parser.add_argument("out", type=Path)
parser.add_argument("--only")
parser.add_argument("--steps", type=int, default=4, choices=[4, 8])
parser.add_argument("--seed", type=int, default=11)
parser.add_argument("--size", type=int, default=896)
parser.add_argument("--lowmem", action="store_true", help="Nạp mô hình bfloat16 và dùng 2 luồng: RAM khoảng một nửa, chậm hơn")
args = parser.parse_args()
args.out.mkdir(parents=True, exist_ok=True)
prompts = json.loads(args.prompts.read_text(encoding="utf-8"))

torch.set_num_threads(2 if args.lowmem else int(lowload.THREADS))
DTYPE = torch.bfloat16 if args.lowmem else torch.float32
t0 = time.time()
# DirectML treo card 780M khi nạp SDXL nên chạy CPU, dùng Lightning 8 bước để giảm thời gian.
vae = AutoencoderKL.from_pretrained("madebyollin/sdxl-vae-fp16-fix", torch_dtype=DTYPE)
pipe = StableDiffusionXLPipeline.from_pretrained(
    "stabilityai/stable-diffusion-xl-base-1.0", vae=vae, torch_dtype=DTYPE, variant="fp16", low_cpu_mem_usage=True, use_safetensors=True
)
pipe.scheduler = EulerDiscreteScheduler.from_config(pipe.scheduler.config, timestep_spacing="trailing")
pipe.load_lora_weights("ByteDance/SDXL-Lightning", weight_name=f"sdxl_lightning_{args.steps}step_lora.safetensors")
pipe.fuse_lora()
pipe.to("cpu", DTYPE)
pipe.enable_vae_tiling()
print(f"model ready {time.time() - t0:.0f}s", flush=True)


def on_step(_pipe, step, _t, kwargs):
    print(f"  step {step + 1}/{args.steps} t={time.time() - started:.0f}s", flush=True)
    return kwargs


for name, prompt in prompts.items():
    if args.only and name != args.only:
        continue
    if (args.out / f"{name}.png").exists():
        continue
    started = time.time()
    generator = torch.Generator("cpu").manual_seed(args.seed)
    image = pipe(
        prompt + STYLE,
        width=args.size,
        height=args.size,
        num_inference_steps=args.steps,
        guidance_scale=0.0,
        generator=generator,
        callback_on_step_end=on_step,
    ).images[0]
    image.save(args.out / f"{name}.png")
    print(f"{name}: {time.time() - started:.0f}s", flush=True)
