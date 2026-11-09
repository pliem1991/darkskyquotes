// Lọc mọi chữ đến từ người xem trước khi đưa lên hình hoặc đọc thành tiếng.
import { readFileSync } from 'node:fs';

const blocked = readFileSync(new URL('./blocklist.txt', import.meta.url), 'utf8')
  .split(/\r?\n/)
  .map((line) => line.trim().toLowerCase())
  .filter((line) => line && !line.startsWith('#'))
  .map((term) => new RegExp(`(?<![\\p{L}\\p{N}])${term.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}(?![\\p{L}\\p{N}])`, 'u'));

const SPAM = /https?:|www\.|\.(com|net|org|vn|me|io|link|shop)\b|zalo|telegram|t\.me|\d[\d .-]{7,}\d/i;
const CARE = /muốn chết|tự tử|tự sát|không muốn sống|chán sống|kết thúc tất cả/i;

export function isBlocked(text) {
  const lower = text.normalize('NFC').toLowerCase();
  return blocked.some((re) => re.test(lower));
}

// Tên để giọng đọc: chỉ giữ chữ Latin (gồm tiếng Việt), tối đa 3 từ. Không đọc được thì gọi là "bạn".
export function speakableName(nick = '') {
  const words = nick.normalize('NFKC').replace(/[^\p{Script=Latin}\s]/gu, ' ').trim().split(/\s+/).slice(0, 3);
  const name = words.join(' ');
  if (name.length < 2 || name.length > 24 || isBlocked(nick.normalize('NFKC')) || isBlocked(name)) return 'bạn';
  return name;
}

// Tên để hiện trên hình: giữ chữ và số của mọi ngôn ngữ, bỏ emoji và ký tự trang trí.
export function displayName(nick = '') {
  const name = nick.normalize('NFKC').replace(/[^\p{L}\p{N}\s._-]/gu, '').replace(/\s+/g, ' ').trim();
  if (!name || isBlocked(name)) return 'Một vì sao';
  return name.length > 18 ? `${name.slice(0, 17)}…` : name;
}

// Bình luận chỉ hiện trên hình, không bao giờ được đọc thành tiếng. Trả về null nếu không nên hiện.
export function cleanComment(text = '') {
  const clean = text.normalize('NFC').replace(/\p{Cc}/gu, ' ').replace(/\s+/g, ' ').trim();
  if (!clean || isBlocked(clean) || SPAM.test(clean) || CARE.test(clean)) return null;
  return clean.length > 70 ? `${clean.slice(0, 69)}…` : clean;
}

// Bình luận có dấu hiệu người xem đang khủng hoảng: người trực live cần tự đọc và trả lời.
export function needsCare(text = '') {
  return CARE.test(text.normalize('NFC'));
}
