# AI Voice Interview Platform — Full Development Prompt for Claude Code

> **Paste this entire prompt into Claude Code to build the full platform.**

---

## PROJECT OVERVIEW

Build a full-stack **AI-powered voice interview platform** where users upload their CV/resume, configure interview parameters (company, role, designation, interview type), and then have a **real-time voice conversation** with an AI interviewer. The AI asks contextual questions based on the candidate's CV and target role, listens to spoken answers via speech-to-text, responds intelligently via text-to-speech, and delivers a scored evaluation report at the end.

**Tech Stack:**
- **Frontend:** Next.js 14 (App Router) + TypeScript + Tailwind CSS
- **Backend:** Next.js API Routes (for MVP simplicity, single codebase)
- **AI Engine:** OpenAI GPT API (chat completions endpoint) — using `gpt-4o` model
- **Speech-to-Text:** Web Speech API (browser-native, free)
- **Text-to-Speech:** Web Speech API (browser-native, free) — with architecture ready to swap to ElevenLabs later
- **Database:** MongoDB (via Mongoose ODM)
- **File Storage:** Local filesystem for MVP (`/public/uploads/`) — with architecture ready to swap to S3/Cloudinary later
- **CV Parsing:** `pdf-parse` npm package for PDF text extraction
- **Containerization:** Docker + Docker Compose for MongoDB and the app
- **Auth:** None for MVP (skip entirely)

---

## DIRECTORY STRUCTURE

```
ai-interview-platform/
├── docker-compose.yml
├── Dockerfile
├── .env.local
├── .env.example
├── package.json
├── tsconfig.json
├── tailwind.config.ts
├── next.config.js
├── README.md
│
├── src/
│   ├── app/
│   │   ├── layout.tsx                    # Root layout with fonts + global providers
│   │   ├── page.tsx                      # Landing/home page
│   │   ├── globals.css                   # Global styles + Tailwind
│   │   │
│   │   ├── setup/
│   │   │   └── page.tsx                  # Interview setup: CV upload + config form
│   │   │
│   │   ├── interview/
│   │   │   └── [sessionId]/
│   │   │       └── page.tsx              # Live voice interview screen
│   │   │
│   │   ├── evaluation/
│   │   │   └── [sessionId]/
│   │   │       └── page.tsx              # Post-interview evaluation/report
│   │   │
│   │   ├── history/
│   │   │   └── page.tsx                  # Past interviews list
│   │   │
│   │   └── api/
│   │       ├── upload-cv/
│   │       │   └── route.ts              # POST: Upload + parse CV
│   │       ├── sessions/
│   │       │   ├── route.ts              # POST: Create session | GET: List sessions
│   │       │   └── [sessionId]/
│   │       │       └── route.ts          # GET: Get session details
│   │       ├── interview/
│   │       │   ├── chat/
│   │       │   │   └── route.ts          # POST: Send message to AI, get response
│   │       │   └── evaluate/
│   │       │       └── route.ts          # POST: Generate evaluation from transcript
│   │       └── health/
│   │           └── route.ts              # GET: Health check
│   │
│   ├── components/
│   │   ├── ui/                           # Reusable UI primitives
│   │   │   ├── Button.tsx
│   │   │   ├── Card.tsx
│   │   │   ├── Input.tsx
│   │   │   ├── Select.tsx
│   │   │   ├── Badge.tsx
│   │   │   ├── Progress.tsx
│   │   │   ├── Textarea.tsx
│   │   │   └── FileUpload.tsx
│   │   │
│   │   ├── setup/
│   │   │   ├── CVUploader.tsx            # Drag-drop CV upload with preview
│   │   │   ├── InterviewConfigForm.tsx   # Company, role, type, difficulty config
│   │   │   └── CVPreview.tsx             # Parsed CV content preview
│   │   │
│   │   ├── interview/
│   │   │   ├── VoiceInterviewPanel.tsx   # Main interview UI (mic button, transcript, status)
│   │   │   ├── AudioVisualizer.tsx       # Waveform animation while speaking/listening
│   │   │   ├── TranscriptDisplay.tsx     # Scrolling conversation transcript
│   │   │   ├── InterviewTimer.tsx        # Elapsed time counter
│   │   │   ├── InterviewControls.tsx     # Start/pause/end buttons
│   │   │   └── AIAvatarDisplay.tsx       # Visual representation of AI interviewer (animated circle/pulse)
│   │   │
│   │   ├── evaluation/
│   │   │   ├── ScoreCard.tsx             # Individual category score display
│   │   │   ├── OverallReport.tsx         # Full evaluation report
│   │   │   ├── RadarChart.tsx            # Skills radar chart (using recharts)
│   │   │   ├── StrengthsWeaknesses.tsx   # Strengths + areas to improve
│   │   │   └── TranscriptReview.tsx      # Full interview transcript with highlights
│   │   │
│   │   └── layout/
│   │       ├── Header.tsx
│   │       ├── Footer.tsx
│   │       └── StepIndicator.tsx         # Setup → Interview → Evaluation progress
│   │
│   ├── hooks/
│   │   ├── useSpeechRecognition.ts       # Web Speech API STT hook
│   │   ├── useSpeechSynthesis.ts         # Web Speech API TTS hook
│   │   ├── useInterviewSession.ts        # Interview state management
│   │   ├── useAudioVisualizer.ts         # Mic input visualization
│   │   └── useTimer.ts                   # Interview timer
│   │
│   ├── lib/
│   │   ├── mongodb.ts                    # MongoDB connection singleton
│   │   ├── openai.ts                     # OpenAI client setup
│   │   ├── cv-parser.ts                  # PDF text extraction logic
│   │   ├── prompt-builder.ts             # Builds system prompts for interview AI
│   │   ├── evaluator.ts                  # Builds evaluation prompts + parses scores
│   │   └── constants.ts                  # Interview types, difficulty levels, etc.
│   │
│   ├── models/
│   │   ├── Session.ts                    # Mongoose schema: interview session
│   │   ├── Message.ts                    # Mongoose schema: individual messages
│   │   └── Evaluation.ts                 # Mongoose schema: evaluation results
│   │
│   └── types/
│       └── index.ts                      # TypeScript interfaces and types
│
└── public/
    └── uploads/                          # CV file storage (gitignored)
```

