// All portfolio content lives here. Edit this file to update the site —
// the UI is rendered from these typed structures.

export type ProjectCategory = 'web' | 'python' | 'desktop';

export interface ProjectLink {
  label: string;
  href: string;
}

export interface Project {
  id: string;
  title: string;
  category: ProjectCategory;
  /** Short text shown on the card. */
  summary: string;
  /** Longer description shown in the mission briefing. */
  overview?: string;
  /** Bullet list of key features shown in the briefing. */
  features?: string[];
  /** Small stat chips shown in the briefing header. */
  facts?: { label: string; value: string }[];
  tech: string[];
  links: ProjectLink[];
  /** Private / closed-source project. */
  classified?: boolean;
  featured?: boolean;
}

export interface Skill {
  name: string;
  level: number; // 0-100
}

export interface SkillTree {
  title: string;
  icon: string; // key into the pixel icon set
  skills: Skill[];
}

export interface Quest {
  title: string;
  org: string;
  date: string;
  icon: string;
  status: 'active' | 'complete';
  summary: string;
  rewards: string[];
  links?: ProjectLink[];
}

export const profile = {
  name: 'Hamza Ben Ismail',
  first: 'HAMZA',
  last: 'BEN ISMAIL',
  origin: 'Sfax, Tunisia',
  roles: [
    'FULL-STACK DEVELOPER',
    'AI & AUTOMATION BUILDER',
    'GAME DEVELOPER',
    'IOT TINKERER',
    'COMMUNITY BUILDER',
  ],
  tagline:
    'Full-stack developer from Tunisia building web platforms, bots, games and AI-powered tools — from React + Spring Boot to Raspberry Pi and ESP32.',
  bio: [
    "I'm a Computer Science graduate from the Faculty of Sciences of Sfax and a versatile developer who likes owning a product end-to-end: full-stack web platforms, desktop apps, Discord bots, IoT systems, blockchain games and AI automation.",
    'I work deeply with LLMs, AI agents and prompt engineering to build intelligent systems that solve real problems. I love hard problems, picking up new tech fast, and shipping things people actually use.',
  ],
  email: 'hamza.benismail.6@gmail.com',
  github: 'https://github.com/naniiic137',
  linkedin: 'https://www.linkedin.com/in/hamzabenismail1',
  // PDFs live in public/cv/ — replace them there to update the CV.
  cv: `${import.meta.env.BASE_URL}cv/Hamza-Ben-Ismail-CV-EN.pdf`,
  cvFr: `${import.meta.env.BASE_URL}cv/Hamza-Ben-Ismail-CV-FR.pdf`,
  stats: [
    { value: 0, suffix: '', label: 'PROJECTS' }, // filled from projects.length below
    { value: 5, suffix: '+', label: 'YEARS CODING' },
    { value: 1000, suffix: '+', label: 'CUPS OF COFFEE' },
  ],
  attributes: [
    { name: 'FRONTEND', value: 8 },
    { name: 'BACKEND', value: 8 },
    { name: 'AI / LLM', value: 8 },
    { name: 'AUTOMATION', value: 9 },
    { name: 'GAME DEV', value: 7 },
    { name: 'HARDWARE', value: 6 },
  ],
};

const gh = (repo: string): ProjectLink => ({ label: 'GitHub', href: `https://github.com/naniiic137/${repo}` });

