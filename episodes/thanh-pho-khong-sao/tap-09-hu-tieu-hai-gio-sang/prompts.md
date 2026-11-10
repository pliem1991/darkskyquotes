# Prompt Google Flow: Thành Phố Không Sao, tập 9 "Hủ tiếu lúc hai giờ sáng"

Phong cách: **sơn dầu nắng gió sông nước**, giống các tập trước. Khổ vuông 1:1, Nano Banana 2.1, **mỗi lần tạo x1**.

Tổng cộng 9 ảnh cảnh, không có nhân vật mới cần ảnh riêng. Ông bán hủ tiếu gõ là người phụ, chỉ đứng mờ phía sau xe.

Thời gian: cả tập là đêm khuya. Cảnh 1, 3 đến 8 ở hẻm, ánh sáng chính là ngọn đèn vàng treo trên xe hủ tiếu và đèn đường lẻ loi, phần còn lại xanh đen. Cảnh 2 trong phòng trọ, chỉ có ánh điện thoại. Cảnh 9 trên sân thượng.

## Thứ tự tạo

1. **c4 trước.** Đây là ảnh gốc của xe hủ tiếu, hai chiếc ghế nhựa thấp, chú Tư và Minh. c1, c5, c6, c7 đính kèm c4 để giữ cùng xe, cùng ghế, cùng áo.
2. **c1 tiếp theo** (khung mở đầu, phải bắt mắt), đính kèm c4.
3. **c8** đính kèm c4 để giữ áo chú Tư và xe máy của chú.
4. Các cảnh còn lại theo bảng.

## Tham chiếu dùng chung

- `minh`: `nhan-vat/minh.jpg` (trên Flow ở project "Tháng 11 04 - 14:41")
- `chu-tu`: `nhan-vat/chu-tu.jpg` (trên Flow tìm "chu-tu" hoặc ảnh chú Tư ở project "DSQ - Thành Phố Không Sao 2", ví dụ `c6-chu-tu.jpg`)
- Phòng trọ: `tap-05-cuoc-goi-chin-gio-toi/images/c6-tinh-tien.jpg` (trên Flow ở các project tập 5, ví dụ ảnh "Man sitting on bed")
- Sân thượng: ảnh sân thượng tập 7 (project "DSQ - Thành Phố Không Sao 2", "Man sitting on rooftop...")
- Chậu trầu bà: `tap-08-don-hang-ve-cong-ty-cu/images/c8-san-thuong.jpg` (project "DSQ - TPKS tập 8", ảnh sân thượng có chậu)

**Trang phục và đồ vật:**
- Minh, cả tập: đồ ở nhà như tập 2 đến 6: áo thun xám cũ, quần đùi tối màu, dép tổ ong. Không áo khoác giao hàng, không nón.
- Chú Tư: như ảnh nhân vật: áo sơ mi xanh nhạt ngắn tay, kính lão cài túi áo, quần kaki, dép quai. Nón bảo hiểm xanh dương cũ treo trên xe hoặc cầm tay.
- Xe máy của chú Tư: xe số cũ màu xanh bạc màu, như các tập trước có chú.
- Xe hủ tiếu gõ: xe đẩy gỗ nhỏ có tủ kính trống (không chữ), nồi nước lèo bốc hơi, một bóng đèn vàng treo, hai ghế nhựa đỏ thấp, tô sành trắng.
- Chậu trầu bà (cảnh 9): chậu nhựa trắng nhỏ như tập 8, trên lan can.

**Kiểm tra từng ảnh:**
- Không chữ, không logo trên xe hủ tiếu, áo, điện thoại, bảng số nhà, ổ khóa.
- Tay, tô, muỗng, đũa và điện thoại không méo.
- Đêm phải rõ hình, không bệt màu. Chủ thể gần giữa, chừa trống phía trên cho chữ hook (cảnh 1) và chữ kết (cảnh 9).
- Minh trông 32 tuổi, chú Tư khoảng 60, cùng người với các tập trước.

