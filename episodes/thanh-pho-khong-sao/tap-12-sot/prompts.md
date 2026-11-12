# Prompt Google Flow: Thành Phố Không Sao, tập 12 "Sốt"

Phong cách: **sơn dầu nắng gió sông nước**, giống các tập trước. Khổ vuông 1:1, Nano Banana 2.1, **mỗi lần tạo x1**.

Tổng cộng 8 ảnh cảnh, không có nhân vật mới. Lời kể dùng được cho cả hai nhánh tập 11, ảnh cũng không có gì riêng của nhánh nào.

Thời gian: một ngày sau trận mưa. Sáng (c2), trưa đến chiều trong phòng (c1, c3, c4), gần tối ở hành lang (c5, c6), tối trong phòng (c7, c8).

## Thứ tự tạo

1. **`c1-so-tran`** trước, đính kèm `minh` và ảnh phòng trọ (`tap-01-chin-trieu/images/c6-phong-tro.jpg` hoặc một ảnh phòng của tập 2). c3, c4, c7, c8 đính kèm c1 để giữ cùng căn phòng, cùng áo.
2. **`c5-tieng-dep`**, đính kèm `minh` và ảnh hành lang `c1-go-cua` của tập 2. c6 đính kèm c5 và `co-sau`.
3. Các cảnh còn lại.

## Tham chiếu dùng chung

- `minh`: ảnh nhân vật Minh (Flow project "Tháng 11 04 - 14:41")
- `co-sau`: ảnh nhân vật cô Sáu (tạo ở tập 2, project của tập 2)
- Phòng trọ: tường xi măng nhạt, cửa sổ song sắt nhỏ, bóng đèn trần, chiếu trên nền gạch hoặc giường thấp (ảnh `c6-phong-tro` tập 1, các ảnh phòng tập 2)
- Hành lang hở của dãy trọ cũ, lan can sắt, chậu cây, cầu thang: ảnh `c1-go-cua` tập 2
- Áo khoác gió tối màu có một sọc phản quang mảnh: ảnh tập 11

**Trang phục:** Minh mặc áo thun xám cũ, quần dài tối màu. Ở c2 mặc thêm áo khoác gió tối màu có sọc phản quang mảnh, còn ẩm. Tóc rối, mặt đỏ vì sốt, môi khô. Cô Sáu mặc đồ bộ bông cũ, chùm chìa khóa ở hông, dép nhựa.

**Kiểm tra từng ảnh:** không chữ, không logo trên áo, balo, vỉ thuốc, điện thoại; tay, muỗng, vỉ thuốc không méo; Minh trông 32 tuổi, cùng người với các tập trước; màn hình điện thoại sáng nhưng trống. Chủ thể gần giữa, chừa trống phía trên cho chữ hook (c1) và chữ kết (c8). Cảnh khóc (c8) chỉ rưng rưng, không há miệng khóc to.

Phần ghép lúc dựng, không vẽ vào ảnh: chữ hook, thẻ series, thẻ ngày, chữ kết.

## Ảnh theo lời đọc

| Tên ảnh | Tham chiếu | Lời đọc |
|---|---|---|
| `c1-so-tran` | `minh`, phòng trọ | Tự áp tay lên trán (...) không biết mình sốt cỡ nào |
| `c2-cau-thang` | `minh`, hành lang tập 2, `c1-so-tran` | Hồi sáng mặc cái áo khoác còn ẩm (...) mới leo lên lại |
| `c3-hop-thuoc` | `minh`, `c1-so-tran` | Lục cái balo dưới gầm giường (...) để dành hai viên |
| `c4-bao-don` | `minh`, `c1-so-tran` | Nằm nghe điện thoại báo đơn tới (...) mất chừng trăm ngàn |
| `c5-tieng-dep` | `minh`, hành lang tập 2 | Gần tối có tiếng dép lẹp xẹp (...) đậy cái dĩa nhựa |
| `c6-co-sau` | `co-sau`, `c5-tieng-dep` | Ngó qua lan can (...) ngồi bệt ở cầu thang |
| `c7-to-chao` | `c1-so-tran` | Cháo trắng có hành phi (...) mỗi lần mình ốm |
| `c8-khoc` | `minh`, `c1-so-tran` | Ăn tới muỗng thứ ba (...) cháo nguội luôn |

## Prompt

### c1-so-tran (khung mở đầu, phải bắt mắt)