export const projects: Project[] = [
  {
    id: 'logiserv',
    overview:
      'Built during my capstone internship at STEG (Tunisian Electricity and Gas Company): a web platform to manage and track maintenance interventions on buildings and vehicles. I designed and built it end-to-end — from requirements and the data model to the REST API, UI, authentication and production deployment.',
    features: [
      'Tracking of maintenance interventions for buildings and vehicles, with history and status',
      'Monitoring dashboard and reporting built in React + TypeScript',
      'Containerized microservices: Spring Boot REST services on PostgreSQL',
      'Keycloak single sign-on with LDAP-based role management',
      'Automated real-time notifications powered by Redis + Firebase',
      'Fully containerized with Docker and served behind an Nginx reverse proxy',
    ],
    facts: [{ label: 'CONTEXT', value: 'CAPSTONE @ STEG' }, { label: 'DATE', value: '04/2025 – 07/2025' }, { label: 'SCOPE', value: 'FULL-STACK' }],
    title: 'LOGISERV',
    category: 'web',
    featured: true,
    classified: true,
    summary:
      'Maintenance-intervention management platform built at STEG. React + TypeScript, Spring Boot microservices, PostgreSQL, Keycloak + LDAP roles, Redis + Firebase notifications, Docker and Nginx.',
    tech: ['React', 'TypeScript', 'Spring Boot', 'Keycloak', 'Redis', 'Docker'],
    links: [],
  },
  {
    id: 'applytrack',
    overview:
      'A full-stack job-application tracker I built to prove the stack I use professionally in public: a React + TypeScript single-page app on a JWT-secured Spring Boot REST API. Track every application on a drag-and-drop Kanban board, keep an automatic status timeline, log interviews and see your response rate at a glance.',
    features: [
      'Drag-and-drop Kanban board across 6 statuses, with instant updates that roll back if the server refuses',
      'Automatic status timeline — every move is recorded, whichever way the status changes',
      'Interviews, follow-up reminders, tags, search, filters and pagination',
      'Stats dashboard: response and interview rates, applications per week, pipeline',
      'Stateless JWT auth with strict per-user data isolation (tested)',
      'Flyway migrations, PostgreSQL in production, Docker Compose, CI on GitHub Actions',
    ],
    facts: [{ label: 'TESTS', value: '53' }, { label: 'ENDPOINTS', value: '13' }, { label: 'STACK', value: 'SPRING + REACT' }],
    title: 'ApplyTrack',
    category: 'web',
    featured: true,
    summary:
      'Full-stack job-application tracker: drag-and-drop Kanban, status timeline, interviews and stats. React + TypeScript on a Spring Boot REST API with JWT.',
    tech: ['Spring Boot', 'Java', 'React', 'TypeScript', 'PostgreSQL', 'Docker'],
    links: [gh('applytrack')],
  },
  {
    id: 'websites',
    overview:
      'Nine complete, working websites for different industries — a fine-dining restaurant, a QR table menu, a wedding, a fashion shop, a real-estate agency, a delivery company, a luxury hotel, an inventory SaaS and a personal brand — plus a landing page I use to show clients what I can build. Pure HTML, CSS and JavaScript, fully responsive, and they work offline.',
    features: [
      'Restaurant reservations with opening-hour rules; QR menu with ordering, filters and EN/FR/AR (right-to-left)',
      'E-commerce: filters, quick view with variants, cart, promo codes and a 4-step checkout with card validation',
      'Real estate: search, favourites, compare 3 homes, mortgage calculator; hotel booking with availability calendar and live pricing',
      'Delivery quotes across 29 Tunisian cities with a live tracking simulation',
      'A working inventory mini-app: CRUD, stock movements, alerts, hand-drawn charts, CSV import/export',
      'Every site responsive (390 → 1440 px), accessible, and with zero external requests',
    ],
    facts: [{ label: 'SITES', value: '9' }, { label: 'FRAMEWORKS', value: 'NONE' }, { label: 'OFFLINE', value: 'YES' }],
    title: 'Websites for Businesses',
    category: 'web',
    summary:
      '9 complete client-style websites — restaurant, QR menu, shop, real estate, hotel, delivery, inventory app, wedding, portfolio — responsive and offline-ready.',
    tech: ['HTML', 'CSS', 'JavaScript', 'Responsive', 'Accessibility'],
    links: [
      { label: 'Live', href: 'https://websites-preview.netlify.app' },
      gh('websites-preview'),
    ],
  },
  {
    id: 'fog-chess',
    overview:
      'A real-time chess variant for two players on the same WiFi, close to Kriegspiel: you can see that a square is occupied, but never what the enemy piece is. The server holds the full board and enforces standard chess rules; each player only receives a filtered "fog of war" view, so the real board is never sent to the client.',
    features: [
      'Secret setup phase — arrange your 16 pieces freely on your two home ranks',
      'Fog of war: enemy pieces appear only as neutral hidden tokens',
      'Full chess rules enforced server-side with chess.js (check, mate, en passant, promotion, draws)',
      'Capture reveals — a captured piece\'s type is shown to both players',
      'Fair check: the checking square is highlighted, but the piece stays hidden',
      'Private guess-pins to track what you think each hidden piece is',
      'Chaos mode with 6 fairy pieces (Amazon, Chancellor, Archbishop, Nightrider, Camel, Wizard) and boards up to 10×10',
    ],
    facts: [{ label: 'PLAYERS', value: '2' }, { label: 'NETWORK', value: 'LAN / WEBSOCKETS' }, { label: 'BOARD', value: 'UP TO 10×10' }],
    title: 'Fog Chess',
    category: 'web',
    featured: true,
    summary:
      'Hidden-information chess for LAN play: enemy pieces are invisible — you only know a square is occupied. Secret setups, private guess-pins, fair check alerts and a Chaos mode with fairy pieces (Amazon, Chancellor, Nightrider) on boards up to 10×10.',
    tech: ['Node.js', 'Socket.io', 'Express', 'Chess.js'],
    links: [gh('fog-chess')],
  },
  {
    id: 'chesscipher',
    overview:
      'A steganography system that hides secret messages inside realistic chess board images. The message is encoded in the filename as standard chess move notation (PGN), while the board image is pure camouflage — filled with decoy pieces so nobody can tell which pieces carry the message.',
    features: [
      'Each character maps to a unique square through a SHA-256 scrambled mapping — you need the seed to decode',
      'Generates convincing mid-game positions: both kings, realistic piece counts, no pawns on impossible ranks',
      'The filename itself is the cipher, formatted like real PGN with captures and checks',
      '"Last move" highlight that follows real movement rules',
      'Browser app with Encrypt, Decrypt, Free Board and 1v1 encrypted messaging modes',
      'Also ships as a Python command-line tool',
    ],
    facts: [{ label: 'MODES', value: '4' }, { label: 'HASH', value: 'SHA-256' }, { label: 'SETUP', value: 'NONE — OPEN & PLAY' }],
    title: 'ChessCipher',
    category: 'web',
    featured: true,
    summary:
      'Steganography that hides secret messages inside chess positions. SHA-256 maps characters to squares and generates realistic-looking boards as camouflage. Ships as a Python CLI and a drag-and-drop browser app.',
    tech: ['Python', 'JavaScript', 'SHA-256', 'Steganography'],
    links: [gh('ChessCipher')],
  },
  {
    id: 'jobfit',
    overview:
      'A browser-only AI copilot for job applications. Paste your CV and a job ad and get a grounded match score, skill gaps, tailored CV bullets, an EN/FR cover letter and interview prep. It runs free: offline with a built-in analyzer, or with a free/local LLM (Gemini free tier, Ollama, any OpenAI-compatible API).',
    features: [
      'Offline analyzer: 107-skill taxonomy with French synonyms, section-aware required vs nice-to-have detection',
      'Pluggable LLM providers: Gemini, Ollama, OpenAI-compatible — all returning one zod-validated schema',
      'Grounding: every “you have this skill” claim must quote the CV, and is checked against it',
      'Score computed by the app (same formula for every provider), not by the model',
      'CV upload as PDF (parsed in the browser with pdf.js), EN/FR output, history, dark/light themes',
      'Keys stay in the browser; 97 automated tests; CI + GitHub Pages deploy',
    ],
    facts: [{ label: 'TESTS', value: '97' }, { label: 'PROVIDERS', value: '4' }, { label: 'COST', value: 'FREE' }],
    title: 'JobFit AI',
    category: 'web',
    featured: true,
    summary:
      'AI job-application copilot: CV vs job ad → grounded match score, skill gaps, tailored bullets and an EN/FR cover letter. Works offline or with free LLMs.',
    tech: ['React', 'TypeScript', 'LLMs', 'Prompt Engineering', 'zod', 'Vitest'],
    links: [{ label: 'Live', href: 'https://naniiic137.github.io/jobfit-ai/' }, gh('jobfit-ai')],
  },
  {
    id: 'picopulse',
    overview:
      'Live telemetry from a Raspberry Pi Pico to a browser dashboard over USB — no drivers, no server, no app. MicroPython firmware streams a versioned JSON protocol; the dashboard reads it with the Web Serial API, charts it live and sends commands back. A built-in simulator lets anyone try it without a board.',
    features: [
      'MicroPython firmware: RP2040 temperature sensor, analog input, non-blocking command handling',
      'Versioned newline-delimited JSON protocol (5 message types, 6 commands)',
      'Web Serial dashboard: live canvas charts, min/avg/max, threshold alerts, LED control, CSV export',
      'Robust stream parsing tested against every possible chunk split',
      'Simulator mode speaking the exact protocol, plus a Wokwi simulation of the firmware',
      '45 web tests + 11 firmware tests, CI and GitHub Pages deploy',
    ],
    facts: [{ label: 'BOARD', value: 'RASPBERRY PI PICO' }, { label: 'TESTS', value: '56' }, { label: 'RUNTIME DEPS', value: '0' }],
    title: 'PicoPulse',
    category: 'web',
    summary:
      'Raspberry Pi Pico → browser telemetry over USB with MicroPython and the Web Serial API: live charts, alerts and device control. No drivers, no server.',
    tech: ['MicroPython', 'Raspberry Pi Pico', 'TypeScript', 'Web Serial', 'Canvas'],
    links: [{ label: 'Live', href: 'https://naniiic137.github.io/picopulse/' }, gh('picopulse')],
  },
  {
    id: 'chkoba',
    overview:
      'A multiplayer browser version of Chkobba (شكوبة), the classic Tunisian card game. Games sync in real time through Firebase Realtime Database, so friends can play from anywhere just by sharing a link — no server to run, deployable to any static host.',
    features: [
      '2-player or 4-player team mode (players 1+3 vs 2+4)',
      'Authentic 40-card deck and dealing rules',
      'Full Chkobba scoring',
      'Create a game and share the link — friends join in one click',
      'Real-time state sync across any network via Firebase',
      'Security-reviewed database rules so players can\'t read or overwrite each other\'s hands',
    ],
    facts: [{ label: 'PLAYERS', value: '2 OR 4' }, { label: 'DECK', value: '40 CARDS' }, { label: 'BACKEND', value: 'FIREBASE RTDB' }],
    title: 'Chkoba (شكوبة)',
    category: 'web',
    summary:
      'Multiplayer browser version of the classic Tunisian card game. Firebase Realtime Database powers play across any network, with 2-player and 4-player team modes and full Shkobba scoring.',
    tech: ['JavaScript', 'Firebase', 'Real-Time'],
    links: [gh('Chkoba')],
  },
  {
    id: 'kalak',
    overview:
      'A real-time multiplayer party game for phones, inspired by Kalak / Fibbage. Everyone writes a convincing fake answer to a trivia question, then tries to spot the real one among the bluffs — points for finding the truth and for fooling friends. Arabic-first, with English support.',
    features: [
      'Rooms with 5-character codes, up to 12 players by default, host settings',
      'Server-authoritative state machine: lobby → picking → question → voting → results',
      'The real answer is shuffled with the bluffs server-side — clients never learn it early',
      '325 hand-written questions in 13 categories, in Arabic and English',
      'Per-room timers with early finish, podium with confetti',
      'Hardened against injected HTML and malformed socket payloads',
    ],
    facts: [{ label: 'QUESTIONS', value: '325' }, { label: 'CATEGORIES', value: '13' }, { label: 'LANGUAGES', value: 'AR · EN' }],
    title: 'Kalak (كلك)',
    category: 'web',
    summary:
      'Real-time multiplayer trivia-bluffing party game for phones (Arabic/English): write fake answers, spot the real one. Node.js + Socket.io.',
    tech: ['Node.js', 'Socket.io', 'Express', 'JavaScript'],
    links: [gh('Kalak')],
  },
  {
    id: 'checkers',
    overview:
      'Checkers where you control the rules. Resize the board, choose how kings move, flip win conditions and more — then share the exact setup as a link, or play a friend live peer-to-peer with no backend server.',
    features: [
      'Any board size and number of piece rows',
      '6 king movement modes: Standard, Flying, Queen, Knight, Crown and Random',
      'Rule toggles: backward moves and captures, mandatory capture, suicide mode, stalemate wins, draw limits',
      'Board editor to place custom starting positions',
      'Every setting encoded into a shareable URL',
      'Real-time peer-to-peer multiplayer over WebRTC (PeerJS)',
      '4 color schemes, 3 piece styles, per-player timers, mobile-first design',
    ],
    facts: [{ label: 'KING MODES', value: '6' }, { label: 'MULTIPLAYER', value: 'P2P WEBRTC' }, { label: 'SERVER', value: 'NONE' }],
    title: 'Custom Checkers',
    category: 'web',
    summary:
      'Fully customizable checkers: adjustable board size, 6 king movement modes, a board editor, shareable links and real-time peer-to-peer multiplayer over WebRTC.',
    tech: ['JavaScript', 'WebRTC', 'Multiplayer'],
    links: [gh('Custom-Checkers')],
  },
  {
    id: 'wordle',
    overview:
      'A full-featured Wordle clone built around a powerful puzzle creator. Choose any secret word, configure the rules, stack game modes, and share the puzzle through an encrypted link so the answer can\'t be read from the URL.',
    features: [
      'Classic Wordle gameplay with a virtual keyboard, hints and saved progress',
      'Puzzle creator: custom word, 1–20 guesses, 0–10 hints, play limits and lobby size',
      '33 game modes in 8 categories — Glitch, Mirror, No Backspace, Chain and more',
      'Encrypted, shareable puzzle links',
      'Hosted and playable online',
    ],
    facts: [{ label: 'GAME MODES', value: '33' }, { label: 'GUESSES', value: '1–20' }, { label: 'STATUS', value: 'LIVE' }],
    title: 'Custom Wordle V2',
    category: 'web',
    summary:
      'Feature-rich Wordle clone with a puzzle creator, multiple game modes and secure link-based sharing — build custom word puzzles with their own rules and send them via encrypted links.',
    tech: ['JavaScript', 'HTML', 'CSS'],
    links: [
      { label: 'GitHub', href: 'https://github.com/naniiic137/CustomWordleV2?tab=readme-ov-file#features' },
      { label: 'Live', href: 'https://rainbow-jalebi-6d8f8c.netlify.app/creator.html' },
    ],
  },
  {
    id: 'discord-mod',
    overview:
      'Meme Guardian Bot gives server admins full control over how often members can post in chosen channels. It tracks every submission, enforces a daily limit plus a cooldown between posts, and deletes anything over the line — while all admin tools stay invisible to regular members.',
    features: [
      'Daily post limit per member with a configurable window (30m, 12h, 3d…)',
      'Per-submission cooldown, independent of the daily limit',
      'Multiple tracked channels, each with its own settings',
      'Per-member overrides, channel lockdowns and role restrictions',
      'Interactive admin dashboard inside Discord',
      'Everything persisted to disk, so nothing is lost across restarts',
    ],
    facts: [{ label: 'LIBRARY', value: 'DISCORD.JS V14' }, { label: 'CHANNELS', value: 'MULTI' }, { label: 'STATE', value: 'PERSISTENT' }],
    title: 'Discord Moderation Bot',
    category: 'web',
    summary:
      'Moderation bot that controls message flow in specific channels: daily limits, per-submission cooldowns, multi-channel support, an interactive dashboard, lockdowns and role restrictions.',
    tech: ['Node.js', 'Discord.js', 'Discord API'],
    links: [gh('Discord-moderation-bot')],
  },
  {
    id: 'game-update',
    overview:
      'A Discord bot that watches Fortnite, VALORANT and CS2 for new game versions and posts a rich notification to your server when one drops. It runs on a GitHub Actions cron schedule, so it needs no always-on server and costs nothing to host.',
    features: [
      'Checks every 6 hours via a GitHub Actions cron job',
      'Uses public version APIs: fortnite-api.com, valorant-api.com and the Steam API',
      'Stores last-seen versions and commits them back to the repo',
      'Rich Discord embed when a new version is detected',
      'Easy to extend to any game with a public version endpoint',
    ],
    facts: [{ label: 'GAMES', value: '3' }, { label: 'INTERVAL', value: '6 HOURS' }, { label: 'HOSTING', value: 'FREE' }],
    title: 'Game Update Bot',
    category: 'python',
    summary:
      'Watches Fortnite, Valorant and CS2 for new versions via public APIs and GitHub Actions, then posts formatted update notifications to your Discord server automatically.',
    tech: ['Python', 'Discord API', 'GitHub Actions'],
    links: [gh('FortniteUpdate')],
  },
  {
    id: 'hbi-os',
    overview:
      'The site you\'re on right now. I wanted a portfolio that feels like booting up a game: the universe behind the page is a real-time 3D scene, rendered at low resolution and dithered to a fixed palette so it reads as true pixel art.',
    features: [
      'Three.js scene with custom GLSL shaders: procedural planets, clouds, atmosphere, a ringed gas giant and an asteroid belt',
      'Low-resolution render + Bayer dithering + 24-color palette quantization pass',
      'Scroll-driven camera flight path (GSAP ScrollTrigger + Lenis)',
      'Procedurally generated project sprites and a dithered holographic portrait',
      'Interactive terminal, WebAudio chiptune synth and a hidden arcade game',
      'Accessible and responsive, with a reduced-motion mode',
    ],
    facts: [{ label: 'FRAMEWORK', value: 'NONE — VANILLA TS' }, { label: 'RENDERING', value: 'WEBGL' }, { label: 'EASTER EGGS', value: 'YES' }],
    title: 'HBI-OS (This Site)',
    category: 'web',
    summary:
      'This portfolio: a real-time WebGL universe rendered at low resolution and dithered to a fixed palette, a scroll-driven camera, procedurally generated sprites, a chiptune synth, an interactive shell and a hidden arcade game.',
    tech: ['TypeScript', 'Three.js', 'GLSL', 'GSAP', 'Vite'],
    links: [gh('hamza.ben.ismail')],
  },
  {
    id: 'microsaving',
    overview:
      'A savings-challenge generator. Give it a goal (for example 2,000 TND) with minimum and maximum daily amounts, and it splits the goal into small randomized daily targets, then generates trackers you can actually use.',
    features: [
      'PC tracker: a standalone HTML dashboard with a progress bar and checkboxes',
      'Installable phone app (PWA) with offline storage and haptic feedback',
      'Printable A4 sheet for coloring in progress by hand',
      'Seed system to regenerate the exact same plan later',
      'Pure Python standard library — no dependencies',
    ],
    facts: [{ label: 'OUTPUTS', value: 'PC · PHONE · PRINT' }, { label: 'DEPENDENCIES', value: 'NONE' }],
    title: 'MicroSaving',
    category: 'python',
    summary:
      'Generates personalized, gamified savings challenges — with interactive HTML trackers for PC and phone plus printable sheets for physical tracking.',
    tech: ['Python', 'HTML', 'CSS', 'JavaScript'],
    links: [gh('MicroSaving')],
  },
  {
    id: 'employer-manager',
    overview:
      'The desktop application I built during my internship at Tunisie Telecom to digitise intern records for HR: search by national ID, add, edit, archive and list interns, stored in an embedded SQLite database — no server to install.',
    features: [
      'Login window and four-tab main window: search, add, edit, data grid',
      'SQLite database embedded next to the executable, with a table bootstrap',
      'National ID as primary key, with a clear message on duplicates',
      'Archive: records move to a mirrored archive table, with a grid toggle',
      'Text export of a record (PDF reporting was prototyped)',
    ],
    facts: [{ label: 'CONTEXT', value: 'TUNISIE TELECOM' }, { label: 'DATE', value: '08/2022 – 09/2022' }, { label: 'DATABASE', value: 'SQLITE' }],
    title: 'Intern Manager (Tunisie Telecom)',
    category: 'desktop',
    summary:
      'Desktop app built during my Tunisie Telecom internship to manage intern records: search, add, edit and archive, with an embedded SQLite database.',
    tech: ['Lazarus', 'Free Pascal', 'SQLite'],
    links: [gh('Employer-Manager')],
  },
  {
    id: 'inventory',
    overview:
      'A desktop sales and inventory manager for a small business, built with Python and ttkbootstrap. Records live in a local SQLite database, which can sit in a Google Drive or OneDrive folder for automatic cloud backup.',
    features: [
      'Add, update and delete sales records',
      'Real-time search by customer name',
      'Automatic running totals (TND)',
      'Export today\'s records to CSV',
      'Modern ttkbootstrap UI; builds to a single .exe with PyInstaller',
    ],
    facts: [{ label: 'DATABASE', value: 'SQLITE' }, { label: 'PLATFORM', value: 'WINDOWS .EXE' }],
    title: 'Simple Inventory',
    category: 'desktop',
    summary:
      'Inventory and sales management system built with Python and ttkbootstrap: track purchases, manage stock records and export daily reports.',
    tech: ['Python', 'Tkinter', 'ttkbootstrap'],
    links: [gh('simple-inventory')],
  },
  {
    id: 'calc-vault',
    overview:
      'A Windows app that looks and works like an ordinary calculator. Enter a secret sequence and it reveals a hidden vault where you can store private files — perfect camouflage for sensitive data.',
    features: [
      'Fully working calculator as the disguise',
      'Secret code sequence to set up and unlock the vault',
      'Hidden storage space for your files',
    ],
    facts: [{ label: 'PLATFORM', value: 'WINDOWS' }, { label: 'DISGUISE', value: 'CALCULATOR' }],
    title: 'Calculator Vault',
    category: 'desktop',
    summary:
      'A Windows app disguised as a calculator that hides a secret vault — files inside are encrypted and kept out of sight.',
    tech: ['Windows', 'Encryption', 'Security'],
    links: [gh('Calculateur-To-Hide-Files')],
  },
  {
    id: 'valenlink',
    overview:
      'A playful web app for asking someone to be your Valentine. Generate a personal link, send it, and their answer arrives straight in your inbox — no backend needed.',
    features: [
      'Creator mode: enter your email to generate a unique link',
      'Multi-stage question: every "No" changes the text and images',
      'A "No" button that runs away from the cursor',
      'Answers delivered by email through EmailJS',
    ],
    facts: [{ label: 'BACKEND', value: 'NONE' }, { label: 'DELIVERY', value: 'EMAILJS' }],
    title: 'ValenLink',
    category: 'web',
    summary:
      'Playful web app that asks that special someone to be your Valentine — generate a personal link and get their answer delivered straight to your inbox.',
    tech: ['JavaScript', 'EmailJS', 'HTML', 'CSS'],
    links: [gh('ValenLink')],
  },
  {
    id: 'ball-sim',
    overview:
      "A customizable physics battle: spawn swarms of \"Minion\" balls to take down high-HP \"Boss\" balls. Everything can be tuned live, and damage rules can even be scripted in Python inside the game.",
    features: [
      "Real-time elastic collisions with wall bouncing",
      "Live control panel — no restart needed",
      "Math expressions for power and HP",
      "Built-in script editor for custom damage rules",
      "Resizable window; errors are logged once instead of flooding the console",
    ],
    facts: [{ label: "ENGINE", value: "PYGAME" }, { label: "SCRIPTING", value: "IN-GAME PYTHON" }],
    title: "Ball Simulation",
    category: 'python',
    summary:
      "Physics battle sandbox: spawn \"Minion\" balls to take down \"Boss\" balls, with live-tunable physics and an in-game Python script editor. Built with Pygame.",
    tech: ["Python", "Pygame", "Physics"],
    links: [gh('ball_simulation')],
  },
  {
    id: 'hangman',
    overview:
      "A graphical Hangman game. It started from a well-known Pygame tutorial, which I extended with categories, keyboard input, an end screen with replay and score tracking.",
    features: [
      "Mouse and keyboard input",
      "60 words in 4 categories, with the category shown as a hint",
      "End screen showing the word, with R to replay",
      "Wins and losses tracked across rounds",
      "Game rules separated from the UI; 7 unit tests",
    ],
    facts: [{ label: "WORDS", value: "60" }, { label: "CATEGORIES", value: "4" }, { label: "TESTS", value: "7" }],
    title: "Hangman",
    category: 'python',
    summary:
      "Graphical Hangman with mouse and keyboard input, 60 words in 4 categories, an end screen with replay, and score tracking. Built with Pygame.",
    tech: ["Python", "Pygame", "JSON"],
    links: [gh('Hangman-Game')],
  },
  {
    id: 'dice',
    overview:
      'Six dice roll automatically — your goal is to wait until they all show the same number, and the game counts how many rolls it took. Available as both a Flask web app with a global leaderboard and a Pygame desktop app.',
    features: [
      'Real-time dice rolling animation',
      'Global leaderboard for the lowest roll count (SQLite)',
      'Adjustable roll speed',
      'Responsive web version plus a Pygame desktop version',
    ],
    facts: [{ label: 'VERSIONS', value: 'WEB + DESKTOP' }, { label: 'BACKEND', value: 'FLASK' }, { label: 'STATUS', value: 'LIVE' }],
    title: 'Dice Game',
    category: 'python',
    summary:
      'Six dice roll automatically — wait until they all match. Tracks how many rolls it took. Available as both a web app and a desktop app.',
    tech: ['Python', 'JavaScript', 'HTML', 'CSS'],
    links: [gh('Dice_Game'), { label: 'Live', href: 'https://nanic137.pythonanywhere.com' }],
  },
  {
    id: 'game-of-math',
    overview:
      'A Java web application built with Servlets: create an account, sign in, and play a quick-fire game of random equations while the app keeps your score.',
    features: [
      'Sign-up and sign-in flow',
      'Session management with Java Servlets',
      'Randomly generated equations with scoring',
    ],
    facts: [{ label: 'LANGUAGE', value: 'JAVA' }, { label: 'STACK', value: 'SERVLETS' }],
    title: 'Game Of Math',
    category: 'web',
    summary:
      'Java Servlet web app with sign-up / sign-in, session management and an interactive math equation game with scoring.',
    tech: ['Java', 'Servlets', 'Auth'],
    links: [gh('Game-Of-Math')],
  },
  {
    id: 'clock-sim',
    overview:
      "Start at 12 on a clock and step randomly clockwise or counter-clockwise until every number has been visited. Which number is visited last? Over 100,000 simulated walks, every number except 12 turns out equally likely — about 1 in 11.",
    features: [
      "Configurable number of trials and random seed",
      "Formatted results table and optional ASCII histogram",
      "README explains the surprising result: each of the 11 numbers is last ~9.09% of the time",
      "7 unit tests",
    ],
    facts: [{ label: "TRIALS", value: "100,000" }, { label: "RESULT", value: "≈ 1/11 EACH" }, { label: "TESTS", value: "7" }],
    title: "Clock Simulation",
    category: 'python',
    summary:
      "Monte Carlo random walk on a clock face — showing that each of the 11 non-starting numbers is the last one visited about 9.09% of the time.",
    tech: ["Python", "Simulation", "Probability"],
    links: [gh('Clock-Simulation')],
  },
  {
    id: 'file-sorter',
    overview:
      "Organises a messy folder by moving files into category folders. It is built to be safe: it only previews the plan unless you confirm, skips folders and hidden files, never overwrites, and keeps an undo log.",
    features: [
      "Dry run by default — nothing moves until you pass --apply",
      "Never moves folders, hidden/system files or lock files",
      "Case-insensitive categories: images, video, audio, documents, spreadsheets, archives, code, apps",
      "Name collisions renamed instead of overwritten",
      "JSON undo log with --undo; 9 unit tests",
    ],
    facts: [{ label: "DEFAULT", value: "DRY RUN" }, { label: "UNDO", value: "YES" }, { label: "TESTS", value: "9" }],
    title: "File Sorter",
    category: 'python',
    summary:
      "Safe folder organiser: previews the plan by default, sorts files into categories, never touches folders or hidden files, and can undo every move.",
    tech: ["Python", "pathlib", "argparse", "unittest"],
    links: [gh('File-Sorter')],
  },
  {
    id: 'crypt',
    overview:
      "A Caesar cipher tool: shift letters by a key to encrypt a message, shift them back to decrypt, or try all 26 shifts to crack a message without the key.",
    features: [
      "Encrypt and decrypt with any integer shift (including 0, negative or over 26)",
      "Preserves upper/lower case; leaves spaces and punctuation untouched",
      "Crack mode lists all 26 possible shifts",
      "argparse CLI plus a menu; 9 unit tests",
    ],
    facts: [{ label: "TESTS", value: "9" }, { label: "DEPENDENCIES", value: "NONE" }],
    title: "Caesar Cipher",
    category: 'python',
    summary:
      "Caesar cipher CLI: encrypt, decrypt and brute-force crack a message with any shift, preserving case and punctuation. Unit-tested.",
    tech: ["Python", "argparse", "unittest"],
    links: [gh('Encrypte-And-Decryption')],
  },
  {
    id: 'love-calc',
    overview:
      'An Android app written in Delphi/Pascal that calculates a "love percentage" between two names by analyzing their ASCII codes — with a few hidden easter eggs.',
    features: [
      'Name-based compatibility score from ASCII analysis',
      'Hidden easter eggs',
      'Polished mobile UI',
    ],
    facts: [{ label: 'PLATFORM', value: 'ANDROID' }, { label: 'LANGUAGE', value: 'DELPHI' }],
    title: 'Love Calculator',
    category: 'desktop',
    summary:
      'Android app written in Delphi/Pascal that computes a "love percentage" from ASCII analysis of two names — with hidden easter eggs.',
    tech: ['Delphi', 'Pascal', 'Android'],
    links: [gh('love-calculateur-for-android')],
  },
  {
    id: 'minecraft-lang',
    overview:
      "Converts text to the Standard Galactic Alphabet used by Minecraft’s enchanting table, and back again. Some letters are written with several symbols, so decoding uses longest-match to read them correctly.",
    features: [
      "Encode and decode, case-insensitive",
      "Correct handling of multi-symbol letters when decoding",
      "Digits and punctuation pass through unchanged",
      "UTF-8 safe output on Windows terminals",
      "argparse CLI plus a menu; 11 unit tests",
    ],
    facts: [{ label: "TESTS", value: "11" }, { label: "DEPENDENCIES", value: "NONE" }],
    title: "Galactic Alphabet Translator",
    category: 'python',
    summary:
      "Translates English to and from Minecraft’s enchanting-table alphabet (the Standard Galactic Alphabet), with correct longest-match decoding. Unit-tested.",
    tech: ["Python", "Unicode", "unittest"],
    links: [gh('Minecraft-language')],
  },
  {
    id: 'morse',
    overview:
      "A command-line tool that encodes text to Morse code and decodes it back. Unsupported characters are reported instead of crashing, and an optional flag plays the message as generated beeps.",
    features: [
      "Encode and decode, with words separated by \" / \"",
      "Letters, digits and common punctuation",
      "Unsupported characters reported, never a crash",
      "Optional sound generated in code — no audio files needed",
      "argparse CLI plus an interactive mode; 10 unit tests",
    ],
    facts: [{ label: "TESTS", value: "10" }, { label: "DEPENDENCIES", value: "NONE" }],
    title: "Morse Converter",
    category: 'python',
    summary:
      "CLI that translates text to and from Morse code — letters, digits and punctuation — with optional generated beeps. Unit-tested.",
    tech: ["Python", "argparse", "unittest"],
    links: [gh('Morse-Code-Converter')],
  },
  {
    id: 'passgen',
    overview:
      "A small Windows desktop app that generates random passwords: choose the length with a slider and which character types to include.",
    features: [
      "Length slider and character-type checkboxes",
      "Random seed initialised at start-up, so every launch gives different passwords",
      "Friendly message when no character type is selected",
    ],
    facts: [{ label: "PLATFORM", value: "WINDOWS" }, { label: "LANGUAGE", value: "PASCAL" }],
    title: "Password Generator",
    category: 'desktop',
    summary:
      "Windows desktop password generator with a length slider and character-type options, built with Lazarus / Free Pascal.",
    tech: ["Lazarus", "Free Pascal"],
    links: [gh('Password-Genetrater')],
  },
];

