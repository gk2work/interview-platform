# FormalMock — AI Voice Interview Practice

A full-stack AI-powered voice interview platform where users sign up, upload their CV, configure interview parameters, and have real-time voice conversations with an AI interviewer named Meriam. At the end, they receive a detailed evaluation with scores and personalised feedback.

**Live:** https://formalmock.vercel.app

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | Next.js 14 (App Router) + TypeScript |
| Styling | Tailwind CSS (custom design system) |
| AI Engine | OpenAI GPT-4o |
| Speech I/O | Web Speech API (browser-native STT + TTS) |
| Database | MongoDB Atlas + Mongoose |
| Auth | NextAuth v4 — Google OAuth + Email/Password (bcrypt) |
| Deployment | Vercel (serverless) |

---

## Features

- **Google OAuth & Email/Password auth** — sign up, sign in, delete account
- **CV upload & parsing** — upload PDF, extracted in-memory with `pdf-parse`, sent to GPT-4o to structure candidate profile
- **AI interviewer (Meriam)** — GPT-4o conducts a contextual interview based on CV + role configuration
- **Real-time voice I/O** — browser Web Speech API for both speech recognition (mic) and speech synthesis (TTS)
- **Auto silence detection** — mic stays open for up to 150 s; auto-submits if user goes silent
- **Manual send** — "Send Response" button to submit early
- **Interview history** — all past sessions scoped per user
- **Evaluation report** — scored breakdown (communication, technical, problem-solving, etc.) with GPT-4o feedback
- **Fully responsive** — mobile-friendly dark UI

---

## Project Structure

```
├── app/
│   ├── page.tsx                  # Landing / marketing page
│   ├── layout.tsx                # Root layout (SessionProvider, metadata)
│   ├── login/page.tsx            # Sign-in: Google tab + Email tab
│   ├── signup/page.tsx           # Sign-up: Google + name/email/password form
│   ├── account/page.tsx          # Profile, stats, delete account
│   ├── setup/page.tsx            # CV upload + interview config (Step 1 & 2)
│   ├── interview/[sessionId]/    # Live voice interview page
│   ├── evaluation/[sessionId]/   # Evaluation report page
│   ├── history/page.tsx          # Past interviews list
│   ├── terms/page.tsx            # Terms of Service
│   ├── privacy/page.tsx          # Privacy Policy
│   └── api/
│       ├── auth/
│       │   ├── [...nextauth]/    # NextAuth handler
│       │   └── signup/          # POST — create email/password account
│       ├── upload-cv/           # POST — parse PDF CV in-memory
│       ├── sessions/
│       │   ├── route.ts         # GET list / POST create (user-scoped)
│       │   └── [sessionId]/     # GET session + ownership check
│       ├── interview/
│       │   ├── chat/            # POST — send message to GPT-4o
│       │   └── evaluate/        # POST — generate evaluation report
│       └── account/             # GET profile stats / DELETE full wipe
│
├── components/
│   ├── layout/
│   │   ├── Navbar.tsx           # Sticky nav: logo, history, avatar dropdown
│   │   ├── Footer.tsx           # Links, copyright 2026
│   │   └── SessionProvider.tsx  # Client wrapper for NextAuth
│   ├── ui/                      # Button, Card, Badge primitives
│   ├── setup/                   # CV uploader, config form components
│   ├── interview/               # Interview UI components
│   └── evaluation/              # Score cards, feedback components
│
├── hooks/
│   ├── useSpeechRecognition.ts  # Web Speech API mic (auto-restart on silence)
│   ├── useSpeechSynthesis.ts    # TTS with chunk-based Chrome workaround
│   ├── useInterviewSession.ts   # Session state + API calls
│   ├── useTimer.ts              # Elapsed timer
│   └── useAudioVisualizer.ts   # Mic level visualiser
│
├── models/
│   ├── User.ts                  # email, name, image, googleId?, password?
│   ├── Session.ts               # Interview session + userId ref
│   ├── Message.ts               # Chat messages per session
│   └── Evaluation.ts            # Scored evaluation report
│
├── lib/
│   ├── auth.ts                  # NextAuth config (Google + Credentials)
│   ├── mongodb.ts               # Mongoose connection (singleton)
│   ├── openai.ts                # OpenAI client
│   ├── cv-parser.ts             # PDF → structured candidate profile
│   ├── prompt-builder.ts        # System prompt constructor
│   ├── evaluator.ts             # Evaluation scoring logic
│   └── constants.ts             # Interview types, difficulty levels
│
├── middleware.ts                 # NextAuth route protection
├── types/next-auth.d.ts         # Extended Session/JWT types
└── .env.local                   # Local environment variables (not committed)
```

---

## Local Development

### Prerequisites

- Node.js 20+
- npm
- MongoDB Atlas account (or local MongoDB)
- OpenAI API key
- Google Cloud project with OAuth 2.0 credentials

### 1. Clone & install

```bash
git clone https://github.com/gk2work/interview-platform.git
cd interview-platform
npm install
```

### 2. Configure environment

```bash
cp .env.example .env.local
```

Edit `.env.local`:

```env
# OpenAI
OPENAI_API_KEY=sk-...
OPENAI_MODEL=gpt-4o

# MongoDB Atlas
MONGODB_URI=mongodb+srv://<user>:<pass>@cluster0.xxxxx.mongodb.net/ai-interview

# App
NEXT_PUBLIC_APP_URL=http://localhost:3000
MAX_INTERVIEW_TURNS=25

# NextAuth
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=<generate with: openssl rand -base64 32>

# Google OAuth
GOOGLE_CLIENT_ID=<from console.cloud.google.com>
GOOGLE_CLIENT_SECRET=<from console.cloud.google.com>
```

