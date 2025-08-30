import React from "react";
import HomepageNavbar from "../components/HomeNavbar";
import HomepageSearch from "../components/HomeSearch";
import { useNavigate, useLocation } from "react-router-dom";
import StarNumber from "../components/StarNumber";
import { Play, Book } from "lucide-react";

const Juz = () => { 
  const KaabaIcon = ({ className }) => (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M3 21h18l-2-7H5l-2 7z" />
      <path d="M5 14V8a3 3 0 0 1 3-3h8a3 3 0 0 1 3 3v6" />
      <path d="M9 5V3a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2" />
    </svg>
  );
  // Accurate Juz data based on the image
  const juzData = [
    {
      id: 1,
      title: "Juz 1",
      surahs: [
        {
          number: 1,
          name: "Al-Fatihah",
          arabicText: "الْفَاتِحَة",
          verses: "1-7",
        },
        {
          number: 1,
          name: "Al-Fatihah",
          arabicText: "الْفَاتِحَة",
          verses: "1-7",
        },
      ],
    },
    
    {
      id: 3,
      title: "Juz 5",
      surahs: [
        {
          number: 1,
          name: "Al-Fatihah",
          arabicText: "الْفَاتِحَة",
          verses: "1-7",
        },
        {
          number: 1,
          name: "Al-Fatihah",
          arabicText: "الْفَاتِحَة",
          verses: "1-7",
        },
      ],
    },
    {
      id: 4,
      title: "Juz 3",
      surahs: [
        {
          number: 1,
          name: "Al-Fatihah",
          arabicText: "الْفَاتِحَة",
          verses: "1-7",
        },
        {
          number: 1,
          name: "Al-Fatihah",
          arabicText: "الْفَاتِحَة",
          verses: "1-7",
        },
      ],
    },
    {
      id: 20,
      title: "Juz 20",
      surahs: [
        {
          number: 1,
          name: "Al-Fatihah",
          arabicText: "الْفَاتِحَة",
          verses: "1-7",
        },
        {
          number: 1,
          name: "Al-Fatihah",
          arabicText: "الْفَاتِحَة",
          verses: "1-7",
        },
        {
          number: 1,
          name: "Al-Fatihah",
          arabicText: "الْفَاتِحَة",
          verses: "1-7",
        },
      ],
    },
    {
      id: 21,
      title: "Juz 6",
      surahs: [
        {
          number: 1,
          name: "Al-Fatihah",
          arabicText: "الْفَاتِحَة",
          verses: "1-7",
        },
        {
          number: 1,
          name: "Al-Fatihah",
          arabicText: "الْفَاتِحَة",
          verses: "1-7",
        },
        {
          number: 1,
          name: "Al-Fatihah",
          arabicText: "الْفَاتِحَة",
          verses: "1-7",
        },
      ],
    },
    {
      id: 22,
      title: "Juz 3",
      surahs: [
        {
          number: 1,
          name: "Al-Fatihah",
          arabicText: "الْفَاتِحَة",
          verses: "1-7",
        },
        {
          number: 1,
          name: "Al-Fatihah",
          arabicText: "الْفَاتِحَة",
          verses: "1-7",
        },
      ],
    },
 
  ];
  const juzData1 = [
    {
      id: 1,
      title: "Juz 2",
      surahs: [
        {
          number: 1,
          name: "Al-Fatihah",
          arabicText: "الْفَاتِحَة",
          verses: "1-7",
        },
        {
          number: 1,
          name: "Al-Fatihah",
          arabicText: "الْفَاتِحَة",
          verses: "1-7",
        },
        {
          number: 1,
          name: "Al-Fatihah",
          arabicText: "الْفَاتِحَة",
          verses: "1-7",
        },
      ],
    },
    {
      id: 2,
      title: "Juz 3",
      surahs: [
        {
          number: 1,
          name: "Al-Fatihah",
          arabicText: "الْفَاتِحَة",
          verses: "1-7",
        },

      ],
    },
    {
      id: 3,
      title: "Juz 3",
      surahs: [
        {
          number: 1,
          name: "Al-Fatihah",
          arabicText: "الْفَاتِحَة",
          verses: "1-7",
        },
        {
          number: 1,
          name: "Al-Fatihah",
          arabicText: "الْفَاتِحَة",
          verses: "1-7",
        },

      ],
    },
  ]
  const juzData2 = [
    {
      id: 23,
      title: "Juz 21",
      surahs: [
        {
          number: 1,
          name: "Al-Fatihah",
          arabicText: "الْفَاتِحَة",
          verses: "1-7",
        },
        {
          number: 1,
          name: "Al-Fatihah",
          arabicText: "الْفَاتِحَة",
          verses: "1-7",
        },
        {
          number: 1,
          name: "Al-Fatihah",
          arabicText: "الْفَاتِحَة",
          verses: "1-7",
        },
        {
          number: 1,
          name: "Al-Fatihah",
          arabicText: "الْفَاتِحَة",
          verses: "1-7",
        },
        {
          number: 1,
          name: "Al-Fatihah",
          arabicText: "الْفَاتِحَة",
          verses: "1-7",
        },
        {
          number: 1,
          name: "Al-Fatihah",
          arabicText: "الْفَاتِحَة",
          verses: "1-7",
        },
        {
          number: 1,
          name: "Al-Fatihah",
          arabicText: "الْفَاتِحَة",
          verses: "1-7",
        },
        {
          number: 1,
          name: "Al-Fatihah",
          arabicText: "الْفَاتِحَة",
          verses: "1-7",
        },
      ],
    },
  ]
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <>
      {/* <HomepageNavbar /> */}
      <HomepageSearch />
      <div className="min-h-screen bg-white dark:bg-black p-3 sm:p-4 w-full mx-auto">
        <div className="max-w-6xl mx-auto">
          {/* Header Tabs */}
          <div className="border-b border-gray-200 dark:border-gray-700">
            <div className="flex">
              <button
                onClick={() => navigate("/")}
                className={`px-4 sm:px-6 py-3 sm:py-4 text-sm font-medium border-b-2 transition-colors min-h-[48px] flex items-center ${
                  location.pathname === "/"
                    ? "border-cyan-500 text-cyan-600 dark:text-cyan-400"
                    : "border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
                }`}
              >
                Surah
              </button>
              <button
                onClick={() => navigate("/juz")}
                className={`px-4 sm:px-6 py-3 sm:py-4 text-sm font-medium border-b-2 transition-colors min-h-[48px] flex items-center ${
                  location.pathname === "/juz"
                    ? "border-cyan-500 text-cyan-600 dark:text-cyan-400"
                    : "border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
                }`}
              >
                Juz
              </button>
            </div>
          </div>

          {/* Juz Grid */}
{/* Juz Grid */}
<div className="grid grid-cols-1 md:grid-cols-3 gap-3 sm:gap-4 pt-4 sm:pt-6">

  {/* Left side - JuzData */}
  <div>
  {juzData.map((juz) => (
    <div
      key={juz.id}
      className="bg-[#EBEEF0] dark:bg-[#323A3F] rounded-xl shadow-sm border-gray-100 overflow-hidden m-4"
    >
      {/* Header */}
      <div className="bg-[#EBEEF0] dark:bg-[#323A3F] dark:text-white px-3 sm:px-4 py-3 flex justify-between items-center">
        <h3 className="text-sm font-medium text-gray-700 dark:text-white">
          {juz.title}
        </h3>
        <button className="text-black hover:text-black text-xs font-medium dark:text-white min-h-[32px] px-2">
          Read Juz
        </button>
      </div>

      {/* Surah List */}
      <div className="p-3 sm:p-4 space-y-2 sm:space-y-3 max-h-[70vh] overflow-y-auto">
        {juz.surahs.map((surah, index) => (
          <div
            key={index}
            className="flex flex-col p-3 sm:p-4 rounded-lg cursor-pointer transition-all duration-200 bg-white dark:bg-black hover:shadow-md"
          >
            {/* Top Row: Number + English + Arabic */}
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2 sm:space-x-3 flex-1 min-w-0">
                {/* Star Badge for Number */}
                <StarNumber
                  number={surah.number}
                  size={34}
                  color="#E5E7EB" // soft gray background like screenshot
                  textColor="#000"
                />
                <h4 className="text-sm sm:text-base font-semibold text-gray-900 dark:text-white truncate">
                  {surah.name}
                </h4>
              </div>

              {/* Arabic name */}
              <div className="text-right flex-shrink-0 ml-2">
                <p className="text-lg sm:text-xl font-arabic text-gray-900 dark:text-white leading-tight">
                  {surah.arabicText}
                </p>
              </div>
            </div>

            {/* Bottom Row: icons + ayah count */}
            <div className="flex items-center mt-2 space-x-2 text-gray-500 dark:text-gray-400">
              {surah.type === "Makki" ? (
                <KaabaIcon className="h-4 w-4 flex-shrink-0" />
              ) : (
                <Book className="h-4 w-4 flex-shrink-0" />
              )}

              <div className="w-1 h-1 bg-gray-400 rounded-full"></div>

              <Book className="h-4 w-4 flex-shrink-0" />
              <span className="text-xs sm:text-sm font-medium">{surah.ayahs}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  ))}
</div>


  {/* Middle - JuzData1 */}
  <div>
  {juzData1.map((juz) => (
    <div
      key={juz.id}
      className="bg-[#EBEEF0] dark:bg-[#323A3F] rounded-xl shadow-sm border-gray-100 overflow-hidden m-4"
    >
      {/* Header */}
      <div className="bg-[#EBEEF0] dark:bg-[#323A3F] dark:text-white px-3 sm:px-4 py-3 flex justify-between items-center">
        <h3 className="text-sm font-medium text-gray-700 dark:text-white">
          {juz.title}
        </h3>
        <button className="text-black hover:text-black text-xs font-medium dark:text-white min-h-[32px] px-2">
          Read Juz
        </button>
      </div>

      {/* Surah List */}
      <div className="p-3 sm:p-4 space-y-2 sm:space-y-3 max-h-[70vh] overflow-y-auto">
        {juz.surahs.map((surah, index) => (
          <div
            key={index}
            className="flex flex-col p-3 sm:p-4 rounded-lg cursor-pointer transition-all duration-200 bg-white dark:bg-black hover:shadow-md min-h-[72px]"
          >
            {/* Top Row: Number + English + Arabic */}
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2 sm:space-x-3 flex-1 min-w-0">
                {/* Star badge for number */}
                <StarNumber
                  number={surah.number}
                  size={34}
                  color="#E5E7EB" // soft gray badge
                  textColor="#000"
                />

                <h4 className="text-sm sm:text-base font-semibold text-gray-900 dark:text-white truncate">
                  {surah.name}
                </h4>
              </div>

              {/* Arabic name */}
              <div className="text-right flex-shrink-0 ml-2">
                <p className="text-lg sm:text-xl font-arabic text-gray-900 dark:text-white leading-tight">
                  {surah.arabicText}
                </p>
              </div>
            </div>

            {/* Bottom Row: icons + ayah count */}
            <div className="flex items-center mt-2 space-x-2 text-gray-500 dark:text-gray-400">
              {/* Type Icon */}
              {surah.type === "Makki" ? (
                <KaabaIcon className="h-4 w-4 flex-shrink-0" />
              ) : (
                <Book className="h-4 w-4 flex-shrink-0" />
              )}

              {/* Separator Dot */}
              <div className="w-1 h-1 bg-gray-400 rounded-full"></div>

              {/* Book Icon */}
              <Book className="h-4 w-4 flex-shrink-0" />

              {/* Ayah Count */}
              <span className="text-xs sm:text-sm font-medium">{surah.ayahs}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  ))}
</div>


  {/* Right side - JuzData2 */}
  <div>
  {juzData2.map((juz) => (
    <div
      key={juz.id}
      className="bg-[#EBEEF0] dark:bg-[#323A3F] rounded-xl shadow-sm border-gray-100 overflow-hidden"
    >
      {/* Header */}
      <div className="bg-[#EBEEF0] dark:bg-[#323A3F] dark:text-white px-3 sm:px-4 py-3 flex justify-between items-center">
        <h3 className="text-sm font-medium text-gray-700 dark:text-white">
          {juz.title}
        </h3>
        <button className="text-black hover:text-black text-xs font-medium dark:text-white min-h-[32px] px-2">
          Read Juz
        </button>
      </div>

      {/* Surah List (full height, no scroll) */}
      <div className="p-3 sm:p-4 space-y-2 sm:space-y-3">
        {juz.surahs.map((surah, index) => (
          <div
            key={index}
            className="flex flex-col p-3 sm:p-4 rounded-lg cursor-pointer transition-all duration-200 bg-white dark:bg-black hover:shadow-md"
          >
            {/* Top Row: Number + English + Arabic */}
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2 sm:space-x-3 flex-1 min-w-0">
                {/* Surah number badge */}
                <div className="w-8 h-8 bg-gray-300 dark:bg-[#323A3F] rounded-full flex items-center justify-center text-gray-700 dark:text-white text-xs sm:text-sm font-medium flex-shrink-0">
                  {surah.number}
                </div>

                <h4 className="text-sm sm:text-base font-semibold text-gray-900 dark:text-white truncate">
                  {surah.name}
                </h4>
              </div>

              {/* Arabic text */}
              <div className="text-right flex-shrink-0 ml-2">
                <p className="text-lg sm:text-xl font-arabic text-gray-900 dark:text-white leading-tight">
                  {surah.arabicText}
                </p>
              </div>
            </div>

            {/* Bottom Row: icons + ayah count */}
            <div className="flex items-center mt-2 space-x-2 text-gray-500 dark:text-gray-400">
              {/* Surah type icon */}
              {surah.type === "Makki" ? (
                <Circle className="h-4 w-4 flex-shrink-0" />
              ) : (
                <Book className="h-4 w-4 flex-shrink-0" />
              )}

              {/* Separator Dot */}
              <div className="w-1 h-1 bg-gray-400 rounded-full"></div>

              {/* Book icon */}
              <Book className="h-4 w-4 flex-shrink-0" />

              {/* Ayah count */}
              <span className="text-xs sm:text-sm font-medium">
                {surah.ayahs}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  ))}
</div>

</div>



        </div>
      </div>
    </>
  );
};

export default Juz;