profile.stats[0].value = projects.length;

export const skillTrees: SkillTree[] = [
  {
    title: 'LANGUAGES',
    icon: 'code',
    skills: [
      { name: 'Pascal', level: 95 },
      { name: 'Python', level: 90 },
      { name: 'C / C++', level: 85 },
      { name: 'JavaScript', level: 85 },
      { name: 'Java', level: 80 },
      { name: 'TypeScript', level: 75 },
    ],
  },
  {
    title: 'WEB & BACKEND',
    icon: 'globe',
    skills: [
      { name: 'React', level: 80 },
      { name: 'Spring Boot', level: 78 },
      { name: 'Node.js', level: 80 },
      { name: 'PHP', level: 80 },
      { name: 'HTML / CSS', level: 75 },
      { name: 'MySQL', level: 70 },
    ],
  },
  {
    title: 'AI & AUTOMATION',
    icon: 'brain',
    skills: [
      { name: 'Prompt Engineering', level: 80 },
      { name: 'LLMs & AI APIs', level: 75 },
      { name: 'AI Agents', level: 70 },
      { name: 'Automation & Scripting', level: 70 },
      { name: 'Machine Learning', level: 65 },
    ],
  },
  {
    title: 'DEVOPS & TOOLS',
    icon: 'gear',
    skills: [
      { name: 'Git / GitHub', level: 75 },
      { name: 'Docker', level: 70 },
      { name: 'Command Line', level: 65 },
      { name: 'Keycloak', level: 65 },
      { name: 'GitHub Actions', level: 70 },
    ],
  },
  {
    title: 'IOT & HARDWARE',
    icon: 'chip',
    skills: [
      { name: 'Raspberry Pi', level: 65 },
      { name: 'ESP32', level: 60 },
      { name: 'Arduino', level: 60 },
      { name: 'Circuit Design', level: 55 },
    ],
  },
  {
    title: 'COMMUNITY & GROWTH',
    icon: 'people',
    skills: [
      { name: 'Community Management', level: 85 },
      { name: 'Project Marketing', level: 80 },
      { name: 'Social Media & Growth', level: 75 },
      { name: 'Content Planning', level: 70 },
    ],
  },
];

