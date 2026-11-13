# Quy trình sản xuất clip — dark.sky.quotes

## Model và vai trò

| Vai trò | Model | Ghi chú |
|---|---|---|
| Viết kịch bản | Opus 4.6 | Lên ý tưởng, viết lời kể, soát chống AI hóa |
| Dựng video | Opus 4.6 | Code hoạt hình, giọng đọc, render, mix audio |
| Hẹn giờ TikTok | Haiku | Agent riêng, tiết kiệm token |
| Duyệt & đăng | Người dùng | Xem video, duyệt, tự tải lên TikTok |

## Quy trình từng bước

### 1. Kịch bản
- Đối chiếu `episodes/so-noi-dung.md` để không trùng chủ đề
- Viết lời kể, hook, câu chốt
- Soát theo `rules/chong-ai-hoa.md`
- Người dùng duyệt lời

### 2. Giọng đọc
- VieNeu preset "Mỹ Duyên", tempo 1.17
- `voice_pick.py`: tạo tới 5 take, chấm bằng faster-whisper (ngưỡng 0.97)
- `make_timeline_lines.py`: cắt âm tiết, tạo `timeline.json`

### 3. Hoạt hình
- `build.py`: sinh `data.js` + `index.html` từ timeline
- `scenes.js`: vẽ cảnh bằng SVG + JS (nhân vật từ `char.js`)
- `main.js`: driver `draw(t)` + GSAP timeline, đăng ký `window.__timelines["main"]`
- Render bằng HyperFrames 0.9.37: `npx hyperframes@0.9.37 render hf --output output/...`

### 4. Âm thanh
- `audio.py`: nhạc nền numpy (120 BPM), SFX tổng hợp, sidechain duck
- ffmpeg merge giọng + nhạc + SFX → `mix.wav`
- ffmpeg merge video + mix → file cuối (không giữ file trung gian)

### 5. Duyệt
- Mở video cho người dùng xem
- Sửa nếu cần, render lại

### 6. Đăng
- Chuẩn bị `post.md` (mô tả, hashtag, giờ hẹn)
- Agent Haiku hẹn giờ trên TikTok Studio (Chrome profile `Default`)
- Cập nhật dashboard "Lịch đăng kênh"
- Cập nhật `episodes/so-noi-dung.md`
- Commit và push

## Công cụ chính

- **HyperFrames 0.9.37**: render HTML+GSAP → MP4 (1080x1920, 30fps)
- **VieNeu TTS**: giọng đọc tiếng Việt
- **faster-whisper**: kiểm tra chất lượng phát âm
- **ffmpeg**: merge audio/video, chuẩn -15 LUFS
- **numpy**: tổng hợp nhạc nền và SFX

## Quy tắc quan trọng

- Hook mạnh ngay giây đầu, thẻ trắng bo tròn, chữ đậm, phần nhấn màu hồng
- Watermark `@dark.sky.quotes` nhỏ mờ góc trái dưới
- Chủ thể và chữ trong vùng an toàn TikTok (x 60–930, y 220–1440)
- Giữ hook ~2 giây trước khi chuyển cảnh
- Console encoding: luôn set `PYTHONUTF8=1` khi chạy Python
