## Kênh và Chrome profile của project này

Bảng này là nguồn tra chính để biết mỗi kênh nằm ở Chrome profile nào. **Trước khi mở Chrome làm việc với một kênh, đọc bảng này và mở thẳng đúng profile**, không đi thử từng profile.

| Nền tảng | Kênh | Chrome profile (tên thư mục) | Email đăng nhập | Link kênh |
|---|---|---|---|---|
| TikTok | dark.sky.quotes | `Default` | pliem1991@gmail.com | https://www.tiktok.com/@dark.sky.quotes |

- **Chrome profile** phải là **tên thư mục** của profile (`Default`, `Profile 1`, `Profile 12`…), không phải tên hiển thị hay email. Mở bằng: `"C:\Program Files\Google\Chrome\Application\chrome.exe" --profile-directory="Profile 12" <link kênh>`. Nếu dùng Claude in Chrome thì chọn đúng cửa sổ của profile đó.
- **Link kênh**: YouTube ghi link Studio có mã kênh `https://studio.youtube.com/channel/UC…` (một tài khoản Google có thể có nhiều kênh, nên phải có mã UC); Facebook ghi link Page; TikTok ghi `https://www.tiktok.com/@handle`. Mở xong, nhìn tên kênh trên trang một lần để chắc đúng.
- **Nếu bảng chưa có kênh đó**: đọc file `%LOCALAPPDATA%\Google\Chrome\User Data\Local State` (JSON, mục `profile.info_cache`: mỗi khóa là tên thư mục, `user_name` là email đăng nhập, `name` là tên hiển thị) để tìm profile có email của kênh. Chỉ khi vẫn không ra mới thử từng profile. Tìm được rồi thì **ghi ngay vào bảng này** để lần sau khỏi tìm.
- Mỗi lần biết thêm hoặc thấy sai thông tin ở bảng (đổi profile, đổi email, kênh mới), sửa bảng ngay.

## Báo lịch đăng lên dashboard "Lịch đăng kênh"

Dashboard: https://claude.ai/artifact/HRf2kCdo6NMdfrnn6bMGfg

**Khi nào:** mỗi lần lên lịch, hủy lịch, đổi giờ đăng một video, hoặc khi được bảo "ghi lịch hiện tại lên dashboard", phải cập nhật dashboard cho **từng kênh bị ảnh hưởng**. Đây là bước bắt buộc của việc lên lịch, chưa cập nhật thì chưa coi là xong.

**Cách làm** (dùng tool `ArtifactData`; nếu tool chưa được nạp thì nạp bằng ToolSearch `select:ArtifactData`):

1. Đọc bản ghi của kênh: `action: "get"`, `url` là link dashboard ở trên, `collection: "channels"`, `doc_id` theo quy tắc bên dưới.
2. Ghi đè toàn bộ bản ghi đó: `action: "set"`, cùng `collection` và `doc_id`. Nếu bước 1 có trả về `version` thì truyền nó vào `if_version`; nếu bản ghi chưa có thì bỏ `if_version`. Nếu bị từ chối vì version đã đổi, đọc lại rồi ghi lại.

**`doc_id`:** `<project>--<platform>--<tên kênh>--<chrome profile>`, viết thường, bỏ dấu tiếng Việt, khoảng trắng thay bằng `-`, chỉ giữ chữ, số và `-`. Ví dụ: `youtube--youtube--kenh-meo-con--profile-3`. Một kênh luôn phải dùng đúng một `doc_id`, không đổi giữa các lần ghi. Kênh nào đã có bản ghi trên dashboard thì giữ nguyên `doc_id` cũ, kể cả khi trường `profile` được sửa lại cho đúng.

`doc_id` của kênh TikTok dark.sky.quotes là `darkskyquotes--tiktok--dark-sky-quotes--pliem1991gmailcom` (tạo trước khi có bảng profile, giữ nguyên).

**Nội dung (`data`):**

```json
{
  "project": "youtube",
  "platform": "youtube",
  "channel": "Kênh Mèo Con",
  "profile": "Profile 3",
  "email": "kenhmeocon＠gmail.com",
  "channel_url": "https://studio.youtube.com/channel/UCxxxxxxxxxxxxxxxxxxxxxx",
  "schedule": [
    { "at": "2026-11-15T19:00:00+07:00", "video": "tap-12.mp4" },
    { "at": "2026-11-16T19:00:00+07:00", "video": "tap-13.mp4" }
  ],
  "queue_left": 4,
  "note": null,
  "updated_at": "2026-11-07T14:30:00+07:00"
}
```

- `project`: tên thư mục của project này (ví dụ `youtube`, `daugplx`, `agaubun`, `darkskyquotes`).
- `platform`: chỉ một trong ba giá trị `youtube`, `facebook`, `tiktok`.
- `profile`: **tên thư mục** Chrome profile, lấy từ bảng "Kênh và Chrome profile" ở trên (`Default`, `Profile 12`…). Không ghi email hay tên hiển thị vào đây.
- `email`: email của tài khoản quản lý kênh (tài khoản Google, Facebook hoặc TikTok đăng nhập trong Chrome profile đó). Không biết thì để `null`, tuyệt đối không đoán.
- `channel_url`: link kênh như trong bảng ở trên. Không biết thì để `null`.
- `schedule`: **tất cả** video đang được hẹn giờ mà chưa đăng của kênh, kể cả những video không phải do lần này lên lịch. Giờ ghi theo ISO, kèm `+07:00`.
- `queue_left`: số video đã sẵn sàng nhưng chưa lên lịch. Không biết thì để `null`.
- `note`: giữ nguyên giá trị đọc được ở bước 1 (người dùng có thể sửa tay trên dashboard), trừ khi người dùng bảo đổi.
- `updated_at`: thời điểm ghi, giờ GMT+7.

Ghi xong, báo một dòng: kênh nào, lịch tới ngày nào.
