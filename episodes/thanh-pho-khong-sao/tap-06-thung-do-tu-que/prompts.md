# Prompt Google Flow: Thành Phố Không Sao, tập 6 "Thùng đồ từ quê", nhánh B (giấu tiếp)

Phong cách: **sơn dầu nắng gió sông nước**, giống các tập trước. Khổ vuông 1:1, Nano Banana 2.1.

Tổng cộng 8 ảnh cảnh. Có một nhân vật mới: **bà Năm**, hàng xóm của má. Bà chỉ xuất hiện ở cảnh 1 và cảnh 3, đứng xa, không cần làm ảnh nhân vật riêng.

Khác các tập trước: cảnh 1 đến 6 là **ban ngày, sáng thứ bảy**. Hiên nhà má có nắng sớm, phòng trọ có nắng xiên qua cửa sổ. Chỉ cảnh 7 và 8 là ban đêm.

## Thứ tự tạo

1. **b3 trước.** Đây là ảnh má ngồi ngoài hiên ban ngày, quay ra nói với bà Năm. b1, b4 và b5 đính kèm b3 để giữ đúng hiên nhà, áo, đống dừa và ánh nắng.
2. **b2 tiếp theo.** Đây là ảnh phòng trọ buổi sáng. b6 đính kèm b2.
3. Các cảnh còn lại theo bảng.

## Tham chiếu dùng chung

- `minh`: `nhan-vat/minh.jpg`
- `ma`: `nhan-vat/ma.jpg`
- Hiên nhà má và đống dừa: `tap-05-cuoc-goi-chin-gio-toi/images/c3-dong-dua.jpg`. Ảnh này chụp ban đêm, chỉ lấy bố cục hiên và đống dừa, prompt đã đổi sang ban ngày.
- Phòng trọ: `tap-05-cuoc-goi-chin-gio-toi/images/c6-tinh-tien.jpg`
- Sân thượng: `tap-05-cuoc-goi-chin-gio-toi/images/c9-san-thuong.jpg`

**Trang phục:**
- Minh, cả tập: áo thun xám cũ, quần đùi tối màu.
- Má, cả tập: áo bà ba hoa đã phai như ảnh nhân vật, tóc búi.
- Bà Năm: khoảng 65 tuổi, gầy, áo bà ba nâu sẫm, tay cầm nón lá.

**Kiểm tra từng ảnh:**
- Không chữ, không logo trên điện thoại, màn hình gọi, áo khoác hay giấy tờ.
- Tay và điện thoại không méo.
- Không có balo giữa phòng.
- Chủ thể gần giữa khung, chừa trống phía trên cho chữ hook ở cảnh 1.
- Má trông 58 tuổi, cùng một người với tập 5.

Phần ghép lúc dựng, không vẽ vào ảnh: khung gọi, chữ hook, câu của má và thẻ ngày.

## Ảnh theo lời đọc

| Tên ảnh | Tham chiếu | Lời đọc |
|---|---|---|
| `b1-ma-khoe` | `minh`, `ma`, `b3-ma-quay-lung` | Gọi về định nói thật, thì nghe má đang khoe với hàng xóm (...) |
| `b2-goi-lai` | `minh`, `c6-tinh-tien` | Sáng thứ bảy gọi lại như đã hứa (...) |
| `b3-ma-quay-lung` | `ma`, `c3-dong-dua` | Má bắt máy mà còn quay ra sân nói với bà Năm (...) |
| `b4-ma-hoi` | `ma`, `b3-ma-quay-lung` | Rồi má quay lại hỏi con lo được hông (...) |
| `b5-ma-cuoi` | `ma`, `b3-ma-quay-lung` | Nghe vậy má cười, ho khẽ một tiếng (...) |
| `b6-tinh-tien` | `minh`, `b2-goi-lai` | Cúp máy rồi ngồi tính, cuối tháng phải có mười hai triệu (...) |
| `c7-tai-ung-dung` | `minh`, `c6-tinh-tien` | Tối đó tải ứng dụng giao hàng (...) |
| `c8-san-thuong` | `minh`, `c9-san-thuong` | Cả xóm của má giờ tin mình còn làm công ty lớn (...) |

## Prompt

### b1-ma-khoe (khung mở đầu, phải bắt mắt)

