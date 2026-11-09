// Cảnh bầu trời 1080x1920. Phần chính nằm ở 60% trên, vì TikTok phủ bình luận lên phía dưới.
const W = 1080;
const H = 1920;
const SKY = { x0: 90, x1: 990, y0: 500, y1: 1050 };
const HORIZON = 1570;
const LANTERN = { x: 358, y: HORIZON - 40 };
const SERIF = '"Cambria", "Times New Roman", serif';
const SANS = '"Segoe UI", sans-serif';
const PALETTE = ['#fff4e8', '#d6e4ff', '#ffdebe', '#ffffff', '#bcd4ff', '#ffe9a8'];

const canvas = document.getElementById('sky');
const ctx = canvas.getContext('2d');
const random = (a, b) => a + Math.random() * (b - a);

const stars = new Map();
const bubbles = [];
const flights = [];
const meteors = [];
let links = [];
let top3 = [];
let viewers = 0;
let mode = 'sim';
let status = '';
let caption = null;

function glowSprite(color) {
  const c = document.createElement('canvas');
  c.width = c.height = 128;
  const g = c.getContext('2d');
  const grad = g.createRadialGradient(64, 64, 0, 64, 64, 64);
  grad.addColorStop(0, '#ffffff');
  grad.addColorStop(0.08, color);
  grad.addColorStop(0.28, `${color}44`);
  grad.addColorStop(1, `${color}00`);
  g.fillStyle = grad;
  g.fillRect(0, 0, 128, 128);
  return c;
}
const sprites = PALETTE.map(glowSprite);

// Lớp sao nền và Ngân Hà vẽ một lần, sau đó chỉ xoay rất chậm.
function buildField() {
  const size = 2300;
  const c = document.createElement('canvas');
  c.width = c.height = size;
  const g = c.getContext('2d');
  const haze = glowSprite('#5a6088');
  g.globalCompositeOperation = 'lighter';
  for (let i = 0; i < 1500; i++) {
    const along = random(-size * 0.7, size * 0.7);
    const across = (Math.random() + Math.random() + Math.random() - 1.5) * 300;
    const r = random(60, 220);
    g.globalAlpha = random(0.01, 0.05);
    g.drawImage(haze, size / 2 + along * 0.69 + across * 0.72 - r, size / 2 - along * 0.72 + across * 0.69 - r, r * 2, r * 2);
  }
  for (let i = 0; i < 8000; i++) {
    const m = Math.min(0.12 + (1 / Math.pow(Math.random(), 1 / 2.4) - 1), 1.4);
    g.globalAlpha = Math.min(m, 1);
    g.fillStyle = PALETTE[i % 4];
    const s = m > 0.8 ? 2.4 : m > 0.35 ? 1.7 : 1.1;
    g.fillRect(Math.random() * size, Math.random() * size, s, s);
  }
  return c;
}

function buildBackdrop() {
  const c = document.createElement('canvas');
  c.width = W;
  c.height = H;
  const g = c.getContext('2d');
  const grad = g.createLinearGradient(0, 0, 0, HORIZON);
  grad.addColorStop(0, '#03050e');
  grad.addColorStop(1, '#14203a');
  g.fillStyle = grad;
  g.fillRect(0, 0, W, H);
  return c;
}

function buildHill() {
  const c = document.createElement('canvas');
  c.width = W;
  c.height = H;
  const g = c.getContext('2d');
  const ridge = (x) => HORIZON + 40 * Math.sin((x / W) * 4.2) + 18 * Math.sin((x / W) * 13);
  g.fillStyle = '#04050a';
  g.beginPath();
  g.moveTo(0, H);
  for (let x = 0; x <= W; x += 6) g.lineTo(x, ridge(x));
  g.lineTo(W, H);
  g.fill();
  const fx = 330;
  const fy = ridge(fx) + 4;
  g.beginPath();
  g.moveTo(fx - 13, fy);
  g.lineTo(fx + 13, fy);
  g.lineTo(fx + 8, fy - 58);
  g.lineTo(fx - 8, fy - 58);
  g.fill();
  g.beginPath();
  g.arc(fx, fy - 66, 8, 0, Math.PI * 2);
  g.fill();
  g.strokeStyle = '#04050a';
  g.lineWidth = 4;
  g.beginPath();
  g.moveTo(fx + 7, fy - 48);
  g.lineTo(fx + 28, fy - 34);
  g.stroke();
  LANTERN.x = fx + 28;
  LANTERN.y = fy - 30;
  return c;
}

