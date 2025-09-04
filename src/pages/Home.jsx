import { useState } from "react";
import { Play, Book,BookOpen } from "lucide-react";
import HomepageNavbar from "../components/HomeNavbar";
import HomepageSearch from "../components/HomeSearch";
import { useNavigate, useLocation } from "react-router-dom";
import StarNumber from "../components/StarNumber";

// Custom Kaaba Icon Component
const KaabaIcon = ({ className }) => (
  <svg
    viewBox="0 0 11 13"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className} // now tailwind can control size
  >
    <path
      d="M1 4.05096L5.50813 6.87531M1 4.05096L5.50813 1.22656L10.0017 4.05096M1 4.05096V5.72135M5.50813 12.2306L1 9.44877V5.72135M5.50813 12.2306L10.0017 9.44877V5.72135M5.50813 12.2306V8.52443M5.50813 6.87531L10.0017 4.05096M5.50813 6.87531V8.52443M10.0017 4.05096V5.72135M10.0017 5.72135L5.50813 8.52443M5.50813 8.52443L1 5.72135"
      stroke="#8A8A8A"
      strokeLinejoin="round"
    />
  </svg>
);
const Mad = ({ className }) => (
<svg width="11" height="15" viewBox="0 0 11 15" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M5.625 1.0498C5.96379 1.0415 6.15318 1.43447 5.9375 1.69434L5.93848 1.69531C5.8059 1.85727 5.73354 2.06001 5.7334 2.26953C5.73364 2.7733 6.13675 3.17749 6.63965 3.17773C6.8485 3.17752 7.05247 3.1038 7.21484 2.9707C7.35907 2.84911 7.5516 2.85714 7.68555 2.94922C7.82703 3.0465 7.89339 3.22605 7.83203 3.42188C7.62359 4.1963 6.95559 4.74982 6.16699 4.82324V4.96973C6.38842 5.29376 6.73956 5.57803 7.17188 5.86035C7.39553 6.00639 7.63673 6.14949 7.88672 6.29688C8.13549 6.44354 8.39372 6.59442 8.64746 6.75391C9.69542 7.41265 10.702 8.26832 10.7217 9.86133C10.7302 10.5552 10.5894 11.4633 9.97949 12.293C10.3948 12.3364 10.7226 12.6925 10.7227 13.1182V13.9834C10.7235 14.202 10.5466 14.3792 10.3281 14.3789V14.3799H1.21582C0.998036 14.379 0.822454 14.2011 0.823242 13.9834V13.1182C0.823351 12.6643 1.19496 12.2891 1.65039 12.2891H8.89941C9.63381 11.6946 9.91674 10.8407 9.93359 9.86035C9.95344 8.7001 9.20568 8.05633 8.22656 7.4209C7.99002 7.26739 7.75176 7.12838 7.51562 6.99219C7.28064 6.85666 7.04583 6.72296 6.82227 6.58398C6.43649 6.34416 6.0728 6.08117 5.77148 5.74121C5.46708 6.08406 5.09223 6.35958 4.7002 6.60547C4.47252 6.74826 4.23591 6.88329 4.00293 7.0166C3.76878 7.15058 3.53754 7.28322 3.31543 7.42285C2.42056 7.98548 1.62622 8.63485 1.61133 9.86523C1.6014 10.6849 1.83171 11.2575 2.07324 11.6484H2.07227C2.13777 11.7504 2.15412 11.8634 2.12402 11.9678C2.0949 12.0686 2.02647 12.1474 1.94727 12.1963C1.86807 12.2451 1.76716 12.2711 1.66406 12.252C1.55623 12.2319 1.46123 12.1657 1.39941 12.0596V12.0586C1.0886 11.5539 0.816533 10.8308 0.823242 9.8623C0.83371 8.36129 1.75222 7.45412 2.89844 6.75293C3.41821 6.43497 3.92281 6.1624 4.37598 5.86426C4.80764 5.58025 5.15748 5.29245 5.37891 4.9668V4.72949C4.62425 4.47414 4.07622 3.76183 4.07617 2.9209C4.07617 2.19418 4.55355 1.26045 5.59473 1.05273L5.61035 1.0498H5.625ZM1.62207 13.0869C1.61745 13.0916 1.61137 13.1013 1.61133 13.1182V13.5908H9.93457V13.1182C9.93452 13.1022 9.92888 13.093 9.92383 13.0879C9.91879 13.0828 9.90931 13.0771 9.89355 13.0771H1.65039C1.63521 13.0771 1.6266 13.0825 1.62207 13.0869ZM4.95801 2.47852C4.89845 2.61488 4.86542 2.76443 4.86523 2.9209L4.87109 3.03613C4.92841 3.60447 5.40474 4.04371 5.98926 4.04395C6.14409 4.04376 6.29155 4.00941 6.42676 3.95117C5.66139 3.85413 5.05306 3.24442 4.95801 2.47852Z" fill="#8A8A8A" stroke="#8A8A8A" stroke-width="0.35469"/>
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
      type: "Makki",
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
      type: "Madani",
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
    { number: 11, arabic: "هود", name: "Hud", ayahs: 123, type: "Madani" },
    { number: 12, arabic: "يوسف", name: "Yusuf", ayahs: 111, type: "Madani" },
    { number: 13, arabic: "الرعد", name: "Ar-Rad", ayahs: 43, type: "Makki" },
    {
      number: 14,
      arabic: "إبراهيم",
      name: "Ibrahim",
      ayahs: 52,
      type: "Madani",
    },
    { number: 15, arabic: "الحجر", name: "Al-Hijr", ayahs: 99, type: "Madani" },
    { number: 16, arabic: "النحل", name: "An-Nahl", ayahs: 128, type: "Makki" },
    {
      number: 17,
      arabic: "الإسراء",
      name: "Al-Isra",
      ayahs: 111,
      type: "Madani",
    },
    { number: 18, arabic: "الكهف", name: "Al-Kahf", ayahs: 110, type: "Madani" },
    { number: 19, arabic: "مريم", name: "Maryam", ayahs: 98, type: "Makki" },
    { number: 20, arabic: "طه", name: "Ta-Ha", ayahs: 135, type: "Madani" },
    {
      number: 21,
      arabic: "الأنبياء",
      name: "Al-Anbiya",
      ayahs: 112,
      type: "Madani",
    },
    { number: 22, arabic: "الحج", name: "Al-Hajj", ayahs: 78, type: "Makki" },
    {
      number: 23,
      arabic: "المؤمنون",
      name: "Al-Muminun",
      ayahs: 118,
      type: "Madani",
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
      type: "Madani",
    },
    { number: 27, arabic: "النمل", name: "An-Naml", ayahs: 93, type: "Madani" },
    { number: 28, arabic: "القصص", name: "Al-Qasas", ayahs: 88, type: "Makki" },
    {
      number: 29,
      arabic: "العنكبوت",
      name: "Al-Ankabut",
      ayahs: 69,
      type: "Madani",
    },
    { number: 30, arabic: "الروم", name: "Ar-Rum", ayahs: 60, type: "Madani" },
  ];

  const navigate = useNavigate();
  const location = useLocation();

  return (
    <>
      {/* <HomepageNavbar /> */}
      <HomepageSearch />
      <div className=" mx-auto bg-white dark:bg-black min-h-screen">
        <div className="w-[1290px] mx-auto ">
          {/* Header Tabs */}
          <div className="border-b border-gray-200 dark:border-gray-700">
            <div className="flex">
              <button
                onClick={() => navigate("/")}
                className={`cursor-pointer px-4 sm:px-6 py-3 sm:py-4 text-sm font-medium border-b-2 transition-colors min-h-[48px] flex items-center ${
                  location.pathname === "/"
                    ? "border-cyan-500 text-cyan-600 dark:text-cyan-400"
                    : "border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
                }`}
              >
                Surah
              </button>
              <button
                onClick={() => navigate("/juz")}
                className={`cursor-pointer px-4 sm:px-6 py-3 sm:py-4 text-sm font-medium border-b-2 transition-colors min-h-[48px] flex items-center ${
                  location.pathname === "/juz"
                    ? "border-cyan-500 text-cyan-600 dark:text-cyan-400"
                    : "border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
                }`}
              >
                Juz
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 p-2">
  {surahs.map((surah) => (
    <div
      key={surah.number}
      className="w-full max-w-[421px] h-[81px] bg-white dark:bg-black border border-gray-200 dark:border-gray-700
                 rounded-xl px-4 hover:shadow-md transition-all duration-200 cursor-pointer mx-auto
                 flex items-center"
    >
      {/* Left: number + name + small meta */}
      <div className="flex items-center gap-3 min-w-0">
        <StarNumber
          number={surah.number}
          // size={45}
          color="#E5E7EB"
          textColor="#000"
        />

        {/* Name + meta column */}
        <div className="flex flex-col justify-center min-w-0">
          <h3 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-white truncate">
            {surah.name}
          </h3>

          <div className="flex items-center gap-3 text-gray-500 dark:text-gray-400 text-sm mt-1">
            {surah.type === "Makki" ? (
              <KaabaIcon className="h-4 w-4 flex-shrink-0" />
            ) : (
              <Mad className="h-4 w-4 flex-shrink-0" />
            )}
            <div className="w-1 h-1 bg-gray-400 rounded-full" />
            <BookOpen className="h-4 w-4 flex-shrink-0" />
            <span className="font-medium">{surah.ayahs}</span>
          </div>
        </div>
      </div>

      {/* Right: Arabic title */}
      <div className="ml-auto text-right" dir="rtl">
        <h3 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white">
          {surah.arabic}
        </h3>
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