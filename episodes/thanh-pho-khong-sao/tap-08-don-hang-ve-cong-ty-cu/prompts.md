# Prompt Google Flow: Thành Phố Không Sao, tập 8 "Đơn hàng về công ty cũ"

Phong cách: **sơn dầu nắng gió sông nước**, giống các tập trước. Khổ vuông 1:1, Nano Banana 2.1.

Tổng cộng 9 ảnh: 1 ảnh nhân vật mới (`chi-thao`) dùng lại được cho các tập sau, và 8 ảnh cảnh. Chú bảo vệ ở cảnh 3 chỉ xuất hiện một lần, không cần ảnh nhân vật riêng.

Thời tiết trong ngày: trưa nắng gắt, trời trong (cảnh 1, 2), trong sảnh tòa nhà ánh đèn trắng lạnh pha nắng hắt qua cửa kính (cảnh 3 đến 6), tầng hầm giữ xe đèn huỳnh quang tối (cảnh 7), đêm (cảnh 8).

## Thứ tự tạo

1. **`chi-thao` trước**, không đính kèm ảnh nào. Lưu vào `episodes/thanh-pho-khong-sao/nhan-vat/chi-thao.jpg`.
2. **`c4-thang-may` tiếp theo.** Đây là ảnh sảnh và thang máy, đính kèm `c4-tra-the` của tập 1 để khớp tòa nhà cũ. Ưng rồi thì c3, c5, c6 đính kèm c4 để giữ cùng một sảnh.
3. **`c5-chi-thao` rồi `c6-cai-chau`.** c6 đính kèm c5 để giữ đúng áo chị Thảo và cái chậu trầu bà.
4. Các cảnh còn lại theo bảng. c7 và c8 đính kèm c6 để giữ đúng cái chậu.

## Tham chiếu dùng chung

- `minh`: `nhan-vat/minh.jpg`
- `chi-thao`: `nhan-vat/chi-thao.jpg` (tạo ở bước 1)
- Hành lang thang máy công ty cũ: `tap-01-chin-trieu/images/c4-tra-the.jpg`
- Văn phòng cũ: `tap-01-chin-trieu/images/c3-ban-giao.jpg`
- Xe của Minh: `tap-07-ngay-dau-giao-hang/images/c5-chu-tu.jpg`
- Sân thượng: `tap-07-ngay-dau-giao-hang/images/c8-san-thuong.jpg`

**Trang phục và đồ vật:**
- Minh, cả tập: áo khoác gió mỏng màu tối có một sọc phản quang mảnh, **không logo, không chữ**, giống tập 7. Bên trong là áo thun xám cũ, quần dài tối màu. Trong tòa nhà không đội nón bảo hiểm.
- Xe của Minh: xe số cũ màu đỏ đen như cảnh 5 đến 7 của tập 7.
- Túi đồ uống: một túi ni lông lớn trong suốt đựng bảy ly trà sữa nắp tròn, ống hút để riêng, ly trơn không in chữ.
- Chậu trầu bà: chậu nhựa trắng nhỏ cỡ hai bàn tay, dây trầu bà lá xanh có vệt vàng rủ xuống một bên. Cùng một chậu ở cảnh 5 đến 8.
- Chị Thảo: như ảnh nhân vật.
- Chú bảo vệ (cảnh 3): khoảng 55 tuổi, đồng phục bảo vệ xám xanh, nón kết cùng màu, **không phù hiệu có chữ**.

**Kiểm tra từng ảnh:**
- Không chữ, không logo trên áo, ly, bảng, thẻ, điện thoại, thang máy, biển bãi xe.
- Tay, ly nhựa, chậu cây và điện thoại không méo. Cảnh 4: một tay cầm điện thoại, một tay kéo vạt áo, túi trà sữa đặt dưới chân, không để Minh có ba tay.
- Chủ thể gần giữa khung, chừa trống phía trên cho chữ hook ở cảnh 1 và chữ kết ở cảnh 8.
- Minh trông 32 tuổi, cùng một người với các tập trước.

