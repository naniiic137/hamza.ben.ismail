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
  summary: string;
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
    'FULL-STACK ENGINEER',
    'AI & AUTOMATION BUILDER',
    'GAME DEVELOPER',
    'IOT TINKERER',
    'COMMUNITY BUILDER',
  ],
  tagline:
    'Software engineer from Tunisia building web platforms, bots, games and AI-powered tools — from React + Spring Boot to Raspberry Pi and ESP32.',
  bio: [
    "I'm a Computer Science graduate from the Faculty of Sciences of Sfax and a versatile engineer who likes owning a product end-to-end: full-stack web platforms, desktop apps, Discord bots, IoT systems, blockchain games and AI automation.",
    'I work deeply with LLMs, AI agents and prompt engineering to build intelligent systems that solve real problems. I love hard problems, picking up new tech fast, and shipping things people actually use.',
  ],
  email: 'hamza.benismail.6@gmail.com',
  github: 'https://github.com/naniiic137',
  linkedin: 'https://www.linkedin.com/in/hamzabenismail1',
  cv: 'https://drive.google.com/uc?export=download&id=1u4yNHhXIsZkBB2D6D5Zsd_wdAy1ia4ws&confirm=t',
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
    title: 'Chkoba (شكوبة)',
    category: 'web',
    summary:
      'Multiplayer browser version of the classic Tunisian card game. Firebase Realtime Database powers play across any network, with 2-player and 4-player team modes and full Shkobba scoring.',
    tech: ['JavaScript', 'Firebase', 'Real-Time'],
    links: [gh('Chkoba')],
  },
  {
    id: 'checkers',
    title: 'Custom Checkers',
    category: 'web',
    summary:
      'Fully customizable checkers: adjustable board size, 6 king movement modes, a board editor, shareable links and real-time peer-to-peer multiplayer over WebRTC.',
    tech: ['JavaScript', 'WebRTC', 'Multiplayer'],
    links: [gh('Custom-Checkers')],
  },
  {
    id: 'wordle',
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
    title: 'Discord Moderation Bot',
    category: 'web',
    summary:
      'Moderation bot that controls message flow in specific channels: daily limits, per-submission cooldowns, multi-channel support, an interactive dashboard, lockdowns and role restrictions.',
    tech: ['Node.js', 'Discord.js', 'Discord API'],
    links: [gh('Discord-moderation-bot')],
  },
  {
    id: 'game-update',
    title: 'Game Update Bot',
    category: 'python',
    summary:
      'Watches Fortnite, Valorant and CS2 for new versions via public APIs and GitHub Actions, then posts formatted update notifications to your Discord server automatically.',
    tech: ['Python', 'Discord API', 'GitHub Actions'],
    links: [gh('FortniteUpdate')],
  },
  {
    id: 'hbi-os',
    title: 'HBI-OS (This Site)',
    category: 'web',
    summary:
      'This portfolio: a real-time WebGL universe rendered at low resolution and dithered to a fixed palette, a scroll-driven camera, procedurally generated sprites, a chiptune synth, an interactive shell and a hidden arcade game.',
    tech: ['TypeScript', 'Three.js', 'GLSL', 'GSAP', 'Vite'],
    links: [gh('hamza.ben.ismail')],
  },
  {
    id: 'microsaving',
    title: 'MicroSaving',
    category: 'python',
    summary:
      'Generates personalized, gamified savings challenges — with interactive HTML trackers for PC and phone plus printable sheets for physical tracking.',
    tech: ['Python', 'HTML', 'CSS', 'JavaScript'],
    links: [gh('MicroSaving')],
  },
  {
    id: 'inventory',
    title: 'Simple Inventory',
    category: 'desktop',
    summary:
      'Inventory and sales management system built with Python and ttkbootstrap: track purchases, manage stock records and export daily reports.',
    tech: ['Python', 'Tkinter', 'ttkbootstrap'],
    links: [gh('simple-inventory')],
  },
  {
    id: 'calc-vault',
    title: 'Calculator Vault',
    category: 'desktop',
    summary:
      'A Windows app disguised as a calculator that hides a secret vault — files inside are encrypted and kept out of sight.',
    tech: ['Windows', 'Encryption', 'Security'],
    links: [gh('Calculateur-To-Hide-Files')],
  },
  {
    id: 'valenlink',
    title: 'ValenLink',
    category: 'web',
    summary:
      'Playful web app that asks that special someone to be your Valentine — generate a personal link and get their answer delivered straight to your inbox.',
    tech: ['JavaScript', 'EmailJS', 'HTML', 'CSS'],
    links: [gh('ValenLink')],
  },
  {
    id: 'ball-sim',
    title: 'Ball Simulation',
    category: 'python',
    summary:
      'Physics battle sim: spawn "Minion" balls to take down "Boss" balls. Real-time collisions, health systems, tunable physics and difficulty levels, built with Pygame.',
    tech: ['Python', 'Pygame', 'Physics'],
    links: [gh('ball_simulation')],
  },
  {
    id: 'hangman',
    title: 'Hangman',
    category: 'python',
    summary:
      'Graphical word-guessing game with an on-screen keyboard, live hangman drawing, word categories, score tracking and adjustable difficulty.',
    tech: ['Python', 'Pygame'],
    links: [gh('Hangman-Game')],
  },
  {
    id: 'dice',
    title: 'Dice Game',
    category: 'python',
    summary:
      'Six dice roll automatically — wait until they all match. Tracks how many rolls it took. Available as both a web app and a desktop app.',
    tech: ['Python', 'JavaScript', 'HTML', 'CSS'],
    links: [gh('Dice_Game'), { label: 'Live', href: 'https://nanic137.pythonanywhere.com' }],
  },
  {
    id: 'game-of-math',
    title: 'Game Of Math',
    category: 'web',
    summary:
      'Java Servlet web app with sign-up / sign-in, session management and an interactive math equation game with scoring.',
    tech: ['Java', 'Servlets', 'Auth'],
    links: [gh('Game-Of-Math')],
  },
  {
    id: 'clock-sim',
    title: 'Clock Simulation',
    category: 'python',
    summary:
      'Monte Carlo "random walk" on a clock face that maps the probability distribution of the last visited number across thousands of runs, with graphical output.',
    tech: ['Python', 'Simulation', 'Statistics'],
    links: [gh('Clock-Simulation')],
  },
  {
    id: 'valorant',
    title: 'Valorant Agent Lock',
    category: 'python',
    summary:
      'Automation script that instantly locks your preferred Valorant agent using screen detection and automated input.',
    tech: ['Python', 'Automation', 'Computer Vision'],
    links: [gh('Valorant-Agent-selection')],
  },
  {
    id: 'file-sorter',
    title: 'File Sorter',
    category: 'python',
    summary:
      'Drop it into a messy folder and watch it organize everything — with "don\'t touch" lists and deep customization.',
    tech: ['Python', 'Automation'],
    links: [gh('File-Sorter')],
  },
  {
    id: 'crypt',
    title: 'Encrypt & Decrypt',
    category: 'python',
    summary: 'Key-based text encryption tool — encrypt a message, share the key, and only your friends can read it.',
    tech: ['Python', 'Encryption'],
    links: [gh('Encrypte-And-Decryption')],
  },
  {
    id: 'love-calc',
    title: 'Love Calculator',
    category: 'desktop',
    summary:
      'Android app written in Delphi/Pascal that computes a "love percentage" from ASCII analysis of two names — with hidden easter eggs.',
    tech: ['Delphi', 'Pascal', 'Android'],
    links: [gh('love-calculateur-for-android')],
  },
  {
    id: 'minecraft-lang',
    title: 'Minecraft Language',
    category: 'python',
    summary: 'Converts any text into the Minecraft enchanting table alphabet.',
    tech: ['Python', 'Text Processing'],
    links: [gh('Minecraft-language')],
  },
  {
    id: 'morse',
    title: 'Morse Converter',
    category: 'python',
    summary: 'Translates words to Morse code — for secret messages or learning the code.',
    tech: ['Python'],
    links: [gh('Morse-Code-Converter')],
  },
  {
    id: 'passgen',
    title: 'Password Generator',
    category: 'python',
    summary: 'Generates strong random passwords with configurable length and character sets.',
    tech: ['Python', 'Security'],
    links: [gh('Password-Genetrater')],
  },
  {
    id: 'zip',
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
