import React from 'react';
import { TypeAnimation } from 'react-type-animation';
import { MessageProps } from '../types';

interface ExtendedMessageProps extends MessageProps {
  isOutOfContext?: boolean;
}

const Message: React.FC<ExtendedMessageProps> = ({ 
  type, 
  content, 
  isLoading = false, 
  isDarkMode,
  isOutOfContext = false
}) => {
  const isUser = type === 'user';
  
  // Verifica se il contenuto è una risposta fuori contesto
  const isOutOfContextContent = !isUser && content.includes("Mi dispiace, posso rispondere solo a domande sul CV di Stefano");
  const shouldUseOutOfContextStyle = isOutOfContext || isOutOfContextContent;
  
  return (
    <div 
      className={`p-4 rounded-xl ${
        isUser 
          ? isDarkMode ? 'bg-blue-500/20 border border-blue-500/30' : 'bg-blue-500/10 border border-blue-500/20'
          : shouldUseOutOfContextStyle
            ? isDarkMode ? 'bg-red-500/20 border border-red-500/30' : 'bg-red-500/10 border border-red-500/20'
            : isDarkMode ? 'bg-purple-500/20 border border-purple-500/30' : 'bg-purple-500/10 border border-purple-500/20'
      } transition-all duration-300 hover:shadow-md`}
    >
      <div className="flex items-start gap-3">
        <div 
          className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
            isUser 
              ? isDarkMode ? 'bg-blue-500/40 text-white' : 'bg-blue-500/30 text-blue-800'
              : shouldUseOutOfContextStyle
                ? isDarkMode ? 'bg-red-500/40 text-white' : 'bg-red-500/30 text-red-800'
                : isDarkMode ? 'bg-purple-500/40 text-white' : 'bg-purple-500/30 text-purple-800'
          }`}
        >
          <span className="text-sm font-medium">
            {isUser ? 'Tu' : 'AI'}
          </span>
        </div>
        
        <div className={`${isDarkMode ? 'text-white/90' : 'text-gray-800'} flex-1`}>
          {isLoading ? (
            <div className="flex items-center">
              <span className="mr-2 font-medium">Pensando</span>
              <span className="animate-bounce mx-0.5">.</span>
              <span className="animate-bounce mx-0.5 animation-delay-200">.</span>
              <span className="animate-bounce mx-0.5 animation-delay-400">.</span>
            </div>
          ) : isUser ? (
            <p className="leading-relaxed">{content}</p>
          ) : (
            <TypeAnimation
              sequence={[content]}
              wrapper="p"
              speed={shouldUseOutOfContextStyle ? 50 : 70}
              cursor={false}
              className={`leading-relaxed ${shouldUseOutOfContextStyle ? 'text-red-300' : ''}`}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default Message; 