import React from 'react';
import { ThemeProps } from '../types';

const Footer: React.FC<ThemeProps> = ({ isDarkMode }) => {
  return (
    <footer className={`w-full py-4 px-6 ${
      isDarkMode 
        ? 'bg-slate-900/30 text-white/70' 
        : 'bg-white/30 text-gray-700'
    } backdrop-blur-sm transition-all duration-300 mt-auto`}>
      <div className="max-w-4xl mx-auto flex flex-col items-center justify-center">
        <div className="flex items-center justify-center space-x-6 mb-3">
          {/* Logo Vite */}
          <a 
            href="https://vitejs.dev/" 
            target="_blank" 
            rel="noopener noreferrer"
            className="flex flex-col items-center hover:opacity-80 transition-opacity"
            title="Vite"
          >
            <svg width="28" height="28" viewBox="0 0 410 404" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M399.641 59.5246L215.643 388.545C211.844 395.338 202.084 395.378 198.228 388.618L10.5817 59.5563C6.38087 52.1896 12.6802 43.2665 21.0281 44.7586L205.223 77.6824C206.398 77.8924 207.601 77.8904 208.776 77.6763L389.119 44.8058C397.439 43.2894 403.768 52.1434 399.641 59.5246Z" fill="url(#paint0_linear)"/>
              <path d="M292.965 1.5744L156.801 28.2552C154.563 28.6937 152.906 30.5903 152.771 32.8664L144.395 174.33C144.198 177.662 147.258 180.248 150.51 179.498L188.42 170.749C191.967 169.931 195.172 173.055 194.443 176.622L183.18 231.775C182.422 235.487 185.907 238.661 189.532 237.56L212.947 230.446C216.577 229.344 220.065 232.527 219.297 236.242L201.398 322.875C200.278 328.294 207.486 331.249 210.492 326.603L212.5 323.5L323.454 102.072C325.312 98.3645 322.108 94.137 318.036 94.9228L279.014 102.454C275.347 103.161 272.227 99.746 273.262 96.1583L298.731 7.86689C299.767 4.27314 296.636 0.855181 292.965 1.5744Z" fill="url(#paint1_linear)"/>
              <defs>
                <linearGradient id="paint0_linear" x1="6.00017" y1="32.9999" x2="235" y2="344" gradientUnits="userSpaceOnUse">
                  <stop stopColor={isDarkMode ? "#41D1FF" : "#41D1FF"}/>
                  <stop offset="1" stopColor={isDarkMode ? "#BD34FE" : "#BD34FE"}/>
                </linearGradient>
                <linearGradient id="paint1_linear" x1="194.651" y1="8.81818" x2="236.076" y2="292.989" gradientUnits="userSpaceOnUse">
                  <stop stopColor={isDarkMode ? "#FFEA83" : "#FFEA83"}/>
                  <stop offset="0.0833333" stopColor={isDarkMode ? "#FFDD35" : "#FFDD35"}/>
                  <stop offset="1" stopColor={isDarkMode ? "#FFA800" : "#FFA800"}/>
                </linearGradient>
              </defs>
            </svg>
            <span className="text-xs mt-1">Vite</span>
          </a>

          {/* Logo React */}
          <a 
            href="https://react.dev/" 
            target="_blank" 
            rel="noopener noreferrer"
            className="flex flex-col items-center hover:opacity-80 transition-opacity"
            title="React"
          >
            <svg width="28" height="28" viewBox="0 0 512 512" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M418.2 177.2c-5.4-1.8-10.8-3.5-16.2-5.1.9-3.7 1.7-7.4 2.5-11.1 12.3-59.6 4.2-107.5-23.1-123.3-26.3-15.1-69.2.6-112.6 38.4-4.3 3.7-8.5 7.6-12.5 11.5-2.7-2.6-5.5-5.2-8.3-7.7-45.5-40.4-91.1-57.4-118.4-41.5-26.2 15.2-34 60.3-23 116.7 1.1 5.6 2.3 11.1 3.7 16.7-6.4 1.8-12.7 3.8-18.6 5.9C38.3 196.2 0 225.4 0 255.6c0 31.2 40.8 62.5 96.3 81.5 4.5 1.5 9 3 13.6 4.3-1.5 6-2.8 11.9-4 18-10.5 55.5-2.3 99.5 23.9 114.6 27 15.6 72.4-.4 116.6-39.1 3.5-3.1 7-6.3 10.5-9.7 4.4 4.3 9 8.4 13.6 12.4 42.8 36.8 85.1 51.7 111.2 36.6 27-15.6 35.8-62.9 24.4-120.5-.9-4.4-1.9-8.9-3-13.5 3.2-.9 6.3-1.9 9.4-2.9 57.7-19.1 99.5-50 99.5-81.7 0-30.3-39.4-59.7-93.8-78.4zM282.9 92.3c37.2-32.4 71.9-45.1 87.7-36 16.9 9.7 23.4 48.9 12.8 100.4-.7 3.4-1.4 6.7-2.3 10-22.2-5-44.7-8.6-67.3-10.6-13-18.6-27.2-36.4-42.6-53.1 3.9-3.7 7.7-7.2 11.7-10.7zM167.2 307.5c5.1 8.7 10.3 17.4 15.8 25.9-15.6-1.7-31.1-4.2-46.4-7.5 4.4-14.4 9.9-29.3 16.3-44.5 4.6 8.8 9.3 17.5 14.3 26.1zm-30.3-120.3c14.4-3.2 29.7-5.8 45.6-7.8-5.3 8.3-10.5 16.8-15.4 25.4-4.9 8.5-9.7 17.2-14.2 26-6.3-14.9-11.6-29.5-16-43.6zm27.4 68.9c6.6-13.8 13.8-27.3 21.4-40.6s15.8-26.2 24.4-38.9c15-1.1 30.3-1.7 45.9-1.7s31 .6 45.9 1.7c8.5 12.6 16.6 25.5 24.3 38.7s14.9 26.7 21.7 40.4c-6.7 13.8-13.9 27.4-21.6 40.8-7.6 13.3-15.7 26.2-24.2 39-14.9 1.1-30.4 1.6-46.1 1.6s-30.9-.5-45.6-1.4c-8.7-12.7-16.9-25.7-24.6-39s-14.8-26.8-21.5-40.6zm180.6 51.2c5.1-8.8 9.9-17.7 14.6-26.7 6.4 14.5 12 29.2 16.9 44.3-15.5 3.5-31.2 6.2-47 8 5.4-8.4 10.5-17 15.5-25.6zm14.4-76.5c-4.7-8.8-9.5-17.6-14.5-26.2-4.9-8.5-10-16.9-15.3-25.2 16.1 2 31.5 4.7 45.9 8-4.6 14.8-10 29.2-16.1 43.4zM256.2 118.3c10.5 11.4 20.4 23.4 29.6 35.8-19.8-.9-39.7-.9-59.5 0 9.8-12.9 19.9-24.9 29.9-35.8zM140.2 57c16.8-9.8 54.1 4.2 93.4 39 2.5 2.2 5 4.6 7.6 7-15.5 16.7-29.8 34.5-42.9 53.1-22.6 2-45 5.6-67.2 10.6-1.9-7.8-3.5-15.8-4.7-24.1-9.9-51.1-3.2-89.4 13.8-99.1zm-24.5 136.1c4.1-2.7 8.3-5.5 12.5-8.1 10.5 30.7 25.5 63.1 44.5 95.8-19.1 32.8-34 65.1-44.5 95.8-4.2-2.6-8.4-5.4-12.5-8.1-39.5-27.1-62.9-57.9-62.9-83.3 0-25.5 23.4-56.3 62.9-83.4zM139.8 399c-16.5-9.5-22.9-47.6-13.1-98 1-5.2 2.1-10.4 3.4-15.5 22.4 5.1 45 8.8 67.9 10.9 13.1 18.7 27.5 36.6 43.1 53.4-3.2 3.1-6.4 6.1-9.7 8.9-36.1 32.4-70.3 45-91.6 36.3zm180.6 8.9c-2.9 2.6-5.8 5.2-8.7 7.7-18.7-20.3-35.6-42.1-50.3-65.1 15.2.9 30.6 1.3 46.1 1.3s30.7-.4 45.6-1.3c-14.6 22.9-31.2 44.7-49.7 65.1zm88.9-163.2c36.3 26.3 59.7 55.9 59.7 81.3 0 25.3-23.4 54.9-59.7 81.2-3.5 2.5-7.1 5-10.8 7.4-10.4-30.7-25.4-63-44.6-95.8 19.3-32.8 34.2-65.1 44.6-95.8 3.7 2.4 7.3 4.9 10.8 7.4zm-15.6 65c-3.3-7.4-6.9-14.8-10.6-22.1-3.8-7.3-7.8-14.5-11.9-21.6 10.4-2.2 20.6-4.8 30.3-7.7-2.6 17-6.7 33.8-12.2 50.3-5.4-16.5-9.6-33.3-12.2-50.3 9.8 2.9 19.9 5.5 30.3 7.7-4.1 7.1-8.1 14.3-11.9 21.6-3.7 7.3-7.2 14.7-10.6 22.1-3.3-7.4-6.8-14.8-10.5-22.1-3.7-7.3-7.7-14.5-11.8-21.6 10.5-2.2 20.8-4.7 30.8-7.7-2.7 17-6.9 33.9-12.5 50.6-5.5-16.7-9.7-33.6-12.5-50.6 10 3 20.3 5.5 30.8 7.7-4.1 7.1-8.1 14.3-11.8 21.6-3.7 7.3-7.2 14.7-10.5 22.1zM256 298.8c-12.5-12.5-23.6-25.6-33.6-39.4 10.8.6 21.7.9 32.8.9s22.1-.3 32.9-.9c-10.1 13.7-21.2 26.8-33.7 39.4zM256 163.2c12.5 12.5 23.6 25.7 33.7 39.4-10.8-.6-21.8-.9-32.9-.9s-22 .3-32.8.9c10-13.8 21.1-26.9 33.6-39.4zm0-30c-45.8 0-83.2 37.4-83.2 83.2s37.4 83.2 83.2 83.2 83.2-37.4 83.2-83.2-37.4-83.2-83.2-83.2zm0 142.7c-32.9 0-59.5-26.7-59.5-59.5s26.7-59.5 59.5-59.5 59.5 26.7 59.5 59.5-26.6 59.5-59.5 59.5z" fill={isDarkMode ? "#61DAFB" : "#61DAFB"}/>
            </svg>
            <span className="text-xs mt-1">React</span>
          </a>

          {/* Logo ChatGPT */}
          <a 
            href="https://openai.com/chatgpt" 
            target="_blank" 
            rel="noopener noreferrer"
            className="flex flex-col items-center hover:opacity-80 transition-opacity"
            title="ChatGPT"
          >
            <svg width="28" height="28" viewBox="0 0 512 512" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M480 256C480 132.3 379.7 32 256 32C132.3 32 32 132.3 32 256C32 379.7 132.3 480 256 480C379.7 480 480 379.7 480 256Z" fill={isDarkMode ? "#10A37F" : "#10A37F"} />
              <path d="M400 153.3C400 138.1 387.9 126 372.7 126H139.3C124.1 126 112 138.1 112 153.3V358.7C112 373.9 124.1 386 139.3 386H372.7C387.9 386 400 373.9 400 358.7V153.3Z" fill="white" />
              <path d="M195.2 156.7C195.2 149.5 201.1 143.7 208.2 143.7H303.8C310.9 143.7 316.8 149.5 316.8 156.7V355.3C316.8 362.5 310.9 368.3 303.8 368.3H208.2C201.1 368.3 195.2 362.5 195.2 355.3V156.7Z" fill={isDarkMode ? "#10A37F" : "#10A37F"} />
            </svg>
            <span className="text-xs mt-1">ChatGPT</span>
          </a>

          {/* Logo Cursor */}
          <a 
            href="https://cursor.sh/" 
            target="_blank" 
            rel="noopener noreferrer"
            className="flex flex-col items-center hover:opacity-80 transition-opacity"
            title="Cursor"
          >
            <svg width="28" height="28" viewBox="0 0 512 512" fill="none" xmlns="http://www.w3.org/2000/svg">
              <rect width="512" height="512" rx="100" fill={isDarkMode ? "#111111" : "#111111"} />
              <path d="M346.5 165.5L165.5 220.5L220.5 346.5L346.5 165.5Z" stroke="white" strokeWidth="25" />
            </svg>
            <span className="text-xs mt-1">Cursor</span>
          </a>

          {/* Logo Vercel */}
          <a 
            href="https://vercel.com/" 
            target="_blank" 
            rel="noopener noreferrer"
            className="flex flex-col items-center hover:opacity-80 transition-opacity"
            title="Vercel"
          >
            <svg width="28" height="28" viewBox="0 0 512 512" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M256 48L496 464H16L256 48Z" fill={isDarkMode ? "#FFFFFF" : "#000000"} />
            </svg>
            <span className="text-xs mt-1">Vercel</span>
          </a>

          {/* Logo GitHub */}
          <a 
            href="https://github.com/" 
            target="_blank" 
            rel="noopener noreferrer"
            className="flex flex-col items-center hover:opacity-80 transition-opacity"
            title="GitHub"
          >
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 0C5.374 0 0 5.373 0 12C0 17.302 3.438 21.8 8.207 23.387C8.806 23.498 9 23.126 9 22.81V20.576C5.662 21.302 4.967 19.16 4.967 19.16C4.421 17.773 3.634 17.404 3.634 17.404C2.545 16.659 3.717 16.675 3.717 16.675C4.922 16.759 5.556 17.912 5.556 17.912C6.626 19.746 8.363 19.216 9.048 18.909C9.155 18.134 9.466 17.604 9.81 17.305C7.145 17 4.343 15.971 4.343 11.374C4.343 10.063 4.812 8.993 5.579 8.153C5.455 7.85 5.044 6.629 5.696 4.977C5.696 4.977 6.704 4.655 8.997 6.207C9.954 5.941 10.98 5.808 12 5.803C13.02 5.808 14.047 5.941 15.006 6.207C17.297 4.655 18.303 4.977 18.303 4.977C18.956 6.63 18.545 7.851 18.421 8.153C19.191 8.993 19.656 10.064 19.656 11.374C19.656 15.983 16.849 16.998 14.177 17.295C14.607 17.667 15 18.397 15 19.517V22.81C15 23.129 15.192 23.504 15.801 23.386C20.566 21.797 24 17.3 24 12C24 5.373 18.627 0 12 0Z" fill={isDarkMode ? "#FFFFFF" : "#181717"} />
            </svg>
            <span className="text-xs mt-1">GitHub</span>
          </a>
        </div>
        
        <div className="flex flex-col items-center">
          <p className="text-sm font-light">
            Made with <span className="text-red-500">♥</span> by Stefano Vananti
          </p>
          
          <div className="flex items-center mt-2 space-x-4">
            <a 
              href="https://github.com/stedbrown" 
              target="_blank" 
              rel="noopener noreferrer"
              className={`text-xs hover:underline ${isDarkMode ? 'text-blue-300' : 'text-blue-600'}`}
            >
              GitHub
            </a>
            <a 
              href="https://www.linkedin.com/in/ste-v-b72950240/" 
              target="_blank" 
              rel="noopener noreferrer"
              className={`text-xs hover:underline ${isDarkMode ? 'text-blue-300' : 'text-blue-600'}`}
            >
              LinkedIn
            </a>
          </div>
          
          <p className="text-xs mt-2 opacity-70">
            © {new Date().getFullYear()} - Tutti i diritti riservati
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer; 