Phần ghép lúc dựng, không vẽ vào ảnh: chữ hook, thẻ series, thẻ ngày, màn hình đếm ngược "Hạn học phí: còn 18 ngày", câu của chú Tư, chữ kết.

## Ảnh theo lời đọc

| Tên ảnh | Tham chiếu | Lời đọc |
|---|---|---|
| `c1-chua-ve` | `chu-tu`, `c4-chu-tu` | Hai giờ sáng rồi mà chú Tư xe ôm (...) chưa chịu về nhà |
| `c2-dem-nguoc` | `minh`, phòng trọ tập 5 | Nằm hoài không ngủ được (...) rồi lại tắt đi |
| `c3-xuong-hem` | `minh`, `c4-chu-tu` | Bụng đói cồn cào (...) một tô hủ tiếu gõ |
| `c4-chu-tu` | `minh`, `chu-tu` | Chú than ban ngày khách đặt xe (...) |
| `c5-ke-chu-nghe` | `minh`, `chu-tu`, `c4-chu-tu` | Mình kể chú nghe (...) còn mười tám ngày nữa |
| `c6-dem-viec` | `chu-tu`, `c4-chu-tu` | Chú thổi tô hủ tiếu, bảo đừng đếm ngày, đếm việc (...) |
| `c7-tra-loi` | `minh`, `chu-tu`, `c4-chu-tu` | Hôm qua được sáu đơn (...) cứ bấm nhận |
| `c8-o-khoa` | `minh`, `chu-tu`, `c4-chu-tu` | Hai chú cháu đi bộ về (...) chỉ có một đôi dép |
| `c9-san-thuong` | `minh`, sân thượng tập 7, chậu tập 8 | Về phòng lên sân thượng (...) báo thức năm giờ sáng |

## Prompt

### c4-chu-tu (làm trước, ảnh gốc của xe hủ tiếu)

```text
Vietnamese oil painting, thick visible brush strokes, deep blue-black night in a narrow old Saigon alley, the only warm light a single yellow bulb hanging over a small wooden hu tieu noodle push-cart with a blank glass cabinet and a steaming broth pot. Two low red plastic stools beside the cart. The older man from the reference, about 60, pale green short-sleeve shirt with reading glasses in the pocket, khaki trousers, sandals, sits on one stool holding a white ceramic bowl, talking while gesturing toward the dark street with his chopsticks, his old faded blue motorbike parked behind him with a worn blue helmet on the mirror. The 32-year-old man from the reference, in a faded grey t-shirt and dark shorts, sits on the other stool, listening, his own bowl in his hands. The vendor stands blurred behind the cart. Steam rising in the lamplight. Quiet late-night mood. Both men centered with generous space around. Natural hand anatomy. No text, no letters, no logo, no watermark. Square 1:1.
```

### c1-chua-ve (khung mở đầu, phải bắt mắt)

```text
Vietnamese oil painting, thick visible brush strokes, 2 a.m. in a narrow old Saigon alley, everything deep blue-black and empty, rolling metal shutters closed, tangled wires overhead. At the mouth of the alley, the same small hu tieu push-cart from the reference glows under its single yellow bulb, steam rising. The same older man in the pale green shirt sits alone on a low red stool beside it, shoulders a little bent, an empty bowl on his knee, looking out at the empty street, his old blue motorbike parked next to him. The warm pool of light is small against the huge dark around it. Lonely, waiting mood. Subject in the lower middle with open dark space above for text. No text, no letters, no logo, no watermark. Square 1:1.
```

### c2-dem-nguoc

```text
Vietnamese oil painting, thick visible brush strokes, a tiny rented room in Saigon at night, almost completely dark, the only light the cold blue glow of a phone screen. The same 32-year-old man in a faded grey t-shirt lies on his side on a low iron bed, the phone held close to his face, eyes open and tired, a thin blanket pushed away. Clothes hanging on a nail, a small fan, a narrow window with faint orange city haze. Sleepless, restless mood. Face and phone centered with generous dark space around. Natural hand anatomy. No text, no letters, no logo, no watermark. Square 1:1.
```

