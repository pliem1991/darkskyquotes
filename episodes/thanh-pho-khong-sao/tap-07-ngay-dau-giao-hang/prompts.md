# Prompt Google Flow: Thành Phố Không Sao, tập 7 "Ngày đầu giao hàng"

Phong cách: **sơn dầu nắng gió sông nước**, giống các tập trước. Khổ vuông 1:1, Nano Banana 2.1.

Tổng cộng 8 ảnh cảnh, không có nhân vật mới cần làm ảnh riêng. Ông xe ôm ở cảnh 7 là người lạ, đứng xa, không phải chú Tư.

Thời tiết trong ngày: sáng mưa xám (cảnh 1, 3, 4), sáng sớm trong phòng trọ (cảnh 2), trưa vừa tạnh mưa, đường còn ướt bóng (cảnh 5, 6), chiều nắng vàng (cảnh 7), đêm (cảnh 8).

## Thứ tự tạo

1. **c1 trước.** Đây là khung mở đầu, phải bắt mắt. c3 và c4 đính kèm c1 để giữ đúng áo mưa, xe và túi hai ly cà phê.
2. **c5 tiếp theo.** Đây là ảnh đầu hẻm có chú Tư. c6 đính kèm c5 để giữ đúng đầu hẻm, xe và áo của chú.
3. Các cảnh còn lại theo bảng.

## Tham chiếu dùng chung

- `minh`: `nhan-vat/minh.jpg`
- `chu-tu`: `nhan-vat/chu-tu.jpg`
- Chú Tư ở tập 3: `tap-03-ba-muoi-bo-ho-so/images/c6-chu-tu.jpg`
- Phòng trọ: `tap-05-cuoc-goi-chin-gio-toi/images/c6-tinh-tien.jpg`
- Sân thượng và áo giao hàng: `tap-06-thung-do-tu-que/images/c8-san-thuong.jpg`

**Trang phục:**
- Minh, cả tập: áo khoác gió mỏng màu tối có một sọc phản quang mảnh, **không logo, không chữ**, như áo trên đầu gối Minh ở ảnh sân thượng tập 6. Bên trong là áo thun xám cũ, quần dài tối màu, nón bảo hiểm trơn.
- Áo mưa của Minh (cảnh 1, 3, 4): áo mưa cánh dơi bằng nhựa màu xanh lá đậm, trùm kín người, chỉ lộ chút cổ áo khoác.
- Chú Tư: như ảnh nhân vật: áo sơ mi xanh nhạt ngắn tay, kính lão cài túi áo, quần kaki, dép quai, nón bảo hiểm xanh dương cũ.
- Xe của Minh: xe số cũ màu đỏ đen, móc trước có túi ni lông treo đồ.

**Kiểm tra từng ảnh:**
- Không chữ, không logo trên áo, điện thoại, bảng số nhà, biển tiệm hay ly cà phê. Bảng số nhà chỉ là mảng màu, không đọc được số.
- Tay, ly nhựa và điện thoại không méo.
- Chủ thể gần giữa khung, chừa trống phía trên cho chữ hook ở cảnh 1.
- Minh trông 32 tuổi, cùng một người với các tập trước.

Phần ghép lúc dựng, không vẽ vào ảnh: chữ hook, thẻ ngày, câu của chú Tư, thẻ "+180.000đ".

## Ảnh theo lời đọc

| Tên ảnh | Tham chiếu | Lời đọc |
|---|---|---|
| `c1-khach-huy` | `minh` | Đơn giao hàng đầu tiên trong đời (...) chưa tìm ra nhà thì khách hủy |
| `c2-nam-gio-sang` | `minh`, `c6-tinh-tien` | Hồ sơ được duyệt lúc năm giờ sáng chủ nhật (...) |
| `c3-chay-mua` | `minh`, `c1-khach-huy` | Chạy chiếc xe tám năm chở mình đi làm (...) |
| `c4-mai-hien` | `minh`, `c1-khach-huy` | Hai ly cà phê sữa đó coi như của mình (...) |
| `c5-chu-tu` | `minh`, `chu-tu`, `c6-chu-tu` (tập 3) | Tới trưa thì tạnh mưa (...) giờ con cũng mặc cái áo giành khách của chú rồi đó |
| `c6-ly-ca-phe` | `minh`, `chu-tu`, `c5-chu-tu` | Mình đưa chú ly cà phê còn lại (...) cứ hỏi xe ôm đầu hẻm |
| `c7-hoi-duong` | `minh` | Buổi chiều lạc hai lần (...) |
| `c8-san-thuong` | `minh`, `c8-san-thuong` (tập 6) | Cả ngày được một trăm tám mươi ngàn (...) |

## Prompt

### c1-khach-huy (khung mở đầu, phải bắt mắt)

