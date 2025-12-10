import React, { useState, useRef, useEffect } from 'react';
import { transformerService } from '../services/transformerService';
import { detectObjectsWithGemini } from '../services/geminiService';
import { ModelStatus, DetectedObject, GeminiObjectResult } from '../types';
import { Upload, Loader2, Maximize, AlertCircle } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';

const ObjectDetectionTab: React.FC = () => {
  const [image, setImage] = useState<string | null>(null);
  const [status, setStatus] = useState<ModelStatus>(ModelStatus.IDLE);
  const [localObjects, setLocalObjects] = useState<DetectedObject[]>([]);
  const [geminiObjects, setGeminiObjects] = useState<GeminiObjectResult[]>([]);
  
  const imageRef = useRef<HTMLImageElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (evt) => {
        setImage(evt.target?.result as string);
        setLocalObjects([]);
        setGeminiObjects([]);
        setStatus(ModelStatus.IDLE);
      };
      reader.readAsDataURL(file);
    }
  };

  const drawBoxes = (objects: DetectedObject[]) => {
    const img = imageRef.current;
    const canvas = canvasRef.current;
    if (!img || !canvas) return;

    // Set canvas dimensions to match displayed image
    canvas.width = img.clientWidth;
    canvas.height = img.clientHeight;
    
    // Calculate scaling factors (natural size vs displayed size)
    const scaleX = canvas.width / img.naturalWidth;
    const scaleY = canvas.height / img.naturalHeight;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.lineWidth = 2;
    ctx.font = '16px Inter';

    objects.forEach((obj, i) => {
      const { xmin, ymin, xmax, ymax } = obj.box;
      const color = `hsl(${(i * 137) % 360}, 70%, 50%)`; // Generate distinct colors

      const x = xmin * scaleX;
      const y = ymin * scaleY;
      const w = (xmax - xmin) * scaleX;
      const h = (ymax - ymin) * scaleY;

      ctx.strokeStyle = color;
      ctx.strokeRect(x, y, w, h);

      ctx.fillStyle = color;
      const text = `${obj.label} ${Math.round(obj.score * 100)}%`;
      const textWidth = ctx.measureText(text).width;
      
      ctx.fillRect(x, y - 24, textWidth + 10, 24);
      ctx.fillStyle = '#fff';
      ctx.fillText(text, x + 5, y - 7);
    });
  };

  // Re-draw when image resizes or objects change
  useEffect(() => {
    if (localObjects.length > 0) {
       // Small timeout to ensure image is rendered
       setTimeout(() => drawBoxes(localObjects), 100);
    }
  }, [localObjects, image]);

  const runDetection = async () => {
    if (!image) return;
    setStatus(ModelStatus.LOADING);

    try {
      // 1. Local Transformers.js
      setStatus(ModelStatus.RUNNING);
      const pipeline = await transformerService.getObjectDetectionPipeline();
      // Transformers.js pipeline expects the image URL or element
      const output = await pipeline(image, { threshold: 0.5 });
      
      const detected: DetectedObject[] = output.map((o: any) => ({
        label: o.label,
        score: o.score,
        box: o.box
      }));
      setLocalObjects(detected);

      // 2. Cloud Gemini
      // Strip base64 header for API
      const base64Data = image.split(',')[1];
      const geminiData = await detectObjectsWithGemini(base64Data);
      setGeminiObjects(geminiData);

      setStatus(ModelStatus.READY);
    } catch (error) {
      console.error(error);
      setStatus(ModelStatus.ERROR);
    }
  };

  return (
    <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8 animate-in fade-in">
      {/* Left Column: Image & Local Detection */}
      <div className="space-y-6">
        <h3 className="text-xl font-bold text-indigo-400 flex items-center gap-2">
           <Maximize className="w-5 h-5" /> Local Detection (DETR)
        </h3>
        
        <div className="relative bg-slate-800 rounded-xl overflow-hidden border border-slate-700 min-h-[300px] flex items-center justify-center">
          {!image && (
            <div className="text-center p-8">
              <label className="cursor-pointer flex flex-col items-center gap-4 text-slate-400 hover:text-indigo-400 transition-colors">
                <Upload className="w-12 h-12" />
                <span className="font-medium">Upload Image to Analyze</span>
                <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
              </label>
            </div>
          )}
          
          {image && (
            <div className="relative w-full">
              <img 
                ref={imageRef}
                src={image} 
                alt="Upload" 
                className="w-full h-auto block"
              />
              <canvas 
                ref={canvasRef}
                className="absolute top-0 left-0 pointer-events-none"
              />
              {status === ModelStatus.RUNNING && (
                <div className="absolute inset-0 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center">
                  <div className="bg-slate-900 p-4 rounded-xl flex items-center gap-3 border border-slate-700">
                    <Loader2 className="w-6 h-6 animate-spin text-indigo-400" />
                    <span className="text-slate-200">Processing locally...</span>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {image && status !== ModelStatus.RUNNING && (
           <button 
             onClick={runDetection}
             className="w-full bg-indigo-600 hover:bg-indigo-500 text-white py-3 rounded-xl font-semibold transition-colors shadow-lg shadow-indigo-900/20"
           >
             Run Detection
           </button>
        )}
      </div>

      {/* Right Column: Results & Gemini */}
      <div className="space-y-6">
        <h3 className="text-xl font-bold text-blue-400 flex items-center gap-2">
           <AlertCircle className="w-5 h-5" /> Cloud Insights (Gemini)
        </h3>

        <div className="bg-slate-800 rounded-xl border border-slate-700 p-6 h-full flex flex-col">
          {status === ModelStatus.IDLE && (
            <div className="flex-1 flex items-center justify-center text-slate-500">
              Run detection to see comparison data
            </div>
          )}

          {status === ModelStatus.READY && (
            <div className="space-y-8">
              <div>
                <h4 className="text-sm font-semibold text-slate-400 mb-4 uppercase tracking-wider">Comparison Chart</h4>
                <div className="h-48 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={[...localObjects.map(o => ({ ...o, type: 'Local' })), ...geminiObjects.map(o => ({ ...o, score: o.confidence, type: 'Cloud' }))].slice(0, 6)}>
                      <XAxis dataKey="label" stroke="#94a3b8" fontSize={12} tickLine={false} />
                      <YAxis stroke="#94a3b8" fontSize={12} tickLine={false} />
                      <Tooltip 
                        contentStyle={{ backgroundColor: '#1e293b', borderColor: '#334155', color: '#f1f5f9' }}
                        itemStyle={{ color: '#f1f5f9' }}
                      />
                      <Bar dataKey="score" fill="#8884d8" radius={[4, 4, 0, 0]}>
                        {
                          // Conditional coloring
                          [...localObjects, ...geminiObjects].map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={index < localObjects.length ? '#818cf8' : '#60a5fa'} />
                          ))
                        }
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>

              <div>
                <h4 className="text-sm font-semibold text-slate-400 mb-4 uppercase tracking-wider">Gemini Details</h4>
                <div className="space-y-3">
                  {geminiObjects.map((obj, i) => (
                    <div key={i} className="bg-slate-700/50 p-3 rounded-lg border border-slate-600">
                      <div className="flex justify-between items-start mb-1">
                        <span className="font-bold text-blue-300">{obj.label}</span>
                        <span className="text-xs bg-slate-900 px-2 py-1 rounded text-slate-400">
                          {(obj.confidence * 100).toFixed(0)}% Conf
                        </span>
                      </div>
                      <p className="text-sm text-slate-300">{obj.description}</p>
                    </div>
                  ))}
                  {geminiObjects.length === 0 && <p className="text-slate-500">No specific insights returned.</p>}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ObjectDetectionTab;