Phần ghép lúc dựng, không vẽ vào ảnh: chữ hook, thẻ series, thẻ ngày, thẻ đơn "7 ly trà sữa · Tầng 12", chữ tấm bảng "Shipper vui lòng chờ tại sảnh", câu của chị Thảo. Ở cảnh 6, lúc đọc "thấy hình tài xế", có thể ghép một khung điện thoại nhỏ với ảnh mặt Minh cắt từ `nhan-vat/minh.jpg` (khung chung chung, không logo, không tên) để người xem thấy chị nhận ra qua ảnh.

## Ảnh theo lời đọc

| Tên ảnh | Tham chiếu | Lời đọc |
|---|---|---|
| `c1-don-hang` | `minh`, `c5-chu-tu` (tập 7) | Bảy ly trà sữa trưa nay (...) đúng phòng cũ của mình |
| `c2-muon-huy` | `minh`, `c1-don-hang` | Muốn bấm hủy đơn này (...) chắc gì gặp đúng người quen |
| `c3-bao-ve` | `minh`, `c4-thang-may` | Chú bảo vệ tám năm nay vẫn chào mình bằng tên (...) |
| `c4-thang-may` | `minh`, `c4-tra-the` (tập 1) | Đứng cạnh cái thang máy mọi sáng mình quẹt thẻ (...) bảo em chờ chị xuống liền |
| `c5-chi-thao` | `minh`, `chi-thao`, `c4-thang-may` | Cửa thang mở ra là chị Thảo (...) |
| `c6-cai-chau` | `minh`, `chi-thao`, `c5-chi-thao` | Chị kể thấy hình tài xế là biết (...) chỉ nói được tiếng dạ |
| `c7-bai-xe` | `minh`, `c6-cai-chau` | Xuống bãi xe ngồi trên yên rất lâu (...) như khách lạ |
| `c8-san-thuong` | `minh`, `c6-cai-chau`, `c8-san-thuong` (tập 7) | Tối đặt chậu lên lan can sân thượng (...) như có ai vừa tưới sáng nay |

## Ảnh nhân vật

### chi-thao

```text
Character reference sheet of one Vietnamese woman, about 38 years old, clearly an adult office worker, medium build, shoulder-length black hair tied in a low loose ponytail with a few strands falling, warm but tired eyes, faint smile lines, small plain round earrings, cream short-sleeve blouse, dark navy slacks, flat shoes, plain staff lanyard with a blank card. Front view, side view and full body on a plain warm ochre background. Vietnamese oil painting, thick visible brush strokes, earthy palette of river-silt brown, coconut green and golden light. No text, no letters, no logo, no watermark.
```

## Prompt

### c1-don-hang (khung mở đầu, phải bắt mắt)

```text
Vietnamese oil painting, thick visible brush strokes, harsh bright noon sun in Saigon. Low angle from the sidewalk: the same 32-year-old man in a plain dark windbreaker with one thin reflective strip sits on his old red-and-black motorbike at the curb, helmet still on, one foot on the ground, his head tilted back to look up at a tall glass office tower that fills the frame above him, the glass reflecting white sky. A large clear plastic bag with seven round-lidded milk tea cups hangs from the hook in front of his seat. His phone on the handlebar glows with a blank screen. Small street trees, a row of parked motorbikes. Uneasy, frozen mood. Subject centered in the lower half with the tower and open space above. No text, no numbers, no letters, no logo, no signage, no watermark. Square 1:1.
```

### c2-muon-huy

```text
Vietnamese oil painting, thick visible brush strokes, bright noon light. Close view at the curb in front of the same glass office tower: the same man in the plain dark windbreaker, helmet pushed up, holds his phone in one hand, his thumb hovering just above the glowing blank screen, not pressing. Beside his knee the clear bag of seven milk tea cups hangs from the motorbike hook, condensation dripping down the cups. The building entrance is soft and blurred behind him. Hesitant mood. Hand, phone and face centered. Natural hand anatomy. No text, no letters, no logo, no watermark. Square 1:1.
```