const backdrop = buildBackdrop();
const field = buildField();
const hill = buildHill();
const lanternSprite = glowSprite('#ffc98a');
const twinkles = Array.from({ length: 160 }, () => ({
  x: Math.random() * W,
  y: Math.random() * (HORIZON - 60),
  r: random(1, 2.6),
  phase: random(0, 6.28),
  speed: random(0.5, 2),
}));

const posOf = (s) => ({ x: SKY.x0 + s.x * (SKY.x1 - SKY.x0), y: SKY.y0 + s.y * (SKY.y1 - SKY.y0) });
const radiusOf = (s) => Math.min(9 + 4.2 * Math.log2(1 + s.points), 34);
const spriteOf = (id) => {
  let h = 0;
  for (const ch of id) h = (h * 31 + ch.charCodeAt(0)) >>> 0;
  return sprites[h % sprites.length];
};

// Mỗi sao nối với sao gần nhất đã có trước nó, thành chòm sao lớn dần theo buổi live.
function relink() {
  const list = [...stars.values()];
  links = [];
  list.forEach((s, i) => {
    let best = null;
    let bestD = 330;
    for (let j = 0; j < i; j++) {
      const d = Math.hypot((list[j].x - s.x) * 900, (list[j].y - s.y) * 620);
      if (d < bestD) {
        best = list[j];
        bestD = d;
      }
    }
    if (best) links.push([s, best]);
  });
  top3 = [...list].sort((a, b) => b.points - a.points).slice(0, 3);
}

function addStar(data, animate) {
  const s = { ...data, born: performance.now(), pulse: 0, ring: 0, lit: !animate };
  stars.set(s.id, s);
  if (animate) flights.push({ star: s, t: 0 });
  relink();
}

function roundRect(g, x, y, w, h, r) {
  g.beginPath();
  g.roundRect(x, y, w, h, r);
}

function wrap(text, maxWidth) {
  const lines = [];
  let line = '';
  for (const word of text.split(' ')) {
    const next = line ? `${line} ${word}` : word;
    if (ctx.measureText(next).width > maxWidth && line) {
      lines.push(line);
      line = word;
    } else line = next;
  }
  if (line) lines.push(line);
  return lines;
}

function drawSky(now) {
  ctx.drawImage(backdrop, 0, 0);
  ctx.save();
  ctx.translate(W / 2, H / 2);
  ctx.rotate(now * 0.000012);
  ctx.drawImage(field, -field.width / 2, -field.height / 2);
  ctx.restore();
  ctx.fillStyle = '#fff';
  for (const t of twinkles) {
    ctx.globalAlpha = 0.25 + 0.45 * (0.5 + 0.5 * Math.sin(t.phase + (now / 1000) * t.speed));
    ctx.fillRect(t.x, t.y, t.r, t.r);
  }
  ctx.globalAlpha = 1;
}

function drawLinks() {
  ctx.lineWidth = 1.4;
  ctx.strokeStyle = 'rgba(190, 210, 255, 0.2)';
  ctx.beginPath();
  for (const [a, b] of links) {
    if (!a.lit || !b.lit) continue;
    const p = posOf(a);
    const q = posOf(b);
    ctx.moveTo(p.x, p.y);
    ctx.lineTo(q.x, q.y);
  }
  ctx.stroke();
}

