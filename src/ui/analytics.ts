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

export function initAnalytics() {
  if (!GOATCOUNTER_CODE || isLocal()) return;
  const s = document.createElement('script');
  s.async = true;
  s.src = 'https://gc.zgo.at/count.js';
  s.dataset.goatcounter = `https://${GOATCOUNTER_CODE}.goatcounter.com/count`;
  document.head.appendChild(s);

  // Count clicks on anything marked with data-track="event-name".
  document.addEventListener('click', (e) => {
    const el = (e.target as HTMLElement).closest<HTMLElement>('[data-track]');
    if (el) track(el.dataset.track!);
  });
}

/** Records a named event, e.g. "cv-download-en". Safe to call before the script loads. */
export function track(name: string, title?: string) {
  if (!GOATCOUNTER_CODE || isLocal()) return;
  const send = () => window.goatcounter?.count({ path: name, title: title ?? name, event: true });
  if (window.goatcounter?.count) send();
  else window.addEventListener('load', () => setTimeout(send, 500), { once: true });
}
