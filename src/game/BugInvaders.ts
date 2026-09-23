// BUG INVADERS — a tiny arcade shooter hidden in the portfolio.
// Rendered on a low-res canvas and scaled up with nearest-neighbour.

import { sfx } from '../ui/audio';
import { makeSprite, type Sprite } from '../ui/pixels';

/** Playfield sizes in game pixels: wide screens get 4:3, tall phone screens a portrait field. */
const LANDSCAPE = { w: 256, h: 192 };
const PORTRAIT = { w: 144, h: 232 };
/** Fixed simulation step (s): the game runs at the same speed whatever the frame rate. */
const STEP = 1 / 120;
/** Longest frame gap that is simulated (s); anything longer (tab switch, hitch) is dropped. */
const MAX_FRAME = 0.25;

/** Touch-first device: show touch wording instead of keyboard hints. */
export const isTouchUi = () => window.matchMedia('(hover: none), (pointer: coarse)').matches;

const SHIP = ['...#...', '..###..', '..#.#..', '.#####.', '###.###', '#.#.#.#'];

// 3x5 pixel font for the HUD
const FONT: Record<string, string> = {
  '0': '111101101101111', '1': '010110010010111', '2': '111001111100111', '3': '111001111001111',
  '4': '101101111001001', '5': '111100111001111', '6': '111100111101111', '7': '111001010010010',
  '8': '111101111101111', '9': '111101111001111', A: '010101111101101', B: '110101110101110',
  C: '011100100100011', D: '110101101101110', E: '111100110100111', F: '111100110100100',
  G: '011100101101011', H: '101101111101101', I: '111010010010111', K: '101101110101101',
  L: '100100100100111', M: '101111111101101', N: '110101101101101', O: '010101101101010',
  P: '110101110100100', R: '110101110101101', S: '011100010001110', T: '111010010010010',
  U: '101101101101111', V: '101101101101010', W: '101101111111101', X: '101101010101101',
  Y: '101101010010010', ' ': '000000000000000', ':': '000010000010000', '-': '000000111000000',
  '!': '010010010000010', '.': '000000000000010',
};

interface Bug { x: number; y: number; s: Sprite; hp: number; color: string; }
interface Shot { x: number; y: number; vy: number; enemy: boolean; }
interface Particle { x: number; y: number; vx: number; vy: number; life: number; color: string; }

const BUG_COLORS = ['#3fd0f0', '#ffd97a', '#ff6f91', '#a8f06b', '#c552b0'];
const BUG_NAMES = ['NULLPTR', 'SEGFAULT', 'RACE', 'OFFBY1', 'MEMLEAK', 'DEADLOCK', 'NAN', 'CORS', 'UNDEFINED', 'OVERFLOW'];

export class BugInvaders {
  private ctx: CanvasRenderingContext2D;
  private raf = 0;
  private last = 0;
  private acc = 0;
  private W = LANDSCAPE.w;
  private H = LANDSCAPE.h;
  private portrait = false;
  private touchUi = false;
  private cols = 8;
  private keys = new Set<string>();
  private px = LANDSCAPE.w / 2;
  private lives = 3;
  private score = 0;
  private hi = 0;
  private level = 1;
  private bugs: Bug[] = [];
  private shots: Shot[] = [];
  private parts: Particle[] = [];
  private stars: { x: number; y: number; s: number }[] = [];
  private dir = 1;
  private cooldown = 0;
  private invuln = 0;
  private state: 'title' | 'play' | 'over' | 'paused' | 'level' = 'title';
  private stateT = 0;
  private touchX: number | null = null;
  private onExit: () => void;
  /** On-screen buttons ([data-key]) that hold a key down while pressed. */
  private pad: HTMLElement[];
  /** The box the canvas is scaled to fit. */
  private stage: HTMLElement;

  constructor(private canvas: HTMLCanvasElement, onExit: () => void, opts: { stage?: HTMLElement; pad?: HTMLElement[] } = {}) {
    this.onExit = onExit;
    this.stage = opts.stage ?? canvas.parentElement!;
    this.pad = opts.pad ?? [];
    this.ctx = canvas.getContext('2d')!;
    this.layout();
    try {
      this.hi = Number(localStorage.getItem('hbi-hi') || 0);
    } catch {
      /* ignore */
    }
  }

