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
  websites: {
    pitch:
      'Fourteen complete websites for real kinds of businesses — each with the features its customers actually use — built without frameworks and working fully offline.',
    problem:
      'I show this collection to potential clients. The first version had three problems: images hot-linked from another server broke offline, the sites weren’t usable on phones, and they looked nice but did little. I rebuilt all of them to fix exactly that.',
    how: [
      'Each site is its own small project — an HTML page with its own styles, script, optimised WebP images and (optionally) one self-hosted open-source font — so it runs from disk with no network at all.',
      'Features are real, not mock-ups: reservations follow opening hours, the shop has a working cart and checkout validation, the hotel prices a stay with taxes and offer codes, the inventory app keeps its data between visits.',
      'Without a backend, form submissions and app data are stored in the browser, and every form validates and confirms.',
      'A landing page lists all fourteen with industry filters and a live preview at desktop or phone size.',
    ],
    challenges: [
      {
        title: 'Never depend on another server',
        detail:
          'Every image was downloaded, converted to compressed WebP with responsive sizes, and every font self-hosted — the sites make zero external requests, verified automatically.',
      },
      {
        title: 'Designed for phones, not squeezed onto them',
        detail:
          'Each layout was checked at phone, tablet and desktop widths with no horizontal scrolling; tables become cards, filters become bottom sheets, and menus become accessible drawers.',
      },
      {
        title: 'Real features without a backend',
        detail:
          'Carts, bookings, RSVPs and inventory persist in the browser, calculators work on real formulas, and the QR menu generates its table codes in the page itself.',
      },
      {
        title: 'Fourteen distinct identities',
        detail:
          'Each industry got its own typography, palette and tone — from a dark-and-gold French restaurant to a teal inventory dashboard and an Arabic-ready menu.',
      },
    ],
    numbers: [
      { label: 'SITES', value: '14' },
      { label: 'EXTERNAL REQUESTS', value: '0' },
      { label: 'TESTED WIDTHS', value: '390 · 768 · 1440' },
      { label: 'FRAMEWORKS', value: 'NONE' },
    ],
    images: [
      img('websites', 'travel-agency-website.webp', 'Rihla Tours — Tunisian tours with day-by-day itineraries and a seasonal price calculator.'),
      img('websites', 'clinic-website.webp', 'Nour Clinic — appointments by doctor and time slot, with add-to-calendar.'),
      img('websites', 'hotel-website.webp', 'The Azure Palace — a luxury hotel with a booking widget and live pricing.'),
      img('websites', 'ecommerce-store.webp', 'LUXE — a fashion store with filters, cart and checkout.'),
      img('websites', 'digital-menu.webp', 'Ember & Oak — a QR table menu with ordering, filters and three languages.'),
      img('websites', 'inventory-dashboard.webp', 'StockPulse — a working inventory mini-app.'),
      img('websites', 'real-estate-website.webp', 'PrimeNest Realty — search, compare and mortgage calculator.'),
    ],
  },

  applytrack: {
    pitch:
      'A full-stack job-application tracker — drag-and-drop Kanban, automatic status timeline, interviews and a stats dashboard — built with React + TypeScript on a Spring Boot REST API.',
    problem:
      'Job seekers juggle dozens of applications in spreadsheets, forget who to follow up with, and never see their real response rate. I also wanted a public project that shows the React + Spring Boot stack I use at work, where the code is private.',
    how: [
      'A React 18 + TypeScript single-page app uses TanStack Query against a stateless, JWT-secured Spring Boot 3 REST API (13 endpoints, documented with OpenAPI).',
      'Every status change goes through one method on the application entity, which appends a timeline entry and sets the applied date automatically.',
      'Filtering uses JPA Specifications; statistics come from aggregate queries plus weekly bucketing in Java.',
      'PostgreSQL with Flyway migrations in production, in-memory H2 (PostgreSQL mode) for development and tests, Docker Compose with nginx for the full stack. GitHub Actions CI runs three jobs: backend tests (with PostgreSQL via Testcontainers and JaCoCo coverage), frontend tests, and a Docker Compose smoke test that registers, logs in and moves an application through nginx.',
    ],
    challenges: [
      {
        title: 'A timeline that can’t drift',
        detail:
          'A status can change through a form, a quick action or a Kanban drop — all three go through the same entity method, which records history and ignores no-op moves.',
      },
      {
        title: 'Users can only ever see their own data',
        detail:
          'Every lookup is scoped to the owner, and another user’s IDs return 404 so nothing can be probed. A dedicated integration test covers reads, updates, status moves, deletes, interviews, tags and stats.',
      },
      {
        title: 'Instant drag-and-drop that stays correct',
        detail:
          'A drop updates the board immediately, then rolls back if the server rejects it or refreshes from the server; drag sensors are tuned so clicks still open cards and phones can still scroll. Every card also has a keyboard “Move to…” menu.',
      },
      {
        title: 'Two tabs, one application',
        detail:
          'Optimistic locking with a version column: a stale edit gets a 409 instead of silently overwriting newer changes, and the UI refreshes and explains what happened.',
      },
      {
        title: 'Security beyond the login form',
        detail:
          'Failed logins are throttled per account and per IP (429 with Retry-After), unknown emails still cost a bcrypt check so accounts can’t be enumerated by timing, passwords over bcrypt’s 72-byte limit are rejected cleanly, and nginx adds CSP and security headers.',
      },
      {
        title: 'Queries that stay correct under paging',
        detail:
          'Tag filters use an EXISTS subquery so pages never contain duplicates, search escapes wildcards, related data loads in batches, and an injectable clock makes the date logic testable.',
      },
    ],
    numbers: [
      { label: 'TESTS', value: '98' },
      { label: 'COVERAGE', value: '86%' },
      { label: 'ENDPOINTS', value: '13' },
      { label: 'STATUSES', value: '6' },
      { label: 'CI', value: 'GITHUB ACTIONS' },
    ],
    images: [
      img('applytrack', 'board.jpg', 'The Kanban board: six status columns with follow-up badges — drag a card to move it.'),
      img('applytrack', 'dashboard.jpg', 'Stats: response and interview rates, applications per week, pipeline and upcoming follow-ups.'),
      img('applytrack', 'detail-drawer.jpg', 'An application’s detail drawer with notes, interviews and its automatic status timeline.'),
      img('applytrack', 'mobile.jpg', 'Board, dashboard and detail view on a phone.'),
    ],
    status: 'Tested with H2 locally and in CI; the Docker Compose setup is included for running the full stack with PostgreSQL.',
  },

  jobfit: {
    pitch:
      'A browser-only AI copilot for job applications: paste a CV and a job ad, get a grounded match score, skill gaps, tailored bullets, an EN/FR cover letter and interview prep — for free.',
    problem:
      'Tailoring every application by hand is slow, and generic AI tools inflate scores and invent experience that falls apart in the interview. I also wanted it to cost nothing to run — no paid API.',
    how: [
      'Four interchangeable providers — an offline analyzer, Google Gemini (free tier), Ollama (local) and any OpenAI-compatible API — all return the same payload, validated with zod.',
      'The offline analyzer uses a curated 177-skill taxonomy (one skill per product, so it never swaps GitLab for Git) with French synonyms and implied skills, and detects “required” vs “nice to have” sections in English and French job ads.',
      'LLMs only label skills and write text; the app checks every claim against the CV and computes the score itself, with the same formula for every provider.',
      'Everything runs in the browser: CVs can be uploaded as PDF and parsed locally with pdf.js, and API keys never leave the device.',
    ],
    challenges: [
      {
        title: 'The same score, whatever the model',
        detail:
          'Models disagree on numbers, so they don’t produce the score: they label each skill as required or nice-to-have and present or missing, and the app applies one weighted formula.',
      },
      {
        title: 'No invented experience',
        detail:
          'The grounding rule leads the prompt, every “in your CV” claim must include a verbatim quote, and a post-check matches it against the CV. Unverifiable claims are flagged and earn no points.',
      },
      {
        title: 'Unreliable JSON from LLMs',
        detail:
          'Each provider gets JSON mode or a schema, the response is extracted tolerantly, validated with zod, and repaired with exactly one follow-up call listing the validation errors.',
      },
      {
        title: 'Useful with no API key',
        detail:
          'The offline mode builds its analysis only from quotes of the CV, so the demo works instantly and honestly for anyone.',
      },
    ],
    numbers: [
      { label: 'TESTS', value: '176' },
      { label: 'SKILLS IN TAXONOMY', value: '177' },
      { label: 'PROVIDERS', value: '4' },
      { label: 'OUTPUT', value: 'EN · FR' },
    ],
    images: [
      img('jobfit', '02-results.webp', 'Results: the match score computed by the app, coverage by category, and matched vs missing skills.'),
      img('jobfit', '01-input.webp', 'Input: paste or upload a CV and a job ad — sample data for an instant demo.'),
      img('jobfit', '04-bullets.webp', 'Tailored CV bullets, before and after, with placeholders where a real number is needed.'),
      img('jobfit', '03-cover-letter.webp', 'A cover-letter draft built only from what the CV actually says.'),
    ],
    status:
      'The offline mode is fully tested; the LLM providers are covered by tests with mocked responses.',
  },

  'cipher-chat': {
    pitch:
      "An end-to-end encrypted real-time chat where the relay server provably sees only ciphertext — yet still controls who may join a room.",
    problem:
      "“End-to-end encrypted” is easy to claim and hard to check. I wanted an app that makes the claim visible — a live panel showing every frame the server receives, plus a button that corrupts a message in transit — and testable, with an integration test that inspects everything the server ever handles.",
    how: [
      "Keys are created on the device and shared through a link fragment (never sent to the server), a passphrase stretched with Argon2id, an X3DH-style handshake, or a key file / QR code.",
      "One room secret is split with HKDF into separate keys for messages, the room header, files and membership. Messages are signed with Ed25519, padded to hide their length, then encrypted with the room’s cipher suite.",
      "1:1 rooms switch to a Double Ratchet after the handshake, so every message has its own key and a stolen key doesn’t unlock the past.",
      "The relay (Node.js, WebSocket, SQLite) stores only ciphertext and a public verifier. The same relay code runs in the browser for the offline demo, with tabs talking over BroadcastChannel.",
    ],
    challenges: [
      {
        title: 'Gating rooms without giving the server the key',
        detail:
          "An HMAC challenge would need the key on the server, so the membership key seeds an Ed25519 key pair instead. The relay keeps only the public key and checks a signature over a one-time nonce — a leaked database can’t be used to join.",
      },
      {
        title: 'Assuming the relay is malicious',
        detail:
          "A hostile relay could weaken the passphrase settings, swap the cipher or replay old frames. Those public fields are bound into the encryption, clients refuse weak Argon2id/PBKDF2 parameters, and per-sender counters flag replays — even of deleted messages.",
      },
      {
        title: 'A demo that needs no server',
        detail:
          "The relay logic is transport-agnostic: on GitHub Pages one tab is elected (Web Locks) to host it and the other tabs connect over BroadcastChannel — each tab is a separate person.",
      },
      {
        title: 'Testing forward secrecy honestly',
        detail:
          "My first test failed, and it exposed a wrong assumption about when the Double Ratchet recovers after a key theft. The final test models an attacker who keeps listening and shows recovery only after a full Diffie-Hellman round trip, exactly as the design specifies.",
      },
    ],
    numbers: [
      { label: 'TESTS', value: '257' },
      { label: 'RFC TEST VECTOR SETS', value: '6' },
      { label: 'CIPHER SUITES', value: '3' },
      { label: 'KEY-SHARING MODES', value: '4' },
    ],
    images: [
      img('cipher-chat', 'server-view-inspector.webp', "“What the server sees”: every frame is ciphertext (0 plaintext leaks), and a bit flipped in transit is rejected in the chat."),
      img('cipher-chat', 'chat-verified-contact.webp', "A 1:1 Double Ratchet room with a verified contact, an encrypted file and signed messages."),
      img('cipher-chat', 'room-wizard.webp', "Creating a room: choose the cipher suite and one of four ways to share the key."),
      img('cipher-chat', 'safety-numbers.webp', "Safety numbers: compare 60 digits or scan the QR code to verify a contact."),
      img('cipher-chat', 'enigma-playground.webp', "The classic ciphers playground: an Enigma machine with rotor windows and the full signal path."),
      img('cipher-chat', 'mobile.webp', "The chat on a phone."),
    ],
    status:
      "Tested with published RFC test vectors and a blind-relay integration test; not independently audited — a learning project, not a replacement for Signal.",
  },
  linkpulse: {
    pitch:
      "A bit.ly-style URL shortener built like a system-design interview answer: fast cached redirects, an asynchronous analytics pipeline, HyperLogLog unique visitors and atomic rate limits — all tested against real PostgreSQL and Redis in CI.",
    problem:
      "Redirects are read-heavy (around 100 reads per write) and must be fast, while click analytics are write-heavy. Doing both in the request path makes every visitor wait for analytics writes. A shortener also needs short codes that never collide and can’t be guessed, protection from abuse, and safe handling of URLs it fetches for link previews.",
    how: [
      "GET /:code runs an atomic rate-limit check, reads the link from Redis (PostgreSQL on a miss, with negative caching for unknown codes), checks the max-clicks quota, queues the click without waiting and answers with a 302.",
      "A background consumer group reads clicks from a Redis Stream and batch-inserts them into PostgreSQL; click ids make the inserts idempotent, and crashed consumers’ pending clicks are reclaimed.",
      "Unique visitors use one HyperLogLog per link per day, so any date range is a single PFCOUNT across those days — 16 KB per counter, under 2% error.",
      "Fastify 5 + TypeScript with TypeBox schemas that also generate the OpenAPI docs; a React dashboard with Recharts, QR codes and a live click counter over Server-Sent Events.",
    ],
    challenges: [
      {
        title: 'Short codes that never collide and can’t be guessed',
        detail:
          "Random codes need retries once the table fills up, and a plain counter is guessable. Each server leases blocks of 1,000 ids from a PostgreSQL sequence, and a keyed Feistel permutation maps each id to a 7-character base62 code — unique by construction, not enumerable, one database call per 1,000 links. A test checks the permutation exhaustively.",
      },
      {
        title: 'Analytics that never slow down a redirect',
        detail:
          "The redirect only queues the click. Delivery is at-least-once, so inserts use ON CONFLICT DO NOTHING on the click id; a bad row falls back to row-by-row inserts, and nothing is acknowledged while the database is down.",
      },
      {
        title: 'Exact limits under concurrency',
        detail:
          "Max-click quotas and sliding-window rate limits run as atomic Lua scripts in Redis. In the test, 6 simultaneous visits to a link limited to 3 let exactly 3 through, and link-preview bots like Slackbot never use up the quota.",
      },
      {
        title: 'Fetching user URLs safely (SSRF)',
        detail:
          "Tricks like decimal, hex or IPv6-mapped IP addresses are normalised before checking, the private-IP check runs inside the socket’s DNS lookup so DNS rebinding can’t slip past it, and every redirect hop is re-validated with port, timeout and size limits.",
      },
    ],
    numbers: [
      { label: 'TESTS', value: '146' },
      { label: 'CACHED REDIRECTS/S', value: '~8K' },
      { label: 'P50 LATENCY', value: '4 MS' },
      { label: 'POSSIBLE CODES', value: '3.5 TRILLION' },
    ],
    images: [
      img('linkpulse', 'dashboard.webp', "The dashboard: 30-day clicks, unique visitors, active links and the top links."),
      img('linkpulse', 'analytics.webp', "Per-link analytics: live counter, clicks over time, unique visitors (HyperLogLog), bots filtered, referrers, countries, devices, browsers and OS."),
      img('linkpulse', 'links.webp', "All links with their status — active, click limit reached or expired."),
      img('linkpulse', 'create-qr.webp', "A new short link with its QR code, ready to download."),
      img('linkpulse', 'rate-limited.webp', "Rate limiting in the UI: a 429 with an exact Retry-After countdown."),
      img('linkpulse', 'mobile-analytics.webp', "Analytics on a phone."),
    ],
    status:
      "All 114 API tests pass in CI against real PostgreSQL 16 and Redis 7. Load-test numbers are from a local run on a 4-core desktop with the in-memory backend; the app isn’t deployed publicly.",
  },
  picopulse: {
    pitch:
      'Live telemetry from a Raspberry Pi Pico to a browser dashboard over USB — no drivers, no server, no app to install.',
    problem:
      'Watching a microcontroller usually means a serial terminal full of text, or setting up a desktop app or a message broker. I wanted a structured protocol and a live instrument panel you open from a URL — plus a simulator so anyone can try it without a board.',
    how: [
      'MicroPython firmware runs one non-blocking loop: it reads the RP2040’s internal temperature sensor (16× oversampled, with a TEMP_OFFSET_C calibration constant), an optional analog input, uptime and free memory, and prints one JSON line per sample at 0.2–20 Hz.',
      'Commands (LED, blink, sample rate) come back over the same USB link and are read without ever blocking sampling.',
      'The dashboard connects with the Web Serial API, turns the byte stream into validated messages, keeps ring buffers capped at 30 minutes of data and redraws hand-written canvas charts only when new data arrives, at most 30 times a second.',
      'A simulator in the page speaks exactly the same protocol, so the online demo works for visitors without a Pico.',
    ],
    challenges: [
      {
        title: 'Messages split across reads',
        detail:
          'USB chunks can hold half a line or several lines. The parser keeps the unfinished tail between reads, and tests prove the output is identical whether the stream arrives whole or in 1, 3, 7 or 64-character pieces.',
      },
      {
        title: 'Commands without stalling the sensor',
        detail:
          'The firmware polls for input with a zero timeout, uses millisecond deadlines instead of sleeps, and runs blinking as a small state machine.',
      },
      {
        title: 'Keep running whatever happens',
        detail:
          'An exception inside the loop is caught and reported at a limited rate instead of killing the firmware; commands are validated strictly; an optional hardware watchdog can be armed; and uptime is computed so it survives the 2^30 ms tick wrap. On the web side, non-fatal serial read errors are recovered from. These paths are covered by unit tests — testing on a real Pico is still pending.',
      },
      {
        title: 'No fake numbers',
        detail:
          'Readings that can’t be real (an unwired input, a simulator that reports zero) are sent as null instead of being converted into believable-looking values.',
      },
      {
        title: 'A demo that stays honest',
        detail:
          'The simulator is clearly labelled, and a test checks that every line it produces passes the same validator as real device data.',
      },
    ],
    numbers: [
      { label: 'TESTS', value: '69 + 28' },
      { label: 'RATE', value: '0.2–20 HZ' },
      { label: 'JS BUNDLE', value: '8.9 KB GZIP' },
      { label: 'CHART LIBS', value: 'NONE' },
    ],
    images: [
      img('picopulse', 'alerts-controls.webp', 'A temperature alert firing, with LED and sample-rate controls and the device acknowledging each command.'),
      img('picopulse', 'dashboard.webp', 'The full dashboard: temperature, analog input and free-memory charts, serial monitor and device panel.'),
      img('picopulse', 'mobile.webp', 'The same dashboard on a phone.'),
    ],
    status:
      'Hardware testing on a real Pico is still pending; the online demo runs in simulator mode.',
  },

  kalak: {
    pitch:
      'A real-time multiplayer party game for phones: write a convincing fake answer to a trivia question, then spot the real one among your friends’ bluffs.',
    problem:
      'Friends in the same room wanted a phone-based bluffing game in Arabic — no app to install, no accounts, just a room code. And phones around a table lock, reload and drop off the WiFi, so a round has to survive a player vanishing halfway through.',
    how: [
      'An Express server serves the game and Socket.io carries every event; each room lives in memory and moves through lobby → picking → question → voting → results → finished.',
      'One server-side timer per room broadcasts the countdown, and a phase ends as soon as every connected player has answered or voted — re-checked whenever someone disconnects or leaves.',
      'The server shuffles the real answer with the bluffs and sends each option as just an id, its text and an “own” flag, so no phone knows the correct answer — or who wrote each bluff — before the reveal.',
      'Every browser keeps a random player token; on reload it asks to resume, and the server re-attaches it to the same seat and re-sends the current phase and timer.',
      'Scoring: +2 for finding the real answer, +1 for every friend your bluff fooled — to every author of a merged bluff. Tied scores share a place on the podium.',
    ],
    challenges: [
      {
        title: 'Keeping every phone in sync',
        detail:
          'The server is the single source of truth: it pushes full room snapshots plus phase events, and phones only send intentions. Delayed transitions re-check the game state, so a phase can never start twice.',
      },
      {
        title: 'Keeping the answer secret',
        detail:
          'Vote options carry no authorship, and the correct answer only arrives in the results event. The old host debug panel, which could show answers mid-round, was removed — and a test checks it stays gone.',
      },
      {
        title: 'Surviving reloads and dropped phones',
        detail:
          'A seat is held for 60 seconds under a per-browser token that other players never see. Coming back restores the same seat, score, answer and vote; offline players aren’t waited for, and if the host leaves, the next connected player takes over.',
      },
      {
        title: 'One bad event can’t take a room down',
        detail:
          'Settings are whitelisted and clamped, text is trimmed and capped, and every socket handler and timer callback is wrapped, so a malformed event is logged instead of crashing the server. Player text is escaped wherever it is shown.',
      },
      {
        title: 'The same bluff, typed twice',
        detail:
          'Answers are normalised — case, spacing, punctuation, accents and harakat, Arabic letter variants, leading articles — so identical bluffs merge into one option with shared credit, and typing the real answer is caught when you submit.',
      },
    ],
    numbers: [
      { label: 'QUESTIONS', value: '325' },
      { label: 'LANGUAGES', value: 'AR · EN' },
      { label: 'TESTS', value: '23' },
      { label: 'INSTALL', value: 'NONE' },
    ],
    images: [
      img('kalak', 'overview.webp', 'Home, lobby with host settings, picking a topic and writing a bluff.'),
      img('kalak', 'round.webp', 'Voting among the bluffs, then the reveal: who fooled whom, points and scoreboard.'),
      img('kalak', 'final-podium.webp', 'The final podium.'),
    ],
  },

  'fog-chess': {
    pitch:
      'Real-time chess for two players on the same network where you can see where enemy pieces are — but never what they are — and each player sets up their army in secret.',
    problem:
      'A Kriegspiel-style variant with two twists: secret arrangements and private guess-pins. The hard requirement was that hidden information must never reach the browser, so nobody can cheat by opening the developer tools.',
    how: [
      'A Node.js + Express server with Socket.io; the static front end needs no build step.',
      'A match state machine moves through lobby → house-rules negotiation → secret setup → playing → game over, and routes each move to the right rules engine.',
      'Classic mode turns the two secret arrangements into a FEN position and plays it with chess.js; castling is allowed when king and rook start on their standard squares. Chaos mode uses its own engine with leap/slide move tables, fairy pieces, board sizes up to 10×10 and its own threefold-repetition and 50-move draws.',
      'Before every message, a fog module converts the true board into a per-player view: your pieces with their types, the opponent’s as “occupied”, and an anonymised move log. The full board is only sent at game over, for the final reveal.',
      'The server hands each seat a random token that the browser sends back in the Socket.io handshake: a reload within 60 seconds resumes the same seat, otherwise the player who stayed wins by abandonment.',
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
        title: 'Reconnecting without leaking the fog',
        detail:
          'A returning player is rebuilt through the same per-player filter as every other update — own pieces, “occupied” squares, an anonymised log — so resuming can’t reveal anything. Hidden piece types are never sent while the game runs (the reconnect tests assert every opponent square carries nothing but “occupied”), tokens come only from the server, and a third connection is refused while a seat is held.',
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
      { label: 'TESTS', value: '11' },
    ],
    images: [
      img('fog-chess', 'classic-game.jpg', 'A classic game from White’s fogged view: hidden enemy tokens, two private guess-pins and an anonymised move log paired White/Black.'),
      img('fog-chess', 'chaos-house-rules.jpg', 'House-rules negotiation: Chaos mode on a 10×8 board with four fairy pieces enabled.'),
      img('fog-chess', 'chaos-game.jpg', 'A Chaos game with a custom arrangement: your fairy pieces shown as lettered badges, the opponent’s hidden.'),
    ],
    status:
      'Work in progress: playable end to end on a local network in both modes, with reconnection. Still missing: rooms (one match per server for now) and clocks.',
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
      img('checkers', 'game.webp', 'A game from a share link: a Queen king selected, moves in purple, captures in red, with Flying, Knight and Crown kings on the board.'),
      img('checkers', 'settings.webp', 'The rules panel — board presets, default king mode, active king types and rule toggles.'),
      img('checkers', 'editor.webp', 'The board editor on a 10×10 board with mixed king types placed by hand.'),
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
      img('chesscipher', 'encrypt.webp', 'Encrypt mode: “MEET AT MIDNIGHT” hidden on the board, with the PGN-style filename that carries it.'),
      img('chesscipher', 'decrypt.webp', 'Decrypt mode: the filename decoded back to the message, with the letter-mapping overlay on.'),
      img('chesscipher', 'free-board.webp', 'Free Board: type with the keyboard and pieces place themselves.'),
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
      img('wordle', 'game.webp', 'A puzzle in progress with Timed and Reveal First modes stacked — countdown bar, coloured board and keyboard.'),
      img('wordle', 'share-link.webp', 'The creator’s mode grid and a freshly generated encrypted share link.'),
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
