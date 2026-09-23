import { inventory, profile, projects, quests, sections, skillTrees, type Project } from '../data/content';
import { icon } from './pixels';
import { caseStudies } from '../data/caseStudies';

const esc = (s: string) =>
  s.replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]!);

const CAT_LABEL = { web: 'WEB', python: 'PYTHON', desktop: 'DESKTOP' } as const;

function sectionHead(code: string, label: string, title: string, sub: string) {
  return `
    <header class="sec-head" data-reveal>
      <p class="sec-head__code"><span>${code}</span> // ${label}</p>
      <h2 class="sec-head__title" data-scramble>${title}</h2>
      <p class="sec-head__sub"><span class="prompt">&gt;</span> ${sub}<span class="blink">█</span></p>
    </header>`;
}

function hero() {
  return `
  <section class="hero" id="hero" data-section="hero">
    <div class="hero__inner">
      <p class="hero__player" data-hero><span class="dot"></span> PLAYER 1 READY · ${esc(profile.origin.toUpperCase())}</p>
      <h1 class="hero__name" data-hero aria-label="${esc(profile.name)}">
        <span class="hero__line glitch" data-text="${profile.first}">${profile.first}</span>
        <span class="hero__line hero__line--2 glitch" data-text="${profile.last}">${profile.last}</span>
      </h1>
      <p class="hero__role" data-hero><span class="hero__role-label">CLASS:</span> <span id="roleText">${profile.roles[0]}</span><span class="caret">▌</span></p>
      <p class="hero__tagline" data-hero>${esc(profile.tagline)}</p>
      <div class="hero__cta" data-hero>
        <a href="#projects" class="btn btn--primary" data-sfx>${icon('play', 12)} START MISSION</a>
        <a href="${profile.cv}" class="btn" download="Hamza-Ben-Ismail-CV-EN.pdf" data-analytics="cv-download-en" data-sfx>${icon('download', 14)} DOWNLOAD CV</a>
        <button type="button" class="btn btn--ghost" data-play-game data-sfx>${icon('gamepad', 16)} PLAY GAME</button>
      </div>
      <dl class="hero__stats" data-hero>
        ${profile.stats
          .map(
            (s) => `<div class="stat"><dt>${s.label}</dt><dd><span data-count="${s.value}">0</span>${s.suffix}</dd></div>`,
          )
          .join('')}
      </dl>
    </div>
    <a href="#about" class="hero__scroll" data-sfx aria-label="Scroll to about">
      <span>SCROLL TO LAUNCH</span>
      <span class="hero__scroll-arrow">▼</span>
    </a>
  </section>`;
}

function about() {
  return `
  <section class="section about" id="about" data-section="about">
    ${sectionHead('01', 'PILOT PROFILE', 'WHO IS PILOT?', 'loading character sheet... done.')}
    <div class="about__grid">
      <article class="pilot px-box" data-reveal>
        <div class="pilot__frame">
          <canvas class="pilot__pixel" id="pilotCanvas" aria-hidden="true"></canvas>
          <img class="pilot__photo" src="${import.meta.env.BASE_URL}portfolio.jpg" alt="Portrait of ${esc(profile.name)}" loading="lazy" width="563" height="562" />
          <span class="pilot__scan" aria-hidden="true"></span>
          <span class="pilot__hint">HOVER TO DECODE</span>
        </div>
        <div class="pilot__plate">
          <p class="pilot__name">${esc(profile.name.toUpperCase())}</p>
          <p class="pilot__meta">CLASS · DEVELOPER <br />ORIGIN · ${esc(profile.origin.toUpperCase())}</p>
          <p class="pilot__status"><span class="dot dot--lime"></span> OPEN TO OPPORTUNITIES</p>
        </div>
      </article>
      <div class="about__body">
        <div class="about__bio px-box" data-reveal>
          <p class="panel-label">BIO.TXT</p>
          ${profile.bio.map((p) => `<p>${esc(p)}</p>`).join('')}
        </div>
        <div class="attrs px-box" data-reveal>
          <p class="panel-label">ATTRIBUTES</p>
          <ul class="attrs__list">
            ${profile.attributes
              .map(
                (a) => `
              <li class="attr">
                <span class="attr__name">${a.name}</span>
                <span class="seg-bar" data-fill="${a.value}">${'<i></i>'.repeat(10)}</span>
                <span class="attr__val">${String(a.value).padStart(2, '0')}</span>
              </li>`,
              )
              .join('')}
          </ul>
        </div>
        <div class="about__cta" data-reveal>
          <a href="${profile.cv}" class="btn btn--primary" download="Hamza-Ben-Ismail-CV-EN.pdf" data-analytics="cv-download-en" data-sfx>${icon('download', 14)} CV · ENGLISH</a>
          <a href="${profile.cvFr}" class="btn" download="Hamza-Ben-Ismail-CV-FR.pdf" data-analytics="cv-download-fr" data-sfx>${icon('download', 14)} CV · FRANÇAIS</a>
          <a href="#contact" class="btn" data-sfx>${icon('mail', 16)} OPEN CHANNEL</a>
        </div>
      </div>
    </div>
  </section>`;
}

