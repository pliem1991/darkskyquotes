# Quy trình dựng video Series "Thành Phố Không Sao"

Rút từ tập 1 "Chín triệu" (đã đăng 2026-11-03). Các tập sau làm đúng theo đây, chỉ đổi nội dung. Mọi lệnh chạy từ `D:\AI\Tiktok\darkskyquotes`, đặt `PYTHONUTF8=1`, dùng Python hệ thống 3.13.

## Ràng buộc luôn giữ
- Máy không được nặng: mọi tool đã `import lowload` (hạ ưu tiên, 4 luồng). `--workers 3`, không chạy thêm việc nặng song song. Không đóng chương trình của người dùng; thiếu RAM thì dừng và báo.
- Chủ thể và chữ nằm trong vùng an toàn x 60–930, y 220–1440.
- Phụ đề không có dấu phẩy. Chỉ đọc lại bằng giọng những dòng bị sửa chữ.
- Sao lưu trước khi xóa hay ghi đè (vào `tam/`). Không động vào `images/images-goc/`.
- Không đăng lên đâu. Xong thì nén, gửi người dùng bằng SendUserFile, nói rõ chưa nghe và chưa xem liền mạch.
- Có nhiều cách làm thì báo người dùng các lựa chọn trước.

## Các bước
1. **Kịch bản và prompt ảnh**: `script.md`, `prompts.md` (phiên chính lo). Kiểm theo `rules/chong-ai-hoa.md` và `episodes/so-noi-dung.md`.
2. **Ảnh**: tạo ở Flow, bỏ vào `tap-XX/images/` đặt tên `c1-...jpg` … `c9-...jpg`. Đổi sang png và ghép khung riêng (cuộc gọi cảnh 7): chỉnh `tools/prep_tap01_images.py` theo tập. Bản gốc để ở `images/images-goc/`. Ảnh không dùng: `c3-ban-giao-ban-1.jpg`.
3. **Bản đồ chiều sâu** (cho hiệu ứng xê dịch): `tools/depth_maps.py` ra `*.depth.png` cạnh mỗi ảnh.
4. **Giọng**: viết `voices.json` (giọng Thiền Tâm Đức, pitch 1.0, tempo 1.05, `pause` sau mỗi câu 2–3 s, câu chốt 6.5 s, `inner_pauses` giữa các vế ở câu dài). Chạy `python tools/make_voice_lines.py <ep>/voices.json` (chọn bản Whisper chấm cao nhất cho từng dòng), rồi `python tools/make_timeline_lines.py <ep>/voices.json` ra `narration.wav`, `timeline.json`, `lines.json`. Whisper hay nghe sai ở câu nhiều từ lạ: kiểm điểm từng dòng, không tin tuyệt đối.
5. **Hiệu ứng**: `fx.json` trong thư mục tập, copy từ tập 1 rồi sửa (xem mục dưới).
6. **Dựng**: `python tools/render_series.py episodes/thanh-pho-khong-sao/tap-XX-... --workers 3` ra `output.mp4` (cảnh + nhạc + SFX + giọng). Xem thử nhanh: `--preview 5,22,74.5 --full`. Chỉ trộn lại âm thanh lên hình đã có: `--mix-video <video> --out <file>`.
7. **Nén**: `ffmpeg -i output.mp4 -c:v libx264 -preset slow -crf 23 -pix_fmt yuv420p -c:a copy output-nhe_dep.mp4`, so SSIM; không giảm được thì giữ nguyên. Tập 1: 98,7 s, 24,8 MB.
8. **Kiểm**: xem khung hình ngay trước và sau mỗi chỗ cắt, cảnh có chữ chồng ảnh, các mốc chữ. Đo âm lượng (đích khoảng -17 LUFS tổng, đỉnh dưới -1 dBFS).

