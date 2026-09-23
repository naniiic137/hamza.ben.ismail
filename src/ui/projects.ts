import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { projects } from '../data/content';
import { sfx } from './audio';
import { makeSprite, drawSprite, CATEGORY_COLORS, icon } from './pixels';
import { projectById, reducedMotion } from './effects';
import { caseStudies } from '../data/caseStudies';
import { track } from './analytics';
import { esc } from './render';

export function initFilters() {
  const buttons = document.querySelectorAll<HTMLButtonElement>('.filter');
  const cards = document.querySelectorAll<HTMLElement>('.card');
  buttons.forEach((btn) =>
    btn.addEventListener('click', () => {
      const f = btn.dataset.filter!;
      buttons.forEach((b) => {
        const on = b === btn;
        b.classList.toggle('is-active', on);
        b.setAttribute('aria-pressed', String(on));
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

const LINK_ICON: Record<string, string> = { GitHub: 'github', Live: 'play' };
const LINK_LABEL: Record<string, string> = { GitHub: 'VIEW ON GITHUB', Live: 'PLAY LIVE DEMO' };

const FOCUSABLE =
  'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), summary, iframe, [contenteditable="true"], [tabindex]:not([tabindex="-1"])';

/**
 * Makes everything except `keep` inert (unreachable by mouse, keyboard and screen
 * readers). `owner` tags what this call changed, so the briefing and the
 * mini-game can stack without undoing each other.
 */
export function setBackgroundInert(keep: HTMLElement[], on: boolean, owner = 'modal') {
  const key = `${owner}Inert`;
  document.querySelectorAll<HTMLElement>('body > *').forEach((el) => {
    if (keep.includes(el) || el.tagName === 'SCRIPT') return;
    if (on) {
      if (el.inert) return;
      el.inert = true;
      el.dataset[key] = '';
    } else if (key in el.dataset) {
      el.inert = false;
      delete el.dataset[key];
    }
  });
}

/** Moves focus back to the control that opened an overlay, if it is still on the page. */
export function restoreFocus(el: HTMLElement | null) {
  if (el && el.isConnected && el !== document.body) el.focus({ preventScroll: true });
}

/** The CLOSE / ESC label used by overlay close buttons (touch and narrow screens say CLOSE). */
export const closeLabel = `<span class="kbd-only">ESC</span><span class="touch-only">CLOSE</span>`;

export function initModal() {
  const modal = document.getElementById('modal')!;
  const body = document.getElementById('modalBody')!;
  const panel = modal.querySelector<HTMLElement>('.modal__panel')!;
  const toastEl = document.getElementById('toast')!;
  let currentId = '';
  let isOpen = false;
  let mode: 'brief' | 'case' = 'brief';
  const caseIds = () => projects.map((p) => p.id).filter((id) => caseStudies[id]);
  const asset = (src: string) => `${import.meta.env.BASE_URL}${esc(src)}`;
  const linkButtons = (links: { label: string; href: string }[]) =>
    links
      .map(
        (l, i) =>
          `<a class="btn ${i === 0 ? 'btn--primary' : 'btn--ghost'}" href="${esc(l.href)}" target="_blank" rel="noopener" data-sfx>${icon(LINK_ICON[l.label] ?? 'arrow', 14)} ${esc(LINK_LABEL[l.label] ?? l.label.toUpperCase())}</a>`,
      )
      .join('');

  /** `restore` is false when an in-page link inside the modal moves focus elsewhere. */
  const close = (restore = true) => {
    if (!isOpen) return;
    isOpen = false;
    modal.classList.remove('is-open');
    setTimeout(() => {
      if (!isOpen) modal.hidden = true;
    }, 200);
    setBackgroundInert([modal, toastEl], false);
    document.dispatchEvent(new CustomEvent('scroll-lock', { detail: false }));
    if (location.hash.startsWith('#case/')) history.replaceState(null, '', location.pathname + location.search);
    if (restore) restoreFocus(lastFocus);
  };

  /** Projects currently visible under the active filter, in page order. */
  const visibleIds = () =>
    Array.from(document.querySelectorAll<HTMLElement>('.card'))
      .filter((c) => !c.hidden)
      .map((c) => c.dataset.id!);

  const step = (dir: 1 | -1) => {
    if (mode === 'case') {
      const cids = caseIds();
      const ci = cids.indexOf(currentId);
      if (ci === -1) return;
      sfx.click();
      return renderCase(cids[(ci + dir + cids.length) % cids.length]);
    }
    const ids = visibleIds();
    const i = ids.indexOf(currentId);
    if (i === -1 || ids.length < 2) return;
    sfx.click();
    render(ids[(i + dir + ids.length) % ids.length]);
  };

  const render = (id: string) => {
    const p = projectById(id);
    if (!p) return;
    currentId = id;
    mode = 'brief';
    panel.classList.remove('is-case');
    track(`briefing/${id}`, `Briefing: ${p.title}`);
    const idx = projects.indexOf(p);
    const ids = visibleIds();
    const pos = ids.indexOf(id);
    const overview = p.overview ?? p.summary;
    const facts = [
      { label: 'SECTOR', value: p.category.toUpperCase() },
      // Public repos are "All rights reserved", so don't call them open source.
      { label: 'STATUS', value: p.classified ? 'CLASSIFIED' : 'PUBLIC REPO' },
      ...(p.facts ?? []),
    ];
    const actions = p.classified
      ? `<span class="tag tag--lock">${icon('lock', 10)} SOURCE CLASSIFIED — ASK ME FOR A DEMO</span>
         <a class="btn" href="#contact" data-close data-sfx>${icon('mail', 16)} REQUEST A DEMO</a>`
      : linkButtons(p.links);
    const caseBtn = caseStudies[id]
      ? `<button type="button" class="btn btn--case" data-case="${esc(id)}" data-sfx>${icon('terminal', 18)} READ CASE FILE</button>`
      : '';

    body.innerHTML = `
      <button type="button" class="modal__close" data-close aria-label="Close briefing">${icon('close', 12)} ${closeLabel}</button>
      <p class="modal__kicker">MISSION BRIEFING · M-${String(idx + 1).padStart(2, '0')}${pos > -1 ? ` · ${pos + 1}/${ids.length}` : ''}</p>
      <div class="modal__head">
        <canvas class="modal__sprite" width="132" height="108" aria-hidden="true"></canvas>
        <div>
          <h3 id="modalTitle" class="modal__title">${esc(p.title)}</h3>
          <p class="modal__tagline">${esc(p.summary)}</p>
        </div>
      </div>
      <dl class="modal__facts">
        ${facts.map((f) => `<div><dt>${esc(f.label)}</dt><dd>${esc(f.value)}</dd></div>`).join('')}
      </dl>
      <p class="panel-label">MISSION OVERVIEW</p>
      <p class="sr-only">${esc(overview)}</p>
      <p class="modal__summary" id="modalSummary" aria-hidden="true"></p>
      ${
        p.features?.length
          ? `<p class="panel-label">KEY FEATURES</p>
             <ul class="modal__features">${p.features.map((ft) => `<li>${esc(ft)}</li>`).join('')}</ul>`
          : ''
      }
      <p class="panel-label">LOADOUT</p>
      <ul class="card__tech modal__tech">${p.tech.map((t) => `<li>${esc(t)}</li>`).join('')}</ul>
      <div class="modal__actions">${caseBtn}${actions}</div>
      <nav class="modal__nav" aria-label="Browse missions">
        <button type="button" class="modal__step" data-step="-1" data-sfx>◀ PREV</button>
        <span class="kbd-only">← → KEYS TO BROWSE</span>
        <button type="button" class="modal__step" data-step="1" data-sfx>NEXT ▶</button>
      </nav>`;
    const sc = body.querySelector<HTMLCanvasElement>('.modal__sprite')!;
    drawSprite(sc.getContext('2d')!, makeSprite(p.id), 0, 12, CATEGORY_COLORS[p.category]);
    panel.scrollTop = 0;

    // typewriter overview — time-based so it finishes quickly even at low frame rates
    const sumEl = body.querySelector<HTMLElement>('#modalSummary')!;
    if (reducedMotion()) sumEl.textContent = overview;
    else {
      const start = performance.now();
      let lastSound = 0;
      const tick = () => {
        if (currentId !== id || !isOpen) return;
        const i = Math.min(overview.length, Math.floor((performance.now() - start) * 0.35));
        sumEl.textContent = overview.slice(0, i);
        if (i - lastSound >= 16) {
          lastSound = i;
          sfx.type();
        }
        if (i < overview.length) requestAnimationFrame(tick);
      };
      tick();
    }
  };

  /** Long-form case study, rendered in the same modal with a wider layout. */
  const renderCase = (id: string) => {
    const p = projectById(id);
    const cs = caseStudies[id];
    if (!p || !cs) return;
    currentId = id;
    mode = 'case';
    panel.classList.add('is-case');
    history.replaceState(null, '', `#case/${id}`);
    track(`case/${id}`, `Case study: ${p.title}`);
    const cids = caseIds();
    const idx = projects.indexOf(p);
    const [hero, ...rest] = cs.images;
    const links = p.classified
      ? `<a class="btn" href="#contact" data-close data-sfx>${icon('mail', 16)} REQUEST A DEMO</a>`
      : linkButtons(p.links);
    const figure = (im: { src: string; caption: string }, cls = '') =>
      `<figure class="case__fig ${cls}"><img src="${asset(im.src)}" alt="${esc(im.caption)}" loading="lazy" /><figcaption>${esc(im.caption)}</figcaption></figure>`;

    body.innerHTML = `
      <button type="button" class="modal__close" data-close aria-label="Close case study">${icon('close', 12)} ${closeLabel}</button>
      <p class="modal__kicker">CASE FILE · M-${String(idx + 1).padStart(2, '0')} · ${cids.indexOf(id) + 1}/${cids.length}</p>
      <h3 id="modalTitle" class="case__title">${esc(p.title)}</h3>
      <p class="case__pitch">${esc(cs.pitch)}</p>
      <dl class="modal__facts">${cs.numbers.map((f) => `<div><dt>${esc(f.label)}</dt><dd>${esc(f.value)}</dd></div>`).join('')}</dl>
      <div class="modal__actions case__links">${links}</div>
      ${hero ? figure(hero, 'case__fig--hero') : ''}
      <section class="case__sec">
        <p class="panel-label">THE PROBLEM</p>
        <p class="case__text">${esc(cs.problem)}</p>
      </section>
      <section class="case__sec">
        <p class="panel-label">HOW IT WORKS</p>
        <ol class="case__how">${cs.how.map((h) => `<li>${esc(h)}</li>`).join('')}</ol>
      </section>
      <section class="case__sec">
        <p class="panel-label">KEY CHALLENGES</p>
        <div class="case__challenges">
          ${cs.challenges
            .map(
              (c, i) =>
                `<article class="case__challenge"><span>${String(i + 1).padStart(2, '0')}</span><h4>${esc(c.title)}</h4><p>${esc(c.detail)}</p></article>`,
            )
            .join('')}
        </div>
      </section>
      ${rest.length ? `<section class="case__sec"><p class="panel-label">GALLERY</p><div class="case__gallery">${rest.map((im) => figure(im)).join('')}</div></section>` : ''}
      <section class="case__sec">
        <p class="panel-label">LOADOUT</p>
        <ul class="card__tech modal__tech">${p.tech.map((t) => `<li>${esc(t)}</li>`).join('')}</ul>
        ${cs.status ? `<p class="case__status">${icon('pin', 10)} ${esc(cs.status)}</p>` : ''}
      </section>
      <nav class="modal__nav" aria-label="Browse case studies">
        <button type="button" class="modal__step" data-step="-1" data-sfx>◀ PREV CASE</button>
        <button type="button" class="modal__step" data-back data-sfx>BRIEFING</button>
        <button type="button" class="modal__step" data-step="1" data-sfx>NEXT CASE ▶</button>
      </nav>`;
    panel.scrollTop = 0;
  };

  /** The card's own briefing / case-file button: where focus returns when nothing else is known. */
  const cardButton = (id: string) => document.querySelector<HTMLElement>(`.card[data-id="${CSS.escape(id)}"] .card__brief`);

  /**
   * `opener` is the control that asked for the modal; focus goes back to it on
   * close. (Clicking a button doesn't focus it in every browser, and clicking a
   * card's body focuses nothing, so document.activeElement alone isn't enough.)
   */
  const open = (id: string, asCase = false, opener?: HTMLElement | null) => {
    if (!projectById(id)) return;
    const wasOpen = isOpen;
    isOpen = true;
    if (!wasOpen) {
      const active = document.activeElement as HTMLElement | null;
      lastFocus = opener ?? (active && active !== document.body ? active : cardButton(id));
    }
    modal.hidden = false;
    if (asCase && caseStudies[id]) renderCase(id);
    else render(id);
    requestAnimationFrame(() => modal.classList.add('is-open'));
    setBackgroundInert([modal, toastEl], true);
    if (!wasOpen) document.dispatchEvent(new CustomEvent('scroll-lock', { detail: true }));
    panel.focus();
  };

  document.addEventListener('click', (e) => {
    const t = e.target as HTMLElement;
    const brief = t.closest<HTMLElement>('[data-brief]');
    if (brief) return open(brief.dataset.brief!, false, brief);
    const caseBtn = t.closest<HTMLElement>('[data-case]');
    if (caseBtn) return !isOpen ? open(caseBtn.dataset.case!, true, caseBtn) : renderCase(caseBtn.dataset.case!);
    if (t.closest('[data-back]')) return render(currentId);
    const stepBtn = t.closest<HTMLElement>('[data-step]');
    if (stepBtn) return step(Number(stepBtn.dataset.step) as 1 | -1);
    // clicking the card body (not a link) also opens the briefing
    const card = t.closest<HTMLElement>('.card');
    if (card && !t.closest('a,button')) return open(card.dataset.id!, false, cardButton(card.dataset.id!));
    const closer = t.closest('[data-close]');
    // An in-page link (e.g. "request a demo" → #contact) takes focus to its target instead.
    if (closer) close(!closer.matches('a[href^="#"]'));
  });
  document.addEventListener('keydown', (e) => {
    if (!isOpen) return;
    if (e.key === 'Escape') close();
    if (e.key === 'ArrowRight') step(1);
    if (e.key === 'ArrowLeft') step(-1);
    if (e.key === 'Tab') {
      const f = Array.from(panel.querySelectorAll<HTMLElement>(FOCUSABLE)).filter((el) => el.getClientRects().length > 0);
      if (!f.length) {
        e.preventDefault();
        return;
      }
      const first = f[0];
      const last = f[f.length - 1];
      const active = document.activeElement;
      const inside = active instanceof HTMLElement && panel.contains(active) && active !== panel;
      if (e.shiftKey && (active === first || !inside)) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && (active === last || !inside)) {
        e.preventDefault();
        first.focus();
      }
    }
  });

  return { openCase: (id: string) => open(id, true, cardButton(id)) };
}
