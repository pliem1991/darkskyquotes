---
name: feedback-follow-end-card
description: Mọi video về sau phải có thẻ nhắc theo dõi kênh ở cuối và kéo dài thêm 5 giây
metadata:
  node_type: memory
  type: feedback
  originSessionId: a1593bc1-8062-4f79-b850-4c4f4576a47d
  modified: 2026-11-26T04:11:12.971Z
---

Từ 26/11/2026 (clip 12), cuối mỗi video thêm thẻ nhắc theo dõi kênh: nút "+ Theo dõi @dark.sky.quotes" màu đỏ TikTok, dòng phụ "để xem tình huống "Nếu..." tiếp theo", hiện sau thẻ câu hỏi cuối 1,6 giây. Video kéo dài thêm 5 giây cho phần này.

**Why:** người dùng dặn: "thêm vào phần kết video nhắc follow kênh và kéo dài 5s nha (này cho vào rule khi tạo video)".
**How to apply:**
- Chép từ `episodes/neu-thi-sao/clip-12-muoi-xin-phep/hoat-hinh`. Trong `build.py`: `FOLLOW_EXTRA = 5.0`, `followT = endT + 1.6`, CSS và thẻ `#follow` có `white-space:nowrap`. Trong `hf/main.js`: khối `#follow`. Trong `audio.py`: tiếng ding ở `followT`.
- Chỉ hiện bằng chữ, không đọc thành lời. Đây là ngoại lệ đã ghi trong `rules/chong-ai-hoa.md` mục 6.
- Đã ghi trong `flow.md`.
- Liên quan: [[feedback-watermark-all-videos]], [[tiktok-video-layout]].
