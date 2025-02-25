import { useCallback } from 'react';

interface UseSoundsReturn {
  playStart: () => void;
  playResponse: () => void;
}

// Funzione per generare un suono utilizzando l'API Web Audio
const createSound = (
  frequency: number, 
  duration: number, 
  type: OscillatorType = 'sine', 
  volume: number = 0.5
) => {
  return () => {
    try {
      // Crea un nuovo contesto audio
      // Utilizziamo un cast più sicuro per il webkitAudioContext
      const AudioContextClass = window.AudioContext || 
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (window as any).webkitAudioContext;
      const audioContext = new AudioContextClass();
      
      // Crea un oscillatore
      const oscillator = audioContext.createOscillator();
      oscillator.type = type;
      oscillator.frequency.setValueAtTime(frequency, audioContext.currentTime);
      
      // Crea un nodo gain per controllare il volume
      const gainNode = audioContext.createGain();
      gainNode.gain.setValueAtTime(volume, audioContext.currentTime);
      
      // Applica una dissolvenza in uscita
      gainNode.gain.exponentialRampToValueAtTime(0.001, audioContext.currentTime + duration);
      
      // Collega i nodi
      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);
      
      // Avvia e ferma l'oscillatore
      oscillator.start();
      oscillator.stop(audioContext.currentTime + duration);
      
      // Chiudi il contesto audio dopo che il suono è terminato
      setTimeout(() => {
        audioContext.close().catch(console.error);
      }, duration * 1000 + 100);
    } catch (error) {
      console.error('Errore nella generazione del suono:', error);
    }
  };
};

export const useSounds = (): UseSoundsReturn => {
  // Crea suoni personalizzati
  const playStart = useCallback(createSound(880, 0.15, 'sine', 0.3), []);
  const playResponse = useCallback(createSound(440, 0.2, 'triangle', 0.2), []);

  return {
    playStart,
    playResponse
  };
}; 