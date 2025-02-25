/// <reference types="vite/client" />

interface Window {
  SpeechRecognition: typeof SpeechRecognition;
  webkitSpeechRecognition: typeof SpeechRecognition;
}

interface ImportMetaEnv {
  readonly VITE_OPENAI_API_KEY: string;
  // altre variabili d'ambiente...
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}