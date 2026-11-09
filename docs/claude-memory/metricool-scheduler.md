---
name: metricool-scheduler
description: "Kênh dark.sky.quotes đã kết nối Metricool gói Free để lên lịch TikTok; các tùy chọn đã thấy, mặc định cần đổi và điều chưa chứng minh"
metadata:
  node_type: memory
  type: project
  originSessionId: c1d14641-10f1-486f-8366-4fb730d1ee5d
  modified: 2026-11-01T01:42:34.754Z
---

Ngày 2026-11-01 người dùng đã tự đăng ký Metricool và kết nối @dark.sky.quotes. Đăng nhập nằm ở Claude in Chrome "Browser 1"; trình duyệt tích hợp của app chưa đăng nhập.

Đã kiểm tra bằng clip thử rồi hủy nháp, chưa đăng gì. Trên gói Free (1 thương hiệu, 20 bài/tháng): có "Auto publish", quyền xem, bình luận, Duet, Stitch, chọn khung làm ảnh bìa bằng thanh trượt, và nhãn "AI-generated content". Nhãn AI chỉ mở sau khi đã gắn video.

Mặc định phải đổi mỗi lần đăng: nhãn AI đang tắt, Duet và Stitch đang bật. Trang bảng giá không liệt kê TikTok là tính năng trả phí. API của Metricool chỉ có từ gói Advanced (từ 53 USD/tháng).

Chưa chứng minh: một bài TikTok thật có tự lên đúng giờ trên gói Free không, vì chưa từng bấm Schedule. Công cụ tải tệp của Claude in Chrome giới hạn 10 MB, nên video thật do người dùng tự chọn tệp, hoặc thử tab "From URL" với link công khai (chưa thử).

**Why:** TikTok Content Posting API buộc bài ở chế độ riêng tư cho tới khi app qua kiểm duyệt, nên không dùng API trực tiếp.
**How to apply:** Lên lịch thuộc phiên `dsq - TT` theo [[session-roles]], và chỉ hẹn giờ khi người dùng xác nhận. Bài đầu qua Metricool phải được kiểm tra lại trên TikTok Studio sau giờ đăng.
