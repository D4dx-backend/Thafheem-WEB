import React from 'react';
import { Settings, Heart, CheckCircle } from 'lucide-react';

const WhatsNew = () => {
  const newFeatures = [
    "Revamped Settings UI for better experience.",
    "Ramadhan Counter for tracking days",
    "Live from Haram streaming",
    "Prayer Times with location-based updates",
    "Nearby Mosque Locator with maps integration",
    "Digital Tasbeeh Counter",
    "Updated Home Screen with modern navigation",
    "Dark mode support across all screens"
  ];

  const prayerFeatures = [
    "Accurate Prayer Times with multiple calculation methods",
    "Qibla Direction Finder",
    "Morning & Evening Dhikr collections",
    "After-Prayer Dhikr guide",
    "Digital Tasbeeh with counter and vibration",
    "Prayer time notifications",
    "Juristic school selection for prayer times",
    "Next prayer countdown timer",
    "Settings icon added to prayer page"
  ];

  return (
    <div className="w-full dark:bg-black mx-auto p-6 bg-white">
            <div className="max-w-4xl mx-auto">

      {/* Header Section */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2 dark:text-white">What's New</h1>
        <p className="text-lg font-semibold text-gray-700 mb-1 dark:text-white">Version 4.0.48</p>
        <p className="text-gray-500 dark:text-white">Discover our latest updates and improvements</p>
      </div>

      {/* New Features & UI Section */}
      <div className="mb-8">
        <div className="flex items-center mb-6">
          <div className="bg-[#2AA0BF] rounded-lg p-2 mr-3">
            <Settings className="w-6 h-6 text-white" />
          </div>
          <h2 className="text-xl font-semibold text-[#2AA0BF] dark:text-white">New Features & UI:</h2>
        </div>
        
        <div className="space-y-3">
          {newFeatures.map((feature, index) => (
            <div key={index} className="flex items-start">
              <CheckCircle className="w-5 h-5 text-[#2AA0BF] dark:text-white mt-0.5 mr-3 flex-shrink-0" />
              <p className="text-gray-700 leading-relaxed dark:text-white">{feature}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Prayer & Worship Features Section */}
      <div>
        <div className="flex items-center mb-6">
          <div className="bg-[#2AA0BF] rounded-lg p-2 mr-3">
            <Heart className="w-6 h-6 text-white" />
          </div>
          <h2 className="text-xl font-semibold text-[#2AA0BF] ">Prayer & Worship Features:</h2>
        </div>
        
        <div className="space-y-3">
          {prayerFeatures.map((feature, index) => (
            <div key={index} className="flex items-start">
              <CheckCircle className="w-5 h-5 text-[#2AA0BF] dark:text-white mt-0.5 mr-3 flex-shrink-0" />
              <p className="text-gray-700 leading-relaxed dark:text-white">{feature}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
    </div>

  );
};

export default WhatsNew;