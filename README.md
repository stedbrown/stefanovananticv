# Stefano Vananti CV Assistant

An interactive web application that allows users to ask questions about Stefano Vananti's CV using voice recognition and artificial intelligence.

## 🚀 Features

- **Interactive Interface**: Animated graphical visualization that reacts to voice input
- **Voice Recognition**: Support for voice recognition in Italian
- **AI Responses**: Uses OpenAI GPT-3.5/4 to answer questions about the CV
- **Light/Dark Theme**: Support for light and dark themes with automatic system preference detection
- **Sound Effects**: Audio feedback to enhance user experience
- **Audio Visualization**: Reactive animation to audio input
- **Downloadable CV**: Option to download the CV directly from the application
- **Responsive Design**: Fully responsive layout for all devices

## 🛠️ Tech Stack

- **Frontend**: React 18, TypeScript, Tailwind CSS
- **AI Integration**: OpenAI API
- **Voice Recognition**: Web Speech API
- **Audio Processing**: Web Audio API
- **Graphics**: Canvas API
- **Build Tool**: Vite
- **Deployment**: Vercel/GitHub Pages

## 📋 Prerequisites

- Node.js (v14.0.0 or higher)
- npm or yarn
- OpenAI API key

## 🔧 Installation

1. Clone the repository
   ```bash
   git clone https://github.com/stedbrown/stefanovananticv.git
   cd stefanovananticv
   ```

2. Install dependencies
   ```bash
   npm install
   # or
   yarn install
   ```

3. Create a `.env` file in the project root with your OpenAI API key
   ```
   VITE_OPENAI_API_KEY=your_openai_api_key
   ```

4. Start the development server
   ```bash
   npm run dev
   # or
   yarn dev
   ```

5. Open your browser and navigate to `http://localhost:5173/stefanovananticv/`

## 🚢 Deployment

### GitHub Pages

1. Install the gh-pages package
   ```bash
   npm install --save-dev gh-pages
   # or
   yarn add --dev gh-pages
   ```

2. Add these scripts to your `package.json`
   ```json
   "scripts": {
     "predeploy": "npm run build",
     "deploy": "gh-pages -d dist"
   }
   ```

3. Configure the base URL in the `vite.config.ts` file
   ```typescript
   export default defineConfig({
     base: '/stefanovananticv/',
     // other configurations...
   });
   ```

4. Run the deploy command
   ```bash
   npm run deploy
   # or
   yarn deploy
   ```

5. Configure GitHub Pages in your repository settings to use the `gh-pages` branch

### Vercel

1. Push your code to GitHub
2. Import your repository in Vercel
3. Configure the build settings:
   - Build Command: `npm run build` or `yarn build`
   - Output Directory: `dist`
   - Install Command: `npm install` or `yarn install`
4. Deploy

## 📁 Project Structure

```
stefanovananticv/
├── public/               # Static assets
│   ├── documents/        # CV documents
│   ├── sounds/           # Sound effects
│   └── ...
├── src/
│   ├── components/       # React components
│   │   ├── AudioBlob.tsx # Audio visualization component
│   │   ├── Conversation.tsx # Chat interface
│   │   ├── Footer.tsx    # Application footer
│   │   ├── Header.tsx    # Application header
│   │   └── ...
│   ├── constants/        # Application constants
│   │   └── prompts.ts    # AI system prompts
│   ├── hooks/            # Custom React hooks
│   │   ├── useAudioContext.ts # Audio processing hook
│   │   ├── useSpeechRecognition.ts # Voice recognition hook
│   │   └── ...
│   ├── types/            # TypeScript type definitions
│   ├── utils/            # Utility functions
│   │   ├── api.ts        # API communication
│   │   ├── audio.ts      # Audio processing utilities
│   │   └── ...
│   ├── App.tsx           # Main application component
│   └── main.tsx          # Application entry point
├── .env                  # Environment variables (not in repo)
├── .env.example          # Example environment variables
├── package.json          # Project dependencies and scripts
├── tsconfig.json         # TypeScript configuration
├── vite.config.ts        # Vite configuration
└── README.md             # Project documentation
```

## 🔒 Security Considerations

**Important**: This application uses `dangerouslyAllowBrowser: true` for OpenAI API calls, which is acceptable only for a demonstration project but not recommended for a production application.

In a production environment, you should:
1. Use a backend to handle API calls
2. Never expose the API key in the frontend
3. Implement rate limiting and other security measures

## 🧪 How to Use

1. Open the application in your browser
2. Click on the animated blob in the center of the screen to start voice recognition
3. Ask questions about Stefano Vananti's CV in Italian, such as:
   - "Quali sono le tue competenze tecniche?"
   - "Parlami della tua esperienza lavorativa"
   - "Dove sei disponibile a lavorare?"
4. The AI will respond with relevant information from the CV
5. You can also type your questions in the text input at the bottom of the screen
6. To download the CV, click the "Scarica CV" button in the header

## 👨‍💻 About the Developer

This application was developed by Stefano Vananti, an IT professional with experience in web development, AI integration, and user interface design. The application serves as both a practical tool for sharing professional information and a demonstration of technical skills.

## 📄 License

MIT

---

Made with ♥ by Stefano Vananti 