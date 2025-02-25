import React, { useState, useEffect } from 'react';
import { ThemeProps, BlobState } from '../types';
import { Mic, MessageSquare, StopCircle, AlertCircle, Pointer, FileDown, Sparkles, ChevronDown, ChevronUp } from 'lucide-react';

interface HeaderProps extends ThemeProps {
  blobState: BlobState;
}

const Header: React.FC<HeaderProps> = ({ isDarkMode, blobState }) => {
  // Stato per gestire l'espansione dell'header su mobile
  const [isExpanded, setIsExpanded] = useState(true);
  const [isMobile, setIsMobile] = useState(false);
  // Stato per l'animazione
  const [isAnimating, setIsAnimating] = useState(false);

  // Effetto per gestire la compressione dell'header quando si inizia a parlare
  useEffect(() => {
    if (isMobile && blobState === 'listening' && isExpanded) {
      setIsExpanded(false);
    }
  }, [blobState, isMobile, isExpanded]);

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
      <div className={`flex flex-col md:flex-row items-center ${isMobile ? 'gap-4' : 'gap-8'} justify-between mb-3 md:mb-6`}>
        <div className={`flex items-center w-full ${isMobile ? (isExpanded ? 'justify-start pl-2' : 'justify-center') : 'justify-start'}`}>
          <div className={`flex flex-col ${isMobile && !isExpanded ? 'items-center' : 'items-start'} transition-all duration-500 ease-in-out`}>
            <div className="flex items-center">
              <Sparkles className={`${isMobile ? 'w-7 h-7' : 'w-8 h-8'} mr-3 ${isDarkMode ? 'text-blue-400' : 'text-blue-500'} transition-all duration-300`} />
              {isMobile ? (
                <h1 className="text-xl font-light transition-all duration-300 ease-in-out tracking-wide">
                  CV Stefano Vananti
                </h1>
              ) : (
                <div className="flex flex-col items-start">
                  <h1 className="text-2xl md:text-3xl font-light transition-all duration-300 ease-in-out tracking-wide">
                    Assistente CV
                  </h1>
                  <h2 className="text-xl md:text-2xl font-light transition-all duration-300 ease-in-out tracking-wide text-blue-400">
                    di Stefano Vananti
                  </h2>
                </div>
              )}
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
          <div 
            className={`
              flex items-center justify-end pointer-events-auto
              transition-all duration-500 ease-in-out transform-gpu
              ${isMobile ? 'w-full' : 'min-w-[200px]'}
              ${isMobile ? 'origin-top' : ''} 
              ${isMobile && isExpanded 
                ? 'opacity-100 translate-y-0 scale-100' 
                : isMobile 
                  ? 'opacity-0 -translate-y-4 scale-95' 
                  : ''
              }
            `}
          >
            <a
              href="/documents/cv_stefano_vananti.pdf"
              download="CV_Stefano_Vananti.pdf"
              className={`
                group
                flex items-center gap-2 px-5 py-2.5 rounded-full
                bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500
                hover:from-blue-600 hover:via-indigo-600 hover:to-purple-600
                text-white font-medium shadow-lg
                transform transition-all duration-300 ease-out
                hover:scale-105 hover:shadow-xl hover:shadow-blue-500/20
                ${isAnimating ? 'animate-bounce-subtle' : ''}
                ${isMobile ? 'w-full justify-center' : 'justify-center min-w-[160px]'}
              `}
              style={{
                backdropFilter: 'blur(8px)',
              }}
            >
              <FileDown className={`
                ${isMobile ? 'w-5 h-5' : 'w-5 h-5'} 
                transition-all duration-300 
                group-hover:rotate-6 group-hover:scale-110
              `} />
              <span className="font-semibold whitespace-nowrap">Scarica CV</span>
            </a>
          </div>
        )}
      </div>
      
      {(!isMobile || isExpanded) && (
        <div 
          className={`
            flex flex-col items-center p-4 rounded-lg mt-2
            ${isDarkMode 
              ? 'bg-slate-800/50 border border-slate-700/30' 
              : 'bg-white/50 border border-gray-200/30'
            }
            transition-all duration-500 ease-in-out transform-gpu
            ${isMobile 
              ? isExpanded
                ? 'opacity-100 translate-y-0 scale-100 max-h-96' 
                : 'opacity-0 -translate-y-4 scale-95 max-h-0 overflow-hidden'
              : ''
            }
            ${isAnimating ? 'animate-content-slide' : ''}
          `}
        >
          <div 
            className={`
              text-lg flex items-center justify-center gap-2
              ${getStatusClass()} 
              transition-all duration-300 transform
              ${isAnimating ? 'animate-bounce-subtle' : ''}
            `}
          >
            {icon}
            <span className="animate-fade-in">{text}</span>
          </div>
          
          <p 
            className={`
              text-sm mt-2
              ${isDarkMode ? 'text-gray-300' : 'text-gray-600'} 
              transition-all duration-300 transform
              ${isAnimating ? 'animate-slide-up' : ''}
            `}
          >
            Fai domande sul mio curriculum, competenze ed aspetti professionali
          </p>
        </div>
      )}
    </div>
  );
};

export default Header; 