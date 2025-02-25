import React, { useRef, useEffect, useState, useCallback } from 'react';
import { AudioVisualizerProps, Point, ColorScheme, BlobState } from '../types';

interface SmoothPoint {
  x: number;
  y: number;
}

// Interfaccia per i punti luminosi
interface SparklePoint {
  x: number;
  y: number;
  size: number;
  alpha: number;
  speed: number;
  angle: number;
  distance: number;
}

const AudioVisualizer: React.FC<AudioVisualizerProps> = ({
  isDarkMode,
  isListening,
  isPressed,
  onToggleListening,
  onPressStart,
  onPressEnd,
  audioData,
  averageIntensity,
  blobState
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationFrameRef = useRef<number>();
  const colorTimeRef = useRef(0);
  const pointsRef = useRef<Point[]>([]);
  const sparklesRef = useRef<SparklePoint[]>([]);
  const lastStateRef = useRef<BlobState>(blobState);
  const [dimensions, setDimensions] = useState({ width: window.innerWidth, height: window.innerHeight });

  // Funzione per calcolare il raggio ottimale in base alle dimensioni del contenitore
  const calculateOptimalRadius = useCallback(() => {
    // Utilizziamo le dimensioni del contenitore invece che dello schermo intero
    const minDimension = Math.min(dimensions.width, dimensions.height);
    return minDimension * 0.4; // Raggio proporzionale alle dimensioni del contenitore
  }, [dimensions]);

  // Funzione per inizializzare i punti del blob
  const initializePoints = useCallback((centerX: number, centerY: number, radius: number) => {
    // Ridotto ulteriormente il numero di punti per una forma più coesa
    const numPoints = 120;
    return Array.from({ length: numPoints }, (_, i) => {
      const angle = (i / numPoints) * Math.PI * 2;
      return {
        x: centerX + Math.cos(angle) * radius,
        y: centerY + Math.sin(angle) * radius,
        angle,
        velocity: 0,
        distance: radius,
        baseDistance: radius,
        targetDistance: radius,
        phase: Math.random() * Math.PI * 2,
      };
    });
  }, []);

  // Funzione per inizializzare i punti luminosi
  const initializeSparkles = useCallback((centerX: number, centerY: number, radius: number, count: number) => {
    return Array.from({ length: count }, () => {
      const angle = Math.random() * Math.PI * 2;
      const distance = radius * (0.7 + Math.random() * 0.6);
      return {
        x: centerX + Math.cos(angle) * distance,
        y: centerY + Math.sin(angle) * distance,
        size: 1 + Math.random() * 2,
        alpha: 0.3 + Math.random() * 0.7,
        speed: 0.2 + Math.random() * 0.4,
        angle,
        distance
      };
    });
  }, []);

  // Gestione del ridimensionamento del canvas
  useEffect(() => {
    const handleResize = () => {
      // Otteniamo le dimensioni del contenitore genitore invece che della finestra
      const container = canvasRef.current?.parentElement;
      if (container) {
        setDimensions({
          width: container.clientWidth,
          height: container.clientHeight
        });
      }
    };

    // Chiamiamo handleResize all'inizio per impostare le dimensioni corrette
    handleResize();
    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Funzione per ottenere lo schema di colori in base allo stato
  const getColor = useCallback((time: number, intensity: number = 1, currentBlobState: BlobState, isDark: boolean): ColorScheme => {
    // Colori di base che cambiano nel tempo
    let hue1 = (Math.sin(time * 0.1) * 60 + 240) % 360;
    let hue2 = (hue1 + 40) % 360;
    let saturation = 100; // Massima saturazione per colori più vividi
    const lightness = isDark ? 
      (80 + Math.sin(time * 0.3) * 10) : // Più luminoso in modalità scura
      (60 + Math.sin(time * 0.3) * 10);  // Ridotto da 70 a 60 per migliorare il contrasto in modalità chiara
    
    // Modifica i colori in base allo stato del blob
    switch (currentBlobState) {
      case 'idle':
        // Colori rilassanti, blu-viola più vivaci
        hue1 = (Math.sin(time * 0.05) * 30 + 240) % 360;
        hue2 = (hue1 + 30) % 360;
        break;
      case 'listening':
        // Colori energici, blu-ciano più brillanti
        hue1 = (Math.sin(time * 0.15) * 30 + 200) % 360;
        hue2 = (hue1 + 50) % 360;
        break;
      case 'responding':
        // Colori caldi, verde-giallo più intensi
        hue1 = (Math.sin(time * 0.1) * 30 + 120) % 360;
        hue2 = (hue1 + 60) % 360;
        break;
      case 'interrupted':
        // Colori di attenzione, arancione-rosso più vividi
        hue1 = (Math.sin(time * 0.2) * 20 + 20) % 360;
        hue2 = (hue1 + 30) % 360;
        break;
      case 'error':
        // Colori di errore, rosso-viola più intensi
        hue1 = (Math.sin(time * 0.1) * 20 + 350) % 360;
        hue2 = (hue1 + 70) % 360;
        break;
    }
    
    // Aumentato l'opacità per migliorare la visibilità in modalità chiara
    const opacityBase = isDark ? 0.9 : 0.95;
    const opacitySecondary = isDark ? 0.8 : 0.85;
    const opacityHighlight = isDark ? 0.7 : 0.75;
    const opacityGlow = isDark ? 0.6 : 0.65;
    
    return {
      hue1,
      hue2,
      primary: `hsla(${hue1}, ${saturation}%, ${lightness}%, ${opacityBase + intensity * 0.05})`,
      secondary: `hsla(${hue2}, ${saturation}%, ${lightness + 10}%, ${opacitySecondary + intensity * 0.1})`,
      highlight: `hsla(${hue1}, ${saturation}%, ${lightness + 20}%, ${opacityHighlight + intensity * 0.2})`,
      glow: `hsla(${hue1}, ${saturation}%, ${lightness + 30}%, ${opacityGlow + intensity * 0.3})`,
      background: isDark ? 
        `hsla(${hue1}, ${saturation}%, ${lightness - 20}%, 0.1)` :
        `hsla(${hue1}, ${saturation}%, ${Math.max(lightness - 5, 0)}%, 0.15)` // Aumentato l'opacità e ridotto il decremento di luminosità
    };
  }, []);

  // Funzione per calcolare un punto smussato - migliorata per un effetto gelatina
  const smoothPoint = useCallback((points: Point[], index: number, amount: number): SmoothPoint => {
    const prev2 = points[(index - 2 + points.length) % points.length];
    const prev = points[(index - 1 + points.length) % points.length];
    const current = points[index];
    const next = points[(index + 1) % points.length];
    const next2 = points[(index + 2) % points.length];
    
    // Algoritmo migliorato per un effetto gelatina più fluido
    const x = current.x * (1 - amount) + 
              (prev2.x * 0.1 + prev.x * 0.2 + next.x * 0.2 + next2.x * 0.1) * amount / 0.6;
    const y = current.y * (1 - amount) + 
              (prev2.y * 0.1 + prev.y * 0.2 + next.y * 0.2 + next2.y * 0.1) * amount / 0.6;
    
    return { x, y };
  }, []);

  // Effetto principale per l'animazione del blob
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Funzione per ridimensionare il canvas
    const resizeCanvas = () => {
      canvas.width = dimensions.width;
      canvas.height = dimensions.height;
      
      // Imposta il clip path circolare
      ctx.beginPath();
      ctx.arc(dimensions.width / 2, dimensions.height / 2, dimensions.width / 2, 0, Math.PI * 2);
      ctx.clip();
    };

    resizeCanvas();

    // Posiziona il blob al centro del canvas
    const centerX = dimensions.width / 2;
    const centerY = dimensions.height / 2; // Centrato verticalmente
    
    // Calcola il raggio ottimale
    const radius = calculateOptimalRadius();

    // Inizializza i punti se non esistono o se sono cambiati i parametri
    if (pointsRef.current.length === 0 || 
        Math.abs(pointsRef.current[0].baseDistance - radius) > 1 ||
        Math.abs(pointsRef.current[0].x - centerX - Math.cos(pointsRef.current[0].angle) * radius) > 10) {
      pointsRef.current = initializePoints(centerX, centerY, radius);
      // Inizializza anche i punti luminosi
      sparklesRef.current = initializeSparkles(centerX, centerY, radius, 15);
    } else {
      // Aggiorna solo il centro e la distanza base dei punti esistenti
      pointsRef.current.forEach(point => {
        point.baseDistance = radius;
      });
    }

    let lastTime = Date.now();

    // Funzione per applicare una transizione fluida quando cambia lo stato
    const handleStateTransition = () => {
      if (lastStateRef.current !== blobState) {
        // Applica un effetto di transizione quando cambia lo stato
        pointsRef.current.forEach(point => {
          // Aggiungi un impulso di velocità per creare un effetto di transizione
          point.velocity += (Math.random() - 0.5) * 50;
        });
        
        lastStateRef.current = blobState;
      }
    };

    const animate = () => {
      if (!ctx || !canvas) return;

      const currentTime = Date.now();
      const deltaTime = Math.min((currentTime - lastTime) / 1000, 0.1); // Limita deltaTime per evitare salti
      lastTime = currentTime;
      
      // Velocità di animazione del colore in base allo stato
      let colorSpeed = 0.5; // Velocità base per idle
      if (blobState === 'listening') colorSpeed = 2;
      else if (blobState === 'responding') colorSpeed = 1.5;
      else if (blobState === 'interrupted') colorSpeed = 3;
      else if (blobState === 'error') colorSpeed = 1;
      
      colorTimeRef.current += deltaTime * colorSpeed;

      // Gestisci la transizione tra stati
      handleStateTransition();

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Utilizziamo l'intensità audio passata come prop
      const audioIntensity = averageIntensity || 0;
      
      const time = currentTime * 0.001;
      const colors = getColor(colorTimeRef.current, audioIntensity, blobState, isDarkMode);
      const pressEffect = isPressed ? 1.3 : 1;

      // Aggiorna il centro in caso di ridimensionamento
      const updatedCenterX = dimensions.width / 2;
      const updatedCenterY = dimensions.height / 2;

      // Analisi dei dati audio per influenzare la forma del blob
      let frequencyData: number[] = [];
      if (audioData && isListening) {
        frequencyData = Array.from(audioData);
      }

      // Parametri di animazione in base allo stato - ottimizzati per effetto gelatina
      let phaseSpeed = 0.08;
      let noiseMultiplier = 0.3;
      let springStrength = 2.0;
      let damping = 0.98;
      
      // Modifica i parametri in base allo stato
      switch (blobState) {
        case 'idle':
          // Movimento lento e fluido come una gelatina a riposo
          phaseSpeed = 0.03;
          noiseMultiplier = 0.25;
          springStrength = 1.5;
          damping = 0.985;
          break;
        case 'listening':
          // Movimento reattivo all'audio ma mantenendo la coesione
          phaseSpeed = 0.06;
          noiseMultiplier = 0.35;
          springStrength = 2.2;
          damping = 0.975;
          break;
        case 'responding':
          // Movimento ritmico e pulsante ma coeso
          phaseSpeed = 0.05;
          noiseMultiplier = 0.3;
          springStrength = 1.8;
          damping = 0.98;
          break;
        case 'interrupted':
          // Movimento brusco ma mantenendo la forma gelatinosa
          phaseSpeed = 0.08;
          noiseMultiplier = 0.4;
          springStrength = 2.5;
          damping = 0.97;
          break;
        case 'error':
          // Movimento instabile ma coeso
          phaseSpeed = 0.04;
          noiseMultiplier = 0.3;
          springStrength = 1.6;
          damping = 0.982;
          break;
      }

      pointsRef.current.forEach((point, i) => {
        // Aggiorna gradualmente la posizione del centro per ogni punto
        point.baseDistance = radius;
        
        // Velocità della fase in base allo stato e all'audio
        point.phase += deltaTime * (phaseSpeed + audioIntensity * 0.2);
        
        // Onde base per l'animazione - semplificate per un effetto gelatina
        // Utilizziamo solo due onde con frequenze basse per un movimento più fluido
        const wave1 = Math.sin(time * 0.15 + point.angle * 1.5 + point.phase) * 1.5;
        const wave2 = Math.cos(time * 0.2 + point.angle * 2 + point.phase) * 1.2;
        
        // Aggiungiamo l'influenza dell'audio in modo più uniforme
        let audioInfluence = 0;
        if (frequencyData.length > 0 && isListening) {
          // Utilizziamo meno bande di frequenza per un effetto più uniforme
          const freqIndex = Math.floor((i / pointsRef.current.length) * Math.min(frequencyData.length, 16));
          if (freqIndex < frequencyData.length) {
            // Normalizziamo il valore della frequenza (0-255) a un valore tra 0 e 1
            const freqValue = frequencyData[freqIndex] / 255;
            // Amplifichiamo l'effetto ma lo rendiamo più uniforme
            audioInfluence = freqValue * 5 * (1 + audioIntensity * 1.2);
          }
        }
        
        // Effetti speciali per gli stati, ma più contenuti per mantenere la coesione
        if (blobState === 'interrupted') {
          // Onda di shock più uniforme
          const shockWave = Math.sin(time * 5 - point.phase) * 3;
          audioInfluence += shockWave;
        }
        
        if (blobState === 'error') {
          // Deformazione più uniforme
          const errorNoise = Math.sin(point.angle * 4 + time * 1.5) * 2;
          audioInfluence += errorNoise;
        }
        
        const noise = (wave1 + wave2) * 
                     (isListening ? 1.1 : 1) * 
                     pressEffect * 
                     noiseMultiplier + 
                     audioInfluence;

        // Distanza target influenzata dall'audio e dallo stato
        point.targetDistance = point.baseDistance + noise * (3 + audioIntensity * 4);

        // Sistema a molla per movimento fluido - ottimizzato per effetto gelatina
        const stateSpringStrength = springStrength + audioIntensity * 0.6;
        const stateDamping = damping - audioIntensity * 0.02;

        const distanceDiff = point.targetDistance - point.distance;
        const springForce = distanceDiff * stateSpringStrength;

        point.velocity += springForce * deltaTime;
        point.velocity *= Math.pow(stateDamping, deltaTime * 60);

        point.distance += point.velocity * deltaTime;

        // Aggiorna le coordinate x e y in base al nuovo centro
        point.x = updatedCenterX + Math.cos(point.angle) * point.distance;
        point.y = updatedCenterY + Math.sin(point.angle) * point.distance;
      });

      // Smoothing dei punti per una forma più organica - aumentato per un effetto gelatina
      let smoothedPoints: SmoothPoint[] = pointsRef.current.map((_, i) => smoothPoint(pointsRef.current, i, 0.8));
      smoothedPoints = smoothedPoints.map((_, i) => smoothPoint(smoothedPoints as Point[], i, 0.7));
      smoothedPoints = smoothedPoints.map((_, i) => smoothPoint(smoothedPoints as Point[], i, 0.6));

      // Disegno del blob con curve più morbide
      ctx.beginPath();
      ctx.moveTo(smoothedPoints[0].x, smoothedPoints[0].y);

      // Utilizziamo curve di Bezier per un effetto più fluido e gelatinoso
      for (let i = 0; i < smoothedPoints.length; i++) {
        const current = smoothedPoints[i];
        const next = smoothedPoints[(i + 1) % smoothedPoints.length];
        const next2 = smoothedPoints[(i + 2) % smoothedPoints.length];
        
        // Punti di controllo per curve di Bezier più morbide
        const cp1x = current.x + (next.x - current.x) * 0.6;
        const cp1y = current.y + (next.y - current.y) * 0.6;
        const cp2x = next.x - (next2.x - next.x) * 0.2;
        const cp2y = next.y - (next2.y - next.y) * 0.2;
        
        ctx.bezierCurveTo(cp1x, cp1y, cp2x, cp2y, next.x, next.y);
      }

      ctx.closePath();

      // Aggiungi un bordo luminoso sottile per migliorare l'effetto di sopraelevazione
      ctx.strokeStyle = `hsla(${colors.hue1}, 100%, ${isDarkMode ? 85 : 75}%, ${isDarkMode ? 0.6 : 0.7})`;
      ctx.lineWidth = 1.5;
      ctx.stroke();

      // Stile di riempimento per effetto gelatina traslucida
      const blobGradient = ctx.createRadialGradient(
        updatedCenterX - radius * 0.2, updatedCenterY - radius * 0.2, 0,
        updatedCenterX, updatedCenterY, radius * 1.5
      );
      
      // Colori per effetto gelatina traslucida con maggiore opacità per il tema chiaro
      blobGradient.addColorStop(0, `hsla(${colors.hue1}, 100%, ${isDarkMode ? 90 : 80}%, ${isDarkMode ? 0.85 : 0.9})`);
      blobGradient.addColorStop(0.4, `hsla(${colors.hue1}, 100%, ${isDarkMode ? 80 : 70}%, ${isDarkMode ? 0.7 : 0.8})`);
      blobGradient.addColorStop(0.7, `hsla(${colors.hue2}, 95%, ${isDarkMode ? 70 : 60}%, ${isDarkMode ? 0.5 : 0.6})`);
      blobGradient.addColorStop(1, 'rgba(0, 0, 0, 0)');
      
      ctx.fillStyle = blobGradient;
      // Ombra più pronunciata per effetto sopraelevato, con valori diversi per tema chiaro e scuro
      ctx.shadowColor = colors.primary;
      ctx.shadowBlur = isDarkMode ? (30 + (isListening ? audioIntensity * 40 : 15)) : (25 + (isListening ? audioIntensity * 35 : 12));
      ctx.shadowOffsetY = isDarkMode ? 5 : 4; // Leggero offset per dare sensazione di altezza
      ctx.fill();

      // Effetto di riflessione della luce tipico della gelatina
      ctx.beginPath();
      ctx.arc(
        updatedCenterX - radius * 0.25, 
        updatedCenterY - radius * 0.25, 
        radius * 0.5, 
        0, 
        Math.PI * 2
      );
      const highlightGradient = ctx.createRadialGradient(
        updatedCenterX - radius * 0.25, 
        updatedCenterY - radius * 0.25, 
        0,
        updatedCenterX - radius * 0.25, 
        updatedCenterY - radius * 0.25, 
        radius * 0.5
      );
      highlightGradient.addColorStop(0, `hsla(${colors.hue1}, 90%, 98%, ${0.5})`);
      highlightGradient.addColorStop(0.5, `hsla(${colors.hue1}, 90%, 95%, ${0.3})`);
      highlightGradient.addColorStop(1, 'rgba(255, 255, 255, 0)');
      ctx.fillStyle = highlightGradient;
      ctx.shadowBlur = 0; // Rimuovi l'ombra per questo elemento
      ctx.shadowOffsetY = 0;
      ctx.fill();

      // Piccolo punto di luce per effetto gelatina
      ctx.beginPath();
      ctx.arc(
        updatedCenterX - radius * 0.35, 
        updatedCenterY - radius * 0.35, 
        radius * 0.05, 
        0, 
        Math.PI * 2
      );
      ctx.fillStyle = `hsla(${colors.hue1}, 80%, 98%, ${0.9})`;
      ctx.fill();

      // Aggiungi un effetto di ombra esterna per aumentare la sensazione di sopraelevazione
      ctx.beginPath();
      ctx.arc(updatedCenterX, updatedCenterY + 10, radius * 0.9, 0, Math.PI * 2);
      const shadowGradient = ctx.createRadialGradient(
        updatedCenterX, updatedCenterY + 10, 0,
        updatedCenterX, updatedCenterY + 10, radius * 1.2
      );
      shadowGradient.addColorStop(0, `rgba(0, 0, 0, ${0.2 + audioIntensity * 0.1})`);
      shadowGradient.addColorStop(0.7, `rgba(0, 0, 0, ${0.1 + audioIntensity * 0.05})`);
      shadowGradient.addColorStop(1, 'rgba(0, 0, 0, 0)');
      ctx.fillStyle = shadowGradient;
      ctx.shadowBlur = 0;
      ctx.shadowOffsetY = 0;
      ctx.globalCompositeOperation = 'destination-over';
      ctx.fill();
      ctx.globalCompositeOperation = 'source-over';

      // Aggiorna e disegna i punti luminosi (sparkles)
      sparklesRef.current.forEach(sparkle => {
        // Aggiorna la posizione dei punti luminosi
        sparkle.angle += sparkle.speed * deltaTime;
        sparkle.x = updatedCenterX + Math.cos(sparkle.angle) * sparkle.distance;
        sparkle.y = updatedCenterY + Math.sin(sparkle.angle) * sparkle.distance;
        
        // Varia l'alpha in base al tempo per un effetto di pulsazione
        sparkle.alpha = 0.3 + Math.sin(time * 2 + sparkle.angle) * 0.3;
        
        // Disegna il punto luminoso
        ctx.beginPath();
        ctx.arc(sparkle.x, sparkle.y, sparkle.size * (1 + audioIntensity * 0.5), 0, Math.PI * 2);
        ctx.fillStyle = `hsla(${colors.hue1 + 20}, 100%, 95%, ${sparkle.alpha})`;
        ctx.fill();
      });

      // Aggiungi un effetto di particelle che si muovono verso l'esterno quando si ascolta
      if (isListening && audioIntensity > 0.1) {
        const particleCount = Math.floor(audioIntensity * 3);
        for (let i = 0; i < particleCount; i++) {
          const angle = Math.random() * Math.PI * 2;
          const distance = radius * (0.6 + Math.random() * 0.4);
          const size = 1 + Math.random() * 2 * audioIntensity;
          
          const x = updatedCenterX + Math.cos(angle) * distance;
          const y = updatedCenterY + Math.sin(angle) * distance;
          
          ctx.beginPath();
          ctx.arc(x, y, size, 0, Math.PI * 2);
          ctx.fillStyle = `hsla(${colors.hue1}, 100%, 90%, ${0.6 * audioIntensity})`;
          ctx.fill();
        }
      }

      animationFrameRef.current = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [
    isListening, 
    isPressed, 
    isDarkMode, 
    audioData, 
    averageIntensity, 
    blobState, 
    dimensions, 
    calculateOptimalRadius, 
    initializePoints, 
    initializeSparkles,
    getColor, 
    smoothPoint
  ]);

  return (
    <canvas
      ref={canvasRef}
      className="absolute top-0 left-0 w-full h-full cursor-pointer rounded-full"
      onClick={onToggleListening}
      onMouseDown={onPressStart}
      onMouseUp={onPressEnd}
      onMouseLeave={onPressEnd}
      onTouchStart={onPressStart}
      onTouchEnd={onPressEnd}
      style={{
        background: 'transparent',
        backdropFilter: 'none',
        WebkitBackdropFilter: 'none',
        touchAction: 'manipulation' // Migliora la gestione del touch su mobile
      }}
    />
  );
};

export default AudioVisualizer; 