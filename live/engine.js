// Luật của buổi live: mỗi người xem là một vì sao, tương tác làm sao sáng hơn.
import { cleanComment, displayName, needsCare, speakableName } from './clean.js';

const MAX_STARS = 50;
const COMMENT_POINT_GAP = 5_000;
const COMMENT_VOICE_GAP = 120_000;
const IDLE_AFTER = 40_000;

const pick = (list) => list[Math.floor(Math.random() * list.length)];

const LINES = {
  join: [
    (n) => `${n} vừa đến. Trời đêm nay có thêm một vì sao.`,
    (n) => `Chào ${n}. Cứ ngồi đây một lúc nhé.`,
    (n) => `${n} ơi, ngôi sao của bạn vừa sáng lên rồi đó.`,
  ],
  comment: [
    (n) => `Cảm ơn ${n} đã ghé lại đêm nay.`,
    (n) => `${n} ơi, mình thấy ngôi sao của bạn rồi.`,
    (n) => `Mong đêm nay của ${n} nhẹ hơn một chút.`,
  ],
  follow: [(n) => `Cảm ơn ${n} đã theo dõi kênh. Mình sẽ còn gặp nhau dưới bầu trời này.`],
  share: [(n) => `Cảm ơn ${n} đã chia sẻ bầu trời này với một người khác.`],
  gift: [
    (n) => `Cảm ơn ${n} đã gửi tặng món quà. Ngôi sao của ${n} đang sáng hơn.`,
    (n) => `Cảm ơn ${n} rất nhiều. Một vệt sao vừa bay ngang qua trời vì bạn.`,
  ],
};

const IDLE = [
  'Ánh sao bạn thấy đêm nay, không phải ánh sáng của đêm nay.',
  'Một đêm bạn chưa thấy gì, chưa chắc là một đêm không có gì đang đến.',
  'Khi trời đủ tối, bạn mới thấy những vì sao.',
  'Cứ ngồi đây thêm một lúc. Không cần phải nói gì cả.',
  'Bạn chỉ cần bình luận một chữ thôi, ngôi sao của bạn sẽ hiện lên trên trời.',
];

export class Engine {
  constructor({ broadcast, voice }) {
    this.broadcast = broadcast;
    this.voice = voice;
    this.stars = new Map();
    this.viewers = 0;
    this.idleIndex = 0;
    this.idleTimer = setInterval(() => this.#idle(), 5_000);
  }

  snapshot() {
    return { type: 'snapshot', stars: [...this.stars.values()], viewers: this.viewers };
  }

  handle(ev) {
    if (ev.kind === 'viewers') {
      this.viewers = ev.count;
      this.broadcast({ type: 'viewers', count: ev.count });
      return;
    }
    if (!ev.id) return;
    const isNew = !this.stars.has(ev.id);
    const star = this.#upsert(ev);
    const name = star.spoken;
    // Cảnh phải biết ngôi sao trước khi nhận hiệu ứng của nó.
    if (isNew) this.broadcast({ type: 'star', star });
    switch (ev.kind) {
      case 'join':
        if (isNew) this.#say(pick(LINES.join)(name), { priority: 1, ttl: 15_000, onlyIfQuiet: true });
        break;
      case 'comment':
        this.#comment(star, ev.text ?? '', name);
        break;
      case 'like':
        star.points += Math.min(ev.count ?? 1, 25) * 0.2;
        this.broadcast({ type: 'pulse', id: star.id });
        break;
      case 'follow':
        star.points += 10;
        this.broadcast({ type: 'pulse', id: star.id });
        this.#say(pick(LINES.follow)(name), { priority: 2, ttl: 60_000 });
        break;
      case 'share':
        star.points += 5;
        this.broadcast({ type: 'pulse', id: star.id });
        this.#say(pick(LINES.share)(name), { priority: 2, ttl: 60_000 });
        break;
      case 'gift':
        star.points += Math.max(5, (ev.diamonds ?? 1) * (ev.count ?? 1));
        this.broadcast({ type: 'gift', id: star.id });
        this.#say(pick(LINES.gift)(name), { priority: 3, ttl: 120_000 });
        break;
    }
    this.broadcast({ type: 'star', star });
  }

  #comment(star, text, name) {
    if (needsCare(text)) {
      console.warn(`\x07[CẦN NGƯỜI TRỰC ĐỌC] ${star.name}: ${text}`);
      return;
    }
    const now = Date.now();
    if (now - star.lastComment > COMMENT_POINT_GAP) star.points += 2;
    star.lastComment = now;
    const clean = cleanComment(text);
    if (clean) this.broadcast({ type: 'comment', id: star.id, text: clean });
    if (now - star.lastVoice > COMMENT_VOICE_GAP) {
      star.lastVoice = now;
      this.#say(pick(LINES.comment)(name), { priority: 2, ttl: 30_000 });
    }
  }

  #upsert(ev) {
    let star = this.stars.get(ev.id);
    if (!star) {
      star = {
        id: ev.id,
        name: displayName(ev.name),
        spoken: speakableName(ev.name),
        points: 1,
        ...this.#findSpot(),
        lastSeen: 0,
        lastComment: 0,
        lastVoice: 0,
      };
      this.stars.set(ev.id, star);
      this.#evict();
    }
    star.lastSeen = Date.now();
    return star;
  }

  // Chọn chỗ trống nhất trong vài vị trí ngẫu nhiên để tên không đè lên nhau.
  #findSpot() {
    const placed = [...this.stars.values()];
    let best = { x: Math.random(), y: Math.random() };
    let bestGap = -1;
    for (let i = 0; i < 24; i++) {
      const c = { x: Math.random(), y: Math.random() };
      const gap = placed.reduce((min, s) => Math.min(min, Math.hypot((s.x - c.x) * 0.94, (s.y - c.y) * 0.65)), Infinity);
      if (gap > bestGap) {
        best = c;
        bestGap = gap;
      }
    }
    return best;
  }

  // Quá nhiều sao thì bỏ sao ít điểm và lâu không tương tác nhất.
  #evict() {
    if (this.stars.size <= MAX_STARS) return;
    const now = Date.now();
    const score = (s) => s.points - (now - s.lastSeen) / 60_000;
    const oldest = [...this.stars.values()].reduce((a, b) => (score(a) <= score(b) ? a : b));
    this.stars.delete(oldest.id);
    this.broadcast({ type: 'remove', id: oldest.id });
  }

  #say(text, opts) {
    this.voice.say(text, opts);
  }

  #idle() {
    if (Date.now() - this.voice.lastSpoke < IDLE_AFTER || !this.voice.quiet) return;
    this.#say(IDLE[this.idleIndex++ % IDLE.length], { priority: 0, ttl: 60_000 });
  }
}
