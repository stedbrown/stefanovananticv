import { useState, useEffect, useRef, useCallback } from 'react';
import AudioVisualizer from './components/AudioVisualizer';
import ThemeToggle from './components/ThemeToggle';
import Header from './components/Header';
import ErrorMessage from './components/ErrorMessage';
import Conversation from './components/Conversation';
import Footer from './components/Footer';
import { useSpeechRecognition } from './hooks/useSpeechRecognition';
import { useAudioAnalyzer } from './hooks/useAudioAnalyzer';
import { useSounds } from './hooks/useSounds';
import { getChatGPTResponse } from './utils/api';
import { BlobState } from './types';

// Componente di fallback in caso di errori
const FallbackComponent = () => (
  <div className="fallback-container">
    <h1>Assistente CV di Stefano Vananti</h1>
    <p>Si è verificato un problema durante il caricamento dell'applicazione.</p>
    <p>Verifica la console per maggiori dettagli.</p>
    <button 
      onClick={() => window.location.reload()} 
      style={{ 
        padding: '0.5rem 1rem', 
        backgroundColor: '#3b82f6', 
        color: 'white', 
        border: 'none', 
        borderRadius: '0.25rem', 
        marginTop: '1rem',
        cursor: 'pointer'
      }}
    >
      Ricarica la pagina
    </button>
  </div>
);

