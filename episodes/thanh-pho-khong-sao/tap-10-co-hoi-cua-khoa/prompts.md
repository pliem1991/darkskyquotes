# Prompt Google Flow: Thành Phố Không Sao, tập 10 "Cơ hội của Khoa"

Phong cách: **sơn dầu nắng gió sông nước**, giống các tập trước. Khổ vuông 1:1, Nano Banana 2.1, **mỗi lần tạo x1**.

Tổng cộng 9 ảnh: 1 ảnh nhân vật mới (`khoa`) dùng lại cho tập 11, và 8 ảnh cảnh.

Thời gian: chiều thứ tư nắng vàng (cảnh 2 ngoài đường; cảnh 1, 3 đến 7 ở một quán cà phê vỉa hè có mái che), đêm trên sân thượng (cảnh 8).

## Thứ tự tạo

1. **`khoa` trước**, không đính kèm ảnh nào. Lưu vào `episodes/thanh-pho-khong-sao/nhan-vat/khoa.jpg`.
2. **`c3-xe-moi`** tiếp theo: ảnh gốc của quán cà phê, chiếc xe tay ga mới, Khoa và Minh. c1, c4, c5, c6, c7 đính kèm c3 để giữ cùng quán, cùng bàn, cùng áo.
3. Các cảnh còn lại theo bảng.

## Tham chiếu dùng chung

- `minh`: `nhan-vat/minh.jpg` (trên Flow ở project "Tháng 11 04 - 14:41")
- `khoa`: `nhan-vat/khoa.jpg` (tạo ở bước 1)
- Xe đỏ đen của Minh và áo giao hàng: ảnh tập 7 (project "DSQ - Thành Phố Không Sao 2", ví dụ "Men talking in alley...") hoặc ảnh c1 tập 8 (project "DSQ - TPKS tập 8")
- Sân thượng và chậu trầu bà: ảnh c9 tập 9 (project "DSQ - TPKS tập 9") hoặc c8 tập 8

**Trang phục và đồ vật:**
- Minh: áo khoác gió mỏng màu tối có một sọc phản quang mảnh, không logo, như tập 7 và 8; bên trong áo thun xám, quần dài tối màu. Nón bảo hiểm trơn treo trên xe.
- Khoa: khoảng 32 tuổi, cùng tuổi Minh nhưng trông bóng bẩy: tóc vuốt gọn rẽ ngôi, áo polo trắng ôm người **không logo**, quần kaki màu be, đồng hồ kim loại sáng, kính râm cài trên đầu. Cười nhiều, tự tin.
- Xe của Khoa: xe tay ga mới bóng loáng màu trắng ngà, **không logo, không biển số đọc được**.
- Quán: cà phê vỉa hè Sài Gòn có mái hiên, bàn nhựa thấp, ghế nhựa, ly cà phê sữa đá.
- Điện thoại của Khoa: màn hình sáng nhưng **trống**, chữ và số sẽ ghép lúc dựng.

**Kiểm tra từng ảnh:**
- Không chữ, không logo trên áo, xe, ly, bảng quán, điện thoại.
- Tay, ly, điện thoại, đồng hồ không méo.
- Minh trông 32 tuổi, cùng người với các tập trước; Khoa cùng một người ở mọi cảnh.
- Chủ thể gần giữa, chừa trống phía trên cho chữ hook (cảnh 1) và chữ bình chọn (cảnh 8).

Phần ghép lúc dựng, không vẽ vào ảnh: chữ hook, thẻ series, thẻ ngày, màn hình "Số dư: 38.450.000đ", thông báo "+2.000.000đ", câu của Khoa, chữ bình chọn.

## Ảnh theo lời đọc

| Tên ảnh | Tham chiếu | Lời đọc |
|---|---|---|
| `c1-nap-truoc` | `khoa`, `c3-xe-moi` | Thằng bạn đại học rủ làm việc online (...) mỗi ngày lời năm trăm ngàn |
| `c2-muoi-don` | `minh`, ảnh xe tập 7 hoặc 8 | Sáng nay đơn nào tới cũng bấm nhận (...) Khoa nhắn rủ đi cà phê |
| `c3-xe-moi` | `minh`, `khoa` | Khoa đậu chiếc xe tay ga mới toanh trước quán (...) áo giao hàng vẫn mặc nguyên |
| `c4-so-du` | `khoa`, `c3-xe-moi` | Nó nghe bạn chung kể (...) rút về hai triệu |
| `c5-chot-don` | `minh`, `khoa`, `c3-xe-moi` | Việc chỉ là bấm chốt đơn giùm mấy cửa hàng (...) |
| `c6-nham-tinh` | `minh`, `c3-xe-moi` | Một ngày của Khoa bằng gần ba ngày chạy đơn (...) |
| `c7-gap` | `minh`, `khoa`, `c3-xe-moi` | Hỏi lại sao phải nạp trước (...) chậm là hết suất |
| `c8-san-thuong` | `minh`, sân thượng tập 9 | Tối lên sân thượng (...) gần như không còn đồng nào |

## Ảnh nhân vật

### khoa

```text
Character reference sheet of one Vietnamese man, 32 years old, clearly an adult, fit build, neatly styled side-parted black hair with a little gel, confident wide smile, clean-shaven, fitted plain white polo shirt with no logo, beige chino trousers, shiny metal wristwatch, sunglasses pushed up on his head, clean white sneakers. Front view, side view and full body on a plain warm ochre background. Vietnamese oil painting, thick visible brush strokes, earthy palette of river-silt brown, coconut green and golden light. No text, no letters, no logo, no watermark.
```

