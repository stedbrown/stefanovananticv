import React from 'react';
import { Sun, Moon } from 'lucide-react';
import { ThemeToggleProps } from '../types';

const ThemeToggle: React.FC<ThemeToggleProps> = ({ isDarkMode, onToggle }) => {
  return (
    <button
      onClick={onToggle}
      className={`absolute top-4 right-4 z-20 p-2 rounded-full backdrop-blur-md transition-all duration-300 ${
        isDarkMode 
          ? 'bg-slate-700/60 text-white hover:bg-slate-600/60 border border-slate-600/40' 
          : 'bg-white/60 text-gray-800 hover:bg-white/80 border border-gray-200/40'
      } shadow-md`}
      aria-label={isDarkMode ? 'Passa alla modalità chiara' : 'Passa alla modalità scura'}
    >
      {isDarkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
    </button>
  );
};

export default ThemeToggle; 