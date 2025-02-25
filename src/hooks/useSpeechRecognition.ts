import { useState, useEffect, useRef, useCallback } from 'react';

interface UseSpeechRecognitionProps {
  onTranscriptChange?: (transcript: string) => void;
  onFinalTranscript?: (transcript: string) => void;
  lang?: string;
}

interface UseSpeechRecognitionReturn {
  isListening: boolean;
  transcript: string;
  startListening: () => Promise<void>;
  stopListening: () => void;
  resetTranscript: () => void;
  error: string | null;
}

// Definizione dei tipi per il riconoscimento vocale
interface SpeechRecognitionEvent extends Event {
  resultIndex: number;
  results: {
    [index: number]: {
      isFinal: boolean;
      [index: number]: {
        transcript: string;
      };
    };
  };
}

interface SpeechRecognitionErrorEvent extends Event {
  error: string;
}

interface SpeechRecognition extends EventTarget {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  start: () => void;
  stop: () => void;
  abort: () => void;
  onresult: (event: SpeechRecognitionEvent) => void;
  onerror: (event: SpeechRecognitionErrorEvent) => void;
  onend: (event: Event) => void;
}

declare global {
  interface Window {
    SpeechRecognition: new () => SpeechRecognition;
    webkitSpeechRecognition: new () => SpeechRecognition;
  }
}

