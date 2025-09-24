import React, { useState } from 'react';
import { X } from 'lucide-react';
import NavigateSurah from '../pages/NavigateSurah';
import Verse from '../pages/Verse';
import JuzNavigate from '../pages/JuzNavigate';
import DemoPage from '../pages/DemoItems';

const NavigateQuran = ({ onClose }) => {
  const [activeTab, setActiveTab] = useState('Surah');

  const tabs = ['Surah', 'Verse', 'Juz', 'Page'];

  const renderTabContent = () => {
    switch (activeTab) {
      case 'Surah':
        return <NavigateSurah onClose={onClose} />;
      case 'Verse':
        return <Verse onClose={onClose} />;
      case 'Juz':
        return <JuzNavigate onClose={onClose} />;
      case 'Page':
        return <DemoPage onClose={onClose} />;
      default:
        return null;
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-lg w-96 max-h-96 flex flex-col">
      {/* Header with tabs */}
      <div className="flex items-center bg-gray-50 rounded-full p-1 m-2">
  {tabs.map((tab) => (
    <button
      key={tab}
      onClick={() => setActiveTab(tab)}
      className={`px-4 py-1.5 text-sm font-medium rounded-full transition-colors ${
        activeTab === tab
          ? 'bg-gray-200 text-gray-900'
          : 'text-gray-500 hover:text-gray-700'
      }`}
    >
      {tab}
    </button>
  ))}
</div>


      {/* Content */}
      <div className="flex-1 overflow-hidden">
        {renderTabContent()}
      </div>

      {/* Footer tip */}
      <div className="px-4 py-2 text-xs text-gray-400 border-t border-gray-100 bg-gray-50">
        Tip: try navigating with <kbd className="px-1 py-0.5 bg-gray-200 rounded text-xs">Ctrl k</kbd>
      </div>
    </div>
  );
};

// NavigateSurah component for the Surah tab
const NavigateSurah = () => {
  const [searchTerm, setSearchTerm] = useState('');



  return (
    <div className="flex flex-col h-full">



    </div>
  );
};

export default NavigateQuran;