export const inventory: string[] = [
  'React', 'TypeScript', 'Spring Boot', 'Docker', 'Keycloak', 'PostgreSQL', 'Redis', 'REST APIs',
  'Node.js', 'Express', 'Socket.io', 'Discord.js', 'Firebase', 'WebRTC', 'Python', 'Pygame',
  'Java', 'Servlets', 'JavaScript', 'HTML5', 'CSS3', 'MySQL', 'Linux', 'Git', 'Selenium',
  'Web Scraping', 'OpenAI / GPT', 'AI Agents', 'LLMs', 'Delphi', 'Android', 'Arduino', 'ESP32',
  'Raspberry Pi', 'Nginx', 'Blockchain', 'NFTs', 'Problem Solving', 'Debugging',
];

export const quests: Quest[] = [
  {
    title: 'Developer & Community Manager',
    org: 'The Orange Labz — Orange Crush',
    date: '2025 — NOW',
    icon: 'gamepad',
    status: 'active',
    summary:
      'Building the Orange Crush tap-to-earn crypto game — smart contracts, game mechanics and backend infrastructure. Launched the ToLZ NFT collection on OpenSea and grew a Discord community of 1,000+ members.',
    rewards: ['Game Dev', 'NFT Launch', '1000+ Community', 'Blockchain', 'Tap-to-Earn'],
    links: [
      { label: 'Play Orange Crush', href: 'https://orangecrush.app/game' },
      { label: 'The Orange Labz', href: 'https://theorangelabz.com' },
      { label: '@OrangeCrushweb3', href: 'https://x.com/OrangeCrushweb3' },
    ],
  },
  {
    title: 'Capstone Intern — Full-Stack Developer',
    org: 'STEG — Tunisian Electricity and Gas Company',
    date: 'APR — JUL 2025',
    icon: 'rocket',
    status: 'complete',
    summary:
      'Built LOGISERV, a platform to manage and track maintenance interventions on buildings and vehicles, from requirements to production: React + TypeScript, Spring Boot microservices, PostgreSQL, Keycloak with LDAP roles, Redis + Firebase notifications, Docker and Nginx.',
    rewards: ['Full-Stack', 'React + TS', 'Spring Boot', 'Docker', 'Keycloak'],
  },
  {
    title: 'B.Sc. Computer Science',
    org: 'Faculty of Sciences of Sfax',
    date: '2021 — 2025',
    icon: 'grad',
    status: 'complete',
    summary:
      'Computer Science degree focused on software development, web technologies and system architecture — a strong foundation in fundamentals and modern practices.',
    rewards: ['Software Eng.', 'Web Tech', 'Architecture', 'Algorithms'],
  },
  {
    title: 'Pascal Programming',
    org: 'Education',
    date: '2019 — 2024',
    icon: 'bolt',
    status: 'complete',
    summary: 'Five years of Pascal that built my core: programming logic, algorithms and problem solving.',
    rewards: ['Algorithmic Thinking', 'Logic', '5 Years'],
  },
  {
    title: 'Software Development Intern',
    org: 'Tunisie Telecom',
    date: 'AUG — SEP 2022',
    icon: 'briefcase',
    status: 'complete',
    summary:
      'Designed and built a desktop application for HR to manage intern records — search by national ID, add, edit, archive and list — with Lazarus (Delphi-compatible Pascal) and an embedded SQLite database.',
    rewards: ['Corporate XP', 'HR Desktop App', 'Lazarus / Pascal', 'SQLite'],
  },
  {
    title: 'The Journey Begins',
    org: 'Self-Learning',
    date: '2019 — ∞',
    icon: 'star',
    status: 'active',
    summary:
      'Started with Pascal, then expanded into C, C++, Java, JavaScript, PHP, Python and SQL — and never stopped learning.',
    rewards: ['Polyglot', 'Self-Taught', 'Continuous Growth'],
  },
];

export const sections = [
  { id: 'hero', code: '00', label: 'START' },
  { id: 'about', code: '01', label: 'PILOT' },
  { id: 'projects', code: '02', label: 'MISSIONS' },
  { id: 'skills', code: '03', label: 'TECH TREE' },
  { id: 'experience', code: '04', label: 'QUEST LOG' },
  { id: 'contact', code: '05', label: 'CONTACT' },
] as const;
