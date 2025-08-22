import { useState } from "react";
import { Play, Book } from "lucide-react";
import HomepageNavbar from "../components/HomeNavbar";
import HomepageSearch from "../components/HomeSearch";
import { useNavigate, useLocation } from "react-router-dom";
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
      <div className="max-w-6xl mx-auto bg-white min-h-screen">
        {/* Header Tabs */}
        <div className="border-b border-gray-200 ">
        <div className="flex">
      <button
        onClick={() => navigate("/")}
        className={`px-6 py-4 text-sm font-medium border-b-2 transition-colors ${
          location.pathname === "/"
            ? "border-cyan-500 text-cyan-600"
            : "border-transparent text-gray-500 hover:text-gray-700"
        }`}
      >
        Surah
      </button>
      <button
        onClick={() => navigate("/juz")}
        className={`px-6 py-4 text-sm font-medium border-b-2 transition-colors ${
          location.pathname === "/juz"
            ? "border-cyan-500 text-cyan-600"
            : "border-transparent text-gray-500 hover:text-gray-700"
        }`}
      >
        Juz
      </button>
    </div>
        </div>

        {/* Surah Grid */}
        <div className="grid grid-cols-3 gap-4 p-6">
          {surahs.map((surah) => (
            <div
              key={surah.number}
              className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md hover:border-cyan-300 transition-all duration-200 cursor-pointer"
            >
              {/* Top Row: Number and Arabic Name */}
              <div className="flex items-center justify-between mb-4">
                <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
                  <span className="text-base font-semibold text-gray-700">
                    {surah.number}
                  </span>
                </div>
                <div className="text-right" dir="rtl">
                  <h3 className="text-xl font-bold text-gray-800">
                    {surah.arabic}
                  </h3>
                </div>
              </div>

              {/* Bottom Row: English Name and Icons */}
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-1">
                    {surah.name}
                  </h3>
                  {/* Icons and Ayah Count */}
                  <div className="flex items-center space-x-2">
                    {/* Type Icon */}
                    {surah.type === "Makki" ? (
                      <KaabaIcon className="h-4 w-4 text-gray-500" />
                    ) : (
                      <Book className="h-4 w-4 text-gray-500" />
                    )}

                    {/* Separator Dot */}
                    <div className="w-1 h-1 bg-gray-400 rounded-full"></div>

                    {/* Book Icon */}
                    <Book className="h-4 w-4 text-gray-500" />

                    {/* Ayah Count */}
                    <span className="text-sm text-gray-600 font-medium">
                      {surah.ayahs}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default Home;
