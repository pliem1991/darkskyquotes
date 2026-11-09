# Bầu trời đêm tương tác cho TikTok LIVE

Mỗi người xem là một vì sao. Bình luận, thả tim, theo dõi và tặng quà làm sao sáng hơn. Giọng Thiền Tâm Đức đọc lời chào theo tên.

## Chạy thử với người xem giả

```bash
npm run sim
```

- Cảnh: http://localhost:4173/
- Bảng gửi sự kiện tay: http://localhost:4173/panel.html
- Phím M trên cảnh: bật hoặc tắt nền âm thanh.

Cảnh giả lập có nhãn đỏ ở trên cùng. Không phát cảnh này lên sóng, vì người xem trong đó là giả.

## Chạy với live thật

```bash
node server.js --user dark.sky.quotes
```

Thêm `--no-voice` nếu chỉ muốn hiện chữ. Server tự nối lại mỗi 30 giây khi tài khoản chưa lên live.

Lên sóng: thêm Browser Source `http://localhost:4173/` cỡ 1080x1920 trong TikTok LIVE Studio hoặc OBS, bật "Control audio via OBS" để thu cả giọng đọc.

## Những điều cố ý

- Bình luận chỉ hiện trên hình, không bao giờ được đọc thành tiếng. Giọng đọc chỉ đọc câu mẫu trong `engine.js` kèm tên đã lọc.
- Sửa từ cấm trong `blocklist.txt`, không phải sửa code.
- Bình luận có dấu hiệu khủng hoảng không lên hình và in `[CẦN NGƯỜI TRỰC ĐỌC]` trong cửa sổ server. Người trực cần tự đọc và trả lời.
- Thư viện đọc TikTok không chính thức, chỉ dùng để đọc, không đăng nhập. Nó có thể hỏng khi TikTok đổi hệ thống.
