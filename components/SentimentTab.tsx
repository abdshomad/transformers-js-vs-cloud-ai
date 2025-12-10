import React, { useState } from 'react';
import { transformerService } from '../services/transformerService';
import { analyzeSentimentWithGemini } from '../services/geminiService';
import { SentimentResult, ModelStatus } from '../types';
import SentimentCard from './SentimentCard';
import { Play, RotateCcw, Loader2 } from 'lucide-react';

const SentimentTab: React.FC = () => {
  const [input, setInput] = useState('I absolutely love using React for building web applications!');
  const [status, setStatus] = useState<ModelStatus>(ModelStatus.IDLE);
  const [localResult, setLocalResult] = useState<SentimentResult | null>(null);
  const [cloudResult, setCloudResult] = useState<SentimentResult | null>(null);

  const runAnalysis = async () => {
    if (!input.trim()) return;
    
    setStatus(ModelStatus.LOADING);
    setLocalResult(null);
    setCloudResult(null);

    try {
      // 1. Run Local (Transformers.js)
      setStatus(ModelStatus.RUNNING);
      const pipeline = await transformerService.getSentimentPipeline();
      const output = await pipeline(input);
      // Transformers.js returns array [{ label: 'POSITIVE', score: 0.99 }]
      const raw = output[0];
      
      setLocalResult({
        label: raw.label,
        score: raw.score,
        source: 'Local (DistilBERT)'
      });

      // 2. Run Cloud (Gemini)
      const geminiData = await analyzeSentimentWithGemini(input);
      setCloudResult({
        label: geminiData.label,
        score: geminiData.score,
        source: 'Cloud (Gemini)',
        explanation: geminiData.explanation
      });
      
      setStatus(ModelStatus.READY);
    } catch (error) {
      console.error(error);
      setStatus(ModelStatus.ERROR);
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="text-center space-y-2">
        <h2 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-indigo-400">
          Sentiment Analysis
        </h2>
        <p className="text-slate-400">
          Compare instant in-browser inference with deep cloud reasoning.
        </p>
      </div>

      <div className="bg-slate-800/50 p-1 rounded-xl border border-slate-700 flex gap-2">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && runAnalysis()}
          className="flex-1 bg-transparent border-none px-4 py-3 text-slate-100 placeholder-slate-500 focus:outline-none"
          placeholder="Type something here..."
        />
        <button
          onClick={runAnalysis}
          disabled={status === ModelStatus.LOADING || status === ModelStatus.RUNNING}
          className="bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed text-white px-6 py-2 rounded-lg font-medium transition-colors flex items-center gap-2"
        >
          {status === ModelStatus.LOADING || status === ModelStatus.RUNNING ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <Play className="w-4 h-4" />
          )}
          Analyze
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {localResult && <SentimentCard result={localResult} />}
        {cloudResult && <SentimentCard result={cloudResult} />}
      </div>

      {status === ModelStatus.LOADING && (
        <div className="text-center text-slate-500 py-12">
          <p>Loading model weights from Hugging Face (first run only)...</p>
        </div>
      )}
    </div>
  );
};

export default SentimentTab;