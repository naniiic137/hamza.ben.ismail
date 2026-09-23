import { projects } from '../data/content';
import { sfx } from './audio';

const LINES = [
  'HBI-OS BIOS v2.6.0  (C) 2019-' + new Date().getFullYear() + ' HAMZA BEN ISMAIL',
  'CPU: CURIOSITY-CORE @ 4.20 GHz ........ OK',
  'MEMORY TEST: 640K ..................... OK',
  'LOADING universe.bin .................. OK',
  `MOUNTING /missions (${projects.length} found) ........ OK`,
  'CALIBRATING STARFIELD ................. OK',
  'COFFEE LEVEL: CRITICAL ................ OK',
  '',
  'ALL SYSTEMS NOMINAL.',
];

/** Plays the boot log, then resolves. Any key / click / skip ends it early. */
export function runBoot(): Promise<void> {
  const boot = document.getElementById('boot')!;
  const log = document.getElementById('bootLog')!;
  const bar = document.getElementById('bootBar')!;
  const press = document.getElementById('bootPress')!;
  const skipBtn = document.getElementById('bootSkip')!;
  // The visual log is aria-hidden; assistive tech gets one "loading" and one "ready".
  const status = document.getElementById('bootStatus');
  setTimeout(() => status && !status.textContent && (status.textContent = 'Loading portfolio…'), 50);

  let seen = false;
  try {
    seen = sessionStorage.getItem('hbi-booted') === '1';
    sessionStorage.setItem('hbi-booted', '1');
  } catch {
    /* ignore */
  }
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const lineDelay = seen || reduced ? 25 : 140;

  return new Promise((resolve) => {
    let done = false;
    const timers: number[] = [];
    const finish = () => {
      if (done) return;
      done = true;
      timers.forEach(clearTimeout);
      log.textContent = LINES.join('\n');
      bar.style.width = '100%';
      sfx.start();
      boot.classList.add('is-done');
      if (status) status.textContent = 'Ready. Portfolio loaded.';
      window.removeEventListener('keydown', finish);
      boot.removeEventListener('click', finish);
      setTimeout(() => {
        boot.remove();
        resolve();
      }, 650);
    };

    LINES.forEach((line, i) => {
      timers.push(
        window.setTimeout(() => {
          log.textContent += line + '\n';
          bar.style.width = `${((i + 1) / LINES.length) * 100}%`;
        }, i * lineDelay),
      );
    });
    const total = LINES.length * lineDelay;
    timers.push(window.setTimeout(() => press.classList.add('is-on'), total));
    timers.push(window.setTimeout(finish, total + (seen || reduced ? 150 : 700)));

    window.addEventListener('keydown', finish);
    boot.addEventListener('click', finish);
    skipBtn.addEventListener('click', finish);
  });
}