export function projectCard(p: Project, index: number) {
  const n = String(index + 1).padStart(2, '0');
  const links = p.classified
    ? `<span class="tag tag--lock">${icon('lock', 10)} CLASSIFIED</span>`
    : p.links
        .map(
          (l) =>
            `<a class="card__link" href="${l.href}" target="_blank" rel="noopener" data-sfx>${icon(l.label === 'GitHub' ? 'github' : 'arrow', 12)} ${esc(l.label.toUpperCase())}</a>`,
        )
        .join('');
  return `
    <article class="card ${p.featured ? 'card--featured' : ''}" data-cat="${p.category}" data-id="${p.id}" data-reveal>
      <div class="card__inner px-box">
        <div class="card__top">
          <span class="card__num">M-${n}</span>
          <span class="card__cat card__cat--${p.category}">${CAT_LABEL[p.category]}</span>
          ${caseStudies[p.id] ? '<span class="card__casetag">CASE FILE</span>' : ''}
        </div>
        <canvas class="card__sprite" data-sprite="${p.id}" data-cat="${p.category}" aria-hidden="true"></canvas>
        <h3 class="card__title">${esc(p.title)}</h3>
        <p class="card__summary">${esc(p.summary)}</p>
        <ul class="card__tech">${p.tech.map((t) => `<li>${esc(t)}</li>`).join('')}</ul>
        <div class="card__foot">
          ${links}
          ${
            caseStudies[p.id]
              ? `<button type="button" class="card__brief card__brief--case" data-case="${p.id}" data-sfx aria-label="Read the case study for ${esc(p.title)}">CASE FILE ▸</button>`
              : `<button type="button" class="card__brief" data-brief="${p.id}" data-sfx aria-label="Open briefing for ${esc(p.title)}">BRIEFING ▸</button>`
          }
        </div>
      </div>
    </article>`;
}

function projectsSection() {
  const counts = {
    all: projects.length,
    web: projects.filter((p) => p.category === 'web').length,
    python: projects.filter((p) => p.category === 'python').length,
    desktop: projects.filter((p) => p.category === 'desktop').length,
  };
  return `
  <section class="section projects" id="projects" data-section="projects">
    ${sectionHead('02', 'MISSION LOG', 'MISSIONS', `${projects.length} missions found. Select one for a briefing.`)}
    <div class="filters" role="tablist" aria-label="Filter projects" data-reveal>
      ${(['all', 'web', 'python', 'desktop'] as const)
        .map(
          (f, i) =>
            `<button type="button" role="tab" class="filter ${i === 0 ? 'is-active' : ''}" data-filter="${f}" aria-selected="${i === 0}" data-sfx>${f.toUpperCase()} <span>${counts[f]}</span></button>`,
        )
        .join('')}
    </div>
    <div class="cards" id="cards">
      ${projects.map(projectCard).join('')}
    </div>
  </section>`;
}

function skillsSection() {
  return `
  <section class="section skills" id="skills" data-section="skills">
    ${sectionHead('03', 'TECH TREE', 'SKILLS', 'scanning abilities... all systems nominal.')}
    <div class="trees">
      ${skillTrees
        .map((tree) => {
          const avg = Math.round(tree.skills.reduce((a, s) => a + s.level, 0) / tree.skills.length);
          return `
        <article class="tree px-box" data-reveal>
          <header class="tree__head">
            <span class="tree__icon">${icon(tree.icon, 22)}</span>
            <h3>${tree.title}</h3>
            <span class="tree__lv">LV.${Math.round(avg / 10)}</span>
          </header>
          <ul class="tree__list">
            ${tree.skills
              .map(
                (s) => `
              <li class="skill">
                <span class="skill__name">${esc(s.name)}</span>
                <span class="seg-bar seg-bar--sm" data-fill="${Math.round(s.level / 10)}" aria-hidden="true">${'<i></i>'.repeat(10)}</span>
              </li>`,
              )
              .join('')}
          </ul>
        </article>`;
        })
        .join('')}
    </div>
    <div class="inventory px-box" data-reveal>
      <p class="panel-label">INVENTORY · ${inventory.length} ITEMS</p>
      <ul class="inventory__grid">
        ${inventory.map((i) => `<li class="item" data-sfx-hover>${esc(i)}</li>`).join('')}
      </ul>
    </div>
  </section>`;
}

