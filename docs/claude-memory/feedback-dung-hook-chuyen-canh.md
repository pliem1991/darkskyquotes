---
name: feedback-dung-hook-chuyen-canh
description: "Ý người dùng về nhịp mở đầu và chuyển cảnh khi dựng series (giữ hook, vệt cọ, thẻ \"Một tiếng trước\")"
metadata:
  node_type: memory
  type: feedback
  originSessionId: b846579a-c438-4d66-9e1c-83ca4857a8ae
  modified: 2026-11-10T07:50:46.324Z
---

Người dùng xem tập 9 (2026-11-10) và chốt:
- Hết cảnh hook phải **giữ hình khoảng 2 giây** rồi mới chuyển; chuyển nhanh làm cảnh đầu "không giống hook".
- Hook là cảnh tua trước thì thêm **thẻ thời gian** (vd "Một tiếng trước") đầu cảnh 2 để tách hook khỏi phần kể.
- Chuyển cảnh: chọn **vệt cọ sơn dầu quét** (`brush` trong render_series.py) cho chỗ đổi nơi chốn, kèm **vân vải canvas + vệt sơn ướt** dọc mép. Không lóe sáng, không âm nhấn.
- Thẻ ngày/overlay của cảnh mới không được hiện trong lúc chuyển cảnh.
- Giữ SFX nhẹ hợp cảnh (xe, thang máy, chuông đơn, gõ hủ tiếu...).

**Why:** người dùng thấy bản đầu chuyển quá nhanh, hook không tách khỏi truyện; khi được hỏi đã chọn các phương án trên.
**How to apply:** đưa các mục này vào brief cho agent Sonnet dựng mọi tập sau; khi có nhiều kiểu hiệu ứng mới vẫn hỏi người dùng trước ([[feedback-offer-options]]). Liên quan [[series-video-runbook]], [[session-roles]].
