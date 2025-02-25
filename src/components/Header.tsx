import React from 'react';
import { ThemeProps, BlobState } from '../types';
import { Mic, MessageSquare, StopCircle, AlertCircle, Pointer, FileDown, Sparkles } from 'lucide-react';

interface HeaderProps extends ThemeProps {
  blobState: BlobState;
}

const Header: React.FC<HeaderProps> = ({ isDarkMode, blobState }) => {
  // Funzione per ottenere l'icona e il messaggio appropriati in base allo stato
  const getStatusContent = () => {
    switch (blobState) {
      case 'idle':
        return {
          icon: <Pointer className="w-5 h-5 inline-block mr-2" />,
          text: 'Tocca la sfera per iniziare a parlare'
        };
      case 'listening':
        return {
          icon: <Mic className="w-5 h-5 inline-block mr-2" />,
          text: 'Ascoltando...'
        };
      case 'responding':
        return {
          icon: <MessageSquare className="w-5 h-5 inline-block mr-2" />,
          text: 'Elaborando risposta...'
        };
      case 'interrupted':
        return {
          icon: <StopCircle className="w-5 h-5 inline-block mr-2" />,
          text: 'Interrotto'
        };
      case 'error':
        return {
          icon: <AlertCircle className="w-5 h-5 inline-block mr-2" />,
          text: 'Si è verificato un errore'
        };
      default:
        return {
          icon: <Pointer className="w-5 h-5 inline-block mr-2" />,
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
    <div className={`text-center p-8 rounded-xl ${
      isDarkMode 
        ? 'bg-gradient-to-br from-slate-800/80 to-slate-900/80 backdrop-blur-md border border-slate-700/40 text-white/90' 
        : 'bg-gradient-to-br from-white/80 to-slate-100/80 backdrop-blur-md border border-gray-200/40 text-gray-800'
    } shadow-xl transition-all duration-300 pointer-events-auto`}>
      <div className="flex flex-col md:flex-row items-center justify-between mb-6">
        <div className="flex items-center mb-3 md:mb-0">
          <Sparkles className={`w-6 h-6 mr-3 ${isDarkMode ? 'text-blue-400' : 'text-blue-500'}`} />
          <h1 className="text-2xl md:text-3xl font-light">Assistente CV di Stefano Vananti</h1>
        </div>
        
        <div className="flex items-center space-x-2 pointer-events-auto">
          <a
            href="/documents/cv_stefano_vananti.pdf"
            download="CV_Stefano_Vananti.pdf"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              padding: '0.5rem 1.25rem',
              borderRadius: '9999px',
              fontSize: '0.875rem',
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
            <FileDown style={{ width: '16px', height: '16px' }} />
            <span style={{ fontWeight: '600' }}>Scarica CV</span>
          </a>
        </div>
      </div>
      
      <div className={`flex flex-col items-center p-4 rounded-lg ${
        isDarkMode ? 'bg-slate-800/50 border border-slate-700/30' : 'bg-white/50 border border-gray-200/30'
      }`}>
        <div className={`text-lg flex items-center justify-center ${getStatusClass()} mb-2`}>
          {icon}
          <span>{text}</span>
        </div>
        
        <p className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
          Fai domande sul mio curriculum, competenze ed aspetti professionali
        </p>
      </div>
    </div>
  );
};

export default Header; 