---

## ENVIRONMENT VARIABLES (.env.local)

```env
# OpenAI
OPENAI_API_KEY=sk-your-openai-api-key-here
OPENAI_MODEL=gpt-4o

# MongoDB
MONGODB_URI=mongodb://localhost:27017/ai-interview

# App
NEXT_PUBLIC_APP_URL=http://localhost:3000
MAX_INTERVIEW_TURNS=25
```

---

## DOCKER SETUP

### docker-compose.yml

```yaml
version: "3.8"
services:
  mongodb:
    image: mongo:7
    container_name: interview-mongo
    ports:
      - "27017:27017"
    volumes:
      - mongo-data:/data/db
    restart: unless-stopped

  app:
    build: .
    container_name: interview-app
    ports:
      - "3000:3000"
    environment:
      - MONGODB_URI=mongodb://mongodb:27017/ai-interview
      - OPENAI_API_KEY=${OPENAI_API_KEY}
      - OPENAI_MODEL=gpt-4o
    depends_on:
      - mongodb
    volumes:
      - ./public/uploads:/app/public/uploads
    restart: unless-stopped

volumes:
  mongo-data:
```

### Dockerfile

```dockerfile
FROM node:20-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build
EXPOSE 3000
CMD ["npm", "start"]
```

---

## DATABASE SCHEMAS (Mongoose)

