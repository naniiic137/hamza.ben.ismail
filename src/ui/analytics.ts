// Privacy-friendly visitor analytics via GoatCounter (no cookies, no personal data,
// no consent banner needed). Dashboard: https://<code>.goatcounter.com
// Set GOATCOUNTER_CODE to '' to turn analytics off.

const GOATCOUNTER_CODE = 'hamzabenismail';

interface GoatCounter {
  count: (vars: { path: string; title?: string; event?: boolean }) => void;
}
declare global {
  interface Window {
    goatcounter?: GoatCounter & { no_onload?: boolean };
  }
}

const isLocal = () => ['localhost', '127.0.0.1', ''].includes(location.hostname);
const enabled = () => !!GOATCOUNTER_CODE && !isLocal();

/** Events fired before count.js has loaded; sent once it is ready. */
const queue: { path: string; title: string }[] = [];

function send(path: string, title: string) {
  window.goatcounter!.count({ path, title, event: true });
}

function flush() {
  if (!window.goatcounter?.count) return;
  queue.splice(0).forEach((e) => send(e.path, e.title));
}

export function initAnalytics() {
  if (!enabled()) return;
  const s = document.createElement('script');
  s.async = true;
  s.src = 'https://gc.zgo.at/count.js';
  s.dataset.goatcounter = `https://${GOATCOUNTER_CODE}.goatcounter.com/count`;
  s.addEventListener('load', flush);
  document.head.appendChild(s);

  // Count clicks on anything marked with data-analytics="event-name".
  // (data-track is used by the section tracker, not analytics.)
  document.addEventListener('click', (e) => {
    const el = (e.target as HTMLElement).closest<HTMLElement>('[data-analytics]');
    if (el) track(el.dataset.analytics!);
  });
}

/** Records a named event, e.g. "cv-download-en". Safe to call before the script loads. */
export function track(name: string, title?: string) {
  if (!enabled()) return;
  if (window.goatcounter?.count) send(name, title ?? name);
  else queue.push({ path: name, title: title ?? name });
}