### 3. Run

```bash
npm run dev
```

Visit `http://localhost:3000`

---

## Deployment (Vercel)

1. Push to GitHub — Vercel auto-deploys on every push to `master`
2. In Vercel **Settings → Environment Variables**, add all keys from `.env.local` with `NEXTAUTH_URL=https://formalmock.vercel.app`
3. In Google Cloud Console → OAuth 2.0 credentials → add authorized redirect URI:
   ```
   https://formalmock.vercel.app/api/auth/callback/google
   ```

---

## API Endpoints

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| POST | `/api/auth/signup` | — | Create email/password account |
| POST | `/api/upload-cv` | Required | Parse PDF CV, return structured profile |
| GET | `/api/sessions` | Required | List user's interview sessions |
| POST | `/api/sessions` | Required | Create new interview session |
| GET | `/api/sessions/[id]` | Required | Get session (ownership enforced) |
| POST | `/api/interview/chat` | Required | Send user message, get AI response |
| POST | `/api/interview/evaluate` | Required | Generate scored evaluation |
| GET | `/api/account` | Required | Profile + session stats |
| DELETE | `/api/account` | Required | Delete all user data |

---

## Authentication

Two providers are supported:

**Google OAuth** — one-click sign-in. User record is upserted on first sign-in with name, email, and profile image.

**Email / Password** — sign up with name, email, and password (min 8 chars). Passwords are hashed with bcrypt (12 rounds). Existing Google accounts cannot be signed into via email/password and vice versa.

Sessions use JWT strategy (no database adapter). The JWT carries `userId` which is added to the session object via callbacks.

Protected routes (enforced by `middleware.ts`): `/setup`, `/interview/*`, `/evaluation/*`, `/history`, `/account`, and all `/api/sessions/*`, `/api/interview/*`, `/api/account/*` routes.

---

## Voice Architecture

**Speech Recognition** (`useSpeechRecognition.ts`)
- Uses `window.SpeechRecognition` (Chrome/Edge/Safari)
- `autoRestartRef` keeps the mic alive — recognition auto-restarts on browser silence events until `stopListening()` is explicitly called
- `stopListening()` sets `autoRestart = false` and fires a completion callback once recognition ends

**Speech Synthesis** (`useSpeechSynthesis.ts`)
- Text is split into sentences to avoid Chrome's 15-second utterance cut-off
- `cancelledRef` prevents a cancelled utterance's `onend` from continuing the chunk chain
- `stop()` sets `cancelledRef = true` before calling `cancel()` — safe to call at any point

**Interview flow**
1. First AI message is spoken by Meriam via TTS
2. On TTS end → mic opens, 150 s silence timer starts
3. User speaks (transcript accumulates in refs, not state, to avoid stale closures)
4. On "Send Response" click or silence timeout → `stopListening()` → `handleSendMessage()` fires
5. Transcript sent to `/api/interview/chat` → GPT-4o responds → TTS speaks response → repeat
6. When GPT-4o returns `[INTERVIEW_COMPLETE]` → redirect to evaluation page

---

## Interview Configuration

**Types:** Technical, Behavioral, HR Screening, System Design, Mixed

**Difficulty:** Junior, Mid-Level, Senior, Lead/Principal

**Max turns:** Configurable via `MAX_INTERVIEW_TURNS` env var (default 25)

---

## Browser Support

| Browser | Speech Recognition | Text-to-Speech |
|---------|-------------------|----------------|
| Chrome / Chromium | Full | Full |
| Edge | Full | Full |
| Safari | Partial | Partial |
| Firefox | Not supported | Supported |

Chrome is recommended for the best experience.

---

## Environment Variables Reference

| Variable | Required | Description |
|----------|----------|-------------|
| `OPENAI_API_KEY` | Yes | OpenAI secret key |
| `OPENAI_MODEL` | No | Model ID (default: `gpt-4o`) |
| `MONGODB_URI` | Yes | MongoDB connection string |
| `NEXT_PUBLIC_APP_URL` | Yes | Public app URL |
| `MAX_INTERVIEW_TURNS` | No | Max Q&A turns (default: 25) |
| `NEXTAUTH_URL` | Yes | Full URL of the app (for NextAuth) |
| `NEXTAUTH_SECRET` | Yes | Random secret for JWT signing |
| `GOOGLE_CLIENT_ID` | Yes | Google OAuth client ID |
| `GOOGLE_CLIENT_SECRET` | Yes | Google OAuth client secret |

---

## Troubleshooting

**Microphone not working?**
- Grant mic permission when the browser prompts
- Must be served over HTTPS in production (localhost is exempt)
- Chrome/Edge recommended — Firefox does not support `SpeechRecognition`

**Google sign-in fails?**
- Check `GOOGLE_CLIENT_ID` and `GOOGLE_CLIENT_SECRET` are set correctly
- Ensure `https://your-domain/api/auth/callback/google` is listed as an authorised redirect URI in Google Cloud Console

**Build fails on Vercel?**
- Make sure all environment variables are set in Vercel project settings
- `NEXTAUTH_URL` must be set to the production URL (not `localhost`)

**AI voice repeating / looping?**
- Only occurs if `cancelledRef` logic is broken — do not modify `useSpeechSynthesis.ts` without understanding the chunk chain

---

## License

MIT © 2026 FormalMock