  /**
   * Picks the playfield shape for the screen (`reshape`, only between games)
   * and scales the canvas to fill the stage.
   */
  private layout(reshape = true) {
    this.touchUi = isTouchUi();
    // Content box of the stage (its padding leaves room for the canvas frame).
    const cs = getComputedStyle(this.stage);
    const box = {
      width: this.stage.clientWidth - parseFloat(cs.paddingLeft) - parseFloat(cs.paddingRight),
      height: this.stage.clientHeight - parseFloat(cs.paddingTop) - parseFloat(cs.paddingBottom),
    };
    if (reshape) {
      const portrait = box.width > 0 && box.width / Math.max(1, box.height) < 0.9;
      const size = portrait ? PORTRAIT : LANDSCAPE;
      if (!this.stars.length || portrait !== this.portrait) {
        this.portrait = portrait;
        this.W = size.w;
        this.H = size.h;
        this.cols = portrait ? 6 : 8;
        this.canvas.width = this.W;
        this.canvas.height = this.H;
        this.stars = [];
        for (let i = 0; i < 70; i++) this.stars.push({ x: Math.random() * this.W, y: Math.random() * this.H, s: 0.2 + Math.random() * 1.2 });
      }
    }
    // Resizing a canvas resets its context state.
    this.ctx.imageSmoothingEnabled = false;
    if (box.width > 0 && box.height > 0) {
      // On 1x screens snap to a whole zoom so every game pixel is the same size;
      // on high-DPI phones filling the screen matters more than exact pixels.
      const dpr = window.devicePixelRatio || 1;
      const fit = Math.min(box.width / this.W, box.height / this.H);
      const scale = dpr < 1.5 && fit >= 1 ? Math.floor(fit) : fit;
      this.canvas.style.width = `${Math.floor(this.W * scale)}px`;
      this.canvas.style.height = `${Math.floor(this.H * scale)}px`;
    }
  }

  private onResize = () => this.layout(this.state === 'title' || this.state === 'over');

  start() {
    this.state = 'title';
    this.stateT = 0;
    this.layout();
    window.addEventListener('keydown', this.onKey);
    window.addEventListener('keyup', this.onKeyUp);
    window.addEventListener('resize', this.onResize);
    document.addEventListener('visibilitychange', this.onHidden);
    this.canvas.addEventListener('pointerdown', this.onPointer);
    this.canvas.addEventListener('pointermove', this.onPointer);
    this.canvas.addEventListener('pointerup', this.onPointerUp);
    this.canvas.addEventListener('pointercancel', this.onPointerUp);
    for (const b of this.pad) {
      b.addEventListener('pointerdown', this.onPadDown);
      b.addEventListener('pointerup', this.onPadUp);
      b.addEventListener('pointercancel', this.onPadUp);
      b.addEventListener('lostpointercapture', this.onPadUp);
      b.addEventListener('contextmenu', this.noMenu);
    }
    this.last = performance.now();
    this.acc = 0;
    this.raf = requestAnimationFrame(this.frame);
  }

  stop() {
    cancelAnimationFrame(this.raf);
    window.removeEventListener('keydown', this.onKey);
    window.removeEventListener('keyup', this.onKeyUp);
    window.removeEventListener('resize', this.onResize);
    document.removeEventListener('visibilitychange', this.onHidden);
    this.canvas.removeEventListener('pointerdown', this.onPointer);
    this.canvas.removeEventListener('pointermove', this.onPointer);
    this.canvas.removeEventListener('pointerup', this.onPointerUp);
    this.canvas.removeEventListener('pointercancel', this.onPointerUp);
    for (const b of this.pad) {
      b.removeEventListener('pointerdown', this.onPadDown);
      b.removeEventListener('pointerup', this.onPadUp);
      b.removeEventListener('pointercancel', this.onPadUp);
      b.removeEventListener('lostpointercapture', this.onPadUp);
      b.removeEventListener('contextmenu', this.noMenu);
      b.classList.remove('is-down');
    }
    this.keys.clear();
    this.touchX = null;
  }

  private onHidden = () => {
    if (document.hidden && this.state === 'play') this.state = 'paused';
  };

  private noMenu = (e: Event) => e.preventDefault();

