# AI Sprint Facilitator

A comprehensive Design Sprint Facilitator powered by OpenAI's Realtime API with real-time voice interaction capabilities. Guide your team through the complete 5-phase design sprint process with AI assistance.

## 🚀 Features

### Core Sprint Functionality
- **5-Phase Sprint Process**: Understand, Ideate, Decide, Prototype, Test
- **Real-time Progress Tracking**: Visual progress indicators and phase management
- **Problem Statement Definition**: Structured approach to defining sprint challenges
- **Team Participant Management**: Track team members and roles
- **Focus Timer**: 25-minute Pomodoro timer to maintain sprint momentum

### AI-Powered Facilitation
- **OpenAI Realtime API Integration**: Natural, low-latency voice conversations
- **Real-time Voice Interaction**: WebRTC-powered voice chat with the AI facilitator
- **Context-Aware Guidance**: AI adapts responses based on current sprint phase
- **Live Transcription**: Real-time speech-to-text during conversations
- **Multiple Voice Options**: Choose from 6 different AI voices

### Modern Tech Stack
- **React 18** with TypeScript for type safety
- **Vite** for fast development and building
- **shadcn/ui** design system for consistent, accessible UI
- **Tailwind CSS** for responsive styling
- **Lucide React** for beautiful icons
- **WebRTC** for real-time audio communication

## 🛠 Setup Instructions

### Prerequisites
- Node.js 18+ and npm
- OpenAI API key with Realtime API access
- Modern browser with WebRTC support (Chrome, Firefox, Safari)

### Installation

1. **Clone and install dependencies:**
```bash
git clone <repository-url>
cd ai-sprint-facilitator
npm install
```

2. **Start the development server:**
```bash
npm run dev
```

3. **Open your browser:**
Navigate to `http://localhost:5173`

### OpenAI API Configuration