function drawStars(now, dt) {
  ctx.textAlign = 'center';
  ctx.textBaseline = 'top';
  ctx.font = `600 27px ${SANS}`;
  for (const s of stars.values()) {
    if (!s.lit) continue;
    s.pulse = Math.max(0, s.pulse - dt * 1.4);
    const p = posOf(s);
    const r = radiusOf(s) * (1 + 0.45 * s.pulse) * (1 + 0.06 * Math.sin(now / 700 + s.x * 40));
    ctx.globalCompositeOperation = 'lighter';
    ctx.drawImage(spriteOf(s.id), p.x - r * 2.4, p.y - r * 2.4, r * 4.8, r * 4.8);
    ctx.globalCompositeOperation = 'source-over';
    if (s.ring > 0) {
      s.ring = Math.max(0, s.ring - dt * 0.5);
      ctx.strokeStyle = `rgba(255, 233, 168, ${s.ring})`;
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.arc(p.x, p.y, r + (1 - s.ring) * 130, 0, Math.PI * 2);
      ctx.stroke();
    }
    const ageMin = (Date.now() - s.lastSeen) / 60000;
    ctx.globalAlpha = Math.max(0.35, 1 - ageMin / 6);
    ctx.lineWidth = 5;
    ctx.strokeStyle = 'rgba(3, 5, 14, 0.85)';
    ctx.strokeText(s.name, p.x, p.y + r + 8);
    ctx.fillStyle = '#eef3ff';
    ctx.fillText(s.name, p.x, p.y + r + 8);
    ctx.globalAlpha = 1;
  }
}

// Ánh sáng bay từ đèn của người gác đêm lên chỗ ngôi sao mới.
function drawFlights(dt) {
  for (let i = flights.length - 1; i >= 0; i--) {
    const f = flights[i];
    f.t += dt / 1.5;
    const k = Math.min(f.t, 1);
    const e = 1 - (1 - k) * (1 - k);
    const to = posOf(f.star);
    const cx = (LANTERN.x + to.x) / 2 + 120;
    const cy = (LANTERN.y + to.y) / 2;
    const x = (1 - e) ** 2 * LANTERN.x + 2 * (1 - e) * e * cx + e * e * to.x;
    const y = (1 - e) ** 2 * LANTERN.y + 2 * (1 - e) * e * cy + e * e * to.y;
    ctx.globalCompositeOperation = 'lighter';
    ctx.drawImage(lanternSprite, x - 26, y - 26, 52, 52);
    ctx.globalCompositeOperation = 'source-over';
    if (k >= 1) {
      f.star.lit = true;
      f.star.pulse = 1;
      flights.splice(i, 1);
    }
  }
}

function drawMeteors(dt) {
  for (let i = meteors.length - 1; i >= 0; i--) {
    const m = meteors[i];
    m.t += dt / 1.1;
    const k = Math.min(m.t, 1);
    const x = m.x0 + (m.x1 - m.x0) * k;
    const y = m.y0 + (m.y1 - m.y0) * k;
    const back = Math.max(0, k - 0.22);
    const tx = m.x0 + (m.x1 - m.x0) * back;
    const ty = m.y0 + (m.y1 - m.y0) * back;
    const grad = ctx.createLinearGradient(tx, ty, x, y);
    grad.addColorStop(0, 'rgba(255,255,255,0)');
    grad.addColorStop(1, 'rgba(255,240,200,0.95)');
    ctx.strokeStyle = grad;
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.moveTo(tx, ty);
    ctx.lineTo(x, y);
    ctx.stroke();
    if (k >= 1) {
      m.star.pulse = 1;
      m.star.ring = 1;
      meteors.splice(i, 1);
    }
  }
}