  // On-screen pad: a button holds its key down for as long as the finger stays on it.
  private onPadDown = (e: PointerEvent) => {
    const b = e.currentTarget as HTMLElement;
    e.preventDefault();
    try {
      b.setPointerCapture(e.pointerId);
    } catch {
      /* synthetic events have no capturable pointer */
    }
    b.classList.add('is-down');
    if (this.state === 'title' || this.state === 'over') return this.newGame();
    if (this.state === 'paused') this.state = 'play';
    this.keys.add(b.dataset.key!);
  };
  private onPadUp = (e: Event) => {
    const b = e.currentTarget as HTMLElement;
    b.classList.remove('is-down');
    this.keys.delete(b.dataset.key!);
  };

  private onKey = (e: KeyboardEvent) => {
    const k = e.key.toLowerCase();
    if (k === 'escape') return this.onExit();
    // Enter / Space on a focused button (EXIT, touch pad) activate the button, not the game.
    if ((k === 'enter' || k === ' ') && (e.target as HTMLElement | null)?.closest?.('button')) return;
    if (['arrowleft', 'arrowright', ' ', 'a', 'd', 'arrowup', 'arrowdown'].includes(k)) e.preventDefault();
    if (k === 'p' && (this.state === 'play' || this.state === 'paused')) {
      this.state = this.state === 'play' ? 'paused' : 'play';
      return;
    }
    if ((k === ' ' || k === 'enter') && (this.state === 'title' || this.state === 'over')) return this.newGame();
    this.keys.add(k);
  };
  private onKeyUp = (e: KeyboardEvent) => this.keys.delete(e.key.toLowerCase());

  private onPointer = (e: PointerEvent) => {
    // steer + fire only while a finger / mouse button is held down
    if (e.type === 'pointermove' && e.buttons === 0) return;
    const r = this.canvas.getBoundingClientRect();
    this.touchX = ((e.clientX - r.left) / r.width) * this.W;
    if (e.type === 'pointerdown') {
      if (this.state === 'title' || this.state === 'over') this.newGame();
      else if (this.state === 'paused') this.state = 'play';
    }
  };
  private onPointerUp = () => {
    this.touchX = null;
  };

  private newGame() {
    this.layout();
    sfx.start();
    this.lives = 3;
    this.score = 0;
    this.level = 1;
    this.shots = [];
    this.parts = [];
    this.px = this.W / 2;
    this.spawnWave();
    this.state = 'play';
  }

  private spawnWave() {
    this.bugs = [];
    const cols = this.cols;
    const gap = this.portrait ? 20 : 26;
    const x0 = this.portrait ? Math.round((this.W - ((cols - 1) * gap + 11)) / 2) : 24;
    const rows = Math.min(3 + Math.floor(this.level / 2), 5);
    for (let r = 0; r < rows; r++)
      for (let c = 0; c < cols; c++) {
        const name = BUG_NAMES[(r * cols + c + this.level * 3) % BUG_NAMES.length] + r + c + this.level;
        this.bugs.push({ x: x0 + c * gap, y: 22 + r * 16, s: makeSprite(name), hp: r === 0 && this.level > 2 ? 2 : 1, color: BUG_COLORS[r % BUG_COLORS.length] });
      }
    this.dir = 1;
  }

  private burst(x: number, y: number, color: string, n = 12) {
    for (let i = 0; i < n; i++) {
      const a = Math.random() * Math.PI * 2;
      const s = 20 + Math.random() * 60;
      this.parts.push({ x, y, vx: Math.cos(a) * s, vy: Math.sin(a) * s, life: 0.4 + Math.random() * 0.4, color });
    }
  }

  /**
   * Fixed-step loop: real elapsed time goes into an accumulator and the game
   * advances in constant STEP slices, so a slow device skips frames instead of
   * playing in slow motion.
   */
  private frame = (now: number) => {
    this.acc += Math.max(0, Math.min(MAX_FRAME, (now - this.last) / 1000));
    this.last = now;
    while (this.acc >= STEP) {
      this.step(STEP);
      this.acc -= STEP;
    }
    this.draw();
    this.raf = requestAnimationFrame(this.frame);
  };

  private step(dt: number) {
    this.stateT += dt;
    if (this.state === 'play') this.update(dt);
    else if (this.state === 'level' && this.stateT > 1.4) {
      this.state = 'play';
      this.spawnWave();
    }
  }

