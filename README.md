# dark.sky.quotes

Kịch bản, prompt và code dựng video cho kênh TikTok https://www.tiktok.com/@dark.sky.quotes. Series đang làm là **Thành Phố Không Sao**.

Cài máy mới: xem [SETUP.md](SETUP.md).

## Đọc gì trước

| File | Nội dung |
|---|---|
| `CLAUDE.md` | Kênh nằm ở Chrome profile nào, cách báo lịch đăng lên dashboard "Lịch đăng kênh" |
| `docs/claude-memory/` | Bộ nhớ của Claude chép từ máy gốc: quy tắc nội dung, bố cục khung hình, lỗi hay gặp khi dựng, ý kiến người dùng đã chốt. Bắt đầu từ `MEMORY.md` |
| `rules/chong-ai-hoa.md` | Quy tắc viết lời cho tự nhiên, soát mọi kịch bản trước khi đọc giọng |
| `episodes/so-noi-dung.md` | Sổ các tập đã làm, đã đăng, để không trùng nội dung |
| `episodes/thanh-pho-khong-sao/ke-hoach-tong-hop.txt` | Kế hoạch cả series |
| `episodes/thanh-pho-khong-sao/quy-trinh-dung-video.md` | Cách dựng một tập từ ảnh và lời đến video xuất ra |
| `episodes/thanh-pho-khong-sao/giong-doc.md`, `nhac-nen.md` | Giọng đã chốt, cách làm nhạc nền bằng code |

## Mỗi tập gồm gì

Mỗi thư mục `episodes/thanh-pho-khong-sao/tap-NN-.../` có:
- `script.md`: lời đọc, chữ trên hình, trạng thái duyệt.
- `prompts.md`: prompt tạo ảnh trên Google Flow và ảnh tham chiếu cần gắn.
- `lines.json`, `fx.json`: đầu vào cho `tools/make_voice.py` và `tools/render_series.py`.
- `audio/timeline.json`: mốc thời gian lời đọc, sinh ra từ bước làm giọng.
- `post.md`: mô tả, ảnh bìa, giờ đăng, cài đặt khi đăng.

Ảnh, giọng đọc và video không có trong repo. Muốn dựng lại thì làm ảnh trên Flow theo `prompts.md` (hoặc chép từ máy gốc), chạy lại bước giọng, rồi dựng.

## Cập nhật bộ nhớ Claude vào repo

Bộ nhớ thật của Claude nằm ngoài project. Trước khi commit trên máy gốc, chép lại cho repo có bản mới nhất:

```powershell
Copy-Item "$env:USERPROFILE\.claude\projects\D--AI-Tiktok-darkskyquotes\memory\*.md" docs\claude-memory\
```
