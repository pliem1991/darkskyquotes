// Hàng đợi giọng đọc: tạo mp3 bằng VieNeu rồi báo cho cảnh phát lần lượt từng câu.
import { spawn } from 'node:child_process';
import { createHash } from 'node:crypto';
import { existsSync, mkdirSync } from 'node:fs';
import { createInterface } from 'node:readline';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const MAX_QUEUE = 6;
const MAX_IN_FLIGHT = 2;
const PLAY_TIMEOUT = 30_000;

export class Voice {
  constructor({ cacheDir, enabled, broadcast, hasClients }) {
    this.cacheDir = cacheDir;
    this.enabled = enabled;
    this.broadcast = broadcast;
    this.hasClients = hasClients;
    this.queue = [];
    this.waiting = new Map();
    this.inFlight = 0;
    this.busy = false;
    this.lastSpoke = Date.now();
    this.nextId = 1;
    mkdirSync(cacheDir, { recursive: true });
    if (enabled) this.#startWorker();
  }

  get quiet() {
    return !this.queue.length && !this.inFlight && !this.busy;
  }

  say(text, { priority = 0, ttl = 30_000, onlyIfQuiet = false } = {}) {
    if (!this.hasClients() || (onlyIfQuiet && !this.quiet)) return;
    this.queue.push({ text, priority, expires: Date.now() + ttl });
    this.queue.sort((a, b) => b.priority - a.priority);
    this.queue.length = Math.min(this.queue.length, MAX_QUEUE);
    this.#pump();
  }

  // Cảnh báo đã đọc xong một câu.
  played() {
    this.inFlight = Math.max(0, this.inFlight - 1);
    this.lastSpoke = Date.now();
    this.#pump();
  }

  async #pump() {
    if (this.busy || this.inFlight >= MAX_IN_FLIGHT) return;
    const item = this.queue.shift();
    if (!item) return;
    if (item.expires < Date.now() || !this.hasClients()) return this.#pump();
    this.busy = true;
    let url = null;
    try {
      if (this.enabled) url = await this.#synth(item.text);
    } catch (err) {
      console.error('Lỗi giọng đọc:', err.message);
    }
    this.busy = false;
    this.inFlight++;
    let settled = false;
    const done = () => {
      if (settled) return;
      settled = true;
      clearTimeout(timer);
      this.onPlayed = this.onPlayed?.filter((f) => f !== done);
      this.played();
    };
    const timer = setTimeout(done, PLAY_TIMEOUT);
    (this.onPlayed ??= []).push(done);
    this.broadcast({ type: 'voice', url, text: item.text });
    this.#pump();
  }

  // Cảnh gọi sau mỗi câu; câu cũ nhất đang chờ được đánh dấu xong.
  ack() {
    this.onPlayed?.[0]?.();
  }

  #synth(text) {
    const name = `${createHash('sha1').update(text).digest('hex').slice(0, 16)}.mp3`;
    const out = path.join(this.cacheDir, name);
    const url = `/voice/${name}`;
    if (existsSync(out)) return Promise.resolve(url);
    if (!this.worker) return Promise.resolve(null);
    const id = this.nextId++;
    return new Promise((resolve, reject) => {
      this.waiting.set(id, { resolve: () => resolve(url), reject });
      this.worker.stdin.write(`${JSON.stringify({ id, text, out })}\n`);
    });
  }

  #startWorker() {
    const script = fileURLToPath(new URL('./tts_worker.py', import.meta.url));
    const worker = spawn('python', [script], {
      env: { ...process.env, PYTHONUTF8: '1', PYTHONIOENCODING: 'utf-8' },
      stdio: ['pipe', 'pipe', 'inherit'],
    });
    this.worker = worker;
    createInterface({ input: worker.stdout }).on('line', (line) => {
      if (!line.startsWith('@@')) return;
      const msg = JSON.parse(line.slice(2));
      if (msg.ready) return console.log('Giọng đọc đã sẵn sàng.');
      const job = this.waiting.get(msg.id);
      this.waiting.delete(msg.id);
      if (msg.error) job?.reject(new Error(msg.error));
      else job?.resolve();
    });
    const fail = (why) => {
      console.error(`Giọng đọc dừng (${why}). Live vẫn chạy, chỉ hiện chữ.`);
      this.worker = null;
      for (const job of this.waiting.values()) job.reject(new Error(why));
      this.waiting.clear();
    };
    worker.on('error', (err) => fail(err.message));
    worker.on('exit', (code) => fail(`mã ${code}`));
    process.on('exit', () => worker.kill());
  }
}
