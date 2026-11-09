// Đọc sự kiện từ một buổi TikTok LIVE. Chỉ đọc, không đăng nhập và không gửi gì vào phòng.
import { ControlEvent, TikTokLiveConnection, WebcastEvent } from 'tiktok-live-connector';

const RETRY = 30_000;
const SKIP_REPLAY = 2_000;

export function startTikTok(user, onEvent, onStatus) {
  // Gói miễn phí của dịch vụ ký không cho tắt processInitialData, cũng không cho lấy danh sách quà.
  const conn = new TikTokLiveConnection(user, {});
  // Tên trường lấy từ dữ liệu thực tế của bản 2.5.0, README của thư viện còn ghi tên cũ.
  const who = (d) => ({ id: d.user?.displayId || d.user?.id, name: d.user?.nickname || d.user?.displayId });
  // Lúc mới nối, thư viện phát lại bình luận cũ. Bỏ qua để không chào người đã rời đi.
  let openAt = Infinity;
  const emit = (ev) => {
    if (Date.now() >= openAt) onEvent(ev);
  };

  conn.on(WebcastEvent.MEMBER, (d) => emit({ kind: 'join', ...who(d) }));
  conn.on(WebcastEvent.CHAT, (d) => emit({ kind: 'comment', ...who(d), text: d.content }));
  conn.on(WebcastEvent.LIKE, (d) => emit({ kind: 'like', ...who(d), count: d.count }));
  conn.on(WebcastEvent.FOLLOW, (d) => emit({ kind: 'follow', ...who(d) }));
  conn.on(WebcastEvent.SHARE, (d) => emit({ kind: 'share', ...who(d) }));
  conn.on(WebcastEvent.ROOM_USER, (d) => emit({ kind: 'viewers', count: d.viewerCount ?? d.total }));
  conn.on(WebcastEvent.GIFT, (d) => {
    // Quà tặng liên tiếp chỉ tính một lần khi chuỗi kết thúc.
    if (d.gift?.type === 1 && !d.repeatEnd) return;
    emit({ kind: 'gift', ...who(d), diamonds: d.gift?.diamondCount ?? 1, count: d.repeatCount ?? 1 });
  });

  let timer = null;
  const retry = () => {
    if (!timer) timer = setTimeout(connect, RETRY);
  };
  const connect = async () => {
    timer = null;
    try {
      openAt = Infinity;
      await conn.connect();
      openAt = Date.now() + SKIP_REPLAY;
      onStatus(`đã nối @${user}`);
    } catch (err) {
      onStatus(`chờ @${user} lên live`);
      console.log(`Chưa nối được @${user}: ${err.message}`);
      retry();
    }
  };
  conn.on(ControlEvent.DISCONNECTED, () => {
    onStatus(`mất kết nối @${user}`);
    retry();
  });
  conn.on(ControlEvent.ERROR, ({ info }) => console.log('Lỗi TikTok:', info));
  connect();
  return conn;
}
