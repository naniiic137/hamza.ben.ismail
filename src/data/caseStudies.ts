// Long-form "case file" pages for the best projects, keyed by project id.
// Facts here come from each repo's code and README — keep them verifiable.
// Images live in public/case/<id>/.

export interface CaseStudy {
  pitch: string;
  problem: string;
  how: string[];
  challenges: { title: string; detail: string }[];
  numbers: { label: string; value: string }[];
  images: { src: string; caption: string }[];
  status?: string;
}

const img = (id: string, file: string, caption: string) => ({ src: `case/${id}/${file}`, caption });

export const caseStudies: Record<string, CaseStudy> = {
  'fog-chess': {
    pitch:
      'Real-time chess for two players on the same network where you can see where enemy pieces are — but never what they are — and each player sets up their army in secret.',
    problem:
      'A Kriegspiel-style variant with two twists: secret arrangements and private guess-pins. The hard requirement was that hidden information must never reach the browser, so nobody can cheat by opening the developer tools.',
    how: [
      'A Node.js + Express server with Socket.io; the static front end needs no build step.',
      'A match state machine moves through lobby → house-rules negotiation → secret setup → playing → game over, and routes each move to the right rules engine.',
      'Classic mode turns the two secret arrangements into a FEN position and plays it with chess.js (with castling disabled). Chaos mode uses its own engine with leap/slide move tables, fairy pieces and board sizes up to 10×10.',
      'Before every message, a fog module converts the true board into a per-player view: your pieces with their types, the opponent’s as “occupied”, and an anonymised move log. The full board is only sent at game over, for the final reveal.',
    ],
    challenges: [
      {
        title: 'A fog of war that can’t leak',
        detail:
          'All hidden-information logic lives in one server-side module that runs before every emit; the client has no code path that could show an opponent’s piece type from the live board.',
      },
      {
        title: 'One fog filter, two rules engines',
        detail:
          'The fog module only needs a tiny “what is on this square” interface — chess.js satisfies it directly and the Chaos engine through a thin wrapper — so both modes and every board size share the same filter.',
      },
      {
        title: 'Custom starting positions on a standard engine',
        detail:
          'Secret arrangements are validated and composed into a FEN that chess.js loads without its usual starting-position checks, so pawns can even start on the back rank.',
      },
      {
        title: 'Negotiating house rules between two players',
        detail:
          'Rule proposals are versioned: any edit resets both players’ agreement, stale “agree” clicks are rejected, and the server sanitises and validates every configuration.',
      },
    ],
    numbers: [
      { label: 'MODES', value: '2' },
      { label: 'FAIRY PIECES', value: '6' },
      { label: 'BOARDS', value: '8×8 · 10×8 · 10×10' },
      { label: 'SERVER JS', value: '~1,760 LINES' },
    ],
    images: [
      img('fog-chess', 'classic-game.jpg', 'A classic game from White’s fogged view: hidden enemy tokens, two private guess-pins and an anonymised move log.'),
      img('fog-chess', 'chaos-house-rules.jpg', 'House-rules negotiation: Chaos mode on a 10×8 board with four fairy pieces enabled.'),
      img('fog-chess', 'chaos-game.jpg', 'A Chaos game with a custom arrangement: your fairy pieces shown as lettered badges, the opponent’s hidden.'),
    ],
    status:
      'Work in progress: playable end to end on a local network in both modes. Next up: rooms, reconnecting after a disconnect, and clocks.',
  },
  checkers: {
    pitch:
      'Checkers where every rule is configurable — then shared as a single link and played live, peer-to-peer, with no backend.',
    problem:
      'Checkers apps lock the rules. I wanted players to invent their own variants — chess-like kings, suicide checkers, custom starting positions — send the exact setup to a friend in one link, and play it together in real time.',
    how: [
      'A single vanilla-JavaScript rules engine. Every king mode (Standard, Flying, Queen, Knight, Crown, Random) has its own move generator, but they all return the same move objects — so selection, highlighting, mandatory capture and move execution work identically for every mode.',
      'Rule flags (backward moves and captures, capturable kings, mandatory capture, suicide mode, stalemate wins, draw limits, timers) filter or extend the generated moves; multi-jump chains and end conditions are resolved at the end of each turn.',
      'All settings are serialised into the URL with short two-letter keys, and custom boards are encoded one character per square — so opening a link starts that exact game.',
      'Multiplayer runs over WebRTC data channels (PeerJS): the host registers a room ID, the guest connects, and the full game state is synced after every turn.',
    ],
    challenges: [
      {
        title: 'Six movement systems, one engine',
        detail:
          'Knight and Crown kings capture by landing on a piece while the others jump over it. A shared move format and explicit rules for when capture chains stop keep every mode working with the same selection, highlighting and capture logic.',
      },
      {
        title: 'A whole game in a URL',
        detail:
          '23 settings map to short URL keys and the board to a compact text code. The decoder validates size and data length before rebuilding the board, so a broken link can’t crash the game.',
      },
      {
        title: 'Real-time multiplayer without a server',
        detail:
          'Peers exchange the full state snapshot after each turn instead of individual moves. That keeps both sides identical — even with Random kings that would otherwise diverge.',
      },
      {
        title: 'Undo that both players agree on',
        detail:
          'Every turn stores a deep-cloned snapshot; an undo request needs the opponent’s approval and restores captures, turn and draw-limit counters.',
      },
    ],
    numbers: [
      { label: 'KING MODES', value: '6' },
      { label: 'URL SETTINGS', value: '23' },
      { label: 'BOARD SIZE', value: 'UP TO 50×50' },
      { label: 'BACKEND', value: 'NONE' },
    ],
    images: [
      img('checkers', 'game.png', 'A game from a share link: a Queen king selected, moves in purple, captures in red, with Flying, Knight and Crown kings on the board.'),
      img('checkers', 'settings.png', 'The rules panel — board presets, default king mode, active king types and rule toggles.'),
      img('checkers', 'editor.png', 'The board editor on a 10×10 board with mixed king types placed by hand.'),
    ],
  },

  chesscipher: {
    pitch:
      'Steganography that hides a text message inside a realistic chess position — the secret travels in a PGN-style filename, the board is pure camouflage.',
    problem:
      'Send a hidden message that looks like an ordinary chess screenshot. The payload isn’t in the pixels: it’s in the filename, written as believable move notation such as 1.Be2+_e5_2.Rxh8_Rh8_3.a5.png.',
    how: [
      '37 characters (A–Z, space, 0–9) are mapped to squares by sorting all 64 squares by SHA-256(seed + square) — without the seed, the mapping is unknown.',
      'Each character becomes a piece on its square; both kings and decoy pieces are added until the board looks like a real mid-game position (22–30 pieces).',
      'A “last move” highlight is drawn from a legal origin square, and the filename is built as numbered PGN moves with random captures and checks.',
      'Decryption reads only the filename: strip move numbers and symbols, take the last two characters of each move, map the squares back to characters.',
      'Ships twice with an identical mapping: a self-contained browser app (drag-and-drop pieces, PNG export) and a Python CLI rendering pixel-art boards with pygame.',
    ],
    challenges: [
      {
        title: 'Positions that look real',
        detail:
          'Pieces are picked by rank (back-rank layouts, pawns on the 2nd/7th), colours lean to their own side, both kings are always placed, sides stay balanced, per-side piece limits are enforced and pawns never appear on impossible ranks.',
      },
      {
        title: 'A legal-looking last move',
        detail:
          'The code computes real origin squares for each piece type — pawn pushes and captures, knight jumps, king steps, sliding rays blocked by pieces — and highlights an empty one.',
      },
      {
        title: 'Same message, same board',
        detail:
          'The random generator is seeded from a SHA-256 of the message, so encryption is reproducible in both the JavaScript and Python versions.',
      },
      {
        title: 'A forgiving decoder',
        detail:
          'Because the target square is always the last two characters of a move, the parser ignores piece letters, captures, move numbers, check marks and the file extension.',
      },
    ],
    numbers: [
      { label: 'CHARACTERS', value: '37' },
      { label: 'PIECES / BOARD', value: '22–30' },
      { label: 'MODES', value: '5' },
      { label: 'ROUND-TRIP TEST', value: '206 / 206' },
    ],
    images: [
      img('chesscipher', 'encrypt.png', 'Encrypt mode: “MEET AT MIDNIGHT” hidden on the board, with the PGN-style filename that carries it.'),
      img('chesscipher', 'decrypt.png', 'Decrypt mode: the filename decoded back to the message, with the letter-mapping overlay on.'),
      img('chesscipher', 'free-board.png', 'Free Board: type with the keyboard and pieces place themselves.'),
    ],
  },
  wordle: {
    pitch:
      'A Wordle clone where anyone can build a custom puzzle, stack up to 33 rule-bending modes, and share it as an encrypted link — with optional play limits enforced by serverless functions.',
    problem:
      'Classic Wordle gives everyone the same word. I wanted creators to choose any word (or number) and the rules — guesses, hints, attempt and player caps — and share the puzzle without the answer ever appearing in the URL or on the server.',
    how: [
      'A static Netlify site: a creator page and a play page, one vanilla-JavaScript game engine (board, keyboard, feedback, saved progress) and 33 modes stored as bit flags.',
      'The whole puzzle config is packed into a compact, versioned binary format and encrypted in the browser with the Web Crypto API: a random token in the URL fragment, PBKDF2-SHA-256 key derivation (100,000 iterations) and AES-128-GCM. The server only ever sees a hash of the token.',
      'Netlify Functions backed by Netlify Blobs enforce per-person attempt limits and concurrent lobby seats (with a heartbeat), record results, and rate-limit requests.',
    ],
    challenges: [
      {
        title: 'Sharing a secret without a puzzle database',
        detail:
          'The encrypted config lives in the link itself and the key stays in the URL fragment, which browsers never send to the server — the backend only stores counters under a hashed ID.',
      },
      {
        title: 'Adding modes without breaking old links',
        detail:
          'The binary format uses flag bytes and optional marker sections, and decryption falls back to older key and IV formats, so links made with earlier versions still open.',
      },
      {
        title: 'Play limits without accounts',
        detail:
          'Two fingerprints separate “attempts per person” (stable across tabs) from “seats in the lobby” (per tab, heartbeat-based), and blocking fails closed if the server can’t be reached.',
      },
      {
        title: 'Honest win detection in deceptive modes',
        detail:
          'Modes like Mirror, Fibble, Absurdle and Reverse show misleading feedback on purpose, so the displayed colours are kept separate from the real answer check.',
      },
    ],
    numbers: [
      { label: 'GAME MODES', value: '33' },
      { label: 'CATEGORIES', value: '8' },
      { label: 'KEY DERIVATION', value: 'PBKDF2 · 100K' },
      { label: 'CIPHER', value: 'AES-128-GCM' },
    ],
    images: [
      img('wordle', 'game.png', 'A puzzle in progress with Timed and Reveal First modes stacked — countdown bar, coloured board and keyboard.'),
      img('wordle', 'share-link.png', 'The creator’s mode grid and a freshly generated encrypted share link.'),
    ],
    status:
      'Live on Netlify. Security hardening (12-byte IVs, XSS fixes, rate limiting, session cleanup) was contributed by Jihed Jarboui.',
  },
  chkoba: {
    pitch:
      'Chkobba — the classic Tunisian card game — in the browser: play a bot offline, or 2–4 friends online in real time, with no game server and no build step.',
    problem:
      'I wanted to play the card game I grew up with against friends on any network just by sharing a link, keep hosting free on a static host, and make it look and feel like a polished game — with Tunisian terms and Arabic labels.',
    how: [
      'A single-page vanilla-JavaScript app: one game module for rules, networking, bots and rendering, plus small modules for translations, a WebGL background shader, card rendering and motion.',
      'Host-authoritative multiplayer over Firebase Realtime Database: guests push moves, the host’s browser validates them (right phase, right turn, card really in that hand), applies the rules and scoring, and writes the new state back.',
      'Each hand is stored at its own path and every client subscribes only to its own; a game token and move sequence number let clients ignore stale updates and animate each move exactly once.',
      'Bot games run locally on the same rules engine, with three difficulty levels.',
    ],
    challenges: [
      {
        title: 'Players joining at the same time',
        detail:
          'Seats are claimed with a Firebase transaction, and a disconnect handler frees the seat automatically when a guest drops.',
      },
      {
        title: 'Race-free, stale-safe moves',
        detail:
          'The host rejects out-of-turn or invalid moves, a malformed move can’t crash its listener, and delayed bot moves are re-checked against the current game, phase and turn before they run.',
      },
      {
        title: 'Smooth animation under bursty sync',
        detail:
          'Rendering only marks the board dirty; an async pump diffs what is on screen against the latest state, animates the difference, and collapses queued updates into one.',
      },
      {
        title: 'Fast capture search',
        detail:
          'Finding which table cards a play can capture uses a depth-first search with sum pruning and a result cap instead of scanning every subset, so it never hangs on a crowded table.',
      },
    ],
    numbers: [
      { label: 'PLAYERS', value: '2 OR 4' },
      { label: 'BOT LEVELS', value: '3' },
      { label: 'DECK', value: '40 CARDS' },
      { label: 'SERVER', value: 'NONE' },
    ],
    images: [
      img('chkoba', 'game-table.jpg', 'A game in progress against the bot, with a card selected.'),
      img('chkoba', 'menu.jpg', 'The main menu with the Arabic logo.'),
      img('chkoba', 'mobile-game.jpg', 'The same table on a phone-sized screen.'),
    ],
    status:
      'Security gaps that remain (hand privacy without authentication, host-side cheating) are documented openly in the repo’s audit notes.',
  },

  'discord-mod': {
    pitch:
      'A Discord moderation bot that stops channel spam with per-member daily caps and cooldowns — run entirely from a private dashboard inside Discord.',
    problem:
      'Busy meme channels were being flooded by a few members. Admins needed a fair quota — “N posts a day, at most one per hour” — enforced automatically and invisibly, with per-channel rules, exceptions for trusted posters, and nothing lost when the bot restarts.',
    how: [
      'One Node.js process on discord.js v14. Every message in a tracked channel runs through a pipeline: admin bypass → lockdown → allowed roles → blocked → daily limit → cooldown. A message that fails a check is deleted and never counts.',
      'Slash commands, buttons, select menus and modals are routed to handlers; each dashboard view returns an embed plus component rows.',
      'Context such as the channel and member is encoded in each component’s ID, so dashboard views survive refreshes without any session state.',
      'State lives in in-memory maps keyed per channel and per member, and is saved to a JSON file.',
    ],
    challenges: [
      {
        title: 'Cheap writes without losing data',
        detail:
          'Config changes save immediately, per-message counters are coalesced to at most one write per second, writes are atomic (temp file + rename), and pending data is flushed on shutdown.',
      },
      {
        title: 'Timed lockdowns that survive restarts',
        detail:
          'On boot, expired locks are dropped and auto-unlock timers are re-scheduled from their stored expiry. Each timer checks it still owns the lock, and a 30-second sweep catches very long lockdowns that exceed JavaScript’s timer limit.',
      },
      {
        title: 'Two independent limits, counted honestly',
        detail:
          'The daily window starts at a member’s first post and the cooldown at their last accepted post; rejected posts never count, and an explicit 0 is treated as a real setting.',
      },
      {
        title: 'Moderation without disruption',
        detail:
          'Admin replies are private, member lists never ping anyone, deletion DMs are sent once per streak with an opt-out button, and near-limit warnings auto-delete after 12 seconds.',
      },
    ],
    numbers: [
      { label: 'SLASH COMMANDS', value: '23' },
      { label: 'DEFAULT LIMIT', value: '5 / DAY' },
      { label: 'COOLDOWN', value: '1 HOUR' },
      { label: 'DATABASE', value: 'NONE' },
    ],
    images: [
      img('discord-mod', 'dashboard.svg', 'The in-Discord dashboard, drawn from the exact fields and buttons the bot renders (sample data).'),
      img('discord-mod', 'architecture.svg', 'Architecture: Discord gateway → enforcement pipeline and interaction router → in-memory state → JSON file.'),
    ],
  },
};