function experienceSection() {
  return `
  <section class="section experience" id="experience" data-section="experience">
    ${sectionHead('04', 'QUEST LOG', 'EXPERIENCE', 'replaying save file from 2019...')}
    <ol class="quests" id="quests">
      <li class="quests__rail" aria-hidden="true"><span class="quests__fill" id="questFill"></span></li>
      ${quests
        .map(
          (q) => `
        <li class="quest ${q.status === 'active' ? 'quest--active' : ''}" data-reveal>
          <span class="quest__node" aria-hidden="true">${icon(q.icon, 18)}</span>
          <article class="quest__card px-box">
            <div class="quest__top">
              <span class="quest__date">${esc(q.date)}</span>
              <span class="quest__status">${q.status === 'active' ? '▶ IN PROGRESS' : '✔ COMPLETE'}</span>
            </div>
            <h3 class="quest__title">${esc(q.title)}</h3>
            <p class="quest__org">${esc(q.org)}</p>
            <p class="quest__summary">${esc(q.summary)}</p>
            <ul class="quest__loot">${q.rewards.map((r) => `<li>+ ${esc(r)}</li>`).join('')}</ul>
            ${
              q.links
                ? `<div class="quest__links">${q.links
                    .map((l) => `<a href="${l.href}" target="_blank" rel="noopener" data-sfx>${icon('arrow', 10)} ${esc(l.label)}</a>`)
                    .join('')}</div>`
                : ''
            }
          </article>
        </li>`,
        )
        .join('')}
    </ol>
  </section>`;
}

function contactSection() {
  const user = profile.email.split('@')[0];
  return `
  <section class="section contact" id="contact" data-section="contact">
    ${sectionHead('05', 'OPEN CHANNEL', 'CONTACT', 'channel open. awaiting transmission.')}
    <div class="contact__grid">
      <div class="term px-box" data-reveal>
        <div class="term__bar">
          <span class="term__dots"><i></i><i></i><i></i></span>
          <span>${user}@hbi-os: ~</span>
        </div>
        <div class="term__screen" id="termScreen" tabindex="0" aria-label="Interactive terminal. Type help.">
          <div class="term__out" id="termOut"></div>
          <form class="term__line" id="termForm" autocomplete="off">
            <label for="termInput" class="term__ps1">guest@hbi:~$</label>
            <input id="termInput" class="term__input" type="text" spellcheck="false" autocapitalize="off" aria-label="Terminal command" />
          </form>
        </div>
      </div>
      <div class="contact__side">
        <form class="transmit px-box" id="transmit" data-reveal novalidate>
          <p class="panel-label">NEW TRANSMISSION</p>
          <label class="field"><span>CALLSIGN</span><input name="name" type="text" required autocomplete="name" placeholder="Your name" /></label>
          <label class="field"><span>FREQUENCY</span><input name="email" type="email" required autocomplete="email" placeholder="you@domain.com" /></label>
          <label class="field"><span>MESSAGE</span><textarea name="message" rows="4" required placeholder="Let's build something..."></textarea></label>
          <button class="btn btn--primary btn--block" type="submit" data-sfx>${icon('rocket', 12)} SEND TRANSMISSION</button>
          <p class="transmit__note">Opens your mail app with the message ready to send.</p>
        </form>
        <ul class="channels" data-reveal>
          <li><button type="button" class="channel px-box" data-copy="${profile.email}" data-sfx>${icon('mail', 18)}<span><b>EMAIL</b>${esc(profile.email)}</span><em>${icon('copy', 12)} COPY</em></button></li>
          <li><a class="channel px-box" href="${profile.github}" target="_blank" rel="noopener" data-sfx>${icon('github', 18)}<span><b>GITHUB</b>@naniiic137</span><em>${icon('arrow', 10)}</em></a></li>
          <li><a class="channel px-box" href="${profile.linkedin}" target="_blank" rel="noopener" data-sfx>${icon('linkedin', 18)}<span><b>LINKEDIN</b>hamzabenismail1</span><em>${icon('arrow', 10)}</em></a></li>
        </ul>
      </div>
    </div>
  </section>`;
}

function footer() {
  return `
  <footer class="footer" data-section="contact">
    <p class="footer__big" data-reveal>THANKS FOR PLAYING</p>
    <p class="footer__continue" data-reveal>CONTINUE? <span id="continueCount">9</span></p>
    <a href="#hero" class="btn" data-sfx>▲ BACK TO START</a>
    <p class="footer__credits">© ${new Date().getFullYear()} ${esc(profile.name.toUpperCase())} · BUILT WITH TYPESCRIPT, THREE.JS, GSAP &amp; ${icon('heart', 10)} · <span class="footer__konami">↑↑↓↓←→←→BA</span></p>
  </footer>`;
}

export function renderPage(root: HTMLElement) {
  root.innerHTML = hero() + about() + projectsSection() + skillsSection() + experienceSection() + contactSection() + footer();

  document.getElementById('navList')!.innerHTML = sections
    .filter((s) => s.id !== 'hero')
    .map((s) => `<li><a href="#${s.id}" data-nav="${s.id}" data-sfx><span>${s.code}</span>${s.label}</a></li>`)
    .join('');

  document.getElementById('trackerList')!.innerHTML = sections
    .map((s) => `<li data-track="${s.id}"><a href="#${s.id}" tabindex="-1"><span class="tracker__label">${s.label}</span><span class="tracker__code">${s.code}</span></a></li>`)
    .join('');
}
