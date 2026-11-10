---
name: feedback-review-before-sending-script
description: Chỉ gửi kịch bản cho người dùng sau khi đã soát chống AI hóa VÀ cho 2 agent Sonnet + Haiku phản biện riêng
metadata:
  node_type: memory
  type: feedback
  originSessionId: b846579a-c438-4d66-9e1c-83ca4857a8ae
  modified: 2026-11-10T03:42:07.443Z
---

Trước khi đưa bất kỳ kịch bản nào cho người dùng duyệt: (1) soát theo `rules/chong-ai-hoa.md`, (2) chạy 2 agent phản biện độc lập, một Sonnet một Haiku, (3) sửa theo góp ý hợp lý, ghi mục "Phản biện của hai agent" (nhận / không nhận, lý do) vào script.md như tập 7, rồi mới gửi.

**Why:** Ngày 2026-11-10 tôi gửi bản 1 tập 8 khi chưa phản biện; người dùng dặn "chỉ gửi mình kịch bản sau khi đã check AI hóa và phản biện bằng 2 agent Sonnet và Haiku nha. Nhớ kỹ nhé".
**How to apply:** Không hỏi "có muốn phản biện không" — làm luôn. Đưa agent file kịch bản và file nối tiếp, không đưa kết luận của mình. Phản biện xong vẫn phải tự phản biện lại góp ý, không làm theo mù quáng. Liên quan [[anti-ai-rules]], [[series-thanh-pho-khong-sao]].