### Session Schema
```typescript
{
  // Auto-generated _id
  candidateName: String,           // optional for MVP
  cvFileName: String,              // original filename
  cvFilePath: String,              // path on disk
  cvParsedText: String,            // extracted text from CV
  cvStructuredData: {              // AI-parsed structured data
    name: String,
    email: String,
    phone: String,
    skills: [String],
    experience: [{
      title: String,
      company: String,
      duration: String,
      description: String
    }],
    education: [{
      degree: String,
      institution: String,
      year: String
    }]
  },
  interviewConfig: {
    company: String,               // e.g. "Google"
    designation: String,           // e.g. "Senior Frontend Engineer"
    interviewType: {               // enum
      type: String,
      enum: ["Technical", "Behavioral", "HR Screening", "System Design", "Mixed"]
    },
    difficulty: {                  // enum
      type: String,
      enum: ["Junior", "Mid-Level", "Senior", "Lead/Principal"]
    },
    jobDescription: String,        // optional pasted JD
    additionalContext: String      // any extra instructions
  },
  status: {                        // enum
    type: String,
    enum: ["setup", "in-progress", "completed", "evaluated"],
    default: "setup"
  },
  systemPrompt: String,            // the full system prompt sent to GPT
  totalTurns: Number,              // how many Q&A exchanges happened
  startedAt: Date,
  completedAt: Date,
  createdAt: Date,                 // auto via timestamps
  updatedAt: Date                  // auto via timestamps
}
```

### Message Schema
```typescript
{
  sessionId: ObjectId,             // ref to Session
  role: {                          // enum
    type: String,
    enum: ["system", "interviewer", "candidate"]
  },
  content: String,                 // the text content
  audioUrl: String,                // optional: path to audio file if we save it later
  turnNumber: Number,              // sequential turn count
  timestamp: Date
}
```

### Evaluation Schema
```typescript
{
  sessionId: ObjectId,             // ref to Session (unique)
  scores: {
    technicalKnowledge: { score: Number, maxScore: 10, feedback: String },
    communication: { score: Number, maxScore: 10, feedback: String },
    problemSolving: { score: Number, maxScore: 10, feedback: String },
    culturalFit: { score: Number, maxScore: 10, feedback: String },
    relevantExperience: { score: Number, maxScore: 10, feedback: String },
    confidence: { score: Number, maxScore: 10, feedback: String }
  },
  overallScore: Number,            // average out of 10
  overallGrade: String,            // "A+", "A", "B+", etc.
  recommendation: {                // enum
    type: String,
    enum: ["Strong Hire", "Hire", "Lean Hire", "Lean No Hire", "No Hire"]
  },
  strengths: [String],             // top 3-5 strengths
  improvements: [String],          // top 3-5 areas to improve
  detailedFeedback: String,        // paragraph-form detailed feedback
  suggestedTopics: [String],       // things to study/improve
  createdAt: Date
}
```

---

## CORE LOGIC: AI SYSTEM PROMPT BUILDER

This is the most critical piece. The function `buildSystemPrompt()` in `src/lib/prompt-builder.ts` takes the session data and produces the system prompt for GPT. Here is the exact prompt template:

```typescript
function buildSystemPrompt(session: Session): string {
  return `
You are an expert interviewer conducting a ${session.interviewConfig.interviewType} interview at ${session.interviewConfig.company} for the role of ${session.interviewConfig.designation}.

## YOUR ROLE
- You are a senior interviewer with 15+ years of hiring experience
- You are professional, warm but thorough, and structured
- You ask one question at a time and wait for the candidate's response
- You adapt your follow-up questions based on the candidate's answers
- You probe deeper when answers are vague or surface-level
- You never reveal the "correct" answer or coach the candidate during the interview

## CANDIDATE'S CV/RESUME
<cv>
${session.cvParsedText}
</cv>

${session.cvStructuredData ? `
## PARSED CV DATA
- Name: ${session.cvStructuredData.name || 'Not provided'}
- Skills: ${session.cvStructuredData.skills?.join(', ') || 'Not provided'}
- Experience: ${session.cvStructuredData.experience?.map(e => `${e.title} at ${e.company} (${e.duration})`).join('; ') || 'Not provided'}
- Education: ${session.cvStructuredData.education?.map(e => `${e.degree} from ${e.institution}`).join('; ') || 'Not provided'}
` : ''}

