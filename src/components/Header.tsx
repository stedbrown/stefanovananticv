import React, { useState, useEffect } from 'react';
import { ThemeProps, BlobState } from '../types';
import { Mic, MessageSquare, StopCircle, AlertCircle, Pointer, FileDown, Sparkles, ChevronDown, ChevronUp } from 'lucide-react';

interface HeaderProps extends ThemeProps {
  blobState: BlobState;
}

const Header: React.FC<HeaderProps> = ({ isDarkMode, blobState }) => {
  // Stato per gestire l'espansione dell'header su mobile
  const [isExpanded, setIsExpanded] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  // Stato per l'animazione
  const [isAnimating, setIsAnimating] = useState(false);

  // Rileva se il dispositivo è mobile
  useEffect(() => {
    const checkIfMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    // Controlla all'inizio
    checkIfMobile();
    
    // Aggiungi event listener per il resize
    window.addEventListener('resize', checkIfMobile);
    
    // Cleanup
    return () => window.removeEventListener('resize', checkIfMobile);
  }, []);

  // Funzione per gestire l'espansione con animazione
  const toggleExpansion = () => {
    setIsAnimating(true);
    setIsExpanded(!isExpanded);
    
    // Resetta lo stato di animazione dopo che la transizione è completata
    setTimeout(() => {
      setIsAnimating(false);
    }, 300); // Durata della transizione
  };

  // Funzione per ottenere l'icona e il messaggio appropriati in base allo stato
  const getStatusContent = () => {
    switch (blobState) {
      case 'idle':
        return {
          icon: <Pointer className={`${isMobile ? 'w-6 h-6' : 'w-5 h-5'} inline-block mr-2`} />,
          text: 'Tocca la sfera per iniziare a parlare'
        };
      case 'listening':
        return {
          icon: <Mic className={`${isMobile ? 'w-6 h-6' : 'w-5 h-5'} inline-block mr-2`} />,
          text: 'Ascoltando...'
        };
      case 'responding':
        return {
          icon: <MessageSquare className={`${isMobile ? 'w-6 h-6' : 'w-5 h-5'} inline-block mr-2`} />,
          text: 'Elaborando risposta...'
        };
      case 'interrupted':
        return {
          icon: <StopCircle className={`${isMobile ? 'w-6 h-6' : 'w-5 h-5'} inline-block mr-2`} />,
          text: 'Interrotto'
        };
      case 'error':
        return {
          icon: <AlertCircle className={`${isMobile ? 'w-6 h-6' : 'w-5 h-5'} inline-block mr-2`} />,
          text: 'Si è verificato un errore'
        };
      default:
        return {
          icon: <Pointer className={`${isMobile ? 'w-6 h-6' : 'w-5 h-5'} inline-block mr-2`} />,
          text: 'Tocca la sfera per iniziare a parlare'
        };
    }
  };

  // Funzione per ottenere la classe CSS appropriata in base allo stato
  const getStatusClass = () => {
    switch (blobState) {
      case 'idle':
        return 'opacity-85';
      case 'listening':
        return 'animate-pulse font-medium text-blue-300';
      case 'responding':
        return 'animate-custom-pulse font-medium text-green-300';
      case 'interrupted':
        return 'font-medium text-orange-300';
      case 'error':
        return 'font-medium text-red-300';
      default:
        return 'opacity-85';
    }
  };

  const { icon, text } = getStatusContent();

  return (
    <div className={`text-center ${isMobile ? 'p-4' : 'p-8'} rounded-xl ${
      isDarkMode 
        ? 'bg-gradient-to-br from-slate-800/80 to-slate-900/80 backdrop-blur-md border border-slate-700/40 text-white/90' 
        : 'bg-gradient-to-br from-white/80 to-slate-100/80 backdrop-blur-md border border-gray-200/40 text-gray-800'
    } shadow-xl transition-all duration-300 pointer-events-auto z-20`}>
      <div className="flex flex-col md:flex-row items-center justify-between mb-3 md:mb-6">
        <div className={`flex items-center mb-2 md:mb-0 w-full ${isMobile && !isExpanded ? 'justify-center' : 'justify-between'}`}>
          <div className={`flex flex-col ${isMobile && !isExpanded ? 'items-center' : 'items-start'} transition-all duration-300 ease-in-out`}>
            <div className="flex items-center">
              <Sparkles className={`${isMobile ? 'w-7 h-7' : 'w-6 h-6'} mr-3 ${isDarkMode ? 'text-blue-400' : 'text-blue-500'} transition-all duration-300`} />
              <h1 className={`${isMobile ? 'text-xl' : 'text-2xl md:text-3xl'} font-light transition-all duration-300 ease-in-out`}>
                {isMobile ? 'CV Stefano Vananti' : 'Assistente CV di Stefano Vananti'}
              </h1>
            </div>
            {isMobile && !isExpanded && (
              <p className={`text-sm mt-2 px-4 py-1 rounded-full ${
                isDarkMode 
                  ? 'bg-slate-700/40 text-blue-200 border border-slate-600/30' 
                  : 'bg-white/60 text-blue-600 border border-blue-200/30'
              } font-light tracking-wide transform transition-all duration-300 ease-in-out`}>
                Assistente vocale interattivo
              </p>
            )}
          </div>
          
          {isMobile && (
            <button 
              onClick={toggleExpansion}
              className={`p-2 rounded-full focus:outline-none ${!isExpanded && 'absolute right-4'} transition-transform duration-300 ease-in-out ${isAnimating ? 'scale-110' : ''}`}
              aria-label={isExpanded ? "Comprimi header" : "Espandi header"}
              disabled={isAnimating}
            >
              {isExpanded ? 
                <ChevronUp className="w-7 h-7 transition-transform duration-300 ease-in-out hover:scale-110" /> : 
                <ChevronDown className="w-7 h-7 transition-transform duration-300 ease-in-out hover:scale-110" />
              }
            </button>
          )}
        </div>
        
        {(!isMobile || isExpanded) && (
          <div className={`flex items-center space-x-2 pointer-events-auto mt-2 md:mt-0 transition-all duration-300 ease-in-out ${isMobile ? 'transform-gpu' : ''} ${isMobile && isExpanded ? 'opacity-100 max-h-20' : isMobile ? 'opacity-0 max-h-0 overflow-hidden' : ''}`}>
            <a
              href="/documents/cv_stefano_vananti.pdf"
              download="CV_Stefano_Vananti.pdf"
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                padding: isMobile ? '0.5rem 1rem' : '0.5rem 1.25rem',
                borderRadius: '9999px',
                fontSize: isMobile ? '0.9rem' : '0.875rem',
                fontWeight: '500',
                color: 'white',
                background: isDarkMode 
                  ? 'linear-gradient(to right, #3b82f6, #4f46e5, #7c3aed)' 
                  : 'linear-gradient(to right, #3b82f6, #4f46e5, #7c3aed)',
                boxShadow: '0 2px 6px rgba(0, 0, 0, 0.06)',
                transition: 'all 0.3s ease',
                cursor: 'pointer',
                border: 'none',
                backdropFilter: 'blur(8px)',
                textDecoration: 'none'
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.transform = 'translateY(-1px) scale(1.02)';
                e.currentTarget.style.boxShadow = '0 4px 12px rgba(79, 70, 229, 0.15)';
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.transform = 'translateY(0) scale(1)';
                e.currentTarget.style.boxShadow = '0 2px 6px rgba(0, 0, 0, 0.06)';
              }}
              onClick={() => console.log("Download CV cliccato")}
            >
              <FileDown style={{ width: isMobile ? '20px' : '16px', height: isMobile ? '20px' : '16px' }} />
              <span style={{ fontWeight: '600' }}>Scarica CV</span>
            </a>
          </div>
        )}
      </div>
      
      {(!isMobile || isExpanded) && (
        <div className={`flex flex-col items-center p-4 rounded-lg ${
          isDarkMode ? 'bg-slate-800/50 border border-slate-700/30' : 'bg-white/50 border border-gray-200/30'
        } transition-all duration-300 ease-in-out transform-gpu ${isMobile ? (isExpanded ? 'opacity-100 max-h-96 scale-100' : 'opacity-0 max-h-0 scale-95 overflow-hidden') : ''}`}>
          <div className={`text-lg flex items-center justify-center ${getStatusClass()} mb-2 transition-all duration-300`}>
            {icon}
            <span>{text}</span>
          </div>
          
          <p className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-600'} transition-all duration-300`}>
            Fai domande sul mio curriculum, competenze ed aspetti professionali
          </p>
        </div>
      )}
    </div>
  );
};

export default Header; 