## fx.json: những thứ đã chốt ở tập 1
- **Mốc**: `[câu, tỉ lệ]`, `["w",[câu,"cụm từ"]]` (đầu cụm), `["we",[câu,"cụm từ"]]` (cuối cụm). Mọi chữ hiện, âm báo, nhạc gắn vào mốc này, không gắn giây tuyệt đối.
- **Máy quay**: `ease: true` (vào ra mượt), `push` dương là tiến vào, âm là lùi ra (cảnh 2 và cảnh cuối lùi ra), `zoom0`, `pan`, `focus`. **Tắt `beats`** (giật), người dùng chê.
- **Ảnh**: `IMG=1260`, `IMG_Y=150` để không chừa trống ở dưới. Ảnh rộng hơn khung được cắt ngang tự động.
- **Chuyển cảnh chỉ 3 kiểu + cắt cứng**: `blur` (mờ nhòe, sigma 12–26), `dip` (chìm tối, cho cảnh đổi không khí lớn), `fade`. Cắt cứng bằng `in: fade, in_dur: 0.001` và `lead` để đặt đúng giây cắt (tập 1: 21,93 s và 74,5 s). Cross-dissolve dài trông như hai ảnh chồng nhau, tránh.
- **Thẻ tên series** (cảnh 1): `card` cỡ lớn, có vệt sáng vàng chạy qua; cỡ chữ 104, phụ 58, y 190.
- **Phụ đề**: viền tối `outline=3` để đọc được trên nền sáng. Chữ nhấn số tiền dùng `emphasis` (cỡ 58–64) và `digits` để hiện "9 triệu" thay vì "chín triệu".
- **Lớp phủ** (`overlays`): tin nhắn, thông báo, cuộc gọi, khung điện thoại gắn bốn góc (`quad`), bộ đếm số, dòng chốt cuối. Hết ảnh thì lớp phủ cũng hết.
- **Nhạc** (`nhac-nen.md`): hợp âm Am-F-Dm-Am, mô-típ 5 nốt, `music_lufs -24`, `music_highpass 140`, `quiet` là các đoạn nhạc im hẳn (trước câu "má ở quê"), nhạc sidechain nhường giọng. Câu cuối để nhạc kết trên "ngôi sao nào".
- **SFX** (`sfx` trong fx.json, tự tổng hợp, không dùng file): bút, gõ phím, chuông, còi, mưa, xe, chuông gọi, thông báo, gió. `sfx_lufs -30`, lowpass 5 kHz, sidechain 20:1 theo giọng. Tiếng nhỏ dưới giọng gần như không nghe được, tiếng rời nên nhân to hơn (đã nhân sẵn trong `build_sfx`). Tiếng nhiễu bút kéo dài dưới câu móc đã bỏ (gây rít).

## Độ dài
Tập 1 dài 98,7 s vì các khoảng lặng giữa cảnh. Giới hạn ban đầu là 75 s, người dùng đã chấp nhận ~98 s. Tập sau hỏi lại nếu muốn ngắn hơn.

## Lỗi hay gặp (đã gặp ở tập 1)
- Chạy nền rồi chỉ nhìn mã thoát: lệnh có `| tail` luôn trả 0 dù lỗi. Luôn kiểm giờ sửa của `output.mp4` và log.
- Khóa nhạc phải là `[câu, tỉ lệ, giá trị]`, không phải `[[câu,tỉ lệ],giá trị]`.
- Mảng âm của một hiệu ứng SFX phải cùng độ dài, ghi file âm bằng FLOAT, đừng PCM_16 khi biên độ có thể >1.
- Tên ảnh xem thử bỏ số 0 cuối (`preview-52.4.jpg`).
- Xem thêm memory `video-build-pitfalls`.

## Đã thử và không chọn
- Remotion 4 và HyperFrames: thử 15 s (`thu-hyperframes/`), không hơn pipeline Python hiện tại về mặt hình, tốn thêm công cụ. Giữ Python.

## Việc ngoài video (phiên chính)
Chữ đăng, hashtag, giờ đăng ở `post.md`. Đăng tay từ 2026-11-01. Sau khi đăng xong cập nhật `episodes/so-noi-dung.md`.

## Bổ sung từ tập 2
- Tempo giọng: tập 1 dùng 1,05 nghe chậm. Từ tập 2 dùng tempo 1,12 và khoảng lặng giữa dòng 1,0–1,6 s (c7 và câu cuối vẫn 3 s và 6,5 s). Đổi tempo mà không muốn đọc lại: chạy `rubberband=tempo=<tỉ lệ mới/cũ>` lên các file `audio/lines/*.wav` (sao lưu trước), chỉ đọc lại dòng sửa chữ bằng `--only`.
- `voices.json` có `lead_in` (giây trước dòng đầu, dùng cho tiếng gõ cửa mở đầu).
- SFX mới trong `build_sfx`: `knock`, `keys`, `moto`. Nhạc: `music_sparse`, `music_low`, `strings_gain`. Lớp phủ `phone` nhận `color`.
- Thẻ tên series dạng một dòng: size 68, sub 40, y 200, gap 98 (không chạm đầu nhân vật). Không đặt bong bóng chữ trùng phụ đề.
- Whisper nghe sai cụm lạ như "chở hàng" hay "ổ bánh mì không": không tin tuyệt đối, cần nghe bằng tai.

