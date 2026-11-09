---
name: session-roles
description: "Chia việc giữa các phiên của dự án dark.sky.quotes: phiên chính lo ý tưởng và review, phiên Sonnet lo dựng video"
metadata:
  node_type: memory
  type: feedback
  originSessionId: c1d14641-10f1-486f-8366-4fb730d1ee5d
  modified: 2026-11-01T03:12:05.912Z
---

Phiên chính chỉ lên ý tưởng, kịch bản và review. Phần làm video (tạo ảnh, giọng, dựng, xuất) đưa sang phiên riêng dùng Sonnet.

Từ 2026-11-01, ảnh của từng tập do người dùng tạo bằng Google Flow, không chạy SDXL trên máy. Phiên chính viết prompt cho cả tập sau khi kịch bản được duyệt.

Việc đăng TikTok thuộc phiên `dsq - TT` dùng Haiku; phiên chính soạn nội dung, ảnh bìa trong `post.md` của từng tập rồi gửi sang. Chỉ đăng khi người dùng xác nhận.

**Why:** Người dùng muốn tiết kiệm bằng cách dùng model rẻ hơn cho phần thực thi; đề xuất ngày 2026-10-31 và đã chọn mở phiên mới.
**How to apply:** Giao việc dựng bằng phiên riêng kèm brief rõ, rồi tự kiểm tra kết quả (đọc ảnh, trích khung, đo âm) thay vì tin báo cáo. Tạo ảnh SDXL cần khoảng 12 GB RAM trống, nên đo trước khi chạy và không tắt chương trình của người dùng. Luôn sao lưu trước khi xóa ảnh. Liên quan: [[darkskyquotes-channel]], [[content-tone]].
