# Prompt Google Flow: Thành Phố Không Sao, tập 4 "Người phỏng vấn trẻ hơn mình"

Phong cách: **sơn dầu nắng gió sông nước**, giống các tập trước. Khổ vuông 1:1, Nano Banana 2.1.

Tổng cộng 9 ảnh cảnh. Không có ảnh nhân vật mới: cậu phỏng vấn chỉ hiện trong khung gọi, lấy `c4-nguoi-phong-van` làm tham chiếu cho c1 và c6.

## Thứ tự tạo

1. **c4 trước**, vì c1 và c6 cần đính kèm c4 để giữ đúng mặt cậu phỏng vấn.
2. Các cảnh còn lại theo bảng.

## Tham chiếu dùng chung

- `minh`: `nhan-vat/minh.jpg`
- Phòng trọ: `tap-02-muoi-hai-met-vuong/images/c5-mep-giuong.jpg` (không dùng `c3-gam-giuong` vì có balo)
- Hành lang: `tap-02-muoi-hai-met-vuong/images/c1-go-cua.jpg`
- Cô Sáu: `tap-02-muoi-hai-met-vuong/images/c2-co-sau.jpg`
- Sân thượng: `tap-02-muoi-hai-met-vuong/images/c9-san-thuong.jpg`

**Trang phục Minh:**
- Cảnh 2, 7, 8, 9: áo thun xám cũ, quần đùi tối màu.
- Cảnh 1, 3, 5, 6: áo sơ mi xanh nhạt dài tay cài đủ nút, quần đùi tối màu.

**Kiểm tra từng ảnh:** không chữ, không logo trên laptop, điện thoại hay màn hình gọi. Tay không méo. Không balo giữa phòng. Chủ thể gần giữa khung. Chữ trong khung gọi, thẻ ngày và thư từ chối sẽ thêm lúc dựng.

## Ảnh theo lời đọc

| Tên ảnh | Tham chiếu | Lời đọc |
|---|---|---|
| `c1-cau-hoi` | `minh`, `c4-nguoi-phong-van`, `c5-mep-giuong` | Ba mươi hai tuổi rồi, sao anh chưa lên quản lý? (...) |
| `c2-dong-tien-phong` | `minh`, `c2-co-sau`, `c1-go-cua` | Bảy giờ sáng rút ba triệu rưỡi đem qua đóng tiền phòng cho cô Sáu (...) |
| `c3-ao-so-mi` | `minh`, `c5-mep-giuong` | Lấy cái áo sơ mi hồi đi làm ra ủi lại (...) |
| `c4-nguoi-phong-van` | `minh` | Tới chín giờ thì một cậu cỡ hai mươi sáu vô cuộc gọi (...) |
| `c5-tra-loi` | `minh`, `c5-mep-giuong` | Hỏi tới kinh nghiệm thì nói trơn tru (...) |
| `c6-dung-hinh` | `c4-nguoi-phong-van`, `minh` | Tới lúc cậu hỏi câu ba mươi hai tuổi xong thì mạng giật (...) |
| `c7-treo-ao` | `minh`, `c5-mep-giuong` | Gập máy xong thì cởi áo sơ mi treo lên móc (...) |
| `c8-thu-tu-choi` | `minh`, `c5-mep-giuong` | Hẹn trong tuần mà bốn giờ chiều đã có thư (...) |
| `c9-san-thuong` | `minh`, `c9-san-thuong` tập 2 | Tối lên sân thượng ngồi (...) |

## Prompt

### c1-cau-hoi

```text
Vietnamese oil painting, thick visible brush strokes, earthy palette of river-silt brown and muted green with soft morning light from a barred window. Tiny rented room in Saigon. Over-the-shoulder view from behind the same man in a buttoned light blue long-sleeve shirt, sitting at a low folding table in front of an old laptop. On the laptop screen a video call shows the same young man in his mid twenties, neat haircut, crisp shirt, leaning toward his camera as he asks a question, a bright modern office behind him. The contrast between the shabby room and the bright office on screen is clear. Laptop and screen centered with generous space around. No text, no letters, no logo, no watermark, no interface buttons. Square 1:1.
```

### c2-dong-tien-phong

