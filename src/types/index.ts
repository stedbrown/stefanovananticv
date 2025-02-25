export interface Point {
  x: number;
  y: number;
  angle: number;
  velocity: number;
  distance: number;
  baseDistance: number;
  targetDistance: number;
  phase: number;
}

export interface ColorScheme {
  hue1: number;
  hue2: number;
  primary: string;
  secondary: string;
  highlight: string;
  glow: string;
  background: string;
}

export type BlobState = 'idle' | 'listening' | 'responding' | 'interrupted' | 'error';

export interface ThemeProps {
  isDarkMode: boolean;
}

export interface AudioVisualizerProps extends ThemeProps {
  isListening: boolean;
  isPressed: boolean;
  onToggleListening: () => void;
  onPressStart: () => void;
  onPressEnd: () => void;
  audioData?: Uint8Array | null;
  averageIntensity?: number;
  blobState: BlobState;
}

export interface MessageProps extends ThemeProps {
  type: 'user' | 'ai';
  content: string;
  isLoading?: boolean;
}

export interface ThemeToggleProps {
  isDarkMode: boolean;
  onToggle: () => void;
} 