## Ý tưởng tham khảo (chưa làm, chưa thử)
Nguồn: https://github.com/XiaoyeCodes/code-animation-prompts (341 prompt hiệu ứng HTML, mô tả tiếng Trung, giấy phép chia theo phần, tác giả không cho đóng gói bán). Xem 2026-11-04 chỉ qua tên mục trong `docs/STYLES.md`, chưa tải về, chưa đọc nội dung prompt. Không cài nguyên bộ vì hợp phong cách quảng cáo, comic, cyberpunk, không hợp tông tối sơn dầu và pipeline Python.
- **D2 "窗光与尘" (ánh sáng cửa sổ và bụi)** và **B2 "萤火光尘" (đom đóm, bụi sáng)**: lớp hạt bụi nhỏ mờ lơ lửng trong tia sáng chồng lên ảnh. Hợp c3, c5, c7 (phòng trọ). Nhẹ máy, dễ thử trước.
- **M2 "纸感手写笔记" (ghi chú tay trên giấy)**: chữ như viết tay, thay chữ in trên sổ ở c4 (overlay `phone`).
- **C1 "水墨晕开" (mực loang)**, **D4 "天亮" (bình minh)**: có thể làm chuyển cảnh nền hoặc đoạn mở, nặng hơn.
- Repo không có mục chuyển cảnh riêng, nên không thêm được vào 3 kiểu hiện có.
Cách thử: một cảnh của tập sau, đánh giá bằng mắt, giữ máy không nặng, rồi mới đưa vào mục "fx.json" ở trên.

## Mở đầu và nhịp mới (từ tập 6)

Lý do: số liệu TikTok Studio ngày 08/11/2026 cho thấy tập 1 đến 4 chỉ được khoảng 100 đến 130 view. Người xem ở lại trung bình 5 đến 14 giây, chỉ 3% xem hết, và đa số lướt đi ở giây thứ 2. Các thông số dưới đây lấy từ bản đo 20 short trong repo mromidev/claude-animated-shorts (`references/STYLE_BIBLE.md`). Chỉ lấy thông số, không cài pipeline 3D của repo đó vì nặng máy và đổi phong cách.

1. **Giây đầu:**
   - Giọng vào trong 0,15 giây đầu: `lead_in` gần 0 và không có tiếng mở đầu dài.
   - Câu hook hiện bằng chữ to ngay từ khung 1. Chữ nằm giữa vùng an toàn, viền tối, hiện từng cụm theo giọng.
   - Không có thẻ tên series ở khung 1.
2. **Thẻ tên series:** dời tới khoảng giây 3 đến 4, sau khi đọc xong câu hook. Thẻ nhỏ một dòng ở trên, y từ 220 trở xuống trong vùng an toàn, không vệt sáng. Hiện khoảng 1,5 giây.
3. **Khung đầu:**
   - Ảnh c1 phải có điểm sáng nóng (đèn vàng, màn hình) hoặc một vật lạ ở cận cảnh, không dùng cảnh phòng tối đứng yên.
   - Riêng cảnh 1: máy đẩy vào nhanh ở 0,3 giây đầu rồi chậm dần trong 8 đến 10 khung, sau đó đẩy chậm như thường.
   - Các cảnh sau vẫn tắt `beats`, vì người dùng chê giật.
4. **Độ dài:** đích 60 đến 75 giây.
   - Khoảng lặng giữa các dòng 0,5 đến 0,8 giây.
   - Chỉ giữ một khoảng lặng dài ở cao trào, tối đa 2 giây.
   - Câu cuối giữ hình 3 giây rồi hiện chữ kết. Kịch bản phía phiên chính viết ngắn lại cho khớp.
5. **Âm lượng:**
   - Tổng khoảng -14 LUFS, đỉnh dưới -1 dBTP. Trước đây đích là -17.
   - Nhạc nền thấp hơn giọng khoảng 8 đến 10 dB.
6. **Chuyển cảnh:** giữ `blur` và `dip`. Khi đổi nơi chốn, ví dụ từ phòng trọ sang hiên nhà má, dùng `blur` ngắn 0,2 đến 0,3 giây thay cho cắt cứng.

Sau khi đăng tập 6, so view, thời gian xem trung bình và tỉ lệ xem hết với mốc 08/11 (tập 3: 14 giây, 3,9%).

## Watermark (từ tập 3, bắt buộc mọi video)
fx.json thêm `"watermark": {"text": "@dark.sky.quotes", "size": 30, "x": 60, "y": 1395, "opacity": 0.45}`. `render_series.py` vẽ chữ nhỏ mờ ở góc trái dưới, trong vùng an toàn. Tập 1 và 2 chưa có.

## Nhạc v2 (từ tập 3)
fx.json thêm `"music_v2": true` để dùng nhạc mới trong `render_series.py`: piano rải đều theo mẫu `music_pattern` (bước `music_step` giây), nền dây ấm và cello có rung, tiếng búa chạm dây, vang dài hơn, lowpass 9 kHz. `strings_gain` ở v2 nên đặt khoảng 7 (v1 là 0,5 đến 1). Không bật thì giữ nhạc cũ như tập 1, 2. Chỉ trộn lại nhạc lên hình có sẵn: `--mix-video output.mp4 --out mix.mp4` (khoảng 30 giây).

