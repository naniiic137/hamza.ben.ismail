import { inventory, profile, projects, quests, skillTrees } from '../data/content';
import { sfx } from './audio';

interface Ctx {
  print: (html: string, cls?: string) => void;
  clear: () => void;
  playGame: () => void;
  scrollTo: (id: string) => void;
}

const e = (s: string) => s.replace(/[&<>]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;' })[c]!);
/** Pads or truncates (with …) to exactly `n` characters, so columns stay aligned. */
const fit = (s: string, n: number) => {
  const chars = Array.from(s);
  return chars.length > n ? chars.slice(0, n - 1).join('') + '…' : s.padEnd(n + s.length - chars.length, ' ');
};
const link = (href: string, label = href) => `<a href="${href}" target="_blank" rel="noopener">${e(label)}</a>`;

const FILES: Record<string, string> = {
  'about.txt': profile.bio.join('\n\n'),
  'contact.txt': `email    ${profile.email}\ngithub   ${profile.github}\nlinkedin ${profile.linkedin}`,
  'secret.txt': 'The cake is a lie. The portfolio is not. ↑↑↓↓←→←→BA',
};

const COMMANDS: Record<string, { desc: string; run: (args: string[], c: Ctx) => void }> = {
  help: {
    desc: 'list available commands',
    run: (_a, c) => {
      c.print(
        Object.entries(COMMANDS)
          .filter(([k]) => !['sudo', 'rm', 'exit', 'coffee', 'hello', 'hi'].includes(k))
          .map(([k, v]) => `<span class="t-cmd">${k.padEnd(10, ' ')}</span> ${v.desc}`)
          .join('\n'),
      );
    },
  },
  whoami: {
    desc: 'who is behind this terminal',
    run: (_a, c) => c.print(`${profile.name} — ${profile.roles.join(' · ')}\nbased in ${profile.origin}`),
  },
  about: { desc: 'short bio', run: (_a, c) => c.print(e(profile.bio.join('\n\n'))) },
  skills: {
    desc: 'show the tech tree',
    run: (_a, c) =>
      c.print(
        skillTrees
          .map((t) => `<span class="t-hl">${t.title}</span>\n` + t.skills.map((s) => `  ${s.name.padEnd(22, '.')} ${'█'.repeat(Math.round(s.level / 10))}${'░'.repeat(10 - Math.round(s.level / 10))}`).join('\n'))
          .join('\n'),
      ),
  },
  projects: {
    desc: 'list missions (projects)',
    run: (_a, c) =>
      c.print(
        projects
          .map((p, i) => `M-${String(i + 1).padStart(2, '0')} ${e(fit(p.title, 24))} ${p.classified ? '[classified]' : p.links[0] ? link(p.links[0].href, '[open]') : ''}`)
          .join('\n'),
      ),
  },
  experience: {
    desc: 'quest log',
    run: (_a, c) => c.print(quests.map((q) => `<span class="t-hl">${q.date.padEnd(16, ' ')}</span> ${e(q.title)} @ ${e(q.org)}`).join('\n')),
  },
  stack: { desc: 'full inventory', run: (_a, c) => c.print(inventory.join(' · ')) },
  contact: {
    desc: 'ways to reach me',
    run: (_a, c) =>
      c.print(`email    ${link('mailto:' + profile.email, profile.email)}\ngithub   ${link(profile.github)}\nlinkedin ${link(profile.linkedin)}`),
  },
  email: {
    desc: 'open your mail client',
    run: (_a, c) => {
      c.print(`opening mail client → ${profile.email}`);
      window.location.href = `mailto:${profile.email}`;
    },
  },
  github: { desc: 'open GitHub', run: (_a, c) => (c.print('opening github...'), window.open(profile.github, '_blank', 'noopener')) },
  linkedin: { desc: 'open LinkedIn', run: (_a, c) => (c.print('opening linkedin...'), window.open(profile.linkedin, '_blank', 'noopener')) },
  cv: {
    desc: 'download my CV — cv fr for French',
    run: (a, c) => {
      const fr = (a[0] ?? '').toLowerCase() === 'fr';
      c.print(`downloading Hamza-Ben-Ismail-CV-${fr ? 'FR' : 'EN'}.pdf...`);
      window.open(fr ? profile.cvFr : profile.cv, '_blank', 'noopener');
    },
  },
  hire: {
    desc: 'the best command',
    run: (_a, c) => {
      sfx.powerup();
      c.print(`<span class="t-ok">✔ EXCELLENT CHOICE.</span> Send a transmission → ${link('mailto:' + profile.email + '?subject=Let%27s%20work%20together', profile.email)}`);
    },
  },
  play: { desc: 'launch BUG INVADERS', run: (_a, c) => (c.print('inserting coin...'), setTimeout(c.playGame, 400)) },
  ls: { desc: 'list files', run: (_a, c) => c.print(Object.keys(FILES).join('   ')) },
  cat: {
    desc: 'read a file — cat about.txt',
    run: (a, c) => {
      if (!a[0]) return c.print('usage: cat &lt;file&gt; — try <span class="t-cmd">ls</span>', 't-err');
      const f = FILES[a[0]];
      if (f) c.print(e(f));
      else c.print(`cat: ${e(a[0] ?? '')}: no such file. try <span class="t-cmd">ls</span>`, 't-err');
    },
  },
  goto: {
    desc: 'jump to a section — goto projects',
    run: (a, c) => {
      const map: Record<string, string> = { about: 'about', pilot: 'about', projects: 'projects', missions: 'projects', skills: 'skills', experience: 'experience', quests: 'experience', contact: 'contact', start: 'hero' };
      const id = map[(a[0] ?? '').toLowerCase()];
      if (id) {
        c.print(`warping to ${id}...`);
        c.scrollTo(id);
      } else c.print('usage: goto [about|projects|skills|experience|contact|start]', 't-err');
    },
  },
  neofetch: {
    desc: 'system info',
    run: (_a, c) =>
      c.print(
        `<span class="t-hl">   ▄▄▄▄▄▄▄▄▄   </span>  <b>guest@hbi-os</b>
<span class="t-hl">  █ ▄▄▄▄▄▄▄ █  </span>  OS      HBI-OS 2.6
<span class="t-hl">  █ █ ▀ ▀ █ █  </span>  HOST    ${e(profile.origin)}
<span class="t-hl">  █ █▄▄▄▄▄█ █  </span>  SHELL   hbsh 1.0
<span class="t-hl">  █▄▄▄▄▄▄▄▄▄█  </span>  MISSION ${projects.length}
<span class="t-hl">    ▄█▄ ▄█▄    </span>  UPTIME  since 2019
                   COFFEE  1000+`,
      ),
  },
  date: { desc: 'current date', run: (_a, c) => c.print(new Date().toString()) },
  echo: { desc: 'echo text', run: (a, c) => c.print(e(a.join(' '))) },
  sound: { desc: 'toggle sound effects', run: (_a, c) => (sfx.toggle(), c.print(`sound ${sfx.enabled ? 'ON' : 'OFF'}`)) },
  clear: { desc: 'clear the screen', run: (_a, c) => c.clear() },
  sudo: {
    desc: '',
    run: (a, c) => {
      if (a.join(' ').toLowerCase().includes('hire')) return COMMANDS.hire.run([], c);
      sfx.error();
      c.print('guest is not in the sudoers file. This incident will be reported. 👀', 't-err');
    },
  },
  rm: { desc: '', run: (_a, c) => (sfx.error(), c.print('nice try. the universe is read-only.', 't-err')) },
  exit: { desc: '', run: (_a, c) => c.print('there is no escape. type <span class="t-cmd">hire</span> instead.') },
  coffee: { desc: '', run: (_a, c) => c.print('☕ brewing... +1 cup (1001 total)') },
  hello: { desc: '', run: (_a, c) => c.print('hey there, traveller 👋 type <span class="t-cmd">help</span>') },
  hi: { desc: '', run: (a, c) => COMMANDS.hello.run(a, c) },
};

export function initTerminal(opts: { playGame: () => void; scrollTo: (id: string) => void }) {
  const out = document.getElementById('termOut')!;
  const form = document.getElementById('termForm') as HTMLFormElement;
  const input = document.getElementById('termInput') as HTMLInputElement;
  const screen = document.getElementById('termScreen')!;
  const history: string[] = [];
  let hIdx = 0;

  const ctx: Ctx = {
    print: (html, cls = '') => {
      const div = document.createElement('div');
      div.className = `t-line ${cls}`;
      div.innerHTML = html;
      out.appendChild(div);
      screen.scrollTop = screen.scrollHeight;
    },
    clear: () => (out.innerHTML = ''),
    ...opts,
  };

  ctx.print(`<span class="t-hl">HBI-OS 2.6</span> — interactive shell. Type <span class="t-cmd">help</span> to start, or try <span class="t-cmd">hire</span>.`);

  const run = (raw: string) => {
    const line = raw.trim();
    ctx.print(`<span class="t-ps1">guest@hbi:~$</span> ${e(line)}`);
    if (!line) return;
    history.push(line);
    hIdx = history.length;
    const [cmd, ...args] = line.split(/\s+/);
    const c = COMMANDS[cmd.toLowerCase()];
    if (c) c.run(args, ctx);
    else {
      sfx.error();
      ctx.print(`command not found: ${e(cmd)}. type <span class="t-cmd">help</span>`, 't-err');
    }
  };

  form.addEventListener('submit', (ev) => {
    ev.preventDefault();
    sfx.click();
    run(input.value);
    input.value = '';
  });
  input.addEventListener('keydown', (ev) => {
    if (ev.key === 'ArrowUp') {
      hIdx = Math.max(0, hIdx - 1);
      input.value = history[hIdx] ?? '';
      ev.preventDefault();
    } else if (ev.key === 'ArrowDown') {
      hIdx = Math.min(history.length, hIdx + 1);
      input.value = history[hIdx] ?? '';
      ev.preventDefault();
    } else if (ev.key === 'Tab' && !ev.shiftKey && input.value.trim()) {
      // autocomplete only when something is typed, so Tab still moves focus otherwise
      const m = Object.keys(COMMANDS).filter((k) => COMMANDS[k].desc && k.startsWith(input.value.toLowerCase()));
      if (m.length === 1) input.value = m[0] + ' ';
      else if (m.length > 1) ctx.print(m.join('  '));
      ev.preventDefault();
    } else if (ev.key.length === 1) sfx.type();
  });
  screen.addEventListener('click', () => {
    if (!window.getSelection()?.toString()) input.focus({ preventScroll: true });
  });

  /** Types commands into the prompt by itself — a little demo on first view. */
  return {
    demo(cmds: string[]) {
      let touched = false;
      input.addEventListener('focus', () => (touched = true), { once: true });
      const typeCmd = (i: number) => {
        if (touched || i >= cmds.length) return;
        const cmd = cmds[i];
        let n = 0;
        const tick = () => {
          if (touched) return;
          input.value = cmd.slice(0, ++n);
          if (n < cmd.length) return setTimeout(tick, 70);
          setTimeout(() => {
            if (touched) return;
            run(cmd);
            input.value = '';
            setTimeout(() => typeCmd(i + 1), 900);
          }, 350);
        };
        tick();
      };
      typeCmd(0);
    },
  };
}
