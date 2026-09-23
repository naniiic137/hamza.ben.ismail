import { profile, projects } from '../data/content';
import { sfx } from './audio';
import { CATEGORY_COLORS, drawSprite, makeSprite, type Sprite } from './pixels';

export const reducedMotion = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches;

// ---------------------------------------------------------------- text

const GLYPHS = '█▓▒░<>/\\#$%&@01*+=?';

/** Decodes an element's text from random glyphs, left to right. */
export function scramble(el: HTMLElement, duration = 800) {
  const target = el.dataset.final ?? el.textContent ?? '';
  el.dataset.final = target;
  if (reducedMotion()) {
    el.textContent = target;
    return;
  }
  const start = performance.now();
  const tick = () => {
    const t = Math.min(1, (performance.now() - start) / duration);
    const reveal = Math.floor(t * target.length);
    let out = '';
    for (let i = 0; i < target.length; i++) {
      const ch = target[i];
      out += i < reveal || ch === ' ' ? ch : GLYPHS[(Math.random() * GLYPHS.length) | 0];
    }
    el.textContent = out;
    if (t < 1) requestAnimationFrame(tick);
  };
  tick();
}

/** Cycles hero roles with a typewriter effect. */
export function typeRoles(el: HTMLElement) {
  const roles = profile.roles;
  let r = 0;
  let i = roles[0].length;
  let deleting = false;
  const step = () => {
    const word = roles[r];
    if (!deleting) {
      i++;
      el.textContent = word.slice(0, i);
      if (i >= word.length) {
        deleting = true;
        return setTimeout(step, 2200);
      }
      if (i % 2 === 0) sfx.type();
      return setTimeout(step, 55);
    }
    i--;
    el.textContent = word.slice(0, i);
    if (i <= 0) {
      deleting = false;
      r = (r + 1) % roles.length;
      return setTimeout(step, 250);
    }
    return setTimeout(step, 28);
  };
  if (!reducedMotion()) setTimeout(step, 2400);
}

export function countUp(el: HTMLElement, duration = 1400) {
  const target = Number(el.dataset.count);
  const start = performance.now();
  const tick = () => {
    const t = Math.min(1, (performance.now() - start) / duration);
    const e = 1 - Math.pow(1 - t, 3);
    el.textContent = Math.round(target * e).toLocaleString('en-US');
    if (t < 1) requestAnimationFrame(tick);
  };
  tick();
}

export function fillBar(bar: HTMLElement, delay = 0) {
  const n = Number(bar.dataset.fill);
  bar.querySelectorAll('i').forEach((seg, i) => {
    if (i < n) setTimeout(() => seg.classList.add('on'), delay + i * 55);
  });
}

// ---------------------------------------------------------------- pilot portrait

const HOLO = ['#05040c', '#123166', '#18508f', '#2388d0', '#3fd0f0', '#9ff3ff', '#f2f0ff'].map((h) => [
  parseInt(h.slice(1, 3), 16),
  parseInt(h.slice(3, 5), 16),
  parseInt(h.slice(5, 7), 16),
]);
const BAYER = [0, 8, 2, 10, 12, 4, 14, 6, 3, 11, 1, 9, 15, 7, 13, 5];

/** Turns the profile photo into a dithered, holographic pixel portrait. */
export function pixelPortrait(canvas: HTMLCanvasElement, src: string) {
  const img = new Image();
  img.src = src;
  img.onload = () => {
    const W = 72;
    const H = Math.round((img.height / img.width) * W);
    canvas.width = W;
    canvas.height = H;
    const ctx = canvas.getContext('2d', { willReadFrequently: true })!;
    ctx.drawImage(img, 0, 0, W, H);
    const data = ctx.getImageData(0, 0, W, H);
    const d = data.data;
    for (let y = 0; y < H; y++)
      for (let x = 0; x < W; x++) {
        const k = (y * W + x) * 4;
        let l = (0.3 * d[k] + 0.59 * d[k + 1] + 0.11 * d[k + 2]) / 255;
        l = Math.pow(l, 0.85) * 1.12;
        l += (BAYER[(y % 4) * 4 + (x % 4)] / 16 - 0.5) * 0.16;
        const idx = Math.max(0, Math.min(HOLO.length - 1, Math.round(l * (HOLO.length - 1))));
        const c = HOLO[idx];
        // scanline darkening every other row
        const s = y % 2 ? 0.82 : 1;
        d[k] = c[0] * s;
        d[k + 1] = c[1] * s;
        d[k + 2] = c[2] * s;
      }
    ctx.putImageData(data, 0, 0);
  };
}

