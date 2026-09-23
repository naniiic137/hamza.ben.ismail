import '@fontsource/press-start-2p/latin-400.css';
import '@fontsource/silkscreen/latin-400.css';
import '@fontsource/silkscreen/latin-700.css';
import '@fontsource/vt323/latin-400.css';
import '@fontsource/jetbrains-mono/latin-400.css';
import '@fontsource/jetbrains-mono/latin-700.css';
import './styles/main.css';

import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Lenis from 'lenis';

import { profile, sections } from './data/content';
import { renderPage } from './ui/render';
import { runBoot } from './ui/boot';
import { sfx } from './ui/audio';
import { icon } from './ui/pixels';
import {
  bindSfx, continueCountdown, copyText, countUp, fillBar, initSprites, initTilt, pixelPortrait,
  reducedMotion, scramble, toast, typeRoles,
} from './ui/effects';
import { initFilters, initModal } from './ui/projects';
import { initTerminal } from './ui/terminal';
import { initAnalytics, track } from './ui/analytics';
import { BugInvaders } from './game/BugInvaders';
import type { SpaceScene } from './scene/SpaceScene';

gsap.registerPlugin(ScrollTrigger);

const $ = <T extends HTMLElement = HTMLElement>(sel: string) => document.querySelector<T>(sel)!;
const $$ = <T extends HTMLElement = HTMLElement>(sel: string) => Array.from(document.querySelectorAll<T>(sel));

renderPage($('#main'));

// ------------------------------------------------------------------ universe

// The page never waits for three.js: content is revealed as soon as the boot
// sequence ends and the WebGL scene fades in whenever it is ready.
let scene: SpaceScene | null = null;
let booted = false;
/** Why the scene should currently be paused (modal / mini-game covering the page). */
const scenePause: Record<string, boolean> = {};
const pauseScene = (reason: string, on: boolean) => {
  scenePause[reason] = on;
  scene?.setPaused(reason, on);
};

import('./scene/SpaceScene')
  .then(({ SpaceScene }) => {
    scene = new SpaceScene($<HTMLCanvasElement>('#space'));
    scene.setProgress(cameraProgress(window.scrollY), true);
    Object.entries(scenePause).forEach(([reason, on]) => scene!.setPaused(reason, on));
    if (booted) scene.fadeIn();
  })
  .catch((err) => {
    console.warn('WebGL unavailable, using fallback background', err);
    document.body.classList.add('no-webgl');
  });

// ------------------------------------------------------------------ smooth scroll

const lenis = new Lenis({ lerp: reducedMotion() ? 1 : 0.1, smoothWheel: !reducedMotion() });
lenis.on('scroll', ScrollTrigger.update);
gsap.ticker.add((t) => lenis.raf(t * 1000));
gsap.ticker.lagSmoothing(0);
lenis.stop();

document.addEventListener('scroll-lock', (e) => ((e as CustomEvent<boolean>).detail ? lenis.stop() : lenis.start()));

const scrollToId = (id: string) => {
  const el = document.getElementById(id);
  if (el) lenis.scrollTo(el, { offset: id === 'hero' ? 0 : -70, duration: 1.6 });
};

document.addEventListener('click', (e) => {
  const a = (e.target as HTMLElement).closest<HTMLAnchorElement>('a[href^="#"]');
  if (!a) return;
  const id = a.getAttribute('href')!.slice(1);
  if (!id || !document.getElementById(id)) return;
  e.preventDefault();
  closeMenu();
  scrollToId(id);
  history.replaceState(null, '', id === 'hero' ? location.pathname : `#${id}`);
});

// ------------------------------------------------------------------ HUD

const soundBtn = $('#soundBtn');
sfx.onChange((on) => {
  soundBtn.innerHTML = icon(on ? 'soundOn' : 'soundOff', 18);
  soundBtn.setAttribute('aria-pressed', String(on));
  soundBtn.title = on ? 'Sound on' : 'Sound off';
});
soundBtn.addEventListener('click', () => {
  sfx.toggle();
  toast(sfx.enabled ? 'SOUND ON ♪' : 'SOUND OFF');
});
$('#playIcon').innerHTML = icon('gamepad', 16);

const menuBtn = $('#menuBtn');
const closeMenu = () => {
  document.body.classList.remove('menu-open');
  menuBtn.setAttribute('aria-expanded', 'false');
};
menuBtn.addEventListener('click', () => {
  const open = document.body.classList.toggle('menu-open');
  menuBtn.setAttribute('aria-expanded', String(open));
  sfx.click();
});

