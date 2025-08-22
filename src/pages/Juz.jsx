import React from "react";
import HomepageNavbar from "../components/HomeNavbar";
import HomepageSearch from "../components/HomeSearch";
import { useNavigate, useLocation } from "react-router-dom";

const Juz = () => {
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
      id: 2,
      title: "Juz 2",
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
  ];
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <>
      <HomepageNavbar />
      <HomepageSearch />
      <div className="min-h-screen  bg-white p-4">
        <div className="max-w-7xl mx-auto">
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
          <div className="grid grid-cols-3 gap-4">
            {juzData.map((juz) => (
              <div
                key={juz.id}
                className={`bg-white rounded-xl shadow-sm border-gray-100 overflow-hidden`}
              >
                {/* Header */}
                <div className="bg-gray-100 px-4 py-3 flex justify-between items-center border-b">
                  <h3 className="text-sm font-medium text-gray-700">
                    {juz.title}
                  </h3>
                  <button className="text-blue-600 hover:text-blue-800 text-xs font-medium">
                    Read Juz
                  </button>
                </div>

                {/* Surah List */}
                <div className="p-4 space-y-3">
                  {juz.surahs.map((surah, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-3 rounded-lg cursor-pointer transition-all duration-200 hover:bg-blue-50 group"
                    >
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center text-gray-700 text-sm font-medium">
                          {surah.number}
                        </div>
                        <div>
                          <h4 className="text-sm font-medium text-gray-900">
                            {surah.name}
                          </h4>
                          <div className="flex items-center space-x-1 text-xs text-gray-500">
                            {/* Geometric Cube Icon */}
                            <svg
                              className="w-3 h-3 text-gray-400"
                              fill="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path d="M12 2L2 7v10l10 5 10-5V7l-10-5zM12 4.5L19.5 8.5 12 12.5 4.5 8.5 12 4.5zM4 10.5l7 3.5v7l-7-3.5v-7zm16 0v7l-7 3.5v-7l7-3.5z" />
                            </svg>
                            <span>•</span>
                            {/* Book Icon */}
                            <svg
                              className="w-3 h-3 text-gray-400"
                              fill="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path d="M4 6H2v14c0 1.1.9 2 2 2h14v-2H4V6zm16-4H8c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm-1 9H9V9h10v2zm-4 4H9v-2h6v2zm4-8H9V5h10v2z" />
                            </svg>
                            <span>7</span>
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-lg font-arabic text-gray-800">
                          {surah.arabicText}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
};

export default Juz;
