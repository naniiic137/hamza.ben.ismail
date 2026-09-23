// Tiny chiptune synth — every sound is generated live with WebAudio,
// so there are no audio files to download. Muted by default.

type Wave = OscillatorType;

class Chiptune {
  private ctx: AudioContext | null = null;
  private master: GainNode | null = null;
  enabled = false;
  private listeners = new Set<(on: boolean) => void>();

  constructor() {
    try {
      this.enabled = localStorage.getItem('hbi-sound') === 'on';
    } catch {
      /* storage unavailable */
    }
  }

  private ensure() {
    if (!this.ctx) {
      const Ctx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      this.ctx = new Ctx();
      this.master = this.ctx.createGain();
      this.master.gain.value = 0.18;
      this.master.connect(this.ctx.destination);
    }
    if (this.ctx.state === 'suspended') void this.ctx.resume();
    return this.ctx;
  }

  onChange(fn: (on: boolean) => void) {
    this.listeners.add(fn);
    fn(this.enabled);
  }

  toggle(force?: boolean) {
    this.enabled = force ?? !this.enabled;
    try {
      localStorage.setItem('hbi-sound', this.enabled ? 'on' : 'off');
    } catch {
      /* ignore */
    }
    this.listeners.forEach((fn) => fn(this.enabled));
    if (this.enabled) this.coin();
  }

  private tone(freq: number, dur: number, type: Wave = 'square', vol = 0.5, slideTo?: number, delay = 0) {
    if (!this.enabled) return;
    const ctx = this.ensure();
    const t = ctx.currentTime + delay;
    const osc = ctx.createOscillator();
    const g = ctx.createGain();
    osc.type = type;
    osc.frequency.setValueAtTime(freq, t);
    if (slideTo) osc.frequency.exponentialRampToValueAtTime(slideTo, t + dur);
    g.gain.setValueAtTime(vol, t);
    g.gain.exponentialRampToValueAtTime(0.001, t + dur);
    osc.connect(g).connect(this.master!);
    osc.start(t);
    osc.stop(t + dur + 0.02);
  }

  private noise(dur: number, vol = 0.4) {
    if (!this.enabled) return;
    const ctx = this.ensure();
    const len = Math.floor(ctx.sampleRate * dur);
    const buf = ctx.createBuffer(1, len, ctx.sampleRate);
    const d = buf.getChannelData(0);
    for (let i = 0; i < len; i++) d[i] = (Math.random() * 2 - 1) * (1 - i / len);
    const src = ctx.createBufferSource();
    const g = ctx.createGain();
    g.gain.value = vol;
    src.buffer = buf;
    src.connect(g).connect(this.master!);
    src.start();
  }

  hover() { this.tone(1320, 0.04, 'square', 0.12); }
  click() { this.tone(660, 0.06, 'square', 0.3); this.tone(990, 0.08, 'square', 0.25, undefined, 0.05); }
  coin() { this.tone(988, 0.08, 'square', 0.3); this.tone(1319, 0.3, 'square', 0.3, undefined, 0.08); }
  start() {
    [523, 659, 784, 1047].forEach((f, i) => this.tone(f, 0.12, 'square', 0.3, undefined, i * 0.08));
  }
  type() { this.tone(200 + Math.random() * 120, 0.02, 'square', 0.08); }
  laser() { this.tone(1400, 0.12, 'square', 0.18, 220); }
  boom() { this.noise(0.25, 0.5); this.tone(120, 0.25, 'triangle', 0.4, 40); }
  hurt() { this.tone(300, 0.3, 'sawtooth', 0.3, 60); this.noise(0.3, 0.3); }
  powerup() { [440, 554, 659, 880, 1109].forEach((f, i) => this.tone(f, 0.07, 'square', 0.25, undefined, i * 0.05)); }
  error() { this.tone(160, 0.18, 'square', 0.3); this.tone(120, 0.25, 'square', 0.3, undefined, 0.15); }
}

export const sfx = new Chiptune();
