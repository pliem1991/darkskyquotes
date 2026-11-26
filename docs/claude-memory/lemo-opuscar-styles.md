---
name: lemo-opuscar-styles
description: Người dùng muốn áp style của lemo-opuscar (bản clone ở D:\Tiktok\lemo-opuscar) vào video; clip 11 thử crayon-book bằng cách giả lập trong pipeline HyperFrames
metadata:
  node_type: memory
  type: project
  originSessionId: a1593bc1-8062-4f79-b850-4c4f4576a47d
  modified: 2026-11-26T03:17:05.297Z
---

Ngày 26/11/2026 người dùng bảo tham khảo https://github.com/lemomo-ai/lemo-opuscar (demo https://lemomo-ai.github.io/lemo-opuscar/) để áp các style. Bản clone ở `D:\Tiktok\lemo-opuscar` (đang chậm 7 commit, có file xóa dở, chỉ đọc, không pull). Mỗi style có `styles/<slug>/STYLE.md`, `style.json`, `poster.jpg`, `demo/`.

Người dùng chọn: style **crayon-book** (sách tranh sáp màu), **chỉ thử trên clip 11**, **giả lập trong pipeline hiện tại** (không dùng renderer WebGL của lemo, vì giảm tải CPU). Cách làm ở `clip-11-meo-viet-nhat-ky/hoat-hinh`: `make_tooth.py` tạo `hf/tooth.png` (vân giấy tĩnh phủ trên cùng), bộ lọc SVG `#boil` (feTurbulence + feDisplacementMap, đổi seed 12 lần/giây trong main.js), viền `#3b2a55` bằng CSS cho mọi hình không có stroke, chữ Segoe Print trên miếng giấy `#f4efe3`. Video nhiều vân nên phải nén lại khi ghép tiếng (`libx264 -crf 27`) để dưới 10 MB.

**Why:** người dùng muốn nâng chất hình; chưa quyết đổi cả series.
**How to apply:** chờ phản hồi clip 11 rồi mới hỏi có áp cho cả series không. Khi chọn style khác, ghép poster các style ứng viên cho người dùng chọn ([[feedback-offer-options]]). Liên quan [[may-d-tiktok-env]].
