// Người xem giả để thử cảnh mà không cần lên sóng.
const NAMES = [
  'Minh Anh', 'Hoài An', '𝓜𝓲𝓲𝓾🐣', 'Thu Hà', 'Đức Long', 'Bảo Trâm', 'Nguyễn Khôi', '💖 Ngọc Lan 💖', 'Tuấn Kiệt',
  'Phương Linh', 'Gia Hân', 'Quốc Bảo', 'Mai Chi', 'Trọng Nghĩa', '天阿', 'Khánh Vy', 'Thanh Tùng', 'Yến Nhi', 'Hải Đăng', 'Lan Hương',
];
const COMMENTS = [
  'đêm nay mình không ngủ được', 'đẹp quá', 'chào mọi người', 'nghe giọng thấy nhẹ lòng ghê', 'ngôi sao của mình đâu rồi',
  '🌙🌙', 'mai thi rồi mà vẫn ngồi đây', 'cảm ơn kênh', 'mình mới tan ca', 'ai còn thức không', 'trời hôm nay nhiều mây lắm', '⭐',
];

const pick = (list) => list[Math.floor(Math.random() * list.length)];
const person = () => {
  const name = pick(NAMES);
  return { id: `sim-${name}`, name };
};

export function startSim(onEvent) {
  const seen = new Set();
  const tick = () => {
    const roll = Math.random();
    const p = person();
    if (!seen.has(p.id)) {
      seen.add(p.id);
      onEvent({ kind: 'join', ...p });
    } else if (roll < 0.5) onEvent({ kind: 'comment', ...p, text: pick(COMMENTS) });
    else if (roll < 0.85) onEvent({ kind: 'like', ...p, count: 1 + Math.floor(Math.random() * 15) });
    else if (roll < 0.92) onEvent({ kind: 'follow', ...p });
    else onEvent({ kind: 'gift', ...p, diamonds: pick([1, 1, 5, 30]), count: 1 });
    onEvent({ kind: 'viewers', count: seen.size + 3 });
    setTimeout(tick, 1_500 + Math.random() * 3_000);
  };
  tick();
}
