import { useState, useEffect, useRef } from 'react';

interface UseAudioAnalyzerReturn {
  audioData: Uint8Array | null;
  averageIntensity: number;
  startAnalyzer: (stream: MediaStream) => void;
  stopAnalyzer: () => void;
}

export const useAudioAnalyzer = (): UseAudioAnalyzerReturn => {
  const [audioData, setAudioData] = useState<Uint8Array | null>(null);
  const [averageIntensity, setAverageIntensity] = useState(0);
  
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const sourceRef = useRef<MediaStreamAudioSourceNode | null>(null);
  const animationFrameRef = useRef<number>();
  
  // Funzione per avviare l'analyzer
  const startAnalyzer = (stream: MediaStream) => {
    if (!audioContextRef.current) {
      audioContextRef.current = new AudioContext();
      analyserRef.current = audioContextRef.current.createAnalyser();
      analyserRef.current.fftSize = 256;
    }
    
    if (sourceRef.current) {
      sourceRef.current.disconnect();
    }
    
    if (audioContextRef.current && analyserRef.current) {
      sourceRef.current = audioContextRef.current.createMediaStreamSource(stream);
      sourceRef.current.connect(analyserRef.current);
      
      const updateAudioData = () => {
        if (analyserRef.current) {
          const dataArray = new Uint8Array(analyserRef.current.frequencyBinCount);
          analyserRef.current.getByteFrequencyData(dataArray);
          
          const average = dataArray.reduce((acc, val) => acc + val, 0) / dataArray.length / 255;
          
          setAudioData(dataArray);
          setAverageIntensity(average);
        }
        
        animationFrameRef.current = requestAnimationFrame(updateAudioData);
      };
      
      updateAudioData();
    }
  };
  
  // Funzione per fermare l'analyzer
  const stopAnalyzer = () => {
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
    }
    
    if (sourceRef.current) {
      sourceRef.current.disconnect();
      sourceRef.current = null;
    }
    
    setAudioData(null);
    setAverageIntensity(0);
  };
  
  // Pulisci quando il componente viene smontato
  useEffect(() => {
    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
      
      if (sourceRef.current) {
        sourceRef.current.disconnect();
      }
      
      if (audioContextRef.current) {
        audioContextRef.current.close().catch(console.error);
      }
    };
  }, []);
  
  return {
    audioData,
    averageIntensity,
    startAnalyzer,
    stopAnalyzer
  };
}; 