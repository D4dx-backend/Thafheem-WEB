import { useState } from "react";
import { Play, Book } from "lucide-react";
import HomepageNavbar from "../components/HomeNavbar";
import HomepageSearch from "../components/HomeSearch";
import { useNavigate, useLocation } from "react-router-dom";
import StarNumber from "../components/StarNumber";

// Custom Kaaba Icon Component
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

const Home = () => {
  const [activeTab, setActiveTab] = useState("Quran");

  // Sample Surah data - in a real app, this would come from an API
  const surahs = [
    {
      number: 1,
      arabic: "الفاتحة",
      name: "Al-Fatihah",
      ayahs: 7,
      type: "Makki",
    },
    {
      number: 2,
      arabic: "البقرة",
      name: "Al-Baqarah",
      ayahs: 286,
      type: "Madani",
    },
    {
      number: 3,
      arabic: "آل عمران",
      name: "Al-Imran",
      ayahs: 200,
      type: "Madani",
    },
    {
      number: 4,
      arabic: "النساء",
      name: "An-Nisa",
      ayahs: 176,
      type: "Madani",
    },
    {
      number: 5,
      arabic: "المائدة",
      name: "Al-Maidah",
      ayahs: 120,
      type: "Madani",
    },
    {
      number: 6,
      arabic: "الأنعام",
      name: "Al-Anam",
      ayahs: 165,
      type: "Makki",
    },
    {
      number: 7,
      arabic: "الأعراف",
      name: "Al-Araf",
      ayahs: 206,
      type: "Makki",
    },
    {
      number: 8,
      arabic: "الأنفال",
      name: "Al-Anfal",
      ayahs: 75,
      type: "Madani",
    },
    {
      number: 9,
      arabic: "التوبة",
      name: "At-Tawbah",
      ayahs: 129,
      type: "Madani",
    },
    { number: 10, arabic: "يونس", name: "Yunus", ayahs: 109, type: "Makki" },
    { number: 11, arabic: "هود", name: "Hud", ayahs: 123, type: "Makki" },
    { number: 12, arabic: "يوسف", name: "Yusuf", ayahs: 111, type: "Makki" },
    { number: 13, arabic: "الرعد", name: "Ar-Rad", ayahs: 43, type: "Madani" },
    {
      number: 14,
      arabic: "إبراهيم",
      name: "Ibrahim",
      ayahs: 52,
      type: "Makki",
    },
    { number: 15, arabic: "الحجر", name: "Al-Hijr", ayahs: 99, type: "Makki" },
    { number: 16, arabic: "النحل", name: "An-Nahl", ayahs: 128, type: "Makki" },
    {
      number: 17,
      arabic: "الإسراء",
      name: "Al-Isra",
      ayahs: 111,
      type: "Makki",
    },
    { number: 18, arabic: "الكهف", name: "Al-Kahf", ayahs: 110, type: "Makki" },
    { number: 19, arabic: "مريم", name: "Maryam", ayahs: 98, type: "Makki" },
    { number: 20, arabic: "طه", name: "Ta-Ha", ayahs: 135, type: "Makki" },
    {
      number: 21,
      arabic: "الأنبياء",
      name: "Al-Anbiya",
      ayahs: 112,
      type: "Makki",
    },
    { number: 22, arabic: "الحج", name: "Al-Hajj", ayahs: 78, type: "Madani" },
    {
      number: 23,
      arabic: "المؤمنون",
      name: "Al-Muminun",
      ayahs: 118,
      type: "Makki",
    },
    { number: 24, arabic: "النور", name: "An-Nur", ayahs: 64, type: "Madani" },
    {
      number: 25,
      arabic: "الفرقان",
      name: "Al-Furqan",
      ayahs: 77,
      type: "Makki",
    },
    {
      number: 26,
      arabic: "الشعراء",
      name: "Ash-Shuara",
      ayahs: 227,
      type: "Makki",
    },
    { number: 27, arabic: "النمل", name: "An-Naml", ayahs: 93, type: "Makki" },
    { number: 28, arabic: "القصص", name: "Al-Qasas", ayahs: 88, type: "Makki" },
    {
      number: 29,
      arabic: "العنكبوت",
      name: "Al-Ankabut",
      ayahs: 69,
      type: "Makki",
    },
    { number: 30, arabic: "الروم", name: "Ar-Rum", ayahs: 60, type: "Makki" },
  ];

  const navigate = useNavigate();
  const location = useLocation();

  return (
    <>
      {/* <HomepageNavbar /> */}
      <HomepageSearch />
      <div className="w-full mx-auto bg-white dark:bg-black min-h-screen">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
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

          {/* Surah Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 p-4 sm:p-6">
  {surahs.map((surah) => (
    <div
      key={surah.number}
      className="bg-white dark:bg-black border border-gray-200 dark:border-gray-700 rounded-xl p-4 hover:shadow-md transition-all duration-200 cursor-pointer"
    >
      {/* Top Row */}
      <div className="flex items-center justify-between">
        {/* Star Number */}
        <div className="flex items-center">
          <StarNumber
            number={surah.number}
            size={36}
            color="#E5E7EB" // soft gray like screenshot
            textColor="#000"
          />
          <h3 className="ml-3 text-base sm:text-lg font-semibold text-gray-900 dark:text-white truncate">
            {surah.name}
          </h3>
        </div>

        {/* Arabic name */}
        <div className="text-right" dir="rtl">
          <h3 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white">
            {surah.arabic}
          </h3>
        </div>
      </div>

      {/* Bottom Row */}
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
        <span className="text-sm font-medium">{surah.ayahs}</span>
      </div>
    </div>
  ))}
</div>

        </div>
      </div>
    </>
  );
};

export default Home;