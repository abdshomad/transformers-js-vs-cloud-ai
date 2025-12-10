export enum AppTab {
  SENTIMENT = 'sentiment',
  OBJECT_DETECTION = 'object_detection',
  ABOUT = 'about'
}

export interface SentimentResult {
  label: string;
  score: number;
  source: 'Local (DistilBERT)' | 'Cloud (Gemini)';
  explanation?: string;
}

export interface ObjectDetectionBox {
  xmin: number;
  ymin: number;
  xmax: number;
  ymax: number;
}

export interface DetectedObject {
  label: string;
  score: number;
  box: ObjectDetectionBox;
}

export interface GeminiObjectResult {
  label: string;
  confidence: number;
  description: string;
}

export enum ModelStatus {
  IDLE = 'idle',
  LOADING = 'loading',
  READY = 'ready',
  RUNNING = 'running',
  ERROR = 'error'
}