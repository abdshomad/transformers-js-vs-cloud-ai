import React from 'react';
import { SentimentResult } from '../types';
import { Smile, Frown, Cpu, Cloud } from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';

interface SentimentCardProps {
  result: SentimentResult;
}

const SentimentCard: React.FC<SentimentCardProps> = ({ result }) => {
  const isPositive = result.label === 'POSITIVE';
  const data = [
    { name: 'Confidence', value: result.score },
    { name: 'Uncertainty', value: 1 - result.score },
  ];
  
  const color = isPositive ? '#22c55e' : '#ef4444';

  return (
    <div className="bg-slate-800 rounded-xl p-6 border border-slate-700 flex flex-col gap-4">
      <div className="flex items-center justify-between pb-2 border-b border-slate-700">
        <div className="flex items-center gap-2">
           {result.source === 'Local (DistilBERT)' ? <Cpu className="w-5 h-5 text-purple-400" /> : <Cloud className="w-5 h-5 text-blue-400" />}
           <span className="font-semibold text-slate-200">{result.source}</span>
        </div>
        <span className={`text-sm font-bold px-2 py-1 rounded ${isPositive ? 'bg-green-900/50 text-green-400' : 'bg-red-900/50 text-red-400'}`}>
          {result.label}
        </span>
      </div>

      <div className="flex items-center gap-6">
        <div className="w-24 h-24 flex-shrink-0">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                innerRadius={30}
                outerRadius={40}
                startAngle={90}
                endAngle={-270}
                dataKey="value"
                stroke="none"
              >
                <Cell fill={color} />
                <Cell fill="#334155" />
              </Pie>
              <Tooltip formatter={(value: number) => `${(value * 100).toFixed(1)}%`} />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div className="flex flex-col">
          <div className="flex items-center gap-2 text-2xl font-bold">
            {isPositive ? <Smile className="text-green-500" /> : <Frown className="text-red-500" />}
            <span className={isPositive ? "text-green-400" : "text-red-400"}>
              {(result.score * 100).toFixed(1)}%
            </span>
          </div>
          {result.explanation && (
            <p className="text-sm text-slate-400 mt-2 leading-relaxed">
              "{result.explanation}"
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default SentimentCard;