# Cài đặt trên máy mới

Repo này chỉ chứa kịch bản, prompt, cấu hình và code dựng video. Công cụ, mô hình, ảnh, giọng đọc và video không được commit (xem `.gitignore`). Máy mới cài các thứ dưới đây rồi chạy code trong `tools/`.

Máy đang dùng: Windows 11, không có GPU rời. Code giả định chạy trên Windows: font lấy từ `C:\Windows\Fonts` (Segoe UI, Segoe UI Semibold), còn `tools/lowload.py` hạ độ ưu tiên tiến trình bằng API Windows.

## 1. Công cụ hệ thống

| Công cụ | Bản đang dùng | Cách cài |
|---|---|---|
| Python | 3.13 | https://www.python.org/downloads/ |
| FFmpeg (bản full, cần filter `rubberband` và `ebur128`) | 8.1 | `winget install Gyan.FFmpeg` |
| Node.js (chỉ cho `live/`) | 24 | https://nodejs.org/ |

## 2. Python hệ thống: giọng đọc và dựng video

`tools/make_voice.py`, `make_voice_lines.py`, `make_timeline_lines.py`, `render_series.py` chạy bằng Python 3.13 hệ thống, không dùng `.tools/visual`.

```bash
python -m pip install -r requirements.txt
```

- **Giọng đọc: VieNeu-TTS** (`vieneu` 3.8), https://github.com/pnnbao97/VieNeu-TTS. Giọng đã chốt là Thiền Tâm Đức, cấu hình nằm ở `voices/voice_config.json`. Lần đầu chạy, VieNeu tự tải mô hình về.
- **Chấm lời đọc và làm timeline: faster-whisper** (1.2), mô hình `small` chạy trên CPU ở dạng int8, lần đầu cũng tự tải về.

## 3. Môi trường tạo ảnh và bản đồ độ sâu (không bắt buộc)

Ảnh cảnh của series hiện tạo trên Google Flow, xem `prompts.md` của từng tập. Môi trường dưới đây chỉ cần khi muốn tạo ảnh hoặc bản đồ độ sâu ngay trên máy.

```bash
bash tools/setup_visual_env.sh
```

Script này cài Python 3.11 qua `uv` vào `.tools/`, gồm `torch-directml`, `diffusers`, `transformers`, rồi tải các mô hình:
- `stabilityai/stable-diffusion-xl-base-1.0`, `madebyollin/sdxl-vae-fp16-fix` (dùng cho `tools/gen_images.py`, đi kèm LoRA `ByteDance/SDXL-Lightning`)
- `depth-anything/Depth-Anything-V2-Small-hf` (dùng cho `tools/depth_maps.py`)

Muốn tạo ảnh nhẹ trên CPU thì dùng **stable-diffusion.cpp** (https://github.com/leejet/stable-diffusion.cpp): bỏ `sd-cli.exe` vào `.tools/sdcpp/` và mô hình `DreamShaper_8_pruned.safetensors` vào `.tools/sdcpp/models/`. SDXL chạy trên sd.cpp thì máy 16 GB hết RAM.

## 4. TikTok LIVE (`live/`)

```bash
cd live
npm install
npm run sim
```

Xem thêm `live/README.md`. Giọng chào người xem dùng `live/tts_worker.py`, cần VieNeu ở bước 2.

## 5. Bộ nhớ của Claude

Claude Code lưu bộ nhớ của từng project ở `%USERPROFILE%\.claude\projects\<đường dẫn project>\memory\`. Tên thư mục lấy từ đường dẫn project, thay `:` và `\` bằng `-`. Ví dụ project ở `D:\AI\Tiktok\darkskyquotes` thì tên là `D--AI-Tiktok-darkskyquotes`. Trên máy mới, chép bản trong repo vào đó:

```powershell
$mem = "$env:USERPROFILE\.claude\projects\D--AI-Tiktok-darkskyquotes\memory"
New-Item -ItemType Directory -Force $mem | Out-Null
Copy-Item docs\claude-memory\*.md $mem
```

Nếu project nằm ở đường dẫn khác, đổi tên thư mục cho khớp. Không chép được thì Claude vẫn đọc `docs/claude-memory/` theo dòng ghi trong `CLAUDE.md`.

Những thứ gắn với tài khoản claude.ai đi theo tài khoản, không cần chép: dashboard "Lịch đăng kênh" (link ghi trong `CLAUDE.md`) và kết nối Claude in Chrome. Chrome trên máy mới phải đăng nhập TikTok, Google Flow, rồi sửa bảng profile trong `CLAUDE.md` nếu tên profile khác.

## 6. Hyperframes (chỉ cho thư mục thử `thu-hyperframes/`)

Không dùng trong pipeline chính. Muốn mở lại bản thử thì cài CLI Hyperframes qua npm theo hướng dẫn của Hyperframes.

## 7. Những thứ không có trong repo

- Ảnh nhân vật (`episodes/thanh-pho-khong-sao/nhan-vat/*.jpg`) và ảnh cảnh của từng tập (`images/`): làm lại trên Flow theo `prompts.md`, hoặc chép từ máy cũ sang.
- Lời đọc đã tạo (`audio/*.wav`) và video xuất ra (`*.mp4`): chạy lại `make_voice.py` rồi đến bước dựng.
- Cách dựng một tập từ đầu đến cuối: `episodes/thanh-pho-khong-sao/quy-trinh-dung-video.md`.