## Prompt

### c3-xe-moi (làm trước, ảnh gốc của quán)

```text
Vietnamese oil painting, thick visible brush strokes, warm golden late-afternoon light on a Saigon sidewalk cafe with a striped awning, low plastic tables and stools, glasses of iced milk coffee. A brand-new glossy ivory-white scooter with no logo and no readable plate is parked right in front of the cafe, shining in the sun. The man from the Khoa character reference, 32, white polo with no logo, beige chinos, shiny wristwatch, sunglasses on his head, sits relaxed on a stool beside it, one arm resting on the scooter seat, smiling. The man from the Minh character reference, same age, walks up in a plain dark windbreaker with one thin reflective strip and dark trousers, helmet in hand, his old red-and-black motorbike parked at the edge of the frame. The contrast between the two men is clear but quiet. Both men centered with generous space around. Natural hand anatomy. No text, no letters, no logo, no watermark. Square 1:1.
```

### c1-nap-truoc (khung mở đầu, phải bắt mắt)

```text
Vietnamese oil painting, thick visible brush strokes, warm golden afternoon light at the same sidewalk cafe from the reference. Close view across a low plastic table: the man in the white polo from the reference leans forward with a big confident smile and holds his phone out toward the viewer, the screen glowing bright and blank, the brightest spot in the picture. His shiny wristwatch catches the light. A glass of iced milk coffee sweats on the table. In the soft background, the younger man in the dark windbreaker sits across, slightly out of focus. Tempting, too-good-to-be-true mood. Phone and face in the lower middle with open space above for text. Natural hand anatomy. No text, no letters, no numbers, no logo, no watermark. Square 1:1.
```

### c2-muoi-don

```text
Vietnamese oil painting, thick visible brush strokes, bright afternoon sun on a busy Saigon street. The same 32-year-old man from the reference, in the plain dark windbreaker with one thin reflective strip, sits on his old red-and-black motorbike at the curb, helmet on, wiping sweat from his forehead with the back of his hand, a small tired but satisfied half-smile. His phone on the handlebar glows with a blank screen. A plastic delivery bag hangs from the hook. Traffic and street trees blurred behind. Busy, slightly hopeful mood. Subject centered with generous space around. Natural hand anatomy. No text, no letters, no logo, no license plate numbers, no watermark. Square 1:1.
```

### c4-so-du

```text
Vietnamese oil painting, thick visible brush strokes, warm afternoon light at the same cafe table from the reference. Close view of the man in the white polo holding his phone tilted toward the man in the dark windbreaker, tapping the glowing blank screen with one finger, eyebrows raised, proud. The younger man leans in to look, face lit by the screen, unsure. Iced coffee glasses and a small ashtray on the table. Persuasive mood. Phone and both faces centered. Natural hand anatomy. No text, no letters, no numbers, no logo, no watermark. Square 1:1.
```

### c5-chot-don

```text
Vietnamese oil painting, thick visible brush strokes, the same sidewalk cafe from the reference in warm late-afternoon light. Medium view of both men at the low table: the man in the white polo talks with easy hand gestures, his phone face-up on the table between them glowing blank, his wristwatch shining. The man in the dark windbreaker listens with his elbows on his knees, eyes on the phone. Light and shadow from the striped awning across the table. Smooth-talking mood. Both men centered with generous space around. Natural hand anatomy. No text, no letters, no logo, no watermark. Square 1:1.
```

### c6-nham-tinh

```text
Vietnamese oil painting, thick visible brush strokes, the same cafe in warm golden light now turning orange. Close view of the man in the dark windbreaker alone at the low table for a moment, looking down at his own cracked old phone in both hands, its blank screen glowing, lips moving slightly as if counting. His glass of iced milk coffee half melted beside him, condensation running. Behind him, soft and blurred, the shiny ivory scooter. Tempted, calculating mood. Face and phone centered. Natural hand anatomy. No text, no letters, no numbers, no logo, no watermark. Square 1:1.
```

### c7-gap

```text
Vietnamese oil painting, thick visible brush strokes, sunset orange light at the same sidewalk cafe. The man in the white polo has stood up, sunglasses now on his eyes, one hand checking his shiny wristwatch, the other hand patting the shoulder of the man in the dark windbreaker who is still seated, looking up at him. The glossy ivory scooter waits beside them, key in. Hurried, pushy mood. Both men centered with generous space around. Natural hand anatomy. No text, no letters, no logo, no watermark. Square 1:1.
```

### c8-san-thuong

```text
Vietnamese oil painting, thick visible brush strokes, deep blue-green night with hazy orange glow and golden city lights, clear shapes, not muddy. Night on the same rooftop of an old Saigon boarding house as the reference, laundry lines and a stainless steel water tank, the small white pot of pothos on the low parapet. The same man in the dark windbreaker, unzipped over a grey t-shirt, sits on a low plastic stool, seen from the side, holding his phone with both hands, the screen glowing on his face, his thumb hovering above it, not pressing. Beyond him countless lit windows. The sky is a hazy orange-grey glow, completely empty, not a single star, no moon. Torn, undecided mood. Subject centered in the lower half with open sky above for text. Natural hand anatomy. No text, no letters, no logo, no watermark. Square 1:1.
```