## INTERVIEW PARAMETERS
- Company: ${session.interviewConfig.company}
- Position: ${session.interviewConfig.designation}
- Interview Type: ${session.interviewConfig.interviewType}
- Difficulty Level: ${session.interviewConfig.difficulty}
${session.interviewConfig.jobDescription ? `- Job Description: ${session.interviewConfig.jobDescription}` : ''}
${session.interviewConfig.additionalContext ? `- Additional Context: ${session.interviewConfig.additionalContext}` : ''}

## INTERVIEW STRUCTURE
Follow this phased approach:

### Phase 1: Opening (1-2 questions)
- Greet the candidate warmly and introduce yourself
- Ask them to briefly introduce themselves and what interests them about this role at ${session.interviewConfig.company}
- This helps the candidate settle in

### Phase 2: CV Deep-Dive (2-3 questions)
- Ask about specific projects, roles, or achievements from their CV
- Look for inconsistencies or gaps and gently probe them
- Ask "Tell me more about..." or "What was your specific contribution to..."

### Phase 3: Role-Specific Questions (4-6 questions)
${getPhase3Instructions(session.interviewConfig.interviewType, session.interviewConfig.difficulty)}

### Phase 4: Behavioral / Situational (2-3 questions)
- Use STAR format questions (Situation, Task, Action, Result)
- Examples: "Tell me about a time when...", "How would you handle..."
- Adapt based on the role level and type

### Phase 5: Closing (1-2 questions)
- Ask if the candidate has any questions about the role or company
- Thank them for their time
- When you're ready to end, include the exact text "[INTERVIEW_COMPLETE]" at the end of your final message

## RULES
1. Ask ONE question at a time — never stack multiple questions
2. Keep your responses concise (2-4 sentences max per turn, since this is voice)
3. Reference specific items from their CV to show you've read it
4. If the candidate gives a weak answer, ask a follow-up to give them a chance to elaborate
5. Track what you've already asked — never repeat questions
6. Adjust difficulty based on how the candidate is performing
7. Be conversational and natural — this is a voice interview, not a written exam
8. After approximately ${process.env.MAX_INTERVIEW_TURNS || 15} total exchanges, begin wrapping up
9. NEVER break character — you are the interviewer, not an AI assistant
10. When the interview is complete, include "[INTERVIEW_COMPLETE]" in your final message
`;
}

function getPhase3Instructions(type: string, difficulty: string): string {
  const instructions: Record<string, string> = {
    "Technical": `
- Ask coding/architecture questions appropriate for ${difficulty} level
- Include at least one system design or problem-solving question
- Ask about their experience with specific technologies mentioned in their CV
- Ask them to explain a complex technical concept in simple terms`,

    "Behavioral": `
- Focus on leadership, teamwork, conflict resolution, and communication
- Ask about their most challenging professional situation
- Probe for self-awareness and growth mindset
- Ask how they handle feedback and failure`,

    "HR Screening": `
- Assess cultural fit and motivation
- Ask about salary expectations and availability
- Discuss career goals and why they want this specific role
- Ask about their preferred work environment and management style`,

    "System Design": `
- Present a system design problem relevant to the company
- Ask them to walk through their approach step by step
- Probe for scalability, reliability, and trade-off considerations
- Ask about database choices, API design, and caching strategies`,

    "Mixed": `
- Combine technical, behavioral, and cultural fit questions
- Start with technical to assess skills, then shift to behavioral
- Include at least one scenario-based question
- End with cultural and motivation questions`
  };
  return instructions[type] || instructions["Mixed"];
}
```

---

## CORE LOGIC: EVALUATION PROMPT

After the interview completes, send the full transcript to GPT with this prompt:

```typescript
function buildEvaluationPrompt(session: Session, messages: Message[]): string {
  const transcript = messages
    .filter(m => m.role !== 'system')
    .map(m => `${m.role === 'interviewer' ? 'Interviewer' : 'Candidate'}: ${m.content}`)
    .join('\n\n');

  return `
You are an expert interview evaluator. Analyze the following interview transcript and provide a detailed evaluation.

## CONTEXT
- Company: ${session.interviewConfig.company}
- Position: ${session.interviewConfig.designation}
- Interview Type: ${session.interviewConfig.interviewType}
- Difficulty Level: ${session.interviewConfig.difficulty}

## CANDIDATE'S CV
<cv>
${session.cvParsedText}
</cv>

## INTERVIEW TRANSCRIPT
<transcript>
${transcript}
</transcript>

## YOUR TASK
Evaluate the candidate and respond with ONLY valid JSON (no markdown, no backticks):

{
  "scores": {
    "technicalKnowledge": { "score": <1-10>, "feedback": "<2-3 sentence justification>" },
    "communication": { "score": <1-10>, "feedback": "<2-3 sentence justification>" },
    "problemSolving": { "score": <1-10>, "feedback": "<2-3 sentence justification>" },
    "culturalFit": { "score": <1-10>, "feedback": "<2-3 sentence justification>" },
    "relevantExperience": { "score": <1-10>, "feedback": "<2-3 sentence justification>" },
    "confidence": { "score": <1-10>, "feedback": "<2-3 sentence justification>" }
  },
  "overallScore": <average of all scores, 1 decimal>,
  "overallGrade": "<A+/A/A-/B+/B/B-/C+/C/C-/D/F>",
  "recommendation": "<Strong Hire | Hire | Lean Hire | Lean No Hire | No Hire>",
  "strengths": ["<strength 1>", "<strength 2>", "<strength 3>"],
  "improvements": ["<improvement 1>", "<improvement 2>", "<improvement 3>"],
  "detailedFeedback": "<A comprehensive 3-5 sentence paragraph giving overall feedback, tone of the interview, and specific advice>",
  "suggestedTopics": ["<topic 1>", "<topic 2>", "<topic 3>"]
}

## SCORING GUIDE
- 9-10: Exceptional — clearly exceeds expectations for the role
- 7-8: Strong — meets and sometimes exceeds expectations
- 5-6: Average — meets basic requirements but lacks depth
- 3-4: Below Average — significant gaps or concerns
- 1-2: Poor — major red flags or inability to answer

Be fair but honest. Base scores only on evidence from the transcript.
`;
}
```

---

## VOICE HOOKS IMPLEMENTATION

### useSpeechRecognition.ts
```typescript
// Key requirements:
// - Use webkitSpeechRecognition (Chrome) or SpeechRecognition
// - Set continuous = false (stop after one utterance)
// - Set interimResults = true (show words as they're spoken)
// - Set lang = "en-US"
// - Return: { transcript, interimTranscript, isListening, startListening, stopListening, error }
// - Auto-restart if it stops unexpectedly mid-sentence
// - Handle the "no-speech" error gracefully (just show "I didn't catch that")
// - Handle browser compatibility — show clear error if Speech API not available
```

### useSpeechSynthesis.ts
```typescript
// Key requirements:
// - Use window.speechSynthesis
// - Select a natural-sounding voice (prefer Google US English or similar)
// - Set rate = 1.0, pitch = 1.0
// - Return: { speak, stop, isSpeaking, isPaused, voices }
// - Handle the Chrome bug where synthesis stops after ~15 seconds
//   (workaround: split long text into sentences and chain them)
// - Cancel any in-progress speech before starting new speech
// - Emit onEnd callback when speech finishes (to re-enable mic)
```

---

## API ROUTE SPECIFICATIONS