### Mục fx.json mới cho nhịp từ tập 6 (đã có trong render_series.py)
- `hook.rows[]`: thêm `"instant": true` (chữ nét đủ từ khung 0, không hiện dần) và `"leave": ["we",[câu,"cụm"]]` (mốc chữ tan). Bỏ `at` để chữ hiện từ khung 0, đặt `lead_in` gần 0 trong voices.json.
- `card`: thêm `"show": giây hoặc [câu,frac]` thì thẻ thành một dòng nhỏ "TÊN SERIES · TẬP N", không vệt sáng. `dur` mặc định 1,5 giây, `y` mặc định 230, `size` mặc định 34. Không có `show` thì thẻ cũ.
- `scenes.c1-*.intro_push`: `{"amount": 0.07, "fast": 0.3, "settle": 0.3}` là cú đẩy vào nhanh rồi chậm dần ở đầu cảnh.
- `master_lufs` (ví dụ -14), `master_tp`, `master_lra`: chuẩn hóa tổng bằng loudnorm sau khi trộn. Thử trên mix tập 5: đích -14 ra khoảng -15,3 LUFS, đỉnh -1,4 dBFS (nới `master_tp` lên -1 thì -15,0 nhưng đỉnh -0,8 sau AAC). Muốn sát -14 hơn thì phải nâng giọng, không nên nới đỉnh.
- Chạy bằng python hệ thống (3.13), không dùng `.tools/visual` (Python cũ, lỗi f-string).

## Chuyển cảnh `brush` (từ tập 9)
Vệt cọ sơn dầu quét ngang: cảnh mới hiện ra theo một vệt cọ dày, mép là sợi lông cọ (nhiễu tạo bằng code, cố định theo `seed`, không dùng file ngoài, không lóe sáng, không âm nhấn). Tính mask ở độ phân giải thấp rồi phóng lên nên không nặng máy. Dùng khi đổi nơi chốn (ví dụ hẻm sang phòng trọ, cửa nhà sang sân thượng); chuyển cảnh trong cùng một nơi vẫn dùng `blur`.
- Khai trong `scenes.<cảnh sau>`: `"in": "brush", "in_dur": 0.7` (0,6 đến 0,8 giây), tùy chọn `"dir"` (1 là trái sang phải, -1 là phải sang trái), `"angle"` (độ nghiêng vệt, mặc định -7), `"seed"` (đổi để vệt khác nhau, mặc định 7).
- Mã ở `brush_mask()` trong `tools/render_series.py`. Cảnh mới hiện theo ease, nên cảnh sau bắt đầu từ mốc `start` của cảnh (đã trừ `lead`).
- Muốn giữ hình cảnh trước sau khi hết lời, tăng `pause` của dòng cuối cảnh đó trong `voices.json` rồi chạy lại `make_timeline_lines.py` (tập 9: c1 pause 2,1 giây để giữ hình khoảng 2 giây).
- Lớp phủ cho `brush` (từ v3 tập 9): thêm `"canvas": true` vào cảnh thì trong lúc vệt cọ chạy có vân vải canvas thoáng qua vùng chuyển và một dải sơn ướt bóng nhẹ dọc mép vệt, tan hẳn khi chuyển xong (không lóe sáng, không âm). Vân vải tạo bằng code, cố định. Tùy chọn `"sheen"` (mặc định 1,0) chỉnh độ bóng của dải sơn; bỏ `canvas` thì như bản đầu.

## Thẻ thời gian `timecards` (từ tập 9)
Dùng khi cảnh sau quay về thời điểm sớm hơn cảnh trước (ví dụ cảnh 1 là hai giờ sáng, cảnh 2 là lúc Minh còn nằm trong phòng). fx.json thêm `"timecards": [{"scene": "c2-dem-nguoc", "text": "Một tiếng trước", "dur": 1.5, "y": 230, "size": 34, "halo": true}]`.
- Thẻ một dòng như thẻ series, hiện ngay khi chuyển cảnh vào `scene` chạy xong (`start` của cảnh cộng `in_dur`, tùy chọn `delay`), giữ `dur` giây rồi tan.
- Thẻ ngày, bộ đếm và bong bóng của cảnh đó nên bắt đầu sau khi thẻ thời gian bắt đầu tan (tập 9: counter `start` [1, 0.08]) để không hiện chồng lên lúc vệt cọ đang chạy.
- Muốn có thời gian cho thẻ trước khi giọng vào: tăng `lead` của cảnh sau và cộng thêm đúng chừng đó vào `pause` của dòng cuối cảnh trước (tập 9: lead c2 1,3 giây, pause c1 3,1 giây), rồi chạy lại `make_timeline_lines.py`.
