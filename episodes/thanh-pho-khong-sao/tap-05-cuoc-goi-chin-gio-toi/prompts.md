# Prompt Google Flow: Thành Phố Không Sao, tập 5 "Cuộc gọi lúc chín giờ tối"

Phong cách: **sơn dầu nắng gió sông nước**, giống các tập trước. Khổ vuông 1:1, Nano Banana 2.1.

Tổng cộng 9 ảnh cảnh. Không có nhân vật mới: má dùng ảnh nhân vật `ma` có từ tập 1.

## Thứ tự tạo

1. **c3 trước.** Đây là ảnh má ngồi ngoài hiên ban đêm với đống dừa. c4 và c7 đính kèm c3 để giữ đúng hiên nhà, áo và ánh đèn.
2. **c2 tiếp theo.** c5, c6 và c8 đính kèm c2 để giữ đúng góc phòng ban đêm có bóng đèn đã bật.
3. Các cảnh còn lại theo bảng.

## Tham chiếu dùng chung

- `minh`: `nhan-vat/minh.jpg`
- `ma`: `nhan-vat/ma.jpg`
- Má trong khung gọi tập 1: `tap-01-chin-trieu/images/c7a-ma.jpg`
- Phòng trọ: `tap-02-muoi-hai-met-vuong/images/c5-mep-giuong.jpg` (không dùng `c3-gam-giuong` vì có balo)
- Cuốn sổ công ty: `tap-02-muoi-hai-met-vuong/images/c4-cuon-so.jpg`
- Sân thượng: `tap-02-muoi-hai-met-vuong/images/c9-san-thuong.jpg`

**Trang phục:**
- Minh, cả tập: áo thun xám cũ, quần đùi tối màu. Ở nhà cả ngày, không có sơ mi.
- Má, cả tập: áo bà ba hoa đã phai như ảnh nhân vật, tóc búi, ngồi ngoài hiên ban đêm dưới một bóng đèn vàng.

**Kiểm tra từng ảnh:** không chữ, không logo trên điện thoại hay màn hình gọi. Tay và điện thoại không méo. Không balo giữa phòng. Chủ thể gần giữa khung. Má trông 58 tuổi, cùng một người với tập 1. Khung gọi, chữ "Má đang gọi video", câu của má và thời lượng 4:12 sẽ thêm lúc dựng.

## Ảnh theo lời đọc

| Tên ảnh | Tham chiếu | Lời đọc |
|---|---|---|
| `c1-ma-noi-vay` | `minh`, `ma`, `c3-dong-dua`, `c5-mep-giuong` | Má nói tính đi vay để gửi tiền học cho đứa em (...) |
| `c2-dien-thoai-reo` | `minh`, `c5-mep-giuong` | Cả ngày điện thoại chỉ có tin nhắn khuyến mãi. Chín giờ tối máy reo (...) |
| `c3-dong-dua` | `ma`, `c7a-ma` | Bữa nay má không hỏi con ăn cơm chưa, vô thẳng chuyện dừa luôn (...) |
| `c4-ma-tinh-vay` | `ma`, `c3-dong-dua` | Rồi má nói học phí của em tháng này má lo, con khỏi gửi (...) |
| `c5-siet-dien-thoai` | `minh`, `c2-dien-thoai-reo` | Nghe tới chữ vay là tay siết cái điện thoại (...) |
| `c6-tinh-tien` | `minh`, `c2-dien-thoai-reo`, `c4-cuon-so` | Trong tài khoản còn chưa tới bốn triệu (...) |
| `c7-ma-ho` | `ma`, `c3-dong-dua` | Mở miệng định nói má ơi con nghỉ làm rồi, thì má ho một tràng (...) |
| `c8-de-mai` | `minh`, `c2-dien-thoai-reo` | Chỉ nói được là má khoan vay, để con tính rồi mai gọi lại (...) |
| `c9-san-thuong` | `minh`, `c9-san-thuong` tập 2 | Cúp máy rồi lên sân thượng ngồi (...) |

## Prompt

### c1-ma-noi-vay

```text
Vietnamese oil painting, thick visible brush strokes, deep blue-green shadows of a tiny rented room at night with one warm bare bulb. Over-the-shoulder view from behind the same man in a faded grey t-shirt, sitting on the edge of a low iron bed, holding a phone up in front of him. On the phone screen a video call shows the same Mekong Delta woman, 58, in a faded floral blouse, sitting on a dim porch under a yellow bulb, talking with a tired face. The small warm glow of the screen against the dark room. Phone and screen centered with generous space around. Natural hand anatomy. No text, no letters, no logo, no interface buttons, no watermark. Square 1:1.
```