bindSfx();

// ------------------------------------------------------------------ section tracking

const telSector = $('#telSector');
const telCoords = $('#telCoords');
const telVel = $('#telVel');
const trackerFill = $('#trackerFill');
let active = '';

function setActive(id: string) {
  if (id === active) return;
  active = id;
  const s = sections.find((x) => x.id === id);
  if (s) telSector.textContent = `SECTOR ${s.code} · ${s.label}`;
  $$('[data-nav]').forEach((a) => a.classList.toggle('is-active', a.dataset.nav === id));
  $$('[data-track]').forEach((li) => li.classList.toggle('is-active', li.dataset.track === id));
}

$$('[data-section]').forEach((sec) => {
  ScrollTrigger.create({
    trigger: sec,
    start: 'top 55%',
    end: 'bottom 55%',
    onToggle: (self) => self.isActive && setActive(sec.dataset.section!),
  });
});

let lastScroll = 0;
let vel = 0;
// Camera keyframes line up with section tops (sections have very different
// heights), so progress is "section index + fraction through it".
const camStops = sections.map((s) => document.getElementById(s.id)!);
let stopTops: number[] = [];
const measureStops = () => (stopTops = camStops.map((el) => el.getBoundingClientRect().top + window.scrollY));
ScrollTrigger.addEventListener('refresh', measureStops);
measureStops();

function cameraProgress(y: number) {
  const n = stopTops.length;
  for (let i = n - 1; i >= 0; i--) {
    if (y >= stopTops[i] - 1) {
      if (i === n - 1) return 1;
      const frac = (y - stopTops[i]) / Math.max(1, stopTops[i + 1] - stopTops[i]);
      return (i + Math.min(1, frac)) / (n - 1);
    }
  }
  return 0;
}

ScrollTrigger.create({
  start: 0,
  end: 'max',
  onUpdate: (self) => {
    scene?.setProgress(cameraProgress(self.scroll()));
    trackerFill.style.height = `${self.progress * 100}%`;
    document.body.classList.toggle('is-scrolled', self.scroll() > 40);
  },
});

gsap.ticker.add(() => {
  const y = window.scrollY;
  vel += (Math.abs(y - lastScroll) - vel) * 0.1;
  lastScroll = y;
  telVel.textContent = `VEL ${Math.min(0.99, vel / 60).toFixed(2)}c`;
  telCoords.textContent = `X ${(y / 10).toFixed(1).padStart(6, '0')} · Y ${(-y / 37).toFixed(1)}`;
});

// ------------------------------------------------------------------ reveals

function initReveals() {
  const reduced = reducedMotion();
  $$('.sec-head__title').forEach((el) => {
    ScrollTrigger.create({ trigger: el, start: 'top 85%', once: true, onEnter: () => scramble(el, 900) });
  });

  ScrollTrigger.batch('[data-reveal]', {
    start: 'top 88%',
    once: true,
    onEnter: (els) => {
      if (!reduced) gsap.fromTo(els, { opacity: 0, y: 40 }, { opacity: 1, y: 0, duration: 0.7, stagger: 0.08, ease: 'steps(8)' });
      else gsap.set(els, { opacity: 1 });
      els.forEach((el) => {
        el.querySelectorAll<HTMLElement>('.seg-bar').forEach((b, i) => fillBar(b, 200 + i * 60));
      });
    },
  });

  ScrollTrigger.create({ trigger: '#termScreen', start: 'top 75%', once: true, onEnter: () => term.demo(['whoami', 'neofetch']) });

  // Quest log progress line
  gsap.to('#questFill', {
    height: '100%',
    ease: 'none',
    scrollTrigger: { trigger: '#quests', start: 'top 60%', end: 'bottom 60%', scrub: true },
  });
  $$('.quest').forEach((q) =>
    ScrollTrigger.create({ trigger: q, start: 'top 60%', onEnter: () => q.classList.add('is-lit'), onLeaveBack: () => q.classList.remove('is-lit') }),
  );
}

function heroIntro() {
  const items = $$('[data-hero]');
  if (reducedMotion()) {
    gsap.set(items, { opacity: 1 });
  } else {
    gsap.fromTo(items, { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: 0.8, stagger: 0.12, ease: 'steps(10)', delay: 0.15 });
    gsap.fromTo('.hud, .tracker, .telemetry', { opacity: 0 }, { opacity: 1, duration: 0.6, delay: 0.6, ease: 'steps(6)' });
  }
  $$('.hero [data-count]').forEach((el) => setTimeout(() => countUp(el), 900));
  typeRoles($('#roleText'));
}