  private update(dt: number) {
    const { W, H } = this;
    // stars
    for (const s of this.stars) {
      s.y += s.s * 20 * dt;
      if (s.y > H) (s.y = 0), (s.x = Math.random() * W);
    }
    // ship
    const speed = this.portrait ? 105 : 120;
    if (this.keys.has('arrowleft') || this.keys.has('a')) this.px -= speed * dt;
    if (this.keys.has('arrowright') || this.keys.has('d')) this.px += speed * dt;
    if (this.touchX !== null) this.px += Math.sign(this.touchX - this.px) * Math.min(Math.abs(this.touchX - this.px), speed * 1.4 * dt);
    this.px = Math.max(6, Math.min(W - 6, this.px));
    this.cooldown -= dt;
    this.invuln -= dt;
    const firing = this.keys.has(' ') || this.keys.has('arrowup') || this.keys.has('w') || this.touchX !== null;
    if (firing && this.cooldown <= 0) {
      this.shots.push({ x: this.px, y: H - 20, vy: -190, enemy: false });
      this.cooldown = 0.28;
      sfx.laser();
    }

    // bugs march — a narrow (portrait) field has fewer columns, so count and
    // speed are scaled to keep the same pace
    const count = this.bugs.length * (8 / this.cols);
    const march = (14 + this.level * 5 + (40 - count) * 0.8) * (W / LANDSCAPE.w) * dt * this.dir;
    let edge = false;
    for (const b of this.bugs) {
      b.x += march;
      if (b.x < 4 || b.x > W - 15) edge = true;
    }
    if (edge) {
      this.dir *= -1;
      for (const b of this.bugs) {
        b.y += 6;
        b.x += march * -1.5;
      }
    }
    // bug fire
    if (this.bugs.length && Math.random() < dt * (0.8 + this.level * 0.35)) {
      const b = this.bugs[(Math.random() * this.bugs.length) | 0];
      this.shots.push({ x: b.x + 5, y: b.y + 9, vy: 70 + this.level * 12, enemy: true });
    }

    // shots
    for (let i = this.shots.length - 1; i >= 0; i--) {
      const s = this.shots[i];
      s.y += s.vy * dt;
      let hit = false;
      if (!s.enemy) {
        for (let j = this.bugs.length - 1; j >= 0; j--) {
          const b = this.bugs[j];
          if (s.x >= b.x && s.x <= b.x + 11 && s.y >= b.y && s.y <= b.y + 9) {
            hit = true;
            b.hp--;
            if (b.hp <= 0) {
              this.bugs.splice(j, 1);
              this.burst(b.x + 5, b.y + 4, b.color);
              this.score += 10 * this.level;
              sfx.boom();
            } else sfx.hover();
            break;
          }
        }
      } else if (this.invuln <= 0 && Math.abs(s.x - this.px) < 5 && s.y > H - 18 && s.y < H - 8) {
        hit = true;
        this.playerHit();
      }
      if (hit || s.y < -4 || s.y > H + 4) this.shots.splice(i, 1);
    }
    // bugs reaching the ship
    if (this.bugs.some((b) => b.y > H - 30)) {
      this.lives = 0;
      this.playerHit();
    }

    for (let i = this.parts.length - 1; i >= 0; i--) {
      const p = this.parts[i];
      p.x += p.vx * dt;
      p.y += p.vy * dt;
      p.life -= dt;
      if (p.life <= 0) this.parts.splice(i, 1);
    }

    if (!this.bugs.length && this.state === 'play') {
      this.level++;
      this.state = 'level';
      this.stateT = 0;
      this.shots = [];
      sfx.powerup();
    }
  }

  private playerHit() {
    this.lives = Math.max(0, this.lives - 1);
    this.burst(this.px, this.H - 14, '#ff6f91', 24);
    this.invuln = 1.5;
    sfx.hurt();
    if (this.lives <= 0) {
      this.state = 'over';
      this.stateT = 0;
      if (this.score > this.hi) {
        this.hi = this.score;
        try {
          localStorage.setItem('hbi-hi', String(this.hi));
        } catch {
          /* ignore */
        }
      }
    }
  }

  // --------------------------------------------------------------- drawing

  private text(str: string, x: number, y: number, color = '#f2f0ff', scale = 1, center = false) {
    const ctx = this.ctx;
    const w = str.length * 4 * scale - scale;
    let cx = center ? Math.round(x - w / 2) : x;
    ctx.fillStyle = color;
    for (const ch of str.toUpperCase()) {
      const g = FONT[ch] ?? FONT[' '];
      for (let i = 0; i < 15; i++) if (g[i] === '1') ctx.fillRect(cx + (i % 3) * scale, y + Math.floor(i / 3) * scale, scale, scale);
      cx += 4 * scale;
    }
  }