```text
Vietnamese oil painting, thick visible brush strokes, grey rainy morning in a narrow maze-like alley of old Saigon, wet concrete shining, tangled electric wires overhead, rows of narrow house fronts with closed metal gates and small blank number plates. The same 32-year-old man sits on an old red-and-black motorbike in a dark green bat-wing plastic raincoat, rain dripping from his plain helmet, one foot on the ground, turning his head to look up at the doors around him, lost. A small plastic bag with two iced coffee cups hangs from the hook in front of the seat. His phone on the handlebar glows with a blank map. Rain streaks in the air, the alley splitting into two smaller alleys ahead. Lost, tired mood. Subject centered with open space above. No text, no numbers, no letters, no logo, no watermark. Square 1:1.
```

### c2-nam-gio-sang

```text
Vietnamese oil painting, thick visible brush strokes, cold blue light before dawn in the same tiny rented room in Saigon. The same man, already dressed in a plain dark windbreaker with one thin reflective strip, sits on the edge of a low iron bed, elbows on knees, holding his phone in both hands, its screen glowing on his face. A plain helmet rests on the mattress beside him, a folded green plastic raincoat on top of it. Through the small window the sky is just turning grey. Waiting, sleepless mood. Subject centered with generous space around. No backpack, no bag in the room. No text, no letters, no logo, no watermark. Square 1:1.
```

### c3-chay-mua

```text
Vietnamese oil painting, thick visible brush strokes, grey rainy morning on a wide Saigon street full of motorbikes, everyone in colorful plastic raincoats, headlights and wet reflections on the asphalt. In the middle, the same man rides his old red-and-black motorbike in the dark green bat-wing raincoat that covers him completely, only a small edge of a dark jacket collar showing at his neck, face half hidden under the helmet and the raincoat hood. He looks like any other rider in the crowd. Anonymous, steady mood. Subject centered with generous space around. No text, no letters, no logo, no license plate numbers, no watermark. Square 1:1.
```

### c4-mai-hien

```text
Vietnamese oil painting, thick visible brush strokes, rainy morning, cool grey light. The same man in the dark green raincoat, hood pushed back, sits on the low step under the narrow tin awning of a small closed pharmacy, a plain green cross shape on the shutter with no letters. He drinks iced milk coffee through a straw from a plastic cup, eyes on the rain. His old red-and-black motorbike is parked at the edge of the awning, rain bouncing on the seat, a second plastic cup of iced coffee hanging in a small bag from the hook. Quiet, tired mood. Subject centered with generous space around. Natural hand anatomy. No text, no letters, no logo, no watermark. Square 1:1.
```

### c5-chu-tu

```text
Vietnamese oil painting, thick visible brush strokes, noon just after the rain, warm sun breaking through, the alley entrance wet and shining with puddles. At the mouth of the alley the same older man as the reference, about 60, in a pale green short-sleeved shirt with reading glasses in the pocket, khaki trousers and sandals, sits sideways on his old motorbike holding a worn blue helmet, looking up and down at the younger man. The same 32-year-old man has stopped his red-and-black motorbike beside him, the green raincoat folded on the seat, now wearing the plain dark windbreaker with one thin reflective strip, looking down, embarrassed. Half-teasing, half-sad mood. Both men near the center with space above. No text, no letters, no logo, no watermark. Square 1:1.
```

### c6-ly-ca-phe

```text
Vietnamese oil painting, thick visible brush strokes, warm noon light after rain at the same alley entrance. Closer view: the older man in the pale green shirt holds a plastic cup of milk coffee, the ice melted, the coffee pale and watery, drinking it in one go. With his other hand he points down into the narrow alley behind him, explaining. The younger man in the dark windbreaker leans in from his motorbike, listening carefully. Wet tangled wires and house fronts behind. Gentle, practical mood. Cup and hands centered. Natural hand anatomy. No text, no letters, no logo, no watermark. Square 1:1.
```

### c7-hoi-duong

```text
Vietnamese oil painting, thick visible brush strokes, late afternoon golden light at the entrance of a different narrow alley in Saigon. The same man in the plain dark windbreaker has stopped his red-and-black motorbike, a delivery bag hanging from the hook, and leans toward a different elderly motorbike-taxi driver in a faded brown shirt and old helmet, sitting on his bike in the shade. The old driver points into the alley with two fingers, showing the turns. Long shadows, hanging laundry, a small altar on a wall. Helpful, ordinary mood. Both figures centered with generous space around. No text, no letters, no logo, no watermark. Square 1:1.
```

### c8-san-thuong

```text
Vietnamese oil painting, thick visible brush strokes, deep blue-green night with hazy orange glow and golden city lights, clear shapes, not muddy. Night on the same rooftop of an old Saigon boarding house, laundry lines and a stainless steel water tank. The same man, still in the plain dark windbreaker with one thin reflective strip, seen from behind and a little to the side, sits on a low plastic stool, the phone on his knee glowing on his tired hands, his helmet on the floor beside him. He looks out at countless lit windows. The sky is a hazy orange-grey glow, completely empty, not a single star, no moon. Quiet, counting mood. Subject centered in the lower half with open sky above for text. No text, no letters, no numbers, no logo, no watermark. Square 1:1.
```