```text
Vietnamese oil painting, thick visible brush strokes, earthy palette of river-silt brown and muted green with pale early-morning light. The same narrow open-air corridor of an old Saigon boarding house, potted plants along the railing. The same man in a faded grey t-shirt and dark shorts stands at the door of the same plump middle-aged landlady in a floral home outfit, handing her a small folded stack of Vietnamese banknotes with both hands. She takes it, looking at him over the money. Quiet ordinary morning mood. Both centered with generous space around. No readable text, no numbers on the money, no logo, no watermark. Square 1:1.
```

### c3-ao-so-mi

```text
Vietnamese oil painting, thick visible brush strokes, earthy palette of river-silt brown and muted green with soft morning light from a barred window. Tiny rented room in Saigon. Full view of the same man sitting on a plastic stool at a low folding table pushed right against the window, an old laptop open in front of him. Above the table he wears a freshly ironed light blue long-sleeve shirt buttoned to the collar; below the table he still wears dark shorts and bare feet, plainly visible. A small iron rests on the bed behind him. He sits upright, waiting. Gentle wry mood. Subject centered with generous space around. No backpack, no bag in the room. No text, no letters, no logo on the laptop, no watermark. Square 1:1.
```

### c4-nguoi-phong-van

```text
Vietnamese oil painting, thick visible brush strokes, warm palette with cool screen glow. Close view of an old laptop screen in a dim rented room. The screen shows a video call: a young Vietnamese man in his mid twenties, neat modern haircut, crisp white shirt with an open collar, confident easy smile, sitting in a bright glass-walled office with a plant behind him. In a small square in the corner of the screen, the same tired older man in a light blue buttoned shirt appears small. Screen centered with generous space around. No text, no letters, no names, no logo, no interface buttons, no watermark. Square 1:1.
```

### c5-tra-loi

```text
Vietnamese oil painting, thick visible brush strokes, earthy palette of river-silt brown and muted green with soft morning light from a barred window. Tiny rented room in Saigon. View from the laptop's point of view: the same man in a buttoned light blue long-sleeve shirt sits at a low folding table facing the camera, talking with confidence, one hand open in a small explaining gesture, slight easy smile. Only his upper body shows above the table edge. Subject centered with generous space around. No text, no letters, no logo, no watermark. Square 1:1.
```

### c6-dung-hinh

```text
Vietnamese oil painting, thick visible brush strokes, warm palette with cool screen glow. Close view of an old laptop screen on a low folding table: the video call image of the same young man is frozen mid-word, mouth slightly open, his face broken into blurry blocky smears as if the connection stalled. In the lower foreground the edge of a light blue shirt sleeve and the same man's hand rest frozen on the table beside the laptop. Uneasy suspended mood. Screen centered with generous space around. No text, no letters, no logo, no interface buttons, no watermark. Square 1:1.
```

### c7-treo-ao

```text
Vietnamese oil painting, thick visible brush strokes, earthy palette of river-silt brown and muted green with flat midday light from a barred window. Tiny rented room in Saigon. The same man, now in a faded grey t-shirt and dark shorts, stands by the wall carefully hanging the light blue long-sleeve shirt on a plastic hanger on a nail, smoothing the collar with one hand. The laptop on the folding table behind him is closed. Quiet careful mood. Subject centered with generous space around. No backpack, no bag in the room. No text, no letters, no logo, no watermark. Square 1:1.
```

### c8-thu-tu-choi

```text
Vietnamese oil painting, thick visible brush strokes, deep blue-green shadows with one band of late-afternoon golden light from a barred window. Tiny rented room in Saigon. The same man in a faded grey t-shirt and dark shorts sits on the edge of a low iron bed, elbows on his knees, staring at the floor. Beside him on the mattress a phone lies face down. On the wall behind him the light blue shirt hangs on a hanger. Still heavy mood. Subject centered with generous space around. No backpack, no bag in the room. No text, no letters, no logo, no watermark. Square 1:1.
```

### c9-san-thuong

```text
Vietnamese oil painting, thick visible brush strokes, deep blue-green night with hazy orange glow and golden city lights, clear shapes, not muddy. Night on the same rooftop of an old Saigon boarding house, laundry lines and a stainless steel water tank. The same man in a faded grey t-shirt and dark shorts, seen from behind and small in the frame, sits on a low plastic stool with his forearms on his knees, empty-handed, looking out at countless lit office windows across the city. The sky is a hazy orange-grey glow, completely empty, not a single star, no moon. Quiet vast mood. Subject centered in the lower half with open sky above for text. No text, no letters, no logo, no watermark. Square 1:1.
```