  private drawRows(rows: string[] | number[][], x: number, y: number, color: string) {
    const ctx = this.ctx;
    ctx.fillStyle = color;
    rows.forEach((row, ry) => {
      for (let rx = 0; rx < row.length; rx++) {
        const v = row[rx];
        if (v === '#' || v === 1 || v === 3) ctx.fillRect(x + rx, y + ry, 1, 1);
      }
    });
  }

  private draw() {
    const { ctx, W, H } = this;
    const at = (f: number) => Math.round(H * f);
    ctx.fillStyle = '#05040c';
    ctx.fillRect(0, 0, W, H);
    for (const s of this.stars) {
      ctx.fillStyle = s.s > 1 ? '#f2f0ff' : '#4d4a66';
      ctx.fillRect(Math.floor(s.x), Math.floor(s.y), 1, 1);
    }

    if (this.state === 'title') {
      if (this.portrait) {
        this.text('BUG', W / 2, at(0.13), '#3fd0f0', 3, true);
        this.text('INVADERS', W / 2, at(0.13) + 20, '#3fd0f0', 3, true);
      } else this.text('BUG INVADERS', W / 2, at(0.23), '#3fd0f0', 3, true);
      this.text('DEFEND THE CODEBASE', W / 2, at(this.portrait ? 0.34 : 0.385), '#ffd97a', 1, true);
      const demo = makeSprite('title-bug');
      this.drawRows(demo.frames[Math.floor(this.stateT * 3) % 2], W / 2 - 5, at(0.5), '#ff6f91');
      if (Math.floor(this.stateT * 2) % 2 === 0)
        this.text(this.touchUi ? 'TAP TO START' : 'PRESS SPACE OR TAP TO START', W / 2, at(0.667), '#f2f0ff', 1, true);
      this.text(`HI ${this.hi}`, W / 2, at(0.78), '#a8f06b', 1, true);
      if (!this.touchUi) this.text('ESC TO EXIT', W / 2, at(0.917), '#4d4a66', 1, true);
      return;
    }

    const frame = Math.floor(this.stateT * 3) % 2;
    for (const b of this.bugs) this.drawRows(b.s.frames[frame], Math.round(b.x), Math.round(b.y), b.hp > 1 ? '#f2f0ff' : b.color);
    for (const s of this.shots) {
      ctx.fillStyle = s.enemy ? '#ff6f91' : '#a8f06b';
      ctx.fillRect(Math.round(s.x), Math.round(s.y), 1, 4);
    }
    for (const p of this.parts) {
      ctx.fillStyle = p.color;
      ctx.fillRect(Math.round(p.x), Math.round(p.y), 1, 1);
    }
    if (this.state !== 'over' && (this.invuln <= 0 || Math.floor(this.invuln * 10) % 2 === 0)) {
      this.drawRows(SHIP, Math.round(this.px) - 3, H - 16, '#3fd0f0');
    }
    // HUD
    ctx.fillStyle = '#181236';
    ctx.fillRect(0, 0, W, 9);
    this.text(`SCORE ${this.score}`, 3, 2, '#f2f0ff');
    this.text(`LV ${this.level}`, W / 2, 2, '#ffd97a', 1, true);
    for (let i = 0; i < this.lives; i++) this.drawRows(SHIP, W - 10 - i * 9, 1, '#ff6f91');

    if (this.state === 'level') this.text(`LEVEL ${this.level}`, W / 2, H / 2 - 8, '#a8f06b', 2, true);
    if (this.state === 'paused') {
      this.text('PAUSED', W / 2, H / 2 - 8, '#ffd97a', 2, true);
      this.text(this.touchUi ? 'TAP TO RESUME' : 'P TO RESUME', W / 2, H / 2 + 12, '#f2f0ff', 1, true);
    }
    if (this.state === 'over') {
      this.text('GAME OVER', W / 2, H / 2 - 24, '#ff6f91', 3, true);
      this.text(`SCORE ${this.score}  HI ${this.hi}`, W / 2, H / 2 + 6, '#f2f0ff', 1, true);
      if (Math.floor(this.stateT * 2) % 2 === 0)
        this.text(this.touchUi ? 'TAP TO RETRY' : 'SPACE OR TAP TO RETRY', W / 2, H / 2 + 22, '#3fd0f0', 1, true);
    }
  }
}
