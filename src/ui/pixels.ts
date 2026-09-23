// Hand-drawn pixel icons (rendered as crisp SVG, coloured via currentColor)
// and a deterministic sprite generator for project "invaders".

const ICONS: Record<string, string[]> = {
  code: ['..#..##..', '.#...#.#.', '#...#...#', '.#.#...#.', '..##..#..'],
  globe: ['...###...', '.##.#.##.', '.#..#..#.', '#########', '#...#...#', '#########', '.#..#..#.', '.##.#.##.', '...###...'],
  brain: ['....#....', '....#....', '.#######.', '#.......#', '#.##.##.#', '#.......#', '#..###..#', '.#######.', '..#...#..'],
  gear: ['...#.#...', '.#.###.#.', '..#####..', '####.####', '###...###', '####.####', '..#####..', '.#.###.#.', '...#.#...'],
  chip: ['..#.#.#..', '.#######.', '##.....##', '.#.###.#.', '##.###.##', '.#.###.#.', '##.....##', '.#######.', '..#.#.#..'],
  people: ['.##....##.', '#..#..#..#', '.##....##.', '..........', '####..####', '#..#..#..#', '#..#..#..#'],
  gamepad: ['..#######..', '.#.......#.', '#..#...#..#', '#.###.#.#.#', '#..#...#..#', '#...###...#', '.###...###.'],
  rocket: ['....#....', '...###...', '...#.#...', '..##.##..', '..#####..', '..##.##..', '..#####..', '.###.###.', '##.###.##', '#..#.#..#', '...#.#...'],
  grad: ['.....#.....', '...#####...', '.#########.', '...#####..#', '...#####..#', '....###...#', '..........#'],
  briefcase: ['...###...', '...#.#...', '#########', '#.......#', '####.####', '#.......#', '#.......#', '#########'],
  bolt: ['...###', '..###.', '.###..', '######', '..###.', '.###..', '.##...', '##....'],
  star: ['....#....', '....#....', '...###...', '#########', '.#######.', '..#####..', '..##.##..', '.##...##.', '.#.....#.'],
  mail: ['###########', '##.......##', '#.#.....#.#', '#..#...#..#', '#...#.#...#', '#....#....#', '#.........#', '###########'],
  github: ['#.......#', '##.....##', '#########', '#########', '##.###.##', '#########', '.#######.', '..#...#..', '..#...#..'],
  linkedin: ['#########', '#.......#', '#.#.....#', '#.......#', '#.#.##..#', '#.#.#.#.#', '#.#.#.#.#', '#.......#', '#########'],
  download: ['....#....', '....#....', '....#....', '..#.#.#..', '...###...', '....#....', '.........', '#.......#', '#########'],
  soundOn: ['...#.....', '..##...#.', '####.#..#', '####..#.#', '####..#.#', '####.#..#', '..##...#.', '...#.....'],
  soundOff: ['...#.....', '..##.....', '####.#.#.', '####..#..', '####.#.#.', '####.....', '..##.....', '...#.....'],
  play: ['#......', '###....', '#####..', '#######', '#####..', '###....', '#......'],
  lock: ['..###..', '.#...#.', '.#...#.', '#######', '###.###', '###.###', '#######'],
  arrow: ['...####', '.....##', '....#.#', '...#..#', '..#....', '.#.....', '#......'],
  copy: ['..######', '..#....#', '###....#', '#.#....#', '#.######', '#....#..', '######..'],
  close: ['#.....#', '.#...#.', '..#.#..', '...#...', '..#.#..', '.#...#.', '#.....#'],
  terminal: ['###########', '#.........#', '#.#.......#', '#..#......#', '#.#..###..#', '#.........#', '###########'],
  pin: ['..###..', '.#####.', '##.#.##', '.#####.', '..###..', '...#...', '...#...'],
  heart: ['.##.##.', '#######', '#######', '.#####.', '..###..', '...#...'],
};

