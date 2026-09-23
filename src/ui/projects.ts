import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { projects } from '../data/content';
import { sfx } from './audio';
import { makeSprite, drawSprite, CATEGORY_COLORS, icon } from './pixels';
import { projectById, reducedMotion } from './effects';

export function initFilters() {
  const buttons = document.querySelectorAll<HTMLButtonElement>('.filter');
  const cards = document.querySelectorAll<HTMLElement>('.card');
  buttons.forEach((btn) =>
    btn.addEventListener('click', () => {
      const f = btn.dataset.filter!;
      buttons.forEach((b) => {
        const on = b === btn;
        b.classList.toggle('is-active', on);
        b.setAttribute('aria-selected', String(on));
      });
      const show: HTMLElement[] = [];
      cards.forEach((c) => {
        const visible = f === 'all' || c.dataset.cat === f;
        c.hidden = !visible;
        if (visible) show.push(c);
      });
      if (!reducedMotion()) {
        gsap.fromTo(show, { opacity: 0, y: 24, scale: 0.96 }, { opacity: 1, y: 0, scale: 1, duration: 0.45, stagger: 0.03, ease: 'steps(6)', overwrite: true });
      }
      ScrollTrigger.refresh();
    }),
  );
}

let lastFocus: HTMLElement | null = null;

export function initModal() {
  const modal = document.getElementById('modal')!;
  const body = document.getElementById('modalBody')!;
  const panel = modal.querySelector<HTMLElement>('.modal__panel')!;

  const close = () => {
    if (modal.hidden) return;
    modal.classList.remove('is-open');
    setTimeout(() => (modal.hidden = true), 200);
    document.dispatchEvent(new CustomEvent('scroll-lock', { detail: false }));
    lastFocus?.focus();
  };

  const open = (id: string) => {
    const p = projectById(id);
    if (!p) return;
    lastFocus = document.activeElement as HTMLElement;
    const idx = projects.indexOf(p);
    body.innerHTML = `
      <button type="button" class="modal__close" data-close aria-label="Close briefing">${icon('close', 12)} ESC</button>
      <p class="modal__kicker">MISSION BRIEFING · M-${String(idx + 1).padStart(2, '0')}</p>
      <div class="modal__head">
        <canvas class="modal__sprite" width="132" height="108" aria-hidden="true"></canvas>
        <div>
          <h3 id="modalTitle" class="modal__title">${p.title}</h3>
          <p class="modal__meta">SECTOR: ${p.category.toUpperCase()} · STATUS: ${p.classified ? 'CLASSIFIED' : 'OPEN SOURCE'}</p>
        </div>
      </div>
      <p class="modal__summary" id="modalSummary"></p>
      <p class="panel-label">LOADOUT</p>
      <ul class="card__tech modal__tech">${p.tech.map((t) => `<li>${t}</li>`).join('')}</ul>
      <div class="modal__actions">
        ${
          p.classified
            ? `<span class="tag tag--lock">${icon('lock', 10)} SOURCE CLASSIFIED — ASK ME FOR A DEMO</span>`
            : p.links
                .map(
                  (l, i) =>
                    `<a class="btn ${i === 0 ? 'btn--primary' : ''}" href="${l.href}" target="_blank" rel="noopener" data-sfx>${icon(l.label === 'GitHub' ? 'github' : 'arrow', 14)} ${l.label.toUpperCase()}</a>`,
                )
                .join('')
        }
      </div>`;
    const sc = body.querySelector<HTMLCanvasElement>('.modal__sprite')!;
    drawSprite(sc.getContext('2d')!, makeSprite(p.id), 0, 12, CATEGORY_COLORS[p.category]);

    // typewriter summary
    const sumEl = body.querySelector<HTMLElement>('#modalSummary')!;
    if (reducedMotion()) sumEl.textContent = p.summary;
    else {
      // time-based so it finishes quickly even when the frame rate is low
      const start = performance.now();
      let lastSound = 0;
      const tick = () => {
        const i = Math.min(p.summary.length, Math.floor((performance.now() - start) * 0.2));
        sumEl.textContent = p.summary.slice(0, i);
        if (i - lastSound >= 12) {
          lastSound = i;
          sfx.type();
        }
        if (i < p.summary.length && !modal.hidden) requestAnimationFrame(tick);
      };
      tick();
    }

    modal.hidden = false;
    requestAnimationFrame(() => modal.classList.add('is-open'));
    document.dispatchEvent(new CustomEvent('scroll-lock', { detail: true }));
    panel.focus();
  };

  document.addEventListener('click', (e) => {
    const t = e.target as HTMLElement;
    const brief = t.closest<HTMLElement>('[data-brief]');
    if (brief) return open(brief.dataset.brief!);
    // clicking the card body (not a link) also opens the briefing
    const card = t.closest<HTMLElement>('.card');
    if (card && !t.closest('a,button')) return open(card.dataset.id!);
    if (t.closest('[data-close]')) close();
  });
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') close();
    if (e.key === 'Tab' && !modal.hidden) {
      const f = panel.querySelectorAll<HTMLElement>('a,button');
      if (!f.length) return;
      const first = f[0];
      const last = f[f.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    }
  });
}
