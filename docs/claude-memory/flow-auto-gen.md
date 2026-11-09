---
name: flow-auto-gen
description: Cách Claude tự tạo và tải ảnh Google Flow qua Claude in Chrome trên laptop này (đã chạy được 2026-11-04)
metadata:
  node_type: memory
  type: reference
  originSessionId: c1d14641-10f1-486f-8366-4fb730d1ee5d
  modified: 2026-11-04T05:43:25.477Z
---

Ngày 2026-11-04 người dùng nhờ Claude tự tạo ảnh tập 3 trên Flow, vì họ không có thời gian. Đã chạy được trọn vẹn.

- **Chọn đúng Chrome:** có nhiều Chrome nối với Claude in Chrome. Chỉ trình duyệt mà `list_connected_browsers` ghi `onThisComputer` mới tải file về máy này. Lần đó là "Browser 4". Trình duyệt kia (Browser 3) không ở máy này: file tải về không thấy, clipboard và localhost cũng không thông. Cả hai đều đã đăng nhập tài khoản Flow Plus của người dùng. Nano Banana 2.1 tạo ảnh tốn 0 tín dụng.
- **Đưa ảnh tham chiếu lên:** tạo một `<input type=file>` bằng JS, nạp file bằng `file_upload`, rồi phát sự kiện drop lên `document.elementFromPoint(900,450)`.
- **Gắn tham chiếu vào câu lệnh:** bấm nút "+" ở ô prompt. Bảng tài nguyên có ô tìm theo tên, ví dụ `minh.jpg`, `c9-san-thuong`, hay "helmet" cho chú Tư. Chọn ảnh rồi bấm "Thêm vào câu lệnh". Không bấm theo tọa độ lưới, vì lưới xô lệch mỗi lần có ảnh mới.
- **Tải ảnh về:** link ảnh trong lưới có đuôi `=s512-rw`. Đổi thành `=s0` thì ra JPEG 1024 gốc. Fetch link đó ngay trong trang, rồi bấm một thẻ `<a download>` để file vào `C:\Users\Win\Downloads`. Python tải trực tiếp thì chỉ nhận trang đăng nhập.
- **Tránh:** đừng bấm đóng thông báo trong khung chỉnh ảnh. Lần đó cú bấm trúng bảng tài khoản và mở trang tín dụng.

Liên quan: [[series-thanh-pho-khong-sao]], [[chrome-tab-mute]], [[series-video-runbook]].
