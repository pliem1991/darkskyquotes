---
name: feedback-watermark-all-videos
description: "Mọi video về sau đều phải có watermark chữ @dark.sky.quotes nhỏ, mờ ở góc trái dưới"
metadata:
  node_type: memory
  type: feedback
  originSessionId: af18f9e6-4bb3-4c31-aaef-f0abab72a316
  modified: 2026-11-04T06:13:56.464Z
---

Người dùng yêu cầu (2026-11-04): từ nay mọi video đều có watermark "@dark.sky.quotes" nhỏ, mờ ở góc.

**Why:** tập 1 và 2 của Thành Phố Không Sao không có; người dùng hỏi rồi chọn chữ nhỏ mờ ở góc.
**How to apply:** `tools/render_series.py` vẽ watermark khi fx.json có khóa `"watermark": {"text":"@dark.sky.quotes","size":30,"x":60,"y":1395,"opacity":0.45}`. Mọi fx.json mới phải có khóa này (tập 3 đã có). Tập 1 và 2 đăng rồi chưa có, chỉ dựng lại khi người dùng yêu cầu. Video khác kênh (quotes, v.v.) cũng phải gắn. Liên quan [[series-video-runbook]].