### c3-xuong-hem

```text
Vietnamese oil painting, thick visible brush strokes, late night in a long narrow old Saigon alley, wet concrete, closed doors on both sides, deep blue-black shadows. The same man in a faded grey t-shirt, dark shorts and rubber sandals walks down the alley seen from behind and slightly to the side, arms folded over his stomach, head down. Far ahead at the end of the alley, a small warm yellow glow of a noodle cart with rising steam. Hungry, quiet mood. Figure centered with generous space around. No text, no letters, no logo, no watermark. Square 1:1.
```

### c5-ke-chu-nghe

```text
Vietnamese oil painting, thick visible brush strokes, the same noodle cart, stools and yellow bulb from the reference at night. Closer view: the younger man in the faded grey t-shirt leans forward on his low stool, holding his phone loosely in one hand on his knee, screen dark, talking quietly. The older man in the pale green shirt listens, holding his bowl, his face half in warm light. Steam between them. Confiding, heavy mood. Both faces centered. Natural hand anatomy. No text, no letters, no logo, no watermark. Square 1:1.
```

### c6-dem-viec

```text
Vietnamese oil painting, thick visible brush strokes, the same noodle cart and yellow bulb at night. Close view of the older man in the pale green shirt from the reference, reading glasses in his pocket, holding a white ceramic bowl of steaming noodles near his face and blowing on a spoonful, eyes looking up sideways at the young man just outside the frame, calm and a little stern. Steam curling in the warm light, deep blue-black alley behind. Plain, wise mood. Face and bowl centered with space on one side for a short caption. Natural hand anatomy. No text, no letters, no logo, no watermark. Square 1:1.
```

### c7-tra-loi

```text
Vietnamese oil painting, thick visible brush strokes, the same noodle cart, stools and yellow bulb from the reference at night. The younger man in the faded grey t-shirt looks down into his half-finished bowl, answering in a low voice, embarrassed. Beside him the older man in the pale green shirt nods slowly, one hand resting on his own knee. Both seen from the side at the same height. Steam fading. Honest, quiet mood. Both men centered with generous space around. Natural hand anatomy. No text, no letters, no logo, no watermark. Square 1:1.
```

### c8-o-khoa

```text
Vietnamese oil painting, thick visible brush strokes, the end of the same narrow alley at night, very dark, one weak street lamp. In front of a small old house with a closed folding metal gate, a padlock hangs on the OUTSIDE of the gate, locked. The older man in the pale green shirt has parked his old blue motorbike and is reaching for the padlock with a key. On the doorstep in front of the gate there is only one pair of worn rubber sandals. The younger man in the grey t-shirt stands a step behind, watching. Inside the gate everything is dark. Lonely, quiet mood. Padlock, sandals and the older man centered. Natural hand anatomy. No text, no letters, no numbers on the house, no logo, no watermark. Square 1:1.
```

### c9-san-thuong

```text
Vietnamese oil painting, thick visible brush strokes, deep blue-green night with hazy orange glow and golden city lights, clear shapes, not muddy. Night on the same rooftop of an old Saigon boarding house as the reference, laundry lines and a stainless steel water tank. The same small white pot of pothos from the reference sits on the low concrete parapet. The same man in a faded grey t-shirt and dark shorts sits on a low plastic stool beside it, seen from the side and a little behind, holding his phone in both hands, its glow on his face, thumb hovering, undecided. Beyond him countless lit windows. The sky is a hazy orange-grey glow, completely empty, not a single star, no moon. Unfinished, quiet mood. Subject and pot centered in the lower half with open sky above for text. No text, no letters, no logo, no watermark. Square 1:1.
```
