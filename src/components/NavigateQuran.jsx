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
    <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl w-full max-w-2xl h-[80vh] flex flex-col overflow-hidden">
      {/* Header with tabs */}
      <div className="relative flex items-center justify-between bg-gray-50 dark:bg-gray-800 px-4 py-3 border-b border-gray-200 dark:border-gray-700 flex-shrink-0">
        {/* Tabs Row */}
        <div className="flex items-center gap-0.5 flex-1 justify-center">
          {tabs.map((tab, index) => (
            <React.Fragment key={tab}>
              <button
                onClick={() => setActiveTab(tab)}
                className={`px-4 py-1.5 text-base font-semibold rounded-xl transition-all duration-200 whitespace-nowrap focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-500 ${
                  activeTab === tab
                    ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm border-2 border-cyan-300'
                    : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200 hover:bg-white/50 dark:hover:bg-gray-700/50 border-2 border-transparent'
                }`}
                style={{ minWidth: 64 }}
              >
                {tab}
              </button>
              {index < tabs.length - 1 && (
                <span className="flex items-center justify-center h-6 mx-1 text-gray-300 dark:text-gray-600 text-base select-none">|</span>
              )}
            </React.Fragment>
          ))}
        </div>
        {/* Close Button */}
        <button
          onClick={onClose}
          className="flex-shrink-0 ml-3 p-2 rounded-full bg-white dark:bg-gray-700 shadow border border-gray-200 dark:border-gray-600 text-gray-500 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-600 focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-500 transition-all flex items-center justify-center"
          aria-label="Close"
          style={{ alignSelf: 'center' }}
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Search Section */}
      <div className="px-4 py-3 border-b border-gray-200 dark:border-gray-700 flex-shrink-0">
        <input
          type="text"
          placeholder={`Search ${activeTab}`}
          className="w-full px-4 py-2.5 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-sm text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all"
        />
      </div>

      {/* Content - Scrollable with 80% of modal height */}
      <div className="flex-1 overflow-y-auto">
        {renderTabContent()}
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