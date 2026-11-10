---
name: may-e-tiktok-env
description: "Môi trường máy E:\\Tiktok (Win10, Python 3.14, console cp932) — các điểm khác máy gốc và cách xử lý"
metadata:
  node_type: memory
  type: project
  originSessionId: b846579a-c438-4d66-9e1c-83ca4857a8ae
  modified: 2026-11-10T03:00:35.854Z
---

Máy chạy repo ở `E:\Tiktok\darkskyquotes` (thiết lập 2026-11-10) khác máy gốc trong SETUP.md:
- Python **3.14.5** (không phải 3.13). VieNeu 3.8.3 + faster-whisper 1.2.1 đã test chạy được trên 3.14.
- VieNeu cài từ thư mục local `E:\Tiktok\agaubun\VieNeu-TTS` (người dùng chỉ định), không lấy từ PyPI.
- Phải ghim `av<19` (đang dùng 18.1.0): av 19 bỏ tham số `metadata_errors` làm `faster_whisper.decode_audio` lỗi TypeError.
- Console mặc định **cp932** (locale Nhật): in chữ Việt sẽ lỗi UnicodeEncodeError → đã `setx PYTHONUTF8 1` cho user (2026-11-10); nếu vẫn lỗi (vd chạy `python -I`) thì thêm `-X utf8`.
- Chrome nằm ở `C:\Program Files (x86)\Google\Chrome\Application\chrome.exe` (không phải Program Files như CLAUDE.md ghi).
- Không có GPU NVIDIA.

**Why:** tránh lặp lại việc dò lỗi khi dựng video trên máy này.
**How to apply:** khi chạy tools/*.py trên máy này, dùng UTF-8 mode; nếu cài lại gói thì giữ av<19.