// ---------------------------------------------------------------- sprites

const sprites = new Map<HTMLCanvasElement, Sprite>();

export function initSprites() {
  const scale = 6;
  document.querySelectorAll<HTMLCanvasElement>('canvas[data-sprite]').forEach((c) => {
    const s = makeSprite(c.dataset.sprite!);
    c.width = s.w * scale;
    c.height = s.h * scale;
    sprites.set(c, s);
  });
  // Only redraw sprites that are on screen.
  const visible = new Set<HTMLCanvasElement>();
  const io = new IntersectionObserver(
    (entries) =>
      entries.forEach((e) => {
        const c = e.target as HTMLCanvasElement;
        if (e.isIntersecting) visible.add(c);
        else visible.delete(c);
      }),
    { rootMargin: '100px 0px' },
  );
  sprites.forEach((_s, c) => io.observe(c));

  let frame = 0;
  const drawOne = (s: Sprite, c: HTMLCanvasElement) => {
    const ctx = c.getContext('2d')!;
    ctx.clearRect(0, 0, c.width, c.height);
    const colors = CATEGORY_COLORS[c.dataset.cat as keyof typeof CATEGORY_COLORS];
    const f = c.closest('.card:hover') ? frame : Math.floor(frame / 2);
    drawSprite(ctx, s, f, scale, colors);
  };
  sprites.forEach(drawOne); // first frame for every sprite
  const draw = () => {
    if (document.hidden) return;
    visible.forEach((c) => drawOne(sprites.get(c)!, c));
    frame++;
  };
  if (!reducedMotion()) setInterval(draw, 260);
}

// ---------------------------------------------------------------- tilt

export function initTilt(root: ParentNode = document) {
  if (reducedMotion() || window.matchMedia('(hover: none)').matches) return;
  root.querySelectorAll<HTMLElement>('.card__inner').forEach((el) => {
    el.addEventListener('pointermove', (e) => {
      const r = el.getBoundingClientRect();
      const x = (e.clientX - r.left) / r.width;
      const y = (e.clientY - r.top) / r.height;
      el.style.setProperty('--rx', `${(0.5 - y) * 8}deg`);
      el.style.setProperty('--ry', `${(x - 0.5) * 10}deg`);
      el.style.setProperty('--mx', `${x * 100}%`);
      el.style.setProperty('--my', `${y * 100}%`);
    });
    el.addEventListener('pointerleave', () => {
      el.style.setProperty('--rx', '0deg');
      el.style.setProperty('--ry', '0deg');
    });
  });
}

// ---------------------------------------------------------------- sfx + misc

export function bindSfx() {
  document.addEventListener(
    'pointerover',
    (e) => {
      const t = (e.target as HTMLElement).closest('[data-sfx],[data-sfx-hover]');
      const from = (e.relatedTarget as HTMLElement | null)?.closest?.('[data-sfx],[data-sfx-hover]');
      if (t && t !== from) sfx.hover();
    },
    { passive: true },
  );
  document.addEventListener('click', (e) => {
    if ((e.target as HTMLElement).closest('[data-sfx]')) sfx.click();
  });
}

let toastTimer = 0;
export function toast(msg: string) {
  const el = document.getElementById('toast')!;
  el.textContent = msg;
  el.classList.add('is-on');
  clearTimeout(toastTimer);
  toastTimer = window.setTimeout(() => el.classList.remove('is-on'), 2400);
}

export async function copyText(text: string) {
  try {
    await navigator.clipboard.writeText(text);
  } catch {
    const ta = document.createElement('textarea');
    ta.value = text;
    ta.style.position = 'fixed';
    ta.style.opacity = '0';
    document.body.appendChild(ta);
    ta.select();
    document.execCommand('copy');
    ta.remove();
  }
  sfx.coin();
  toast(`COPIED ▸ ${text}`);
}

export function continueCountdown(el: HTMLElement) {
  let n = 9;
  setInterval(() => {
    n = n <= 0 ? 9 : n - 1;
    el.textContent = String(n);
  }, 1000);
}

export const projectById = (id: string) => projects.find((p) => p.id === id);
