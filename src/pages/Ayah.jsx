import React, { useState, useEffect } from "react";
import { ChevronRight, ChevronLeft } from "lucide-react";
import { useParams } from "react-router-dom";
import AyathNavbar from "../components/AyathNavbar";

const Ayah = () => {
  const { ayahNumber } = useParams();
  const [currentAyahIndex, setCurrentAyahIndex] = useState(0);

  const ayahs = [
    {
      number: 1,
      arabic: "الم",
      transliteration: "Alif, Lam, Mim.",
      translation:
        "The names of letters of the Arabic alphabet, called huruf muqatta'at, occur at the beginning of several surahs of the Qur'an. At the time of the Qur'anic revelation the use of such letters was a well-known literary device, used by both poets and orators, and we find several instances in the pre-Islamic Arabic literature that has come down to us. Since the muqatta'at were commonly used the Arabs of that period generally knew what they meant and so they did not present a puzzle. We do not notice, therefore, any contemporaries of the Prophet (peace be on him) raising objections against the Qur'an on the ground that the letters at the beginning of some of its surahs were absurd. For the same reason no Tradition has come down to us of any Companion asking the Prophet about the significance of the muqatta'at. Later on this literary device gradually fell into disuse and hence it became difficult for commentators to determine their precise meanings. It is obvious, however, that deriving right guidance from the Qur'an does not depend on grasping the meaning of these vocables, and that anyone who fails to understand them may still live a righteous life and attain salvation. The ordinary reader, therefore, need not delve too deeply into this matter.",
    },
    {
      number: 2,
      arabic: "ذَٰلِكَ الْكِتَابُ لَا رَيْبَ ۛ فِيهِ ۛ هُدًى لِّلْمُتَّقِينَ",
      transliteration: "Dhālika al-kitābu lā rayba fīhi hudal lil-muttaqīn",
      translation:
        "This is the Book of Allah, there is no doubt in it; One obvious meaning of this verse is that this Book, the Qur'an, is undoubtedly from God. Another possible meaning is that nothing contained in it can be subject to doubt. Books which deal with supernatural questions, with matters that lie beyond the range of sense perception, are invariably based on conjecture and their authors, despite their brave show of competence, are therefore not immune from a degree of scepticism regarding their statements. This Book, which is based wholly on Truth, a book which is the work of none other than the All-Knowing God Himself is distinguishable from all other books. Hence, there is no room for doubt about its contents despite the hesitation some people might express either through ignorance or folly.",
    },
  ];

  // Set initial ayah based on URL parameter
  useEffect(() => {
    if (ayahNumber) {
      const ayahIndex = ayahs.findIndex(
        (ayah) => ayah.number === parseInt(ayahNumber)
      );
      
      if (ayahIndex !== -1) {
        setCurrentAyahIndex(ayahIndex);
      }
    }
  }, [ayahNumber]);

  const currentAyah = ayahs[currentAyahIndex];

  const handleNextAyah = () => {
    if (currentAyahIndex < ayahs.length - 1) {
      setCurrentAyahIndex(currentAyahIndex + 1);
    }
  };

  const handlePreviousAyah = () => {
    if (currentAyahIndex > 0) {
      setCurrentAyahIndex(currentAyahIndex - 1);
    }
  };
  return (
    /* Modal Backdrop */
    <div className="fixed inset-0 flex items-center justify-center z-50 p-4 bg-gray-500/70 dark:bg-black/70">

      {/* Modal Container */}
      <div className="bg-white dark:bg-[#2A2C38] rounded-lg shadow-xl w-[1073px]  h-[90vh] overflow-hidden ">
        <AyathNavbar />

        {/* Main Content Container */}
        <div className="px-6 py-6 overflow-y-auto max-h-[calc(90vh-120px)] ">
          {/* <div className=" mb-6"></div> */}

          {/* Arabic Text */}
          <div className="text-right mb-6 border-b border-gray-200">
            <h1 className="text-3xl font-arabic dark:text-white text-gray-900 leading-loose">
              {currentAyah.arabic}
            </h1>
          </div>

          {/* Transliteration */}
          <div className="mb-6">
            <h2 className="text-lg font-medium text-gray-700 dark:text-white leading-relaxed">
              {currentAyah.transliteration}
            </h2>
          </div>

          {/* Translation Text */}
          <div className="mb-8">
            <p className="text-gray-700 leading-[1.7] dark:text-white text-sm">
              {currentAyah.translation}
            </p>
          </div>

          {/* Navigation Buttons */}
          <div className="flex justify-between pt-4">
            <button
              onClick={handlePreviousAyah}
              disabled={currentAyahIndex === 0}
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg border transition-colors group ${
                currentAyahIndex === 0
                  ? "text-gray-400 dark:text-white cursor-not-allowed"
                  : "text-gray-600 dark:text-white hover:text-gray-800 hover:bg-gray-50"
              }`}
            >
              <ChevronLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
              <span className="text-sm font-medium">Previous Ayah</span>
            </button>

            <button
              onClick={handleNextAyah}
              disabled={currentAyahIndex === ayahs.length - 1}
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg border transition-colors group ${
                currentAyahIndex === ayahs.length - 1
                  ? "text-gray-400  cursor-not-allowed"
                  : "text-gray-600 dark:text-white hover:text-gray-800 hover:bg-gray-50"
              }`}
            >
              <span className="text-sm font-medium">Next Ayah</span>
              <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Ayah;