### c3-bao-ve

```text
Vietnamese oil painting, thick visible brush strokes, cool white lobby light mixed with warm sun from the glass doors. Inside the same office building lobby as the reference, polished floor, elevator doors on one side. A security guard about 55 years old in a plain grey-blue uniform and cap, no badges with text, stands behind a reception desk and points with his arm stretched toward a corner by the wall, where a plain standing sign board stands, completely blank. The same 32-year-old man in the plain dark windbreaker, holding the clear bag of seven milk tea cups, stops halfway across the floor, looking at the guard. Polite, distant, embarrassing mood. Both figures centered with generous space around. No text, no letters, no logo, no watermark. Square 1:1.
```

### c4-thang-may

```text
Vietnamese oil painting, thick visible brush strokes, cool white lobby light, the same office building and closed metal elevator doors as the reference image from episode one, a small card reader panel beside the doors. The same man in the plain dark windbreaker stands close to the wall beside the elevator, phone pressed to his ear with one hand, his other hand tugging the hem of the windbreaker down and to the side, shoulders hunched, eyes lowered. The clear bag of seven milk tea cups rests on the floor by his feet. Office workers in shirts pass blurred in the background, nobody looking at him. Small, out-of-place mood. Subject centered with generous space around. Natural hand anatomy. No text, no letters, no logo, no watermark. Square 1:1.
```

### c5-chi-thao

```text
Vietnamese oil painting, thick visible brush strokes, cool white lobby light. The same elevator doors are sliding open. Inside the elevator stands the woman from the reference, about 38, cream blouse, navy slacks, low ponytail, a blank staff card on a lanyard, holding a small white plastic pot of golden pothos against her chest with both arms, its green and yellow vines trailing down. She looks straight out at the man with a small, careful expression. In the foreground, seen from behind and a little to the side, the same man in the plain dark windbreaker stands frozen, the bag of milk tea in his hand. Surprised, still mood. Woman and pot centered. No text, no letters, no logo, no watermark. Square 1:1.
```

### c6-cai-chau

```text
Vietnamese oil painting, thick visible brush strokes, cool lobby light with a soft warm patch of sun on the floor. Closer view, both people from the side: the woman in the cream blouse holds the clear bag of seven milk tea cups in one hand, and with the other hand she places the small white pot of golden pothos into the man's open hands. The man in the plain dark windbreaker takes it carefully, head slightly bowed, lips pressed together, unable to speak. Her expression is plain and kind, not pitying. The pothos vines hang over his fingers. Quiet, tender mood. Hands and pot centered. Natural hand anatomy. No text, no letters, no logo, no watermark. Square 1:1.
```

### c7-bai-xe

```text
Vietnamese oil painting, thick visible brush strokes, dim underground motorbike parking with flickering pale fluorescent tubes and low concrete ceiling, long tight rows of parked motorbikes. The same man in the plain dark windbreaker sits sideways on the seat of his old red-and-black motorbike, helmet hanging on the mirror, the small white pot of golden pothos held between his knees. His phone in his hand glows brighter than everything around him, his thumb resting above the screen, not pressing. He stares at nothing. Long, empty, heavy mood. Subject centered with generous dark space around. No text, no letters, no numbers, no logo, no signage, no watermark. Square 1:1.
```

### c8-san-thuong

```text
Vietnamese oil painting, thick visible brush strokes, deep blue-green night with hazy orange glow and golden city lights, clear shapes, not muddy. Night on the same rooftop of an old Saigon boarding house, laundry lines and a stainless steel water tank. The small white pot of golden pothos sits on the low concrete parapet, in sharp focus. The same man in the plain dark windbreaker, seen from the side and a little behind, has two fingertips pressed into the dark soil of the pot, looking at his fingers. Beyond him countless lit windows across the city. The sky is a hazy orange-grey glow, completely empty, not a single star, no moon. Quiet, slowly understanding mood. Pot and hand centered in the lower half with open sky above for text. No text, no letters, no logo, no watermark. Square 1:1.
```
