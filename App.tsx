import React, { useState } from 'react';
import { AppTab } from './types';
import NavBar from './components/NavBar';
import SentimentTab from './components/SentimentTab';
import ObjectDetectionTab from './components/ObjectDetectionTab';
import AboutTab from './components/AboutTab';

const App: React.FC = () => {
  const [currentTab, setCurrentTab] = useState<AppTab>(AppTab.SENTIMENT);

  const renderContent = () => {
    switch (currentTab) {
      case AppTab.SENTIMENT:
        return <SentimentTab />;
      case AppTab.OBJECT_DETECTION:
        return <ObjectDetectionTab />;
      case AppTab.ABOUT:
        return <AboutTab />;
      default:
        return <SentimentTab />;
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 pb-24 md:pb-0">
      <NavBar currentTab={currentTab} onTabChange={setCurrentTab} />
      
      <main className="pt-8 md:pt-24 px-4 max-w-7xl mx-auto">
        {renderContent()}
      </main>
    </div>
  );
};

export default App;