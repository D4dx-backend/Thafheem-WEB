import React from 'react';
import { Settings, Heart, CheckCircle,Bell,ShieldCheck,BookOpen } from 'lucide-react';

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
const prayerNotification =[
  "Customizable prayer time alerts",
  "Adhan notification options"

]

const  Reading = [
  "Surah numbers on all pages",
  "Improved Malayalam typography",
  "Enhanced English translations",
  "Show Surah & Verse Range in Interpretation",
  "Next/Previous Surah navigation",
  "Smooth page navigation system",
  "Dynamic Surah name display while scrolling",
  "Verse highlighting and selection"
]

  return (
    <div className=" dark:bg-black mx-auto p-6 bg-white">
            <div className="max-w-[1070px] w-full mx-auto">

      {/* Header Section */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2 dark:text-white">What's New</h1>
        <p className="text-lg font-semibold text-gray-700 mb-1 dark:text-white">Version 4.0.48</p>
        <p className="text-gray-500 dark:text-[#808080] border-b border-[#808080]">Discover our latest updates and improvements</p>
      </div>

      {/* New Features & UI Section */}
      <div className="mb-8">
        <div className="flex items-center mb-6">
          <div className="bg-[#2AA0BF] rounded-lg p-2 mr-3">
            <Settings className="w-6 h-6 text-white" />
          </div>
          <h2 className="text-xl font-semibold text-[#2AA0BF] dark:text-[#2AA0BF]">New Features & UI:</h2>
        </div>
        
        <div className="space-y-3">
          {newFeatures.map((feature, index) => (
            <div key={index} className="flex items-start">
              <ShieldCheck className="w-5 h-5 text-[#2AA0BF] dark:text-[#2AA0BF] mt-0.5 mr-3 flex-shrink-0" />
              <p className="text-black leading-relaxed dark:text-white">{feature}</p>
            </div>
          ))}
        </div>
      </div>


      <div className="mb-8">
        <div className="flex items-center mb-6">
          <div className="bg-[#2AA0BF] rounded-lg p-2 mr-3">
            <Settings className="w-6 h-6 text-white" />
          </div>
          <h2 className="text-xl font-semibold text-[#2AA0BF] dark:text-[#2AA0BF]">Prayer & Worship Features:</h2>
        </div>
        
        <div className="space-y-3">
          {prayerFeatures.map((feature, index) => (
            <div key={index} className="flex items-start">
              <ShieldCheck className="w-5 h-5 text-[#2AA0BF] dark:text-[#2AA0BF] mt-0.5 mr-3 flex-shrink-0" />
              <p className="text-black leading-relaxed dark:text-white">{feature}</p>
            </div>
          ))}
        </div>
      </div>


      <div className="mb-8">
        <div className="flex items-center mb-6">
          <div className="bg-[#2AA0BF] rounded-lg p-2 mr-3">
            <Bell className="w-6 h-6 text-white" />
          </div>
          <h2 className="text-xl font-semibold text-[#2AA0BF] dark:text-[#2AA0BF]">Prayer Time Notification:</h2>
        </div>
        
        <div className="space-y-3">
          {prayerNotification.map((feature, index) => (
            <div key={index} className="flex items-start">
              <ShieldCheck className="w-5 h-5 text-[#2AA0BF] dark:text-[#2AA0BF] mt-0.5 mr-3 flex-shrink-0" />
              <p className="text-black leading-relaxed dark:text-white">{feature}</p>
            </div>
          ))}
        </div>
      </div>


      <div className="mb-8">
        <div className="flex items-center mb-6">
          <div className="bg-[#2AA0BF] rounded-lg p-2 mr-3">
            <BookOpen className="w-6 h-6 text-white" />
          </div>
          <h2 className="text-xl font-semibold text-[#2AA0BF] dark:text-[#2AA0BF]">Reading Experience:</h2>
        </div>
        
        <div className="space-y-3">
          {Reading.map((feature, index) => (
            <div key={index} className="flex items-start">
              <ShieldCheck className="w-5 h-5 text-[#2AA0BF] dark:text-[#2AA0BF] mt-0.5 mr-3 flex-shrink-0" />
              <p className="text-black leading-relaxed dark:text-white">{feature}</p>
            </div>
          ))}
        </div>
      </div>






    </div>
    </div>

  );
};

export default WhatsNew;