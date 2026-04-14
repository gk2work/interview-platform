# AI Voice Interview Platform

A full-stack AI-powered voice interview platform where users upload their CV, configure interview parameters, and have real-time voice conversations with an AI interviewer.

## Tech Stack

- **Frontend:** Next.js 14 (App Router) + TypeScript + Tailwind CSS
- **Backend:** Next.js API Routes
- **AI Engine:** OpenAI GPT-4o
- **Speech:** Web Speech API (browser-native)
- **Database:** MongoDB + Mongoose
- **Containerization:** Docker + Docker Compose

## Prerequisites

- Node.js 20+
- npm/yarn
- Docker & Docker Compose
- OpenAI API key

## Quick Start

### 1. Setup Environment

```bash
cp .env.example .env.local
# Edit .env.local and add your OpenAI API key
# OPENAI_API_KEY=sk-your-key-here
```

### 2. Start MongoDB

```bash
docker-compose up -d mongodb
```

### 3. Install Dependencies

```bash
npm install
```

### 4. Run Development Server

```bash
npm run dev
```

Visit `http://localhost:3000`

## Usage

1. **Home Page** - Click "Start Interview" to begin
2. **Setup Page** - Upload CV (PDF) and configure interview parameters
3. **Interview Page** - Have a real-time voice conversation with AI
4. **Evaluation Page** - View detailed scores and feedback
5. **History Page** - See all past interviews

## Features

- ✅ PDF CV parsing and structured data extraction
- ✅ Real-time speech-to-text (Web Speech API)
- ✅ AI-powered interview conversations (OpenAI GPT-4o)
- ✅ Real-time text-to-speech responses
- ✅ Comprehensive evaluation scoring
- ✅ Interview history and past results
- ✅ Fully responsive design
- ✅ Dark theme optimized for long sessions

## Project Structure

```
app/
├── api/                 # API Routes
├── setup/              # CV upload & config
├── interview/[id]/     # Live interview
├── evaluation/[id]/    # Results & report
├── history/            # Past interviews
├── page.tsx            # Home page
└── layout.tsx          # Root layout

components/
├── ui/                 # Reusable components
├── interview/          # Interview-specific components
├── evaluation/         # Evaluation components
└── setup/              # Setup components

lib/
├── mongodb.ts          # DB connection
├── openai.ts           # GPT client
├── cv-parser.ts        # PDF parsing
├── prompt-builder.ts   # Interview prompts
├── evaluator.ts        # Evaluation logic
└── constants.ts        # Constants & configs

hooks/
├── useSpeechRecognition.ts
├── useSpeechSynthesis.ts
├── useTimer.ts
├── useAudioVisualizer.ts
└── useInterviewSession.ts

models/
├── Session.ts          # Interview session
├── Message.ts          # Chat messages
└── Evaluation.ts       # Evaluation results
```

## Configuration

### Environment Variables

```env
# OpenAI
OPENAI_API_KEY=sk-your-key-here
OPENAI_MODEL=gpt-4o

# MongoDB
MONGODB_URI=mongodb://localhost:27017/ai-interview

# App
NEXT_PUBLIC_APP_URL=http://localhost:3000
MAX_INTERVIEW_TURNS=25
```

### Interview Parameters

Supported interview types:

- Technical
- Behavioral
- HR Screening
- System Design
- Mixed

Difficulty levels:

- Junior
- Mid-Level
- Senior
- Lead/Principal

## API Endpoints

- `GET /api/health` - Health check
- `POST /api/upload-cv` - Upload and parse CV
- `GET /api/sessions` - List all sessions
- `POST /api/sessions` - Create new session
- `GET /api/sessions/[id]` - Get session details
- `POST /api/interview/chat` - Send message to AI
- `POST /api/interview/evaluate` - Generate evaluation

## Browser Support

- Chrome/Chromium (recommended)
- Edge
- Safari (with limited TTS support)
- Firefox (text-only mode)

## Future Enhancements

- [ ] Video recording
- [ ] Advanced D-ID animation avatar
- [ ] Multi-language support
- [ ] User authentication & profiles
- [ ] WebSocket real-time updates
- [ ] S3 file storage
- [ ] PDF report export
- [ ] Analytics dashboard
- [ ] Deepgram STT integration
- [ ] ElevenLabs TTS integration
- [ ] Real-time WebSocket connection

## Troubleshooting

**Microphone permission denied?**

- Check browser microphone permissions
- Ensure site is served over HTTPS (if deployed)

**Speech recognition not working?**

- Only works in Chrome/Edge/Safari
- Ensure you're on the latest browser version
- Check browser console for errors

**OpenAI API errors?**

- Verify API key is correct
- Check you have available API credits
- Monitor API usage in OpenAI dashboard

## Docker Deployment

```bash
# Build and run with Docker Compose
docker-compose up --build

# App runs on http://localhost:3000
# MongoDB runs on localhost:27017
```

## Performance Tips

- Keep interview questions concise (2-4 sentences)
- Clear browser cache if audio issues occur
- Use Chrome for best Web Speech API support
- Close other tabs for better speech recognition

## License

MIT

## Support

For issues or questions, check the browser console for detailed error messages.