### c2-dien-thoai-reo

```text
Vietnamese oil painting, thick visible brush strokes, deep blue-green night shadows breaking into one fresh pool of warm light. Tiny rented room in Saigon at night. The same man in a faded grey t-shirt and dark shorts has just sat up on a low iron bed; one hand pulls the string of a bare light bulb that has just come on, the other hand smooths down his messy hair. A phone lies face up on the mattress beside him, its screen glowing. Small hurried mood. Subject centered with generous space around. No backpack, no bag in the room. No text, no letters, no logo, no watermark. Square 1:1.
```

### c3-dong-dua

```text
Vietnamese oil painting, thick visible brush strokes, earthy Mekong Delta palette of river-silt brown and coconut green at night under one yellow porch bulb. The same Mekong Delta woman, 58, in a faded floral ao ba ba blouse, seen from the chest up as if through the front camera of her phone, sitting on a wooden porch of a simple countryside house. Behind her a large heap of green coconuts piled high against the wall, a few fallen on the floor. Her face is tired, brows slightly knitted as she talks. Worried quiet mood. Face centered with the coconut heap clearly visible behind. No phone visible, no text, no letters, no logo, no watermark. Square 1:1.
```

### c4-ma-tinh-vay

```text
Vietnamese oil painting, thick visible brush strokes, earthy Mekong Delta palette of river-silt brown and coconut green at night under one yellow porch bulb. The same porch and the same woman in the faded floral blouse, seen from the chest up as if through the front camera of her phone, leaning a little closer to the camera and looking straight at the viewer with a gentle firm expression, one hand raised slightly as if telling her son not to worry. The heap of green coconuts soft in the background. Tender stubborn mood. Face centered. No phone visible, no text, no letters, no logo, no watermark. Square 1:1.
```

### c5-siet-dien-thoai

```text
Vietnamese oil painting, thick visible brush strokes, deep blue-green shadows with the warm glow of a phone screen. Close view of the same man in a faded grey t-shirt in his rented room at night, both hands gripping a phone tightly, knuckles pale, his tense face half lit by the screen from below, jaw clenched, eyes fixed on the screen. The bare bulb soft and out of focus behind him. Tight held-breath mood. Hands and face centered with generous space around. Natural hand anatomy. Screen faces him, not visible to the viewer. No text, no letters, no logo, no watermark. Square 1:1.
```

### c6-tinh-tien

```text
Vietnamese oil painting, thick visible brush strokes, deep blue-green shadows with one warm bare bulb. Tiny rented room in Saigon at night. The same man in a faded grey t-shirt and dark shorts sits on the edge of a low iron bed, the phone still on a call pressed against his chest, staring at an old open notebook on his knee covered in small handwritten sums crossed out. A cheap pen in his other hand hovers, not writing. Heavy stuck mood. Subject centered with generous space around. No backpack, no bag in the room. No readable text, no numbers, no letters, no logo, no watermark. Square 1:1.
```

### c7-ma-ho

```text
Vietnamese oil painting, thick visible brush strokes, earthy Mekong Delta palette of river-silt brown and coconut green at night under one yellow porch bulb. The same porch and the same woman in the faded floral blouse, seen as if through the front camera of her phone, turning her face away to the side and coughing into her hand, shoulders hunched, the phone tilted so she is slightly off-center. The heap of green coconuts behind her. Fragile hidden mood. Subject near center with generous space around. No phone visible, no text, no letters, no logo, no watermark. Square 1:1.
```

### c8-de-mai

```text
Vietnamese oil painting, thick visible brush strokes, deep blue-green shadows with one warm bare bulb. The same man in a faded grey t-shirt seen from the chest up, as if through the front camera of his phone during a video call, in his small rented room at night, looking at the viewer and forcing a small reassuring smile while his eyes stay red and tired, one hand lifted in a small "it's nothing" wave. Pale concrete wall and the bare bulb behind him. Quietly sad mood. Face centered. No phone visible, no text, no letters, no logo, no watermark. Square 1:1.
```

### c9-san-thuong

```text
Vietnamese oil painting, thick visible brush strokes, deep blue-green night with hazy orange glow and golden city lights, clear shapes, not muddy. Night on the same rooftop of an old Saigon boarding house, laundry lines and a stainless steel water tank. The same man in a faded grey t-shirt and dark shorts, seen from behind and small in the frame, sits on a low plastic stool with a phone resting face up on his knee, its screen still glowing faintly, looking out at countless lit windows across the city. The sky is a hazy orange-grey glow, completely empty, not a single star, no moon. Quiet vast mood. Subject centered in the lower half with open sky above for text. No text, no letters, no logo, no watermark. Square 1:1.
```
