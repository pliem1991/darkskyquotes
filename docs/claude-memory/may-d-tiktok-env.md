---
name: may-d-tiktok-env
description: "Máy D:\\Tiktok (thiết lập 25/11/2026) — venv giọng đọc riêng trong .tools/voice, lệnh render HyperFrames nhẹ CPU, đường dẫn E:/ cũ trong script"
metadata:
  node_type: memory
  type: project
  originSessionId: a1593bc1-8062-4f79-b850-4c4f4576a47d
  modified: 2026-11-25T10:08:18.802Z
---

Máy chạy repo ở `D:\Tiktok\darkskyquotes`, khác [[may-e-tiktok-env]]:
- Python hệ thống 3.12 có `av` 19 (project khác dùng), nên giọng đọc chạy trong venv riêng `.tools/voice` (vieneu 3.8.3, faster-whisper 1.2.1, av 18.1.1, soundfile, scipy). Chạy: `PYTHONUTF8=1 .tools/voice/Scripts/python ...`. Console mặc định cp1252, in chữ Việt phải có PYTHONUTF8=1.
- Script `voice_pick.py`, `audio.py` của clip 3–9 ghi cứng `E:/Tiktok/...`; từ clip 10 dùng `Path(__file__).resolve().parents[4]`.
- `tools/make_timeline_lines.py` không tự import lowload: chạy qua `python -c "import sys,runpy; sys.path.insert(0,'tools'); import lowload; ..."`.
- Render nhẹ máy: gọi npx qua Python đã `import lowload` (tiến trình con thừa hưởng ưu tiên thấp), `npx -y hyperframes@0.9.37 render hf -o output/video-silent.mp4 --quality looks --workers 2`; bản nháp thêm `--quality draft --fps 15`. Clip 37 giây render vài phút. GPU Intel UHD 630.

- Giờ máy đã là GMT+7 (SE Asia Standard Time): lấy giờ bằng `date` thường. `TZ=Asia/Bangkok date` trong Git Bash cho ra giờ UTC (sai 7 tiếng).

**Why:** người dùng yêu cầu giảm tải CPU khi render (25/11/2026).
**How to apply:** dùng lại venv và lệnh trên cho clip sau; xóa file trung gian bằng recycle.ps1, không dùng rm.