function drawBubbles(now) {
  ctx.font = `500 29px ${SANS}`;
  ctx.textAlign = 'left';
  ctx.textBaseline = 'middle';
  const placed = [];
  for (let i = bubbles.length - 1; i >= 0; i--) {
    const b = bubbles[i];
    const age = (now - b.born) / 1000;
    if (age > 6 || !stars.has(b.id)) {
      bubbles.splice(i, 1);
      continue;
    }
    const star = stars.get(b.id);
    if (!star.lit) continue;
    const p = posOf(star);
    const w = Math.min(ctx.measureText(b.text).width + 40, 760);
    const h = 58;
    const x = Math.min(Math.max(p.x - w / 2, 40), W - w - 40);
    let y = p.y - radiusOf(star) - h - 14;
    // Đẩy bong bóng lên nếu đè lên bong bóng khác.
    for (const o of placed) if (x < o.x + o.w && x + w > o.x && y < o.y + o.h + 6 && y + h + 6 > o.y) y = o.y - h - 8;
    placed.push({ x, y, w, h });
    ctx.globalAlpha = Math.min(1, age * 4, (6 - age) * 2);
    ctx.fillStyle = 'rgba(16, 24, 48, 0.86)';
    roundRect(ctx, x, y, w, h, 22);
    ctx.fill();
    ctx.strokeStyle = 'rgba(190, 210, 255, 0.4)';
    ctx.lineWidth = 1.5;
    ctx.stroke();
    ctx.fillStyle = '#fff';
    ctx.fillText(b.text, x + 20, y + h / 2 + 1, w - 40);
    ctx.globalAlpha = 1;
  }
}

function drawHill(now) {
  ctx.drawImage(hill, 0, 0);
  const flicker = 0.9 + 0.1 * Math.sin(now / 110) * Math.sin(now / 270);
  ctx.globalCompositeOperation = 'lighter';
  const r = 120 * flicker;
  ctx.drawImage(lanternSprite, LANTERN.x - r, LANTERN.y - r, r * 2, r * 2);
  ctx.globalCompositeOperation = 'source-over';
}

function drawHud() {
  ctx.textAlign = 'center';
  ctx.textBaseline = 'alphabetic';
  ctx.fillStyle = '#f4f6ff';
  ctx.shadowColor = 'rgba(0,0,0,0.8)';
  ctx.shadowBlur = 14;
  ctx.font = `italic 56px ${SERIF}`;
  ctx.fillText('Khi trời đủ tối,', W / 2, 225);
  ctx.fillText('bạn mới thấy những vì sao', W / 2, 295);
  ctx.shadowBlur = 0;

  ctx.font = `500 28px ${SANS}`;
  ctx.fillStyle = '#b9c6e6';
  const count = viewers ? `${stars.size} vì sao · ${viewers} người đang xem` : `${stars.size} vì sao đêm nay`;
  ctx.fillText(count, W / 2, 350);

  if (top3.length) {
    ctx.font = `600 29px ${SANS}`;
    ctx.fillStyle = '#ffe9a8';
    const names = top3.map((s, i) => `${i + 1}. ${s.name}`).join('    ');
    ctx.fillText(`✦  ${names}`, W / 2, 410, W - 120);
  }

  if (caption) {
    ctx.font = `500 38px ${SERIF}`;
    const lines = wrap(caption.text, 880);
    const lineH = 52;
    const top = 1185;
    ctx.fillStyle = 'rgba(3, 5, 14, 0.62)';
    roundRect(ctx, 70, top - 46, W - 140, lines.length * lineH + 30, 20);
    ctx.fill();
    ctx.fillStyle = '#fff';
    lines.forEach((line, i) => ctx.fillText(line, W / 2, top + i * lineH));
  }

  ctx.font = `500 27px ${SANS}`;
  ctx.fillStyle = '#8fa0c8';
  ctx.fillText('Bình luận một chữ để thắp ngôi sao của bạn', W / 2, 1460);

  // TikTok che góc trên, nên nhãn trạng thái nằm dưới tiêu đề và chỉ hiện khi cần chú ý.
  const label = mode === 'sim' ? 'GIẢ LẬP · KHÔNG PHÁT CẢNH NÀY LÊN SÓNG' : status.startsWith('đã nối') ? '' : status.toUpperCase();
  if (label) {
    ctx.font = `700 24px ${SANS}`;
    ctx.fillStyle = '#ff9d8a';
    ctx.fillText(label, W / 2, 140);
  }
}

