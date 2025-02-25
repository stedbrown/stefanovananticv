import React from 'react';
import { AlertCircle } from 'lucide-react';

interface ErrorMessageProps {
  message: string | null;
}

const ErrorMessage: React.FC<ErrorMessageProps> = ({ message }) => {
  if (!message) return null;
  
  return (
    <div className="mt-4 px-6 py-4 bg-red-500/20 backdrop-blur-md rounded-lg pointer-events-auto max-w-md w-full border border-red-500/30 shadow-md transition-all duration-300">
      <div className="flex items-center justify-center">
        <AlertCircle className="w-5 h-5 text-red-300 mr-2" />
        <p className="text-red-200 text-center">{message}</p>
      </div>
    </div>
  );
};

export default ErrorMessage; 