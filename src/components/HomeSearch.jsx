import {
  Search,
  Mic,
  Play,
  List,
  Bookmark,
  TrendingUp,
  X,
  ChevronRight,
} from "lucide-react";
import { useState } from "react";
import logo from "../assets/logo.png";
import banner from "../assets/banner.png";

const HomepageSearch = () => {
  const [showPopular, setShowPopular] = useState(false);

  // Popular chapters data
  const popularChapters = [
    { id: 67, name: "Al-Mulk", verses: "30 verses" },
    { id: 2, name: "Al-Baqarah", verses: "285-286" },
    { id: 1, name: "Al-Fatiha", verses: "7 verses" },
    { id: 18, name: "Al-Kahf", verses: "110 verses" },
    { id: 36, name: "Ya-Sin", verses: "83 verses" },
  ];
  return (
    <div className="flex flex-col items-center justify-center  bg-white px-4">
      {/* Logo Section */}
      <div className="">
        <img src={banner} alt="Logo" className="w-full h-full object-contain" />
      </div>
      <div className="">
        <img src={logo} alt="Logo" className="w-full h-full object-contain" />
      </div>

      {/* Search Bar */}
      <div className="w-full max-w-3xl mb-8">
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="text"
            placeholder="Search the Quran..."
            className="w-full pl-12 pr-12 py-4 border border-gray-200 rounded-full focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent bg-white shadow-sm text-gray-700 placeholder-gray-400"
          />
          <div className="absolute inset-y-0 right-0 pr-4 flex items-center">
            <button className="text-gray-400 hover:text-cyan-500 transition-colors">
              <Mic className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Popular Content - Shows below search bar */}
        {showPopular && (
          <div className="mt-4 bg-white rounded-lg shadow-lg border border-gray-200 p-6 w-full">
            {/* Header */}
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-2">
                <TrendingUp className="h-5 w-5 text-cyan-500" />
                <h2 className="text-lg font-medium text-gray-900">Popular</h2>
              </div>
              <button
                onClick={() => setShowPopular(false)}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X className="h-6 w-6" />
              </button>
            </div>

            {/* Content */}
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                Chapters and Verses
              </h3>

              {/* Popular Chapters */}
              <div className="flex gap-3 mb-6 overflow-x-auto whitespace-nowrap scrollbar-hide pr-4">
  {popularChapters.map((chapter, index) => (
    <button
      key={index}
      className="inline-flex items-center space-x-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-full transition-colors text-sm text-gray-700"
      style={index === popularChapters.length - 1 ? { marginRight: "1rem" } : {}}
    >
      <span>
        {chapter.id}. {chapter.name}
      </span>
      <ChevronRight className="h-4 w-4" />
    </button>
  ))}
</div>


              {/* Listen to Quran Tajwid */}
              <div className="flex flex-col items-center  bg-gray-50 rounded-lg text-center">
  <div className="flex items-center space-x-3">
    <div className="flex items-center justify-center w-10 h-7 bg-gray-200 rounded-full">
      <Play className="h-5 w-5 text-gray-600" />
    </div>
    <h4 className="font-medium text-gray-900">
      Listen to Quran Tajwid
    </h4>
  </div>
</div>

            </div>
          </div>
        )}
      </div>

      {/* Action Buttons */}
      <div className="flex justify-center gap-4 max-w-4xl overflow-x-auto">
        <button className="flex items-center space-x-2 px-6 py-3 bg-cyan-50 border border-cyan-200 rounded-full hover:shadow-md hover:bg-cyan-100 transition-all duration-200 text-cyan-600 hover:text-cyan-700">
          <Play className="h-4 w-4 fill-current" />
          <span className="text-sm font-medium">Continue Reading</span>
        </button>

        <button className="flex items-center space-x-2 px-6 py-3 bg-cyan-50 border border-cyan-200 rounded-full hover:shadow-md hover:bg-cyan-100 transition-all duration-200 text-cyan-600 hover:text-cyan-700">
          <List className="h-4 w-4" />
          <span className="text-sm font-medium">Navigate Quran</span>
        </button>

        <button className="flex items-center space-x-2 px-6 py-3 bg-cyan-50 border border-cyan-200 rounded-full hover:shadow-md hover:bg-cyan-100 transition-all duration-200 text-cyan-600 hover:text-cyan-700">
          <Bookmark className="h-4 w-4" />
          <span className="text-sm font-medium">Bookmarks</span>
        </button>

        <button
          onClick={() => setShowPopular(true)}
          className="flex items-center space-x-2 px-6 py-3 bg-cyan-50 border border-cyan-200 rounded-full hover:shadow-md hover:bg-cyan-100 transition-all duration-200 text-cyan-600 hover:text-cyan-700"
        >
          <TrendingUp className="h-4 w-4" />
          <span className="text-sm font-medium">Popular</span>
        </button>
      </div>
    </div>
  );
};

export default HomepageSearch;
