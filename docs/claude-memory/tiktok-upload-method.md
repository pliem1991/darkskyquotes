---
name: tiktok-upload-method
description: "Từ 2026-11-01 kênh dark.sky.quotes đăng TikTok bằng tay; không tự động đăng nhập hay đăng, chỉ xem lại khi lượng tập nhiều"
metadata:
  node_type: memory
  type: feedback
  originSessionId: c1d14641-10f1-486f-8366-4fb730d1ee5d
  modified: 2026-11-01T02:24:39.795Z
---

Người dùng tự tải video lên TikTok Studio. Khi số tập nhiều mới bàn lại chuyện tự động hóa.

**Why:** Ngày 2026-11-01, khi thử repo social-auto-upload, người dùng thấy màn "Verify identity" gửi mã về email và báo quá số lần thử, dù họ nói không đăng nhập và không phiên Claude nào nhập thông tin. Nguyên nhân chưa rõ, nên giữ an toàn cho kênh là ưu tiên. Repo và script đã được bỏ khỏi dự án theo yêu cầu.
**How to apply:** Không mở lại luồng đăng nhập tự động nếu người dùng chưa yêu cầu. Phiên chính vẫn chuẩn bị gói `post.md`, người dùng tự đăng. Metricool xem [[metricool-scheduler]]; chia việc xem [[session-roles]].
