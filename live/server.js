// node server.js                  chạy với người xem giả
// node server.js --user <tên>     đọc bình luận thật từ live của tài khoản đó
// node server.js --no-voice       chỉ hiện chữ, không tạo giọng đọc
import { createReadStream, existsSync, statSync } from 'node:fs';
import http from 'node:http';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { WebSocketServer } from 'ws';
import { Engine } from './engine.js';
import { startSim } from './sim.js';
import { Voice } from './voice.js';

const PORT = 4173;
const ROOT = path.dirname(fileURLToPath(import.meta.url));
const PUBLIC = path.join(ROOT, 'public');
const VOICE = path.join(ROOT, '.cache', 'voice');
const TYPES = { '.html': 'text/html; charset=utf-8', '.js': 'text/javascript; charset=utf-8', '.mp3': 'audio/mpeg' };

const args = process.argv.slice(2);
const userIndex = args.indexOf('--user');
const user = userIndex >= 0 ? args[userIndex + 1]?.replace(/^@/, '') : null;
if (userIndex >= 0 && !user) throw new Error('Thiếu tên tài khoản sau --user');
const mode = user ? 'live' : 'sim';
let status = user ? `chờ @${user} lên live` : 'giả lập';

function serveFile(res, base, rel) {
  const file = path.join(base, path.normalize(rel));
  if (!file.startsWith(base + path.sep) || !existsSync(file) || !statSync(file).isFile()) {
    res.writeHead(404).end();
    return;
  }
  res.writeHead(200, { 'Content-Type': TYPES[path.extname(file)] ?? 'application/octet-stream', 'Cache-Control': 'no-store' });
  createReadStream(file).pipe(res);
}

const server = http.createServer((req, res) => {
  const url = new URL(req.url, 'http://localhost');
  if (req.method === 'POST' && url.pathname === '/inject') {
    // Sự kiện tay từ bảng thử chỉ có ở chế độ giả lập, để không lọt người xem giả lên sóng.
    if (mode !== 'sim') return void res.writeHead(403).end();
    let body = '';
    req.on('data', (chunk) => (body += chunk));
    req.on('end', () => {
      engine.handle(JSON.parse(body));
      res.writeHead(204).end();
    });
    return;
  }
  if (url.pathname.startsWith('/voice/')) return serveFile(res, VOICE, url.pathname.slice(7));
  serveFile(res, PUBLIC, url.pathname === '/' ? 'index.html' : url.pathname.slice(1));
});

const wss = new WebSocketServer({ server, path: '/ws' });
const broadcast = (msg) => {
  const data = JSON.stringify(msg);
  for (const ws of wss.clients) if (ws.readyState === 1) ws.send(data);
};
const voice = new Voice({
  cacheDir: VOICE,
  enabled: !args.includes('--no-voice'),
  broadcast,
  hasClients: () => wss.clients.size > 0,
});
const engine = new Engine({ broadcast, voice });

wss.on('connection', (ws) => {
  ws.send(JSON.stringify({ ...engine.snapshot(), mode, status }));
  ws.on('message', () => {
    // Chỉ tính cửa sổ mở đầu tiên, để mở thêm tab không làm hàng đợi chạy nhanh hơn.
    if ([...wss.clients][0] === ws) voice.ack();
  });
});

const onStatus = (text) => {
  status = text;
  console.log(text);
  broadcast({ type: 'status', status });
};

server.listen(PORT, '127.0.0.1', async () => {
  console.log(`Cảnh: http://localhost:${PORT}/`);
  if (mode === 'sim') {
    console.log(`Bảng thử: http://localhost:${PORT}/panel.html`);
    startSim((ev) => engine.handle(ev));
  } else {
    const { startTikTok } = await import('./tiktok.js');
    startTikTok(user, (ev) => engine.handle(ev), onStatus);
  }
});