export const useSpeechRecognition = ({
  onTranscriptChange,
  onFinalTranscript,
  lang = 'it-IT'
}: UseSpeechRecognitionProps = {}): UseSpeechRecognitionReturn => {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [error, setError] = useState<string | null>(null);
  
  const recognitionRef = useRef<SpeechRecognition | null>(null);
  const mediaStreamRef = useRef<MediaStream | null>(null);
  const restartTimeoutRef = useRef<number | null>(null);
  const silenceTimeoutRef = useRef<number | null>(null);
  const lastSpeechTimeRef = useRef<number>(Date.now());
  const isFinalTranscriptProcessingRef = useRef<boolean>(false);

  // Inizializza il riconoscimento vocale
  useEffect(() => {
    if ('SpeechRecognition' in window || 'webkitSpeechRecognition' in window) {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      recognitionRef.current = new SpeechRecognition();
      
      if (recognitionRef.current) {
        recognitionRef.current.continuous = true;
        recognitionRef.current.interimResults = true;
        recognitionRef.current.lang = lang;
      }
    } else {
      setError('Il riconoscimento vocale non è supportato dal tuo browser.');
    }

    return () => {
      if (mediaStreamRef.current) {
        mediaStreamRef.current.getTracks().forEach(track => track.stop());
      }
      
      if (recognitionRef.current) {
        try {
          recognitionRef.current.stop();
        } catch {
          // Ignora errori durante la pulizia
        }
      }

      // Pulisci i timeout
      if (restartTimeoutRef.current) {
        window.clearTimeout(restartTimeoutRef.current);
      }
      if (silenceTimeoutRef.current) {
        window.clearTimeout(silenceTimeoutRef.current);
      }
    };
  }, [lang]);

  // Configura gli event listener per il riconoscimento vocale
  useEffect(() => {
    if (!recognitionRef.current) return;

    const handleResult = (event: SpeechRecognitionEvent) => {
      const current = event.resultIndex;
      const result = event.results[current];
      const transcriptText = result[0].transcript;
      
      // Aggiorna il timestamp dell'ultima attività vocale
      lastSpeechTimeRef.current = Date.now();
      
      // Resetta il timeout di silenzio
      if (silenceTimeoutRef.current) {
        window.clearTimeout(silenceTimeoutRef.current);
      }
      
      // Imposta un nuovo timeout di silenzio
      silenceTimeoutRef.current = window.setTimeout(() => {
        // Se c'è stata una pausa significativa e non stiamo già elaborando una trascrizione finale
        if (isListening && !isFinalTranscriptProcessingRef.current && transcript.trim().length > 0) {
          // Considera la pausa come fine della frase
          isFinalTranscriptProcessingRef.current = true;
          onFinalTranscript?.(transcript);
          
          // Non resettiamo più la trascrizione qui, lasciamo che sia App.tsx a gestirlo
          /*
          setTimeout(() => {
            setTranscript('');
            isFinalTranscriptProcessingRef.current = false;
          }, 500);
          */
        }
      }, 2000); // 2 secondi di silenzio per considerare la frase completata
      
      setTranscript(transcriptText);
      onTranscriptChange?.(transcriptText);

      if (result.isFinal) {
        isFinalTranscriptProcessingRef.current = true;
        onFinalTranscript?.(transcriptText);
        
        // Non resettiamo più la trascrizione qui, lasciamo che sia App.tsx a gestirlo
        /*
        setTimeout(() => {
          setTranscript('');
          isFinalTranscriptProcessingRef.current = false;
        }, 500);
        */
      }
    };

    const handleError = (event: SpeechRecognitionErrorEvent) => {
      console.error('Speech recognition error:', event.error);
      
      // Non interrompere l'ascolto per errori non fatali
      if (event.error === 'no-speech') {
        console.log('Nessun discorso rilevato, continuo ad ascoltare...');
        return;
      }
      
      setIsListening(false);
      setError('Errore con il riconoscimento vocale. Riprova.');
    };

    const handleEnd = () => {
      // Se l'evento end viene attivato ma dovremmo ancora ascoltare, riavvia
      if (isListening && recognitionRef.current) {
        // Usa un timeout per evitare riavvii troppo frequenti
        if (restartTimeoutRef.current) {
          window.clearTimeout(restartTimeoutRef.current);
        }
        
        restartTimeoutRef.current = window.setTimeout(() => {
          try {
            recognitionRef.current?.start();
            console.log('Riconoscimento vocale riavviato automaticamente');
          } catch (e) {
            console.error('Errore nel riavvio del riconoscimento vocale:', e);
            setIsListening(false);
          }
        }, 300);
      }
    };

    recognitionRef.current.onresult = handleResult;
    recognitionRef.current.onerror = handleError;
    recognitionRef.current.onend = handleEnd;

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.onresult = null as unknown as EventListener;
        recognitionRef.current.onerror = null as unknown as EventListener;
        recognitionRef.current.onend = null as unknown as EventListener;
      }
    };
  }, [isListening, onTranscriptChange, onFinalTranscript, transcript]);

  // Avvia il riconoscimento vocale
  const startListening = useCallback(async () => {
    try {
      if (!recognitionRef.current) {
        throw new Error('Il riconoscimento vocale non è supportato dal tuo browser.');
      }

      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaStreamRef.current = stream;

      // Assicurati che il riconoscimento sia fermato prima di riavviarlo
      try {
        recognitionRef.current.stop();
      } catch {
        // Ignora errori se non era attivo
      }

      // Resetta lo stato
      isFinalTranscriptProcessingRef.current = false;
      lastSpeechTimeRef.current = Date.now();
      
      // Breve timeout per assicurarsi che il riconoscimento sia pronto
      setTimeout(() => {
        if (recognitionRef.current) {
          recognitionRef.current.start();
          setIsListening(true);
          setError(null);
        }
      }, 100);
    } catch (error) {
      console.error('Error accessing microphone:', error);
      setError('Errore di accesso al microfono. Verifica i permessi e riprova.');
      setIsListening(false);
    }
  }, []);

  // Ferma il riconoscimento vocale
  const stopListening = useCallback(() => {
    if (mediaStreamRef.current) {
      mediaStreamRef.current.getTracks().forEach(track => track.stop());
      mediaStreamRef.current = null;
    }
    
    if (recognitionRef.current) {
      try {
        recognitionRef.current.stop();
      } catch {
        // Ignora errori se non era attivo
      }
    }
    
    // Pulisci i timeout
    if (restartTimeoutRef.current) {
      window.clearTimeout(restartTimeoutRef.current);
    }
    if (silenceTimeoutRef.current) {
      window.clearTimeout(silenceTimeoutRef.current);
    }
    
    // Reset dello stato di elaborazione della trascrizione finale
    isFinalTranscriptProcessingRef.current = false;
    
    setIsListening(false);
  }, []);

  // Reset della trascrizione
  const resetTranscript = useCallback(() => {
    setTranscript('');
    isFinalTranscriptProcessingRef.current = false;
  }, []);

  return {
    isListening,
    transcript,
    startListening,
    stopListening,
    resetTranscript,
    error
  };
}; 