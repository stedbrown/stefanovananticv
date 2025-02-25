import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';

// Funzione per rimuovere il contenuto di fallback
const removeLoadingSpinner = () => {
  const loadingContainer = document.querySelector('.loading-container');
  if (loadingContainer && loadingContainer.parentNode) {
    loadingContainer.parentNode.removeChild(loadingContainer);
  }
};

// Funzione per mostrare un messaggio di errore
const showErrorMessage = (message: string) => {
  console.error(message);
  
  const errorElement = document.getElementById('error-message');
  if (errorElement) {
    errorElement.style.display = 'block';
    
    // Aggiungi il messaggio di errore specifico
    const errorMessageElement = document.createElement('p');
    errorMessageElement.textContent = message;
    errorMessageElement.style.fontWeight = 'bold';
    errorElement.appendChild(errorMessageElement);
  }
};

// Elemento root per il rendering dell'applicazione
const rootElement = document.getElementById('root');

// Verifica che l'elemento root esista
if (!rootElement) {
  showErrorMessage('Elemento root non trovato. Verifica che esista un elemento con id "root" nel file HTML.');
} else {
  try {
    console.log('Inizializzazione dell\'applicazione...');
    
    // Crea il root React
    const root = createRoot(rootElement);
    
    // Rendering dell'applicazione
    root.render(
      <StrictMode>
        <App />
      </StrictMode>
    );
    
    // Rimuovi il contenuto di fallback dopo che React è stato montato
    setTimeout(removeLoadingSpinner, 500);
    
    console.log('Applicazione montata con successo.');
  } catch (error) {
    let errorMessage = 'Errore durante il rendering dell\'applicazione.';
    
    if (error instanceof Error) {
      errorMessage += ` ${error.message}`;
    }
    
    showErrorMessage(errorMessage);
    console.error('Dettagli dell\'errore:', error);
  }
}
