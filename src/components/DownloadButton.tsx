import React from 'react';
import { FileDown } from 'lucide-react';

const DownloadButton: React.FC = () => {
  // Link diretto a Google Drive come fallback
  const googleDriveLink = "https://drive.google.com/file/d/1oQC8dN3aeNMwwZYq26X_p4rbbpsENmXh/view?usp=sharing";
  
  return (
    <a
      href={googleDriveLink}
      target="_blank"
      rel="noopener noreferrer"
      className="flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-full 
                bg-gradient-to-r from-blue-500 to-purple-600 text-white 
                transition-all duration-300 ease-in-out
                shadow-md hover:shadow-lg hover:scale-105
                transform hover:-translate-y-1 cursor-pointer"
      style={{ textDecoration: 'none', cursor: 'pointer' }}
      aria-label="Visualizza il mio CV in formato PDF"
      onClick={() => console.log("Pulsante CV cliccato")}
    >
      <FileDown size={16} />
      <span>Visualizza CV</span>
    </a>
  );
};

export default DownloadButton; 