1. **Get your OpenAI API Key:**
   - Go to [OpenAI Platform](https://platform.openai.com/)
   - Create an account or sign in
   - Navigate to API Keys section
   - Generate a new API key
   - **Important**: Ensure your account has access to the Realtime API

2. **Configure the application (2 options):**

   **Option A: Environment Variable (Recommended for Development)**
   ```bash
   # Copy the example file
   cp .env.example .env
   
   # Edit .env and add your API key
   VITE_OPENAI_API_KEY=sk-your-actual-api-key-here
   ```

   **Option B: Manual Entry**
   - Click the Settings icon in the AI Facilitator header
   - Enter your OpenAI API key (starts with `sk-...`)
   - Select your preferred voice (Alloy, Echo, Fable, Onyx, Nova, Shimmer)
   - The key is stored locally in your browser

   **Note**: Manual entry overrides the environment variable.

3. **Enable Voice Mode:**
   - Toggle "Voice Mode" switch in the chat interface
   - Grant microphone permissions when prompted
   - Wait for the "Connected" status indicator

## 📖 How to Use

### Starting a Sprint

1. **Define the Problem:**
   - On the Dashboard, enter your sprint challenge/problem statement
   - Be specific about what you want to solve or build
   - Example: "Design a mobile app for busy parents to quickly find and book childcare"

2. **Begin the Sprint:**
   - Click "Start Sprint" to enter the Understand phase
   - The AI facilitator will guide you through each phase

### Using Voice Mode

1. **Text Chat (Default):**
   - Type messages in the chat input
   - AI responds with text that you can read

2. **Voice Chat (Premium Experience):**
   - Enable "Voice Mode" after setting up your API key
   - Click "Start Recording" to speak to the AI
   - The AI will respond with natural speech
   - See real-time transcription of your speech and AI responses

### Sprint Phases

1. **Understand** (Day 1): Define the problem and understand user needs
2. **Ideate** (Day 2): Generate and explore solution ideas
3. **Decide** (Day 3): Choose the best solution to prototype
4. **Prototype** (Day 4): Build a realistic prototype
5. **Test** (Day 5): Test with real users and gather feedback

## 🎙️ Voice Features

### Real-time Capabilities
- **WebRTC Audio Streaming**: Direct peer-to-peer audio with OpenAI
- **Speech Detection**: Automatic start/stop of speech recognition
- **Live Transcription**: See what you're saying in real-time
- **Natural Conversation**: Interrupt and have natural back-and-forth
- **Multiple Voices**: Choose from 6 different AI voice personalities

### Voice Commands
- **Natural Speech**: Speak naturally, no special commands needed
- **Interruption Support**: Interrupt the AI like a real conversation
- **Context Awareness**: AI remembers the conversation context

## 🔧 Development

### Project Structure
```
ai-sprint-facilitator/
├── src/
│   ├── components/          # React components
│   │   ├── ui/             # shadcn/ui components
│   │   ├── ChatInterface.tsx    # Main chat with OpenAI
│   │   ├── SprintView.tsx       # Sprint workspace
│   │   ├── Dashboard.tsx        # Welcome/setup screen
│   │   └── ...
│   ├── hooks/              # Custom React hooks
│   │   └── useOpenAIRealtime.ts # OpenAI Realtime hook
│   ├── lib/                # Utilities and services
│   │   ├── openai-realtime.ts   # OpenAI service
│   │   └── utils.ts
│   └── types/              # TypeScript type definitions
├── public/                 # Static assets
└── package.json
```

### Key Components

1. **OpenAIRealtimeService**: Core service for WebRTC communication
2. **useOpenAIRealtime**: React hook for state management
3. **ChatInterface**: Main UI for voice/text interaction
4. **SprintView**: Sprint workspace with progress tracking

### Available Scripts

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run preview      # Preview production build
npm run lint         # Run ESLint
npm run lint:fix     # Fix linting issues
```

## 🌐 Browser Compatibility

### Supported Browsers
- ✅ Chrome 80+
- ✅ Firefox 75+
- ✅ Safari 14+
- ✅ Edge 80+

### Required Features
- WebRTC support
- getUserMedia API
- WebAudio API
- ES2020+ support

## 🔒 Security & Privacy

### Data Handling
- **API Key Storage**: Environment variables or stored locally in browser, never sent to our servers
- **Audio Processing**: Direct connection to OpenAI via WebRTC
- **No Audio Storage**: Audio is processed in real-time, not stored
- **HTTPS Required**: Secure connection required for microphone access

### Best Practices
- Use strong API keys
- Regularly rotate API keys
- Monitor API usage in OpenAI dashboard
- Don't commit `.env` files to version control
- In production, use proper environment variable management (not `.env` files)
- Don't share API keys in public repositories

## 💰 Pricing

### OpenAI Realtime API Costs
- **Audio Input**: ~$0.06 per minute
- **Audio Output**: ~$0.24 per minute
- **Text Tokens**: Standard GPT-4 pricing

### Estimation
- 30-minute sprint session: ~$9 in API costs
- Full 5-day sprint (5 hours total): ~$90 in API costs

## 🐛 Troubleshooting

### Common Issues

1. **"Microphone access denied"**
   - Enable microphone permissions in browser settings
   - Ensure you're using HTTPS (required for microphone access)

2. **"Connection failed"**
   - Check your OpenAI API key
   - Verify Realtime API access on your OpenAI account
   - Check network connectivity

3. **"Audio not working"**
   - Check browser audio settings
   - Ensure speakers/headphones are connected
   - Try refreshing the page

4. **"API key errors"**
   - Verify API key format (starts with `sk-`)
   - Check API key permissions in OpenAI dashboard
   - Ensure billing is set up for Realtime API access

### Performance Tips
- Use Chrome for best WebRTC performance
- Use headphones to prevent audio feedback
- Close other audio/video applications
- Ensure stable internet connection

## 🤝 Contributing

We welcome contributions! Please see our contributing guidelines for more information.

### Development Setup
1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🔗 Links

- [OpenAI Realtime API Documentation](https://platform.openai.com/docs/guides/realtime)
- [WebRTC API Documentation](https://developer.mozilla.org/en-US/docs/Web/API/WebRTC_API)
- [Design Sprint Methodology](https://designsprintkit.withgoogle.com/)

---

Built with ❤️ using OpenAI's Realtime API and modern web technologies.