export function icon(name: string, size = 16, cls = ''): string {
  const rows = ICONS[name];
  if (!rows) return '';
  const w = Math.max(...rows.map((r) => r.length));
  const h = rows.length;
  let rects = '';
  rows.forEach((row, y) => {
    for (let x = 0; x < row.length; x++) if (row[x] === '#') rects += `<rect x="${x}" y="${y}" width="1" height="1"/>`;
  });
  const height = Math.round((size * h) / w);
  return `<svg class="px-icon ${cls}" viewBox="0 0 ${w} ${h}" width="${size}" height="${height}" fill="currentColor" shape-rendering="crispEdges" aria-hidden="true">${rects}</svg>`;
}

// ---------------------------------------------------------------- sprites

function hash(str: string): number {
  let h = 2166136261;
  for (let i = 0; i < str.length; i++) {
    h ^= str.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

function rng(seed: number) {
  let s = seed || 1;
  return () => {
    s ^= s << 13;
    s ^= s >>> 17;
    s ^= s << 5;
    return ((s >>> 0) % 10000) / 10000;
  };
}

export interface Sprite {
  w: number;
  h: number;
  frames: number[][][]; // frame -> y -> x -> 0 empty / 1 body / 2 eye / 3 accent
}

/** A symmetric, two-frame "space invader" unique to a seed string. */
export function makeSprite(seed: string): Sprite {
  const r = rng(hash(seed));
  const w = 11;
  const h = 9;
  const half = Math.ceil(w / 2);
  const base: number[][] = [];
  for (let y = 0; y < h; y++) {
    const row: number[] = [];
    for (let x = 0; x < half; x++) {
      // denser toward the centre and middle rows
      const cx = x / (half - 1);
      const cy = 1 - Math.abs(y - h / 2) / (h / 2);
      const p = 0.18 + cx * 0.45 + cy * 0.3;
      row.push(r() < p ? 1 : 0);
    }
    base.push(row);
  }
  // guarantee a solid core + eyes
  for (let y = 2; y < 6; y++) base[y][half - 1] = 1;
  const eyeY = 2 + Math.floor(r() * 2);
  const eyeX = half - 2 - Math.floor(r() * 2);
  base[eyeY][eyeX] = 2;
  base[eyeY][Math.min(half - 1, eyeX + 1)] = base[eyeY][Math.min(half - 1, eyeX + 1)] || 1;
  if (r() < 0.6) base[0][half - 1 - Math.floor(r() * 3)] = 3; // antenna
  const mirror = (rows: number[][]) =>
    rows.map((row) => {
      const left = row.slice(0, half);
      const right = row.slice(0, w - half).reverse();
      return [...left, ...right];
    });
  const f1 = mirror(base);
  // second frame: shuffle the legs (bottom two rows)
  const alt = base.map((row) => row.slice());
  for (let y = h - 2; y < h; y++) {
    for (let x = 0; x < half; x++) alt[y][x] = base[y][x] ? 0 : r() < 0.45 ? 1 : 0;
  }
  const f2 = mirror(alt);
  return { w, h, frames: [f1, f2] };
}

export function drawSprite(
  ctx: CanvasRenderingContext2D,
  s: Sprite,
  frame: number,
  scale: number,
  colors: { body: string; eye: string; accent: string },
  ox = 0,
  oy = 0,
) {
  const f = s.frames[frame % s.frames.length];
  for (let y = 0; y < s.h; y++)
    for (let x = 0; x < s.w; x++) {
      const c = f[y][x];
      if (!c) continue;
      ctx.fillStyle = c === 2 ? colors.eye : c === 3 ? colors.accent : colors.body;
      ctx.fillRect(ox + x * scale, oy + y * scale, scale, scale);
    }
}

export const CATEGORY_COLORS = {
  web: { body: '#3fd0f0', eye: '#05040c', accent: '#ff6f91' },
  python: { body: '#ffd97a', eye: '#05040c', accent: '#3fd0f0' },
  desktop: { body: '#ff6f91', eye: '#05040c', accent: '#a8f06b' },
} as const;
