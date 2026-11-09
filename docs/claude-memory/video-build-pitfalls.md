---
name: video-build-pitfalls
description: "Lỗi hay gặp và quy tắc khi dựng video tập dark.sky.quotes (ảnh AI, depth, fx.json, phụ đề, giọng, xuất)"
metadata:
  node_type: memory
  type: feedback
  originSessionId: c1d14641-10f1-486f-8366-4fb730d1ee5d
  modified: 2026-11-02T08:12:44.445Z
---

Các lỗi đã gặp ở tập 001 và cách tránh:

- **Ảnh AI dị dạng**: xe đạp nhìn từ sau bị méo bánh/khung. Prompt nên để xe nghiêng hoặc chìm sương, chủ thể nhỏ/xa. Luôn đọc ảnh để kiểm tra trước khi đi tiếp.
- **Sao lưu trước khi xóa**: từng xóa nhầm `images/nguoi-cha.png` hai lần mà không có bản sao. Chép vào thư mục sao lưu (vd `backup-vN/`) rồi mới xóa; ảnh cũ cũng có thể trích từ `output-vN.mp4`.
- **SDXL sập (0xC0000005, segfault 139) lúc nạp mô hình**: do thiếu RAM. Cần khoảng 12 GB trống; đo RAM và bộ nhớ ảo trước khi chạy, không tắt chương trình của người dùng, không chạy lặp lại khi chưa đủ RAM. Không chạy tạo ảnh cùng lúc với đọc giọng.
- **Tiếng Việt trong Python trên Windows**: luôn đặt `PYTHONUTF8=1` (make_voice.py sập vì in ký tự Việt, render_episode cũng cần).
- **Cấu trúc fx.json**: cảnh nằm trong `scenes.<tên>`, không ở cấp ngoài. Mốc dạng `[câu, tỉ lệ]` hoặc `[[câu, vế], tỉ lệ]`; đổi số vế của câu thì phải rà lại mọi mốc (`shut`, `jolt`, `door`, `vega`, `meteors`, `streak`, `end`, `music`).
- **Ảnh sáng làm trắng xóa/đè bóng người**: giảm `rays.gain`, `dawn`, `glows`, dùng `dim`, và `mask_dark` (tia chỉ cộng lên vùng nền sáng). Ảnh có chân sáng (cầu thang) lộ mép dưới khi máy tiến gần: dùng `fade_bottom` rồi giảm `push`.
- **Phụ đề không có dấu phẩy**: người dùng yêu cầu bỏ dấu `,` khỏi chữ hiển thị (đã xử lý ở Caption trong render_episode.py); giữ dấu phẩy trong lines.json để giọng ngắt đúng.
- **Xóa dấu sao Gemini trên ảnh Flow**: dùng `tools/xoa_dau_gemini.py` (trừ ngược lớp trắng theo `tools/gemini_alpha_1024.png`, tự chép bản gốc vào `images-goc/`, chỉ cho ảnh 1024x1024). Không dùng `cv2.inpaint`: để lại vết xoáy trên nét cọ.
- **Kiểm tra**: `--preview` có khung đỏ vùng an toàn; `--preview ... --full` lưu khung độ phân giải đầy đủ. Mỗi lần xuất: chép `output.mp4` thành `output-vN.mp4` trước, nén `output-nhe.mp4`, gửi bằng SendUserFile, nói rõ phần chưa nghe/xem liền mạch.

**Why:** Các lỗi này đã làm mất công làm lại và có lần mất ảnh gốc.
**How to apply:** Đọc lại danh sách này trước khi dựng hoặc sửa video tập mới. Liên quan: [[session-roles]], [[tiktok-video-layout]], [[darkskyquotes-channel]].