```text
Vietnamese oil painting, thick visible brush strokes, dim grey-gold daylight through a small barred window, clear shapes, not muddy. The same tiny 12-square-meter boarding house room as the reference, pale cement walls, a bare ceiling bulb switched off. The man from the Minh character reference, 32, in an old grey t-shirt, lies on a thin mat on the floor under a crumpled blanket, flushed feverish face, dry lips, messy hair, pressing the back of his own hand against his forehead, eyes half closed, confused and weak. Close, intimate view from slightly above. Lonely, feverish mood. Subject centered in the lower half with open space above for text. Natural hand anatomy. No text, no letters, no logo, no watermark. Square 1:1.
```

### c2-cau-thang

```text
Vietnamese oil painting, thick visible brush strokes, pale wet morning light after rain, puddles on the concrete. The narrow open-air staircase of the same old Saigon boarding house as the reference, rusty iron railing, potted plants. The same man, plain dark windbreaker with one thin reflective strip, still damp and darkened, over a grey t-shirt, sits slumped on a step halfway down the stairs, one hand gripping the railing, the other pressed to his temple, eyes squeezed shut, dizzy. A plain helmet rests on the step beside him. Weak, stubborn mood. Subject centered with generous space around. Natural hand anatomy. No text, no letters, no logo, no watermark. Square 1:1.
```

### c3-hop-thuoc

```text
Vietnamese oil painting, thick visible brush strokes, dim afternoon light in the same tiny boarding house room as the reference. The same feverish man in the grey t-shirt kneels on the floor beside his low bed, having pulled a dark plain office backpack with no logo out from under the bed, its front pocket open. In his palm lies a small torn foil blister strip with only three white pills left. A plastic bottle of water on the floor. Tired, careful mood. Hands and pills clearly visible near the center. Natural hand anatomy. No text, no letters, no logo, no brand on the pills, no watermark. Square 1:1.
```

### c4-bao-don

```text
Vietnamese oil painting, thick visible brush strokes, hot hazy afternoon light falling in slanted bars through the small barred window of the same tiny room. The same feverish man lies curled on his side on the mat under the blanket, facing the camera, eyes open and heavy. On the floor near his face his phone lies screen up, the blank screen glowing again and again, he watches it without moving. The damp windbreaker hangs on a nail on the wall behind him. Helpless, aching mood. Face and phone centered. Natural hand anatomy. No text, no letters, no logo, no watermark. Square 1:1.
```

### c5-tieng-dep

```text
Vietnamese oil painting, thick visible brush strokes, dusk with deep blue-green shadows and the warm orange glow of a single corridor bulb. The narrow open-air corridor of the same old boarding house as the reference, his room door half open. On the floor just outside the door sits a steaming bowl of rice porridge covered by an upside-down plain plastic plate, wisps of steam escaping. The same feverish man in the grey t-shirt stands in the doorway holding the door frame, looking down at the bowl, surprised. The corridor is empty. Quiet, tender mood. Bowl and man centered with generous space around. Natural hand anatomy. No text, no letters, no logo, no watermark. Square 1:1.
```

### c6-co-sau

```text
Vietnamese oil painting, thick visible brush strokes, dusk with deep blue-green shadows and warm lamp light from below. High view looking down over a rusty iron railing into the small ground-floor courtyard of the same old boarding house, a few parked motorbikes. The plump older landlady from the Co Sau character reference, about 62, short permed hair, faded floral home pajamas, ring of keys at her waist, plastic sandals, is walking back into her lit doorway below, seen from behind, not turning around. The railing and the edge of the man's hand on it in the near foreground. Quiet, unspoken kindness. Landlady centered with generous space around. No text, no letters, no logo, no license plate numbers, no watermark. Square 1:1.
```

### c7-to-chao

```text
Vietnamese oil painting, thick visible brush strokes, warm dim light of a single ceiling bulb. Close view of a simple ceramic bowl of plain white rice porridge on the floor of the tiny room, topped with golden fried shallots, ground black pepper and half a salted duck egg with a bright orange yolk, a metal spoon resting in it, steam rising. Beside it the upturned plastic plate that covered it. Homely, nostalgic mood. Bowl centered with generous space around. No text, no letters, no logo, no watermark. Square 1:1.
```

### c8-khoc (khung kết, giữ hình 2 giây)

```text
Vietnamese oil painting, thick visible brush strokes, deep blue-green night with hazy orange glow, clear shapes, not muddy. The same tiny boarding house room as the reference, lit only by the single ceiling bulb. The same man in the grey t-shirt, a blanket around his shoulders, sits on the floor with his back against the bed, the bowl of porridge in his lap, the spoon still in his hand, head bowed, eyes wet, silent tears on his cheeks, not sobbing, face turned slightly away. Behind him the small barred window shows a hazy orange-grey city sky, empty, not a single star. Quiet, broken-open mood. Man in the lower half with open space above for text. Natural hand anatomy. No text, no letters, no logo, no watermark. Square 1:1.
```
