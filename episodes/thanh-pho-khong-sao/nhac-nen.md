# Nhạc nền Thành Phố Không Sao, tuần 1 (tập 1 đến 5)

- **Trạng thái:** bản thiết kế ngày 03/11/2026, chưa nghe thử. Tập 1 làm mẫu trước, tập 2 đến 5 áp dụng khi có kịch bản.
- **Cách làm:** dựng nhạc bằng code trong `tools/render_series.py`, trộn sẵn vào video, không tốn phí và không lo bản quyền. Lúc đăng không gắn thêm nhạc TikTok, giống tập 001 và 002. Thay cho dòng "thêm nhạc trong TikTok lúc đăng" của kế hoạch gốc, vì nhạc TikTok không canh được các khoảng lặng theo từng câu.

## Phần chung của cả tuần

| Mục | Thiết kế |
|---|---|
| Tâm trạng | Một mình trong phòng trọ lúc tối: buồn, lắng, không bi lụy |
| Nhạc cụ | Piano thưa trên nền dây rất nhẹ, có vang như phòng rộng. Không trống, không nhịp đều |
| Hợp âm | Am, F, Dm, Am, mỗi hợp âm 8 giây. Bỏ vòng Am, F, C, G và hợp âm trưởng rải cuối bài của tập 001, 002 vì nghe có hậu quá sớm |
| Nhạc đề | 5 nốt piano theo 5 chữ "Con không sao đâu má": E5, D5, C5, D5, B4, mỗi nốt khoảng 1 giây, nốt cuối ngân |
| Vị trí nhạc đề | Sân thượng cuối tập, bắt đầu ngay khi hết lời, trong lúc giữ hình và hiện chữ kết |
| Âm lượng | Bắt đầu thử ở -24 LUFS, giọng giữ -15 LUFS, chốt bằng tai. Nhạc tự hạ khi có lời (sidechain sẵn có), highpass 140 Hz để không đè giọng |
| Mở đầu | Vào ngay từ khung đầu, không dạo trước |
| Kết thúc | Nốt cuối ngân rồi tắt theo video, không có hợp âm kết |

**Vì sao nốt cuối là B4:** nốt này treo trên hợp âm Am, nghe như chưa nói hết. Cả mùa giữ nguyên như vậy. Tập 20, khi "Con không sao đâu má" thành lời thật, thêm nốt A4 để lần đầu nhạc đề được khép lại.

**Quy tắc khoảng lặng:** câu nặng nhất mỗi tập, nhạc rút gần hết ngay trước câu đó và chỉ quay lại sau khoảng lặng. Các khoảng nghỉ chuyển cảnh thường để nhạc nổi lên nhẹ, lấp chỗ trống.

## Khác nhau theo từng tập

| Tập | Không khí | Độ dày nhạc | Chỗ rút nhạc | Cuối tập |
|---|---|---|---|---|
| 1 · Chín triệu | Mất hết trong một ngày | Thưa, dày dần từ cảnh 6 | Trước "Con không sao đâu má"; sau "Mà mình còn có chín" chỉ một nốt trầm | Nhạc đề đủ 5 nốt |
| 2 · Phòng trọ mười hai mét vuông | Thu mình, đếm từng khoản | Thưa nhất, gần như chỉ piano trầm | Lúc cô Sáu nhắc tiền phòng | Hẹn "tuần sau": nhạc đề đủ 5 nốt, chậm hơn |
| 3 · Ba mươi bộ hồ sơ | Cố gắng, rồi bị chê tuổi | Nhiều nốt hơn lúc rải hồ sơ | Ở "ưu tiên dưới 30 tuổi" | Số lạ gọi: nhạc đề, nhấc nhẹ quãng cao để có chút hy vọng |
| 4 · Người phỏng vấn trẻ hơn tôi | Hy vọng rồi hụt | Sáng nhất tuần ở đầu tập | Cắt hẳn ở email từ chối | Nhạc đề đủ 5 nốt, về lại quãng thường |
| 5 · Cuộc gọi lúc chín giờ tối | Nặng nhất tuần | Dây dày hơn | Cuộc gọi của má, lặp lại đúng cách rút nhạc ở cảnh 7 tập 1 | Dừng sau nốt thứ 4, để treo câu bình chọn |

## Trộn vào tập 1

| Mốc | Nhạc |
|---|---|
| Cảnh 1 đến 5 | Piano thưa, dây rất nhẹ, nổi nhẹ trong các khoảng nghỉ |
| Cảnh 6, "còn đúng chín triệu" | Piano dày hơn một chút, dừng hẳn nốt mới trong khoảng nghỉ sau câu |
| Cảnh 7, đầu cuộc gọi | Vào lại nhẹ, thật ấm |
| Cảnh 7, trước "Con không sao đâu má" | Rút gần hết trong khoảng ngừng 1 giây, giữ lặng suốt câu và khoảng nghỉ sau câu |
| Cảnh 8, sau "Mà mình còn có chín" | Một nốt A2 trầm, ngân trong khoảng nghỉ |
| Cảnh 9, trong lời | Dây vào lại rất nhẹ |
| Cảnh 9, hết lời | Nhạc đề 5 nốt, B4 ngân tới hết video |

## Cần nghe khi thử

- Piano dựng bằng code có nghe giả không. Nếu giả, mới tính nguồn nhạc khác.
- Nhạc có đè chữ khi giọng đọc nhỏ cuối câu không.
- Nhạc đề có quá giống giai điệu quen nào không.
