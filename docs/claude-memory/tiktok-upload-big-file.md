---
name: tiktok-upload-big-file
description: Cách đưa video trên 10 MB vào TikTok Studio qua Claude in Chrome khi file_upload từ chối
metadata:
  node_type: memory
  type: reference
  originSessionId: 109fb8b6-4f5e-4cfd-9d80-add7e7cb7393
  modified: 2026-11-08T10:43:56.505Z
---

file_upload của Claude in Chrome nhận tối đa 10 MB mỗi lần; localhost bị CSP của TikTok chặn (fetch lỗi). Cách đã chạy ngày 2026-11-08 (tập 6, 16,2 MB): cắt file thành 2 nửa dưới 10 MB bằng Python, tạo 2 thẻ input[type=file] bằng javascript_tool trên trang upload, file_upload từng nửa vào từng thẻ, ghép bằng `new File([A,B],...)`, kiểm tra đúng kích thước và chữ `ftyp`, rồi gán vào input của TikTok và bắn sự kiện change. Xong xóa bản cắt.

- Hẹn giờ: ô giờ chỉ đọc, phải bấm dãy phút trong bộ chọn, mỗi lần cách 1 giây.
- Nhãn AI: nút gạt ở "Show more", kiểm tra lại bằng input.Switch__input.
- Liên quan: [[tiktok-upload-method]], [[tiktok-analytics-baseline]].
