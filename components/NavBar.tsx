import React from 'react';
import { BrainCircuit, Image as ImageIcon, MessageSquare, Info } from 'lucide-react';
import { AppTab } from '../types';

interface NavBarProps {
  currentTab: AppTab;
  onTabChange: (tab: AppTab) => void;
}

const NavBar: React.FC<NavBarProps> = ({ currentTab, onTabChange }) => {
  const navItems = [
    { id: AppTab.SENTIMENT, label: 'Sentiment', icon: MessageSquare },
    { id: AppTab.OBJECT_DETECTION, label: 'Vision', icon: ImageIcon },
    { id: AppTab.ABOUT, label: 'About', icon: Info },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 md:top-0 md:bottom-auto z-50 bg-slate-900/95 backdrop-blur border-t md:border-t-0 md:border-b border-slate-700 p-4">
      <div className="max-w-6xl mx-auto flex items-center justify-between">
        <div className="hidden md:flex items-center gap-2 font-bold text-xl text-indigo-400">
          <BrainCircuit className="w-8 h-8" />
          <span>NeuroWeb</span>
        </div>
        
        <div className="flex w-full md:w-auto justify-around md:gap-8">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => onTabChange(item.id)}
              className={`flex flex-col md:flex-row items-center gap-1 md:gap-2 px-3 py-2 rounded-lg transition-colors ${
                currentTab === item.id
                  ? 'text-indigo-400 bg-indigo-950/50'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <item.icon className="w-5 h-5" />
              <span className="text-xs md:text-sm font-medium">{item.label}</span>
            </button>
          ))}
        </div>
      </div>
    </nav>
  );
};

export default NavBar;