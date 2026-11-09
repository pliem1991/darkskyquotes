import test from 'node:test';
import assert from 'node:assert/strict';
import { cleanComment, displayName, needsCare, speakableName } from './clean.js';

test('tên đọc thành tiếng', () => {
  assert.equal(speakableName('💖 Hùng🩷 Ghép-Đôi-Se-Duyên 💖'), 'Hùng Ghép Đôi');
  assert.equal(speakableName('𝓜𝓲𝓲𝓾🐣'), 'Miiu');
  assert.equal(speakableName('天阿'), 'bạn');
  assert.equal(speakableName('🌸🌸'), 'bạn');
  assert.equal(speakableName('thằng ngu'), 'bạn');
});

test('tên hiện trên hình', () => {
  assert.equal(displayName('𝐏𝐡𝐨𝐧𝐠 𝐘ê𝐧 🌙'), 'Phong Yên');
  assert.equal(displayName('天阿'), '天阿');
  assert.equal(displayName('💖💖'), 'Một vì sao');
  assert.equal(displayName('vcl'), 'Một vì sao');
});

test('bình luận', () => {
  assert.equal(cleanComment('đẹp quá 🌙'), 'đẹp quá 🌙');
  assert.equal(cleanComment('vào zalo 0912 345 678 nhé'), null);
  assert.equal(cleanComment('xem tại abc.com'), null);
  assert.equal(cleanComment('đồ NGU'), null);
  assert.equal(cleanComment('nguyên đêm nay đẹp'), 'nguyên đêm nay đẹp');
});

test('dấu hiệu khủng hoảng được giữ lại cho người trực', () => {
  assert.equal(needsCare('mình không muốn sống nữa'), true);
  assert.equal(cleanComment('mình không muốn sống nữa'), null);
  assert.equal(needsCare('đêm nay đẹp'), false);
});
