import React, { useEffect, useRef } from 'react';
import Message from './Message';
import { ThemeProps } from '../types';

interface ConversationProps extends ThemeProps {
  transcript: string;
  response: string;
  isLoading: boolean;
  isOutOfContext?: boolean;
  onPromptSelect?: (prompt: string) => void;
}

// Array di domande suggerite, ridotte e organizzate per categoria
const suggestedPrompts = [
  // Competenze
  "Quali sono le tue competenze tecniche?",
  "Parlami della tua esperienza lavorativa",
  // Contatti
  "Come posso contattarti?",
  "Dove sei disponibile a lavorare?",
  // Disponibilità
  "Sei disponibile per collaborazioni?",
  "Quando puoi iniziare a lavorare?"
];

const Conversation: React.FC<ConversationProps> = ({
  isDarkMode,
  transcript,
  response,
  isLoading,
  isOutOfContext = false,
  onPromptSelect
}) => {
  const containerRef = useRef<HTMLDivElement>(null);

  // Scroll automatico quando arrivano nuovi messaggi
  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.scrollTop = containerRef.current.scrollHeight;
    }
  }, [transcript, response, isLoading]);

  // Funzione per gestire il click su un prompt suggerito
  const handlePromptClick = (prompt: string) => {
    console.log(`Prompt selezionato: ${prompt}`);
    if (onPromptSelect) {
      onPromptSelect(prompt);
    }
  };

  return (
    <div 
      ref={containerRef}
      className={`w-full max-w-2xl pointer-events-auto space-y-4 overflow-y-auto max-h-[50vh] p-6 rounded-lg ${
        isDarkMode 
          ? 'bg-slate-800/60 backdrop-blur-md border border-slate-700/40' 
          : 'bg-white/60 backdrop-blur-md border border-gray-200/40'
      } shadow-lg transition-all duration-300`}
      style={{
        boxShadow: isDarkMode 
          ? '0 10px 25px -5px rgba(0, 0, 0, 0.3), 0 8px 10px -6px rgba(0, 0, 0, 0.2)' 
          : '0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.05)',
        zIndex: 20
      }}
    >
      {!transcript && !response && !isLoading && (
        <div className={`text-center p-4 ${isDarkMode ? 'text-white/80' : 'text-gray-700'}`}>
          <p className="font-medium mb-4">Fai una domanda sul CV di Stefano Vananti</p>
          <p className="mb-4 text-sm opacity-70">Clicca sulla sfera per iniziare a parlare o prova uno di questi suggerimenti:</p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mt-4">
            {suggestedPrompts.map((prompt, index) => (
              <button
                key={index}
                className={`text-left px-4 py-2 rounded-lg transition-all duration-300 text-sm ${
                  isDarkMode 
                    ? 'bg-slate-700/50 hover:bg-slate-600/50 border border-slate-600/30 text-white/90' 
                    : 'bg-white/70 hover:bg-white/90 border border-gray-200/50 text-gray-700'
                } hover:shadow-md`}
                style={{
                  backdropFilter: 'blur(8px)'
                }}
                onClick={() => handlePromptClick(prompt)}
              >
                {prompt}
              </button>
            ))}
          </div>
        </div>
      )}
      
      {transcript && (
        <Message
          type="user"
          content={transcript}
          isDarkMode={isDarkMode}
        />
      )}
      
      {isLoading && (
        <Message
          type="ai"
          content=""
          isLoading={true}
          isDarkMode={isDarkMode}
        />
      )}
      
      {response && (
        <Message
          type="ai"
          content={response}
          isDarkMode={isDarkMode}
          isOutOfContext={isOutOfContext}
        />
      )}
    </div>
  );
};

export default Conversation; 