### POST /api/upload-cv
- Accepts: multipart/form-data with a PDF file
- Parses PDF text using `pdf-parse`
- Saves file to `/public/uploads/{timestamp}-{filename}`
- Optionally: sends extracted text to GPT to get structured CV data (name, skills, experience)
- Returns: `{ filePath, parsedText, structuredData }`

### POST /api/sessions
- Accepts: `{ cvFilePath, cvParsedText, cvStructuredData, interviewConfig }`
- Creates a new Session document in MongoDB
- Builds the system prompt using `buildSystemPrompt()`
- Creates the initial system message in Messages collection
- Creates the first interviewer message (greeting) by calling GPT
- Returns: `{ sessionId, firstMessage }`

### GET /api/sessions
- Returns: list of all sessions (for history page), sorted by createdAt desc

### GET /api/sessions/[sessionId]
- Returns: full session document + all messages + evaluation (if exists)

### POST /api/interview/chat
- Accepts: `{ sessionId, message }` (the candidate's spoken text)
- Fetches all previous messages for this session from MongoDB
- Sends full conversation history to GPT with the session's system prompt
- Saves both the candidate message and the AI response to MongoDB
- Detects if response contains "[INTERVIEW_COMPLETE]" → updates session status
- Returns: `{ response, isComplete, turnNumber }`

### POST /api/interview/evaluate
- Accepts: `{ sessionId }`
- Fetches session + all messages
- Calls GPT with the evaluation prompt
- Parses JSON response and saves to Evaluation collection
- Updates session status to "evaluated"
- Returns: the evaluation object

### GET /api/health
- Returns: `{ status: "ok", mongodb: "connected" | "disconnected" }`

---

## UI/UX SPECIFICATIONS

### Design System
- **Font:** "DM Sans" for body, "Space Grotesk" for headings (import from Google Fonts)
- **Color palette:** Dark theme with deep navy (#0A0F1C) background, electric blue (#3B82F6) accents, emerald (#10B981) for positive states, amber (#F59E0B) for warnings, rose (#F43F5E) for errors
- **Border radius:** 12px for cards, 8px for inputs, full-round for buttons where appropriate
- **Shadows:** Soft, layered: `0 4px 6px -1px rgba(0,0,0,0.3), 0 2px 4px -2px rgba(0,0,0,0.3)`

### Page: Home (/)
- Hero section with app title, tagline, and "Start Interview" CTA button
- Brief "How it works" section: 3 steps (Upload CV → Configure → Interview)
- Link to interview history

### Page: Setup (/setup)
- **Step 1:** CV Upload
  - Drag-and-drop zone or click-to-browse
  - Accepts only PDF
  - Shows upload progress, then displays parsed CV preview (name, skills, experience extracted)
  - "Re-upload" option if wrong file
- **Step 2:** Interview Configuration
  - Company name (text input, required)
  - Designation/Role (text input, required)
  - Interview type (dropdown: Technical, Behavioral, HR Screening, System Design, Mixed)
  - Difficulty level (radio buttons: Junior, Mid-Level, Senior, Lead/Principal)
  - Job description (optional textarea — paste JD for extra context)
  - Additional instructions (optional textarea)
- **"Start Interview" button** → creates session → redirects to /interview/[sessionId]

### Page: Interview (/interview/[sessionId])
This is the main experience. Layout:

```
┌─────────────────────────────────────────────┐
│  Header: Company | Role | Timer             │
├─────────────────────────────────────────────┤
│                                             │
│         ┌─────────────────────┐             │
│         │                     │             │
│         │   AI AVATAR AREA    │             │
│         │  (pulsing circle    │             │
│         │   with waveform     │             │
│         │   when AI speaks)   │             │
│         │                     │             │
│         └─────────────────────┘             │
│                                             │
│  ┌─────────────────────────────────────┐    │
│  │       TRANSCRIPT AREA               │    │
│  │  (scrolling conversation log)       │    │
│  │                                     │    │
│  │  AI: Welcome! Tell me about...      │    │
│  │  You: I have 5 years of experience  │    │
│  │  AI: Interesting, can you tell me...│    │
│  │                                     │    │
│  └─────────────────────────────────────┘    │
│                                             │
│         [  STATUS INDICATOR  ]              │
│  "Listening..." / "AI is thinking..."       │
│         / "AI is speaking..."               │
│                                             │
│     ┌──────────┐  ┌────────────────┐        │
│     │  🎤 MIC  │  │  END INTERVIEW │        │
│     └──────────┘  └────────────────┘        │
│                                             │
└─────────────────────────────────────────────┘
```

- **AI Avatar:** Large animated circle in the center. Pulses/glows blue when AI is speaking. Dims when listening. Shows waveform/particle animation.
- **Transcript:** Scrolling list below the avatar. AI messages left-aligned (blue), candidate messages right-aligned (white/gray). Auto-scrolls to bottom.
- **Status indicator:** Clear text showing current state:
  - "🎤 Listening..." (green pulse) — mic is active
  - "⏳ Processing..." (amber) — waiting for GPT response
  - "🔊 Speaking..." (blue pulse) — AI TTS is playing
  - "Click mic to respond" (neutral) — waiting for user
- **Mic button:** Large, prominent. Tap to start speaking, tap again to stop. Or auto-stops after silence.
- **End Interview button:** Secondary button to manually end early → triggers evaluation.

#### Voice Flow State Machine:
```
IDLE → (user clicks mic) → LISTENING → (user stops / silence detected) →
PROCESSING → (GPT responds) → SPEAKING → (TTS finishes) → IDLE
```

- When in IDLE state after AI speaks, auto-prompt user: "Your turn — click the mic to respond"
- If the AI's response contains "[INTERVIEW_COMPLETE]", strip that marker before TTS, show "Interview Complete!" modal, and redirect to evaluation page after 3 seconds

### Page: Evaluation (/evaluation/[sessionId])
- **Overall Score:** Large score display (e.g., "7.8 / 10") with grade badge ("B+")
- **Recommendation badge:** Color-coded (Strong Hire = green, Hire = teal, Lean Hire = amber, Lean No Hire = orange, No Hire = red)
- **Radar chart:** 6-axis chart showing scores for each category (use recharts)
- **Score breakdown:** 6 cards, one per category, showing score bar + feedback text
- **Strengths section:** Green-accented list of top strengths
- **Improvements section:** Amber-accented list of areas to improve
- **Detailed feedback:** Full paragraph of feedback
- **Suggested study topics:** List of things to improve on
- **Full transcript:** Expandable/collapsible section showing the entire conversation
- **Actions:** "Start New Interview" button, "Download Report" button (generates a simple text/markdown report)

### Page: History (/history)
- List of past interview sessions as cards
- Each card shows: company, role, date, status, overall score (if evaluated)
- Click a card to view its evaluation page
- Sort by date, filter by status

---

## CRITICAL IMPLEMENTATION DETAILS

### Voice Loop (most important to get right)

In `VoiceInterviewPanel.tsx`, the interview follows this exact loop:

1. **On mount:** Fetch the session and load existing messages. If no messages yet, the first AI message is the greeting (returned when session was created).
2. **Play AI greeting via TTS.**
3. **After TTS finishes → set state to IDLE.** Show "Click mic to respond."
4. **User clicks mic → start SpeechRecognition.** Show interim transcript in real-time.
5. **User clicks mic again OR silence detected → stop SpeechRecognition.**
6. **Send final transcript to POST /api/interview/chat.**
7. **Show "Processing..." state while waiting.**
8. **Receive AI response → play via TTS.** Show text in transcript.
9. **After TTS finishes → check if interview is complete.** If yes, redirect. If no, go to step 4.

### Error Handling
- If Web Speech API is not supported → show clear banner: "Voice interviews require Chrome or Edge browser"
- If mic permission denied → show instructions to enable mic
- If GPT API fails → show "Connection issue, retrying..." and retry once
- If TTS fails → show the text response anyway, let user read it

### Performance
- Don't send the entire message history to GPT every turn — keep a sliding window of the last 20 messages plus the system prompt, to stay within token limits
- Debounce the "stop listening" detection by 1.5 seconds of silence
- Pre-select TTS voice on page load to avoid delay on first speak

---

## NPM PACKAGES NEEDED

```json
{
  "dependencies": {
    "next": "^14.2.0",
    "react": "^18.3.0",
    "react-dom": "^18.3.0",
    "mongoose": "^8.0.0",
    "openai": "^4.50.0",
    "pdf-parse": "^1.1.1",
    "recharts": "^2.12.0",
    "lucide-react": "^0.400.0",
    "framer-motion": "^11.0.0",
    "formidable": "^3.5.0",
    "tailwind-merge": "^2.3.0"
  },
  "devDependencies": {
    "typescript": "^5.4.0",
    "@types/node": "^20.0.0",
    "@types/react": "^18.3.0",
    "tailwindcss": "^3.4.0",
    "postcss": "^8.4.0",
    "autoprefixer": "^10.4.0",
    "@types/formidable": "^3.4.0"
  }
}
```

---

## STEP-BY-STEP BUILD ORDER

Follow this exact order to build the platform:

1. **Initialize project:** `npx create-next-app@14 ai-interview-platform --typescript --tailwind --app`
2. **Set up Docker:** Create `docker-compose.yml` and start MongoDB: `docker-compose up -d mongodb`
3. **Install dependencies:** All npm packages listed above
4. **Set up env:** Create `.env.local` with all variables
5. **Database layer:** `src/lib/mongodb.ts` connection + all 3 Mongoose models
6. **OpenAI client:** `src/lib/openai.ts`
7. **CV Parser:** `src/lib/cv-parser.ts`
8. **Prompt builder:** `src/lib/prompt-builder.ts` (system prompt + evaluation prompt)
9. **API routes:** Build all 6 API routes in order: health → upload-cv → sessions → sessions/[id] → interview/chat → interview/evaluate
10. **UI components:** Build reusable UI primitives first (Button, Card, Input, etc.)
11. **Setup page:** CV upload + config form + session creation
12. **Voice hooks:** `useSpeechRecognition` + `useSpeechSynthesis`
13. **Interview page:** The full voice interview experience
14. **Evaluation page:** Score display + radar chart + full report
15. **History page:** Past interviews list
16. **Home page:** Landing page with navigation
17. **Layout:** Header, footer, step indicator
18. **Docker:** Add Dockerfile for the app
19. **Testing:** Manual end-to-end test of the full flow
20. **README:** Setup instructions, env vars, how to run

---

## ADDITIONAL NOTES

- **No authentication** — anyone can use the app. Sessions are not tied to users.
- **OpenAI key** is the ONLY paid dependency. Everything else is free or self-hosted.
- **Web Speech API** only works in Chrome/Edge. Add a browser check on the interview page.
- **MongoDB** runs in Docker locally. No cloud DB needed for MVP.
- The `[INTERVIEW_COMPLETE]` marker is how the AI signals it's done. Strip it from displayed text and TTS.
- Keep all AI responses SHORT (2-4 sentences) since they'll be spoken aloud. Long responses feel unnatural in voice.
- The system prompt should instruct GPT to never say "As an AI" or break character.
- For the evaluation, parse GPT's JSON response carefully — wrap in try/catch and retry once if parsing fails.

---

## FUTURE ENHANCEMENTS (not for MVP, but architect for them)

- Swap Web Speech API → Deepgram for better STT accuracy
- Swap Web Speech API TTS → ElevenLabs for natural voice
- Add animated avatar face (D-ID or HeyGen)
- Add user authentication (Clerk)
- Add PDF report export
- Add video recording of the interview
- Add real-time WebSocket connection instead of REST polling
- Add multi-language support
- Move file storage to S3/Cloudinary
- Move MongoDB to Atlas for cloud deployment