function App() {
  // Stato per gestire gli errori fatali dell'applicazione
  const [hasFatalError, setHasFatalError] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [isPressed, setIsPressed] = useState(false);
  const [response, setResponse] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [blobState, setBlobState] = useState<BlobState>('idle');
  const [isOutOfContext, setIsOutOfContext] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [userPrompt, setUserPrompt] = useState('');
  const silenceTimeoutRef = useRef<number | null>(null);
  
  const { playStart, playResponse } = useSounds();
  const { audioData, averageIntensity, startAnalyzer, stopAnalyzer } = useAudioAnalyzer();

  // Gestione degli errori globale
  useEffect(() => {
    const handleError = (event: ErrorEvent) => {
      console.error('Errore fatale:', event.error);
      setHasFatalError(true);
    };

    window.addEventListener('error', handleError);
    return () => window.removeEventListener('error', handleError);
  }, []);

  // Funzione per processare la trascrizione finale
  const processFinalTranscript = useCallback(async (text: string, stopListeningFn: () => void) => {
    try {
      // Ferma l'ascolto quando riceviamo una trascrizione finale
      stopListeningFn();
      stopAnalyzer();
      
      // Aggiorna userPrompt con il testo trascritto
      setUserPrompt(text);
      
      // Resetta la risposta precedente
      setResponse('');
      
      // Avvia il processo di risposta
      setIsLoading(true);
      setBlobState('responding');
      
      const aiResponse = await getChatGPTResponse(text);
      
      // Verifica se la risposta indica una domanda fuori contesto
      if (aiResponse.includes("Mi dispiace, posso rispondere solo a domande sul CV di Stefano")) {
        setIsOutOfContext(true);
        setBlobState('error');
      } else {
        setIsOutOfContext(false);
        setBlobState('responding');
      }
      
      playResponse();
      setResponse(aiResponse);
      
      // Dopo un po' torniamo allo stato idle
      setTimeout(() => {
        setBlobState('idle');
      }, 3000);
    } catch (error) {
      if (error instanceof Error) {
        setError(error.message);
        setBlobState('error');
      } else {
        setError('Si è verificato un errore imprevisto.');
        setBlobState('error');
      }
    } finally {
      setIsLoading(false);
    }
  }, [stopAnalyzer, setBlobState, setIsLoading, setIsOutOfContext, playResponse, setResponse, setError]);
  
  const { 
    isListening, 
    transcript, 
    startListening, 
    stopListening, 
    resetTranscript,
    error: speechError 
  } = useSpeechRecognition({
    onFinalTranscript: (text) => processFinalTranscript(text, stopListening),
    lang: 'it-IT'
  });
  
  // Funzione per gestire il silenzio prolungato
  const handleSilence = useCallback(() => {
    // Se l'utente è stato in silenzio per un po', consideriamo la domanda completata
    if (isListening && transcript.trim().length > 0) {
      console.log('Silenzio rilevato, elaboro la trascrizione:', transcript);
      processFinalTranscript(transcript, stopListening);
    }
  }, [isListening, transcript, stopListening, processFinalTranscript]);
  
  // Monitora il transcript per rilevare il silenzio
  useEffect(() => {
    // Pulisci il timeout esistente
    if (silenceTimeoutRef.current) {
      window.clearTimeout(silenceTimeoutRef.current);
    }
    
    // Se stiamo ascoltando e c'è un transcript, imposta un timeout per il silenzio
    if (isListening && transcript.trim().length > 0) {
      silenceTimeoutRef.current = window.setTimeout(() => {
        handleSilence();
      }, 2500); // 2.5 secondi di silenzio per considerare la domanda completata
    }
    
    return () => {
      if (silenceTimeoutRef.current) {
        window.clearTimeout(silenceTimeoutRef.current);
      }
    };
  }, [transcript, isListening, handleSilence]);
  
  // Sincronizza gli errori dal riconoscimento vocale
  useEffect(() => {
    if (speechError) {
      setError(speechError);
      setBlobState('error');
    }
  }, [speechError]);
  
  // Aggiorna lo stato del blob in base all'interazione
  useEffect(() => {
    let timer: number | undefined;
    
    if (isListening) {
      setBlobState('listening');
    } else if (isLoading) {
      setBlobState('responding');
    } else if (error) {
      setBlobState('error');
    } else if (isOutOfContext) {
      setBlobState('error');
    } else if (response && !isLoading) {
      // Mantieni lo stato 'responding' per un po' dopo che la risposta è stata ricevuta
      setBlobState('responding');
      timer = window.setTimeout(() => {
        setBlobState('idle');
      }, 3000);
    } else {
      setBlobState('idle');
    }
    
    return () => {
      if (timer) {
        clearTimeout(timer);
      }
    };
  }, [isListening, isLoading, error, response, isOutOfContext]);
  
  const toggleListening = useCallback(async () => {
    if (!isListening) {
      try {
        // Resettiamo completamente la conversazione precedente quando si inizia una nuova
        resetTranscript();
        setResponse('');
        setUserPrompt('');
        setBlobState('listening');
        
        await startListening();
        playStart();
        
        // Ottieni lo stream audio per l'analizzatore
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        startAnalyzer(stream);
        
        setError(null);
        setIsOutOfContext(false);
      } catch (error) {
        console.error('Error starting listening:', error);
        if (error instanceof Error) {
          setError(error.message);
          setBlobState('error');
        } else {
          setError('Si è verificato un errore durante l\'avvio del riconoscimento vocale.');
          setBlobState('error');
        }
      }
    } else {
      stopListening();
      stopAnalyzer();
      setBlobState('interrupted');
      setTimeout(() => {
        setBlobState('idle');
      }, 500);
    }
  }, [
    isListening, 
    resetTranscript, 
    startListening, 
    playStart, 
    startAnalyzer, 
    stopListening, 
    stopAnalyzer
  ]);
  
  const handlePressStart = useCallback(() => {
    setIsPressed(true);
  }, []);
  
  const handlePressEnd = useCallback(() => {
    setIsPressed(false);
  }, []);
  
  const toggleDarkMode = useCallback(() => {
    setIsDarkMode(prev => !prev);
  }, []);

  // Funzione per gestire i prompt suggeriti
  const handlePromptSelect = useCallback(async (prompt: string) => {
    try {
      // Resetta completamente lo stato precedente
      resetTranscript();
      setResponse('');
      setError(null);
      setIsOutOfContext(false);
      
      // Imposta il prompt selezionato dall'utente
      setUserPrompt(prompt);
      
      // Avvia il processo di risposta
      setIsLoading(true);
      setBlobState('responding');
      
      const aiResponse = await getChatGPTResponse(prompt);
      
      // Verifica se la risposta indica una domanda fuori contesto
      if (aiResponse.includes("Mi dispiace, posso rispondere solo a domande sul CV di Stefano")) {
        setIsOutOfContext(true);
        setBlobState('error');
      } else {
        setIsOutOfContext(false);
        setBlobState('responding');
      }
      
      playResponse();
      setResponse(aiResponse);
      
      // Dopo un po' torniamo allo stato idle
      setTimeout(() => {
        setBlobState('idle');
      }, 3000);
    } catch (error) {
      if (error instanceof Error) {
        setError(error.message);
        setBlobState('error');
      } else {
        setError('Si è verificato un errore imprevisto.');
        setBlobState('error');
      }
    } finally {
      setIsLoading(false);
    }
  }, [resetTranscript, setBlobState, setIsLoading, setIsOutOfContext, playResponse]);

  // Se c'è un errore fatale, mostra il componente di fallback
  if (hasFatalError) {
    return <FallbackComponent />;
  }

  try {
    return (
      <div className={`relative min-h-screen ${isDarkMode ? 'bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900' : 'bg-gradient-to-br from-gray-50 via-blue-50 to-gray-100'} overflow-hidden transition-colors duration-500`}>
        {/* Contenitore principale con z-index per controllare la sovrapposizione */}
        <div className="relative z-0 min-h-screen flex flex-col">
          {/* Contenuto dell'app con header in cima */}
          <div className="relative z-10 flex-grow flex flex-col items-center pt-6 pb-10 px-4 overflow-y-auto">
            <div className="w-full max-w-2xl mb-6 pointer-events-auto">
              <Header 
                isDarkMode={isDarkMode} 
                blobState={blobState}
              />
              
              <ErrorMessage message={error} />
            </div>
            
            {/* AudioVisualizer posizionato sotto l'header */}
            <div className="w-full flex justify-center mb-6">
              {/* Area cliccabile limitata al blob */}
              <div className={`w-[250px] h-[250px] pointer-events-auto relative rounded-full ${
                isDarkMode 
                  ? '' 
                  : ''
              }`}>
                <AudioVisualizer
                  isDarkMode={isDarkMode}
                  isListening={isListening}
                  isPressed={isPressed}
                  onToggleListening={toggleListening}
                  onPressStart={handlePressStart}
                  onPressEnd={handlePressEnd}
                  audioData={audioData}
                  averageIntensity={averageIntensity}
                  blobState={blobState}
                />
              </div>
            </div>
            
            <div className="flex-grow w-full flex items-center justify-center pointer-events-auto">
              <Conversation
                isDarkMode={isDarkMode}
                transcript={isListening ? transcript : userPrompt}
                response={response}
                isLoading={isLoading}
                isOutOfContext={isOutOfContext}
                onPromptSelect={handlePromptSelect}
              />
            </div>
          </div>
          
          {/* Footer posizionato in fondo alla pagina */}
          <div className="w-full pointer-events-auto z-10">
            <Footer isDarkMode={isDarkMode} />
          </div>
          
          <ThemeToggle 
            isDarkMode={isDarkMode} 
            onToggle={toggleDarkMode} 
          />
        </div>
      </div>
    );
  } catch (error) {
    console.error('Errore durante il rendering dell\'applicazione:', error);
    return <FallbackComponent />;
  }
}

export default App;