// ------------------------------------------------------------------ game

const gameEl = $('#game');
let game: BugInvaders | null = null;
function openGame() {
  if (!game) game = new BugInvaders($<HTMLCanvasElement>('#gameCanvas'), closeGame);
  gameEl.hidden = false;
  lenis.stop();
  pauseScene('game', true);
  sfx.coin();
  track('play-game', 'Played Bug Invaders');
  game.start();
  $<HTMLCanvasElement>('#gameCanvas').focus();
}
function closeGame() {
  game?.stop();
  gameEl.hidden = true;
  lenis.start();
  pauseScene('game', false);
}
$('#playBtn').addEventListener('click', openGame);
$('#gameExit').addEventListener('click', closeGame);
document.addEventListener('click', (e) => {
  if ((e.target as HTMLElement).closest('[data-play-game]')) openGame();
});

const KONAMI = ['arrowup', 'arrowup', 'arrowdown', 'arrowdown', 'arrowleft', 'arrowright', 'arrowleft', 'arrowright', 'b', 'a'];
let kIdx = 0;
window.addEventListener('keydown', (e) => {
  if (!gameEl.hidden) return;
  kIdx = e.key.toLowerCase() === KONAMI[kIdx] ? kIdx + 1 : e.key.toLowerCase() === KONAMI[0] ? 1 : 0;
  if (kIdx === KONAMI.length) {
    kIdx = 0;
    sfx.powerup();
    toast('★ CHEAT CODE ACCEPTED ★');
    setTimeout(openGame, 500);
  }
});

// ------------------------------------------------------------------ contact

$<HTMLFormElement>('#transmit').addEventListener('submit', (e) => {
  e.preventDefault();
  const form = e.currentTarget as HTMLFormElement;
  const data = new FormData(form);
  const name = String(data.get('name') || '').trim();
  const email = String(data.get('email') || '').trim();
  const message = String(data.get('message') || '').trim();
  let bad: HTMLElement | null = null;
  form.querySelectorAll<HTMLInputElement | HTMLTextAreaElement>('input,textarea').forEach((f) => {
    const invalid = !f.value.trim() || (f.type === 'email' && !/^\S+@\S+\.\S+$/.test(f.value));
    f.closest('.field')!.classList.toggle('is-invalid', invalid);
    if (invalid && !bad) bad = f;
  });
  if (bad) {
    sfx.error();
    toast('✕ TRANSMISSION INCOMPLETE');
    (bad as HTMLElement).focus();
    return;
  }
  const subject = encodeURIComponent(`Portfolio contact from ${name}`);
  const body = encodeURIComponent(`${message}\n\n— ${name} (${email})`);
  sfx.powerup();
  track('contact-form', 'Contact form sent');
  toast('▲ TRANSMISSION READY — OPENING MAIL');
  window.location.href = `mailto:${profile.email}?subject=${subject}&body=${body}`;
  form.reset();
});

document.addEventListener('click', (e) => {
  const c = (e.target as HTMLElement).closest<HTMLElement>('[data-copy]');
  if (c) void copyText(c.dataset.copy!);
});

// ------------------------------------------------------------------ boot

initSprites();
initTilt();
initFilters();
const modalApi = initModal();
initAnalytics();
const term = initTerminal({ playGame: openGame, scrollTo: scrollToId });
pixelPortrait($<HTMLCanvasElement>('#pilotCanvas'), `${import.meta.env.BASE_URL}portfolio.jpg`);
continueCountdown($('#continueCount'));

gsap.set('[data-reveal], [data-hero]', { opacity: 0 });

runBoot().then(() => {
  booted = true;
  document.body.classList.remove('is-booting');
  scene?.fadeIn();
  lenis.start();
  initReveals();
  heroIntro();
  ScrollTrigger.refresh();
  const caseMatch = location.hash.match(/^#case\/([\w-]+)$/);
  if (caseMatch) {
    scrollToId('projects');
    setTimeout(() => modalApi.openCase(caseMatch[1]), 900);
  } else if (location.hash && document.getElementById(location.hash.slice(1))) {
    setTimeout(() => scrollToId(location.hash.slice(1)), 300);
  }
});

console.log(
  '%c HBI-OS %c Hey, fellow dev 👾 — curious how this was built? Say hi: ' + profile.email,
  'background:#3fd0f0;color:#05040c;font-weight:bold;padding:2px 6px',
  'color:#3fd0f0',
);
