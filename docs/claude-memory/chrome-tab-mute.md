---
name: chrome-tab-mute
description: "Khi Claude dùng Chrome thì phải tắt tiếng tab mình mở, không để phát ra loa"
metadata:
  node_type: memory
  type: feedback
  originSessionId: c1d14641-10f1-486f-8366-4fb730d1ee5d
  modified: 2026-11-01T16:10:31.128Z
---

Khi Claude dùng Claude in Chrome, tab Claude mở phải được tắt tiếng.

**Why:** người dùng yêu cầu ngày 2026-11-01, ngay sau lúc muốn giảm âm lượng laptop xuống 2; tiếng từ tab làm phiền họ.

**How to apply:** ngay sau khi mở tab và trước khi phát nội dung có tiếng, chạy bằng `javascript_tool`: `document.querySelectorAll('video,audio').forEach(m=>m.muted=true);document.addEventListener('play',e=>{e.target.muted=true},true);`. Bốn lịch đang bật có dùng Chrome (thutai-auto-tuong-tac, brickzen-youtube-engage, youtube-daily-interaction, wwwin-weekly-analytics) đã được thêm đúng lệnh này vào SKILL.md từ 2026-11-01; lịch Chrome mới cũng phải có. Chạy lại sau mỗi lần chuyển trang, vì trang mới có thẻ mới. Cách này không chặn được âm thanh phát bằng Web Audio; nếu vẫn có tiếng thì báo người dùng. Không đổi âm lượng của cả máy để thay cho việc này.
