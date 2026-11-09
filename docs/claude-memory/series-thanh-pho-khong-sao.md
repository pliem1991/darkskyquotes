---
name: series-thanh-pho-khong-sao
description: "Series phim ngắn mới của kênh; phấn màu, ảnh nhân vật qua Google Flow, vị trí file và lịch phát sóng dự kiến"
metadata:
  node_type: memory
  type: project
  originSessionId: c1d14641-10f1-486f-8366-4fb730d1ee5d
  modified: 2026-11-03T05:34:23.607Z
---

Người dùng đưa kế hoạch series "Thành Phố Không Sao" ngày 2026-11-02 (bản lưu: `episodes/thanh-pho-khong-sao/ke-hoach-tong-hop.txt`). Lịch trong kế hoạch: tập 1 phát thứ 2, 16/11/2026, tập 20 thứ 6, 11/12/2026. Thực tế người dùng đăng tập 1 sớm, ngày 03/11/2026, nên lịch các tập sau chưa chốt.

Ngày 2026-11-02 người dùng chọn dùng Google Flow cho nhân vật. Họ bỏ phấn màu vì thấy xấu khi đã có Flow, rồi chốt phong cách **sơn dầu nắng gió sông nước** (thick brush strokes, river-silt brown, coconut green, golden light; cảnh đêm thêm deep blue-green) để có chất miền Tây.

Ngày 2026-11-02 người dùng chốt một giọng kể cả series, không dùng giọng riêng cho Má, Linh. Họ nói tên Thiện Minh, nhưng phiên dựng ghi là nhớ nhầm và dùng Thiền Tâm Đức, giọng của kênh (`voices/voice_config.json`), danh mục ghi là nam miền Bắc; lệch với lời miền Tây. Sau khi nghe so với giọng miền Nam Thái Sơn, phiên dựng báo họ chốt Thiền Tâm Đức, lọc rõ chữ hơn. Tempo sau đó người dùng đổi từ 1,16 xuống 1,05, ngắt ở câu dài và nghỉ giữa các cảnh; tập 1 vì vậy dài 98,7 giây, vượt mức 60–75 giây; ngày 2026-11-03 người dùng chốt giữ 98 giây, không rút còn 89 giây. Họ chưa nói mức này áp dụng cho các tập sau, nên hỏi lại khi viết tập 2. Lời nhân vật khác do Minh kể lại, lời gốc hiện bằng chữ. Ban đầu định thêm nhạc trong TikTok lúc đăng; ngày 2026-11-03 người dùng yêu cầu thiết kế nhạc nền chung cho các tập trong tuần, đang thử nhạc dựng bằng code trộn sẵn vào video (`episodes/thanh-pho-khong-sao/nhac-nen.md`), chờ họ nghe.

Lời kể series viết thành một mạch liền, có mốc thời gian, không viết từng câu rời. Người dùng không muốn lặp "tui": lược chủ ngữ, chỉ giữ vài chữ "mình" (duyệt ngày 2026-11-02). Hành động của nhân vật phải có lý do, ví dụ không để Minh ký mà không có suy nghĩ gì. Khi người dùng gửi bản review ngoài, phải phản biện chứ không làm theo. Không chỉ định rõ quê quán trong lời kể, chữ và hashtag: nói "má ở quê", không nói Bến Tre dù kế hoạch gốc có ghi (người dùng yêu cầu ngày 2026-11-02).

**Why:** Thử 3 ảnh trên DreamShaper 8 cho thấy model không giữ được cùng một nhân vật, Minh ra giống trẻ con và sai trang phục; Flow có ảnh tham chiếu.

**How to apply:** Ảnh nhân vật dùng cả mùa để ở `episodes/thanh-pho-khong-sao/nhan-vat/`, mỗi tập một thư mục `tap-XX-...` có `prompts.md`. Tập nào cảnh nào cũng có người thì tạo hết trong Flow để không lệch nét vẽ. Liên quan: [[local-image-gen-trial]], [[session-roles]], [[no-duplicate-content]], [[anti-ai-rules]].