let last = performance.now();
function frame(now) {
  const dt = Math.min((now - last) / 1000, 0.1);
  last = now;
  drawSky(now);
  drawLinks();
  drawFlights(dt);
  drawMeteors(dt);
  drawStars(now, dt);
  drawHill(now);
  drawBubbles(now);
  drawHud();
  requestAnimationFrame(frame);
}
requestAnimationFrame(frame);

// Giọng đọc: phát từng câu, xong câu nào báo lại cho server câu đó.
const unlock = document.getElementById('unlock');
const speech = [];
let speaking = false;
let socket = null;

function nextSpeech() {
  if (speaking || !speech.length) return;
  speaking = true;
  const item = speech.shift();
  caption = { text: item.text };
  const finish = () => {
    speaking = false;
    caption = null;
    socket?.readyState === 1 && socket.send('played');
    setTimeout(nextSpeech, 700);
  };
  const silent = () => setTimeout(finish, Math.max(3000, item.text.length * 70));
  if (!item.url) return silent();
  const audio = new Audio(item.url);
  audio.onended = finish;
  audio.onerror = silent;
  audio.play().catch(() => {
    unlock.style.display = 'flex';
    silent();
  });
}

// Nền âm thanh rất nhỏ tạo ngay trong trình duyệt, để không phải lo bản quyền nhạc. Phím M để tắt.
let pad = null;
function startPad() {
  if (pad) return;
  const ac = new AudioContext();
  const master = ac.createGain();
  master.gain.value = 0.05;
  master.connect(ac.destination);
  for (const [freq, detune] of [[110, -4], [164.81, 3], [246.94, -2]]) {
    const osc = ac.createOscillator();
    const gain = ac.createGain();
    const lfo = ac.createOscillator();
    const depth = ac.createGain();
    osc.frequency.value = freq;
    osc.detune.value = detune;
    gain.gain.value = 0.5;
    lfo.frequency.value = random(0.03, 0.08);
    depth.gain.value = 0.3;
    lfo.connect(depth).connect(gain.gain);
    osc.connect(gain).connect(master);
    osc.start();
    lfo.start();
  }
  pad = ac;
}
unlock.onclick = () => {
  unlock.style.display = 'none';
  startPad();
};
addEventListener('pointerdown', startPad, { once: true });
addEventListener('keydown', (e) => {
  if (e.key.toLowerCase() === 'm' && pad) pad.state === 'running' ? pad.suspend() : pad.resume();
});

function onMessage(msg) {
  const star = stars.get(msg.id);
  switch (msg.type) {
    case 'snapshot':
      stars.clear();
      msg.stars.forEach((s) => addStar(s, false));
      viewers = msg.viewers;
      mode = msg.mode;
      status = msg.status;
      break;
    case 'status':
      status = msg.status;
      break;
    case 'viewers':
      viewers = msg.count;
      break;
    case 'star': {
      const known = stars.get(msg.star.id);
      if (known) {
        Object.assign(known, msg.star);
        relink();
      } else addStar(msg.star, true);
      break;
    }
    case 'remove':
      stars.delete(msg.id);
      relink();
      break;
    case 'pulse':
      if (star) star.pulse = 1;
      break;
    case 'comment':
      for (let i = bubbles.length - 1; i >= 0; i--) if (bubbles[i].id === msg.id) bubbles.splice(i, 1);
      bubbles.push({ id: msg.id, text: msg.text, born: performance.now() });
      if (bubbles.length > 6) bubbles.shift();
      if (star) star.pulse = 1;
      break;
    case 'gift':
      if (star) {
        const to = posOf(star);
        const fromLeft = to.x > W / 2;
        meteors.push({ star, t: 0, x0: fromLeft ? to.x - 620 : to.x + 620, y0: to.y - 420, x1: to.x, y1: to.y });
      }
      break;
    case 'voice':
      speech.push(msg);
      nextSpeech();
      break;
  }
}

function connect() {
  socket = new WebSocket(`ws://${location.host}/ws`);
  socket.onmessage = (e) => onMessage(JSON.parse(e.data));
  socket.onclose = () => setTimeout(connect, 2000);
}
connect();