```text
Vietnamese oil painting, thick visible brush strokes, bright warm morning light. Over-the-shoulder view from behind the same man in a faded grey t-shirt, sitting by a window in a tiny rented room, a strong golden sunbeam falling across his shoulder and the phone he holds up. On the glowing phone screen a video call shows the same Mekong Delta woman, 58, in a faded floral blouse, on a sunny wooden porch, turned away from the camera in profile, smiling proudly and gesturing with one hand toward an older thin neighbor woman in a dark brown blouse standing in the yard holding a conical hat. The man's free hand is frozen halfway to his mouth. Phone screen centered with open space above. Natural hand anatomy. No text, no letters, no logo, no interface buttons, no watermark. Square 1:1.
```

### b2-goi-lai

```text
Vietnamese oil painting, thick visible brush strokes, soft morning light slanting through a small window into a tiny rented room in Saigon. The same man in a faded grey t-shirt and dark shorts sits on the edge of a low iron bed, holding his phone in both hands in front of his chest, not yet calling, lips slightly parted as if rehearsing words, eyes red from a short night. Dust drifting in the sunbeam. Nervous quiet mood. Subject centered with generous space around. No backpack, no bag in the room. No text, no letters, no logo, no watermark. Square 1:1.
```

### b3-ma-quay-lung

```text
Vietnamese oil painting, thick visible brush strokes, earthy Mekong Delta palette of river-silt brown and coconut green in bright early morning sun. Seen as if through the front camera of a phone held loosely in a hand: the same Mekong Delta woman, 58, in a faded floral ao ba ba blouse, sitting on a wooden porch of a simple countryside house, her head and shoulders turned away toward the yard, talking with a proud smile. In the sunny yard an older thin neighbor woman, about 65, in a dark brown ao ba ba, holds a conical hat and listens. A heap of green coconuts piled against the porch wall. The frame is slightly tilted, the mother a little off-center. Warm proud mood. No phone visible, no text, no letters, no logo, no watermark. Square 1:1.
```

### b4-ma-hoi

```text
Vietnamese oil painting, thick visible brush strokes, earthy Mekong Delta palette in bright morning sun. The same porch and the same woman in the faded floral blouse, seen from the chest up as if through the front camera of her phone, turned back to face the camera, leaning a little closer, eyebrows raised in a hopeful question, a small trusting smile. The yard and the heap of green coconuts soft in the background. Tender hopeful mood. Face centered. No phone visible, no text, no letters, no logo, no watermark. Square 1:1.
```

### b5-ma-cuoi

```text
Vietnamese oil painting, thick visible brush strokes, earthy Mekong Delta palette in bright morning sun. The same porch and the same woman in the faded floral blouse, seen as if through the front camera of her phone, her eyes still smiling with relief while she coughs lightly into the back of her hand, shoulders a little hunched. The heap of green coconuts behind her. Relieved but fragile mood. Face near center with generous space around. No phone visible, no text, no letters, no logo, no watermark. Square 1:1.
```

### b6-tinh-tien

```text
Vietnamese oil painting, thick visible brush strokes, late morning light in a tiny rented room in Saigon, the sunbeam now harsh and flat. The same man in a faded grey t-shirt and dark shorts sits on the edge of a low iron bed, the phone lying face down beside him, an old open notebook on his knee covered in small handwritten sums, one large sum circled hard twice. He presses the pen against his lips, staring at the page. Heavy stuck mood. Subject centered with generous space around. No backpack, no bag in the room. No readable text, no numbers, no letters, no logo, no watermark. Square 1:1.
```

### c7-tai-ung-dung

```text
Vietnamese oil painting, thick visible brush strokes, deep blue-green night shadows with one warm bare bulb. Close view in a tiny rented room at night: the same man's hands in a faded grey t-shirt, holding a phone above a small plastic driver's license card and a folded motorbike registration paper laid on the mattress, taking a photo of them, the phone screen glowing on his fingers. His face half visible at the top edge, tired and set. Quiet decided mood. Hands and documents centered with generous space around. Natural hand anatomy. No readable text, no letters, no numbers, no logo, no watermark. Square 1:1.
```

### c8-san-thuong

```text
Vietnamese oil painting, thick visible brush strokes, deep blue-green night with hazy orange glow and golden city lights, clear shapes, not muddy. Night on the same rooftop of an old Saigon boarding house, laundry lines and a stainless steel water tank. The same man in a faded grey t-shirt and dark shorts, seen from behind and small in the frame, sits on a low plastic stool; a new plain dark windbreaker jacket with a thin reflective strip lies folded on his knees, his hand resting on it. He looks out at countless lit windows across the city. The sky is a hazy orange-grey glow, completely empty, not a single star, no moon. Quiet vast mood. Subject centered in the lower half with open sky above for text. No text, no letters, no logo on the jacket, no watermark. Square 1:1.
```
