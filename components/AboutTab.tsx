import React from 'react';
import { Cpu, Cloud, Zap, Shield } from 'lucide-react';

const AboutTab: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto space-y-12 animate-in fade-in slide-in-from-bottom-8 duration-700">
      <div className="text-center space-y-4">
        <h1 className="text-4xl md:text-5xl font-extrabold text-white tracking-tight">
          Client-side <span className="text-indigo-400">vs</span> Cloud AI
        </h1>
        <p className="text-xl text-slate-400 max-w-2xl mx-auto">
          Understanding when to run models in the browser using Transformers.js versus leveraging massive models via Gemini API.
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        <div className="bg-slate-800 p-8 rounded-2xl border border-indigo-500/30 relative overflow-hidden">
          <div className="absolute top-0 right-0 p-4 opacity-10">
            <Cpu className="w-32 h-32" />
          </div>
          <h2 className="text-2xl font-bold text-indigo-400 mb-4 flex items-center gap-2">
            <Cpu className="w-6 h-6" /> Transformers.js
          </h2>
          <ul className="space-y-3 text-slate-300">
            <li className="flex gap-3">
              <Shield className="w-5 h-5 text-indigo-500 shrink-0" />
              <span><strong>Privacy First:</strong> Data never leaves the user's device. Perfect for sensitive input.</span>
            </li>
            <li className="flex gap-3">
              <Zap className="w-5 h-5 text-indigo-500 shrink-0" />
              <span><strong>Zero Latency:</strong> No network requests after initial model download. Instant interactions.</span>
            </li>
            <li className="flex gap-3">
              <Zap className="w-5 h-5 text-indigo-500 shrink-0" />
              <span><strong>Offline Capable:</strong> Works without an internet connection once loaded.</span>
            </li>
          </ul>
        </div>

        <div className="bg-slate-800 p-8 rounded-2xl border border-blue-500/30 relative overflow-hidden">
           <div className="absolute top-0 right-0 p-4 opacity-10">
            <Cloud className="w-32 h-32" />
          </div>
          <h2 className="text-2xl font-bold text-blue-400 mb-4 flex items-center gap-2">
            <Cloud className="w-6 h-6" /> Gemini API
          </h2>
          <ul className="space-y-3 text-slate-300">
             <li className="flex gap-3">
              <Zap className="w-5 h-5 text-blue-500 shrink-0" />
              <span><strong>Massive Knowledge:</strong> Access to billions of parameters for nuanced reasoning.</span>
            </li>
            <li className="flex gap-3">
              <Zap className="w-5 h-5 text-blue-500 shrink-0" />
              <span><strong>Multimodal:</strong> Native understanding of images, video, and audio beyond simple classification.</span>
            </li>
            <li className="flex gap-3">
              <Zap className="w-5 h-5 text-blue-500 shrink-0" />
              <span><strong>Complex Logic:</strong> Can explain "why" a sentiment is positive, not just label it.</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default AboutTab;