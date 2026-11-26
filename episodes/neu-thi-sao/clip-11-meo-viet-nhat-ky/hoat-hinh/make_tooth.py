"""Tạo hf/tooth.png: lớp vân giấy ngà (màu giấy ở chỗ sáp không bám), phủ lên toàn khung cho giống sáp màu trên giấy."""
import subprocess
import numpy as np

W, H = 1080, 1920
rng = np.random.default_rng(11)


def value_noise(cell):
    gh, gw = H // cell + 2, W // cell + 2
    g = rng.random((gh, gw))
    y = np.arange(H) / cell
    x = np.arange(W) / cell
    y0, x0 = y.astype(int), x.astype(int)
    fy, fx = y - y0, x - x0
    fy = fy * fy * (3 - 2 * fy)
    fx = fx * fx * (3 - 2 * fx)
    a = g[y0][:, x0]; b = g[y0][:, x0 + 1]; c = g[y0 + 1][:, x0]; d = g[y0 + 1][:, x0 + 1]
    top = a + (b - a) * fx; bot = c + (d - c) * fx
    return top + (bot - top) * fy[:, None]


tooth = 0.5 * value_noise(2) + 0.3 * value_noise(4) + 0.2 * value_noise(9)
fibre = value_noise(1)[:, :]  # sợi ngang: kéo giãn theo chiều ngang
fibre = np.repeat(fibre[:, ::6], 6, axis=1)[:, :W]
t = 0.8 * tooth + 0.2 * fibre
t = (t - t.min()) / (t.max() - t.min())
# chỗ giấy lõm (t cao) sáp không bám: hiện màu giấy
alpha = np.clip((t - 0.66) / 0.10, 0, 1) * 0.5
paper = np.array([244, 239, 227], dtype=np.float32)
img = np.zeros((H, W, 4), dtype=np.uint8)
img[..., :3] = paper
img[..., 3] = (alpha * 255).astype(np.uint8)
subprocess.run(["ffmpeg", "-v", "error", "-y", "-f", "rawvideo", "-pix_fmt", "rgba", "-s", f"{W}x{H}", "-i", "-",
                "-frames:v", "1", "hf/tooth.png"], input=img.tobytes(), check=True)
print("tooth.png ok", round(float((alpha > 0).mean()), 3))
