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
      'My final-year capstone project: a production-style platform that lets a logistics company track its vehicle fleet, schedule and log maintenance, and monitor day-to-day operations from one dashboard. I designed and built it end-to-end — from the data model and REST API to the UI, authentication and deployment.',
    features: [
      'Fleet registry with vehicle profiles, maintenance history and upcoming service tracking',
      'Operational monitoring dashboard built in React + TypeScript',
      'Spring Boot REST API with a relational database behind it',
      'Keycloak single sign-on with role-based access control',
      'Real-time notifications powered by Redis + Firebase',
      'Fully containerized with Docker and served behind an Nginx reverse proxy',
    ],
    facts: [{ label: 'TYPE', value: 'FINAL YEAR PROJECT' }, { label: 'DATE', value: 'APR–JUN 2025' }, { label: 'SCOPE', value: 'FULL-STACK' }],
    title: 'LOGISERV',
    category: 'web',
    featured: true,
    classified: true,
    summary:
      'Full-stack fleet maintenance & operations platform. React + TypeScript frontend, Spring Boot REST API, Keycloak auth, Redis + Firebase real-time notifications, Dockerized and served behind Nginx.',
    tech: ['React', 'TypeScript', 'Spring Boot', 'Keycloak', 'Redis', 'Docker'],
    links: [],
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
      'Chaos mode with fairy pieces (Amazon, Chancellor, Nightrider) and boards up to 10×10',
    ],
    facts: [{ label: 'PLAYERS', value: '2' }, { label: 'NETWORK', value: 'LAN / WEBSOCKETS' }, { label: 'BOARD', value: 'UP TO 10×10' }],
    title: 'Fog Chess',
    category: 'web',
    featured: true,
    classified: true,
    summary:
      'Hidden-information chess for LAN play: enemy pieces are invisible — you only know a square is occupied. Secret setups, private guess-pins, fair check alerts and a Chaos mode with fairy pieces (Amazon, Chancellor, Nightrider) on boards up to 10×10.',
    tech: ['Node.js', 'Socket.io', 'Express', 'Chess.js'],
    links: [],
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
      '33 game modes in 5 categories — Glitch, Mirror, No Backspace, Chain and more',
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
      'A physics battle sandbox: spawn swarms of "Minion" balls to take down high-HP "Boss" balls. Every parameter can be tuned live, and damage logic can even be scripted in Python from inside the game.',
    features: [
      'Real-time elastic collision physics with wall bouncing',
      'Live control panel — tweak everything without restarting',
      'Math expressions for power and HP (e.g. random.randint(1, 10), 10**5)',
      'Built-in Python script editor for custom level-up damage logic',
      'Multiple bosses, a resizable window and crash-safe error handling',
    ],
    facts: [{ label: 'ENGINE', value: 'PYGAME' }, { label: 'SCRIPTING', value: 'PYTHON IN-GAME' }],
    title: 'Ball Simulation',
    category: 'python',
    summary:
      'Physics battle sim: spawn "Minion" balls to take down "Boss" balls. Real-time collisions, health systems, tunable physics and difficulty levels, built with Pygame.',
    tech: ['Python', 'Pygame', 'Physics'],
    links: [gh('ball_simulation')],
  },
  {
    id: 'hangman',
    overview:
      'The classic word-guessing game with a graphical Pygame interface.',
    features: [
      'Clickable on-screen letter keyboard',
      'Hangman drawing that updates with each wrong guess',
      'Automatic win / loss detection',
      'Easily editable word list',
    ],
    facts: [{ label: 'ENGINE', value: 'PYGAME' }, { label: 'LIVES', value: '6' }],
    title: 'Hangman',
    category: 'python',
    summary:
      'Graphical word-guessing game with an on-screen keyboard, live hangman drawing, word categories, score tracking and adjustable difficulty.',
    tech: ['Python', 'Pygame'],
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
      'A probability experiment: start at 12 on a clock face and step randomly clockwise or counter-clockwise until every number has been visited. Which number is visited last? The simulation runs this many times and reports the distribution.',
    features: [
      '50/50 random walk between adjacent numbers',
      'Stops once all 12 numbers have been visited',
      'Monte Carlo repetition to estimate the probability for each number',
      'Percentage breakdown output plus an animated visual',
    ],
    facts: [{ label: 'METHOD', value: 'MONTE CARLO' }, { label: 'STATES', value: '12' }],
    title: 'Clock Simulation',
    category: 'python',
    summary:
      'Monte Carlo "random walk" on a clock face that maps the probability distribution of the last visited number across thousands of runs, with graphical output.',
    tech: ['Python', 'Simulation', 'Statistics'],
    links: [gh('Clock-Simulation')],
  },
  {
    id: 'valorant',
    overview:
      'A small automation script that instantly locks in your preferred agent during VALORANT\'s agent-select screen.',
    features: [
      'Detects the agent-select screen',
      'Automatically selects and locks your chosen agent',
    ],
    facts: [{ label: 'LANGUAGE', value: 'PYTHON' }, { label: 'TYPE', value: 'AUTOMATION' }],
    title: 'Valorant Agent Lock',
    category: 'python',
    summary:
      'Automation script that instantly locks your preferred Valorant agent using screen detection and automated input.',
    tech: ['Python', 'Automation', 'Computer Vision'],
    links: [gh('Valorant-Agent-selection')],
  },
  {
    id: 'file-sorter',
    overview:
      'Drop the script into any messy folder and run it — files are organized automatically into tidy folders.',
    features: [
      'Automatic organization of any folder',
      '"Don\'t touch" lists for files you want left alone',
      'Customizable sorting rules',
    ],
    facts: [{ label: 'LANGUAGE', value: 'PYTHON' }, { label: 'TYPE', value: 'AUTOMATION' }],
    title: 'File Sorter',
    category: 'python',
    summary:
      'Drop it into a messy folder and watch it organize everything — with "don\'t touch" lists and deep customization.',
    tech: ['Python', 'Automation'],
    links: [gh('File-Sorter')],
  },
  {
    id: 'crypt',
    overview:
      'A text encryption tool: shift the letters of a message by a key of your choice, share the key with a friend, and only they can decode it.',
    features: [
      'Encrypt any message with a custom shift key',
      'Decrypt with the same key',
      'Simple command-line workflow',
    ],
    facts: [{ label: 'LANGUAGE', value: 'PYTHON' }, { label: 'CIPHER', value: 'SHIFT' }],
    title: 'Encrypt & Decrypt',
    category: 'python',
    summary: 'Key-based text encryption tool — encrypt a message, share the key, and only your friends can read it.',
    tech: ['Python', 'Encryption'],
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
      'Converts any text into the Standard Galactic Alphabet used by Minecraft\'s enchanting table.',
    features: [
      'Instant text-to-enchanting-table conversion',
      'Works with any word or sentence',
    ],
    facts: [{ label: 'LANGUAGE', value: 'PYTHON' }],
    title: 'Minecraft Language',
    category: 'python',
    summary: 'Converts any text into the Minecraft enchanting table alphabet.',
    tech: ['Python', 'Text Processing'],
    links: [gh('Minecraft-language')],
  },
  {
    id: 'morse',
    overview:
      'Translates words into Morse code — for secret messages with friends or for learning the code — and can play the result as sound.',
    features: [
      'Text to Morse code translation',
      'Audio playback of the Morse signal',
    ],
    facts: [{ label: 'LANGUAGE', value: 'PYTHON' }],
    title: 'Morse Converter',
    category: 'python',
    summary: 'Translates words to Morse code — for secret messages or learning the code.',
    tech: ['Python'],
    links: [gh('Morse-Code-Converter')],
  },
  {
    id: 'passgen',
    overview:
      'Generates strong, random passwords with your chosen length and character sets.',
    features: [
      'Configurable length',
      'Choice of letters, digits and symbols',
      'A fresh random password every run',
    ],
    facts: [{ label: 'LANGUAGE', value: 'PYTHON' }],
    title: 'Password Generator',
    category: 'python',
    summary: 'Generates strong random passwords with configurable length and character sets.',
    tech: ['Python', 'Security'],
    links: [gh('Password-Genetrater')],
  },
  {
    id: 'zip',
    overview:
      'An educational look at compression: builds archives that are tiny on disk but expand into huge amounts of data, showing how compression ratios can be abused. For learning and testing only.',
    features: [
      'Configurable output size',
      'Demonstrates extreme compression ratios',
    ],
    facts: [{ label: 'LANGUAGE', value: 'PYTHON' }, { label: 'PURPOSE', value: 'EDUCATIONAL' }],
    title: 'Zip Bomb Lab',
    category: 'python',
    summary: 'Explores compression by building archives that look tiny but expand enormously — configurable and educational.',
    tech: ['Python', 'Compression'],
    links: [gh('Zip-Bomb')],
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
      'Building the Orange Crush tap-to-earn crypto game and the ToLZ NFT collection. Grew and run a Discord community of 1,000+ players as both developer and community manager, and launched ToLZ on OpenSea.',
    rewards: ['Game Dev', 'NFT Launch', '1000+ Community', 'Blockchain', 'Tap-to-Earn'],
    links: [
      { label: 'Play Orange Crush', href: 'https://orangecrush.app/game' },
      { label: 'The Orange Labz', href: 'https://theorangelabz.com' },
      { label: '@OrangeCrushweb3', href: 'https://x.com/OrangeCrushweb3' },
    ],
  },
  {
    title: 'LOGISERV — Final Year Project',
    org: 'Academic Project',
    date: 'APR — JUN 2025',
    icon: 'rocket',
    status: 'complete',
    summary:
      'Designed and shipped a full-stack fleet maintenance & monitoring platform: React + TypeScript, Spring Boot REST API, Keycloak auth, Redis + Firebase notifications, Docker and Nginx.',
    rewards: ['Full-Stack', 'React + TS', 'Spring Boot', 'Docker', 'Keycloak'],
  },
  {
    title: 'B.Sc. Computer Science',
    org: 'Faculty of Sciences of Sfax',
    date: '2022 — 2025',
    icon: 'grad',
    status: 'complete',
    summary:
      'Computer Science degree focused on software development, web technologies and system architecture — a strong foundation in fundamentals and modern practices.',
    rewards: ['Software Eng.', 'Web Tech', 'Architecture', 'Algorithms'],
  },
  {
    title: 'Software Developer Intern',
    org: 'Tunisie Telecom',
    date: '2024',
    icon: 'briefcase',
    status: 'complete',
    summary:
      'Built an employee management application to streamline HR operations — secure CRUD over staff records, centralized access and a clean UI that replaced manual record-keeping.',
    rewards: ['Corporate XP', 'HR System', 'Secure CRUD', 'UI/UX'],
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
