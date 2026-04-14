# AI Voice Interview Platform - Quick Start Guide

## 🚀 Getting Started

Your AI Voice Interview Platform is now fully built and ready to use!

### Prerequisites

- Node.js 20+ (✅ Already installed packages)
- MongoDB running (use Docker)
- OpenAI API key

### Step 1: Configure Environment

```bash
# Edit .env.local and add your OpenAI API key
export OPENAI_API_KEY="sk-your-key-here"
```

### Step 2: Start MongoDB (if not already running)

```bash
docker-compose up -d mongodb
# MongoDB will run on localhost:27017
```

### Step 3: Start Development Server

```bash
# Terminal 1: Already running on port 3002
# If stopped, restart with:
npm run dev
```

### Step 4: Access the App

Open your browser and navigate to:

```
http://localhost:3002
```

## 📋 User Flow

```
1. Home (/) → Overview + "Start Interview" CTA
   ↓
2. Setup (/setup) →
   - Upload CV (PDF)
   - Configure company, role, type, difficulty
   ↓
3. Interview (/interview/[id]) →
   - Real-time voice conversation with AI
   - Click mic to speak, AI responds
   - Interview auto-completes after ~15-25 turns
   ↓
4. Evaluation (/evaluation/[id]) →
   - Scores (6 categories, overall grade)
   - Strengths/improvements
   - Detailed feedback
   - Study recommendations
   ↓
5. History (/history) →
   - View all past interviews
   - Track progress over time
```

## 🛠️ Project Structure

```
/app
  /api                    # Backend API routes
  /setup                  # CV upload + config
  /interview/[sessionId]  # Voice interview UI
  /evaluation/[sessionId] # Results & report
  /history                # Past interviews
  /layout.tsx             # Root layout
  /page.tsx               # Home page
  /globals.css            # Global styles

/components
  /ui                     # Reusable UI (Button, Card, Input, etc.)
  /interview              # Interview-specific components
  /setup                  # Setup components
  /evaluation             # Results components

/lib
  /mongodb.ts             # DB connection
  /openai.ts              # GPT client
  /cv-parser.ts           # PDF text extraction
  /prompt-builder.ts      # Interview prompts
  /evaluator.ts           # Evaluation scoring
  /constants.ts           # Configs & enums

/hooks
  /useSpeechRecognition.ts    # STT via Web Speech API
  /useSpeechSynthesis.ts      # TTS via Web Speech API
  /useTimer.ts                # Interview timer
  /useAudioVisualizer.ts      # Microphone waveform
  /useInterviewSession.ts     # Interview state

/models
  /Session.ts             # Interview sessions
  /Message.ts             # Chat messages
  /Evaluation.ts          # Results & scores
```

## 🔑 API Endpoints

| Method | Endpoint                  | Purpose                       |
| ------ | ------------------------- | ----------------------------- |
| GET    | `/api/health`             | Health check                  |
| POST   | `/api/upload-cv`          | Upload & parse PDF CV         |
| GET    | `/api/sessions`           | List all sessions             |
| POST   | `/api/sessions`           | Create new interview session  |
| GET    | `/api/sessions/[id]`      | Get session details           |
| POST   | `/api/interview/chat`     | Send message, get AI response |
| POST   | `/api/interview/evaluate` | Generate evaluation           |

## 🎯 Key Features

✅ **Voice Interaction**

- Real-time speech recognition (Web Speech API)
- Automatic text-to-speech responses
- Waveform visualization while speaking

✅ **Smart AI Interviewer**

- 5 interview types: Technical, Behavioral, HR, System Design, Mixed
- 4 difficulty levels: Junior, Mid-Level, Senior, Lead/Principal
- Contextual questions from your CV
- Adaptive follow-ups based on answers

✅ **Comprehensive Evaluation**

- 6 scoring categories
- Overall grade (A+, A, B+, B, C, D, F)
- Hiring recommendation
- Strengths & improvement areas
- Personalized feedback

✅ **Full Interview Management**

- Upload CV (PDF), auto-parse
- Configure custom scenarios
- View complete transcripts
- Access all past interviews

## 🚨 Troubleshooting

**Issue: Microphone not working?**

- Ensure browser is Chrome, Edge, or Safari
- Check microphone permissions
- Allow site access to microphone

**Issue: API not responding?**

- Verify MongoDB is running: `mongodb://localhost:27017`
- Check OpenAI API key in `.env.local`
- Review browser console for detailed errors

**Issue: Port 3002 already in use?**

```bash
# Kill the process
pkill -f "next dev"
# Or use a different port
PORT=3001 npm run dev
```

**Issue: Build errors?**

```bash
# Clear cache and rebuild
rm -rf .next
npm run build
```

## 📊 Testing the App

### Manual Test Flow

1. Visit `http://localhost:3002`
2. Click "Start Interview"
3. Upload a sample PDF (create one or use any PDF)
4. Fill in company, role, type, difficulty
5. Click "Start Interview"
6. Speak naturally (mic required)
7. Listen to AI responses
8. Evaluate your performance

### Sample Input

- Company: "Google"
- Role: "Senior Frontend Engineer"
- Type: "Technical"
- Difficulty: "Senior"

## 🐳 Docker Deployment

```bash
# Build and run entire stack
docker-compose up --build

# App: http://localhost:3000
# MongoDB: localhost:27017

# Stop everything
docker-compose down
```

## 📝 Environment Variables

```env
# Required
OPENAI_API_KEY=sk-your-key-here
MONGODB_URI=mongodb://localhost:27017/ai-interview

# Optional
OPENAI_MODEL=gpt-4o              # Default model
MAX_INTERVIEW_TURNS=25           # Interview length
NEXT_PUBLIC_APP_URL=http://localhost:3002
```

## 🔮 Future Enhancements

- [ ] Video recording of interviews
- [ ] Animated AI avatar (D-ID)
- [ ] Multi-language support
- [ ] User authentication & cloud save
- [ ] WebSocket real-time updates
- [ ] Deepgram STT (better accuracy)
- [ ] ElevenLabs TTS (natural voices)
- [ ] Analytics dashboard
- [ ] PDF export reports
- [ ] S3 file storage

## 📞 Support

For issues:

1. Check browser console (F12)
2. Review API responses in Network tab
3. Check terminal logs
4. Verify all env vars are set
5. Ensure MongoDB + OpenAI APIs are accessible

---

**Ready to interview? Head to http://localhost:3002** 🎤
