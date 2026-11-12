# Gói đăng TikTok: "Nếu... thì sao?" clip 3 (bản hoạt hình 2D), quên điện thoại ở nhà một ngày

Bản này thay bản ảnh Flow cũ (`../post.md`, `../output-nhe_dep.mp4`, giữ nguyên để tham khảo).

- **Kênh:** https://www.tiktok.com/@dark.sky.quotes
- **Video:** `episodes/neu-thi-sao/clip-03-quen-dien-thoai/hoat-hinh/output-nhe_dep.mp4` (37,1 giây, 4,5 MB, khoảng -15 LUFS, 1080x1920, có watermark @dark.sky.quotes). Hoạt hình 2D vẽ bằng code (SVG), nhân vật cô gái văn phòng, giọng VieNeu "Mỹ Duyên". Không dùng ảnh AI, không dùng Flow. Không có thẻ series.
- **Ảnh bìa:** khung đầu clip (chữ hook "Quên điện thoại 1 ngày, bạn trụ tới mấy giờ?" trên cảnh phòng trọ, điện thoại rung trên giường). Không thêm chữ lên bìa.
- **Lịch đề xuất:** 12:00 trưa thứ bảy 15/11/2026.
- **Trạng thái:** đã dựng, Claude đã soát khung hình (`kiem-khung/sheet.jpg`), **chờ người dùng xem và nghe duyệt**. Chưa hẹn giờ, chưa đăng.

## Mô tả (dán nguyên văn)

Quên điện thoại ở nhà một ngày, bạn trụ được tới mấy giờ?

Bạn thuộc lòng số điện thoại của mấy người?

Tình huống hư cấu, hoạt hình vẽ bằng code.

#neuthisao #dilam #dienthoai #darkskyquotes

## Cài đặt khi đăng

- Ai xem được: Mọi người
- Bình luận: bật
- Duet và Stitch: để mặc định
- Nhãn nội dung do AI tạo: bật (giọng đọc là giọng tổng hợp)
- Không gắn nhạc TikTok, video đã có nhạc nền và âm thanh riêng

## Sau khi đăng

- Báo ngày đăng để ghi vào `episodes/so-noi-dung.md` và dashboard "Lịch đăng kênh".

## Cách dựng lại (ghi chú kỹ thuật)

- Mã nguồn: `hf/` (HyperFrames 0.9.37: `index.html`, `char.js`, `scenes.js`, `main.js`, `data.js`). `build.py` sinh `hf/index.html` và `hf/data.js` từ `audio/timeline.json`; `audio.py` làm nhạc, hiệu ứng, trộn `audio/mix.wav`.
- Giọng: `voices.json` (`mk.py` sinh), đọc bằng `tools/make_voice_lines.py`, ghép bằng `tools/make_timeline_lines.py`.
- Render: `cd hf && npx hyperframes@0.9.37 render -o ../video-silent.mp4`, rồi ghép `audio/mix.wav` và nén như `output-nhe_dep.mp4`.
